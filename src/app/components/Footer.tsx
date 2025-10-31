"use client";

import { useState } from 'react';
import { MotionDiv, MotionSection } from '@/types/motion';
import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';

export default function Footer() {
  const [showKennethPhone, setShowKennethPhone] = useState(false);
  const [showJennaPhone, setShowJennaPhone] = useState(false);
  return (
    <MotionSection 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative py-16 pb-32 md:pb-16 bg-gradient-elegant from-forest-800 via-forest-700 to-forest-900 text-white overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-mint-400/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blush-400/15 rounded-full blur-xl animate-float" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 
          bg-sage-300/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Main Content Grid - reduced gap */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Wedding Info */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h4 className="text-2xl font-something text-mint-300 mb-6">Kenneth & Jenna</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <FaCalendarAlt className="text-mint-400 text-lg" />
                <span className="text-gray-200 font-proxima-regular">Saturday, January 24, 2026</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <FaClock className="text-mint-400 text-lg" />
                <span className="text-gray-200 font-proxima-regular">1:30 PM Onwards</span>
              </div>
            </div>
          </MotionDiv>

          {/* Contact Information */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h4 className="text-xl font-semibold text-white mb-6 font-proxima-regular">Contact Us</h4>
            <div className="space-y-4">
              <button 
                onClick={() => setShowKennethPhone(!showKennethPhone)}
                className="w-full bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-mint-400/20 
                  hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FaPhone className="text-mint-400" />
                  <span className="font-medium text-mint-300">Kenneth</span>
                </div>
                {showKennethPhone && (
                  <p className="text-gray-200 text-sm mt-2 animate-fadeIn">0929-133-8412</p>
                )}
                {!showKennethPhone && (
                  <p className="text-gray-400 text-xs mt-1">Click to reveal</p>
                )}
              </button>
              
              <button 
                onClick={() => setShowJennaPhone(!showJennaPhone)}
                className="w-full bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-blush-400/20
                  hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FaPhone className="text-blush-400" />
                  <span className="font-medium text-blush-300">Jenna</span>
                </div>
                {showJennaPhone && (
                  <p className="text-gray-200 text-sm mt-2 animate-fadeIn">0955-437-2117</p>
                )}
                {!showJennaPhone && (
                  <p className="text-gray-400 text-xs mt-1">Click to reveal</p>
                )}
              </button>
            </div>
          </MotionDiv>

          {/* Location */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center md:text-right"
          >
            <h4 className="text-xl font-semibold text-white mb-6 font-proxima-regular">Venue</h4>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-sage-400/20">
              <div className="flex items-center justify-center md:justify-end gap-3 mb-3">
                <FaMapMarkerAlt className="text-sage-400 text-lg" />
                <span className="font-medium text-sage-300">Location</span>
              </div>
              <p className="text-gray-200 leading-relaxed font-proxima-regular">
                Liam and Belle Resort and Pavillion<br />
                Santa Maria, Bulacan
              </p>
            </div>
          </MotionDiv>
        </div>

        {/* Decorative Separator */}
        <MotionDiv
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full h-px bg-gradient-to-r from-transparent via-mint-400/50 to-transparent mb-12"
        />

        {/* Bottom Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="mb-6">
            <p className="text-lg text-gray-200 italic leading-relaxed max-w-2xl mx-auto font-proxima-regular">
              "Love is not about how many days, weeks, or months you've been together, 
              it's all about how much you love each other every day."
            </p>
          </div>

          {/* Hearts Animation */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-mint-400/50 to-transparent" />
            <div className="flex gap-2">
              <FaHeart className="text-blush-400 text-lg animate-pulse" />
              <FaHeart className="text-mint-400 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              <FaHeart className="text-sage-400 text-lg animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-mint-400/50 to-transparent" />
          </div>

          {/* Copyright */}
          <p className="text-gray-400 text-sm font-proxima-regular">
            © 2026 Kenneth & Jenna Wedding. Made with{' '}
            <FaHeart className="inline text-red-400 mx-1" />
            {' '}for our special day.
          </p>
        </MotionDiv>
      </div>

      {/* Additional decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 via-transparent to-transparent pointer-events-none" />
    </MotionSection>
  );
}
  