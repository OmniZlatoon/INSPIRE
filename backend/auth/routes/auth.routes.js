const express = require('express');
const router = express.Router();

// Controllers & Middlewares
const { signup } = require('../Email_Password_signin/users/signup.controller');
const { signin } = require('../Email_Password_signin/users/signin.controller');
const { verifyOTP } = require('../Email_Password_signin/HashOTP/user.VerifyOTP');
const { validateGoogleToken } = require('../googlesignin/Middleware/Validate.google.token');

// --- Google Sign-in ---
router.post('/google', validateGoogleToken);

// --- Email & Password Sign-in (OTP based) ---
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verifyOTP);

module.exports = router;
