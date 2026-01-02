
const videosData = require('../data/videos.json');

const getVideos = (req, res) => {
  try {

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



const likeVideo = (req, res) => {
  try {
    const { videoId } = req.body;
    

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Video ID required'
      });
    }
    

    const video = videosData.videos.find(v => v.id === parseInt(videoId));
    

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    

    video.likes = video.likes + 1;
    

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

const shareVideo = (req, res) => {
  try {
    const { videoId, platform } = req.body;
    
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Video ID required'
      });
    }
    
    const video = videosData.videos.find(v => v.id === parseInt(videoId));
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    video.shares = video.shares + 1;
    
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


const addComment = (req, res) => {
  try {
    const { videoId, comment } = req.body;
    
    if (!videoId || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Video ID and comment required'
      });
    }
    
    const video = videosData.videos.find(v => v.id === parseInt(videoId));
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    const newComment = {
      id: video.comments.length + 1,
      text: comment,
      timestamp: new Date().toISOString()
    };
    
    video.comments.push(newComment);
    
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

module.exports = {
  getVideos,
  likeVideo,
  shareVideo,
  addComment
};
