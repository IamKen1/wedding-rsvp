"use client";

import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.section 
      className="py-20 bg-white text-center relative"
      style={{ opacity, y }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-5xl font-bold">
          The Wedding of Kenneth & Jenna
        </h2>
        <motion.p 
          className="text-xl mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Saturday, January 24, 2026
        </motion.p>
        <motion.p 
          className="text-lg mt-4 text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          We're thrilled to invite you to celebrate with us!
        </motion.p>
      </motion.div>
    </motion.section>
  );
}
  