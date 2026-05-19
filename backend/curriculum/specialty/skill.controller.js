const { admin } = require('../../auth/firebase/initialize_firebase');

const db = admin.firestore();
const skillsCollection = db.collection('skills');

/**
 * Create a new skill
 * @route POST /api/inspire/specialization/skill/create
 */
exports.createSkill = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a skill name.'
            });
        }

        // Check for duplicate skill name (case-insensitive)
        const snapshot = await skillsCollection.where('name', '==', name.trim()).get();
        if (!snapshot.empty) {
            return res.status(400).json({
                success: false,
                message: 'A skill with this name already exists.'
            });
        }

        const newSkill = {
            name: name.trim(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await skillsCollection.add(newSkill);

        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: { id: docRef.id, ...newSkill },
        });
    } catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating skill',
            error: error.message
        });
    }
};

/**
 * Get all skills
 * @route GET /api/inspire/specialization/skill/view
 */
exports.getAllSkills = async (req, res) => {
    try {
        const snapshot = await skillsCollection.orderBy('name', 'asc').get();
        const skills = [];
        snapshot.forEach(doc => skills.push({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, data: skills });
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching skills',
            error: error.message
        });
    }
};
