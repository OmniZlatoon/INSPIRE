const { generateAndSendOTP } = require('../OTP/generateOTP');
const admin = require("firebase-admin");

// login endpoint to handle user login
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 1. Verify user exists in Firebase
        const userRecord = await admin.auth().getUserByEmail(email).catch(error => {
            if (error.code === 'auth/user-not-found') return null;
            throw error;
        });

        if (!userRecord) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Note: Password verification normally happens via Firebase Client SDK or REST API.
        // For now, we proceed to OTP generation as requested.

        // 2. Generate and Send OTP
        await generateAndSendOTP(email, res);

        // Ensure only one response is sent. 
        // If generateAndSendOTP handles its own success response, this might need adjustment.
        // My current version of generateAndSendOTP doesn't send a response, so we do it here.
        res.status(200).json({ message: "OTP sent to your email for verification.", uid: userRecord.uid });

    } catch (error) {
        console.error('Error logging in:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

exports.resend = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        await generateAndSendOTP(email, res);
        res.status(200).json({ message: "OTP resent successfully" });
    }
    catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
