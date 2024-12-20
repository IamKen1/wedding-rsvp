"use client";

import { useScroll, useTransform } from 'framer-motion';
import { MotionSection, MotionDiv } from '@/types/motion';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <MotionSection 
      className="min-h-screen w-full bg-gradient-to-b from-forest to-sage-50 text-center relative overflow-hidden flex items-center"
      style={{ opacity, y }}
    >
      {/* Subtle tech background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-radial from-mint/20 via-transparent to-transparent" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto px-4 relative z-10"
      >
        {/* Main Content Container */}
        <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-xl border border-mint/20">
      

          {/* Title Section */}
          <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-script text-forest">
              The Wedding Celebration
            </h2>
            <div className="h-px w-32 md:w-40 mx-auto bg-gradient-to-r from-transparent via-mint to-transparent" />
          </div>

          {/* Names and Date */}
          <div className="space-y-6 md:space-y-8">
            <div className="inline-block">
              <p className="text-3xl md:text-4xl lg:text-5xl font-script text-forest-dark 
                bg-gradient-to-r from-forest/5 to-mint/5 px-4 md:px-8 py-2 md:py-3 rounded-lg border border-mint/20">
                Kenneth &amp; Jenna
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <p className="text-xl md:text-2xl lg:text-3xl text-forest-dark font-medium">
                Saturday, January 24, 2026
              </p>
              <p className="text-base md:text-xl text-forest-dark/80 max-w-2xl mx-auto px-2">
                Join us as we celebrate our love and commitment in the presence of our beloved family and friends.
              </p>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="mt-8 md:mt-12 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-mint to-transparent" />
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1.5 h-1.5 bg-mint rounded-full animate-pulse"
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
  