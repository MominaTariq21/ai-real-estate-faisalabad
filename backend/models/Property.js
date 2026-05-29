const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  priceType: {
    type: String,
    enum: ['House', 'Apartment', 'Plot', 'Commercial', 'Industrial', 'Farm House'],
    required: true,
  },
  purpose: {
    type: String,
    enum: ['For Sale', 'For Rent'],
    required: true,
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    enum: [
      'DHA Faisalabad',
      'Gulberg',
      'Canal Road',
      'Madina Town',
      'Wapda City',
      'Peoples Colony',
      'Susan Road',
      'Millat Town',
      'Samanabad',
      'D-Ground',
      'Jinnah Colony',
      'Eden Valley',
    ],
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
  },
  beds: {
    type: Number,
    default: 0,
  },
  baths: {
    type: Number,
    default: 0,
  },
  features: [{
    type: String,
  }],
  images: [{
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  }],
  location: {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isDuplicate: {
    type: Boolean,
    default: false,
  },
  duplicateScore: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
})

// Index for search
propertySchema.index({ title: 'text', description: 'text' })

module.exports = mongoose.model('Property', propertySchema)