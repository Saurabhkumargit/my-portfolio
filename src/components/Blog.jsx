import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogs } from '../data/blogs';
import BlogCard from './shared/BlogCard';

/**
 * Blog section.
 *
 * @param {boolean} showCTA - When true (homepage), only renders homepage-flagged
 *                            articles and shows the "View All Articles" CTA.
 *                            When false (blog page), renders every article.
 */
export default function Blog({ showCTA = false }) {
  const displayBlogs = showCTA ? blogs.filter((b) => b.homepage) : blogs;

  return (
    <div className="px-5 lg:px-28 my-8 lg:my-16" id="blog">
      <motion.h2
        className="text-2xl lg:text-4xl text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        My <span className="font-extrabold">Blog</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 lg:mt-16">
        {displayBlogs.map((article, index) => (
          <BlogCard key={article.id} article={article} index={index} />
        ))}
      </div>

      {showCTA && (
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/blog" className="relative inline-block px-6 py-3 font-semibold group">
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0" />
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black" />
            <span className="relative text-black group-hover:text-white">
              View All Articles
            </span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
