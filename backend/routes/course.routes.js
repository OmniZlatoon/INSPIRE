const express = require('express');
const router = express.Router();
const courseController = require('../curriculum/course/course.controller');

router.post('/create', courseController.createCourse);
router.post('/bulk', courseController.createBulkCourses);
router.get('/view', courseController.getAllCourses);
router.put('/:id', courseController.updateCourse);
router.delete('/deleteAll', courseController.deleteAllCourses);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
