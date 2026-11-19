const mongoose = require('mongoose');

const buyRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  budget: { type: Number, required: true },
  requiredArea: { type: Number, required: true },
  preferredLocation: { type: String, required: true },
  landType: { type: String, required: true },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: String, default: '' },
  reviewedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BuyRequest', buyRequestSchema);
