import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectCard from './shared/ProjectCard';

/**
 * Projects section.
 *
 * @param {boolean} showCTA - When true (homepage), only renders homepage-flagged
 *                            projects and shows the "View All Projects" CTA.
 *                            When false (projects page), renders every project.
 */
export default function Projects({ showCTA = false }) {
  const displayProjects = showCTA
    ? projects.filter((p) => p.homepage)
    : projects;

  return (
    <div className="bg-black px-5 lg:px-28 py-8 my-8 lg:py-16 lg:my-16" id="projects">
      <h2 className="text-2xl lg:text-4xl text-center text-white">
        My <span className="font-extrabold">Projects</span>
      </h2>

      <div className="lg:mt-16 mt-8 lg:space-y-24 space-y-12 lg:pb-6 pb-3">
        {displayProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {showCTA && (
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link to="/projects" className="relative inline-block px-6 py-3 font-semibold group">
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-white group-hover:-translate-x-0 group-hover:-translate-y-0" />
            <span className="absolute inset-0 w-full h-full bg-black border-2 border-white group-hover:bg-white" />
            <span className="relative text-white group-hover:text-black">
              View All Projects
            </span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
