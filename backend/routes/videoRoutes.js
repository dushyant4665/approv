const express = require('express');
const router = express.Router();

const {
  getVideos,
  likeVideo,
  shareVideo,
  addComment
} = require('../controller/videoController.js');


router.get('/videos', getVideos);

router.post('/like', likeVideo);
router.post('/share', shareVideo);

router.post('/comment', addComment);

module.exports = router;
