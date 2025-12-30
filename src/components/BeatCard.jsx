import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Pause, Music, DollarSign } from 'lucide-react';

export default function BeatCard({ beat, onSelectBeat, isPlaying, onTogglePlay }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isMobile ? { y: -10, transition: { duration: 0.3 } } : {}}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Card Container */}
      <div className="beat-card-gradient rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={beat.coverImage}
            alt={beat.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? 'brightness(0.7)' : 'brightness(1)'
            }}
            transition={{ duration: isMobile ? 0.2 : 0.4 }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2306b6d4" width="400" height="400"/%3E%3Ctext fill="%23fff" font-size="48" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E🎵%3C/text%3E%3C/svg%3E';
            }}
          />
          
          {/* Overlay with play button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: (isHovered || isMobile) ? 1 : 0 }}
            className={`absolute inset-0 flex items-center justify-center ${
              isMobile ? 'bg-transparent' : 'bg-black/50'
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay(beat);
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary 
                       flex items-center justify-center shadow-2xl hover:shadow-primary/50
                       md:opacity-100"
              animate={isMobile && !isPlaying ? {
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              } : {}}
              transition={isMobile && !isPlaying ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </motion.button>
          </motion.div>

          {/* Genre Badge */}
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ duration: isMobile ? 0.3 : 0.5 }}
            className="absolute top-4 left-4 px-3 py-1 rounded-full glass-effect text-sm font-semibold"
          >
            {beat.genre}
          </motion.div>

          {/* BPM Badge */}
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            transition={{ duration: isMobile ? 0.3 : 0.5 }}
            className="absolute top-4 right-4 px-3 py-1 rounded-full glass-effect text-sm font-semibold"
          >
            {beat.bpm} BPM
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="p-6 space-y-4">
          <div>
            <motion.h3
              className="text-2xl font-bold mb-1"
              animate={{ color: isHovered ? '#67e8f9' : '#ffffff' }}
            >
              {beat.title}
            </motion.h3>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Music className="w-4 h-4" />
              {beat.producer} • {beat.key}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {beat.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-dark-light rounded-full text-xs font-medium border border-primary/30"
              >
                #{tag}
              </motion.span>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold">
                Desde {beat.licenses[0].price} Bs
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectBeat(beat)}
              className="btn-primary text-sm"
            >
              Ver Licencias
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animated border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(103, 232, 249, 0.3)'
            : '0 0 0px rgba(6, 182, 212, 0)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
