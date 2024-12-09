"use client";

import coupleImage from '../../../public/images/couple.png';
import coupleCenterImage from '../../../public/images/couple_center.png';
import { motion, useScroll, useTransform, easeOut } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { MotionDiv } from '@/types/motion';
import Image from 'next/image';

export default function Header() {
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();

  // Reduced parallax effect for mobile
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 150]);
  const middleY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 50]);
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 1 : 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, isMobile ? 1 : 0]);

  // Animation variants
  const titleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const subtitleVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        delay: 0.1
      }
    }
  };

  return (
    <header className="relative h-screen w-full overflow-hidden">
      {/* Background Layer */}
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
          className="object-cover scale-110"
          sizes="100vw"
          style={{
            objectPosition: 'center center',
            filter: 'brightness(0.9) contrast(1.1)',
          }}
        />
      </MotionDiv>

      {/* Overlay Layer */}
      <MotionDiv 
        className="absolute inset-0 z-10"
        style={{ y: middleY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-mint-dark/10 to-transparent opacity-60" />
      </MotionDiv>

      {/* Content Layer */}
      <MotionDiv 
        className="relative h-full w-full flex items-center justify-center px-4 z-20"
        style={{ y: contentY, opacity }}
      >
        <MotionDiv 
          className="text-center p-8 md:p-12  bg-black/5 rounded-xl"
          initial="hidden"
          animate="visible"
          style={{ scale: titleScale }}
        >
          <MotionDiv
            variants={lineVariants}
            className="w-24 h-[2px] bg-white mx-auto mb-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />

          <MotionDiv
            variants={titleVariants}
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
            variants={subtitleVariants}
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
            variants={lineVariants}
            className="w-24 h-[2px] bg-white mx-auto mt-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
        </MotionDiv>
      </MotionDiv>

      {/* Scroll Indicator */}
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
