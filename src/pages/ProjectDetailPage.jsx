import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsGithub } from 'react-icons/bs';
import { TbExternalLink, TbArrowLeft } from 'react-icons/tb';
import { projects } from '../data/projects';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-extrabold mb-4">Project not found</h1>
          <p className="text-[#71717A] mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="font-semibold hover:opacity-60 transition-opacity flex items-center gap-2 justify-center"
          >
            <TbArrowLeft size={18} /> Back to Projects
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
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#71717A] hover:text-black transition-colors mb-10"
        >
          <TbArrowLeft size={16} /> All Projects
        </Link>
      </motion.div>

      {/* Header */}
      <div className="max-w-4xl">
        <motion.p
          className="text-[#71717A] text-xs font-semibold uppercase tracking-widest mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {project.category} · {project.year}
        </motion.p>

        <motion.h1
          className="text-3xl lg:text-5xl font-extrabold leading-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {project.title}
        </motion.h1>

        <motion.p
          className="text-lg text-[#71717A] leading-relaxed mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {project.shortDescription}
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex gap-4 flex-wrap mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-semibold rounded border-2 border-black hover:bg-white hover:text-black transition-all"
          >
            <BsGithub size={18} /> GitHub
          </a>
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded border-2 border-black hover:bg-black hover:text-white transition-all"
          >
            <TbExternalLink size={18} /> Live Demo
          </a>
        </motion.div>
      </div>

      {/* Cover image */}
      <motion.div
        className="rounded-2xl overflow-hidden border-2 border-zinc-200 mb-16 w-full max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full object-cover"
        />
      </motion.div>

      <div className="max-w-4xl space-y-14">
        {/* Full description */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-extrabold mb-5">Overview</h2>
          <div className="text-[#71717A] leading-relaxed space-y-4">
            {project.fullDescription.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </motion.section>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-extrabold mb-5">Performance Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="border-2 border-black rounded-xl p-5 text-sm font-semibold"
                >
                  {metric}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Technologies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-extrabold mb-5">Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 border-2 border-black rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Case study placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-l-4 border-black pl-6 py-2"
        >
          <h2 className="text-2xl font-extrabold mb-3">Engineering Case Study</h2>
          <p className="text-[#71717A] leading-relaxed">
            A detailed write-up covering architecture decisions, challenges faced, and lessons
            learned is being prepared. Check back soon — or read the related{' '}
            <Link to="/blog" className="font-semibold underline hover:opacity-60 transition-opacity">
              blog articles
            </Link>{' '}
            for in-depth technical coverage.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
