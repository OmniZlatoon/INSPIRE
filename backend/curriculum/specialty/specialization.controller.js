const { admin } = require('../../auth/firebase/initialize_firebase');

const db = admin.firestore();
const specializationsCollection = db.collection('specializations');

/**
 * Generate the next auto-incremented Specialization ID in format SPEC-0001
 */
async function generateSpecializationId() {
    const snapshot = await specializationsCollection.orderBy('createdAt', 'desc').limit(1).get();

    if (snapshot.empty) {
        return 'SPEC-0001';
    }

    // Find the highest numeric suffix across all documents
    const allDocs = await specializationsCollection.get();
    let maxNum = 0;
    allDocs.forEach(doc => {
        const data = doc.data();
        if (data.specializationId) {
            const match = data.specializationId.match(/SPEC-(\d+)/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) maxNum = num;
            }
        }
    });

    const nextNum = maxNum + 1;
    return `SPEC-${String(nextNum).padStart(4, '0')}`;
}

/**
 * Create a single specialization
 * @route POST /api/inspire/specialization/create
 */
exports.createSpecialization = async (req, res) => {
    try {
        const {
            name,
            description,
            courseIds,
            courseDescription,
            whatYouWillLearn,
            skills,
            instructors,
            faqs,
            carrierIds
        } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least a name and description for the specialization.'
            });
        }

        // Auto-generate the specialization ID
        const specializationId = await generateSpecializationId();

        const newSpecialization = {
            specializationId,
            name,
            description,
            courseIds: Array.isArray(courseIds) ? courseIds : [],
            courseDescription: courseDescription || '',
            whatYouWillLearn: Array.isArray(whatYouWillLearn) ? whatYouWillLearn : [],
            skills: Array.isArray(skills) ? skills : [],
            instructors: Array.isArray(instructors) ? instructors : [],
            faqs: Array.isArray(faqs) ? faqs : [],
            carrierIds: Array.isArray(carrierIds) ? carrierIds : [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await specializationsCollection.add(newSpecialization);

        res.status(201).json({
            success: true,
            message: 'Specialization created successfully',
            data: { id: docRef.id, ...newSpecialization },
        });
    } catch (error) {
        console.error('Error creating specialization:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating specialization',
            error: error.message
        });
    }
};

/**
 * Get all specializations
 * @route GET /api/inspire/specialization/view
 */
exports.getAllSpecializations = async (req, res) => {
    try {
        const snapshot = await specializationsCollection.orderBy('createdAt', 'desc').get();
        const specializations = [];
        snapshot.forEach(doc => specializations.push({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, data: specializations });
    } catch (error) {
        console.error('Error fetching specializations:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching specializations',
            error: error.message
        });
    }
};

/**
 * Update a specialization
 * @route PUT /api/inspire/specialization/:id
 */
exports.updateSpecialization = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            courseIds,
            courseDescription,
            whatYouWillLearn,
            skills,
            instructors,
            faqs,
            carrierIds
        } = req.body;

        const docRef = specializationsCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Specialization not found' });
        }

        const updated = {
            ...(name && { name }),
            ...(description && { description }),
            ...(Array.isArray(courseIds) && { courseIds }),
            ...(courseDescription !== undefined && { courseDescription }),
            ...(Array.isArray(whatYouWillLearn) && { whatYouWillLearn }),
            ...(Array.isArray(skills) && { skills }),
            ...(Array.isArray(instructors) && { instructors }),
            ...(Array.isArray(faqs) && { faqs }),
            ...(Array.isArray(carrierIds) && { carrierIds }),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await docRef.update(updated);
        res.status(200).json({
            success: true,
            message: 'Specialization updated successfully',
            data: { id, ...doc.data(), ...updated }
        });
    } catch (error) {
        console.error('Error updating specialization:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating specialization',
            error: error.message
        });
    }
};

/**
 * Delete a single specialization
 * @route DELETE /api/inspire/specialization/:id
 */
exports.deleteSpecialization = async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = specializationsCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Specialization not found' });
        }
        await docRef.delete();
        res.status(200).json({ success: true, message: 'Specialization deleted successfully', data: { id } });
    } catch (error) {
        console.error('Error deleting specialization:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting specialization',
            error: error.message
        });
    }
};

/**
 * Delete all specializations
 * @route DELETE /api/inspire/specialization/deleteAll
 */
exports.deleteAllSpecializations = async (req, res) => {
    try {
        const snapshot = await specializationsCollection.get();
        const batch = db.batch();
        snapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        res.status(200).json({
            success: true,
            message: 'All specializations deleted successfully',
            data: { count: snapshot.size }
        });
    } catch (error) {
        console.error('Error deleting all specializations:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting all specializations',
            error: error.message
        });
    }
};
