const { createClient } = require('redis');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });

const redisClient = createClient({
    url: process.env.REDIS_URI?.replace('redis://', 'rediss://'),
    socket: {
        tls: true,
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
    }
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('⏳ Connecting to Redis...'));
redisClient.on('ready', () => console.log('✅ Redis Connection Successful!'));

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (err) {
        console.error('❌ Could not connect to Redis:', err);
    }
};

connectRedis();

module.exports = redisClient;
