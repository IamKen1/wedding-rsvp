"use client";

import React, { useState, useEffect } from 'react';
import { MotionDiv, MotionSection } from '@/types/motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaExternalLinkAlt, FaImage, FaTimes } from 'react-icons/fa';
import SkeletonLoader from './SkeletonLoader';

interface WeddingLocation {
  id: number;
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  directions?: string;
  specialInstructions?: string;
  mapUrl?: string;
  mapPhoto?: string;
  sortOrder: number;
}

export default function Locations() {
  const [locations, setLocations] = useState<WeddingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };

    if (selectedPhoto) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations', {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Locations data fetched:', data);
          setLocations(data);
        } else {
          console.error('Failed to load locations, status:', response.status);
          setError('Failed to load locations');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Error loading locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <MotionSection id="locations" className="relative py-20 bg-gradient-to-b from-cream-50 via-sage-50 to-mint-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-mint-200/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-blush-200/30 rounded-full blur-xl animate-float" 
             style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-forest-800 mb-4 font-light tracking-wide">
            Wedding Locations
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blush-400 to-sage-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-forest-600 font-serif text-lg max-w-2xl mx-auto font-normal">
            Important venue information and directions for our special day
          </p>
        </MotionDiv>

        {/* Locations Grid */}
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonLoader type="card" count={3} />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-sans">{error}</p>
            </div>
          ) : locations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((location) => {
                const cardVariants = {
                  hidden: { y: 30, opacity: 0, scale: 0.95 },
                  visible: { 
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }
                };
                
                return (
                <MotionDiv
                  key={location.id}
                  variants={cardVariants}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50"
                >
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaMapMarkerAlt className="text-white text-lg" />
                    </div>
                    <h3 className="text-xl font-bold font-sans text-forest-800 mb-2">{location.name}</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Address */}
                    <div>
                      <p className="text-forest-700 font-sans text-sm leading-relaxed">{location.address}</p>
                    </div>

                    {/* Contact Information */}
                    {(location.contactPhone || location.contactEmail) && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-forest-600 mb-2 font-sans">Contact Information</h4>
                        {location.contactPhone && (
                          <div className="flex items-center gap-2 mb-1">
                            <FaPhone className="text-forest-500 text-xs" />
                            <span className="text-sm text-forest-600 font-sans">{location.contactPhone}</span>
                          </div>
                        )}
                        {location.contactEmail && (
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-forest-500 text-xs" />
                            <span className="text-sm text-forest-600 font-sans">{location.contactEmail}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Map Photo */}
                    {location.mapPhoto && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-forest-600 mb-3 font-sans flex items-center gap-2">
                          <FaImage className="text-xs" />
                          Map & Directions
                        </h4>
                        <div 
                          className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-forest-400 transition-colors"
                          onClick={() => setSelectedPhoto(location.mapPhoto!)}
                        >
                          <img 
                            src={location.mapPhoto} 
                            alt={`Map for ${location.name}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <p className="text-xs text-forest-500 font-sans mt-1 text-center">
                          Click to view full size
                        </p>
                      </div>
                    )}

                    {/* Directions */}
                    {location.directions && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-forest-600 mb-2 font-sans">Directions</h4>
                        <p className="text-sm text-forest-600 font-sans leading-relaxed">{location.directions}</p>
                      </div>
                    )}

                    {/* Special Instructions */}
                    {location.specialInstructions && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-forest-600 mb-2 font-sans">Special Instructions</h4>
                        <p className="text-sm text-forest-600 font-sans leading-relaxed">{location.specialInstructions}</p>
                      </div>
                    )}

                    {/* Map Link */}
                    {location.mapUrl && (
                      <div className="pt-4">
                        <a
                          href={location.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-forest-500 to-sage-500 
                                   text-white rounded-lg hover:from-forest-600 hover:to-sage-600 transition-all duration-200 
                                   text-sm font-medium font-sans"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                          Open in Maps
                        </a>
                      </div>
                    )}
                  </div>
                </MotionDiv>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-forest-600 font-sans">No locations available at this time.</p>
            </div>
          )}
        </MotionDiv>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            // Close modal if clicking backdrop
            if (e.target === e.currentTarget) {
              setSelectedPhoto(null);
            }
          }}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img 
                src={selectedPhoto} 
                alt="Location map"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </MotionSection>
  );
}