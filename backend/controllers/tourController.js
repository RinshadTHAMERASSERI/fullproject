// controllers/tourController.js
const Tour = require('../models/Tour');
const Booking = require('../models/Booking'); // ← MUST BE HERE

const getTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTour = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { 
      title, description, location, duration, difficulty, 
      price, maxParticipants, slotsPerDay, availableDates, features 
    } = req.body;

    if (!availableDates || !availableDates.trim()) {
      return res.status(400).json({ message: 'At least one available date is required' });
    }

    let parsedDates = availableDates
      .split(',')
      .map(d => d.trim())
      .filter(d => d)
      .map(d => new Date(d))
      .filter(d => !isNaN(d));

    if (parsedDates.length === 0) {
      return res.status(400).json({ message: 'No valid dates found' });
    }

    let parsedFeatures = [];
    if (features) {
      parsedFeatures = features.split(',').map(f => f.trim()).filter(f => f);
    }

    const tour = new Tour({
      title,
      description,
      location,
      duration,
      difficulty,
      price: Number(price),
      maxParticipants: Number(maxParticipants),
      slotsPerDay: Number(slotsPerDay) || 12,
      availableDates: parsedDates,
      features: parsedFeatures,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      createdBy: req.user.id
    });

    await tour.save();
    res.status(201).json(tour);
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ message: 'Server error while creating tour' });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTour = async (req, res) => {
  try {
    const { 
      title, description, location, duration, difficulty, 
      price, maxParticipants, slotsPerDay, availableDates, features 
    } = req.body;
    
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const parsedDates = availableDates 
      ? availableDates.split(',').map(d => {
          const date = new Date(d.trim());
          return isNaN(date) ? null : date;
        }).filter(d => d)
      : tour.availableDates;
    
    const parsedFeatures = features 
      ? features.split(',').map(f => f.trim()).filter(f => f)
      : tour.features;

    tour.title = title || tour.title;
    tour.description = description || tour.description;
    tour.location = location || tour.location;
    tour.duration = duration || tour.duration;
    tour.difficulty = difficulty || tour.difficulty;
    tour.price = price ? Number(price) : tour.price;
    tour.maxParticipants = maxParticipants ? Number(maxParticipants) : tour.maxParticipants;
    tour.slotsPerDay = slotsPerDay ? Number(slotsPerDay) : tour.slotsPerDay;
    tour.availableDates = parsedDates;
    tour.features = parsedFeatures;
    
    if (req.file) {
      tour.image = `/uploads/${req.file.filename}`;
    }

    await tour.save();
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ FIXED: getAvailableSlots with date range query
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query; // "2025-10-25"
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    // Check if date is allowed
    const isDateAvailable = tour.availableDates.some(d => {
      return new Date(d).toISOString().split('T')[0] === date;
    });
    if (!isDateAvailable) {
      return res.json({ availableSlots: [] });
    }

    // Generate all slots (6:00 to 17:00)
    const allSlots = [];
    for (let hour = 6; hour <= 17; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    // ✅ FIX: Use date range to find booked slots
    const startOfDay = new Date(date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const bookedSlots = await Booking.find({
      tour: req.params.id,
      date: { $gte: startOfDay, $lt: endOfDay },
      status: { $ne: 'Cancelled' }
    }).distinct('slotTime');

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    res.json({ availableSlots });
  } catch (error) {
    console.error('Slot fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getTours, 
  createTour, 
  getTourById, 
  deleteTour, 
  updateTour,
  getAvailableSlots
};