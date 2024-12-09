"use client";

import coupleImage from '../../../public/images/couple.png';
import coupleCenterImage from '../../../public/images/couple_center.png';
import { motion, useScroll, useTransform, easeOut } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MotionDiv } from '@/types/motion';
import Image from 'next/image';

export default function Header() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  // Adjusted parallax speeds for better mobile experience
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 150 : 300]);
  const middleY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 100 : 200]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 50 : 100]);
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 0.95 : 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      // Force a re-render of parallax effects
      window.dispatchEvent(new Event('resize'));
    };
    
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

  // Touch scroll handling for mobile
  useEffect(() => {
    if (isMobile) {
      const handleTouchMove = (e: TouchEvent) => {
        // Prevent default only if we're at the top of the page
        if (window.scrollY <= 0) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isMobile]);

  // In the Header component, adjust the animation timings
  const titleVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5, // Reduced from 1.0
        ease: "easeOut",
        delay: 0.2 // Reduced from 0.3
      }
    }
  };

  const subtitleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5, // Reduced from 1.0
        ease: "easeOut",
        delay: 0.4 // Reduced from 0.6
      }
    }
  };

  // Adjust decorative line animations
  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8, // Reduced from 1.5
        delay: 0.1 // Reduced from 0.2
      }
    }
  };

  return (
    <header className="relative h-screen w-full overflow-hidden will-change-transform">
      {/* Background Layer - Slowest Movement */}
      <MotionDiv 
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ y: backgroundY }}
      >
        <Image
          src={isMobile ? coupleCenterImage : coupleImage}
          alt="Kenneth and Jenna"
          fill
          priority
          quality={100}
          className="object-cover scale-110"
          sizes={isMobile ? "100vw" : "100vw"}
          style={{
            objectPosition: isMobile ? 'center center' : 'center center',
            filter: 'brightness(0.9) contrast(1.1)',
            willChange: 'transform',
          }}
        />
      </MotionDiv>

      {/* Middle Layer - Medium Movement */}
      <MotionDiv 
        className="absolute inset-0 z-10 will-change-transform"
        style={{ y: middleY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-mint-dark/10 to-transparent opacity-60" />
      </MotionDiv>

      {/* Content Layer - Fastest Movement */}
      <MotionDiv 
        className="relative h-full w-full flex items-center justify-center px-4 z-20 will-change-transform"
        style={{ y: contentY, opacity }}
      >
        <MotionDiv 
          className="text-center p-8 md:p-12 backdrop-blur-[2px] bg-black/5 rounded-xl
            shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          initial="hidden"
          animate="visible"
          style={{ scale: titleScale }}
        >
          {/* Top decorative line */}
          <MotionDiv
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="w-24 h-[2px] bg-white mx-auto mb-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />

          {/* Title */}
          <MotionDiv
            variants={titleVariants}
            className="mb-8 transform-gpu"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-script text-white 
              drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] 
              [text-shadow:_2px_2px_4px_rgb(0_0_0_/_70%),_-1px_-1px_2px_rgb(0_0_0_/_60%),_0_0_20px_rgba(255,255,255,0.3)]
              leading-tight tracking-wider">
              Kenneth &amp; Jenna
            </h1>
          </MotionDiv>

          {/* Subtitle */}
          <MotionDiv
            variants={subtitleVariants}
            className="space-y-6 transform-gpu"
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

          {/* Bottom decorative line */}
          <MotionDiv
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="w-24 h-[2px] bg-white mx-auto mt-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
        </MotionDiv>
      </MotionDiv>

      {/* Scroll Indicator with mobile-friendly positioning */}
      <MotionDiv
        className={`absolute ${isMobile ? 'bottom-6' : 'bottom-8'} left-1/2 -translate-x-1/2 z-30`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className={`w-6 h-10 border-2 border-white rounded-full p-2 
          bg-black/10 shadow-[0_0_15px_rgba(255,255,255,0.4)]
          ${isMobile ? 'scale-90' : ''}`}>
          <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto animate-bounce 
            shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
        </div>
      </MotionDiv>
    </header>
  );
}
