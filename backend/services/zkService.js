const snarkjs = require('snarkjs');
const db = require('../config/firebase');

// 証明生成
exports.generateProof = async (userId, input) => {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    { in: input },
    "build/example_js/example.wasm",
    "build/circuit_final.zkey"
  );

  // Firestore に保存
  await db.collection('zk_proofs').add({
    userId,
    input,
    publicSignals,
    proof,
    createdAt: new Date().toISOString(),
  });

  return { proof, publicSignals };
};

// 証明検証
exports.verifyProof = async (userId, proof, publicSignals) => {
  const vKey = require('../build/verification_key.json');
  const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  // Firestore に検証結果を保存
  await db.collection('zk_proofs').add({
    userId,
    proof,
    publicSignals,
    verified,
    verifiedAt: new Date().toISOString(),
  });

  return { verified };
};