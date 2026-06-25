import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './Home';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Blog from '../components/Blog';
import Contact from '../components/Contact';

/**
 * HomePage – assembles all portfolio sections in order.
 * Also handles cross-route scroll-to-section navigation
 * (when Navbar nav items are clicked from /projects or /blog).
 */
export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      // Wait one tick for the DOM to fully render
      const timer = setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) window.scrollTo({ top: el.offsetTop - 110, behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <>
      <Home />
      <About />
      <Skills />
      <Projects showCTA />
      <Experience />
      <Blog showCTA />
      <Contact />
    </>
  );
}
