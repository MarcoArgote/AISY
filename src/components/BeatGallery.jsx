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
        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mb-8 relative overflow-hidden"
        >
          <div className="glass-effect border-2 border-red-500/50 rounded-2xl p-6 md:p-8 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="relative z-10 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mb-3"
              >
                <span className="text-3xl md:text-5xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  🎉 ¡PROMOCIÓN AÑO NUEVO! 🎉
                </span>
              </motion.div>
              <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                50% DE DESCUENTO EN TODAS LAS LICENCIAS
              </h3>
              <p className="text-gray-300 text-sm md:text-base">
                ¡Aprovecha esta oferta especial de inicio de año y consigue tus beats favoritos al mejor precio!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4"
            animate={{
              backgroundImage: [
                'linear-gradient(to right, #06b6d4, #0ea5e9)',
                'linear-gradient(to right, #0ea5e9, #06b6d4)',
                'linear-gradient(to right, #06b6d4, #0ea5e9)',
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            AISY
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre nuestra colección de beats exclusivos.
          </p>
        </motion.div>

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
