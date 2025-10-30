"use client";

import { MotionDiv } from '@/types/motion';
import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';
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

export default function Schedule() {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'attire' | 'entourage' | 'gifts'>('schedule');
  const [scheduleEvents, setScheduleEvents] = useState<WeddingEvent[]>([]);
  const [attireGuidelines, setAttireGuidelines] = useState<WeddingAttire[]>([]);
  const [entourageData, setEntourageData] = useState<EntourageMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

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
        const [eventsResponse, attireResponse, entourageResponse] = await Promise.all([
          fetch('/api/admin/schedule', { next: { revalidate: 60 } }),
          fetch('/api/admin/attire', { next: { revalidate: 60 } }),
          fetch('/api/admin/entourage', { next: { revalidate: 60 } })
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
            <h3 className="text-4xl md:text-5xl font-script text-forest-700 mb-4 font-light tracking-wide">
            Our Special Day
            </h3>
          <p className="text-base text-forest-700 max-w-2xl mx-auto mb-6 font-proxima-regular">
            Join us for a celebration of love, joy, and new beginnings
          </p>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'schedule' as const, label: 'Schedule', icon: FaCalendarAlt },
              { id: 'attire' as const, label: 'Attire', icon: FaTshirt },
              { id: 'entourage' as const, label: 'Entourage', icon: FaHeart },
              { id: 'gifts' as const, label: 'Gifts', icon: FaGift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 cursor-pointer font-proxima-regular text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'bg-mint-500 text-white shadow-lg transform scale-105'
                    : 'bg-white/80 text-forest-700 hover:bg-mint-100 hover:shadow-md'
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
              <p className="text-red-600 text-lg mb-2 font-proxima-regular font-semibold">Error loading schedule</p>
              <p className="text-forest-600 font-proxima-regular">{error}</p>
              </div>
            ) : scheduleEvents.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-8 mb-16">
              {scheduleEvents.map((event, index) => {
              const IconComponent = getIconComponent(event.icon);
              const gradientClass = getGradientClass(event.color);
              return (
              <div
              key={event.id}
              className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 w-full max-w-sm md:w-auto md:flex-shrink-0"
              onMouseEnter={() => setHoveredEvent(index)}
              onMouseLeave={() => setHoveredEvent(null)}
              >
              <div className={`relative p-8 rounded-3xl bg-white/90 backdrop-blur-sm 
              shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50
              ${hoveredEvent === index ? 'scale-105 -translate-y-2' : ''}`}
              >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} 
                opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
              
              {/* Time badge */}
              <div className="absolute -top-4 left-8">
                <div className={`bg-gradient-to-r ${gradientClass} text-white px-4 py-2 
                rounded-full text-sm font-bold shadow-lg flex items-center gap-2`}>
                <FaClock className="text-xs" />
                {formatTime(event.eventTime)}
                </div>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6 mt-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradientClass} 
                flex items-center justify-center shadow-lg group-hover:scale-110 
                transition-transform duration-300`}>
                <IconComponent className="text-white text-2xl" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h4 className="text-xl font-bold font-proxima-regular text-forest-700 mb-2">
                {event.eventName}
                </h4>
                <p className="text-forest-500 mb-3 text-sm leading-relaxed font-proxima-regular">
                {event.description || 'Wedding celebration event'}
                </p>
                {event.location && (
                <div className="flex items-center justify-center gap-2 text-mint-600">
                <FaMapMarkerAlt className="text-xs" />
                <span className="text-sm font-medium font-proxima-regular">{event.location}</span>
                </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-8 h-8 opacity-20 group-hover:opacity-40 
                transition-opacity duration-300">
                <FaHeart className="text-blush-400 animate-pulse" />
              </div>
              </div>
              </div>
              );
            })}
              </div>
            ) : (
              <div className="text-center py-16">
              <FaCalendarAlt className="text-forest-400 text-4xl mx-auto mb-4" />
              <p className="text-forest-600 text-lg font-proxima-regular">No events scheduled at this time.</p>
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
               
                <h4 className="text-3xl font-bold font-script text-forest-700 mb-4">Dress Code</h4>
                {/* <p className="text-lg text-forest-600 font-medium">Formal / Semi-formal Attire</p> */}
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
                          onClick={() => setFullScreenImage(photo)}
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
                <p className="text-red-600 text-lg mb-2 font-proxima-regular">Error loading entourage</p>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : entourageData.length === 0 ? (
              <div className="text-center py-16">
                <FaHeart className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-proxima-regular">No entourage members added yet</p>
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
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-200/50">
                          <h4 className="text-2xl font-bold font-script text-center text-rose-700 mb-6">Parents</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            {brideParents.length > 0 && (
                              <div>
                                <h5 className="text-lg font-semibold text-rose-600 text-center mb-4 font-script">Bride&apos;s Parents</h5>
                                <div className="space-y-4">
                                  {brideParents.map(member => (
                                    <div key={member.id} className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-200 shadow-sm hover:shadow-md transition-all">
                                      <h6 className="font-bold text-forest-700 text-center font-proxima-regular">{member.name}</h6>
                                      <p className="text-sm text-rose-600 text-center font-medium font-proxima-regular">{member.role}</p>
                                      {member.description && <p className="text-xs text-gray-600 mt-2 text-center font-proxima-regular">{member.description}</p>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {groomParents.length > 0 && (
                              <div>
                                <h5 className="text-lg font-semibold text-purple-600 text-center mb-4 font-script">Groom&apos;s Parents</h5>
                                <div className="space-y-4">
                                  {groomParents.map(member => (
                                    <div key={member.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all">
                                      <h6 className="font-bold text-forest-700 text-center font-proxima-regular">{member.name}</h6>
                                      <p className="text-sm text-purple-600 text-center font-medium font-proxima-regular">{member.role}</p>
                                      {member.description && <p className="text-xs text-gray-600 mt-2 text-center font-proxima-regular">{member.description}</p>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Sponsors Section */}
                      {sponsors.length > 0 && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-mint-200/50">
                          <h4 className="text-2xl font-bold font-script text-center text-mint-700 mb-6">Principal Sponsors</h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sponsors.map(member => {
                              const isNinong = member.side === 'male';
                              return (
                                <div 
                                  key={member.id} 
                                  className={`bg-gradient-to-br ${isNinong ? 'from-blue-50 to-cyan-50 border-blue-200' : 'from-pink-50 to-rose-50 border-pink-200'} p-4 rounded-xl border shadow-sm hover:shadow-md transition-all`}
                                >
                                  <h6 className="font-bold text-forest-700 text-center font-proxima-regular">{member.name}</h6>
                                  <p className={`text-sm ${isNinong ? 'text-blue-600' : 'text-pink-600'} text-center font-medium font-proxima-regular`}>
                                    {member.role}
                                  </p>
                                  {member.description && <p className="text-xs text-gray-600 mt-2 text-center font-proxima-regular">{member.description}</p>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Other Members Section */}
                      {others.length > 0 && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sage-200/50">
                          <h4 className="text-2xl font-bold font-script text-center text-sage-700 mb-6">Wedding Party</h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {others.map(member => (
                              <div key={member.id} className="bg-gradient-to-br from-sage-50 to-mint-50 p-4 rounded-xl border border-sage-200 shadow-sm hover:shadow-md transition-all">
                                <h6 className="font-bold text-forest-700 text-center font-proxima-regular">{member.name}</h6>
                                <p className="text-sm text-sage-600 text-center font-medium font-proxima-regular">{member.role}</p>
                                {member.description && <p className="text-xs text-gray-600 mt-2 text-center font-proxima-regular">{member.description}</p>}
                              </div>
                            ))}
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

              <FaGift className="text-mint-500 text-5xl mx-auto mb-6" />
              <h4 className="text-3xl font-bold font-proxima-regular text-forest-700 mb-6">Gift Information</h4>
              
                <div className="space-y-6 text-lg text-forest-600 leading-relaxed font-proxima-regular">
                <p className="text-xl font-semibold text-forest-700">
                  Your presence is the greatest gift of all! 
                </p>
                <p>
                  However, if you wish to honor us with a gift, monetary contributions are greatly appreciated 
                  as we begin our new journey together.
                </p>
                
                <div className="bg-gradient-to-r from-sage-50 to-mint-50 p-6 rounded-xl 
                  border border-mint-200 shadow-inner">
                  <p className="text-forest-600 font-medium">
                    Your love, laughter, and presence as we exchange vows is all we truly need to make our day perfect.
                  </p>
                </div>
              </div>              {/* Decorative hearts */}
              <div className="flex justify-center gap-4 mt-8">
                {[...Array(3)].map((_, i) => (
                  <FaHeart 
                    key={i} 
                    className="text-blush-400 text-lg animate-pulse" 
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                ))}
              </div>
            </div>
          </MotionDiv>
        )}
      </MotionDiv>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 pt-20 cursor-pointer"
          onClick={() => setFullScreenImage(null)}
        >
          <button
            className="absolute top-20 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
            onClick={() => setFullScreenImage(null)}
          >
            ×
          </button>
          <img
            src={fullScreenImage}
            alt="Full size attire"
            className="max-w-[90%] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
  