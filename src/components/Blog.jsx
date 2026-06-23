import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Blog() {
  const [articles] = useState([
    {
      id: 1,
      title: "Deploying DevBoard on Kubernetes",
      date: "Feb 15, 2025",
      readTime: "8 min read",
      summary: "A comprehensive guide on deploying a cloud-native task management platform using Docker, Kubernetes, and GitHub Actions.",
    },
    {
      id: 2,
      title: "Building a Real-Time Collaborative Code Editor with Socket.IO",
      date: "Jan 10, 2025",
      readTime: "6 min read",
      summary: "Exploring WebSocket architecture, room-based state synchronization, and handling concurrent users in real-time.",
    },
    {
      id: 3,
      title: "Redis Caching Strategies in Node.js Applications",
      date: "Dec 05, 2024",
      readTime: "5 min read",
      summary: "Learn how to significantly improve API response times using various Redis caching patterns in Node.js.",
    },
  ]);

  return (
    <div className="px-5 lg:px-28 my-8 lg:my-16" id="blog">
      <motion.h2
        className="text-2xl lg:text-4xl text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        My <span className="font-extrabold">Blog</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 lg:mt-16">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            className="border-2 border-black rounded-md p-6 hover:bg-black hover:text-white transition-all duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: index * 0.2,
            }}
            viewport={{ once: true }}
          >
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-4 opacity-70">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{article.title}</h3>
              <p className="text-sm opacity-80 mb-6">{article.summary}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex justify-center mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        viewport={{ once: true }}
      >
        <button
          disabled
          className="px-6 py-3 border-2 border-gray-400 text-gray-500 rounded-md font-semibold cursor-not-allowed"
        >
          View All Articles
        </button>
      </motion.div>
    </div>
  );
}
