import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Experience() {
  const [experiences] = useState([
    {
      id: 1,
      company: "YourWebsite.shop",
      role: "Frontend Developer Intern",
      period: "Sep 2024 – Feb 2025",
      description: (
        <ul className="list-disc ml-5 space-y-2">
          <li>Built 23+ reusable UI components using React, Radix UI, and Framer Motion across production applications including Quiro, reducing design-to-development time by 35%.</li>
          <li>Developed and deployed a client-facing website Tatsat Yoga School using Next.js and Chakra UI, improving mobile usability across 10+ pages.</li>
          <li>Integrated 15+ REST API endpoints with centralized error handling and state management, reducing frontend runtime errors and improving reliability.</li>
          <li>Collaborated with backend engineers to define API contracts and data models, eliminating integration issues during deployment cycles.</li>
        </ul>
      ),
    },
  ]);

  return (
    <div className="bg-black w-full py-8 lg:py-16" id="experience">
      <motion.h2
        className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        My <span className="font-extrabold">Experience</span>
      </motion.h2>

      {/* Experience Cards */}
      <div className="px-5 lg:px-28 my-8 lg:mt-16 space-y-10">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="bg-black p-5 border border-[#D4D4D8] rounded-md hover:bg-[#27272A] transition-all cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: index * 0.2,
            }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between flex-col items-start lg:flex-row lg:items-center">
              <div className="flex items-center gap-5">
                <h2 className="font-semibold text-white text-base md:text-lg lg:text-xl xl:text-2xl">
                  {exp.role} at <span className="text-[#D4D4D8]">{exp.company}</span>
                </h2>
              </div>
              <span className="text-[#D4D4D8] font-semibold text-xs md:text-sm lg:text-base mt-4 lg:mt-0">
                {exp.period}
              </span>
            </div>
            <div className="text-[#D4D4D8] mt-6 text-xs md:text-sm lg:text-base font-light">
              {exp.description}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
