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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <section className="py-24 bg-cream text-center">
      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4"
      >
        <h3 className="text-4xl md:text-5xl font-script text-forest-dark mb-16">
          Our Wedding Entourage
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {entourageData.map((group, index) => (
            <MotionDiv
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h4 className="text-2xl font-script text-forest-dark mb-4">
                {group.role}
              </h4>
              <ul className="space-y-2">
                {group.names.map((name, nameIndex) => (
                  <li
                    key={nameIndex}
                    className="text-lg text-forest"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </MotionDiv>
          ))}
        </div>
      </MotionDiv>
    </section>
  );
} 