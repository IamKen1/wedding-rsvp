"use client";

import { motion } from 'framer-motion';
import { MotionDiv } from '@/types/motion';
import { FaHeart, FaRing, FaUserTie, FaUserFriends } from 'react-icons/fa';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface EntourageRole {
  role: string;
  names: string[];
  icon?: React.ReactNode;
}

const entourageData: EntourageRole[] = [
  {
    role: "Principal Sponsors",
    names: [
      "Mr. & Mrs. Antonio Santos",
      "Mr. & Mrs. Ricardo dela Cruz",
      "Mr. & Mrs. Manuel Reyes",
      "Mr. & Mrs. Jose Garcia"
    ],
    icon: <FaUserFriends className="text-mint-dark text-xl" />
  },
  {
    role: "Parents of the Bride",
    names: ["Mr. & Mrs. Eduardo Mendoza"],
    icon: <FaHeart className="text-mint-dark text-xl" />
  },
  {
    role: "Parents of the Groom",
    names: ["Mr. & Mrs. Roberto Aquino"],
    icon: <FaRing className="text-mint-dark text-xl" />
  },
  {
    role: "Best Man",
    names: ["Miguel Angelo Santos"],
    icon: <FaUserTie className="text-mint-dark text-xl" />
  },
  {
    role: "Maid of Honor",
    names: ["Maria Clara Fernandez"],
    icon: <FaUserTie className="text-mint-dark text-xl" />
  },
  {
    role: "Groomsmen",
    names: [
      "Juan Carlos Domingo",
      "Paolo Miguel Ramos",
      "Gabriel Torres"
    ],
    icon: <FaUserTie className="text-mint-dark text-xl" />
  },
  {
    role: "Bridesmaids",
    names: [
      "Isabella Cruz",
      "Sofia Angela Reyes",
      "Andrea Nicole Santos"
    ],
    icon: <FaUserTie className="text-mint-dark text-xl" />
  },
  {
    role: "Secondary Sponsors",
    names: [
      "Candle: Marco Bautista & Diana Lopez",
      "Veil: Rafael Tan & Camille Lim",
      "Cord: Christian Yu & Patricia Go"
    ],
    icon: <FaRing className="text-mint-dark text-xl" />
  },
  {
    role: "Ring Bearer",
    names: ["Lucas Gabriel Lim"],
    icon: <FaRing className="text-mint-dark text-xl" />
  },
  {
    role: "Flower Girls",
    names: [
      "Sofia Marie Santos",
      "Emma Rose Tan"
    ],
    icon: <FaRing className="text-mint-dark text-xl" />
  },
  {
    role: "Bible Bearer",
    names: ["Matthew James Cruz"],
    icon: <FaUserTie className="text-mint-dark text-xl" />
  },
  {
    role: "Coin Bearer",
    names: ["Nathan Alexander Reyes"],
    icon: <FaRing className="text-mint-dark text-xl" />
  }
];

export default function Entourage() {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Simplified variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Optimized card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Optimized background with reduced opacity animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-sage-50 to-cream opacity-50" />
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />

      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={isMobile ? {} : containerVariants}
        className="max-w-6xl mx-auto px-4 relative z-10"
      >
        {/* Section Header */}
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-script text-forest-dark mb-4">
            Our Wedding Entourage
          </h3>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-mint to-transparent" />
            <FaHeart className="text-mint-dark" />
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-mint to-transparent" />
          </div>
        </div>

        {/* Optimized Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {entourageData.map((group, index) => (
            <MotionDiv
              key={index}
              variants={cardVariants}
              className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 
                shadow-[0_4px_20px_rgba(0,0,0,0.03)] 
                border border-mint/10 relative overflow-hidden
                md:hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)]
                md:hover:border-mint/30 md:hover:-translate-y-1
                transition-all duration-300 will-change-transform"
            >
              {/* Simplified decorative element for better performance */}
              <div className="absolute -right-4 -top-4 w-24 h-24 
                bg-gradient-to-br from-mint/5 to-transparent rounded-full 
                blur-xl opacity-60 hidden md:block" />
              
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-2.5 rounded-lg bg-sage-50 
                  transition-colors duration-300 md:group-hover:bg-sage-100">
                  {group.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-script text-forest-dark 
                    transition-colors duration-300 md:group-hover:text-forest">
                    {group.role}
                  </h4>
                  <div className="h-[2px] w-full mt-1 bg-gradient-to-r 
                    from-mint/30 to-transparent" />
                </div>
              </div>

              {/* Names List - Always visible on mobile */}
              <ul className="space-y-3 relative z-10">
                {group.names.map((name, nameIndex) => (
                  <li
                    key={nameIndex}
                    className="text-base text-forest flex items-center gap-3 
                      pl-4 relative before:absolute before:left-0 before:top-1/2 
                      before:-translate-y-1/2 before:w-1.5 before:h-1.5 
                      before:bg-mint before:rounded-full
                      before:transition-colors before:duration-300
                      md:hover:translate-x-2 transition-transform duration-300"
                  >
                    {name}
                  </li>
                ))}
              </ul>

              {/* Simplified decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 
                bg-gradient-to-br from-mint/5 to-transparent 
                rounded-bl-[100px] hidden md:block" />
            </MotionDiv>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-16 flex justify-center items-center gap-4">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-mint/30" />
            <div className="w-2 h-2 rounded-full bg-mint/50" />
            <div className="w-2 h-2 rounded-full bg-mint/30" />
          </div>
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
        </div>
      </MotionDiv>
    </section>
  );
} 