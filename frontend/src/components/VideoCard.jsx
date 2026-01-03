import React, { useState } from 'react';
import API_BASE from '../api';

function VideoCard({ video, onClick }) {
  const [likes, setLikes] = useState(video.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiked || isLiking) return;
    setIsLiking(true);

    try {
      const response = await fetch(`${API_BASE}/api/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id })
      });

      const data = await response.json();
      if (data.success) {
        setLikes(data.likes);
        setIsLiked(true);
      }
    } catch (error) {
      console.log('Error:', error);
      alert('Unable to like the video. Please try again.');
    }
    setIsLiking(false);
  };

  return (
    <div 
      onClick={onClick}
      className="relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 flex-shrink-0"
      style={{ width: '200px', height: '280px' }}
    >

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoading(false)}
      />


      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

  
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
          {video.title}
        </h3>
        
   
        <div className="flex items-center gap-3 text-xs text-gray-300">

          <div className="flex items-center gap-1">
            <span>👁️</span>
            <span>{video.views || 1234}</span>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
            disabled={isLiking}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{likes}</span>
          </button>

  
          <div className="flex items-center gap-1">
            <span>↗️</span>
            <span>{video.shares}</span>
          </div>

          <div className="flex items-center gap-1">
            <span>💬</span>
            <span>{video.comments?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/50 rounded-full p-3">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
