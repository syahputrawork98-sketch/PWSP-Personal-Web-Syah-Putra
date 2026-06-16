import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';
import '../styles/navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { locale, changeLanguage, t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/experience', label: t('nav.experience') },
    { path: '/credentials', label: t('nav.credentials') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/learn', label: t('nav.learn') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const menuVariants = {
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  const languageSelector = (
    <select 
      value={locale} 
      onChange={(e) => changeLanguage(e.target.value)} 
      className="lang-select"
      aria-label="Change language"
    >
      <option value="EN">EN</option>
      <option value="ID">ID</option>
      <option value="JA">JA</option>
    </select>
  );

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <BrandLogo />
        </Link>

        {/* Hamburger Toggle */}
        <button 
          className="hamburger" 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          type="button"
        >
          <motion.div animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} style={{ width: 24, height: 2, background: 'currentColor', marginBottom: 6 }} />
          <motion.div animate={isOpen ? { opacity: 0 } : { opacity: 1 }} style={{ width: 24, height: 2, background: 'currentColor', marginBottom: 6 }} />
          <motion.div animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} style={{ width: 24, height: 2, background: 'currentColor' }} />
        </button>

        {/* Desktop Menu */}
        <div className="nav-menu-desktop">
          <div className="nav-links-wrapper">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            {languageSelector}
            <button onClick={toggleTheme} className="theme-toggle" type="button" aria-label="Toggle theme">
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                className="overlay" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={closeMenu} 
              />
              <motion.div 
                className="nav-menu-mobile"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="mobile-menu-header">
                  <div className="mobile-brand">{t('nav.menu')}</div>
                  <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
                    &times;
                  </button>
                </div>
                <div className="nav-links-wrapper">
                  {navLinks.map((link) => (
                    <motion.div key={link.path} variants={linkVariants}>
                      <Link 
                        to={link.path} 
                        className={location.pathname === link.path ? 'active' : ''}
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.div className="nav-actions" variants={linkVariants}>
                  {languageSelector}
                  <button onClick={toggleTheme} className="theme-toggle" type="button" aria-label="Toggle theme">
                    {theme === 'dark' ? '🌙' : '☀️'}
                  </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
