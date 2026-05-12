const express = require('express');
const router = express.Router();
const booksController = require('../curriculum/books/books.controller');

// All file-upload routes use the multer middleware
const upload = booksController.uploadMiddleware;

// POST   /api/inspire/books/create
router.post('/create', upload, booksController.createBook);

// GET    /api/inspire/books/view
router.get('/view', booksController.getAllBooks);

// GET    /api/inspire/books/:id
router.get('/:id', booksController.getBook);

// PUT    /api/inspire/books/:id
router.put('/:id', upload, booksController.updateBook);

// DELETE /api/inspire/books/deleteAll  — must come BEFORE /:id
router.delete('/deleteAll', booksController.deleteAllBooks);

// DELETE /api/inspire/books/:id
router.delete('/:id', booksController.deleteBook);

module.exports = router;
