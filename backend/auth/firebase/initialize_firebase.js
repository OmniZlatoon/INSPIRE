const admin = require("firebase-admin");
const serviceAccount = require("./firebaseConfig.json");

let auth;
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin SDK initialized successfully.");
  }
  auth = admin.auth();
  console.log("✅ Firebase Auth ready");
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
}

module.exports = { auth, admin };
