const { admin } = require('../../firebase/initialize_firebase');
const { generateAndSendOTP } = require('../OTP/generateOTP');

// endpoint to handle user sign up
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 1. Check if user already exists
        const userRecord = await admin.auth().getUserByEmail(email).catch(error => {
            if (error.code === 'auth/user-not-found') return null;
            throw error;
        });

        if (userRecord) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // 2. Create user with firebase-admin
        const newUser = await admin.auth().createUser({
            email,
            password
        });

        console.log('User created successfully:', newUser.uid);

        // 3. Create user profile in Firestore
        const userRef = admin.firestore().collection('users').doc(newUser.uid);
        await userRef.set({
            uid: newUser.uid,
            email: email,
            provider: 'email',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({
            message: "User created successfully. OTP sent for verification.",
            uid: newUser.uid
        });

    } catch (error) {
        console.error('Error creating user:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
