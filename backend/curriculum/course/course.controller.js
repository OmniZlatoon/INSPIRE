const { admin } = require('../../auth/firebase/initialize_firebase');

const db = admin.firestore();
const coursesCollection = db.collection('courses');

/**
 * Create a single course
 * @route POST /api/inspire/course/create
 */
exports.createCourse = async (req, res) => {
    try {
        const { courseId, name, description, carrierIds } = req.body;

        if (!courseId || !name || !description || !Array.isArray(carrierIds) || carrierIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide courseId, name, description, and at least one carrierId.' });
        }

        // Check duplicate courseId
        const existing = await coursesCollection.where('courseId', '==', courseId).get();
        if (!existing.empty) {
            return res.status(400).json({ success: false, message: 'A course with this ID already exists.' });
        }

        const newCourse = {
            courseId,
            name,
            description,
            carrierIds,
            bookCount: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await coursesCollection.add(newCourse);

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: { id: docRef.id, ...newCourse },
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ success: false, message: 'Server error while creating course', error: error.message });
    }
};

/**
 * Create bulk courses
 * @route POST /api/inspire/course/bulk
 */
exports.createBulkCourses = async (req, res) => {
    try {
        const { courses } = req.body;

        if (!Array.isArray(courses) || courses.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide an array of courses.' });
        }

        const batch = db.batch();
        const created = [];
        const seenIds = new Set();

        for (const course of courses) {
            const { courseId, name, description, carrierIds } = course;

            if (!courseId || !name || !description || !Array.isArray(carrierIds) || carrierIds.length === 0) {
                return res.status(400).json({ success: false, message: 'Each course must have courseId, name, description, and at least one carrierId.' });
            }

            if (seenIds.has(courseId)) {
                return res.status(400).json({ success: false, message: `Duplicate courseId in request: ${courseId}` });
            }
            seenIds.add(courseId);

            const snap = await coursesCollection.where('courseId', '==', courseId).get();
            if (!snap.empty) {
                return res.status(400).json({ success: false, message: `Course ID '${courseId}' already exists.` });
            }

            const docRef = coursesCollection.doc();
            const newCourse = {
                courseId, name, description, carrierIds,
                bookCount: 0,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            batch.set(docRef, newCourse);
            created.push({ id: docRef.id, ...newCourse });
        }

        await batch.commit();

        res.status(201).json({ success: true, message: `${courses.length} courses created successfully`, data: created });
    } catch (error) {
        console.error('Error creating bulk courses:', error);
        res.status(500).json({ success: false, message: 'Server error while creating bulk courses', error: error.message });
    }
};

/**
 * Get all courses
 * @route GET /api/inspire/course/view
 */
exports.getAllCourses = async (req, res) => {
    try {
        const snapshot = await coursesCollection.orderBy('createdAt', 'desc').get();
        const courses = [];
        snapshot.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching courses', error: error.message });
    }
};

/**
 * Update a course
 * @route PUT /api/inspire/course/:id
 */
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseId, name, description, carrierIds } = req.body;

        const docRef = coursesCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Course not found' });

        if (courseId && courseId !== doc.data().courseId) {
            const snap = await coursesCollection.where('courseId', '==', courseId).get();
            if (!snap.empty) return res.status(400).json({ success: false, message: 'Another course with this ID already exists.' });
        }

        const updated = {
            ...(courseId && { courseId }),
            ...(name && { name }),
            ...(description && { description }),
            ...(Array.isArray(carrierIds) && { carrierIds }),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await docRef.update(updated);
        res.status(200).json({ success: true, message: 'Course updated successfully', data: { id, ...doc.data(), ...updated } });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ success: false, message: 'Server error while updating course', error: error.message });
    }
};

/**
 * Delete a single course
 * @route DELETE /api/inspire/course/:id
 */
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const docRef = coursesCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Course not found' });
        await docRef.delete();
        res.status(200).json({ success: true, message: 'Course deleted successfully', data: { id } });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting course', error: error.message });
    }
};

/**
 * Delete all courses
 * @route DELETE /api/inspire/course/deleteAll
 */
exports.deleteAllCourses = async (req, res) => {
    try {
        const snapshot = await coursesCollection.get();
        const batch = db.batch();
        snapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        res.status(200).json({ success: true, message: 'All courses deleted successfully', data: { count: snapshot.size } });
    } catch (error) {
        console.error('Error deleting all courses:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting all courses', error: error.message });
    }
};
