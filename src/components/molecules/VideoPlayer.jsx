import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";

const VideoPlayer = ({ lesson, onProgress, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  // Check if this is a YouTube video
  const isYouTubeVideo = lesson?.type === 'youtube' || 
    (lesson?.url && (lesson.url.includes('youtube.com') || lesson.url.includes('youtu.be')));

  // Extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youTubeVideoId = isYouTubeVideo ? getYouTubeVideoId(lesson.url || lesson.videoId) : null;

  useEffect(() => {
    if (!isYouTubeVideo && videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        if (onProgress) {
          onProgress(video.currentTime / video.duration);
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setIsLoading(false);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        if (onComplete) {
          onComplete();
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('loadstart', () => setIsLoading(true));
      video.addEventListener('loadeddata', () => setIsLoading(false));

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('loadstart', () => setIsLoading(true));
        video.removeEventListener('loadeddata', () => setIsLoading(false));
      };
    }
  }, [lesson, onProgress, onComplete, isYouTubeVideo]);

  const togglePlay = () => {
    if (!isYouTubeVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e) => {
    if (!isYouTubeVideo && videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const video = videoRef.current;
      video.currentTime = pos * video.duration;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (!isYouTubeVideo && videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // YouTube video component
  if (isYouTubeVideo && youTubeVideoId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="relative aspect-video bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youTubeVideoId}?enablejsapi=1&modestbranding=1&rel=0`}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
            onLoad={() => setIsLoading(false)}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="flex items-center gap-3 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span>Loading video...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
          {lesson.description && (
            <p className="text-gray-600 mb-4">{lesson.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ApperIcon name="Youtube" size={16} />
              <span>YouTube Video</span>
            </div>
            
            <button
              onClick={() => onComplete && onComplete()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ApperIcon name="CheckCircle" size={16} />
              Mark Complete
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular video player component
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative aspect-video bg-black group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={lesson?.videoUrl || '/placeholder-video.mp4'}
          poster={lesson?.thumbnail}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="flex items-center gap-3 text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span>Loading video...</span>
            </div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 rounded-full p-4 text-white hover:bg-opacity-70 transition-all"
          >
            <ApperIcon name={isPlaying ? 'Pause' : 'Play'} size={32} />
          </button>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-2 bg-white bg-opacity-30 rounded-full cursor-pointer mb-3"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-primary transition-colors">
                <ApperIcon name={isPlaying ? 'Pause' : 'Play'} size={20} />
              </button>
              
              <div className="flex items-center gap-2">
                <ApperIcon name="Volume2" size={16} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white bg-opacity-30 rounded-full appearance-none slider"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
        {lesson.description && (
          <p className="text-gray-600 mb-4">{lesson.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ApperIcon name="Play" size={16} />
            <span>Video Lesson</span>
            {lesson.duration && <span>• {lesson.duration} min</span>}
          </div>
          
          <button
            onClick={() => onComplete && onComplete()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <ApperIcon name="CheckCircle" size={16} />
            Mark Complete
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default VideoPlayer;