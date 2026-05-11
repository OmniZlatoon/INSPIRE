const { admin } = require('../../auth/firebase/initialize_firebase');

const db = admin.firestore();

/**
 * Get total number of registered users from Firebase Auth
 * @route GET /api/inspire/stats/users
 */
exports.getTotalUsers = async (req, res) => {
    try {
        let totalUsers = 0;
        let pageToken;

        do {
            const listResult = await admin.auth().listUsers(1000, pageToken);
            totalUsers += listResult.users.length;
            pageToken = listResult.pageToken;
        } while (pageToken);

        res.status(200).json({
            success: true,
            data: { totalUsers }
        });
    } catch (error) {
        console.error('Error fetching total users:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching total users', error: error.message });
    }
};

/**
 * Get total number of carrier paths from Firestore
 * @route GET /api/inspire/stats/carriers
 */
exports.getTotalCarriers = async (req, res) => {
    try {
        const snapshot = await db.collection('carrier_paths').get();
        const totalCarriers = snapshot.size;

        res.status(200).json({
            success: true,
            data: { totalCarriers }
        });
    } catch (error) {
        console.error('Error fetching total carriers:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching total carriers', error: error.message });
    }
};
