import { motion } from 'framer-motion';
import { useState } from 'react';
import BeatCard from './BeatCard';

export default function BeatGallery({ beats, onSelectBeat, currentBeat, isPlaying, onTogglePlay }) {
  const [filter, setFilter] = useState('all');

  const genres = ['all', ...new Set(beats.map(beat => beat.genre))];
  const filteredBeats = filter === 'all' ? beats : beats.filter(beat => beat.genre === filter);

  return (
    <section id="beats" className="py-12">
      <div className="container mx-auto px-4">
        {/* Genre Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {genres.map((genre, index) => (
            <motion.button
              key={genre}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(genre)}
              className={`px-6 py-3 rounded-full font-semibold transition-all
                ${filter === genre
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                  : 'bg-dark-light border border-white/10 text-gray-300 hover:border-primary/50'
                }`}
            >
              {genre === 'all' ? 'Todos' : genre}
            </motion.button>
          ))}
        </motion.div>

        {/* Beats Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredBeats.map((beat, index) => (
            <motion.div
              key={beat.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
            >
              <BeatCard
                beat={beat}
                onSelectBeat={onSelectBeat}
                isPlaying={isPlaying && currentBeat?.id === beat.id}
                onTogglePlay={onTogglePlay}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredBeats.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">No se encontraron beats en esta categoría.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
