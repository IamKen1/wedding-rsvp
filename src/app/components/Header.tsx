"use client";

import coupleImage from '../../../public/images/bgcouple.jpg';
import coupleCenterImage from '../../../public/images/bgcouple.jpg';
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
          quality={95}
          className="object-cover"
          sizes="100vw"
          style={{
            objectPosition: isMobile ? 'center center' : '65% center',
          }}
        />
      </MotionDiv>

      {/* Subtle Gradient Overlay - Much lighter */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-10" />
      
      {/* Very subtle bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/60 to-transparent z-10" />

      {/* Main Content - Centered Elegantly */}
      <MotionDiv 
        className="relative h-full w-full flex items-center justify-center px-6 z-20"
        style={{ y: contentY, opacity }}
      >
        <MotionDiv 
          className="text-center max-w-4xl mx-auto"
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
          {/* Elegant Top Line */}
          <MotionDiv
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="w-16 h-[1px] bg-white/60 mx-auto mb-6" />
            <p className="text-white/90 text-2xl md:text-3xl lg:text-4xl font-great-vibes tracking-wider font-normal">
              Together with their families
            </p>
          </MotionDiv>

          {/* Names - Elegant and Readable */}
          <MotionDiv
            variants={fadeInUp}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-great-vibes text-white font-normal
              tracking-wide leading-tight mb-4
              [text-shadow:_0_2px_20px_rgba(0,0,0,0.5)]">
              Kenneth <span className="text-4xl md:text-6xl lg:text-7xl font-great-vibes">&</span> Jenna
            </h1>
          </MotionDiv>

          {/* Elegant Separator */}
          <MotionDiv
            variants={fadeInUp}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <div className="w-12 h-[1px] bg-white/40" />
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            <div className="w-12 h-[1px] bg-white/40" />
          </MotionDiv>

          {/* Wedding Invitation Text */}
          <MotionDiv
            variants={fadeInUp}
            className="mb-6"
          >
            <p className="text-2xl md:text-2xl lg:text-2xl font-sans text-white/95 font-light tracking-wide
              [text-shadow:_0_2px_15px_rgba(0,0,0,0.4)]">
              Request the honor of your presence
            </p>
          </MotionDiv>

          {/* Date and Location */}
          <MotionDiv
            variants={fadeInUp}
            className="space-y-3"
          >
            <p className="text-xl md:text-2xl text-white/95 font-sans font-medium tracking-wide
              [text-shadow:_0_1px_10px_rgba(0,0,0,0.4)]">
              Saturday, January 24, 2026
            </p>
            <p className="text-base md:text-lg text-white/80 font-sans tracking-wider
              [text-shadow:_0_1px_8px_rgba(0,0,0,0.4)]">
              A celebration of love and commitment
            </p>
          </MotionDiv>

          {/* Bottom Decorative Line */}
          <MotionDiv
            variants={fadeInUp}
            className="mt-12"
          >
            <div className="w-16 h-[1px] bg-white/60 mx-auto" />
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
          repeatType: "reverse"
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
          <p className="text-white/60 text-xs font-sans tracking-widest uppercase">Scroll</p>
        </div>
      </MotionDiv>
    </header>
  );
}

