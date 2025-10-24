
const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true,
    trim: true 
  },
  location: { 
    type: String, 
    required: true,
    trim: true 
  },
  duration: { 
    type: String, 
    required: true,
    trim: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Moderate', 'Challenging'], 
    default: 'Easy' 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  maxParticipants: { 
    type: Number, 
    required: true,
    min: 1,
    max: 100 // reasonable upper limit
  },
  slotsPerDay: { 
    type: Number, 
    required: true,
    min: 1,
    max: 24, // max 24 hourly slots in a day
    default: 12 
  },
  availableDates: [{ 
    type: Date, 
    required: true 
    // ❌ DELETE the `validate: { ... }` part
  }],
  image: { 
    type: String 
  },
  features: [String],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tour', tourSchema);