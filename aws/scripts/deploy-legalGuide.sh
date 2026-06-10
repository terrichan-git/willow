#!/usr/bin/env bash
# Deploy the Legal Guide Lambda. Reuses the institutionResearcher IAM role
# (already grants Bedrock invoke + logs). Idempotent. Bedrock runs in us-east-1.
#
# Usage:  EXA_API_KEY=xxx ./aws/scripts/deploy-legalGuide.sh
set -euo pipefail

REGION="${AWS_REGION:-us-west-2}"           # Lambda region (DynamoDB region)
BEDROCK_REGION="${BEDROCK_REGION:-us-east-1}"
MODEL_ID="${BEDROCK_MODEL_ID:-us.anthropic.claude-sonnet-4-6}"
FN_NAME="legalGuide"
ROLE_NAME="willow-institutionResearcher-role"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

: "${EXA_API_KEY:?Set EXA_API_KEY before deploying}"
ROLE_ARN="$(aws iam get-role --role-name "$ROLE_NAME" --query Role.Arn --output text)"

BUILD="$(mktemp -d)"
cp "${HERE}/agents/legalGuide/index.mjs" "$BUILD/"
( cd "$BUILD" && zip -q function.zip index.mjs )

ENV_VARS="Variables={EXA_API_KEY=${EXA_API_KEY},BEDROCK_MODEL_ID=${MODEL_ID},BEDROCK_REGION=${BEDROCK_REGION}}"

if aws lambda get-function --function-name "$FN_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "Updating Lambda $FN_NAME ..."
  aws lambda update-function-code --function-name "$FN_NAME" --zip-file "fileb://${BUILD}/function.zip" --region "$REGION" >/dev/null
  aws lambda wait function-updated --function-name "$FN_NAME" --region "$REGION"
  aws lambda update-function-configuration --function-name "$FN_NAME" --timeout 90 --memory-size 512 --environment "$ENV_VARS" --region "$REGION" >/dev/null
else
  echo "Creating Lambda $FN_NAME ..."
  aws lambda create-function --function-name "$FN_NAME" \
    --runtime nodejs20.x --handler index.handler --role "$ROLE_ARN" \
    --zip-file "fileb://${BUILD}/function.zip" \
    --timeout 90 --memory-size 512 --environment "$ENV_VARS" --region "$REGION" >/dev/null
  aws lambda wait function-active --function-name "$FN_NAME" --region "$REGION"
fi

echo "✅ Deployed $FN_NAME (Lambda in $REGION, Bedrock in $BEDROCK_REGION)"
