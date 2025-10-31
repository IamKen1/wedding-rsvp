"use client";

import { Suspense } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Schedule from './components/Schedule';
import Locations from './components/Locations';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import ImageModal from './components/ImageModal';
import { ImageModalProvider, useImageModal } from './contexts/ImageModalContext';

// Loading fallbacks for each section
const ScheduleFallback = () => (
  <div className="py-16 bg-white">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="text-center mb-10">
        <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <SkeletonLoader type="card" count={3} />
      </div>
    </div>
  </div>
);

const EntourageFallback = () => (
  <div className="py-16 bg-white">
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonLoader type="card" count={6} />
      </div>
    </div>
  </div>
);

const LocationsFallback = () => (
  <div className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="h-14 bg-gray-200 rounded w-72 mx-auto mb-4 animate-pulse"></div>
        <div className="h-1 bg-gray-200 rounded w-24 mx-auto mb-6 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <SkeletonLoader type="card" count={3} />
      </div>
    </div>
  </div>
);

const RSVPFallback = () => (
  <div className="py-16 bg-white">
    <div className="max-w-[800px] mx-auto px-6">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <SkeletonLoader type="form" count={1} />
      </div>
    </div>
  </div>
);

function HomePageContent() {
  const { imageUrl, closeModal } = useImageModal();

  return (
    <>
      <main className="relative bg-white">
        <Navigation />
        <div id="top">
          <Header />
        </div>
        {/* RSVP Section - Moved to top priority position */}
        <div id="rsvp" className="relative z-10">
          <Suspense fallback={<RSVPFallback />}>
            <RSVP />
          </Suspense>
        </div>
        {/* Wedding Details Section - Combined Schedule, Attire, Entourage in tabs */}
        <div id="schedule" className="relative z-10">
          {/* Add ID anchor for entourage for backward compatibility */}
          <div id="entourage" className="absolute -top-20"></div>
          <Suspense fallback={<ScheduleFallback />}>
            <Schedule />
          </Suspense>
        </div>
        <div id="locations" className="relative z-10">
          <Suspense fallback={<LocationsFallback />}>
            <Locations />
          </Suspense>
        </div>
        <Footer />
      </main>
      {/* Global Image Modal - Rendered at page level for proper z-index layering */}
      <ImageModal 
        imageUrl={imageUrl}
        onClose={closeModal}
        alt="Full size image"
      />
    </>
  );
}

export default function HomePage() {
  return (
    <ImageModalProvider>
      <HomePageContent />
    </ImageModalProvider>
  );
}
