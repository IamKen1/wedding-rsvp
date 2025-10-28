"use client";

import { useEffect, useState } from 'react';
import { MotionSection, MotionDiv } from '@/types/motion';
import SkeletonLoader from './SkeletonLoader';

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
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
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
      className="relative py-12"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-sans text-forest-800 mb-2">Attire & Dress Code</h2>
          <p className="text-forest-600/80">Guidelines to help you look your best</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {attire.map((item, idx) => (
            <MotionDiv
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-forest-500/80 mb-1">{item.category}</div>
                  <h3 className="text-xl font-semibold text-forest-800">{item.title}</h3>
                </div>
                {item.colorScheme && (
                  <span className="text-xs px-3 py-1 rounded-full bg-mint-100 text-mint-700 border border-mint-200">{item.colorScheme}</span>
                )}
              </div>

              {item.description && (
                <p className="mt-3 text-forest-700/90">{item.description}</p>
              )}

              {item.dressCode && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-forest-700">Dress Code</div>
                  <p className="text-forest-700/90">{item.dressCode}</p>
                </div>
              )}

              {item.guidelines && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-forest-700">Guidelines</div>
                  <p className="text-forest-700/90 whitespace-pre-line">{item.guidelines}</p>
                </div>
              )}

              {item.photos && item.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {item.photos.slice(0, 6).map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`${item.title} photo ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-white/70 shadow-sm"
                    />
                  ))}
                </div>
              )}
            </MotionDiv>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
