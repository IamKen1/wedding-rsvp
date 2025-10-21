import { Suspense } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Schedule from './components/Schedule';
import Entourage from './components/Entourage';
import Locations from './components/Locations';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';

// Loading fallbacks for each section
const ScheduleFallback = () => (
  <div className="py-16 bg-gradient-soft from-sage-50/50 via-cream-50/30 to-mint-50/50">
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
  <div className="py-16 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
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
  <div className="py-20 bg-gradient-to-b from-cream-50 via-sage-50 to-mint-50">
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
  <div className="py-16 bg-gradient-soft from-sage-50 via-mint-50 to-blush-50">
    <div className="max-w-[800px] mx-auto px-6">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-mint-200/50">
        <SkeletonLoader type="form" count={1} />
      </div>
    </div>
  </div>
);

export default function HomePage() {
  return (
    <main className="relative bg-gradient-soft from-cream-50 via-sage-50 to-mint-50">
      <Navigation />
      <div id="top">
        <Header />
      </div>
      <div id="schedule" className="relative z-10">
        <Suspense fallback={<ScheduleFallback />}>
          <Schedule />
        </Suspense>
      </div>
      <div id="entourage" className="relative z-10">
        <Suspense fallback={<EntourageFallback />}>
          <Entourage />
        </Suspense>
      </div>
      <div id="locations" className="relative z-10">
        <Suspense fallback={<LocationsFallback />}>
          <Locations />
        </Suspense>
      </div>
      <div id="rsvp" className="relative z-10">
        <Suspense fallback={<RSVPFallback />}>
          <RSVP />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
