const express = require('express');
const router = express.Router();
const leaderboardController = require('../curriculum/leaderboard/leaderboard.controller');

// GET /api/inspire/leaderboard
router.get('/totalRankings', leaderboardController.getLeaderboard);

module.exports = router;
