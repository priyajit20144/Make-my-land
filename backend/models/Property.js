const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  area: { type: Number, required: true },
  areaScale: { type: String, default: 'sq-ft' }, // sq-ft, sq-m, acres, hectares, bigha, kattha
  village: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  landType: { type: String, default: 'Residential' },
  ownerName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  ownerPhone: { type: String, default: '' },
  address: { type: String, default: '' },
  images: [{ type: String }],
  video: { type: String, default: '' },
  documents: [{ type: String }],
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: true }, // Show on homepage by default
  status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
