const { generateOTP } = require("./OTP.script");
const { hashOTP } = require("../HashOTP/hashing_otp");
const sendOTPEmail = require('../NodeMailer/SendOTPEmail');
const redisClient = require('../RedisConfig/redis.setup');

/**
 * Generates an OTP, hashes it, stores it in Redis, and sends it via email.
 */
async function generateAndSendOTP(email, res) {
    try {
        const otp = generateOTP();
        const hashedOTP = await hashOTP(otp);

        // Store in Redis with 60s expiration
        await redisClient.set(email, hashedOTP, 'EX', 60);

        // Send Email
        await sendOTPEmail(email, otp);

        console.log(`✅ OTP generated and sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error in generateAndSendOTP:', error);
        throw error;
    }
}

module.exports = { generateAndSendOTP };
