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
        console.log('Fetching locations from /api/locations...');
        const response = await fetch('/api/locations', {
          cache: 'no-store'
        });
        
        console.log('Response status:', response.status, 'OK:', response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Locations data fetched:', data);
          console.log('Number of locations:', data.length);
          setLocations(data);
          setError(null);
        } else {
          console.error('Failed to load locations, status:', response.status);
          setError('Failed to load locations');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Error loading locations');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <MotionSection id="locations" className="relative py-20 bg-white border-t border-gray-100 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#F5EEE6]/15 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-[#E6D5BE]/20 rounded-full blur-xl animate-float" 
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
          <h2 className="text-2xl md:text-4xl font-script text-gray-800 mb-4 font-light tracking-wide">
            Wedding Locations
          </h2>
          <div className="w-24 h-1 bg-[#C9A87C] mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-700 font-proxima-regular text-lg max-w-2xl mx-auto font-normal">
            Important venue information and directions for our special day
          </p>
        </MotionDiv>

        {/* Locations Grid */}
        <div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonLoader type="card" count={3} />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-proxima-regular">{error}</p>
            </div>
          ) : locations.length > 0 ? (
            <div className="flex flex-wrap gap-8 justify-center">
              {locations.map((location, index) => (
          <MotionDiv
            key={location.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#C9A87C] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-bold font-proxima-regular text-gray-800 mb-2">{location.name}</h3>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div>
                <p className="text-gray-700 font-proxima-regular text-sm leading-relaxed">{location.address}</p>
              </div>

              {/* Contact Information */}
              {(location.contactPhone || location.contactEmail) && (
                <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 font-proxima-regular">Contact Information</h4>
            {location.contactPhone && (
              <div className="flex items-center gap-2 mb-1">
                <FaPhone className="text-[#C9A87C] text-xs" />
                <span className="text-sm text-gray-700 font-proxima-regular">{location.contactPhone}</span>
              </div>
            )}
            {location.contactEmail && (
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#C9A87C] text-xs" />
                <span className="text-sm text-gray-700 font-proxima-regular">{location.contactEmail}</span>
              </div>
            )}
                </div>
              )}

              {/* Map Photo */}
              {location.mapPhoto && (
                <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 font-proxima-regular flex items-center gap-2">
              <FaImage className="text-xs" />
              Map & Directions
            </h4>
            <div 
              className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-[#C9A87C] transition-colors"
              onClick={() => setSelectedPhoto(location.mapPhoto!)}
            >
              <img 
                src={location.mapPhoto} 
                alt={`Map for ${location.name}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
            <p className="text-xs text-gray-600 font-proxima-regular mt-1 text-center">
              Click to view full size
            </p>
                </div>
              )}

              {/* Directions */}
              {location.directions && (
                <div className="border-t border-gray-200 pt-4">
            {/* <h4 className="text-sm font-bold text-gray-800 mb-2 font-proxima-regular">Address</h4> */}
            <p className="text-sm text-gray-700 font-proxima-regular leading-relaxed">{location.directions}</p>
                </div>
              )}

              {/* Special Instructions */}
              {location.specialInstructions && (
                <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 font-proxima-regular">Special Instructions</h4>
            <p className="text-sm text-gray-700 font-proxima-regular leading-relaxed">{location.specialInstructions}</p>
                </div>
              )}

              {/* Map Link */}
              {location.mapUrl && (
                <div className="pt-4">
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A87C] 
                 text-white rounded-lg hover:bg-[#B89870] transition-all duration-200 
                 text-sm font-medium font-proxima-regular"
            >
              <FaExternalLinkAlt className="text-xs" />
              Open in Maps
            </a>
                </div>
              )}
            </div>
          </MotionDiv>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 font-proxima-regular">No locations available at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[99999] bg-black bg-opacity-90 flex items-center justify-center p-4 pt-20 overflow-y-auto"
          onClick={(e) => {
            // Close modal if clicking backdrop
            if (e.target === e.currentTarget) {
              setSelectedPhoto(null);
            }
          }}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col">
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
                className="max-w-[90%] max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </MotionSection>
  );
}