const connectDB = require('./database/MongoDB/config/db');
const redisClient = require('./auth/Email_Password_signin/RedisConfig/redis.setup');
const { auth } = require('./auth/firebase/initialize_firebase');

async function runTests() {
    console.log('--- Starting Integration Test ---');

    // 1. Test MongoDB
    try {
        await connectDB();
        console.log('✅ MongoDB connection test passed');
    } catch (err) {
        console.error('❌ MongoDB connection test failed');
    }

    // 2. Test Redis
    try {
        if (!redisClient.isOpen) await redisClient.connect();
        await redisClient.set('test_key', 'works');
        const val = await redisClient.get('test_key');
        if (val === 'works') {
            console.log('✅ Redis connection test passed');
        } else {
            console.log('❌ Redis data retrieval test failed');
        }
        await redisClient.del('test_key');
    } catch (err) {
        console.error('❌ Redis test failed:', err.message);
    }

    // 3. Test Firebase
    if (auth) {
        console.log('✅ Firebase Admin SDK initialized');
    } else {
        console.log('❌ Firebase Admin SDK failed to initialize');
    }

    console.log('--- Test Finished ---');
    process.exit(0);
}

runTests();
