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