const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Chat routes
router.get('/group/:groupId/messages', chatController.getMessages);
router.post('/group/:groupId/message', chatController.sendMessage);
router.get('/user/:userId/groups', chatController.getUserGroups);
router.post('/ai-response', chatController.getAIResponse);

module.exports = router;