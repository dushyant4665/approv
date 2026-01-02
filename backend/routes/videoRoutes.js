const express = require('express');
const router = express.Router();

// Controller import karo
const {
  getVideos,
  likeVideo,
  shareVideo,
  addComment
} = require('../controller/videoController.js');

// ========== ROUTES ==========

// GET /api/videos - Sab videos lao
router.get('/videos', getVideos);

// POST /api/like - Video like karo
router.post('/like', likeVideo);

// POST /api/share - Video share karo
router.post('/share', shareVideo);

// POST /api/comment - Comment add karo
router.post('/comment', addComment);

// Export karo
module.exports = router;