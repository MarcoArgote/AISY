import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaInstagram, FaSpotify, FaYoutube, FaMusic } from 'react-icons/fa';

function ProducerCard({ producer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link to={`/producer/${producer.id}`}>
        <div className="relative overflow-hidden rounded-2xl beat-card-gradient shadow-2xl border border-white/10">
          {/* Cover Image */}
          <div className="aspect-square overflow-hidden">
            <img
              src={producer.coverImage}
              alt={producer.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x400/1a1a1a/ffffff?text=${producer.name}`;
              }}
            />
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Producer Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-4 mb-3">
              <img
                src={producer.avatar}
                alt={producer.name}
                className="w-16 h-16 rounded-full border-2 border-primary object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/64/8b5cf6/ffffff?text=${producer.name.charAt(0)}`;
                }}
              />
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {producer.name}
                </h3>
                <p className="text-primary text-sm font-medium">
                  {producer.genre}
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {producer.bio}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FaMusic className="text-primary" />
                <span>{producer.totalBeats} beats</span>
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {producer.social.instagram && (
                  <a
                    href={`https://instagram.com/${producer.social.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaInstagram className="text-white" />
                  </a>
                )}
                {producer.social.spotify && (
                  <a
                    href={`https://open.spotify.com/artist/${producer.social.spotify}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaSpotify className="text-white" />
                  </a>
                )}
                {producer.social.youtube && (
                  <a
                    href={`https://youtube.com/${producer.social.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaYoutube className="text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* View Catalog Button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-sm font-semibold shadow-lg">
              Ver Catálogo
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProducerCard;
