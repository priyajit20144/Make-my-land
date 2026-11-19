const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const BuyRequest = require('../models/BuyRequest');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { normalizeRequestStatus } = require('../utils/requestStatus');
const router = express.Router();

router.use(verifyToken, requireAdmin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBuyRequests = await BuyRequest.countDocuments();
    const pendingProperties = await Property.countDocuments({ verified: false });
    const pendingBuyRequests = await BuyRequest.countDocuments({ status: 'pending' });
    const approvedBuyRequests = await BuyRequest.countDocuments({ status: 'approved' });
    res.json({ totalProperties, totalUsers, totalBuyRequests, pendingProperties, pendingBuyRequests, approvedBuyRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Patch user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['buyer', 'seller', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all properties with admin details and optional filtering
router.get('/properties', async (req, res) => {
  try {
    const { search, verified, owner, landType } = req.query;
    const query = {};

    if (verified === 'true') query.verified = true;
    if (verified === 'false') query.verified = false;

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { village: regex },
        { district: regex },
        { ownerName: regex },
        { description: regex }
      ];
    }

    if (owner) {
      query.ownerName = { $regex: owner.trim(), $options: 'i' };
    }

    if (landType) {
      query.landType = landType.trim();
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get buy requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await BuyRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject buy requests
router.patch('/requests/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const normalizedStatus = normalizeRequestStatus(status);
    const request = await BuyRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: normalizedStatus,
        reviewedBy: req.user?.name || 'Admin',
        reviewedAt: new Date()
      },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Buy request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve property
router.post('/properties/:id/approve', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject / delete property
router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
