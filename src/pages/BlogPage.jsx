import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogs } from '../data/blogs';
import BlogCard from '../components/shared/BlogCard';

export default function BlogPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Page heading */}
      <div className="px-5 lg:px-28 mb-4 text-center">
        <motion.p
          className="text-[#71717A] text-xs md:text-sm font-semibold uppercase tracking-widest mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Technical Writing
        </motion.p>
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          All Articles
        </motion.h1>
        <motion.p
          className="text-[#71717A] text-sm md:text-base mt-4 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Deep-dives, guides, and lessons from building backend systems, cloud
          infrastructure, and real-time applications.
        </motion.p>
      </div>

      {/* Article grid */}
      <div className="px-5 lg:px-28 mt-12 lg:mt-20">
        {/* Future: tag/category filter bar */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((article, index) => (
            <BlogCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>

      {/* Back link */}
      <div className="px-5 lg:px-28 mt-14 flex justify-center">
        <Link
          to="/"
          className="text-sm font-semibold text-[#71717A] hover:text-black transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
