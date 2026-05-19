const { admin } = require('../../auth/firebase/initialize_firebase');

exports.getLeaderboard = async (req, res) => {
    try {
        const usersRef = admin.firestore().collection('users');
        const snapshot = await usersRef.orderBy('inspirePoints', 'desc').get();

        const leaderboard = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            leaderboard.push({
                uid: data.uid,
                email: data.email,
                name: data.displayName || data.email.split('@')[0],
                inspirePoints: data.inspirePoints || 0
            });
        });

        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
