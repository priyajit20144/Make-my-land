const express = require('express');
const BuyRequest = require('../models/BuyRequest');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const request = await BuyRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const requests = await BuyRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
