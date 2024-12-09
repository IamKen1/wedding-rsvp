"use client";

import { useScroll, useTransform } from 'framer-motion';
import { MotionSection, MotionDiv } from '@/types/motion';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function Hero() {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  
  // Only apply scroll transforms if not mobile
  const y = useTransform(scrollYProgress, [0, 0.5], isMobile ? [0, 0] : [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], isMobile ? [1, 1] : [0, 1]);

  return (
    <MotionSection 
      className="min-h-screen w-full bg-gradient-to-b from-forest to-sage-50 text-center relative overflow-hidden flex items-center"
      style={isMobile ? {} : { opacity, y }}
    >
      {/* Subtle tech background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-radial from-mint/5 via-transparent to-transparent" />
      </div>

      <MotionDiv
        initial={isMobile ? false : { opacity: 0, y: 50 }}
        whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto px-2 relative z-10"
      >
        {/* Main Content Container */}
        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-mint/20">
      

          {/* Title Section */}
          <div className="space-y-6 mb-12">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-script text-forest">
              The Wedding Celebration
            </h2>
            <div className="h-px w-40 mx-auto bg-gradient-to-r from-transparent via-mint to-transparent" />
          </div>

          {/* Names and Date */}
          <div className="space-y-8">
            <div className="inline-block">
              <p className="text-3xl md:text-4xl lg:text-5xl font-script text-forest-dark 
                bg-gradient-to-r from-forest/5 to-mint/5 px-8 py-3 rounded-lg border border-mint/20">
                Kenneth &amp; Jenna
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xl md:text-2xl lg:text-3xl text-forest-dark font-medium">
                Saturday, January 24, 2026
              </p>
              <p className="text-lg md:text-xl text-forest-dark/80 max-w-2xl mx-auto">
                Join us as we celebrate our love and commitment in the presence of our beloved family and friends.
              </p>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-mint to-transparent" />
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1.5 h-1.5 bg-mint rounded-full"
                  style={{
                    animation: `pulse 2s ${i * 0.3}s infinite`
                  }}
                />
              ))}
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-mint to-transparent" />
          </div>
        </div>
      </MotionDiv>
    </MotionSection>
  );
}
  