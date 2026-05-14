const { admin } = require('../../auth/firebase/initialize_firebase');
const multer = require('multer');
const cloudinary = require('../../database/Cloudinary/Cloudinary_initialize');


const db = admin.firestore();
const booksCol = db.collection('books');

// Multer: accept only pdf, docx, ppt — stored in memory as buffer
const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Unsupported file type: ${file.mimetype}. Only PDF, DOCX, and PPT are allowed.`));
    },
});

exports.uploadMiddleware = upload.array('files', 500);

// Helper: Upload buffer to Cloudinary using upload_stream
const uploadToCloudinary = (fileBuffer, originalname, mimetype) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'inspire/books',
                resource_type: 'auto', // Automatically determine raw, image, or video
                public_id: originalname.split('.')[0] + '_' + Date.now() // Unique ID
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
 * Create a single book
 * @route POST /api/inspire/books/create
 */
exports.createBook = async (req, res) => {
    try {
        const { bookId, name, description, author, courseId } = req.body;
        if (!bookId || !name || !description || !author || !courseId) {
            return res.status(400).json({ success: false, message: 'All fields (bookId, name, description, author, courseId) are required.' });
        }
        const existing = await booksCol.where('bookId', '==', bookId).get();
        if (!existing.empty) return res.status(400).json({ success: false, message: 'A book with this ID already exists.' });

        // Upload all files to Cloudinary in parallel
        const uploadPromises = (req.files || []).map(async (file) => {
            const result = await uploadToCloudinary(file.buffer, file.originalname, file.mimetype);
            return {
                name: file.originalname,
                type: file.mimetype,
                size: file.size,
                secure_url: result.secure_url,
                public_id: result.public_id,
                resource_type: result.resource_type
            };
        });

        const files = await Promise.all(uploadPromises);

        const newBook = {
            bookId, name, description, author, courseId, files,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const docRef = await booksCol.add(newBook);
        res.status(201).json({ success: true, message: 'Book created successfully', data: { id: docRef.id, ...newBook } });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all books
 * @route GET /api/inspire/books/view
 */
exports.getAllBooks = async (req, res) => {
    try {
        const snap = await booksCol.orderBy('createdAt', 'desc').get();
        const books = [];
        snap.forEach(doc => {
            const d = doc.data();
            // Since we no longer use huge base64 strings, we can just return the files array
            books.push({ id: doc.id, ...d });
        });
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get a single book (with file data)
 * @route GET /api/inspire/books/:id
 */
exports.getBook = async (req, res) => {
    try {
        const doc = await booksCol.doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Book not found' });
        res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Update a book
 * @route PUT /api/inspire/books/:id
 */
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookId, name, description, author, courseId } = req.body;
        const docRef = booksCol.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Book not found' });

        if (bookId && bookId !== doc.data().bookId) {
            const snap = await booksCol.where('bookId', '==', bookId).get();
            if (!snap.empty) return res.status(400).json({ success: false, message: 'Another book with this ID already exists.' });
        }
        // Upload new files to Cloudinary
        const uploadPromises = (req.files || []).map(async (file) => {
            const result = await uploadToCloudinary(file.buffer, file.originalname, file.mimetype);
            return {
                name: file.originalname,
                type: file.mimetype,
                size: file.size,
                secure_url: result.secure_url,
                public_id: result.public_id,
                resource_type: result.resource_type
            };
        });

        const newFiles = await Promise.all(uploadPromises);

        // If replacing files, delete old files from Cloudinary to save space
        if (newFiles.length > 0 && doc.data().files && doc.data().files.length > 0) {
            const deletePromises = doc.data().files.map(f => {
                if (f.public_id) {
                    return cloudinary.uploader.destroy(f.public_id, { resource_type: f.resource_type || 'auto' });
                }
                return Promise.resolve();
            });
            await Promise.all(deletePromises).catch(err => console.error("Error deleting old files from Cloudinary:", err));
        }

        const updated = {
            ...(bookId && { bookId }),
            ...(name && { name }),
            ...(description && { description }),
            ...(author && { author }),
            ...(courseId && { courseId }),
            ...(newFiles.length > 0 && { files: newFiles }),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await docRef.update(updated);
        res.status(200).json({ success: true, message: 'Book updated successfully', data: { id, ...doc.data(), ...updated } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete a single book
 * @route DELETE /api/inspire/books/:id
 */
exports.deleteBook = async (req, res) => {
    try {
        const docRef = booksCol.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Book not found' });

        const bookData = doc.data();

        // Delete associated files from Cloudinary
        if (bookData.files && bookData.files.length > 0) {
            const deletePromises = bookData.files.map(f => {
                if (f.public_id) {
                    return cloudinary.uploader.destroy(f.public_id, { resource_type: f.resource_type || 'auto' });
                }
                return Promise.resolve();
            });
            await Promise.all(deletePromises).catch(err => console.error("Error deleting files from Cloudinary:", err));
        }

        await docRef.delete();
        res.status(200).json({ success: true, message: 'Book and associated files deleted', data: { id: req.params.id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete all books
 * @route DELETE /api/inspire/books/deleteAll
 */
exports.deleteAllBooks = async (req, res) => {
    try {
        const snap = await booksCol.get();
        const batch = db.batch();

        const allDeletePromises = [];

        snap.forEach(doc => {
            const bookData = doc.data();
            // Collect Cloudinary deletion promises
            if (bookData.files && bookData.files.length > 0) {
                bookData.files.forEach(f => {
                    if (f.public_id) {
                        allDeletePromises.push(cloudinary.uploader.destroy(f.public_id, { resource_type: f.resource_type || 'auto' }));
                    }
                });
            }
            batch.delete(doc.ref);
        });

        // Delete all files from Cloudinary
        await Promise.all(allDeletePromises).catch(err => console.error("Error deleting bulk files from Cloudinary:", err));

        await batch.commit();
        res.status(200).json({ success: true, message: 'All books and associated files deleted', data: { count: snap.size } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
