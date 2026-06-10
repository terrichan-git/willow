#!/usr/bin/env bash
# Willow — provision + deploy the Institution Researcher agent on AWS.
# Idempotent: safe to re-run. Requires AWS creds in the environment / ~/.aws.
#
# Usage:
#   EXA_API_KEY=xxx BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-6-... ./aws/scripts/deploy.sh
set -euo pipefail

REGION="${AWS_REGION:-us-west-2}"
ROLE_NAME="willow-institutionResearcher-role"
FN_NAME="institutionResearcher"
TASKS_TABLE="willow-Tasks"
BEDROCK_MODEL_ID="${BEDROCK_MODEL_ID:-us.anthropic.claude-sonnet-4-6-20250930-v1:0}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # -> aws/

: "${EXA_API_KEY:?Set EXA_API_KEY in the environment before deploying}"

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
S3_BUCKET="willow-assets-${ACCOUNT_ID}-${REGION}"
echo "Account ${ACCOUNT_ID} | region ${REGION}"

# ---- DynamoDB tables (per docs/PROJECT_SPEC.md) ----------------------------
create_table() {
  local name="$1"; shift
  if aws dynamodb describe-table --table-name "$name" --region "$REGION" >/dev/null 2>&1; then
    echo "DynamoDB $name exists"; return
  fi
  echo "Creating DynamoDB $name ..."
  aws dynamodb create-table --table-name "$name" --billing-mode PAY_PER_REQUEST --region "$REGION" "$@" >/dev/null
  aws dynamodb wait table-exists --table-name "$name" --region "$REGION"
}

create_table willow-Users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH

create_table willow-EstateProfiles \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=sk,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=sk,KeyType=RANGE

create_table willow-Tasks \
  --attribute-definitions AttributeName=estateId,AttributeType=S AttributeName=taskId,AttributeType=S \
  --key-schema AttributeName=estateId,KeyType=HASH AttributeName=taskId,KeyType=RANGE

create_table willow-Conversations \
  --attribute-definitions AttributeName=estateId,AttributeType=S AttributeName=ts,AttributeType=S \
  --key-schema AttributeName=estateId,KeyType=HASH AttributeName=ts,KeyType=RANGE

# ---- S3 bucket (voice/doc uploads, later phases) ---------------------------
if aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
  echo "S3 $S3_BUCKET exists"
else
  echo "Creating S3 $S3_BUCKET ..."
  aws s3api create-bucket --bucket "$S3_BUCKET" --region "$REGION" \
    --create-bucket-configuration LocationConstraint="$REGION" >/dev/null
  aws s3api put-public-access-block --bucket "$S3_BUCKET" \
    --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
fi

# ---- IAM role --------------------------------------------------------------
if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  echo "IAM role $ROLE_NAME exists"
else
  echo "Creating IAM role $ROLE_NAME ..."
  aws iam create-role --role-name "$ROLE_NAME" \
    --assume-role-policy-document "file://${HERE}/iam/lambda-trust-policy.json" >/dev/null
fi
aws iam put-role-policy --role-name "$ROLE_NAME" \
  --policy-name institutionResearcher-policy \
  --policy-document "file://${HERE}/iam/institutionResearcher-policy.json"
ROLE_ARN="$(aws iam get-role --role-name "$ROLE_NAME" --query Role.Arn --output text)"
echo "Role ARN: $ROLE_ARN"

# ---- Package + deploy Lambda ----------------------------------------------
BUILD="$(mktemp -d)"
cp "${HERE}/agents/institutionResearcher/index.mjs" "$BUILD/"
( cd "$BUILD" && zip -q function.zip index.mjs )

ENV_VARS="Variables={EXA_API_KEY=${EXA_API_KEY},BEDROCK_MODEL_ID=${BEDROCK_MODEL_ID},TASKS_TABLE=${TASKS_TABLE}}"

if aws lambda get-function --function-name "$FN_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "Updating Lambda $FN_NAME ..."
  aws lambda update-function-code --function-name "$FN_NAME" \
    --zip-file "fileb://${BUILD}/function.zip" --region "$REGION" >/dev/null
  aws lambda wait function-updated --function-name "$FN_NAME" --region "$REGION"
  aws lambda update-function-configuration --function-name "$FN_NAME" \
    --timeout 60 --memory-size 512 --environment "$ENV_VARS" --region "$REGION" >/dev/null
else
  echo "Creating Lambda $FN_NAME ..."
  aws lambda create-function --function-name "$FN_NAME" \
    --runtime nodejs20.x --handler index.handler --role "$ROLE_ARN" \
    --zip-file "fileb://${BUILD}/function.zip" \
    --timeout 60 --memory-size 512 --environment "$ENV_VARS" --region "$REGION" >/dev/null
  aws lambda wait function-active --function-name "$FN_NAME" --region "$REGION"
fi

# ---- Function URL (public, for the Next.js route) --------------------------
if ! aws lambda get-function-url-config --function-name "$FN_NAME" --region "$REGION" >/dev/null 2>&1; then
  aws lambda create-function-url-config --function-name "$FN_NAME" \
    --auth-type NONE --region "$REGION" \
    --cors '{"AllowOrigins":["*"],"AllowMethods":["POST"],"AllowHeaders":["content-type"]}' >/dev/null
  aws lambda add-permission --function-name "$FN_NAME" \
    --statement-id FunctionURLAllowPublicAccess --action lambda:InvokeFunctionUrl \
    --principal "*" --function-url-auth-type NONE --region "$REGION" >/dev/null || true
fi
FN_URL="$(aws lambda get-function-url-config --function-name "$FN_NAME" --region "$REGION" --query FunctionUrl --output text)"

echo ""
echo "✅ Deployed."
echo "Function URL: $FN_URL"
echo "S3 bucket:    $S3_BUCKET"
