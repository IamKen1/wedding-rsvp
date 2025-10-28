"use client";

import { useEffect, useState } from 'react';
import { MotionSection, MotionDiv } from '@/types/motion';
import SkeletonLoader from './SkeletonLoader';
import { FaTshirt, FaUserTie, FaShoppingBag, FaPalette, FaInfoCircle } from 'react-icons/fa';

interface WeddingAttireItem {
  id: number;
  category: string;
  title: string;
  description?: string;
  colorScheme?: string;
  dressCode?: string;
  guidelines?: string;
  photos?: string[];
  sortOrder: number;
}

export default function Attire() {
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

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('formal') || cat.includes('suit')) return <FaUserTie className="text-[#C9A87C]" />;
    if (cat.includes('casual') || cat.includes('dress')) return <FaTshirt className="text-[#C9A87C]" />;
    if (cat.includes('accessories')) return <FaShoppingBag className="text-[#C9A87C]" />;
    return <FaTshirt className="text-[#C9A87C]" />;
  };

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
        {/* Elegant Header with decorative elements */}
        <div className="text-center mb-12 relative">
          <div className="inline-block relative">
            <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-transparent via-[#F5EEE6]/30 to-transparent blur-xl" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-great-vibes text-gray-800 mb-3 relative">
              Dress Code & Attire
            </h2>
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E6D5BE]" />
            <FaPalette className="text-[#C9A87C] text-lg" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E6D5BE]" />
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Look your absolute best as we celebrate this special day together
          </p>
        </div>

        {/* Attire Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {attire.map((item, idx) => (
            <MotionDiv
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Subtle hover glow - champagne accent */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F5EEE6]/40 via-[#E6D5BE]/40 to-[#F5EEE6]/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
              
              {/* Main Card - Predominantly White */}
              <div className="relative bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-[#E6D5BE]">
                {/* Subtle top accent bar - champagne */}
                <div className="h-1 bg-gradient-to-r from-[#F5EEE6] via-[#E6D5BE] to-[#F5EEE6]" />
                
                {/* Content */}
                <div className="p-6 md:p-8">
                  {/* Header with Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-[#F5EEE6] to-white rounded-lg flex items-center justify-center text-lg shadow-sm border border-[#E6D5BE]/40">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#C9A87C] font-semibold mb-1.5 font-sans">
                          {item.category}
                        </div>
                        <h3 className="text-xl md:text-2xl font-serif font-semibold text-gray-800">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    {item.colorScheme && (
                      <span className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#F5EEE6]/70 text-gray-600 text-xs font-medium border border-[#E6D5BE]/50 shadow-sm">
                        {item.colorScheme}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-4">
                      {item.description}
                    </p>
                  )}

                  {/* Dress Code Section */}
                  {item.dressCode && (
                    <div className="mb-4 p-4 bg-[#F5EEE6]/30 rounded-xl border border-[#E6D5BE]/40">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A87C]" />
                        <div className="text-xs font-semibold text-gray-700 font-sans uppercase tracking-wide">
                          Dress Code
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm md:text-base pl-4">
                        {item.dressCode}
                      </p>
                    </div>
                  )}

                  {/* Guidelines Section */}
                  {item.guidelines && (
                    <div className="mb-4 p-4 bg-white border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <FaInfoCircle className="text-[#C9A87C] text-xs" />
                        <div className="text-xs font-semibold text-gray-700 font-sans uppercase tracking-wide">
                          Guidelines
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm whitespace-pre-line pl-6">
                        {item.guidelines}
                      </p>
                    </div>
                  )}

                  {/* Photo Gallery */}
                  {item.photos && item.photos.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="text-[10px] uppercase tracking-widest text-[#C9A87C] font-semibold mb-3 font-sans">
                        Style Inspiration
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {item.photos.slice(0, 6).map((photo, i) => (
                          <div key={i} className="relative group/img overflow-hidden rounded-lg aspect-square">
                            <img
                              src={photo}
                              alt={`${item.title} inspiration ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 border border-gray-200"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtle bottom corner accent */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#F5EEE6]/20 to-transparent rounded-tl-[80px] pointer-events-none" />
              </div>
            </MotionDiv>
          ))}
        </div>

        {/* Bottom note */}
        {attire.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
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
