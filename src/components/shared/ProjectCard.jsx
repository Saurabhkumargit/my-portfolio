import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TbExternalLink } from 'react-icons/tb';
import { BsGithub } from 'react-icons/bs';

/**
 * ProjectCard – the alternating-row project card used on the homepage
 * and the dedicated /projects page.
 *
 * @param {object} project  - A single project object from src/data/projects.js
 * @param {number} index    - Position in the rendered list (drives alternation & animation)
 */
export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      className={`flex justify-between items-center gap-8 flex-col ${
        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 10, delay: 0.1 }}
      viewport={{ once: true }}
    >
      {/* Thumbnail */}
      <Link
        to={`/projects/${project.slug}`}
        className="lg:w-[50%] w-full rounded-2xl overflow-hidden border border-zinc-800 block"
      >
        <img
          className="w-full h-full hover:scale-105 transition-all duration-500 cursor-pointer object-cover"
          src={project.coverImage}
          alt={project.title}
        />
      </Link>

      {/* Info */}
      <div className="lg:w-[50%] lg:space-y-6 space-y-4">
        <h2 className="font-extrabold text-white mt-5 lg:mt-0 text-3xl lg:text-5xl opacity-20">
          {String(index + 1).padStart(2, '0')}
        </h2>

        <Link to={`/projects/${project.slug}`}>
          <p className="font-bold text-white text-2xl lg:text-3xl hover:opacity-80 transition-opacity">
            {project.title}
          </p>
        </Link>

        <p className="font-light text-sm/6 lg:text-base text-[#D4D4D8]">
          {project.shortDescription}
        </p>

        {project.metrics && project.metrics.length > 0 && (
          <ul className="list-disc ml-5 text-[#D4D4D8] text-sm lg:text-base font-light space-y-1">
            {project.metrics.map((metric, i) => (
              <li key={i}>{metric}</li>
            ))}
          </ul>
        )}

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.technologies.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-zinc-900 text-zinc-300 text-xs rounded-full border border-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-5 pt-4 flex-wrap">
          <a
            href={project.github}
            className="text-white hover:text-gray-400 transition-colors flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub size={20} />
            <span className="text-sm font-semibold">GitHub</span>
          </a>
          <a
            href={project.liveDemo}
            className="text-white hover:text-gray-400 transition-colors flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TbExternalLink size={22} />
            <span className="text-sm font-semibold">Live Demo</span>
          </a>
          <Link
            to={`/projects/${project.slug}`}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold"
          >
            Case Study →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
