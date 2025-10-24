// routes/tourRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getTours, createTour, getTourById,deleteTour,getAvailableSlots } = require('../controllers/tourController'); // 👈 Correct imports
const upload = require('../middleware/upload');
// const { deleteTour } = require('../controllers/tourController');
// const { protect, admin } = require('../middleware/authMiddleware');
const { updateTour } = require('../controllers/tourController');
router.route('/')
  .get(getTours)
  .post(protect, admin, upload.single('image'), createTour); // 👈 createTour

router.route('/:id')
  .get(getTourById)
  .delete(protect, admin, deleteTour)
  router.route('/:id')
  .get(getTourById)
  .put(protect, admin, upload.single('image'), updateTour) // 👈 Add PUT route
  .delete(protect, admin, deleteTour);
  router.get('/:id/available-slots', protect, getAvailableSlots);
  // backend/routes/tourRoutes.js
// router.delete('/:id', protect, admin, deleteTour);
module.exports = router;