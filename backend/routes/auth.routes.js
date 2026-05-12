const express = require('express');
const router = express.Router();

// Controllers & Middlewares
const { signup } = require('../auth/Email_Password_signin/users/signup.controller');
const { signin } = require('../auth/Email_Password_signin/users/signin.controller');
const { verifyOTP } = require('../auth/Email_Password_signin/HashOTP/user.VerifyOTP');
const { verifyToken, validateGoogleToken } = require('../auth/googlesignin/Middleware/Validate.google.token');
const { logout } = require('../auth/googlesignin/logout/logout.controller');


// --- Social Sign-in ---
router.post('/google', verifyToken, validateGoogleToken);
router.post('/logout', verifyToken, logout);


// --- Email & Password Sign-in (OTP based) ---
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verifyOTP);

module.exports = router;
