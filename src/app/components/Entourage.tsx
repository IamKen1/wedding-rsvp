"use client";

import { motion } from 'framer-motion';
import { MotionDiv } from '@/types/motion';

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
  // Single fade-in animation for the entire section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="py-24 bg-cream">
      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-5xl mx-auto px-4"
      >
        <h3 className="text-4xl md:text-5xl font-script text-forest-dark mb-16 text-center">
          Our Wedding Entourage
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entourageData.map((group, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md transform-gpu hover:shadow-lg 
                transition-shadow duration-300 border border-mint/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-2xl font-script text-forest-dark">
                  {group.role}
                </h4>
                <div className="h-[1px] flex-grow bg-mint/20"></div>
              </div>

              <ul className="space-y-3">
                {group.names.map((name, nameIndex) => (
                  <li
                    key={nameIndex}
                    className="text-base text-forest flex items-center gap-3 
                      pl-4 relative before:absolute before:left-0 before:top-1/2 
                      before:-translate-y-1/2 before:w-2 before:h-2 before:bg-mint/30 
                      before:rounded-full"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Optional decorative elements */}
        <div className="mt-16 flex justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-mint/30"></div>
          <div className="w-2 h-2 rounded-full bg-mint/30"></div>
          <div className="w-2 h-2 rounded-full bg-mint/30"></div>
        </div>
      </MotionDiv>
    </section>
  );
} 