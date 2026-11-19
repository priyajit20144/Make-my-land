const express = require('express');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const upload = req.app.locals.upload;
    const singleUpload = upload.single('file');
    singleUpload(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      const filePath = req.file.path;
      const isDemo = process.env.CLOUDINARY_CLOUD_NAME === 'demo';
      let secureUrl = `/uploads/${req.file.filename}`;

      if (!isDemo) {
        try {
          const result = await cloudinary.uploader.upload(filePath);
          secureUrl = result.secure_url;
        } catch (cloudErr) {
          console.error(cloudErr);
        }
      }

      fs.unlinkSync(filePath);
      res.json({ url: secureUrl });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
