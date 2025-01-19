const express = require('express');
const zkService = require('../services/zkService');
const router = express.Router();

// 証明生成
router.post('/prove', async (req, res) => {
  const { userId, input } = req.body;
  try {
    const result = await zkService.generateProof(userId, input);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 証明検証
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