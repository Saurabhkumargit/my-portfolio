import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * BlogCard – used on the homepage blog preview section and the /blog page.
 *
 * @param {object} article - A single blog object from src/data/blogs.js
 * @param {number} index   - Position in the list (drives animation delay)
 */
export default function BlogCard({ article, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delay: index * 0.15,
      }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link
        to={`/blog/${article.slug}`}
        className="border-2 border-black rounded-md p-6 hover:bg-black hover:text-white transition-all duration-300 flex flex-col justify-between group block h-full"
      >
        {/* Meta row */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-4 opacity-70">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>

          <h3 className="text-xl font-bold mb-3">{article.title}</h3>
          <p className="text-sm opacity-80 mb-5 leading-relaxed">{article.description}</p>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs border border-current rounded-full opacity-60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
