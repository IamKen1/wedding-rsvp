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
          }}
        />
      </MotionDiv>

      {/* Cloud-like fading overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20 z-10" /> */}
      
      {/* Soft cloud fade from sides */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 z-10" /> */}
      
      {/* Bottom cloud fade */}
      {/* <div className="absolute bottom-0 inset-x-0 h-22 bg-gradient-to-t from-white/20 via-white/60 to-transparent z-10" /> */}

      {/* Main Content - Centered Elegantly */}
      <MotionDiv 
        className="relative h-full w-full flex items-center justify-center px-6 z-20"
        style={{ y: contentY, opacity }}
      >
        <MotionDiv 
          className="text-center max-w-4xl mx-auto -mt-[30vh] md:-mt-[30vh]"
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
          {/* Names - Elegant and Readable */}
          <MotionDiv
            variants={fadeInUp}
          >
            <h1 className="text-6xl md:text-9xl lg:text-9xl font-something text-white font-normal
              tracking-wide leading-tight mb-4
              [text-shadow:_0_2px_20px_rgba(0,0,0,0.5)]">
              Kenneth <span className="text-4xl md:text-6xl lg:text-7xl font-something">&</span> Jenna
            </h1>
          </MotionDiv>

          {/* Elegant Separator */}
          <MotionDiv
            variants={fadeInUp}
            className="mb-1 flex items-center justify-center gap-4"
          >
            <div className="w-12 h-[1px] bg-white/40" />
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            <div className="w-12 h-[1px] bg-white/40" />
          </MotionDiv>

          {/* Date and Location */}
          <MotionDiv
            variants={fadeInUp}
            className="space-y-1"
          >
            <p className="text-xl md:text-2xl text-white/95 font-proxima-regular font-medium tracking-wide
              [text-shadow:_0_1px_10px_rgba(0,0,0,0.4)]">
              SATURDAY JANUARY 24, 2026
            </p>
            <p className="text-base md:text-xl text-white/80 font-script tracking-wider
              [text-shadow:_0_1px_8px_rgba(0,0,0,0.4)]">
              A celebration of love and commitment
            </p>
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>

      {/* Subtle Scroll Indicator */}
      <MotionDiv
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0
        }}
        style={{ opacity }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
          <p className="text-white/60 text-xs font-proxima-regular tracking-widest uppercase [text-shadow:_0_1px_4px_rgba(0,0,0,0.6)]">Scroll</p>
        </div>
      </MotionDiv>
    </header>
  );
}
