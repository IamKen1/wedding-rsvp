"use client";

import { useScroll, useTransform } from 'framer-motion';
import { MotionSection, MotionDiv, MotionP } from '@/types/motion';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <MotionSection 
      className="py-32 bg-gradient-to-b from-white to-sage-50 text-center relative overflow-hidden"
      style={{ opacity, y }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-forest rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage-200 rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 relative z-10"
      >
        {/* Decorative Line */}
        <MotionDiv
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
          className="w-20 h-[1px] bg-forest mx-auto mb-12"
        />

        <h2 className="text-4xl md:text-6xl font-script text-forest-dark leading-relaxed mb-8">
          The Wedding Celebration
        </h2>

        <MotionDiv 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <p className="text-2xl md:text-3xl font-script text-forest">
            Kenneth &amp; Jenna
          </p>
          <p className="text-xl md:text-2xl font-medium text-forest-dark">
            Saturday, January 24, 2026
          </p>
          <p className="text-lg md:text-xl text-forest-light font-medium max-w-2xl mx-auto">
            Join us as we celebrate our love and commitment in the presence of our beloved family and friends.
          </p>
        </MotionDiv>

        {/* Decorative Line */}
        <MotionDiv
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
          className="w-20 h-[1px] bg-forest mx-auto mt-12"
        />
      </MotionDiv>
    </MotionSection>
  );
}
  