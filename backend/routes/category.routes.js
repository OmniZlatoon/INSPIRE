const express = require('express');
const router = express.Router();
const categoryController = require('../curriculum/category/category.controller');

// Category CRUD
router.post('/create', categoryController.createCategory);
router.get('/view', categoryController.getAllCategories);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// File Upload for partner logo
router.post('/uploadLogo', categoryController.uploadLogoMiddleware, categoryController.uploadLogo);

module.exports = router;
