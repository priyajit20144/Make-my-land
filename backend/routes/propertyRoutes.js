const express = require('express');
const Property = require('../models/Property');
const router = express.Router();

// Get all properties (newest first)
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ featured: true, status: 'available' })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured properties for homepage
router.get('/featured', async (req, res) => {
  try {
    const featured = await Property.find({ featured: true, status: 'available' })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all properties for admin (including sold)
router.get('/all', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new property (from sell form)
router.post('/', async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update property (mark as sold, verify, etc.)
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
