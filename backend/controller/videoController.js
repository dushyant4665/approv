// Import karo JSON file
const videosData = require('../data/videos.json');

// ========== GET ALL VIDEOS ==========
// Endpoint: GET /api/videos
// Kaam: Sab videos return karo

const getVideos = (req, res) => {
  try {
    // Simply videos array return kar do
    res.status(200).json({
      success: true,
      count: videosData.videos.length,
      videos: videosData.videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ========== LIKE VIDEO ==========
// Endpoint: POST /api/like
// Body: { videoId: 1 }
// Kaam: Video ka like count badhao

const likeVideo = (req, res) => {
  try {
    const { videoId } = req.body;
    
    // Validation: videoId hai ya nahi
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Video ID required'
      });
    }
    
    // Video dhundo
    const video = videosData.videos.find(v => v.id === parseInt(videoId));
    
    // Agar video nahi mila
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Like count badhao
    video.likes = video.likes + 1;
    
    // Response bhejo
    res.status(200).json({
      success: true,
      message: 'Video liked successfully',
      videoId: video.id,
      likes: video.likes
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ========== SHARE VIDEO ==========
// Endpoint: POST /api/share
// Body: { videoId: 1, platform: 'whatsapp' }
// Kaam: Share count badhao

const shareVideo = (req, res) => {
  try {
    const { videoId, platform } = req.body;
    
    // Validation
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Video ID required'
      });
    }
    
    // Video dhundo
    const video = videosData.videos.find(v => v.id === parseInt(videoId));
    
    // Agar video nahi mila
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Share count badhao
    video.shares = video.shares + 1;
    
    // Response bhejo
    res.status(200).json({
      success: true,
      message: `Video shared on ${platform || 'unknown platform'}`,
      videoId: video.id,
      shares: video.shares
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ========== ADD COMMENT ==========
// Endpoint: POST /api/comment
// Body: { videoId: 1, comment: 'Nice video!' }
// Kaam: Comment add karo

const addComment = (req, res) => {
  try {
    const { videoId, comment } = req.body;
    
    // Validation
    if (!videoId || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Video ID and comment required'
      });
    }
    
    // Video dhundo
    const video = videosData.videos.find(v => v.id === parseInt(videoId));
    
    // Agar video nahi mila
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Comment add karo
    const newComment = {
      id: video.comments.length + 1,
      text: comment,
      timestamp: new Date().toISOString()
    };
    
    video.comments.push(newComment);
    
    // Response bhejo
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
      totalComments: video.comments.length
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Export karo
module.exports = {
  getVideos,
  likeVideo,
  shareVideo,
  addComment
};