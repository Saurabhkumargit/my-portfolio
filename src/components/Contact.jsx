import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BiLogoGmail } from "react-icons/bi";
import { BsGithub } from "react-icons/bs";
import { IoLogoLinkedin } from "react-icons/io5";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="lg:my-16 lg:px-28 my-8 px-5"
      id="contact"
    >
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl lg:text-4xl text-center"
      >
        Contact <span className="font-extrabold">Me</span>
      </motion.h2>

      <div className="flex justify-between items-center mt-8 lg:mt-16 flex-col-reverse lg:flex-row gap-12 lg:gap-0">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-[40%] flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-2xl">Connect with me</h3>
            <p className="text-[#71717A]">
              Feel free to reach out for collaborations, opportunities, or just
              a quick chat!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                Icon: BiLogoGmail,
                link: "mailto:saurabhkumar.t21@gmail.com",
                label: "saurabhkumar.t21@gmail.com",
              },
              { Icon: IoLogoLinkedin, link: "#", label: "LinkedIn Profile" },
              { Icon: BsGithub, link: "#", label: "GitHub Profile" },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                className="flex items-center gap-4 bg-white p-4 rounded border-2 border-black group"
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "#000",
                  color: "#fff",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <item.Icon className="w-6 h-6" />
                <span className="font-semibold">{item.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2"
        >
          <div className="font-extrabold text-2xl lg:text-5xl mt-5 lg:mt-0 space-y-1 lg:space-y-3">
            <h2>
              Let's{" "}
              <span
                className="text-white"
                style={{ WebkitTextStroke: "1px black" }}
              >
                talk
              </span>{" "}
              for
            </h2>
            <h2>Something special</h2>
          </div>

          <p className="text-[#71717A] text-sm/6 lg:text-base mt-3 lg:mt-6">
            I seek to push the limits of technology to create highly-scalable,
            fault-tolerant, and performant backend systems.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
