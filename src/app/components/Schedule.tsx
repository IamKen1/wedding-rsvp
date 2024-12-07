"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { FaGift, FaTshirt } from 'react-icons/fa';

const MotionDiv = motion.div as any;
const MotionSection = motion.section as any;
const MotionH3 = motion.h3 as any;
const MotionUl = motion.ul as any;
const MotionLi = motion.li as any;

export default function Schedule() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  
  const listVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <MotionSection 
      className="py-20 bg-gray-100 text-center"
      style={{ opacity }}
    >
      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        variants={listVariants}
      >
        <MotionH3 
          className="text-4xl font-bold mb-6"
          variants={itemVariants}
        >
          Wedding Schedule
        </MotionH3>
        <MotionUl className="text-lg space-y-4">
          {[
            "3:00 PM - Ceremony at Manila Cathedral",
            "5:00 PM - Reception at Ibayo Events Place",
            "7:00 PM - Dinner and Games"
          ].map((item, index) => (
            <MotionLi 
              key={index}
              variants={itemVariants}
              className="mb-4"
            >
              {item}
            </MotionLi>
          ))}
        </MotionUl>

        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <MotionDiv 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={itemVariants}
          >
            <FaGift className="text-primary text-3xl mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-3">Gift Information</h4>
            <p className="text-gray-600">
              Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, monetary gifts are greatly appreciated as we begin our new life together.
            </p>
     
          </MotionDiv>

          <MotionDiv 
            className="bg-white p-6 rounded-lg shadow-md"
            variants={itemVariants}
          >
            <FaTshirt className="text-primary text-3xl mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-3">Attire</h4>
            <p className="text-gray-600">
              Formal / Semi-formal Attire
            </p>
            <ul className="mt-3 text-gray-600">
              <li>Ladies: Cocktail dresses or formal evening wear</li>
              <li>Gentlemen: Suit and tie or Barong Tagalog</li>
              <li>Colors: Please avoid wearing white</li>
            </ul>
          </MotionDiv>
        </div>
      </MotionDiv>
    </MotionSection>
  );
}
  