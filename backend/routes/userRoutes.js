// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getMe, 
  updateProfile, 
  getUsers, 
  getUserById, 
  updateUserRole, 
  deleteUser,
  getUserBookings 
} = require('../controllers/userController');

// User routes (self)
router.route('/me')
  .get(protect, getMe)
  .put(protect, updateProfile);

router.route('/me/bookings')
  .get(protect, getUserBookings);

// Admin routes (all users)
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser);

router.route('/:id/role')
  .put(protect, admin, updateUserRole);

module.exports = router;