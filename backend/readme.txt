以下は、GitHub プロジェクト内の `backend` ディレクトリで **Firestore** を活用しながら **ZK 証明の PoC** を構築するための推奨ファイル構造です。これを基に具体的なディレクトリ構成とファイル内容を整理しました。

---

## **ディレクトリ構造**

```
backend/
├── config/                 # 設定ファイルを格納
│   ├── firebase.js         # Firestore 設定
├── routes/                 # ルーティング
│   ├── zk.js               # ZK 証明に関するルート
├── services/               # ロジックやサービス処理
│   ├── zkService.js        # ZK 証明ロジック
├── circuits/               # Circom 回路ファイル
│   └── example.circom      # サンプル回路
├── scripts/                # スクリプトやユーティリティ
│   └── compile.sh          # 回路コンパイルスクリプト
├── build/                  # コンパイル後の成果物
│   ├── example_js/         # Circom の WASM ファイルなど
│   └── verification_key.json # 検証キー
├── firebase-key.json       # Firebase サービスアカウントキー (Git 除外)
├── app.js                  # Express アプリのエントリポイント
├── package.json            # 依存関係管理
└── .gitignore              # 不要ファイルの除外設定
```

---

## **ファイル内容**

### **1. `backend/config/firebase.js`**
Firestore 設定ファイル:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json'); // Firebase サービスアカウントキー

// Firebase 初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com",
});

// Firestore インスタンスをエクスポート
const db = admin.firestore();
module.exports = db;
```

---

### **2. `backend/routes/zk.js`**
ZK 証明に関する API ルート:

```javascript
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
```

---

### **3. `backend/services/zkService.js`**
ZK 証明生成および検証ロジック:

```javascript
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
```

---

### **4. `backend/circuits/example.circom`**
Circom のサンプル回路:

```circom
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
```

---

### **5. `backend/scripts/compile.sh`**
回路のコンパイルスクリプト:

```bash
#!/bin/bash

# Circom のコンパイル
circom circuits/example.circom --wasm --r1cs -o build

# Trusted Setup
snarkjs groth16 setup build/example.r1cs powersOfTau28_hez_final_12.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey build/circuit_final.zkey

# 検証キーのエクスポート
snarkjs zkey export verificationkey build/circuit_final.zkey build/verification_key.json
```

実行方法:
```bash
chmod +x scripts/compile.sh
./scripts/compile.sh
```

---

### **6. `backend/app.js`**
Express アプリのエントリポイント:

```javascript
const express = require('express');
const zkRoutes = require('./routes/zk');
const app = express();

app.use(express.json());
app.use('/api/zk', zkRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### **7. `.gitignore`**
不要なファイルを Git 管理から除外:

```plaintext
/node_modules
/build
/firebase-key.json
.env
```

---

## **次のステップ**
1. **この構成を基に `backend` ディレクトリをセットアップ**:
   - 必要なファイルを順次追加し、動作確認。
2. **回路コンパイルの確認**:
   - `scripts/compile.sh` を実行し、正常に成果物が生成されることを確認。
3. **Firestore とバックエンドの連携テスト**:
   - API を呼び出し、`zk_proofs` コレクションにデータが保存されることを確認。

質問やカスタマイズが必要な場合はお知らせください！