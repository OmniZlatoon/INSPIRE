const { randomBytes } = require('node:crypto');

const generateOTP = () => {
    const length = 6;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const bytes = randomBytes(length);

    for (let i = 0; i < length; i++) {
        result += charset[bytes[i] % charset.length];
    }
    return result;
};

module.exports = { generateOTP };
