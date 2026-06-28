import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaJs, FaReact, FaNodeJs, FaPython, FaDatabase, FaDocker, FaAws, FaLinux, FaNetworkWired, FaProjectDiagram, FaBolt } from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiCplusplus, SiTypescript, SiChakraui, SiExpress, SiMongodb, SiRedis, SiPrisma, SiKubernetes, SiGithubactions } from "react-icons/si";
import { TbApi, TbPlugConnected } from "react-icons/tb";

export default function Skills() {
  const [skills] = useState([
    { id: 1, name: "C++", icon: SiCplusplus },
    { id: 2, name: "JavaScript", icon: FaJs },
    { id: 3, name: "TypeScript", icon: SiTypescript },
    { id: 4, name: "Python", icon: FaPython },
    { id: 5, name: "SQL", icon: FaDatabase },
    
    { id: 6, name: "React", icon: FaReact },
    { id: 7, name: "Next.js", icon: RiNextjsFill },
    { id: 8, name: "Tailwind CSS", icon: RiTailwindCssFill },
    { id: 9, name: "Chakra UI", icon: SiChakraui },
    
    { id: 10, name: "Node.js", icon: FaNodeJs },
    { id: 11, name: "Express.js", icon: SiExpress },
    { id: 12, name: "REST APIs", icon: TbApi },
    { id: 13, name: "WebSockets", icon: TbPlugConnected },
    
    { id: 14, name: "PostgreSQL", icon: BiLogoPostgresql },
    { id: 15, name: "MongoDB", icon: SiMongodb },
    { id: 16, name: "Redis", icon: SiRedis },
    { id: 17, name: "Prisma", icon: SiPrisma },
    
    { id: 18, name: "Docker", icon: FaDocker },
    { id: 19, name: "Kubernetes", icon: SiKubernetes },
    { id: 20, name: "AWS", icon: FaAws },
    { id: 21, name: "GitHub Actions", icon: SiGithubactions },
    { id: 22, name: "Linux", icon: FaLinux },
    
    { id: 23, name: "System Design", icon: FaNetworkWired },
    { id: 24, name: "Concurrency", icon: FaProjectDiagram },
    { id: 25, name: "Event-Driven", icon: FaBolt },
  ]);

  return (
    <div className="my-8 lg:my-16 pb-16" id="skills">
      <div className="px-5 lg:px-28">

        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          My <span className="font-extrabold">Skills</span>
        </motion.h2>

        {/* Skill Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 text-center text-xs md:text-sm lg:text-base xl:text-lg font-bold mt-7 lg:mt-16 w-full place-items-center gap-y-6 lg:gap-y-12">
          {skills.map((skill) => {
            const IconComponent = skill.icon;
            return (
              <motion.div
                key={skill.id}
                className="bg-white border-2 hover:bg-black hover:text-white transition-all cursor-pointer border-black rounded p-3 w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 flex flex-col items-center justify-center gap-3 lg:gap-5"
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: (skill.id % 5) * 0.1 }}
                viewport={{ once: true }}
              >
                <IconComponent className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-current" />
                <p>{skill.name}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
