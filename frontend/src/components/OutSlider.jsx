import React, { useEffect, useState, useRef } from 'react';
import VideoCard from './VideoCard';
import InnerSlider from './InnerSlider';

function OuterSlider() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Fetch videos from backend
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/videos' || 'https://approv-nine.vercel.app/api/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.log('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Video card click - open modal
  const handleVideoClick = (video, index) => {
    setSelectedVideo(video);
    setSelectedIndex(index);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  // Scroll left
  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -600,
      behavior: 'smooth'
    });
  };

  // Scroll right
  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 600,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Socially Approved
        </h1>
        <p className="text-gray-400">
          {videos.length} amazing videos
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative container mx-auto px-4">
        
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Videos Slider */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
        >
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video, index)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Inner Slider Modal */}
      {selectedVideo && (
        <InnerSlider
          videos={videos}
          initialIndex={selectedIndex}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default OuterSlider;
