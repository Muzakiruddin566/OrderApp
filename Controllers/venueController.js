const Venue = require('../Model/Venu');
const moment = require('moment-timezone');
exports.createVenue = async (req, res) => {
  try {
    const { startTime, endTime, venueDate } = req.body;
    
    // Parse startTime and endTime strings into Date objects
    const startTimeDate = moment.tz(`${venueDate} ${startTime}`, 'YYYY-MM-DD HH:mm', 'UTC').toDate(); 
    const endTimeDate = moment.tz(`${venueDate} ${endTime}`, 'YYYY-MM-DD HH:mm', 'UTC').toDate(); 
    
    const venue = new Venue({
      startTime: startTimeDate,
      endTime: endTimeDate,
      venueDate: new Date(venueDate) // Convert venueDate to Date object
    });
    
    await venue.save();
    
    res.status(201).json({ message: 'Venue created successfully', venue: venue });
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};