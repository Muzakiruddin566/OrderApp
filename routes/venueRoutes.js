const express = require('express');
const router = express.Router();
const venueController = require('../Controllers/venueController');

// Route to handle saving a Venue
router.post('/dateTime', venueController.createVenue);

module.exports = router;
