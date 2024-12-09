"use client";

import { motion } from 'framer-motion';
import { MotionDiv } from '@/types/motion';
import { useState } from 'react';

interface EntourageRole {
  role: string;
  names: string[];
}

const entourageData: EntourageRole[] = [
  {
    role: "Principal Sponsors",
    names: [
      "Mr. & Mrs. Antonio Santos",
      "Mr. & Mrs. Ricardo dela Cruz",
      "Mr. & Mrs. Manuel Reyes",
      "Mr. & Mrs. Jose Garcia"
    ]
  },
  {
    role: "Parents of the Bride",
    names: ["Mr. & Mrs. Eduardo Mendoza"]
  },
  {
    role: "Parents of the Groom",
    names: ["Mr. & Mrs. Roberto Aquino"]
  },
  {
    role: "Best Man",
    names: ["Miguel Angelo Santos"]
  },
  {
    role: "Maid of Honor",
    names: ["Maria Clara Fernandez"]
  },
  {
    role: "Groomsmen",
    names: [
      "Juan Carlos Domingo",
      "Paolo Miguel Ramos",
      "Gabriel Torres"
    ]
  },
  {
    role: "Bridesmaids",
    names: [
      "Isabella Cruz",
      "Sofia Angela Reyes",
      "Andrea Nicole Santos"
    ]
  },
  {
    role: "Secondary Sponsors",
    names: [
      "Candle: Marco Bautista & Diana Lopez",
      "Veil: Rafael Tan & Camille Lim",
      "Cord: Christian Yu & Patricia Go"
    ]
  },
  {
    role: "Ring Bearer",
    names: ["Lucas Gabriel Lim"]
  },
  {
    role: "Flower Girls",
    names: [
      "Sofia Marie Santos",
      "Emma Rose Tan"
    ]
  },
  {
    role: "Bible Bearer",
    names: ["Matthew James Cruz"]
  },
  {
    role: "Coin Bearer",
    names: ["Nathan Alexander Reyes"]
  }
];

export default function Entourage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Simpler fade-in animation for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-24 bg-cream">
      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4"
      >
        <h3 className="text-4xl md:text-5xl font-script text-forest-dark mb-12 text-center">
          Our Wedding Entourage
        </h3>

        {/* Mobile Accordion / Desktop Grid */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
          {entourageData.map((group, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setActiveCategory(activeCategory === group.role ? null : group.role)}
                className="w-full p-4 text-left bg-white hover:bg-sage-50 transition-colors duration-200 md:hover:bg-white"
              >
                <h4 className="text-xl font-script text-forest-dark">
                  {group.role}
                </h4>
              </button>

              <div 
                className={`overflow-hidden transition-all duration-200 ease-in-out
                  ${activeCategory === group.role || window.innerWidth >= 768 
                    ? 'max-h-[500px] opacity-100' 
                    : 'max-h-0 opacity-0'}`}
              >
                <ul className="p-4 pt-0 space-y-2 bg-white">
                  {group.names.map((name, nameIndex) => (
                    <li
                      key={nameIndex}
                      className="text-base text-forest pl-4 border-l-2 border-mint/20"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Helper Text */}
        <p className="mt-6 text-sm text-forest-dark/60 text-center md:hidden">
          Tap on a category to view members
        </p>
      </MotionDiv>
    </section>
  );
} 