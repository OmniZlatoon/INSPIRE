const express = require('express');
const router = express.Router();
const statsController = require('../../curriculum/stats/stats.controller');

// GET /api/inspire/stats/users  — total registered users
router.get('/users', statsController.getTotalUsers);

// GET /api/inspire/stats/carriers  — total carrier paths
router.get('/carriers', statsController.getTotalCarriers);

module.exports = router;
