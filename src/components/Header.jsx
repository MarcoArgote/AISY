import { motion, AnimatePresence } from 'framer-motion';
import { Music4, Sparkles, Menu, X, User, LogOut, ShoppingBag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const R2_BASE_URL = "https://pub-089c50aada404ece8b78efd1892e21d1.r2.dev";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const profileMenuRef = useRef(null);

  // Cerrar menú de perfil al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const baseMenuItems = [
    { to: '/', label: 'Productores', type: 'link' },
    { to: '#licenses', label: 'Licencias', type: 'scroll' },
    { to: '#contact', label: 'Contacto', type: 'scroll' }
  ];

  const menuItems = isAuthenticated 
    ? baseMenuItems
    : [...baseMenuItems, { to: '/login', label: 'Login', type: 'link' }];

  const handleMenuClick = (item) => {
    setIsMenuOpen(false);
    
    if (item.type === 'scroll') {
      // Si no estamos en la página principal, navegar primero
      if (location.pathname !== '/') {
        window.location.href = '/' + item.to;
      } else {
        // Estamos en home, hacer scroll
        setTimeout(() => {
          const element = document.querySelector(item.to);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  const handleProductoresClick = (e) => {
    if (e) e.preventDefault();
    setIsMenuOpen(false);
    
    if (location.pathname === '/') {
      // Ya estamos en home, scroll al top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Ir a home
      window.location.href = '/';
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
          <motion.div
            onClick={handleProductoresClick}
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
              ) : item.to === '/' ? (
                <motion.button
                  key={item.to}
                  onClick={handleProductoresClick}
                  className={`text-gray-300 hover:text-white transition-colors font-medium ${
                    location.pathname === item.to ? 'text-white' : ''
                  }`}
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

          {/* Desktop User Menu / CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <motion.button
                  onClick={toggleProfileMenu}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 glass-effect px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-white">{user?.username || user?.email?.split('@')[0]}</span>
                </motion.button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 glass-effect rounded-xl border border-white/10 overflow-hidden shadow-xl"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm text-gray-400">Sesión iniciada como</p>
                        <p className="font-medium text-white truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Rol: {user?.role || 'Usuario'}</p>
                      </div>
                      
                      <div className="p-2">
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setIsProfileMenuOpen(false)}>
                            <motion.button
                              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>Panel Admin</span>
                            </motion.button>
                          </Link>
                        )}
                        
                        <Link to="/dashboard" onClick={() => setIsProfileMenuOpen(false)}>
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:text-white transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Mis Compras</span>
                          </motion.button>
                        </Link>
                        
                        <motion.button
                          onClick={handleLogout}
                          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-400 hover:text-red-300 transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={handleProductoresClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 btn-primary"
              >
                <Sparkles className="w-4 h-4" />
                Explorar
              </motion.button>
            )}
          </div>

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
                  ) : item.to === '/' ? (
                    <motion.button
                      key={item.to}
                      onClick={handleProductoresClick}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`text-gray-300 hover:text-white transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/5 text-left ${
                        location.pathname === item.to ? 'text-white bg-white/5' : ''
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
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
                
                {/* User section mobile */}
                {isAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-3 rounded-lg glass-effect border border-primary/20"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user?.username || user?.email?.split('@')[0]}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                      
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors mb-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Mis Compras
                        </motion.button>
                      </Link>
                      
                      <motion.button
                        onClick={handleLogout}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </motion.button>
                    </motion.div>
                  </>
                ) : (
                  <motion.button
                    onClick={handleProductoresClick}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 btn-primary justify-center mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Explorar
                  </motion.button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
