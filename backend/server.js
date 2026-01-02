// ========== IMPORTS ==========
require('dotenv').config();  // .env file load karo
const express = require('express');  // Express framework
const cors = require('cors');  // Cross-origin requests allow karo

// ========== APP SETUP ==========
const app = express();  // Express app banao

// ========== MIDDLEWARE ==========
app.use(cors());  // Allow frontend to connect
app.use(express.json());  // JSON body parse karo

// ========== ROUTES ==========
const videoRoutes = require('./routes/videoRoutes');
app.use('/api', videoRoutes);  // /api prefix lagao

// ========== HOME ROUTE ==========
app.get('/', (req, res) => {
  res.json({
    message: 'Video Carousel API',
    endpoints: {
      videos: 'GET /api/videos',
      like: 'POST /api/like',
      share: 'POST /api/share',
      comment: 'POST /api/comment'
    }
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📹 Videos API: http://localhost:${PORT}/api/videos`);
});