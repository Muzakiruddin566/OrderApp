// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin :"http://localhost:3000"}))

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/pos_system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/venue', require('./routes/venueRoutes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
