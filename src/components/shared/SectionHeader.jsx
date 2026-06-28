import React from 'react';
import { motion } from 'framer-motion';

/**
 * SectionHeader – animated h2 used consistently across all sections.
 * @param {string}  label       - The non-bold prefix text (e.g. "My")
 * @param {string}  highlighted - The extrabold suffix text (e.g. "Projects")
 * @param {boolean} light       - If true, renders in white (for dark-bg sections)
 */
export default function SectionHeader({ label, highlighted, light = false }) {
  return (
    <motion.h2
      className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center ${light ? 'text-white' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {label} <span className="font-extrabold">{highlighted}</span>
    </motion.h2>
  );
}
