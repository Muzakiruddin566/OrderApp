const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  venueDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Venue', venueSchema);
