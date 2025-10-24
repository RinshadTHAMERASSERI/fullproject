// models/Booking.js
const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  date: { type: Date, required: true }, // e.g., 2025-10-25
  slotTime: { type: String, required: true }, // e.g., "06:00", "07:00", ..., "17:00"
  participants: { type: Number, required: true }, // still useful for info
  totalPrice: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed'], 
    default: 'Pending' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled'], 
    default: 'Pending' 
  },
  paymentId: String,
  razorpayOrderId: String
}, {
  timestamps: true
});
module.exports = mongoose.model('Booking', bookingSchema);