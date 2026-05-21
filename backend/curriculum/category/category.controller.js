const { admin } = require('../../auth/firebase/initialize_firebase');
const multer = require('multer');
const cloudinary = require('../../database/Cloudinary/Cloudinary_initialize');

const db = admin.firestore();
const categoryCol = db.collection('categories');

// Multer: accept images for logos
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Unsupported file type: ${file.mimetype}. Only images are allowed.`));
    },
});

exports.uploadLogoMiddleware = upload.single('logo');

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, originalname) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'inspire/category_logos',
                resource_type: 'image',
                public_id: originalname.split('.')[0] + '_' + Date.now()
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

/**
 * Upload a partner logo
 * @route POST /api/inspire/category/uploadLogo
 */
exports.uploadLogo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file provided.' });
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Create a single category
 * @route POST /api/inspire/category/create
 */
exports.createCategory = async (req, res) => {
    try {
        const { categoryId, name, description, carrierIds, specializationIds, courseIds, whatYouWillLearn, skills, partners, faqs } = req.body;

        if (!name || !description) {
            return res.status(400).json({ success: false, message: 'name and description are required.' });
        }

        let finalCategoryId = categoryId;
        if (!finalCategoryId) {
            const snapshot = await categoryCol.get();
            let maxNum = 0;
            snapshot.forEach(doc => {
                const catId = doc.data().categoryId;
                if (catId && catId.startsWith('CAT-')) {
                    const numStr = catId.substring(4);
                    const num = parseInt(numStr, 10);
                    if (!isNaN(num) && num > maxNum) {
                        maxNum = num;
                    }
                }
            });
            finalCategoryId = `CAT-${String(maxNum + 1).padStart(3, '0')}`;
        } else {
            const existing = await categoryCol.where('categoryId', '==', finalCategoryId).get();
            if (!existing.empty) return res.status(400).json({ success: false, message: 'A category with this ID already exists.' });
        }

        const newCategory = {
            categoryId: finalCategoryId,
            name,
            description,
            carrierIds: Array.isArray(carrierIds) ? carrierIds : [],
            specializationIds: Array.isArray(specializationIds) ? specializationIds : [],
            courseIds: Array.isArray(courseIds) ? courseIds : [],
            whatYouWillLearn: Array.isArray(whatYouWillLearn) ? whatYouWillLearn : [],
            skills: Array.isArray(skills) ? skills : [],
            partners: Array.isArray(partners) ? partners : [],
            faqs: Array.isArray(faqs) ? faqs : [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await categoryCol.add(newCategory);
        res.status(201).json({ success: true, message: 'Category created', data: { id: docRef.id, ...newCategory } });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all categories
 * @route GET /api/inspire/category/view
 */
exports.getAllCategories = async (req, res) => {
    try {
        const snap = await categoryCol.orderBy('createdAt', 'desc').get();
        const categories = [];
        snap.forEach(doc => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update a category
 * @route PUT /api/inspire/category/:id
 */
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, name, description, carrierIds, specializationIds, courseIds, whatYouWillLearn, skills, partners, faqs } = req.body;
        
        const docRef = categoryCol.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Category not found' });

        if (categoryId && categoryId !== doc.data().categoryId) {
            const snap = await categoryCol.where('categoryId', '==', categoryId).get();
            if (!snap.empty) return res.status(400).json({ success: false, message: 'Another category with this ID already exists.' });
        }

        const updated = {
            ...(categoryId && { categoryId }),
            ...(name && { name }),
            ...(description && { description }),
            ...(Array.isArray(carrierIds) && { carrierIds }),
            ...(Array.isArray(specializationIds) && { specializationIds }),
            ...(Array.isArray(courseIds) && { courseIds }),
            ...(Array.isArray(whatYouWillLearn) && { whatYouWillLearn }),
            ...(Array.isArray(skills) && { skills }),
            ...(Array.isArray(partners) && { partners }),
            ...(Array.isArray(faqs) && { faqs }),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await docRef.update(updated);
        res.status(200).json({ success: true, message: 'Category updated', data: { id, ...doc.data(), ...updated } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a category
 * @route DELETE /api/inspire/category/:id
 */
exports.deleteCategory = async (req, res) => {
    try {
        const docRef = categoryCol.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Category not found' });
        
        await docRef.delete();
        res.status(200).json({ success: true, message: 'Category deleted', data: { id: req.params.id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
