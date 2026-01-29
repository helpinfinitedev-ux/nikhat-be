const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  offer: {
    type: Number,
    default: 0,
    min: [0, 'Offer cannot be negative'],
    max: [100, 'Offer cannot exceed 100%']
  },
  boughtQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  imageUrls: [{
    type: String
  }]
}, {
  timestamps: true
});

productSchema.virtual('discountedPrice').get(function() {
  return this.price - (this.price * this.offer / 100);
});

module.exports = mongoose.model('Product', productSchema);
