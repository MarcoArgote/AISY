import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingCart, Download, Music2, Sparkles } from 'lucide-react';

export default function BeatModal({ beat, onClose, isOpen }) {
  if (!beat) return null;

  const handlePurchase = (license) => {
    window.open('https://wa.link/go30pq', '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-6xl h-[85vh]"
          >
            <div className="h-full bg-dark-light rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="relative flex-shrink-0">
                <motion.img
                  src={beat.coverImage}
                  alt={beat.title}
                  className="w-full h-32 md:h-40 object-cover"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2306b6d4" width="400" height="400"/%3E%3Ctext fill="%23fff" font-size="48" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E🎵%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-light/80" />
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full glass-effect 
                           flex items-center justify-center hover:bg-red-500/20 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                <div className="absolute bottom-3 left-4 right-4">
                  <motion.h2
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl font-bold mb-1"
                  >
                    {beat.title}
                  </motion.h2>
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-300"
                  >
                    <span className="flex items-center gap-2">
                      <Music2 className="w-5 h-5" />
                      {beat.producer}
                    </span>
                    <span>•</span>
                    <span>{beat.bpm} BPM</span>
                    <span>•</span>
                    <span>{beat.key}</span>
                    <span>•</span>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-semibold">
                      {beat.genre}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
              {/* Tags */}
              <div className="px-4 md:px-6 py-3 border-b border-white/10">
                <div className="flex flex-wrap gap-2">
                  {beat.tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="px-3 py-1 bg-dark rounded-full text-xs md:text-sm font-medium border border-primary/30"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Licenses Grid */}
              <div className="p-4 md:p-6 pb-20">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  Elige tu Licencia
                </motion.h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {beat.licenses.map((license, index) => (
                    <motion.div
                      key={license.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className={`relative rounded-2xl p-4 md:p-6 border-2 transition-all
                        ${index === 1
                          ? 'border-primary bg-gradient-to-br from-primary/20 to-secondary/20'
                          : 'border-white/10 bg-dark hover:border-primary/50'
                        }`}
                    >
                      {/* Popular badge for Trackout */}
                      {index === 1 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                          className="absolute -top-3 -right-3 px-3 py-1 rounded-full 
                                   bg-gradient-to-r from-primary to-secondary text-xs font-bold"
                        >
                          POPULAR
                        </motion.div>
                      )}

                      {/* Discount Badge */}
                      <motion.div
                        initial={{ scale: 0, rotate: -12 }}
                        animate={{ scale: 1, rotate: -12 }}
                        transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                        className="absolute -top-3 -left-3 z-10"
                      >
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-xl border-2 md:border-3 border-dark">
                          <div className="text-center">
                            <div className="text-sm md:text-base font-black text-white leading-none">50%</div>
                            <div className="text-[8px] md:text-[9px] font-bold text-white">OFF</div>
                          </div>
                        </div>
                      </motion.div>

                      <h4 className="text-lg md:text-xl font-bold mb-2">{license.name}</h4>
                      
                      {/* Price with discount */}
                      <div className="mb-3 md:mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base md:text-lg text-gray-400 line-through">
                            {license.originalPrice} Bs
                          </span>
                          <span className="text-2xl md:text-3xl font-bold text-primary">
                            {license.price} Bs
                          </span>
                        </div>
                        <span className="inline-block px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded-full text-xs font-bold text-red-400">
                          ¡Ahorra {license.originalPrice - license.price} Bs!
                        </span>
                      </div>

                      <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                        {license.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 + featureIndex * 0.05 }}
                            className="flex items-start gap-2 text-xs md:text-sm"
                          >
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePurchase(license)}
                        className={`w-full py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base flex items-center justify-center gap-2
                          ${index === 1
                            ? 'btn-primary'
                            : 'btn-secondary'
                          }`}
                      >
                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                        Comprar Ahora
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Additional info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-4 md:mt-6 p-3 md:p-4 rounded-2xl glass-effect"
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <Download className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1 text-xs md:text-sm">Entrega Instantánea</h4>
                      <p className="text-gray-400 text-xs">
                        Recibe tu beat inmediatamente después de la compra. Incluye contrato de licencia 
                        y archivos en alta calidad.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* End scrollable content */}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
