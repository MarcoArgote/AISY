import { motion } from 'framer-motion';
import { MessageCircle, Send, Music } from 'lucide-react';

const contactLinks = [
  {
    name: "WhatsApp",
    icon: MessageCircle,
    url: "https://wa.link/go30pq",
    color: "from-green-500 to-green-600",
    hoverColor: "hover:shadow-green-500/50",
    description: "Chatea con nosotros"
  },
  {
    name: "Telegram",
    icon: Send,
    url: "https://t.me/aisybeatsbol",
    color: "from-blue-500 to-blue-600",
    hoverColor: "hover:shadow-blue-500/50",
    description: "Únete a nuestro canal"
  },
  {
    name: "TikTok",
    icon: Music,
    url: "#",
    color: "from-pink-500 to-purple-600",
    hoverColor: "hover:shadow-pink-500/50",
    description: "Muy pronto!"
  }
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-secondary/5 via-transparent to-transparent" />
      
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
            Contáctanos
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            ¿Tienes preguntas? Estamos aquí para ayudarte. Elige tu plataforma favorita
          </p>
        </motion.div>

        {/* Contact Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactLinks.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <motion.a
                key={contact.name}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative glass-effect rounded-2xl p-8 border border-white/10
                  ${contact.hoverColor} hover:shadow-2xl transition-all duration-300
                  group overflow-hidden
                `}
              >
                {/* Gradient Background */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${contact.color} opacity-0 
                  group-hover:opacity-20 transition-opacity duration-300
                `} />

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <motion.div
                    className={`
                      w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${contact.color} 
                      flex items-center justify-center mb-6 shadow-xl
                    `}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {contact.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-6">
                    {contact.description}
                  </p>

                  {/* CTA */}
                  <div className={`
                    inline-flex items-center gap-2 px-6 py-2 rounded-lg
                    bg-white/5 border border-white/10 group-hover:border-white/30
                    transition-all duration-300
                  `}>
                    <span className="text-sm font-semibold">Contactar</span>
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>

                {/* Animated Border Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                    backgroundSize: '200% 200%',
                  }}
                />
              </motion.a>
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
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-effect border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-300 text-sm">
              Respondemos en menos de 24 horas
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
