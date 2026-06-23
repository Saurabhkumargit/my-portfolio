import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaJs, FaReact, FaNodeJs, FaPython, FaDatabase, FaDocker, FaAws, FaLinux, FaNetworkWired, FaProjectDiagram, FaBolt } from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiCplusplus, SiTypescript, SiChakraui, SiExpress, SiMongodb, SiRedis, SiPrisma, SiKubernetes, SiGithubactions } from "react-icons/si";
import { TbApi, TbPlugConnected } from "react-icons/tb";

export default function Skills() {
  const [skills] = useState([
    { id: 1, name: "C++", icon: <SiCplusplus size={50} /> },
    { id: 2, name: "JavaScript", icon: <FaJs size={50} /> },
    { id: 3, name: "TypeScript", icon: <SiTypescript size={50} /> },
    { id: 4, name: "Python", icon: <FaPython size={50} /> },
    { id: 5, name: "SQL", icon: <FaDatabase size={50} /> },
    
    { id: 6, name: "React", icon: <FaReact size={50} /> },
    { id: 7, name: "Next.js", icon: <RiNextjsFill size={50} /> },
    { id: 8, name: "Tailwind CSS", icon: <RiTailwindCssFill size={50} /> },
    { id: 9, name: "Chakra UI", icon: <SiChakraui size={50} /> },
    
    { id: 10, name: "Node.js", icon: <FaNodeJs size={50} /> },
    { id: 11, name: "Express.js", icon: <SiExpress size={50} /> },
    { id: 12, name: "REST APIs", icon: <TbApi size={50} /> },
    { id: 13, name: "WebSockets", icon: <TbPlugConnected size={50} /> },
    
    { id: 14, name: "PostgreSQL", icon: <BiLogoPostgresql size={50} /> },
    { id: 15, name: "MongoDB", icon: <SiMongodb size={50} /> },
    { id: 16, name: "Redis", icon: <SiRedis size={50} /> },
    { id: 17, name: "Prisma", icon: <SiPrisma size={50} /> },
    
    { id: 18, name: "Docker", icon: <FaDocker size={50} /> },
    { id: 19, name: "Kubernetes", icon: <SiKubernetes size={50} /> },
    { id: 20, name: "AWS", icon: <FaAws size={50} /> },
    { id: 21, name: "GitHub Actions", icon: <SiGithubactions size={50} /> },
    { id: 22, name: "Linux", icon: <FaLinux size={50} /> },
    
    { id: 23, name: "System Design", icon: <FaNetworkWired size={50} /> },
    { id: 24, name: "Concurrency", icon: <FaProjectDiagram size={50} /> },
    { id: 25, name: "Event-Driven", icon: <FaBolt size={50} /> },
  ]);

  return (
    <div className="mt-3 lg:mt-16 pb-16" id="skills">
      <div className="px-5 lg:px-28">

        <motion.h2
          className="text-2xl lg:text-4xl text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          My <span className="font-extrabold">Skills</span>
        </motion.h2>

        {/* Skill Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 text-center text-sm lg:text-lg font-bold mt-7 lg:mt-16 w-full place-items-center gap-y-6 lg:gap-y-12">
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              className="bg-white border-2 hover:bg-black hover:text-white transition-all cursor-pointer border-black rounded p-3 h-36 w-36 lg:h-44 lg:w-44 flex flex-col items-center justify-center gap-3 lg:gap-5"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: (skill.id % 5) * 0.1 }}
              viewport={{ once: true }}
            >
              {skill.icon}
              <p>{skill.name}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
