import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div
      className="my-8 lg:my-16 px-5 lg:px-28 flex justify-between flex-col lg:flex-row"
      id="about"
    >
      <motion.div
        className="lg:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
        viewport={{ once: true }}
      >
        <img src="/assets/about-me.svg" alt="About Me Illustration" />
      </motion.div>

      <motion.div
        className="lg:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 10, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="lg:text-4xl text-2xl mt-4 lg:mt-0">
          About <span className="font-extrabold">Me</span>
        </h2>

        <p className="text-[#71717A] text-sm/6 lg:text-base mt-5 lg:mt-10">
          I'm a Full Stack Engineer focused on building scalable applications, backend systems, and cloud-native infrastructure.
        </p>

        <p className="text-[#71717A] text-sm/6 lg:text-base mt-3 lg:mt-5">
          I enjoy working on real-time applications, observability platforms, deployment automation, and modern web architectures. My goal is to build fault-tolerant systems and efficient CI/CD pipelines that streamline the engineering lifecycle.
        </p>

        <div className="mt-6 lg:mt-8 p-5 rounded border border-[#D4D4D8] bg-[#FAFAFA]">
          <h3 className="font-bold text-lg mb-2">Education</h3>
          <p className="font-semibold text-black">B.Tech Information Technology</p>
          <p className="text-[#71717A] text-sm">Bharati Vidyapeeth's College of Engineering</p>
          <div className="flex justify-between mt-2 text-sm text-[#71717A]">
            <span>Expected Graduation: 2027</span>
            <span className="font-semibold text-black">CGPA: 8.22</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
