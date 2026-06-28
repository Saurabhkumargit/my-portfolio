import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      {/* Animated 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 12 }}
      >
        <p
          className="text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-extrabold leading-none select-none"
          style={{ WebkitTextStroke: '2px black', color: 'transparent' }}
        >
          404
        </p>
      </motion.div>

      <motion.div
        className="space-y-4 -mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold">Page not found</h1>
        <p className="text-[#71717A] text-sm md:text-base max-w-sm mx-auto leading-relaxed">
          The page you're looking for doesn't exist, has been moved, or the URL is incorrect.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Link
            to="/"
            className="relative inline-block px-6 py-3 font-semibold group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0" />
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black" />
            <span className="relative text-black group-hover:text-white">
              ← Return Home
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
