"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { MotionDiv } from '@/types/motion';

interface SectionInfo {
  section: Element | null;
  distance: number;
}

const MotionNav = motion.nav;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      
      const sections = ['top', 'schedule', 'entourage', 'rsvp'].map(id => 
        document.querySelector(`#${id}`)
      );

      if (sections.every(section => section !== null)) {
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;
        
        // Find which section is most visible in the viewport
        const visibleSection = sections.reduce<SectionInfo>((prev, curr) => {
          if (!curr) return prev;
          const rect = curr.getBoundingClientRect();
          const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          return (!prev || distanceFromCenter < prev.distance) 
            ? { section: curr, distance: distanceFromCenter }
            : prev;
        }, { section: null, distance: Infinity });

        if (visibleSection.section) {
          setIsDark(['top', 'rsvp'].includes(visibleSection.section.id));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const navLinks = [
    { href: "#top", label: "Home" },
    { href: "#schedule", label: "Schedule" },
    { href: "#entourage", label: "Entourage" },
    { href: "#rsvp", label: "RSVP" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <MotionNav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500
          ${scrolled 
            ? (isDark ? 'bg-gradient-to-b from-mint-dark/40 to-mint-dark/30' : 'bg-mint-light/80') 
            : ''}`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center justify-center space-x-12">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className={`relative px-2 py-1 text-sm uppercase tracking-[0.2em] 
                      ${isDark ? 'text-white' : 'text-leaf-dark'}
                      transition-all duration-300 hover:opacity-90 group font-medium`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 w-0 h-[2px] 
                      ${isDark 
                        ? 'bg-gradient-to-r from-mint-light to-mint' 
                        : 'bg-gradient-to-r from-leaf to-leaf-dark'} 
                      transition-all duration-300 group-hover:w-full opacity-80`} 
                    />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-full transition-colors duration-300
                ${isDark ? 'text-white hover:bg-mint-dark/20' : 'text-leaf-dark hover:bg-mint-light/50'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <IoCloseOutline size={28} /> : <IoMenuOutline size={28} />}
            </button>
          </div>
        </div>
      </MotionNav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-b from-mint-dark/95 to-leaf-dark/95 z-[90] md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full">
              {navLinks.map((link, index) => (
                <MotionDiv
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="px-6 py-4 text-white text-2xl font-light tracking-wider
                      hover:text-mint-light transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] 
                      bg-mint-light transition-all duration-300 group-hover:w-3/4" />
                  </button>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
} 