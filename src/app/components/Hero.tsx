"use client";

import { useScroll, useTransform } from 'framer-motion';
import { MotionSection, MotionDiv, MotionP } from '@/types/motion';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <MotionSection 
      className="py-32 bg-gradient-to-b from-sage-50 to-white text-center relative overflow-hidden circuit-bg"
      style={{ opacity, y }}
    >
      {/* Tech-inspired background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-mint/10 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-mint/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 2}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 relative z-10"
      >
        <div className="tech-card p-8 rounded-lg scan-line">
          <h2 className="text-4xl md:text-6xl font-script text-forest-dark glow-text leading-relaxed mb-8">
            The Wedding Celebration
          </h2>

          <MotionDiv 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <p className="text-2xl md:text-3xl font-script text-mint-dark">
              Kenneth &amp; Jenna
            </p>
            <div className="tech-border inline-block px-6 py-2 rounded">
              <p className="text-xl md:text-2xl font-medium text-forest-dark">
                Saturday, January 24, 2026
              </p>
            </div>
            <p className="text-lg md:text-xl text-forest font-medium max-w-2xl mx-auto">
              Join us as we celebrate our love and commitment in the presence of our beloved family and friends.
            </p>
          </MotionDiv>
        </div>

        {/* Tech-inspired decorative elements */}
        <div className="mt-16 flex justify-center items-center gap-4">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-mint/50 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
        </div>
      </MotionDiv>
    </MotionSection>
  );
}
  