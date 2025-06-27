import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const VideoPlayer = ({ lesson, onProgress, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
      
      if (onProgress) {
        onProgress(current, total);
      }
      
      // Mark as complete when 90% watched
      if (current / total >= 0.9 && onComplete) {
        onComplete();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const video = videoRef.current;
    video.currentTime = pos * video.duration;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
{/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover"
        onClick={togglePlay}
        poster={`https://picsum.photos/800/450?random=${lesson.id}`}
      >
        <source 
          src={lesson.videoUrl || `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: (!isPlaying || showControls) ? 1 : 0,
          scale: (!isPlaying || showControls) ? 1 : 0.8
        }}
        className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="bg-white/90 rounded-full p-4 shadow-lg">
            <ApperIcon name="Play" size={32} className="text-gray-800 ml-1" />
          </div>
        )}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showControls ? 1 : 0,
          y: showControls ? 0 : 20
        }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ApperIcon name={isPlaying ? "Pause" : "Play"} size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <ApperIcon name="Volume2" size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  setVolume(vol);
                  videoRef.current.volume = vol;
                }}
                className="w-16"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            
            <button
              onClick={() => {
                if (videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                }
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ApperIcon name="Maximize" size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoPlayer;