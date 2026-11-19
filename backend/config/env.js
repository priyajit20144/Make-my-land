const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'make-my-land-secret',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'demo',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'demo'
};
