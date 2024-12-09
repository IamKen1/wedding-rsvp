"use client";

import { motion, useScroll } from 'framer-motion';
import { FaGift, FaTshirt } from 'react-icons/fa';
import { MotionDiv, MotionSection } from '@/types/motion';

export default function Schedule() {
  const { scrollYProgress } = useScroll();
  
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-white to-sage-50" />
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <MotionDiv
            key={i}
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute w-16 h-16 opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(180,229,201,0.4) 0%, rgba(180,229,201,0) 70%)`
            }}
          />
        ))}
      </div>

      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={listVariants}
        className="max-w-4xl mx-auto px-4 relative z-10"
      >
        {/* Title with animated underline */}
        <div className="text-center mb-16 relative">
          <h3 className="text-4xl md:text-5xl font-script text-forest-dark mb-4">
            Wedding Schedule
          </h3>
          <MotionDiv
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-mint to-transparent max-w-[200px] w-full"
          />
        </div>

        {/* Timeline with enhanced animations */}
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

        {/* Info Cards with hover effects */}
        <div className="mt-16 space-y-8">
          {/* Gift Information Card */}
          <MotionDiv 
            className="bg-white/80 backdrop-blur-sm shadow-lg p-8 rounded-2xl max-w-2xl mx-auto 
              transform hover:scale-[1.02] transition-all duration-300
              border border-mint/10 hover:border-mint/30
              relative overflow-hidden group"
            variants={itemVariants}
          >
            {/* Decorative corner gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint/5 to-transparent 
              rounded-bl-[100px] group-hover:w-40 group-hover:h-40 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-mint/5 to-transparent 
              rounded-tr-[100px] group-hover:w-40 group-hover:h-40 transition-all duration-300" />
            
            <FaGift className="text-mint-dark text-3xl mx-auto mb-4" />
            <h4 className="text-2xl font-script text-forest-dark mb-4">Gift Information</h4>
            <p className="text-lg text-forest-dark leading-relaxed">
              Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, 
              monetary gifts are greatly appreciated as we begin our new life together.
            </p>
          </MotionDiv>

          {/* Attire Card with similar enhancements */}
          <MotionDiv 
            className="bg-white/80 backdrop-blur-sm shadow-lg p-8 rounded-2xl max-w-3xl mx-auto 
              transform hover:scale-[1.02] transition-all duration-300
              border border-mint/10 hover:border-mint/30
              relative overflow-hidden group"
            variants={itemVariants}
          >
            {/* Decorative corner gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint/5 to-transparent 
              rounded-bl-[100px] group-hover:w-40 group-hover:h-40 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-mint/5 to-transparent 
              rounded-tr-[100px] group-hover:w-40 group-hover:h-40 transition-all duration-300" />
            
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
  