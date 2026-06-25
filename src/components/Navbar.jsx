import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TbDownload } from 'react-icons/tb';
import { HiOutlineMenu, HiX } from 'react-icons/hi';
import logo from '../assets/logo.png';

const NAV_SECTIONS = ['about', 'skills', 'projects', 'experience', 'blog', 'contact'];

export default function Navbar() {
  const [hasShadow, setHasShadow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add shadow if scrolled past 0
      setHasShadow(currentScrollY > 0);

      // If mobile menu is open, don't hide navbar
      if (isOpen) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Threshold to prevent rapid toggle on tiny scrolls
      if (Math.abs(currentScrollY - lastScrollY) < 5) {
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavClick = (section) => {
    setIsOpen(false);
    if (isHome) {
      // On homepage: smooth-scroll to section
      const el = document.getElementById(section);
      if (el) window.scrollTo({ top: el.offsetTop - 110, behavior: 'smooth' });
    } else {
      // On other pages: navigate home, pass scroll target via state
      navigate('/', { state: { scrollTo: section } });
    }
  };

  const NavLinks = () =>
    NAV_SECTIONS.map((section) => (
      <motion.li key={section} className="group" whileHover={{ scale: 1.1 }}>
        <button onClick={() => handleNavClick(section)}>
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </button>
        <motion.span
          className="w-0 transition-all duration-300 group-hover:w-full h-[2px] bg-black flex"
          layout
        />
      </motion.li>
    ));

  const ResumeButton = ({ className = '' }) => (
    <motion.a
      href="/assets/SaurabhTiwari.resume.pdf"
      download="Saurabh_Kumar_Tiwari_Resume.pdf"
      className={`relative inline-block px-4 py-2 font-medium group ${className}`}
    >
      <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0" />
      <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black" />
      <span className="relative text-black group-hover:text-white flex items-center gap-x-3">
        Resume <TbDownload size={16} />
      </span>
    </motion.a>
  );

  return (
    <motion.nav
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: visible ? '0%' : '-100%', opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed lg:px-28 px-5 top-0 left-0 w-full z-50 bg-white p-5 transition-shadow duration-300 ${
        hasShadow ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo – always navigates to / and scrolls to top */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img className="h-9 cursor-pointer" src={logo} alt="Logo" />
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-x-7 font-semibold">
          <NavLinks />
        </ul>

        <ResumeButton className="hidden lg:inline-block" />

        {/* Mobile toggle */}
        <motion.button
          className="lg:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.2 }}
        >
          {isOpen ? <HiX /> : <HiOutlineMenu />}
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 right-0 h-full w-full bg-white shadow"
          >
            <button
              className="absolute top-5 right-5 text-2xl"
              onClick={() => setIsOpen(false)}
            >
              <HiX />
            </button>
            <ul className="flex flex-col items-start ml-16 mt-28 h-full gap-y-6 font-semibold">
              {NAV_SECTIONS.map((section) => (
                <motion.li key={section} className="border-b" whileHover={{ scale: 1.1 }}>
                  <button onClick={() => handleNavClick(section)}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </motion.li>
              ))}
              <ResumeButton className="font-semibold" />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
