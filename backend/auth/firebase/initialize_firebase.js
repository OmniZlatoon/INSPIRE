const admin = require("firebase-admin");

// Initialize with environment variables for better security
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace the escaped \n with actual newlines
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
};

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

    // --- STARTUP DIAGNOSTIC: TEST FIRESTORE CONNECTIVITY ---
    const db = admin.firestore();
    console.log(`🔍 Testing Firestore connectivity for project: ${serviceAccount.projectId}...`);

    db.collection('_connection_test_').doc('test').get()
        .then(() => {
            console.log("✅ Firestore connection successful! Credentials are valid.");
        })
        .catch((error) => {
            console.error("❌ Firestore connection failed!");
            if (error.code === 16 || error.message.includes("UNAUTHENTICATED")) {
                console.error("👉 ERROR CODE 16 (UNAUTHENTICATED): Your Service Account key is likely invalid, revoked, or lacks IAM permissions.");
                console.error(`👉 Check IAM for: ${serviceAccount.clientEmail}`);
            } else {
                console.error("👉 Error Details:", error.message);
            }
        });
    // -------------------------------------------------------

} catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
}

module.exports = { auth, admin };
