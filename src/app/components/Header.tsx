"use client";

import coupleImage from '../../../public/images/couple.png';
import coupleCenterImage from '../../../public/images/couple_center.png';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionDiv = motion.div as any;

export default function Header() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className="relative h-screen w-full overflow-hidden bg-gradient-radial from-sage-200 via-mint to-sage-100">
      <MotionDiv 
        className="absolute inset-0 w-full h-full"
        style={{ 
          y,
          scale,
          backgroundImage: `url(${isMobile ? coupleCenterImage.src : coupleImage.src})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          minWidth: '100vw',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/10" />
      <MotionDiv 
        className="relative h-full w-full flex items-center justify-center px-4 z-10"
        style={{ opacity }}
      >
        <MotionDiv 
          className="bg-black/10 rounded-lg p-8 text-center w-full max-w-3xl mx-auto shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-script mb-4 text-white 
            drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] 
            [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
            Kenneth &amp; Jenna
          </h1>
          <p className="text-xl md:text-2xl text-white/90 tracking-wide font-light
            drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]
            [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
            We&apos;re getting married!
          </p>
        </MotionDiv>
      </MotionDiv>
    </header>
  );
}
