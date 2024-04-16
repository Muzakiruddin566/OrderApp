// controllers/orderController.js
const Order = require('../Model/Order');
const Venue = require("../Model/Venu");
const moment = require('moment-timezone');
exports.addOrder = async (req, res) => {
    try {
        const { orderAmount, orderDateTime } = req.body;
        const format =  moment.tz(orderDateTime, 'YYYY-MM-DD HH:mm', 'UTC').toDate()
        console.log({orderDateTime : format});
        const venue = await Venue.findOne({
            startTime: { $lte: format },
            endTime: { $gte: format }
        });
        if (!venue) {
            return res.status(400).json({ error: 'Chef is not available at this time.' });
        }

         const existingOrders = await Order.find({
            dateTime: {
                $gte: new Date(orderDateTime).setHours(0, 0, 0, 0), // Start of the specified date
                $lt: new Date(orderDateTime).setHours(23, 59, 59, 999) // End of the specified date
            }
        });

        const orderId = existingOrders.length > 0 ? existingOrders.length + 1 : 1;
        
        const order = new Order({
            orderId: orderId,
            amount: orderAmount,
            dateTime: new Date(orderDateTime)
        });
        
        await order.save();

        res.status(201).json({ message: 'Order added successfully', order: order });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.allOrder = async (req, res) => {
    try {
         const existingOrders = await Order.find();
        res.status(201).json({ message: 'All order fetch successfully', orders:existingOrders });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
