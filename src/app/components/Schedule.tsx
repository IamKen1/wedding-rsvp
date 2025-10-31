"use client";

import { MotionDiv } from '@/types/motion';
import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';
import { useImageModal } from '../contexts/ImageModalContext';
import {
  FaChurch,
  FaGlassCheers,
  FaUtensils,
  FaClock,
  FaMapMarkerAlt,
  FaHeart,
  FaGift,
  FaTshirt,
  FaCalendarAlt,
  FaMusic,
  FaCameraRetro,
  FaInfoCircle
} from 'react-icons/fa';

interface WeddingEvent {
  id: number;
  eventName: string;
  eventTime: string;
  location: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
}

interface WeddingAttire {
  id: number;
  photos: string[];
  sortOrder: number;
}

// Helper function to format time from 24-hour to 12-hour format
const formatTime = (time: string): string => {
  if (!time) return '';

  // Remove seconds if present (e.g., "13:00:00" -> "13:00")
  const timeParts = time.split(':');
  if (timeParts.length < 2) return time;

  let hours = parseInt(timeParts[0]);
  const minutes = timeParts[1];

  // Determine AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12 || 12; // Convert 0 to 12 for midnight

  return `${hours}:${minutes} ${period}`;
};

interface EntourageMember {
  id: number;
  name: string;
  role: string;
  side: 'bride' | 'groom' | 'male' | 'female' | 'both';
  category: 'parents' | 'sponsors' | 'other';
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

interface PrenupPhoto {
  id: number;
  photoUrl: string;
  caption: string;
  sortOrder: number;
}

export default function Schedule() {
  const { openModal } = useImageModal();
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'attire' | 'entourage' | 'prenup' | 'gifts'>('schedule');
  const [scheduleEvents, setScheduleEvents] = useState<WeddingEvent[]>([]);
  const [attireGuidelines, setAttireGuidelines] = useState<WeddingAttire[]>([]);
  const [entourageData, setEntourageData] = useState<EntourageMember[]>([]);
  const [prenupPhotos, setPrenupPhotos] = useState<PrenupPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert hex colors to readable names
  const getColorName = (hexColor: string): string => {
    const colorMap: { [key: string]: string } = {
      '#8dbfae': 'Sage Green',
      '#10B981': 'Mint Green',
      '#34D399': 'Emerald Green',
      '#6EE7B7': 'Light Green',
      '#A7F3D0': 'Pale Green',
      '#F0FDF4': 'Very Light Green',
      '#EC4899': 'Pink',
      '#F472B6': 'Light Pink',
      '#FBBF24': 'Gold',
      '#F59E0B': 'Amber',
      '#EF4444': 'Red',
      '#DC2626': 'Dark Red',
      '#3B82F6': 'Blue',
      '#1D4ED8': 'Dark Blue',
      '#8B5CF6': 'Purple',
      '#A855F7': 'Violet',
      '#6B7280': 'Gray',
      '#374151': 'Dark Gray',
      '#FFFFFF': 'White',
      '#000000': 'Black'
    };

    // Try exact match first
    if (colorMap[hexColor.toUpperCase()]) {
      return colorMap[hexColor.toUpperCase()];
    }

    // If no exact match, try to categorize by color ranges
    const hex = hexColor.replace('#', '').toLowerCase();
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Simple color categorization
    if (r > 200 && g > 200 && b > 200) return 'Light Color';
    if (r < 50 && g < 50 && b < 50) return 'Dark Color';
    if (g > r && g > b) return 'Green Tone';
    if (r > g && r > b) return 'Red/Pink Tone';
    if (b > r && b > g) return 'Blue Tone';
    if (r > 150 && g > 100 && b < 100) return 'Warm Tone';

    return hexColor; // Fallback to hex if can't categorize
  };

  // Fetch dynamic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        // Parallel fetch for better performance
        const [eventsResponse, attireResponse, entourageResponse, prenupResponse] = await Promise.all([
          fetch('/api/admin/schedule', { next: { revalidate: 60 } }),
          fetch('/api/admin/attire', { next: { revalidate: 60 } }),
          fetch('/api/admin/entourage', { next: { revalidate: 60 } }),
          fetch('/api/prenup', { next: { revalidate: 60 } })
        ]);

        if (eventsResponse.ok) {
          const events = await eventsResponse.json();
          setScheduleEvents(events.sort((a: WeddingEvent, b: WeddingEvent) => a.sortOrder - b.sortOrder));
        } else {
          setError(`Failed to load events`);
        }

        if (attireResponse.ok) {
          const attire = await attireResponse.json();
          setAttireGuidelines(attire.sort((a: WeddingAttire, b: WeddingAttire) => a.sortOrder - b.sortOrder));
        }

        if (entourageResponse.ok) {
          const entourage = await entourageResponse.json();
          setEntourageData(entourage.sort((a: EntourageMember, b: EntourageMember) => a.sortOrder - b.sortOrder));
        }

        if (prenupResponse.ok) {
          const prenup = await prenupResponse.json();
          setPrenupPhotos(prenup.sort((a: PrenupPhoto, b: PrenupPhoto) => a.sortOrder - b.sortOrder));
        }
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError('Failed to load schedule information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const getIconComponent = (iconName: string) => {
    // Handle both emoji and component names
    switch (iconName) {
      case 'FaChurch':
      case '⛪':
      case '🏛️':
        return FaChurch;
      case 'FaGlassCheers':
      case '🥂':
      case '🍾':
        return FaGlassCheers;
      case 'FaUtensils':
      case '🍽️':
      case '🥘':
        return FaUtensils;
      case 'FaHeart':
      case '❤️':
      case '💕':
        return FaHeart;
      case 'FaMusic':
      case '🎵':
      case '🎶':
        return FaMusic;
      case 'FaCameraRetro':
      case '📷':
      case '📸':
        return FaCameraRetro;
      case '📅':
      case '🗓️':
        return FaCalendarAlt;
      default:
        return FaHeart;
    }
  };

  // Helper function to get gradient classes from hex color
  const getGradientClass = (hexColor: string) => {
    // Map common hex colors to Tailwind gradient classes
    const colorMap: { [key: string]: string } = {
      '#10B981': 'from-emerald-500 to-mint-600',
      '#3B82F6': 'from-blue-500 to-indigo-600',
      '#8B5CF6': 'from-violet-500 to-purple-600',
      '#EC4899': 'from-pink-500 to-rose-600',
      '#F59E0B': 'from-amber-500 to-orange-600',
      '#6366F1': 'from-indigo-500 to-blue-600'
    };

    return colorMap[hexColor] || 'from-mint-500 to-sage-600';
  };

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-soft from-sage-50/50 via-cream-50/30 to-mint-50/50">
      {/* Reduced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-mint-100/15 via-transparent to-sage-100/15" />

        {/* Smaller animated background elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-mint-200/15 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-20 h-20 bg-blush-200/20 rounded-full blur-lg animate-float"
          style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-sage-300/25 rounded-full blur-lg animate-float"
          style={{ animationDelay: '4s' }} />
      </div>

      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={containerVariants}
        className="max-w-[1200px] mx-auto px-6 relative z-10"
      >
        {/* Compact Title Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-4xl md:text-5xl font-script text-[#9E5E40] mb-4 font-light tracking-wide">
            Our Special Day
          </h3>
          <p className="text-base text-gray-800 max-w-2xl mx-auto mb-6 font-proxima-regular">
            Join us for a celebration of love, joy, and new beginnings
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'schedule' as const, label: 'Schedule', icon: FaCalendarAlt },
              { id: 'attire' as const, label: 'Attire', icon: FaTshirt },
              { id: 'entourage' as const, label: 'Entourage', icon: FaHeart },
              { id: 'prenup' as const, label: 'Prenup', icon: FaCameraRetro },
              { id: 'gifts' as const, label: 'Gifts', icon: FaGift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 cursor-pointer font-proxima-regular text-sm md:text-base ${activeTab === tab.id
                    ? 'bg-[#9E5E40] text-white shadow-lg transform scale-105'
                    : 'bg-white/80 text-[#9E5E40] hover:bg-mint-100 hover:shadow-md'
                  }`}
              >
                <tab.icon className="text-sm" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </MotionDiv>

        {/* Content based on active tab */}
        {activeTab === 'schedule' && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="grid md:grid-cols-3 gap-8">
                <SkeletonLoader type="card" count={3} />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <FaInfoCircle className="text-red-500 text-4xl mx-auto mb-4" />
                <p className="text-red-600 text-3xl mb-2 font-proxima-regular font-semibold">Error loading schedule</p>
                <p className="text-[#9E5E40] font-proxima-regular">{error}</p>
              </div>
            ) : scheduleEvents.length > 0 ? (
              <div className="max-w-3xl mx-auto mb-12">
                {/* Timeline Container */}
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#9E5E40]/20 via-[#9E5E40]/40 to-[#9E5E40]/20" />
                  
                  {scheduleEvents.map((event, index) => {
                    const IconComponent = getIconComponent(event.icon);
                    const isEven = index % 2 === 0;
                    
                    return (
                      <MotionDiv
                        key={event.id}
                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`relative flex items-center mb-4 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                      >
                        {/* Content Card */}
                        <div className={`w-[calc(50%-2.5rem)] ${isEven ? 'text-right pr-6' : 'text-left pl-6'}`}>
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-[#9E5E40]/10 hover:shadow-lg transition-all duration-300 group">
                            {/* Time */}
                            <div className={`flex items-center gap-1.5 text-[#9E5E40] font-bold mb-2 ${isEven ? 'justify-end' : 'justify-start'}`}>
                              <FaClock className="text-xs" />
                              <span className="text-base font-proxima-regular">{formatTime(event.eventTime)}</span>
                            </div>
                            
                            {/* Event Name */}
                            <h4 className="text-lg font-bold font-proxima-regular text-gray-800 mb-1.5">
                              {event.eventName}
                            </h4>
                            
                            {/* Description */}
                            {event.description && (
                                <p className="text-gray-600 text-xs mb-2 font-proxima-regular leading-relaxed italic">
                                {event.description}
                                </p>
                            )}
                            
                            {/* Location */}
                            {event.location && (
                              <div className={`flex items-center gap-1 text-gray-600 text-[11px] ${isEven ? 'justify-end' : 'justify-start'}`}>
                                <FaMapMarkerAlt className="text-[#9E5E40] text-[9px]" />
                                <span className="font-proxima-regular">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Center Icon */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9E5E40] to-[#7d4a33] flex items-center justify-center shadow-md border-3 border-white group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="text-white text-lg" />
                          </div>
                        </div>
                        
                        {/* Empty space on opposite side */}
                        <div className="w-[calc(50%-2.5rem)]" />
                      </MotionDiv>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <FaCalendarAlt className="text-[#9E5E40] text-4xl mx-auto mb-4" />
                <p className="text-[#9E5E40] text-3xl font-proxima-regular">No events scheduled at this time.</p>
              </div>
            )}
          </MotionDiv>
        )}

        {/* Attire Tab */}
        {activeTab === 'attire' && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[1000px] mx-auto"
          >
            <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 md:p-12 rounded-3xl 
              border border-mint-200/50 relative overflow-hidden">

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-mint-100/30 to-transparent 
                rounded-bl-[100px]" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sage-100/30 to-transparent 
                rounded-tr-[100px]" />

              <div className="text-center mb-8">

                <h4 className="text-3xl font-bold font-script text-[#9E5E40] mb-4">Dress Code</h4>
                {/* <p className="text-3xl text-forest-600 font-medium">Formal / Semi-formal Attire</p> */}
              </div>

              {loading ? (
                <div className="flex justify-center mb-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <SkeletonLoader type="card" count={2} />
                  </div>
                </div>
              ) : attireGuidelines.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  {attireGuidelines.map((attire) => (
                    attire.photos && attire.photos.length > 0 && attire.photos.map((photo, photoIndex) => (
                      <div
                        key={`${attire.id}-${photoIndex}`}
                        className="group relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] cursor-pointer"
                        onClick={() => openModal(photo)}
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blush-200/40 via-mint-200/40 to-blush-200/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
                        <div className="relative bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:border-mint-300">
                          <div className="relative overflow-hidden">
                            <img
                              src={photo}
                              alt={`Attire ${attire.id} - ${photoIndex + 1}`}
                              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                                Click to view full size
                              </span>
                            </div>
                          </div>
                          <div className="h-1 bg-gradient-to-r from-blush-300 via-mint-300 to-blush-300" />
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-forest-600 font-proxima-regular">No attire guidelines available at this time.</p>
                </div>
              )}

              {/* Important Notes */}
              <div className="bg-gradient-to-r from-red-50 to-blush-50 p-4 rounded-xl 
                border-l-4 border-red-400 shadow-inner">
                <p className="text-red-700 text-center font-proxima-regular">
                  <span className="font-bold">Please Note:</span> White and ivory are reserved for the bride
                </p>
              </div>
            </div>
          </MotionDiv>
        )}

        {/* Entourage Tab */}
        {activeTab === 'entourage' && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[1100px] mx-auto"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonLoader type="card" count={6} />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <FaHeart className="text-red-500 text-4xl mx-auto mb-4" />
                <p className="text-red-600 text-3xl mb-2 font-proxima-regular">Error loading entourage</p>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : entourageData.length === 0 ? (
              <div className="text-center py-16">
                <FaHeart className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-3xl font-proxima-regular">No entourage members added yet</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Group entourage members */}
                {(() => {
                  const parents = entourageData.filter(m => m.category === 'parents');
                  const brideParents = parents.filter(m => m.side === 'bride');
                  const groomParents = parents.filter(m => m.side === 'groom');
                  const sponsors = entourageData.filter(m => m.category === 'sponsors');
                  const others = entourageData.filter(m => m.category === 'other');

                  return (
                    <>
                      {/* Parents Section */}
                      {parents.length > 0 && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-sage-200/50">
                          <h4 className="text-3xl md:text-4xl font-bold font-script text-center text-[#9E5E40] mb-10">Parents</h4>
                          
                          <div className="max-w-4xl mx-auto space-y-8">
                            <div className="grid md:grid-cols-2 gap-12">
                              {groomParents.length > 0 && (
                                <div className="space-y-4">
                                  <div className="text-center mb-6">
                                    <h5 className="text-3xl font-script text-gray-700 mb-2">Groom&apos;s Parents</h5>
                                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                  </div>
                                  <div className="space-y-3">
                                    {groomParents.map(member => (
                                      <div key={member.id} className="text-center">
                                        <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">{member.name}</p>
                                        {member.description && (
                                          <p className="text-gray-600 text-sm italic font-proxima-regular">{member.description}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {brideParents.length > 0 && (
                                <div className="space-y-4">
                                  <div className="text-center mb-6">
                                    <h5 className="text-3xl font-script text-gray-700 mb-2">Bride&apos;s Parents</h5>
                                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                  </div>
                                  <div className="space-y-3">
                                    {brideParents.map(member => (
                                      <div key={member.id} className="text-center">
                                        <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">{member.name}</p>
                                        {member.description && (
                                          <p className="text-gray-600 text-sm italic font-proxima-regular">{member.description}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sponsors Section */}
                      {sponsors.length > 0 && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-sage-200/50">
                          <h4 className="text-3xl md:text-4xl font-bold font-script text-center text-[#9E5E40] mb-10">Principal Sponsors</h4>
                          
                          <div className="max-w-4xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-12">
                              {/* Ninongs (Male Sponsors) */}
                              <div className="space-y-4">
                                <div className="text-center mb-6">
                                  <h5 className="text-3xl font-script text-gray-700 mb-2">Ninongs</h5>
                                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                </div>
                                <div className="space-y-3">
                                  {sponsors
                                    .filter(member => member.side === 'male')
                                    .map(member => (
                                      <div key={member.id} className="text-center">
                                        <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                          MR. {member.name}
                                        </p>
                                        {member.description && (
                                          <p className="text-gray-600 text-sm italic font-proxima-regular">
                                            {member.description}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>

                              {/* Ninangs (Female Sponsors) */}
                              <div className="space-y-4">
                                <div className="text-center mb-6">
                                  <h5 className="text-3xl font-script text-gray-700 mb-2">Ninangs</h5>
                                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                </div>
                                <div className="space-y-3">
                                  {sponsors
                                    .filter(member => member.side === 'female')
                                    .map(member => (
                                      <div key={member.id} className="text-center">
                                        <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                          MRS. {member.name}
                                        </p>
                                        {member.description && (
                                          <p className="text-gray-600 text-sm italic font-proxima-regular">
                                            {member.description}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Secondary Sponsors Section */}
                      {others.length > 0 && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-sage-200/50">
                          <h4 className="text-3xl md:text-4xl font-bold font-script text-center text-[#9E5E40] mb-10">
                            Secondary Sponsors
                          </h4>
                          
                          <div className="max-w-4xl mx-auto space-y-8">
                            {/* Group by role */}
                            {(() => {
                              // Extract actual role from format "Groomsman - Candle" -> "Candle"
                              const extractRole = (roleStr: string) => {
                                if (roleStr.includes(' - ')) {
                                  return roleStr.split(' - ')[1].trim();
                                }
                                return roleStr;
                              };
                              
                              // Get unique roles (extracted)
                              const roles = Array.from(new Set(others.map(m => extractRole(m.role))));
                              
                              // Define role order for professional layout
                              const roleOrder = ['Best Man', 'Matron of Honor', 'Candle', 'Veil', 'Cord', 'Bible Bearer', 'Ring Bearer', 'Coin Bearer', 'Flower Girl'];
                              
                              // Check if we have both Best Man and Matron of Honor
                              const hasBestMan = roles.includes('Best Man');
                              const hasMatronOfHonor = roles.includes('Matron of Honor');
                              
                              // Check for bearers
                              const hasBibleBearer = roles.includes('Bible Bearer');
                              const hasRingBearer = roles.includes('Ring Bearer');
                              const hasCoinBearer = roles.includes('Coin Bearer');
                              
                              // Filter out Best Man, Matron of Honor, and Bearers from individual rendering
                              const filteredRoles = roles.filter(r => 
                                r !== 'Best Man' && 
                                r !== 'Matron of Honor' && 
                                r !== 'Bible Bearer' && 
                                r !== 'Ring Bearer' && 
                                r !== 'Coin Bearer'
                              );
                              
                              const sortedRoles = filteredRoles.sort((a, b) => {
                                const indexA = roleOrder.indexOf(a);
                                const indexB = roleOrder.indexOf(b);
                                if (indexA === -1 && indexB === -1) return 0;
                                if (indexA === -1) return 1;
                                if (indexB === -1) return -1;
                                return indexA - indexB;
                              });
                              
                              const elements = [];
                              
                              // 1. Render Best Man and Matron of Honor together in one row if both exist
                              if (hasBestMan || hasMatronOfHonor) {
                                const bestManMember = others.find(m => extractRole(m.role) === 'Best Man');
                                const matronMember = others.find(m => extractRole(m.role) === 'Matron of Honor');
                                
                                elements.push(
                                  <div key="best-man-matron" className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-8">
                                      {/* Best Man */}
                                      {bestManMember && (
                                        <div className="text-center space-y-3">
                                          <h5 className="text-3xl font-script text-gray-700 tracking-wide">
                                            Best Man
                                          </h5>
                                          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                          <div>
                                            <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                              {bestManMember.name}
                                            </p>
                                            {bestManMember.description && (
                                              <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                {bestManMember.description}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Matron of Honor */}
                                      {matronMember && (
                                        <div className="text-center space-y-3">
                                          <h5 className="text-3xl font-script text-gray-700 tracking-wide">
                                            Matron of Honor
                                          </h5>
                                          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                          <div>
                                            <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                              {matronMember.name}
                                            </p>
                                            {matronMember.description && (
                                              <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                {matronMember.description}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                              
                              // 2. Render other roles (Candle, Veil, Cord) - before bearers
                              sortedRoles.forEach((role, roleIndex) => {
                                const membersInRole = others.filter(m => extractRole(m.role) === role);
                                
                                // Improved gender detection
                                const males = membersInRole.filter(m => {
                                  const roleStr = m.role.toLowerCase();
                                  return m.side === 'male' || 
                                         roleStr.includes('groom') || 
                                         roleStr.includes('best man') ||
                                         (roleStr.includes('bearer') && !roleStr.includes('flower'));
                                });
                                
                                const females = membersInRole.filter(m => {
                                  const roleStr = m.role.toLowerCase();
                                  return m.side === 'female' || 
                                         roleStr.includes('bride') || 
                                         roleStr.includes('matron') ||
                                         roleStr.includes('flower girl');
                                });
                                
                                // Skip if no members
                                if (males.length === 0 && females.length === 0) return;
                                
                                // Skip Flower Girls here, they come after bearers
                                if (role === 'Flower Girl') return;
                                
                                // Check if it's all-female role (but not Flower Girls)
                                const isAllFemaleRole = males.length === 0 && females.length > 0;
                                const shouldCenter = isAllFemaleRole;
                                
                                elements.push(
                                  <div key={roleIndex} className="space-y-4">
                                    {/* Role Title */}
                                    <div className="text-center mb-4">
                                      <h5 className="text-3xl font-script text-gray-700 tracking-wide">
                                        {role}
                                      </h5>
                                      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-2"></div>
                                    </div>
                                    
                                    {/* Names Layout */}
                                    {shouldCenter ? (
                                      <div className="flex justify-center">
                                        <div className="space-y-2">
                                          {[...males, ...females].map(member => (
                                            <div key={member.id} className="text-center">
                                              <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                                {member.name}
                                              </p>
                                              {member.description && (
                                                <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                  {member.description}
                                                </p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="grid md:grid-cols-2 gap-8">
                                        {/* Male Side */}
                                        <div className="space-y-2">
                                          {males.map(member => (
                                            <div key={member.id} className="text-center">
                                              <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                                {member.name}
                                              </p>
                                              {member.description && (
                                                <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                  {member.description}
                                                </p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                        
                                        {/* Female Side */}
                                        <div className="space-y-2">
                                          {females.map(member => (
                                            <div key={member.id} className="text-center">
                                              <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                                {member.name}
                                              </p>
                                              {member.description && (
                                                <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                  {member.description}
                                                </p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              });
                              
                              // 3. Render Bearers in triangle layout if any exist
                              if (hasBibleBearer || hasRingBearer || hasCoinBearer) {
                                const bibleBearerMember = others.find(m => extractRole(m.role) === 'Bible Bearer');
                                const ringBearerMember = others.find(m => extractRole(m.role) === 'Ring Bearer');
                                const coinBearerMember = others.find(m => extractRole(m.role) === 'Coin Bearer');
                                
                                elements.push(
                                  <div key="bearers" className="space-y-6">
                                    {/* Ring Bearer - Top center */}
                                    {ringBearerMember && (
                                      <div className="flex justify-center">
                                        <div className="text-center space-y-3">
                                          <h5 className="text-3xl font-script text-gray-700 tracking-wide">
                                            Ring Bearer
                                          </h5>
                                          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                          <div>
                                            <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                              {ringBearerMember.name}
                                            </p>
                                            {ringBearerMember.description && (
                                              <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                {ringBearerMember.description}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Bible Bearer and Coin Bearer - Bottom row */}
                                    {(bibleBearerMember || coinBearerMember) && (
                                      <div className="grid md:grid-cols-2 gap-8">
                                        {/* Bible Bearer - Left */}
                                        {bibleBearerMember && (
                                          <div className="text-center space-y-3">
                                            <h5 className="text-3xl font-script text-gray-700 tracking-wide">
                                              Bible Bearer
                                            </h5>
                                            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                            <div>
                                              <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                                {bibleBearerMember.name}
                                              </p>
                                              {bibleBearerMember.description && (
                                                <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                  {bibleBearerMember.description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Coin Bearer - Right */}
                                        {coinBearerMember && (
                                          <div className="text-center space-y-3">
                                            <h5 className="text-3xl font-script text-gray-700 tracking-wide">
                                              Coin Bearer
                                            </h5>
                                            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                                            <div>
                                              <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                                {coinBearerMember.name}
                                              </p>
                                              {coinBearerMember.description && (
                                                <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                  {coinBearerMember.description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              
                              // 4. Render Flower Girls last (if they exist)
                              const flowerGirlMembers = others.filter(m => extractRole(m.role) === 'Flower Girl');
                              if (flowerGirlMembers.length > 0) {
                                elements.push(
                                  <div key="flower-girls" className="space-y-4">
                                    {/* Role Title */}
                                    <div className="text-center mb-4">
                                      <h5 className="text-3xl font-script text-gray-700 tracking-wide">
                                        Flower Girls
                                      </h5>
                                      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-2"></div>
                                    </div>
                                    
                                    {/* Centered Names */}
                                    <div className="flex justify-center">
                                      <div className="space-y-2">
                                        {flowerGirlMembers.map(member => (
                                          <div key={member.id} className="text-center">
                                            <p className="text-gray-800 font-semibold text-base font-proxima-regular uppercase">
                                              {member.name}
                                            </p>
                                            {member.description && (
                                              <p className="text-gray-600 text-sm italic font-proxima-regular">
                                                {member.description}
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              
                              return elements;
                            })()}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </MotionDiv>
        )}

        {/* Prenup Photos Tab */}
        {activeTab === 'prenup' && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <SkeletonLoader type="image" count={8} />
              </div>
            ) : prenupPhotos.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h4 className="text-4xl md:text-5xl font-script text-[#9E5E40] mb-4">Prenup Photos</h4>
                  <p className="text-[#9E5E40] font-proxima-regular text-lg">
                    Our prenup photoshoot moments
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto">
                  {prenupPhotos.map((photo, index) => (
                    <MotionDiv
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
                      onClick={() => openModal(photo.photoUrl)}
                    >
                      {/* Subtle hover glow */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F5EEE6]/40 via-[#E6D5BE]/40 to-[#F5EEE6]/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />
                      
                      {/* Photo */}
                      <div className="relative w-full h-full">
                        <img
                          src={photo.photoUrl}
                          alt={photo.caption || `Prenup photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {photo.caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="text-white text-sm font-proxima-regular text-center">
                                {photo.caption}
                              </p>
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FaCameraRetro className="text-white text-3xl opacity-80" />
                          </div>
                        </div>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <FaCameraRetro className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-xl font-proxima-regular">No prenup photos available yet</p>
              </div>
            )}
          </MotionDiv>
        )}

        {/* Gifts Tab */}
        {activeTab === 'gifts' && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[900px] mx-auto"
          >
            <div className="bg-white/90 backdrop-blur-sm shadow-xl p-8 md:p-12 rounded-3xl 
              border border-mint-200/50 relative overflow-hidden text-center">

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint-100/20 to-transparent 
                rounded-bl-[100px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blush-100/20 to-transparent 
                rounded-tr-[100px]" />

              <FaGift className="text-[#9E5E40] text-5xl mx-auto mb-6" />
              <h4 className="text-3xl font-bold font-script text-[#9E5E40] mb-6">Gift Information</h4>

              <div className="space-y-6 text-xl text-gray-800 leading-relaxed font-proxima-regular">
                <p className="text-xl font-semibold text-gray-800">
                  Your presence is the greatest gift of all!
                </p>
                <p>
                  However, if you wish to honor us with a gift, monetary contributions are greatly appreciated
                  as we begin our new journey together.
                </p>

                <div className="bg-gradient-to-r from-sage-50 to-mint-50 p-6 rounded-xl 
                  border border-mint-200 shadow-inner">
                  <p className="text-[#9E5E40] font-proxima-regular  text-xl">
                    Your love, laughter, and presence as we exchange vows is all we truly need to make our day perfect.
                  </p>
                </div>
              </div>              {/* Decorative hearts */}
              <div className="flex justify-center gap-4 mt-8">
                {[...Array(3)].map((_, i) => (
                  <FaHeart
                    key={i}
                    className="text-blush-400 text-3xl animate-pulse"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                ))}
              </div>
            </div>
          </MotionDiv>
        )}
      </MotionDiv>
    </section>
  );
}
