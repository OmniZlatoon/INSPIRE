// Middleware to verify Google Idtoken passed from the frontend for validation of user session
const { auth } = require('../../firebase/initialize_firebase');
const { admin } = require('../../firebase/initialize_firebase');

const validateGoogleToken = async (req, res, next) => {

    // 1. ALWAYS let OPTIONS requests pass without checking for a token
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        console.log("❌ No token provided in the Authorization header");
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log("📨 Received token (first 50 chars):", idToken.slice(0, 50) + "...");
    console.log("📨 Token length:", idToken.length);

    try {
        if (!auth) {
            console.error("❌ Firebase Auth not initialized!");
            return res.status(500).json({ error: 'Server error: Firebase Auth not initialized' });
        }

        console.log("🔍 Attempting to verify token...");
        const decodedToken = await auth.verifyIdToken(idToken);
        // logging the idToken 
        console.log(`idToken: ${idToken}`);
        console.log("✅ Token verified successfully for UID:", decodedToken.uid);

        req.user = decodedToken;

        // check if user already exists in the collection "users" inside Firestore; if not create one
        const userRef = admin.firestore().collection('users').doc(decodedToken.uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            console.log("📝 Creating new user document for:", decodedToken.uid);
            await userRef.set({
                uid: decodedToken.uid,
                email: decodedToken.email,
                displayName: decodedToken.name,
                photoURL: decodedToken.picture,
                provider: 'google',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } else {
            console.log("👤 User already exists:", decodedToken.uid);
        }

        return res.status(200).json({
            message: 'User authenticated and verified successfully ✅',
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
                displayName: decodedToken.name,
                photoURL: decodedToken.picture,
            },
        });
    } catch (error) {
        console.error("❌ Token verification failed");
        console.log("🕒 Server Current Time:", new Date().toISOString());

        // Attempt to manually decode the token for diagnostic purposes
        try {
            const parts = idToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                console.log("📝 Token Payload (Decoded):", {
                    uid: payload.user_id || payload.sub,
                    email: payload.email,
                    iat: new Date(payload.iat * 1000).toISOString(),
                    exp: new Date(payload.exp * 1000).toISOString(),
                    aud: payload.aud,
                    iss: payload.iss
                });
            }
        } catch (decodeError) {
            console.error("Failed to decode token for diagnostic:", decodeError.message);
        }

        console.error("Error Code:", error.code);

        if (error.code === 16 || (error.message && error.message.includes("UNAUTHENTICATED"))) {
            console.error("⚠️  CRITICAL: Firestore request was UNAUTHENTICATED.");
            console.error("👉 Please ensure the Firestore API is enabled and your service account has 'Cloud Datastore User' permissions.");
            return res.status(500).json({
                error: 'Server error: Firestore authentication failed',
                detail: 'Service account has invalid credentials or missing IAM permissions.'
            });
        }

        return res.status(401).json({
            error: 'Unauthorized: Invalid or expired token',
            code: error.code,
            detail: error.message
        });
    }
};
module.exports = { validateGoogleToken };