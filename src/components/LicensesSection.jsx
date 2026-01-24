import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star } from 'lucide-react';

const licenseTypes = [
  {
    id: 1,
    name: "Licencia MP3",
    price: 99,
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Formato MP3",
      "Derechos No Exclusivos",
      "2,000 Reproducciones",
      "1 Video Musical"
    ],
    popular: false
  },
  {
    id: 3,
    name: "Trackout",
    price: 120,
    icon: Crown,
    color: "from-yellow-500 to-orange-500",
    features: [
      "Formatos WAV + MP3",
      "Derechos No Exclusivos",
      "Reproducciones Ilimitadas",
      "Videos Musicales Ilimitados",
      "Soporte Prioritario"
    ],
    popular: true
  },
  {
    id: 4,
    name: "Derechos Exclusivos",
    price: 220,
    icon: Crown,
    color: "from-red-500 to-rose-500",
    features: [
      "Propiedad Exclusiva Completa",
      "Formatos WAV + MP3",
      "Reproducciones Ilimitadas",
      "Videos Ilimitados",
      "Soporte VIP Dedicado",
      "Beat retirado del catálogo"
    ],
    popular: false
  }
];

export default function LicensesSection() {
  return (
    <section id="licenses" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Nuestras Licencias
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elige la licencia que mejor se adapte a tus necesidades y lleva tu música al siguiente nivel
          </p>
        </motion.div>

        {/* Licenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {licenseTypes.map((license, index) => {
            const Icon = license.icon;
            return (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                {/* Popular Badge */}
                {license.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                  >
                    <span className="px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-xs font-bold text-white shadow-lg">
                      MÁS POPULAR
                    </span>
                  </motion.div>
                )}

                {/* Card */}
                <div className={`
                  relative h-full glass-effect rounded-2xl p-6 border
                  ${license.popular ? 'border-primary/50' : 'border-white/10'}
                  hover:border-primary/50 transition-all duration-300
                  overflow-hidden group
                `}>
                  {/* Gradient Background */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${license.color} opacity-0 
                    group-hover:opacity-10 transition-opacity duration-300
                  `} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${license.color} 
                               flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {license.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">
                        {license.price} Bs
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {license.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + idx * 0.05 }}
                          className="flex items-start gap-2 text-gray-300 text-sm"
                        >
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.a
                      href="https://wa.link/go30pq"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        w-full py-3 rounded-lg font-semibold transition-all duration-300
                        flex items-center justify-center
                        ${license.popular 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25' 
                          : 'bg-white/5 text-white hover:bg-white/10'
                        }
                      `}
                    >
                      Seleccionar
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-sm">
            ¿Necesitas una licencia personalizada? 
            <a href="#contact" className="text-primary hover:text-secondary transition-colors ml-1 font-semibold">
              Contáctanos
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
