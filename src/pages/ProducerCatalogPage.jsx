import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaInstagram, FaSpotify, FaYoutube } from 'react-icons/fa';
import { producersData, beatsByProducer } from '../data/producers';
import BeatGallery from '../components/BeatGallery';

function ProducerCatalogPage({ onSelectBeat, onTogglePlay, currentBeat, isPlaying }) {
  const { producerId } = useParams();
  
  // Find producer
  const producer = producersData.find(p => p.id === producerId);
  const beats = beatsByProducer[producerId] || [];

  // If producer doesn't exist, redirect
  if (!producer) {
    return <Navigate to="/" replace />;
  }

  const handleSelectBeat = (beat) => {
    onSelectBeat(beat, beats);
  };

  const handleTogglePlay = (beat) => {
    onTogglePlay(beat, beats);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft />
          <span>Volver a Productores</span>
        </Link>
      </div>

      {/* Producer Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 mb-16"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 md:p-12 border border-white/10">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3),transparent_50%)]" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src={producer.avatar}
              alt={producer.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary object-cover shadow-2xl"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/160/8b5cf6/ffffff?text=${producer.name.charAt(0)}`;
              }}
            />

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-white mb-2"
              >
                {producer.name}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-primary text-lg mb-4"
              >
                {producer.genre} • {producer.location}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-300 text-lg mb-6 max-w-2xl"
              >
                {producer.bio}
              </motion.p>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex gap-4 justify-center md:justify-start"
              >
                {producer.social.instagram && (
                  <a
                    href={`https://instagram.com/${producer.social.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 hover:bg-primary transition-colors"
                  >
                    <FaInstagram className="text-white text-xl" />
                  </a>
                )}
                {producer.social.spotify && (
                  <a
                    href={`https://open.spotify.com/artist/${producer.social.spotify}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 hover:bg-primary transition-colors"
                  >
                    <FaSpotify className="text-white text-xl" />
                  </a>
                )}
                {producer.social.youtube && (
                  <a
                    href={`https://youtube.com/${producer.social.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 hover:bg-primary transition-colors"
                  >
                    <FaYoutube className="text-white text-xl" />
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Beats Gallery */}
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Catálogo de Beats
          <span className="text-primary ml-3">({beats.length})</span>
        </motion.h2>

        {beats.length > 0 ? (
          <BeatGallery 
            beats={beats}
            onSelectBeat={handleSelectBeat}
            onTogglePlay={handleTogglePlay}
            currentBeat={currentBeat}
            isPlaying={isPlaying}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center py-20 bg-gray-900/50 rounded-xl"
          >
            <p className="text-gray-400 text-lg">
              Este productor aún no tiene beats disponibles
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProducerCatalogPage;
