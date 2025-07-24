const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Match routes
router.post('/', matchController.createMatch);
router.get('/user/:userId', matchController.getUserMatches);
router.post('/like', matchController.likeDestination);
router.post('/join-group', matchController.joinGroup);

module.exports = router;