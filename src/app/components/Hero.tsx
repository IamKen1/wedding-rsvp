"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useScroll, useTransform } from 'framer-motion';
import { MotionSection, MotionDiv, MotionP } from '@/types/motion';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <MotionSection 
      className="py-20 bg-white text-center relative"
      style={{ opacity, y }}
    >
      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4"
      >
        <h2 className="text-4xl md:text-5xl font-script text-forest-dark leading-relaxed">
          The Wedding of Kenneth &amp; Jenna
        </h2>
        <MotionP 
          className="text-xl md:text-2xl mt-6 font-medium text-forest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Saturday, January 24, 2026
        </MotionP>
        <MotionP 
          className="text-lg md:text-xl mt-4 text-forest-light font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          We&apos;re thrilled to invite you to celebrate with us!
        </MotionP>
      </MotionDiv>
    </MotionSection>
  );
}
  