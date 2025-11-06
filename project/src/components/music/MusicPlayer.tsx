import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface MusicPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  onClose?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  tracks, 
  currentTrackIndex, 
  onTrackChange,
  onClose 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentTrack?.preview_url) {
      audioRef.current.src = currentTrack.preview_url;
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack?.preview_url) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    onTrackChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    onTrackChange(newIndex);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      <div className="flex items-center space-x-4">
        {/* Album Art */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex-shrink-0">
          {currentTrack.album.images[0] ? (
            <img
              src={currentTrack.album.images[0].url}
              alt={currentTrack.album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Volume2 className="text-neutral-400" size={24} />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-neutral-800 dark:text-white truncate">
            {currentTrack.name}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
            {currentTrack.artists.map(artist => artist.name).join(', ')}
          </p>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <SkipBack size={18} className="text-neutral-600 dark:text-neutral-400" />
          </button>
          
          <button
            onClick={togglePlayPause}
            disabled={!currentTrack.preview_url}
            className="p-3 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <Pause size={20} className="text-white" />
            ) : (
              <Play size={20} className="text-white ml-0.5" />
            )}
          </button>
          
          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <SkipForward size={18} className="text-neutral-600 dark:text-neutral-400" />
          </button>

          <a
            href={currentTrack.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            title="Open in Spotify"
          >
            <ExternalLink size={18} className="text-neutral-600 dark:text-neutral-400" />
          </a>
        </div>
      </div>

      {!currentTrack.preview_url && (
        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm text-yellow-700 dark:text-yellow-400">
          Preview not available. Click the Spotify link to listen to the full track.
        </div>
      )}
    </motion.div>
  );
};

export default MusicPlayer;