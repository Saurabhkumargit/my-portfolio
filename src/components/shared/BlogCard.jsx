import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * BlogCard – used on the homepage blog preview section and the /blog page.
 *
 * @param {object}  article  - A single blog object from src/data/blogs.js
 * @param {number}  index    - Position in the list (drives animation delay)
 * @param {boolean} featured - When true (only 1 article shown), renders as a
 *                             wide horizontal "featured" card instead of the
 *                             standard vertical card.
 */
export default function BlogCard({ article, index, featured = false }) {
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
        className={`border-2 border-black rounded-md hover:bg-black hover:text-white transition-all duration-300 group block h-full ${
          featured
            ? 'flex flex-col md:flex-row gap-0'
            : 'flex flex-col justify-between p-6'
        }`}
      >
        {featured ? (
          <>
            {/* Featured: left panel – title + meta */}
            <div className="p-8 md:p-10 flex flex-col justify-between md:w-1/2 border-b-2 md:border-b-0 md:border-r-2 border-current">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-5 opacity-70">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {article.title}
                </h3>
                <p className="text-sm lg:text-base opacity-80 leading-relaxed">
                  {article.description}
                </p>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {article.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs border border-current rounded-full opacity-60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured: right panel – CTA */}
            <div className="p-8 md:p-10 flex flex-col justify-center items-center md:w-1/2 gap-4">
              <p className="text-sm opacity-60 text-center font-medium uppercase tracking-widest">
                Featured Article
              </p>
              <span className="inline-flex items-center gap-2 px-6 py-3 border-2 border-current rounded text-sm font-semibold group-hover:bg-white group-hover:text-black transition-all">
                Read Article →
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Standard vertical card */}
            <div>
              <div className="flex justify-between items-center text-[10px] md:text-xs font-semibold mb-4 opacity-70">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>

              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3">{article.title}</h3>
              <p className="text-xs md:text-sm lg:text-base opacity-80 mb-5 leading-relaxed">{article.description}</p>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] md:text-xs border border-current rounded-full opacity-60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </Link>
    </motion.div>
  );
}
