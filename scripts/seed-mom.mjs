// Seed a demo "Mom" EstateProfile so the Companion references real specifics.
// Run: node --env-file=.env.local scripts/seed-mom.mjs
//
// estateId == userId == "mom-demo" (the Companion loads by estateId).

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const TABLE = process.env.ESTATE_TABLE || "willow-EstateProfiles";
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

const profile = {
  userId: "mom-demo",
  sk: "profile",
  personalInfo: {
    name: "Margaret Chen",
    preferredName: "Mom",
    dob: "1958-03-12",
    jurisdiction: "Singapore",
    familyMembers: [
      { name: "Terri", relationship: "daughter", nickname: "my little sparrow" },
      { name: "Daniel", relationship: "son", nickname: "Danny boy" },
    ],
    executor: "Terri",
  },
  financialAccounts: [
    { institution: "DBS Bank", type: "savings", accountRef: "ending 4471", notes: "Joint account with Daniel; main household account." },
    { institution: "OCBC", type: "fixed deposit", accountRef: "ending 9920", notes: "Matures Dec 2026." },
    { institution: "CPF", type: "retirement", accountRef: "NRIC-linked", notes: "Nomination on file lists Terri and Daniel 50/50." },
  ],
  insurancePolicies: [
    {
      provider: "Prudential",
      type: "life insurance",
      policyNumber: "PRU-SG-88245",
      sumAssured: "SGD 250,000",
      beneficiaries: "Terri and Daniel",
      notes: "Claim hotline 1800 333 0333. File within 6 months. Policy doc in the blue folder in the study drawer.",
    },
  ],
  wishes: {
    message:
      "Tell Terri and Danny I love them more than all the stars. Don't fight over money — it was never the point. Take care of each other, and put fresh flowers on the table on Sundays like I used to.",
    funeral: "Simple Buddhist service, no fuss. White lilies. Donations to the SPCA instead of wreaths.",
    documentsLocation: "Will and policies are in the blue folder, top drawer of the study desk. Spare keys with Auntie Lin.",
  },
  personalityContext:
    "Margaret is warm, gently funny, and a little bossy in a loving way. She calls Terri 'my little sparrow' and Daniel 'Danny boy'. Common phrases: 'Aiyoh', 'Have you eaten?', 'Don't worry so much, my love.' She always leads with feelings before practical matters, and softens hard news with humor. She was a primary school teacher for 30 years, deeply patient, and believes family is everything. She tends to say 'okay?' at the end of reassurances.",
  voiceCloneId: process.env.ELEVENLABS_VOICE_ID || "XrExE9yKIg1WjnnlVkGX",
  status: "activated",
  plan: "full",
  updatedAt: new Date().toISOString(),
};

await ddb.send(new PutCommand({ TableName: TABLE, Item: profile }));
console.log(`Seeded demo profile -> ${TABLE} (estateId/userId = "mom-demo", name = "${profile.personalInfo.name}")`);
