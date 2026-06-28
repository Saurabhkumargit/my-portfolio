import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbChevronLeft, TbChevronRight, TbX } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

/**
 * ImageSlideshow component displays a list of screenshots.
 * It features auto-play (with pause on hover), dot indicators,
 * slide transitions, and programmatic navigation on click.
 * If linkTo is not provided, clicking the image opens a full-screen Lightbox.
 *
 * @param {string[]} images  - Array of image source paths
 * @param {string} title     - Project title (used for alt text)
 * @param {string} [linkTo]  - Optional route to navigate to on image click
 */
export default function ImageSlideshow({ images, title, linkTo }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Autoplay effect
  useEffect(() => {
    if (!isHovered && images.length > 1 && !isLightboxOpen) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 4000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovered, images.length, handleNext, isLightboxOpen]);

  // Keyboard navigation & body scroll lock for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, images.length]);

  const handleDotClick = (index, e) => {
    if (e) e.stopPropagation();
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    if (linkTo) {
      navigate(linkTo);
    } else {
      setLightboxIndex(currentIndex);
      setIsLightboxOpen(true);
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? '100%' : dir > 0 ? '-100%' : 0,
      opacity: 0,
    }),
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div
        className="relative w-full h-full overflow-hidden bg-zinc-950 group/slideshow select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slide Image Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${title} Screenshot ${currentIndex + 1}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 220, damping: 26 },
                opacity: { duration: 0.3 },
              }}
              onClick={handleImageClick}
              className="absolute w-full h-full object-cover select-none cursor-pointer"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Slide Index Badge (e.g. 1/8) */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-sm border border-zinc-800 text-zinc-300 text-xs rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 text-white border border-zinc-800 hover:bg-white hover:text-black opacity-0 group-hover/slideshow:opacity-100 transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous screenshot"
            >
              <TbChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 text-white border border-zinc-800 hover:bg-white hover:text-black opacity-0 group-hover/slideshow:opacity-100 transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Next screenshot"
            >
              <TbChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Navigation Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-zinc-800/40">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => handleDotClick(index, e)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-zinc-900/80 text-white/80 border border-zinc-800 hover:bg-white hover:text-black transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Close full view"
            >
              <TbX className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
            </button>

            {/* Lightbox Slide Container */}
            <div
              className="relative w-full max-w-5xl h-[75vh] md:h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image container
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={images[lightboxIndex]}
                  alt={`${title} Full Screenshot ${lightboxIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Lightbox Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-zinc-900/80 text-white border border-zinc-800 hover:bg-white hover:text-black transition-all shadow-lg cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Previous screenshot"
                  >
                    <TbChevronLeft className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => (prev + 1) % images.length);
                    }}
                    className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-zinc-900/80 text-white border border-zinc-800 hover:bg-white hover:text-black transition-all shadow-lg cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Next screenshot"
                  >
                    <TbChevronRight className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                  </button>
                </>
              )}
            </div>

            {/* Indicator / Counter */}
            {images.length > 1 && (
              <div className="mt-4 px-3 py-1 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-zinc-300 text-sm rounded-full">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
