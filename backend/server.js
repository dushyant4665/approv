
require('dotenv').config();  
const express = require('express');  
const cors = require('cors');


const app = express();  


app.use(cors()); 
app.use(express.json());  


const videoRoutes = require('./routes/videoRoutes');
app.use('/api', videoRoutes);  

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  // console.log(`📹 Videos API: http://localhost:${PORT}/api/videos`);
});
