import React from "react";
import { motion } from "framer-motion";
import { IoLogoLinkedin, IoLogoTwitter } from "react-icons/io5";
import { BiLogoGmail } from "react-icons/bi";
import { BsGithub } from "react-icons/bs";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  return (
    <div className="mt-20" id="home">
      <div className="flex justify-between py-10 items-center px-5 lg:px-28 lg:flex-row flex-col-reverse">

        <motion.div
          className="lg:w-[45%]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >

          <motion.div
            className="text-2xl lg:text-5xl flex flex-col mt-8 lg:mt-0 gap-2 lg:gap-5"
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
            <motion.h2 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              Hello, <TypeAnimation
                sequence={[
                  'I am Saurabh Kumar Tiwari',
                  1000,
                ]}
                speed={10}
                style={{ fontWeight:600 }}
                repeat={Infinity}
              />
            </motion.h2>
            <motion.h2 className="text-3xl lg:text-5xl leading-tight" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              Building scalable web applications, real-time systems, and{" "}
              <span
                className="text-white font-extrabold"
                style={{ WebkitTextStroke: "1px black" }}
              >
                cloud-native infrastructure.
              </span>
            </motion.h2>
          </motion.div>

          <motion.p
            className="text-[#71717A] text-sm lg:text-base mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Full Stack Engineer focused on Backend Systems, DevOps, Distributed Systems, and Modern Web Applications.
          </motion.p>

          <motion.div
            className="flex flex-col lg:flex-row items-start lg:items-center gap-5 mt-10 lg:mt-14"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <div className="flex gap-4">
              <a href="#projects" className="bg-black text-white px-6 py-3 rounded border-2 border-black font-semibold hover:bg-white hover:text-black transition-all">
                View Projects
              </a>
              <a href="/assets/resume.pdf" download="Saurabh_Kumar_Tiwari_Resume.pdf" className="bg-white text-black px-6 py-3 rounded border-2 border-black font-semibold hover:bg-black hover:text-white transition-all">
                Download Resume
              </a>
            </div>
            
            <div className="flex items-center gap-x-5 mt-4 lg:mt-0 lg:ml-4">
              {[
                { Icon: BiLogoGmail, link: "mailto:saurabhkumar.t21@gmail.com" },
                { Icon: IoLogoLinkedin, link: "#" },
                { Icon: BsGithub, link: "#" }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  className="bg-white p-2 lg:p-3 rounded border-2 border-black"
                  whileHover={{ scale: 1.1, backgroundColor: "#000", color: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:w-[55%] w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <img className="h-full w-full" src="/assets/hero-vector.svg" alt="Hero Vector" />
        </motion.div>
      </div>
    </div>
  );
}
