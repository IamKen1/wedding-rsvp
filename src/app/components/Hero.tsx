"use client";

import { useScroll, useTransform } from 'framer-motion';
import { MotionSection, MotionDiv } from '@/types/motion';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <MotionSection 
      className="min-h-screen w-full bg-white text-center relative overflow-hidden flex items-center pt-20"
      style={{ opacity, y }}
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        {/* Floating orbs - very subtle */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#F5EEE6]/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#E6D5BE]/20 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-[#F5EEE6]/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Very subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5EEE6]/10 via-transparent to-white/50" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-[1100px] mx-auto px-8 relative z-10"
        style={{ scale }}
      >
        {/* Main Content Container - Clean white */}
        <div className="bg-white/98 backdrop-blur-xl p-8 md:p-16 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
          {/* Very subtle shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F5EEE6]/20 to-transparent -skew-x-12 animate-shimmer opacity-20" 
               style={{ backgroundSize: '200% 100%' }} />

          {/* Decorative corner elements - champagne color */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#E6D5BE]/40 rounded-tl-2xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[#E6D5BE]/40 rounded-tr-2xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[#E6D5BE]/40 rounded-bl-2xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#E6D5BE]/40 rounded-br-2xl" />

          {/* Title Section with improved typography */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6 md:space-y-8 mb-10 md:mb-14"
          >
            <div className="relative">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-gray-800 leading-tight font-light tracking-wide">
                Wedding Celebration
              </h2>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#F5EEE6] via-[#C9A87C] to-[#F5EEE6] rounded-full" />
            </div>
            
            {/* Elegant separator */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#E6D5BE] to-transparent" />
              <div className="w-2 h-2 bg-[#C9A87C] rounded-full animate-pulse-slow" />
              <div className="w-12 h-px bg-gradient-to-r from-[#E6D5BE] via-[#C9A87C] to-[#E6D5BE]" />
              <div className="w-2 h-2 bg-[#E6D5BE] rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#E6D5BE] to-transparent" />
            </div>
          </MotionDiv>

          {/* Names with enhanced styling */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8 md:space-y-10"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5EEE6]/40 via-[#E6D5BE]/30 to-[#F5EEE6]/40 rounded-2xl blur-sm transform rotate-1" />
              <p className="relative text-5xl md:text-6xl lg:text-7xl font-display text-gray-800 font-light
                px-6 md:px-12 py-4 md:py-6 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-[#E6D5BE]/40
                shadow-md hover:shadow-lg transition-all duration-300 tracking-wide">
                Kenneth <span className="text-[#C9A87C] font-proxima-regular">&</span> Jenna
              </p>
            </div>

            {/* Date and details with better spacing */}
            <div className="space-y-4 md:space-y-6">
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <p className="text-xl md:text-2xl text-gray-700 font-proxima-regular font-medium tracking-wide">
                  Saturday, January 24, 2026
                </p>
              </MotionDiv>
              
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="max-w-[900px] mx-auto"
              >
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed px-4 font-proxima-regular">
                  Join us as we celebrate our love and commitment in the presence of our beloved family and friends.
                  Together, we'll create memories that will last a lifetime.
                </p>
              </MotionDiv>
            </div>
          </MotionDiv>

          {/* Enhanced decorative footer */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-10 md:mt-14 flex items-center justify-center gap-6"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C9A87C] to-transparent" />
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`rounded-full animate-pulse ${
                    i === 2 ? 'w-3 h-3 bg-[#C9A87C]' : 'w-1.5 h-1.5 bg-[#E6D5BE]'
                  }`}
                  style={{
                    animation: `pulse 3s ${i * 0.4}s infinite`
                  }}
                />
              ))}
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C9A87C] to-transparent" />
          </MotionDiv>
        </div>
      </MotionDiv>
    </MotionSection>
  );
}
  