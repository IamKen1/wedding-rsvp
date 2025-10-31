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
            <h1 className="text-[clamp(2rem,10vw,7rem)] font-something text-white
              tracking-wide leading-tight mb-0.5
              [text-shadow:_0_0_40px_rgba(0,0,0,0.9),_0_4px_30px_rgba(0,0,0,0.8),_0_2px_15px_rgba(0,0,0,0.7),_0_1px_5px_rgba(0,0,0,0.9)]
              drop-shadow-[0_0_50px_rgba(0,0,0,1)]">
              Kenneth <span className="text-[clamp(2rem,7vw,7rem)] font-something">&</span> Jenna
            </h1>
            </MotionDiv>

            {/* Wedding Date */}
            <MotionDiv
            variants={fadeInUp}
            className="mb-1"
            >
            <p className="text-[clamp(0.875rem,2vw,1.25rem)] text-white tracking-wide flex items-center justify-center gap-2
              [text-shadow:_0_0_40px_rgba(0,0,0,0.9),_0_4px_30px_rgba(0,0,0,0.8),_0_2px_15px_rgba(0,0,0,0.7),_0_1px_5px_rgba(0,0,0,0.9)]
              drop-shadow-[0_0_50px_rgba(0,0,0,1)]">
              <span>JANUARY 24, 2026</span>
              <span className="w-1 h-1 bg-white/60 rounded-full" />
              <span>SATURDAY</span>
              <span className="w-1 h-1 bg-white/60 rounded-full" />
              <span>1:30 P.M.</span>
            </p>
            </MotionDiv>

            {/* Elegant Separator */}
            <MotionDiv
            variants={fadeInUp}
            className="mb-1 flex items-center justify-center gap-2"
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

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30 mb-16 md:mb-0 pointer-events-none">
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.7,
            y: [0, 8, 0]
          }}
          transition={{ 
            opacity: { duration: 0.6, delay: 1.5 },
            y: {
              duration: 2,
              delay: 2,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
        >
          <div className="flex flex-col items-center gap-1">
            {/* Simple chevron down with glow */}
            <svg 
              className="w-5 h-5 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]" 
              fill="none" 
              strokeWidth="2.5" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-white/60 text-[10px] font-proxima-regular tracking-wider uppercase
              [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">
              Scroll
            </p>
          </div>
        </MotionDiv>
      </div>
    </header>
  );
}
