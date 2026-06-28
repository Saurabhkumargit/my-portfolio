import React from "react";
import { motion } from "framer-motion";
import { IoLogoLinkedin } from "react-icons/io5";
import { BiLogoGmail } from "react-icons/bi";
import { BsGithub } from "react-icons/bs";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  return (
    <div className="mt-20" id="home">
      {/*
        Mobile  : single column, SVG above text, no min-height, tight gap
        Desktop : two columns, side-by-side, fills viewport height
      */}
      <div className="
        flex flex-col gap-6
        lg:flex-row lg:justify-between lg:items-center lg:gap-0
        py-8 lg:min-h-[calc(100vh-5rem)]
        px-5 lg:px-28
      ">

        {/* ── Illustration (top on mobile, right on desktop) ── */}
        <motion.div
          className="order-1 lg:order-2 lg:w-[50%] w-full flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <img
            className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:w-full lg:max-w-none mx-auto object-contain"
            src="/assets/hero-vector.svg"
            alt="Hero Vector"
          />
        </motion.div>

        {/* ── Text content (bottom on mobile, left on desktop) ── */}
        <motion.div
          className="order-2 lg:order-1 lg:w-[48%] w-full"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Headings */}
          <motion.div
            className="flex flex-col gap-2 lg:gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2, ease: "easeInOut" },
              },
            }}
          >
            {/* Greeting – smaller than tagline */}
            <motion.h1
              className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-normal leading-snug"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              Hello,{" "}
              <TypeAnimation
                sequence={["I am Saurabh Kumar Tiwari", 1000]}
                speed={10}
                style={{ fontWeight: 600 }}
                repeat={Infinity}
              />
            </motion.h1>

            {/* Main tagline */}
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              Building scalable web applications, real-time systems, and{" "}
              <span
                className="text-white font-extrabold"
                style={{ WebkitTextStroke: "1px black" }}
              >
                cloud-native infrastructure.
              </span>
            </motion.h2>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-[#71717A] text-sm lg:text-base mt-4 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Full Stack Engineer focused on Backend Systems, DevOps, Distributed
            Systems, and Modern Web Applications.
          </motion.p>

          {/* CTAs + social */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 lg:mt-10 flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {/* Buttons */}
            <div className="flex flex-row gap-3">
              <a
                href="#projects"
                className="whitespace-nowrap bg-black text-white px-5 py-2.5 rounded border-2 border-black text-sm font-semibold hover:bg-white hover:text-black transition-all"
              >
                View Projects
              </a>
              <a
                href="/assets/SaurabhTiwari.resume.pdf"
                download="Saurabh_Kumar_Tiwari_Resume.pdf"
                className="whitespace-nowrap bg-white text-black px-5 py-2.5 rounded border-2 border-black text-sm font-semibold hover:bg-black hover:text-white transition-all"
              >
                Download Resume
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-x-3">
              {[
                { Icon: BiLogoGmail, link: "mailto:[EMAIL_ADDRESS]" },
                { Icon: IoLogoLinkedin, link: "https://www.linkedin.com/in/saurabhkumartiwari/" },
                { Icon: BsGithub, link: "https://github.com/Saurabhkumargit/" },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  className="bg-white p-2 sm:p-2.5 rounded border-2 border-black"
                  whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
