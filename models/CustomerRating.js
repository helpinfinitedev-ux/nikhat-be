const mongoose = require('mongoose');

const customerRatingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomerRating', customerRatingSchema);
