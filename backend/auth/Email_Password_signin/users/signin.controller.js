const { generateandSendOTP } = require('../OTP/generateOTP');
const admin = require("firebase-admin");

// login endpoint to handle user login (Email-only + OTP)
exports.signin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // 1. Verify user exists in Firebase
        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                return res.status(404).json({ message: 'User not found. Please create an account.' });
            }
            throw error;
        }

        console.log(`✅ User verified: ${email}. Sending OTP.`);

        // 2. Generate and Send OTP
        await generateandSendOTP(email, res);

        res.status(200).json({
            message: "OTP sent to your email for verification.",
            uid: userRecord.uid
        });

    } catch (error) {
        console.error('Error in signin:', error);
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
