// controllers/bookingController.js
const Razorpay = require('razorpay');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Helper: Send confirmation email (with slotTime)
const sendConfirmationEmail = async (booking) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Club Canova" <${process.env.EMAIL_USER}>`,
    to: booking.user.email,
    subject: '✅ Booking Confirmed – Thank You!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fff;">
        <h2 style="color: #2d3748;">Your Booking is Confirmed!</h2>
        <p>Hi <strong>${booking.user.name}</strong>,</p>
        <p>Thank you for booking with us. Your tour details are below:</p>
        <ul style="background: #f8f9fa; padding: 15px; border-radius: 6px; list-style: none;">
          <li><strong>Tour:</strong> ${booking.tour?.title || 'N/A'}</li>
          <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
          ${booking.slotTime ? `<li><strong>Time Slot:</strong> ${booking.slotTime}</li>` : ''}
          <li><strong>Participants:</strong> ${booking.participants}</li>
          <li><strong>Total Amount:</strong> ₹${booking.totalPrice}</li>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
        </ul>
        <p>We look forward to seeing you on the tour!</p>
        <p>— The Club Canova Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${booking.user.email}`);
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
};

// Step 1: Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { tourId, participants } = req.body;
    if (!tourId || !participants) {
      return res.status(400).json({ message: 'Missing tourId or participants' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const amount = Math.round(tour.price * participants * 100);
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { tourId, participants, userId: req.user._id }
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay error:', error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
};

// Step 2: Verify Payment & Create Booking
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tourId,
      date,        // ISO string: "2025-10-25T00:00:00.000Z"
      slotTime,    // "06:00"
      participants
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    // Normalize date to YYYY-MM-DD
    const bookingDate = new Date(date);
    const dateStr = bookingDate.toISOString().split('T')[0]; // "2025-10-25"

    // Check if date is allowed
    const isDateAvailable = tour.availableDates.some(d => {
      return new Date(d).toISOString().split('T')[0] === dateStr;
    });
    if (!isDateAvailable) {
      return res.status(400).json({ message: 'Tour not available on this date' });
    }

    // ✅ FIX: Use date range to find booked slots
    const startOfDay = new Date(dateStr);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      tour: tourId,
      date: { $gte: startOfDay, $lt: endOfDay },
      slotTime: slotTime,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'Sorry! This time slot was just booked by another user. Please choose a different slot.' 
      });
    }

    // Check total slots used today
    const totalBookingsToday = await Booking.countDocuments({
      tour: tourId,
      date: { $gte: startOfDay, $lt: endOfDay },
      status: { $ne: 'Cancelled' }
    });

    if (totalBookingsToday >= tour.slotsPerDay) {
      return res.status(400).json({ message: 'No more slots available for this date' });
    }

    // Create booking
    const totalPrice = tour.price * participants;
    const booking = new Booking({
      user: req.user._id,
      tour: tourId,
      date: bookingDate,
      slotTime,
      participants,
      totalPrice,
      paymentStatus: 'Completed',
      status: 'Confirmed',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    await booking.save();
    await booking.populate('user', 'name email');
    await booking.populate('tour', 'title');
    await sendConfirmationEmail(booking);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Booking failed after payment' });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tour', 'title location price duration')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    booking.status = 'Cancelled';
    await booking.save();
    
    res.json({ 
      message: 'Booking cancelled successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tour', 'title price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = status;
    await booking.save();
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
};