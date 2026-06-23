import React from 'react';
import { TbExternalLink } from "react-icons/tb";
import { BsGithub } from "react-icons/bs";
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: "DevBoard",
    description: "Cloud-native task management platform built with modern backend and DevOps practices. Features JWT authentication, PostgreSQL, Redis caching, Docker, and Kubernetes deployment with CI/CD pipelines.",
    metrics: [
      "HPA scaling from 2 to 5 pods",
      "500+ request load testing",
      "Sub-100ms P95 latency"
    ],
    tags: ["React", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "Grafana"],
    image: "/assets/project1.png",
    github: "#",
    live: "#"
  },
  {
    id: 2,
    title: "Real-Time Collaborative Code Editor",
    description: "Collaborative coding platform supporting synchronized multi-user editing. Features WebSockets, presence tracking, room architecture, reconnection logic, and event-driven synchronization.",
    metrics: [],
    tags: ["Node.js", "Socket.IO", "React", "WebSockets"],
    image: "/assets/project1.png",
    github: "#",
    live: "#"
  },
  {
    id: 3,
    title: "System Monitor",
    description: "Real-time system resource monitoring and alerting platform for distributed infrastructure.",
    metrics: [],
    tags: ["Node.js", "WebSockets", "Prometheus"],
    image: "/assets/project1.png",
    github: "#",
    live: "#"
  },
  {
    id: 4,
    title: "Inventory Manager",
    description: "Scalable inventory tracking system with role-based access control and detailed reporting.",
    metrics: [],
    tags: ["React", "Express", "MongoDB"],
    image: "/assets/project1.png",
    github: "#",
    live: "#"
  }
];

export default function Projects() {
  return (
    <div className="bg-black px-5 lg:px-28 py-8 my-8 lg:py-16 lg:my-16" id="projects">
      <h2 className="text-2xl lg:text-4xl text-center text-white">
        My <span className="font-extrabold">Projects</span>
      </h2>

      <div className="lg:mt-16 mt-8 lg:space-y-24 space-y-12 lg:pb-6 pb-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className={`flex justify-between items-center gap-8 flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 10, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="lg:w-[50%] w-full rounded-2xl overflow-hidden border border-zinc-800">
              <img
                className="w-full h-full hover:scale-105 transition-all duration-500 cursor-pointer object-cover"
                src={project.image}
                alt={project.title}
              />
            </div>

            <div className="lg:w-[50%] lg:space-y-6 space-y-4">
              <h2 className="font-extrabold text-white mt-5 lg:mt-0 text-3xl lg:text-5xl opacity-20">
                {String(project.id).padStart(2, "0")}
              </h2>
              <p className="font-bold text-white text-2xl lg:text-3xl">{project.title}</p>

              <p className="font-light text-sm/6 lg:text-base text-[#D4D4D8]">
                {project.description}
              </p>

              {project.metrics && project.metrics.length > 0 && (
                <ul className="list-disc ml-5 text-[#D4D4D8] text-sm lg:text-base font-light space-y-1">
                  {project.metrics.map((metric, i) => (
                    <li key={i}>{metric}</li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-zinc-900 text-zinc-300 text-xs rounded-full border border-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <a href={project.github} className="text-white hover:text-gray-400 transition-colors flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <BsGithub size={22} />
                  <span className="text-sm font-semibold">GitHub</span>
                </a>
                <a href={project.live} className="text-white hover:text-gray-400 transition-colors flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <TbExternalLink size={24} />
                  <span className="text-sm font-semibold">Live Demo</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
