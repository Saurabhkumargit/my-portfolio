import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TbArrowLeft, TbClock, TbCalendar } from 'react-icons/tb';
import { blogs } from '../data/blogs';

/**
 * BlogArticlePage – renders a blog article from centralized data.
 *
 * Structure is designed for easy migration to Markdown/MDX:
 *  - article.title          → <h1>
 *  - article.date           → meta
 *  - article.readTime       → meta
 *  - article.tags           → tag pills
 *  - article.description    → summary lead-in
 *  - [placeholder body]     → swap with MDX content import when ready
 */
export default function BlogArticlePage() {
  const { slug } = useParams();
  const article = blogs.find((b) => b.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold mb-4">Article not found</h1>
          <p className="text-[#71717A] mb-8">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/blog"
            className="font-semibold hover:opacity-60 transition-opacity flex items-center gap-2 justify-center"
          >
            <TbArrowLeft size={18} /> Back to Blog
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-5 lg:px-28">
      {/* Back nav */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#71717A] hover:text-black transition-colors mb-10"
        >
          <TbArrowLeft size={16} /> All Articles
        </Link>
      </motion.div>

      <article className="max-w-3xl">
        {/* Tags */}
        <motion.div
          className="flex flex-wrap gap-2 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {article.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-semibold border-2 border-black rounded-full"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl lg:text-5xl font-extrabold leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {article.title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          className="flex items-center gap-6 text-sm text-[#71717A] font-semibold mb-10 border-b-2 border-zinc-100 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="flex items-center gap-1.5">
            <TbCalendar size={15} /> {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <TbClock size={15} /> {article.readTime}
          </span>
        </motion.div>

        {/* Summary / lead paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <p className="text-lg leading-relaxed text-[#3f3f46] font-medium border-l-4 border-black pl-5 mb-10">
            {article.description}
          </p>
        </motion.div>

        {/* ── Article body placeholder ──────────────────────────────────────
            To migrate to Markdown/MDX:
              1. Add a `content` field to src/data/blogs.js (MDX string or import)
              2. Replace this section with <MDXRenderer content={article.content} />
              3. No other component changes required.
        ─────────────────────────────────────────────────────────────────── */}
        <motion.div
          className="prose prose-zinc max-w-none space-y-6 text-[#71717A]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <p className="leading-relaxed">
            This article covers the key concepts, design decisions, and practical implementation
            details behind <strong className="text-black">{article.title}</strong>. The sections
            below outline the approach taken and the reasoning behind each technical choice.
          </p>

          {/* Placeholder sections — structured for MDX replacement */}
          {[
            { heading: 'Background & Motivation', body: 'Understanding why this topic matters and the specific problem it solves in modern backend engineering.' },
            { heading: 'Core Concepts', body: 'A breakdown of the fundamental ideas — how the underlying technology works and what makes it particularly suited to this use case.' },
            { heading: 'Implementation Walkthrough', body: 'Step-by-step guide through the actual code, configuration, and architecture. Each decision is explained in context.' },
            { heading: 'Results & Takeaways', body: 'Measured outcomes, performance benchmarks where applicable, and the lessons that can be applied to future projects.' },
          ].map(({ heading, body }, i) => (
            <div key={i} className="pt-4">
              <h2 className="text-xl font-extrabold text-black mb-2">{heading}</h2>
              <p className="leading-relaxed">{body}</p>
            </div>
          ))}

          {/* Expansion notice */}
          <div className="mt-10 p-5 border-2 border-dashed border-zinc-300 rounded-xl text-sm text-zinc-500">
            <strong className="text-black">📝 Note:</strong> The full article is currently being
            written and will be published here shortly. The structure above reflects the planned
            content outline. Subscribe or check back soon.
          </div>
        </motion.div>
      </article>
    </div>
  );
}
