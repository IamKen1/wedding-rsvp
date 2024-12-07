"use client";

import coupleImage from '../../../public/images/couple.png';
import coupleCenterImage from '../../../public/images/couple_center.png';
import { motion, useScroll, useTransform, easeOut } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MotionDiv } from '@/types/motion';
import Image from 'next/image';

export default function Header() {
  const { scrollYProgress } = useScroll();

  const y = useTransform(scrollYProgress, 
    [0, 0.5],
    [0, 100],
    { 
      ease: easeOut
    }
  );
  
  const opacity = useTransform(scrollYProgress, 
    [0, 0.3], 
    [1, 0],
    {
      ease: easeOut
    }
  );
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const titleAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const subtitleAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.6
      }
    }
  };

  return (
    <header className="relative h-screen w-full overflow-hidden will-change-transform">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 z-10 will-change-transform" />
      
      <MotionDiv 
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ y }}
      >
        <Image
          src={isMobile ? coupleCenterImage : coupleImage}
          alt="Kenneth and Jenna"
          fill
          priority
          quality={75}
          className="object-cover"
          sizes="100vw"
        />
      </MotionDiv>

      <MotionDiv 
        className="relative h-full w-full flex items-center justify-center px-4 z-20 will-change-transform"
        style={{ opacity }}
      >
        <MotionDiv 
          className="text-center bg-black/5  rounded-xl p-8 md:p-12"
          initial="hidden"
          animate="visible"
        >
          <MotionDiv
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="w-24 h-[2px] bg-white mx-auto mb-10 shadow-glow"
          />

          <MotionDiv
            variants={titleAnimation}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-script text-white 
              drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] 
              [text-shadow:_2px_2px_4px_rgb(0_0_0_/_70%),_-1px_-1px_2px_rgb(0_0_0_/_60%),_0_0_20px_rgba(255,255,255,0.3)]
              leading-tight tracking-wider">
              Kenneth &amp; Jenna
            </h1>
          </MotionDiv>

          <MotionDiv
            variants={subtitleAnimation}
            className="space-y-6"
          >
            <p className="text-2xl md:text-3xl text-white font-medium tracking-wide
              drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
              [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%),_0_0_15px_rgba(255,255,255,0.2)]">
              We&apos;re getting married!
            </p>
            <p className="text-xl md:text-2xl text-white font-medium tracking-wider
              drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]
              [text-shadow:_1px_1px_2px_rgb(0_0_0_/_60%)]">
              January 24, 2026
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="w-24 h-[2px] bg-white mx-auto mt-10 shadow-glow"
          />
        </MotionDiv>
      </MotionDiv>

      <MotionDiv
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 will-change-transform"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full p-2 
           bg-black/10 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto animate-bounce 
            shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
        </div>
      </MotionDiv>
    </header>
  );
}
