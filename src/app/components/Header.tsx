"use client";

import Image from 'next/image';
import coupleImage from '../../../public/images/couple.png';
import { motion, useScroll, useTransform } from 'framer-motion';

const MotionDiv = motion.div as any;

export default function Header() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  return (
    <header className="relative h-[100vh] w-full overflow-hidden bg-[#fffaf0]">
      <MotionDiv 
        className="absolute inset-0 w-full h-full"
        style={{ 
          y,
          scale,
          backgroundImage: `url(${coupleImage.src})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <MotionDiv 
        className="relative h-full w-full flex items-center justify-center px-4"
        style={{ opacity }}
      >
        <MotionDiv 
          className="bg-black bg-opacity-30 rounded-lg text-white p-6 text-center backdrop-blur-sm w-full max-w-3xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-script mb-4">Kenneth & Jenna</h1>
          <p className="text-xl md:text-2xl">We're getting married!</p>
        </MotionDiv>
      </MotionDiv>
    </header>
  );
}
