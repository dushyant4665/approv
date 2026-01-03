import React, { useState, useRef, useEffect } from 'react';
import VideoControls from './VideoControls';
import API_BASE from '../api';

function InnerSlider({ videos, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(videos[currentIndex]?.likes || 0);
  const [shares, setShares] = useState(videos[currentIndex]?.shares || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef(null);
  const currentVideo = videos[currentIndex];

  // Get 3 videos (previous, current, next)
  const getVisibleVideos = () => {
    const visible = [];
    
    if (currentIndex > 0) {
      visible.push({
        video: videos[currentIndex - 1],
        position: 'left',
        index: currentIndex - 1
      });
    }
    
    visible.push({
      video: currentVideo,
      position: 'center',
      index: currentIndex
    });
    
    if (currentIndex < videos.length - 1) {
      visible.push({
        video: videos[currentIndex + 1],
        position: 'right',
        index: currentIndex + 1
      });
    }
    
    return visible;
  };

  // Video load and play - FIXED VERSION
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setIsPlaying(false);
    setProgress(0);

    // Handle when video can play
    const handleCanPlay = () => {
      setIsLoading(false);
      // Auto-play video
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log('Autoplay prevented:', error);
          setIsPlaying(false);
        });
    };

    // Add event listener
    video.addEventListener('canplay', handleCanPlay);

    // Load video
    video.load();

    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.pause();
    };
  }, [currentIndex]);

  // Progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        setProgress(percent);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
    };
  }, [currentIndex]);

  // Play/Pause handler
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.log('Play error:', error);
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Mute toggle
  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Seek video
  const handleSeek = (percent) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    
    video.currentTime = percent * video.duration;
  };

  // Switch video
  const handleVideoClick = (index) => {
    if (index === currentIndex) return;
    
    setCurrentIndex(index);
    setLikes(videos[index]?.likes || 0);
    setShares(videos[index]?.shares || 0);
    setIsLiked(false);
    setProgress(0);
  };

  // Like video
  const handleLike = async () => {
    if (isLiked) return;

    try {
      const response = await fetch(`${API_BASE}/api/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: currentVideo.id })
      });

      const data = await response.json();
      
      if (data.success) {
        setLikes(data.likes);
        setIsLiked(true);
      } else {
        alert('Like failed. Please try again.');
      }
    } catch (error) {
      console.log('Error:', error);
      alert('Unable to like. Please check your connection.');
    }
  };

  // Share video
  const handleShare = async (platform) => {
    try {
      const response = await fetch(`${API_BASE}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          videoId: currentVideo.id,
          platform 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShares(data.shares);
        setShowShareMenu(false);
        
        // Copy link
        const link = `${window.location.origin}/video/${currentVideo.id}`;
        navigator.clipboard.writeText(link)
          .then(() => alert('Link copied to clipboard!'))
          .catch(() => alert('Link: ' + link));
      } else {
        alert('Share failed. Please try again.');
      }
    } catch (error) {
      console.log('Error:', error);
      alert('Unable to share. Please check your connection.');
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const visibleVideos = getVisibleVideos();

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full z-50 transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 3 Videos Carousel */}
      <div className="flex items-center justify-center gap-4 w-full max-w-7xl px-4">
        
        {visibleVideos.map(({ video, position, index }) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(index)}
            className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
              position === 'center' 
                ? 'w-96 h-[600px] scale-100 z-10' 
                : 'w-64 h-[450px] scale-90 opacity-60 hover:opacity-80 cursor-pointer'
            }`}
          >
            {position === 'center' ? (
              <>
                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="absolute bottom-1/3 text-white text-sm">Loading video...</p>
                  </div>
                )}
                
                {/* Main Video */}
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  preload="metadata"
                />

                {/* Video Controls */}
                <VideoControls
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  progress={progress}
                  onPlayPause={handlePlayPause}
                  onMuteToggle={handleMuteToggle}
                  onSeek={handleSeek}
                />

                {/* Video Info */}
                <div className="absolute top-4 left-4 right-4 z-10">
                  <h2 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
                    {video.title}
                  </h2>
                  <p className="text-gray-300 text-sm drop-shadow-lg">
                    {video.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-10">
                  
                  {/* Like Button */}
                  <button 
                    onClick={handleLike} 
                    disabled={isLiked}
                    className="flex flex-col items-center"
                  >
                    <div className={`p-3 rounded-full transition-all ${
                      isLiked ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
                    }`}>
                      <span className="text-2xl">{isLiked ? '❤️' : '🤍'}</span>
                    </div>
                    <span className="text-white text-sm font-semibold mt-1 drop-shadow-lg">
                      {likes}
                    </span>
                  </button>

                  {/* Share Button */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareMenu(!showShareMenu)} 
                      className="flex flex-col items-center"
                    >
                      <div className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all">
                        <span className="text-2xl">↗️</span>
                      </div>
                      <span className="text-white text-sm font-semibold mt-1 drop-shadow-lg">
                        {shares}
                      </span>
                    </button>

                    {/* Share Menu */}
                    {showShareMenu && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-2 w-48 shadow-xl">
                        <button 
                          onClick={() => handleShare('whatsapp')} 
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition-colors"
                        >
                          📱 WhatsApp
                        </button>
                        <button 
                          onClick={() => handleShare('facebook')} 
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition-colors"
                        >
                          📘 Facebook
                        </button>
                        <button 
                          onClick={() => handleShare('twitter')} 
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition-colors"
                        >
                          🐦 Twitter
                        </button>
                        <button 
                          onClick={() => handleShare('copy')} 
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded transition-colors"
                        >
                          🔗 Copy Link
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Comments Button */}
                  <button className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all">
                      <span className="text-2xl">💬</span>
                    </div>
                    <span className="text-white text-sm font-semibold mt-1 drop-shadow-lg">
                      {video.comments?.length || 0}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              // Side videos (thumbnails)
              <>
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-sm drop-shadow-lg">
                    {video.title}
                  </h3>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Video Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}

export default InnerSlider;