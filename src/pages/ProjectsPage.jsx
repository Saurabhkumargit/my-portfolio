import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectCard from '../components/shared/ProjectCard';
import SectionHeader from '../components/shared/SectionHeader';

const featuredProjects = projects.filter((p) => p.homepage);
const otherProjects = projects.filter((p) => !p.homepage);

export default function ProjectsPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Page heading */}
      <div className="px-5 lg:px-28 mb-4 text-center">
        <motion.p
          className="text-[#71717A] text-sm font-semibold uppercase tracking-widest mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Portfolio
        </motion.p>
        <motion.h1
          className="text-3xl lg:text-5xl font-extrabold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          All Projects
        </motion.h1>
        <motion.p
          className="text-[#71717A] mt-4 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          A collection of engineering projects spanning backend systems, DevOps,
          real-time applications, and full-stack development.
        </motion.p>
      </div>

      {/* ── Featured Projects ── */}
      {featuredProjects.length > 0 && (
        <section className="bg-black px-5 lg:px-28 py-12 mt-12 lg:py-20">
          <SectionHeader label="Featured" highlighted="Projects" light />
          <div className="lg:mt-16 mt-8 lg:space-y-24 space-y-12">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* ── Other Projects ── */}
      {otherProjects.length > 0 && (
        <section className="px-5 lg:px-28 py-12 mt-8 lg:py-20">
          <SectionHeader label="Other" highlighted="Projects" />

          {/* {/* Future: category filter bar */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 lg:mt-16">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="border-2 border-black rounded-2xl overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 12, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                {/* Thumbnail */}
                {project.coverImage && (
                  <Link to={`/projects/${project.slug}`} className="block overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full object-cover h-52 group-hover:scale-105 transition-all duration-500"
                    />
                  </Link>
                )}

                <div className="p-6 space-y-3">
                  <Link to={`/projects/${project.slug}`}>
                    <h3 className="font-bold text-xl hover:opacity-70 transition-opacity">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-[#71717A] text-sm leading-relaxed">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.technologies.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-xs rounded-full border border-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-2">
                    <a
                      href={project.github}
                      className="text-sm font-semibold hover:opacity-60 transition-opacity"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub →
                    </a>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-sm font-semibold hover:opacity-60 transition-opacity"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="px-5 lg:px-28 mt-10 flex justify-center">
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
