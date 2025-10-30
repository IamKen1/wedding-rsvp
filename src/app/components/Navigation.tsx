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
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100'
            : 'bg-white/40 backdrop-blur-md'}`}
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
              <span className={`text-xl font-something transition-colors duration-300 text-gray-800`}>
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
                        ${isActive 
                          ? 'text-gray-800 bg-[#F5EEE6]' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        } font-semibold text-sm tracking-wide flex items-center gap-2 font-proxima-regular`}
                    >
                      <link.icon className="text-sm" />
                      {link.label}
                      
                      {/* Active indicator */}
                      {isActive && (
                        <MotionDiv
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 
                            bg-[#C9A87C] rounded-full"
                        />
                      )}
                    </button>
                  </MotionDiv>
                );
              })}
            </div>

          </div>
        </div>
      </MotionNav>

      {/* Mobile Bottom Tab Bar - Native App Style */}
      <MotionDiv
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-[200] 
          bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl"
      >
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl
                  transition-all duration-300 cursor-pointer flex-1 relative min-w-0
                  ${isActive ? 'bg-[#F5EEE6]/80' : 'bg-transparent'}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <MotionDiv
                    layoutId="activeTab"
                    className="absolute top-0 left-0 right-0 mx-auto w-10 h-1 
                      bg-[#C9A87C] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <link.icon 
                  className={`text-xl transition-all duration-300
                    ${isActive ? 'text-[#C9A87C] scale-110' : 'text-gray-500'}`} 
                />
                
                <span 
                  className={`text-[10px] font-semibold tracking-wide font-proxima-regular
                    transition-all duration-300 text-center
                    ${isActive ? 'text-gray-900' : 'text-gray-500'}`}
                >
                  {link.label}
                </span>
              </button>
            );
          })}
        </div>
      </MotionDiv>
    </>
  );
} 