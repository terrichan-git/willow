// Seed the demo "Mom" EstateProfile to match DEMO_SCRIPT.md.
// Run: node --env-file=.env.local scripts/seed-mom.mjs
//
// estateId == userId == "mom-demo". Margaret Chen (SG resident); daughter Sarah in
// New York; cross-border estate: CPF + DBS (SG, clean) + a US brokerage holding
// US-situs shares (triggers the SG->US tax beat). AIA life policy. Warm everyday voice.

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
    dob: "1959-07-21",
    jurisdiction: "Singapore",
    residence: "Singapore",
    familyMembers: [
      {
        name: "Sarah",
        relationship: "daughter",
        nickname: "sayang",
        location: "New York, USA",
        heirJurisdiction: "United States",
        notes: "Only child. Moved to NYC for work. Primary heir and executor.",
      },
    ],
    executor: "Sarah",
  },
  financialAccounts: [
    { institution: "CPF", type: "retirement", situs: "Singapore", accountRef: "NRIC-linked", notes: "Nomination on file names Sarah as sole beneficiary. Passes outside probate; no SG inheritance tax." },
    { institution: "DBS Bank", type: "savings", situs: "Singapore", accountRef: "ending 4471", notes: "Main household account in SGD. Singapore-situs; passes cleanly to Sarah." },
    { institution: "Interactive Brokers (US)", type: "brokerage", situs: "United States", accountRef: "ending 8830", notes: "Holds US-listed shares (Apple, Microsoft) — US-SITUS assets. Subject to US non-resident estate tax above ~US$60,000 exemption. This is the cross-border issue Sarah will face." },
  ],
  insurancePolicies: [
    {
      provider: "AIA",
      type: "life insurance",
      policyNumber: "AIA-SG-77231",
      sumAssured: "SGD 300,000",
      beneficiaries: "Sarah",
      situs: "Singapore",
      notes: "Claim hotline 1800 248 8000. File within 6 months. Policy doc in the blue folder, top drawer of the study desk.",
    },
  ],
  wishes: {
    message:
      "Sarah, sayang — please don't be sad for too long. I had such a good life because of you. Eat properly, call your friends, and don't work so late. Put fresh flowers on the table on Sundays, the way I used to, and think of me when you do.",
    funeral: "Simple Buddhist service, white lilies. Donations to the SPCA instead of wreaths.",
    documentsLocation: "Will, CPF nomination, AIA policy and the brokerage statements are all in the blue folder, top drawer of the study desk. Spare keys with Auntie Lin next door.",
  },
  personalityContext:
    "Margaret is warm, gently funny, and endlessly caring. She calls Sarah 'sayang' and always asks 'Have you eaten?' before anything else. Singaporean cadence — an affectionate 'aiyoh', the occasional 'lah'. She knows Sarah's world: the packed East-West MRT line, working too late. Common phrases: 'Don't worry so much, my love', 'The bad days are lighter when you say them out loud — you taught me that.' She leads with feelings first, then practical help, and softens hard news with warmth. She was a primary-school teacher for 30 years: patient, reassuring, believes family is everything.",
  voiceCloneId: process.env.ELEVENLABS_VOICE_ID || "XrExE9yKIg1WjnnlVkGX",
  status: "activated",
  plan: "full",
  updatedAt: new Date().toISOString(),
};

await ddb.send(new PutCommand({ TableName: TABLE, Item: profile }));
console.log(`Seeded -> ${TABLE}: ${profile.personalInfo.name} (estateId "mom-demo"), heir Sarah in New York, US brokerage situs for the cross-border beat.`);
