const express = require('express');
const { generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const base64url = require('base64url');

const router = express.Router();

// Example credential (replace with real credential from registration)
const exampleCredential = {
  credentialID: Buffer.from('dGVzdC1jcmVkZW50aWFsLWlk', 'base64url'), // Example, replace with real
  publicKey: '...', // Replace with real public key
  counter: 0,
  transports: ['internal'],
};

const users = {
  'user@example.com': {
    id: 'user-id',
    credentials: [exampleCredential],
  },
};
const loggedInUserId = 'user@example.com'; // Replace with real session/user logic

// Store challenge per user for verification
const userChallenges = {};

// Generate authentication options
router.get('/generate-authentication-options', (req, res) => {
  const user = users[loggedInUserId];
  if (!user) return res.status(400).json({ error: 'User not found' });

  const options = generateAuthenticationOptions({
    allowCredentials: user.credentials.map(cred => ({
      id: cred.credentialID,
      type: 'public-key',
      transports: cred.transports,
    })),
    userVerification: 'preferred',
  });

  // Store challenge for verification
  userChallenges[loggedInUserId] = options.challenge;

  res.json(options);
});

// Verify authentication response
router.post('/verify-authentication', express.json(), async (req, res) => {
  const body = req.body;
  const user = users[loggedInUserId];
  if (!user) return res.status(400).json({ error: 'User not found' });

  const expectedChallenge = userChallenges[loggedInUserId];

  let dbAuthenticator;
  const credentialID = base64url.toBuffer(body.rawId);
  for (const dev of user.credentials) {
    if (Buffer.compare(dev.credentialID, credentialID) === 0) {
      dbAuthenticator = dev;
      break;
    }
  }
  if (!dbAuthenticator) return res.json({ verified: false });

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: 'http://localhost:3000', // Change to your frontend origin
      expectedRPID: 'localhost', // Change to your RPID
      authenticator: dbAuthenticator,
    });
  } catch (error) {
    return res.json({ verified: false, error: error.message });
  }

  if (verification.verified) {
    // Optionally update authenticator counter here
    dbAuthenticator.counter = verification.authenticationInfo.newCounter;
  }

  res.json({ verified: verification.verified });
});

module.exports = router;