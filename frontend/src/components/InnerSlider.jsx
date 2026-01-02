import React, { useState, useRef, useEffect } from 'react';
import VideoControls from './VideoControls';

function InnerSlider({ videos, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(videos[currentIndex].likes);
  const [shares, setShares] = useState(videos[currentIndex].shares);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef(null);
  const currentVideo = videos[currentIndex];


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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;
    setIsLoading(true);

    // Stop any previous playback and reset UI
    try { if (!video.paused) video.pause(); } catch (err) { /* ignore */ }
    setIsPlaying(false);
    setProgress(0);

    const onCanPlay = () => {
      if (!mounted || !video.isConnected) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (mounted && video.isConnected) setIsPlaying(true);
        }).catch((err) => {
          console.warn('Play interrupted or blocked after canplay:', err);
          if (mounted) setIsPlaying(false);
        });
      } else {
        if (mounted) setIsPlaying(true);
      }
    };

    const handleLoadedData = () => {
      if (mounted) setIsLoading(false);
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);

    // trigger load in case the source changed
    try { video.load(); } catch (err) 

    return () => {
      mounted = false;
      try { video.pause(); } catch (err) 
      try { video.removeAttribute('src'); video.load(); } catch (err) 
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [currentIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [currentIndex]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video || !video.isConnected) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch((err) => {
          console.warn('Play interrupted or blocked:', err);
          setIsPlaying(false);
        });
      } else {
        setIsPlaying(true);
      }
    } else {
      if (!video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMuteToggle = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (percent) => {
    const video = videoRef.current;
    video.currentTime = (percent * video.duration);
  };

  const handleVideoClick = (index) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setLikes(videos[index].likes);
      setShares(videos[index].shares);
      setIsLiked(false);
      setProgress(0);
    }
  };

  const handleLike = async () => {
    if (isLiked) return;

    try {
      const response = await fetch('http://localhost:5000/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: currentVideo.id })
      });

      const data = await response.json();
      if (data.success) {
        setLikes(data.likes);
        setIsLiked(true);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleShare = async (platform) => {
    try {
      const response = await fetch('http://localhost:5000/api/share' || 'https://approv-nine.vercel.app/api/share', {
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
        const link = `${window.location.origin}/video/${currentVideo.id}`;
        navigator.clipboard.writeText(link);
        alert('Link copied!');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

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
      
  
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full z-50"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

   
      <div className="flex items-center justify-center gap-4 w-full max-w-7xl px-4">
        
        {visibleVideos.map(({ video, position, index }) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(index)}
            className={`relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
              position === 'center' 
                ? 'w-96 h-[600px] scale-100 z-10' 
                : 'w-64 h-[450px] scale-90 opacity-60 hover:opacity-80'
            }`}
          >
  
            {position === 'center' ? (
              <>
            
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                
          
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                />

            
                <VideoControls
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  progress={progress}
                  onPlayPause={handlePlayPause}
                  onMuteToggle={handleMuteToggle}
                  onSeek={handleSeek}
                />

           
                <div className="absolute top-4 left-4 right-4">
                  <h2 className="text-white text-xl font-bold mb-1">{video.title}</h2>
                  <p className="text-gray-300 text-sm">{video.description}</p>
                </div>

             
                <div className="absolute right-4 bottom-32 flex flex-col gap-4">
                  
                 
                  <button onClick={handleLike} className="flex flex-col items-center">
                    <div className={`p-3 rounded-full ${isLiked ? 'bg-red-500' : 'bg-white/20'}`}>
                      <span className="text-2xl">{isLiked ? '❤️' : '🤍'}</span>
                    </div>
                    <span className="text-white text-sm mt-1">{likes}</span>
                  </button>

                  
                  <div className="relative">
                    <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex flex-col items-center">
                      <div className="p-3 rounded-full bg-white/20">
                        <span className="text-2xl">↗️</span>
                      </div>
                      <span className="text-white text-sm mt-1">{shares}</span>
                    </button>

                    {showShareMenu && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-2 w-48">
                        <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded">
                          📱 WhatsApp
                        </button>
                        <button onClick={() => handleShare('facebook')} className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded">
                          📘 Facebook
                        </button>
                        <button onClick={() => handleShare('twitter')} className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded">
                          🐦 Twitter
                        </button>
                        <button onClick={() => handleShare('copy')} className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded">
                          🔗 Copy Link
                        </button>
                      </div>
                    )}
                  </div>

              
                  <button className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-white/20">
                      <span className="text-2xl">💬</span>
                    </div>
                    <span className="text-white text-sm mt-1">{video.comments?.length || 0}</span>
                  </button>
                </div>
              </>
            ) : (
              
              <>
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-sm">{video.title}</h3>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

   
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}

export default InnerSlider;
