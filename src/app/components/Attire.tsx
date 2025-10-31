"use client";

import { useEffect, useState } from 'react';
import { MotionSection, MotionDiv } from '@/types/motion';
import SkeletonLoader from './SkeletonLoader';
import { useImageModal } from '../contexts/ImageModalContext';
import { FaPalette, FaInfoCircle } from 'react-icons/fa';

interface WeddingAttireItem {
  id: number;
  photos: string[];
  sortOrder: number;
}

export default function Attire() {
  const { openModal } = useImageModal();
  const [attire, setAttire] = useState<WeddingAttireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttire = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/attire', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load attire');
        const data = await res.json();
        const items: WeddingAttireItem[] = (data?.attire || []).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setAttire(items);
      } catch (e: any) {
        setError(e?.message || 'Failed to load attire');
      } finally {
        setLoading(false);
      }
    };
    fetchAttire();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <FaInfoCircle />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MotionSection
      id="attire"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative py-16 bg-white border-t border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-block relative">
            <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-transparent via-[#F5EEE6]/30 to-transparent blur-xl" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-something text-gray-800 mb-3 relative">
              Dress Code & Attire
            </h2>
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E6D5BE]" />
            <FaPalette className="text-[#9E5E40] text-lg" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E6D5BE]" />
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Look your absolute best as we celebrate this special day together
          </p>
        </div>

        {/* Photo Gallery Grid */}
        {attire.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {attire.map((item, idx) => (
              item.photos && item.photos.length > 0 && item.photos.map((photo, photoIdx) => (
                <MotionDiv
                  key={`${item.id}-${photoIdx}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (idx * item.photos.length + photoIdx) * 0.05 }}
                  viewport={{ once: true }}
                  className="group relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] cursor-pointer"
                  onClick={() => openModal(photo)}
                >
                  {/* Subtle hover glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F5EEE6]/40 via-[#E6D5BE]/40 to-[#F5EEE6]/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
                  
                  {/* Photo Card */}
                  <div className="relative bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:border-[#E6D5BE]">
                    <div className="relative overflow-hidden">
                      <img
                        src={photo}
                        alt={`Attire ${idx + 1} - ${photoIdx + 1}`}
                        className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Subtle overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                          Click to view full size
                        </span>
                      </div>
                    </div>
                    {/* Subtle top accent bar */}
                    <div className="h-1 bg-gradient-to-r from-[#F5EEE6] via-[#9E5E40] to-[#F5EEE6]" />
                  </div>
                </MotionDiv>
              ))
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No attire photos available at this time.</p>
          </div>
        )}

        {/* Bottom note */}
        {attire.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-block px-6 py-3 bg-[#F5EEE6]/40 rounded-full border border-[#E6D5BE]/50 shadow-sm">
              <p className="text-gray-600 text-sm">
                We can't wait to see you dressed to celebrate! ✨
              </p>
            </div>
          </MotionDiv>
        )}
      </div>
    </MotionSection>
  );
}
