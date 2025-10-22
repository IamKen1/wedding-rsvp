"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { FaHome, FaHeart, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MotionDiv, MotionNav } from '@/types/motion';

interface SectionInfo {
  section: Element | null;
  distance: number;
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      
      const sections = ['top', 'schedule', 'entourage', 'locations', 'rsvp'].map(id => 
        document.querySelector(`#${id}`)
      );

      if (sections.every(section => section !== null)) {
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;
        
        const visibleSection = sections.reduce<SectionInfo>((prev, curr) => {
          if (!curr) return prev;
          const rect = curr.getBoundingClientRect();
          const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          return (!prev || distanceFromCenter < prev.distance) 
            ? { section: curr, distance: distanceFromCenter }
            : prev;
        }, { section: null, distance: Infinity });

        if (visibleSection.section) {
          setActiveSection(visibleSection.section.id);
          setIsDark(['top'].includes(visibleSection.section.id));
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const targetId = href.substring(1);
    setActiveSection(targetId);
    
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const navLinks = [
    { href: "#top", label: "Home", icon: FaHome },
    { href: "#rsvp", label: "RSVP", icon: FaHeart },
    { href: "#schedule", label: "Event Details", icon: FaCalendarAlt },
    { href: "#locations", label: "Locations", icon: FaMapMarkerAlt },
  ];

  return (
    <>
      <MotionNav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500
          ${scrolled 
            ? (isDark 
              ? 'bg-gradient-to-b from-forest-800/95 to-forest-700/90 backdrop-blur-lg shadow-xl' 
              : 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-mint-200/50') 
            : ''}`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <span className={`text-2xl font-great-vibes transition-colors duration-300 ${
                scrolled 
                  ? (isDark ? 'text-white' : 'text-forest-700')
                  : (isDark ? 'text-white' : 'text-forest-700')
              }`}>
                K & J
              </span>
            </MotionDiv>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-8">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <MotionDiv
                    key={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className={`relative px-4 py-2 rounded-full transition-all duration-300 group cursor-pointer
                        ${scrolled 
                          ? (isDark 
                            ? (isActive 
                              ? 'text-mint-300 bg-mint-500/20' 
                              : 'text-white hover:text-mint-200 hover:bg-white/10')
                            : (isActive 
                              ? 'text-mint-600 bg-mint-100' 
                              : 'text-forest-600 hover:text-mint-600 hover:bg-mint-50'))
                          : (isDark 
                            ? (isActive 
                              ? 'text-mint-300 bg-mint-500/20' 
                              : 'text-white hover:text-mint-200 hover:bg-white/10')
                            : (isActive 
                              ? 'text-mint-600 bg-mint-100' 
                              : 'text-forest-600 hover:text-mint-600 hover:bg-mint-50'))
                        } font-semibold text-sm tracking-wide flex items-center gap-2 font-sans`}
                    >
                      <link.icon className="text-sm" />
                      {link.label}
                      
                      {/* Active indicator */}
                      {isActive && (
                        <MotionDiv
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 
                            bg-mint-400 rounded-full"
                        />
                      )}
                    </button>
                  </MotionDiv>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-full transition-all duration-300 cursor-pointer ${
                scrolled 
                  ? (isDark 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-forest-600 hover:bg-mint-50')
                  : (isDark 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-forest-600 hover:bg-mint-50')
              }`}
              aria-label="Toggle menu"
            >
              <MotionDiv
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <IoCloseOutline size={28} /> : <IoMenuOutline size={28} />}
              </MotionDiv>
            </button>
          </div>
        </div>
      </MotionNav>

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
                    className="px-6 py-4 text-white text-2xl font-semibold tracking-wider cursor-pointer font-sans
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