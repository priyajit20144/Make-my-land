const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const env = require('./config/env');

const app = express();
const DEFAULT_PORT = Number(env.PORT || 5000);
const rootDir = path.join(__dirname, '..', 'frontend');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.locals.upload = upload;

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

app.use('/uploads', express.static(uploadDir));
app.use(express.static(rootDir));

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const requestRoutes = require('./routes/requestRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Make My Land API is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/seed', async (req, res) => {
  const User = require('./models/User');
  const Property = require('./models/Property');
  const BuyRequest = require('./models/BuyRequest');
  try {
    await User.deleteMany({});
    await Property.deleteMany({});
    await BuyRequest.deleteMany({});
    res.json({ message: 'Seed data cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/dashboard-stats', (req, res) => {
  res.json({
    visitors: 15420,
    properties: 320,
    enquiries: 184,
    revenue: 4850000
  });
});

app.get('*', (req, res) => {
  const filePath = path.join(rootDir, 'index.html');
  res.sendFile(filePath);
});

const connectMongo = async () => {
  if (!env.MONGO_URI) {
    console.error('MongoDB connection string is missing. Set MONGO_URI in backend/.env');
    return;
  }

  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('MongoDB Atlas connection failed:', err.message);
  }
};

connectMongo();

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }
    console.error(error);
  });
};

startServer(DEFAULT_PORT);
