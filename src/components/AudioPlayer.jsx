import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';

export default function AudioPlayer({ currentBeat, isPlaying, onTogglePlay, onNext, onPrevious, allBeats, onClose }) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => console.log('Error playing audio:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentBeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => {
      if (allBeats.length > 1) {
        onNext();
      } else {
        onTogglePlay(currentBeat);
      }
    });

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => {});
    };
  }, [currentBeat, allBeats, onNext, onTogglePlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const width = progressBar.offsetWidth;
    const newProgress = (clickX / width) * 100;
    const newTime = (newProgress / 100) * duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(newProgress);
  };

  if (!currentBeat) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 glass-effect border-t border-white/20"
      >
        <audio
          ref={audioRef}
          src={currentBeat.audioFile}
          onError={(e) => {
            console.error('Error loading audio:', e);
          }}
        />

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          title="Cerrar reproductor"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Progress Bar */}
        <div
          className="h-1 bg-white/10 cursor-pointer group"
          onClick={handleProgressClick}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary relative"
            style={{ width: `${progress}%` }}
          >
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full 
                       opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.5 }}
            />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Beat Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <motion.img
                src={currentBeat.coverImage}
                alt={currentBeat.title}
                className="w-14 h-14 rounded-lg object-cover shadow-lg"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56"%3E%3Crect fill="%2306b6d4" width="56" height="56" rx="8"/%3E%3Ctext fill="%23fff" font-size="24" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E🎵%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="min-w-0">
                <h4 className="font-bold text-sm md:text-base truncate">{currentBeat.title}</h4>
                <p className="text-xs md:text-sm text-gray-400 truncate">
                  {currentBeat.producer} • {currentBeat.bpm} BPM
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 md:gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onPrevious}
                  disabled={allBeats.length <= 1}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onTogglePlay(currentBeat)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary to-secondary 
                           flex items-center justify-center shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 md:w-6 md:h-6" />
                  ) : (
                    <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onNext}
                  disabled={allBeats.length <= 1}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Time */}
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </motion.button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-24 accent-primary"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
