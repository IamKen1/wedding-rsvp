"use client";

import coupleImage from '../../../public/images/bgcouple1.jpg';
import coupleCenterImage from '../../../public/images/bgcouple1.jpg';
import { useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MotionDiv } from '@/types/motion';
import Image from 'next/image';

export default function Header() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Subtle parallax effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 100]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, isMobile ? 0 : -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  // Animation variants for elegant entrance
  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <header className="relative h-screen w-full overflow-hidden">
      {/* Background Image Layer with Parallax */}
      <MotionDiv 
        className="absolute inset-0 w-full h-full"
        style={{ y: backgroundY }}
      >
        <Image
          src={isMobile ? coupleCenterImage : coupleImage}
          alt="Kenneth and Jenna"
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="100vw"
          style={{
            objectPosition: isMobile ? 'center center' : '65% center',
            objectFit: 'cover'
          }}
        />
      </MotionDiv>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      
      {/* Vignette effect - darker edges */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40 z-10" />

      {/* Main Content - Centered Elegantly */}
      <MotionDiv 
        className="relative h-full w-full flex items-center justify-center px-4 sm:px-6 z-20"
        style={{ y: contentY }}
      >
        <MotionDiv 
          className="text-center max-w-4xl mx-auto -mt-[25vh] sm:-mt-[28vh] md:-mt-[30vh]"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {/* Names - Elegant and Readable with Responsive Sizing */}
          <MotionDiv
            variants={fadeInUp}
          >
            <h1 className="text-[clamp(3rem,12vw,9rem)] font-something text-white font-normal
              tracking-wide leading-tight mb-2
              [text-shadow:_0_0_40px_rgba(0,0,0,0.9),_0_4px_30px_rgba(0,0,0,0.8),_0_2px_15px_rgba(0,0,0,0.7),_0_1px_5px_rgba(0,0,0,0.9)]
              drop-shadow-[0_0_50px_rgba(0,0,0,1)]">
              Kenneth <span className="text-[clamp(2rem,7vw,7rem)] font-something">&</span> Jenna
            </h1>
          </MotionDiv>

          {/* Wedding Date */}
          <MotionDiv
            variants={fadeInUp}
            className="mb-3"
          >
            <p className="text-[clamp(1.125rem,3vw,1.75rem)] text-white tracking-wide
              [text-shadow:_0_0_40px_rgba(0,0,0,0.9),_0_4px_30px_rgba(0,0,0,0.8),_0_2px_15px_rgba(0,0,0,0.7),_0_1px_5px_rgba(0,0,0,0.9)]
              drop-shadow-[0_0_50px_rgba(0,0,0,1)]">
              JANUARY 24, 2026 * SATURDAY * 1:30 P.M.
            </p>
          </MotionDiv>

          {/* Elegant Separator */}
          <MotionDiv
            variants={fadeInUp}
            className="mb-4 flex items-center justify-center gap-2"
          >
            <div className="w-8 h-[1px] bg-white/40" />
            <div className="w-1 h-1 bg-white/60 rounded-full" />
            <div className="w-8 h-[1px] bg-white/40" />
          </MotionDiv>

          {/* Subtitle */}
          <MotionDiv
            variants={fadeInUp}
           
          >
            <p className="text-[clamp(1rem,2.5vw,1.5rem)] text-white/95 font-script tracking-wider
              [text-shadow:_0_2px_12px_rgba(0,0,0,0.8),_0_1px_6px_rgba(0,0,0,0.6)]">
              A celebration of love and commitment
            </p>
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>

      {/* Subtle Scroll Indicator - Adjusted for mobile bottom nav */}
      <MotionDiv
        className="absolute bottom-8 md:bottom-8 left-1/2 -translate-x-1/2 z-30
          mb-16 md:mb-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
          <p className="text-white/60 text-xs font-proxima-regular tracking-widest uppercase [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">Scroll</p>
        </div>
      </MotionDiv>
    </header>
  );
}
