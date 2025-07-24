const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Destination routes
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestination);
router.get('/search/:query', destinationController.searchDestinations);

module.exports = router;