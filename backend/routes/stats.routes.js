const express = require('express');
const router = express.Router();
const statsController = require('../curriculum/stats/stats.controller');

// GET /api/inspire/stats/users  — total registered users
router.get('/users', statsController.getTotalUsers);

// GET /api/inspire/stats/carriers  — total carrier paths
router.get('/carriers', statsController.getTotalCarriers);

// GET /api/inspire/stats/courses  — total courses
router.get('/courses', statsController.getTotalCourses);

// GET /api/inspire/stats/books  — total books
router.get('/books', statsController.getTotalBooks);

// GET /api/inspire/stats/messages  — total messages
router.get('/messages', statsController.getTotalMessages);

module.exports = router;




/** This route gets the total number of contents stored in the different collections of this system.
 *  it is used for the dashboard to display the total number of users, carriers, courses, and books .. etc*/