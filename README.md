# Make My Land 🌍

> **India's Trusted Platform for Buying and Selling Verified Land**

A premium, professional land marketplace built with modern web technologies. Connecting buyers, sellers, and investors with verified land opportunities across India.

---

## ✨ Features

### 🏠 User-Facing Features
- **Professional Landing Page** - Modern hero section with statistics and trust badges
- **Advanced Search** - Filter land by location, price, area, and type
- **Buy/Sell Forms** - Comprehensive property listing with area unit scaling
- **Property Showcase** - Interactive property cards with hover effects
- **Testimonials** - Real user stories with star ratings
- **24/7 Support** - Responsive design with accessibility

### 🔧 Technical Features
- **Responsive Design** - Works seamlessly on all devices
- **Dark/Light Theme** - User preference toggle
- **Animation Effects** - Smooth transitions and entrance animations
- **Glass-morphism UI** - Modern aesthetic with blur effects
- **Authentication** - JWT-based user login and registration
- **Admin Dashboard** - Analytics and property management
- **Express API** - RESTful backend with MongoDB
- **File Upload** - Cloudinary integration for property images

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Modern web browser

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cat > .env <<'EOF'
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/makemyland
JWT_SECRET=your-secure-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EOF
```

### 3. Start Backend Server
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

### 4. Serve Frontend
Open the frontend directory with a static server:
```bash
# Using Python
python -m http.server 8000

# Or using Node
npx http-server ./frontend -p 8000
```
Frontend will be available at `http://localhost:8000`

---

## 📁 Project Structure

```
make-my-land/
├── frontend/                 # Frontend website
│   ├── index.html           # Home page
│   ├── buy.html             # Buy land form
│   ├── sell.html            # Sell land form
│   ├── property.html        # Property details
│   ├── about.html           # About page
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── dashboard.html       # User dashboard
│   ├── css/
│   │   ├── style.css        # Main styles
│   │   ├── responsive.css   # Mobile styles
│   │   └── animations.css   # Animation effects
│   ├── js/
│   │   └── app.js           # Frontend logic
│   ├── images/
│   │   └── logo.png         # Brand logo
│   └── manifest.json        # PWA manifest
│
└── backend/                  # Express API
    ├── models/              # MongoDB schemas
    ├── routes/              # API routes
    ├── controllers/         # Business logic
    ├── middleware/          # Auth & validation
    ├── server.js            # Entry point
    ├── .env                 # Configuration
    └── package.json         # Dependencies
```

---

## 🎨 Design Highlights

- **Color Scheme** - Professional green (#0f3d2e) with gold accents (#d4af37)
- **Typography** - Clear, readable fonts with proper hierarchy
- **Interactive Elements** - Hover effects, smooth animations, visual feedback
- **Trust Indicators** - Security badges, testimonials, statistics
- **Professional Forms** - Clear labels, helpful placeholders, proper validation

---

## 🔐 Security

- JWT authentication with secure token storage
- Password hashing with bcrypt
- Environment variables for sensitive data
- CORS configuration for API security
- Input validation on both frontend and backend

---

## 🌐 Area Units Support

Support for multiple land measurement units:
- Square Feet (sq ft)
- Square Meters (sq m)
- Acres
- Hectares (ha)
- Bigha (Indian unit)
- Kattha (Indian unit)

---

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: Below 768px

---

## 🛠 Optional Integrations

### Google Maps
Update the API key in `property.html`:
```javascript
// Replace with your Google Maps API key
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

### Cloudinary Integration
Configure in backend `.env` for property image uploads.

### MongoDB Atlas
Use cloud database instead of local MongoDB:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/makemyland
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

For issues, suggestions, or questions:
- Email: support@makemyland.com
- Phone: +91-XXXX-XXXX-XX
- Location: New Delhi, India

---

**Built with ❤️ for land lovers across India**

# Make-my-land
