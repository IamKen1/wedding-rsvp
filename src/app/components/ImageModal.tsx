"use client";

import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
  alt?: string;
}

export default function ImageModal({ imageUrl, onClose, alt = "Full size image" }: ImageModalProps) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (imageUrl) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      
      // Disable scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scroll
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [imageUrl]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (imageUrl) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[100000]"
        aria-label="Close modal"
      >
        <FaTimes className="text-3xl" />
      </button>

      {/* Image */}
      <div 
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
