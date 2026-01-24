import { motion, AnimatePresence } from 'framer-motion';
import { Music4, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
const R2_BASE_URL = "https://pub-089c50aada404ece8b78efd1892e21d1.r2.dev";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { to: '/', label: 'Productores', type: 'link' },
    { to: '#licenses', label: 'Licencias', type: 'scroll' },
    { to: '#contact', label: 'Contacto', type: 'scroll' },
    { to: '/login', label: 'Login', type: 'link' }
  ];

  const handleMenuClick = (item) => {
    setIsMenuOpen(false);
    if (item.type === 'scroll') {
      // Si no estamos en la página principal, ir primero
      if (location.pathname !== '/') {
        window.location.href = '/' + item.to;
      } else {
        const element = document.querySelector(item.to);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="sticky top-0 z-30 glass-effect border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src={`${R2_BASE_URL}/logoProds/logoMybeats.jpg`}
                alt="MyBeats Logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shadow-lg"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(6, 182, 212, 0.3)',
                    '0 0 40px rgba(103, 232, 249, 0.5)',
                    '0 0 20px rgba(6, 182, 212, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%2306b6d4" width="48" height="48" rx="12"/%3E%3Ctext fill="%23fff" font-size="24" font-family="Arial" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E🎵%3C/text%3E%3C/svg%3E';
                }}
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MyBeats
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">Beats para artistas Bolivianos</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              item.type === 'scroll' ? (
                <motion.button
                  key={item.to}
                  onClick={() => handleMenuClick(item)}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                >
                  <motion.div
                    className={`text-gray-300 hover:text-white transition-colors font-medium ${
                      location.pathname === item.to ? 'text-white' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              )
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 btn-primary"
            >
              <Sparkles className="w-4 h-4" />
              Explorar
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden w-10 h-10 rounded-lg glass-effect flex items-center justify-center"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-2 pt-4 pb-2">
                {menuItems.map((item, index) => (
                  item.type === 'scroll' ? (
                    <motion.button
                      key={item.to}
                      onClick={() => handleMenuClick(item)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-gray-300 hover:text-white transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/5 text-left"
                    >
                      {item.label}
                    </motion.button>
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => handleMenuClick(item)}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`text-gray-300 hover:text-white transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/5 ${
                          location.pathname === item.to ? 'text-white bg-white/5' : ''
                        }`}
                      >
                        {item.label}
                      </motion.div>
                    </Link>
                  )
                ))}
                <Link to="/" onClick={() => handleMenuClick({ type: 'link' })}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 btn-primary justify-center mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Explorar
                  </motion.div>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
