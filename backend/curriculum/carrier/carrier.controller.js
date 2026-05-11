const { admin } = require('../../auth/firebase/initialize_firebase');

const db = admin.firestore();
const carriersCollection = db.collection('carrier_paths');

/**
 * Create a new Carrier Path
 * @route POST /api/inspire/carrier
 */
exports.createCarrier = async (req, res) => {
    try {
        const { carrierId, name, description } = req.body;

        if (!carrierId || !name || !description) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields: carrierId, name, description' });
        }

        // Check if carrierId already exists
        const snapshot = await carriersCollection.where('carrierId', '==', carrierId).get();
        if (!snapshot.empty) {
            return res.status(400).json({ success: false, message: 'A Carrier Path with this ID already exists.' });
        }

        const newCarrier = {
            carrierId,
            name,
            description,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await carriersCollection.add(newCarrier);

        res.status(201).json({
            success: true,
            message: 'Carrier Path created successfully',
            data: { id: docRef.id, ...newCarrier }
        });
    } catch (error) {
        console.error('Error creating carrier path:', error);
        res.status(500).json({ success: false, message: 'Server error while creating carrier path', error: error.message });
    }
};

/**
 * Create Bulk Carrier Paths
 * @route POST /api/inspire/carrier/bulk
 */
exports.createBulkCarriers = async (req, res) => {
    try {
        const { carriers } = req.body;

        if (!Array.isArray(carriers) || carriers.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide an array of carriers' });
        }

        const batch = db.batch();
        const createdCarriers = [];
        const existingIds = new Set();

        // Pre-check for duplicate IDs in the request itself
        for (const carrier of carriers) {
            if (existingIds.has(carrier.carrierId)) {
                return res.status(400).json({ success: false, message: `Duplicate carrierId found in request: ${carrier.carrierId}` });
            }
            existingIds.add(carrier.carrierId);
        }

        for (const carrier of carriers) {
            const { carrierId, name, description } = carrier;

            if (!carrierId || !name || !description) {
                return res.status(400).json({ success: false, message: 'All carriers must have carrierId, name, and description' });
            }

            // Note: In a production scenario with high concurrency, querying inside a loop isn't ideal. 
            // For now, it suffices to prevent duplicates.
            const snapshot = await carriersCollection.where('carrierId', '==', carrierId).get();
            if (!snapshot.empty) {
                return res.status(400).json({ success: false, message: `A Carrier Path with ID ${carrierId} already exists in the system.` });
            }

            const docRef = carriersCollection.doc(); // Auto-generate ID
            const newCarrier = {
                carrierId,
                name,
                description,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            batch.set(docRef, newCarrier);
            createdCarriers.push({ id: docRef.id, ...newCarrier });
        }

        await batch.commit();

        res.status(201).json({
            success: true,
            message: `${carriers.length} Carrier Paths created successfully`,
            data: createdCarriers
        });
    } catch (error) {
        console.error('Error creating bulk carrier paths:', error);
        res.status(500).json({ success: false, message: 'Server error while creating bulk carrier paths', error: error.message });
    }
};

/**
 * Get all Carrier Paths
 * @route GET /api/inspire/carrier
 */
exports.getAllCarriers = async (req, res) => {
    try {
        const snapshot = await carriersCollection.orderBy('createdAt', 'desc').get();

        const carriers = [];
        snapshot.forEach(doc => {
            carriers.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            success: true,
            data: carriers
        });
    } catch (error) {
        console.error('Error fetching carrier paths:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching carrier paths', error: error.message });
    }
};

/**
 * Update a Carrier Path
 * @route PUT /api/inspire/carrier/:id
 */
exports.updateCarrier = async (req, res) => {
    try {
        const { id } = req.params;
        const { carrierId, name, description } = req.body;

        const docRef = carriersCollection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Carrier Path not found' });
        }

        // If updating carrierId, check for uniqueness
        if (carrierId && carrierId !== doc.data().carrierId) {
            const snapshot = await carriersCollection.where('carrierId', '==', carrierId).get();
            if (!snapshot.empty) {
                return res.status(400).json({ success: false, message: 'Another Carrier Path with this ID already exists.' });
            }
        }

        const updatedData = {
            ...(carrierId && { carrierId }),
            ...(name && { name }),
            ...(description && { description }),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await docRef.update(updatedData);

        res.status(200).json({
            success: true,
            message: 'Carrier Path updated successfully',
            data: { id, ...doc.data(), ...updatedData }
        });
    } catch (error) {
        console.error('Error updating carrier path:', error);
        res.status(500).json({ success: false, message: 'Server error while updating carrier path', error: error.message });
    }
};

/**
 * Delete a Carrier Path
 * @route DELETE /api/inspire/carrier/:id
 */
exports.deleteCarrier = async (req, res) => {
    try {
        const { id } = req.params;

        const docRef = carriersCollection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Carrier Path not found' });
        }

        await docRef.delete();

        res.status(200).json({
            success: true,
            message: 'Carrier Path deleted successfully',
            data: { id }
        });
    } catch (error) {
        console.error('Error deleting carrier path:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting carrier path', error: error.message });
    }
};

// endpoint to delete all carrier
//@route DELETE /api/inspire/carrier/deleteAll
exports.deleteAllCarriers = async (req, res) => {
    try {
        const snapshot = await carriersCollection.get();
        const batch = db.batch();

        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        res.status(200).json({
            success: true,
            message: 'All Carrier Paths deleted successfully',
            data: { count: snapshot.size }
        });
    } catch (error) {
        console.error('Error deleting all carrier paths:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting all carrier paths', error: error.message });
    }
};
