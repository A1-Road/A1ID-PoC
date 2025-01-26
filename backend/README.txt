Directory Structure

backend/
├── config/                 # Configuration files
│   ├── firebase.js         # Firestore configuration
├── routes/                 # API routes
│   ├── zk.js               # Routes related to ZK proofs
├── services/               # Business logic and services
│   ├── zkService.js        # ZK proof logic
├── circuits/               # Circom circuit files
│   └── example.circom      # Example circuit
├── scripts/                # Scripts and utilities
│   └── compile.sh          # Circuit compilation script
├── build/                  # Compilation outputs
│   ├── example_js/         # WASM files from Circom
│   └── verification_key.json # Verification key
├── firebase-key.json       # Firebase service account key (excluded from Git)
├── app.js                  # Entry point for the Express app
├── package.json            # Dependency management
└── .gitignore              # Git exclusion rules

File Contents

1. backend/config/firebase.js

Firestore configuration file:

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json'); // Firebase service account key

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com",
});

// Export Firestore instance
const db = admin.firestore();
module.exports = db;

2. backend/routes/zk.js

API routes for ZK proofs:

const express = require('express');
const zkService = require('../services/zkService');
const router = express.Router();

// Proof generation route
router.post('/prove', async (req, res) => {
  const { userId, input } = req.body;
  try {
    const result = await zkService.generateProof(userId, input);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proof verification route
router.post('/verify', async (req, res) => {
  const { proof, publicSignals, userId } = req.body;
  try {
    const result = await zkService.verifyProof(userId, proof, publicSignals);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

3. backend/services/zkService.js

Logic for ZK proof generation and verification:

const snarkjs = require('snarkjs');
const db = require('../config/firebase');

// Generate a ZK proof
exports.generateProof = async (userId, input) => {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { in: input },
    "build/example_js/example.wasm",
    "build/circuit_final.zkey"
  );

  // Save to Firestore
  await db.collection('zk_proofs').add({
    userId,
    input,
    publicSignals,
    proof,
    createdAt: new Date().toISOString(),
  });

  return { proof, publicSignals };
};

// Verify a ZK proof
exports.verifyProof = async (userId, proof, publicSignals) => {
  const vKey = require('../build/verification_key.json');
  const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  // Save verification result to Firestore
  await db.collection('zk_proofs').add({
    userId,
    proof,
    publicSignals,
    verified,
    verifiedAt: new Date().toISOString(),
  });

  return { verified };
};

4. backend/circuits/example.circom

Sample Circom circuit:

pragma circom 2.0.0;
include "node_modules/circomlib/circuits/poseidon.circom";

template PoseidonHasher() {
    signal input in;
    signal output out;
    
    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== in;
    out <== poseidon.out;
}

component main = PoseidonHasher();

5. backend/scripts/compile.sh

Script to compile Circom circuits:

#!/bin/bash

# Compile Circom circuit
circom circuits/example.circom --wasm --r1cs -o build

# Trusted setup
snarkjs groth16 setup build/example.r1cs powersOfTau28_hez_final_12.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey build/circuit_final.zkey

# Export verification key
snarkjs zkey export verificationkey build/circuit_final.zkey build/verification_key.json

To execute:

chmod +x scripts/compile.sh
./scripts/compile.sh

6. backend/app.js

Express app entry point:

const express = require('express');
const zkRoutes = require('./routes/zk');
const app = express();

app.use(express.json());
app.use('/api/zk', zkRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

7. .gitignore

Files to exclude from Git:

/node_modules
/build
/firebase-key.json
.env

Next Steps
	1.	Set up the backend directory based on this structure:
	•	Add files incrementally and test functionality.
	2.	Verify circuit compilation:
	•	Run scripts/compile.sh and confirm successful output.
	3.	Test Firestore integration with the backend:
	•	Call the API and check that data is saved to the zk_proofs collection in Firestore.
