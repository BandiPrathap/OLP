// src/components/VideoPlayer.jsx
import { useState, useRef, useEffect } from 'react';
import { 
  PlayFill, 
  PauseFill, 
  VolumeUpFill, 
  VolumeMuteFill,
  Fullscreen,
  Clock,
  ArrowsAngleExpand
} from 'react-bootstrap-icons';
import { Badge } from 'react-bootstrap';

const VideoPlayer = ({ src, poster, title }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  useEffect(() => {
    const video = videoRef.current;
    
    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);
  
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    if (muted && newVolume > 0) setMuted(false);
  };
  
  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };
  
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const toggleFullscreen = () => {
    const container = document.querySelector('.video-player-container');
    
    if (!document.fullscreenElement) {
      container.requestFullscreen?.() || 
      container.webkitRequestFullscreen?.() || 
      container.msRequestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.() || 
      document.webkitExitFullscreen?.() || 
      document.msExitFullscreen?.();
      setIsFullscreen(false);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div 
      className="video-player-container bg-dark rounded position-relative overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-100"
        onClick={togglePlay}
      />
      
      {/* Video Title */}
      <div className="position-absolute top-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white">
        <h6 className="mb-0">{title}</h6>
      </div>
      
      {/* Controls Overlay */}
      <div 
        className={`position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="d-flex align-items-center mb-2">
          <small className="text-white me-2">{formatTime(currentTime)}</small>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-grow-1"
            style={{ cursor: 'pointer' }}
          />
          <small className="text-white ms-2">{formatTime(duration)}</small>
        </div>
        
        {/* Control Buttons */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-light p-1"
              onClick={togglePlay}
            >
              {isPlaying ? <PauseFill size={20} /> : <PlayFill size={20} />}
            </button>
            
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-sm btn-outline-light p-1 me-2"
                onClick={toggleMute}
              >
                {muted || volume === 0 ? <VolumeMuteFill size={18} /> : <VolumeUpFill size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                style={{ width: '80px', cursor: 'pointer' }}
              />
            </div>
          </div>
          
          <div className="d-flex align-items-center">
            <Badge bg="light" text="dark" className="me-3">
              <Clock size={12} className="me-1" />
              {formatTime(duration)}
            </Badge>
            
            <button 
              className="btn btn-sm btn-outline-light p-1"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <ArrowsAngleExpand size={18} /> : <Fullscreen size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;