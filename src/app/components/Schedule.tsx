"use client";

import { motion, useScroll } from 'framer-motion';
import { FaGift, FaTshirt } from 'react-icons/fa';
import { MotionDiv, MotionSection } from '@/types/motion';

export default function Schedule() {
  const { scrollYProgress } = useScroll();
  
  const listVariants = {
    hidden: { y: 20 },
    visible: {
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15 },
    visible: { 
      y: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-sage-50 via-sage-100 to-sage-50 text-center">
      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={listVariants}
        className="max-w-4xl mx-auto px-4"
      >
        <h3 className="text-4xl md:text-5xl font-script text-forest-dark mb-16">
          Wedding Schedule
        </h3>

        {/* Timeline */}
        <div className="relative text-lg md:text-xl space-y-0 font-medium mb-20 max-w-xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-[21px] top-4 bottom-4 w-[2px] bg-mint"></div>

          {[
            {
              time: "3:00 PM",
              event: "Ceremony",
              location: "Manila Cathedral"
            },
            {
              time: "5:00 PM",
              event: "Reception",
              location: "Ibayo Events Place"
            },
            {
              time: "7:00 PM",
              event: "Dinner and Games",
              location: ""
            }
          ].map((item, index) => (
            <MotionDiv 
              key={index}
              variants={itemVariants}
              className="relative pl-16 py-6 text-left flex flex-col group"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full 
                bg-white border-4 border-mint shadow-md group-hover:scale-110 
                group-hover:border-mint-dark transition-all duration-300"></div>
              
              {/* Content */}
              <div className="transform group-hover:translate-x-2 transition-transform duration-300
                bg-white p-4 rounded-lg shadow-md">
                <div className="text-mint-dark font-semibold text-xl mb-1">
                  {item.time}
                </div>
                <div className="text-forest-dark text-lg">
                  {item.event}
                  {item.location && (
                    <span className="text-forest-dark text-base block mt-1">
                      at {item.location}
                    </span>
                  )}
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>

        {/* Info Cards */}
        <div className="mt-16 space-y-8">
          {/* Gift Information */}
          <MotionDiv 
            className="bg-white shadow-lg p-8 rounded-lg max-w-2xl mx-auto 
              transform hover:scale-[1.02] transition-transform duration-300"
            variants={itemVariants}
          >
            <FaGift className="text-mint-dark text-3xl mx-auto mb-4" />
            <h4 className="text-2xl font-script text-forest-dark mb-4">Gift Information</h4>
            <p className="text-lg text-forest-dark leading-relaxed">
              Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, 
              monetary gifts are greatly appreciated as we begin our new life together.
            </p>
          </MotionDiv>

          {/* Attire */}
          <MotionDiv 
            className="bg-white shadow-lg p-8 rounded-lg max-w-3xl mx-auto 
              transform hover:scale-[1.02] transition-transform duration-300"
            variants={itemVariants}
          >
            <FaTshirt className="text-mint-dark text-3xl mx-auto mb-4" />
            <h4 className="text-2xl font-script text-forest-dark mb-4">Attire</h4>
            <p className="text-lg text-forest-dark font-medium mb-6">Formal / Semi-formal Attire</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Ladies Section */}
              <div className="bg-sage-50 p-4 rounded-lg border border-mint">
                <h5 className="font-medium text-forest-dark text-lg mb-2">Ladies</h5>
                <p className="text-sm text-forest-dark mb-3">Cocktail dresses or formal evening wear</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-forest-dark">Colors:</span>
                  <div className="flex gap-2">
                    {['#8B4513', '#556B2F', '#8FBC8F', '#B8860B'].map((color, i) => (
                      <div 
                        key={i}
                        className="w-6 h-6 rounded-full ring-1 ring-offset-1 ring-mint 
                          transform hover:scale-110 transition-transform duration-200 cursor-help"
                        style={{ backgroundColor: color }}
                        title={['Earth tones', 'Olive', 'Sage', 'Gold'][i]}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Gentlemen Section */}
              <div className="bg-sage-50 p-4 rounded-lg border border-mint">
                <h5 className="font-medium text-forest-dark text-lg mb-2">Gentlemen</h5>
                <p className="text-sm text-forest-dark mb-3">Suit and tie or Barong Tagalog</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-forest-dark">Colors:</span>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F5F5F5] ring-1 ring-offset-1 
                      ring-mint border border-gray-200" title="White (Barong)"></div>
                    <div className="w-6 h-6 rounded-full bg-[#2F4F4F] ring-1 ring-offset-1 
                      ring-mint" title="Dark Green"></div>
                    <div className="w-6 h-6 rounded-full bg-[#696969] ring-1 ring-offset-1 
                      ring-mint" title="Charcoal"></div>
                    <div className="w-6 h-6 rounded-full bg-[#000000] ring-1 ring-offset-1 
                      ring-mint" title="Black"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Please Avoid Section */}
            <div className="mt-6 bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="text-sm text-red-700">
                <span className="font-medium">Please Note:</span> White is reserved for the bride
              </p>
            </div>
          </MotionDiv>
        </div>
      </MotionDiv>
    </section>
  );
}
  