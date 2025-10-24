const express = require('express');
const router = express.Router();

const { createRazorpayOrder, verifyPayment, getUserBookings,cancelBooking } = require('../controllers/bookingController');
const { getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');


router.put('/:id/cancel', protect, cancelBooking)
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/', protect, getUserBookings);
router.post('/bookings/create-order', protect, createRazorpayOrder);
router.post('/bookings/verify-payment', protect, verifyPayment);
router.get('/admin', protect, admin, getAllBookings);
module.exports = router;