import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Datos de sponsors (puedes reemplazar con logos reales)
const sponsors = [
  { name: "AISY", logo: "/beats/covers/logo.png" },
  { name: "YAPE", logo: "/beats/covers/yape.jpg" },
  { name: "YOLOPAGO", logo: "/beats/covers/yolopago.png" },
  { name: "Atlantic Records", logo: "/beats/covers/bnb.jpg" },
  { name: "Def Jam", logo: "/beats/covers/mercantil.png" },
  { name: "Interscope", logo: "/beats/covers/sol.jpg" },
  { name: "Capitol Records", logo: "/beats/covers/bol.png" },
  { name: "Columbia Records", logo: "/beats/covers/spoti.png" },
];

export default function SponsorsSection() {
  // Detectar si es móvil
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Duplicamos los sponsors múltiples veces para el efecto infinito sin saltos
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <section className="py-16 mt-16 relative overflow-hidden">
      {/* Scrolling Container */}
      <div className="relative">
        <motion.div
          className="flex gap-8 md:gap-16 items-center"
          animate={{
            x: ['-25%', '-50%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: isMobile ? 10 : 25,
              ease: "linear",
            },
          }}
        >
          {duplicatedSponsors.map((sponsor, index) => (
            <motion.div
              key={`${sponsor.name}-${index}`}
              className="flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-12 md:h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                onError={(e) => {
                  // Fallback si la imagen no carga - muestra un placeholder con el nombre
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="h-12 md:h-16 px-6 flex items-center justify-center bg-white/5 rounded-lg border border-white/10"><span class="text-sm font-semibold text-gray-400">${sponsor.name}</span></div>`;
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
