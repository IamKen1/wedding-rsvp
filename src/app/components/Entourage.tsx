'use client';

import { useState, useEffect } from 'react';
import { MotionDiv } from '@/types/motion';
import { FaHeart, FaRing, FaUserTie, FaUserFriends } from 'react-icons/fa';
import SkeletonLoader from './SkeletonLoader';

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

export default function Entourage() {
  const [entourageData, setEntourageData] = useState<EntourageMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const fetchEntourageData = async () => {
      try {
        setError(null);
        const response = await fetch('/api/admin/entourage', {
          // Add cache control for better performance
          next: { revalidate: 60 }
        });
        if (response.ok) {
          const data = await response.json();
          data.sort((a: EntourageMember, b: EntourageMember) => a.sortOrder - b.sortOrder);
          setEntourageData(data);
        } else {
          setError('Failed to load entourage information');
        }
      } catch (err) {
        console.error('Error fetching entourage data:', err);
        setError('Failed to load entourage information');
      } finally {
        setLoading(false);
      }
    };

    fetchEntourageData();
  }, []);

  // Group entourage members by category
  const parents = entourageData.filter(member => member.category === 'parents');
  const brideParents = parents.filter(member => member.side === 'bride');
  const groomParents = parents.filter(member => member.side === 'groom');
  
  const sponsors = entourageData.filter(member => member.category === 'sponsors');
  const maleSponsors = sponsors.filter(member => member.side === 'male');
  const femaleSponsors = sponsors.filter(member => member.side === 'female');
  
  const otherMembers = entourageData.filter(member => member.category === 'other');

  const getIconComponent = (side: 'bride' | 'groom' | 'male' | 'female' | 'both') => {
    switch(side) {
      case 'bride':
        return <FaHeart className="text-2xl text-white" />;
      case 'groom':
      case 'male':
        return <FaUserTie className="text-2xl text-white" />;
      case 'female':
        return <FaHeart className="text-2xl text-white" />;
      default:
        return <FaUserFriends className="text-2xl text-white" />;
    }
  };

  const getColorScheme = (side: 'bride' | 'groom' | 'male' | 'female' | 'both') => {
    switch(side) {
      case 'bride':
      case 'female':
        return {
          border: 'border-rose-100',
          gradient: 'from-rose-400 to-pink-500',
          text: 'text-rose-600'
        };
      case 'groom':
      case 'male':
        return {
          border: 'border-purple-100',
          gradient: 'from-purple-400 to-indigo-500',
          text: 'text-purple-600'
        };
      default:
        return {
          border: 'border-blue-100',
          gradient: 'from-blue-400 to-cyan-500',
          text: 'text-blue-600'
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/20 via-transparent to-purple-100/20" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-display text-rose-700 mb-4 font-light tracking-wide">
            Our Wedding Party
          </h3>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-sans">
            We are blessed to have these wonderful people standing with us on our special day.
            Each one holds a special place in our hearts and our journey together.
          </p>
        </MotionDiv>

        {/* Loading / Error / Data */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader type="card" count={6} />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <FaHeart className="text-red-500 text-4xl mx-auto mb-4" />
            <p className="text-red-600 text-lg mb-2 font-sans">Error loading entourage</p>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : entourageData.length === 0 ? (
          <div className="text-center py-16">
            <FaHeart className="text-gray-400 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-sans">No entourage members added yet</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Parents Section - Separated by Bride/Groom */}
            {(brideParents.length > 0 || groomParents.length > 0) && (
              <div className="space-y-12">
                <h3 className="text-3xl font-serif text-forest-700 text-center mb-8 font-semibold tracking-wide">
                  Parents
                </h3>
                
                {/* Bride's Parents */}
                {brideParents.length > 0 && (
                  <div>
                    <h4 className="text-xl font-serif text-rose-600 text-center mb-6 font-medium">
                      Bride's Parents
                    </h4>
                    <MotionDiv
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
                    >
                      {brideParents.map(member => {
                        const colors = getColorScheme(member.side);
                        return (
                          <MotionDiv
                            key={member.id}
                            variants={cardVariants}
                            onMouseEnter={() => setActiveCard(member.id)}
                            onMouseLeave={() => setActiveCard(null)}
                            className="group cursor-pointer h-full"
                          >
                            <div
                              className={`relative p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg 
                                hover:shadow-xl transition-all duration-300 border ${colors.border} h-full
                                ${activeCard === member.id ? 'scale-105 -translate-y-2' : 'hover:scale-102'}`}
                            >
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.gradient} 
                                  shadow-lg flex items-center justify-center transform group-hover:scale-110 
                                  transition-transform duration-300`}>
                                  {getIconComponent(member.side)}
                                </div>
                              </div>
                              <div className="pt-8 text-center relative z-10">
                                <h5 className="text-2xl font-semibold text-gray-800 mb-2 font-serif">{member.name}</h5>
                                <p className={`text-sm ${colors.text} font-medium mb-3 tracking-wide uppercase`}>{member.role}</p>
                                {member.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                                )}
                              </div>
                            </div>
                          </MotionDiv>
                        );
                      })}
                    </MotionDiv>
                  </div>
                )}

                {/* Groom's Parents */}
                {groomParents.length > 0 && (
                  <div>
                    <h4 className="text-xl font-serif text-purple-600 text-center mb-6 font-medium">
                      Groom's Parents
                    </h4>
                    <MotionDiv
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
                    >
                      {groomParents.map(member => {
                        const colors = getColorScheme(member.side);
                        return (
                          <MotionDiv
                            key={member.id}
                            variants={cardVariants}
                            onMouseEnter={() => setActiveCard(member.id)}
                            onMouseLeave={() => setActiveCard(null)}
                            className="group cursor-pointer h-full"
                          >
                            <div
                              className={`relative p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg 
                                hover:shadow-xl transition-all duration-300 border ${colors.border} h-full
                                ${activeCard === member.id ? 'scale-105 -translate-y-2' : 'hover:scale-102'}`}
                            >
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.gradient} 
                                  shadow-lg flex items-center justify-center transform group-hover:scale-110 
                                  transition-transform duration-300`}>
                                  {getIconComponent(member.side)}
                                </div>
                              </div>
                              <div className="pt-8 text-center relative z-10">
                                <h5 className="text-2xl font-semibold text-gray-800 mb-2 font-serif">{member.name}</h5>
                                <p className={`text-sm ${colors.text} font-medium mb-3 tracking-wide uppercase`}>{member.role}</p>
                                {member.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                                )}
                              </div>
                            </div>
                          </MotionDiv>
                        );
                      })}
                    </MotionDiv>
                  </div>
                )}
              </div>
            )}

            {/* Sponsors Section - Separated by Male/Female */}
            {(maleSponsors.length > 0 || femaleSponsors.length > 0) && (
              <div className="space-y-12">
                <h3 className="text-3xl font-serif text-forest-700 text-center mb-8 font-semibold tracking-wide">
                  Principal Sponsors
                </h3>
                
                {/* Male Sponsors */}
                {maleSponsors.length > 0 && (
                  <div>
                    <h4 className="text-xl font-serif text-purple-600 text-center mb-6 font-medium">
                      Male Sponsors
                    </h4>
                    <MotionDiv
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {maleSponsors.map(member => {
                        const colors = getColorScheme(member.side);
                        return (
                          <MotionDiv
                            key={member.id}
                            variants={cardVariants}
                            onMouseEnter={() => setActiveCard(member.id)}
                            onMouseLeave={() => setActiveCard(null)}
                            className="group cursor-pointer h-full"
                          >
                            <div
                              className={`relative p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg 
                                hover:shadow-xl transition-all duration-300 border ${colors.border} h-full
                                ${activeCard === member.id ? 'scale-105 -translate-y-2' : 'hover:scale-102'}`}
                            >
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.gradient} 
                                  shadow-lg flex items-center justify-center transform group-hover:scale-110 
                                  transition-transform duration-300`}>
                                  {getIconComponent(member.side)}
                                </div>
                              </div>
                              <div className="pt-8 text-center relative z-10">
                                <h5 className="text-2xl font-semibold text-gray-800 mb-2 font-serif">{member.name}</h5>
                                <p className={`text-sm ${colors.text} font-medium mb-3 tracking-wide uppercase`}>{member.role}</p>
                                {member.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                                )}
                              </div>
                            </div>
                          </MotionDiv>
                        );
                      })}
                    </MotionDiv>
                  </div>
                )}

                {/* Female Sponsors */}
                {femaleSponsors.length > 0 && (
                  <div>
                    <h4 className="text-xl font-serif text-rose-600 text-center mb-6 font-medium">
                      Female Sponsors
                    </h4>
                    <MotionDiv
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {femaleSponsors.map(member => {
                        const colors = getColorScheme(member.side);
                        return (
                          <MotionDiv
                            key={member.id}
                            variants={cardVariants}
                            onMouseEnter={() => setActiveCard(member.id)}
                            onMouseLeave={() => setActiveCard(null)}
                            className="group cursor-pointer h-full"
                          >
                            <div
                              className={`relative p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg 
                                hover:shadow-xl transition-all duration-300 border ${colors.border} h-full
                                ${activeCard === member.id ? 'scale-105 -translate-y-2' : 'hover:scale-102'}`}
                            >
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.gradient} 
                                  shadow-lg flex items-center justify-center transform group-hover:scale-110 
                                  transition-transform duration-300`}>
                                  {getIconComponent(member.side)}
                                </div>
                              </div>
                              <div className="pt-8 text-center relative z-10">
                                <h5 className="text-2xl font-semibold text-gray-800 mb-2 font-serif">{member.name}</h5>
                                <p className={`text-sm ${colors.text} font-medium mb-3 tracking-wide uppercase`}>{member.role}</p>
                                {member.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                                )}
                              </div>
                            </div>
                          </MotionDiv>
                        );
                      })}
                    </MotionDiv>
                  </div>
                )}
              </div>
            )}

            {/* Rest of Entourage - No Separation */}
            {otherMembers.length > 0 && (
              <div>
                <h3 className="text-3xl font-serif text-forest-700 text-center mb-8 font-semibold tracking-wide">
                  Wedding Entourage
                </h3>
                <MotionDiv
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {otherMembers.map(member => {
                    const colors = getColorScheme(member.side);
                    return (
                      <MotionDiv
                        key={member.id}
                        variants={cardVariants}
                        onMouseEnter={() => setActiveCard(member.id)}
                        onMouseLeave={() => setActiveCard(null)}
                        className="group cursor-pointer h-full"
                      >
                        <div
                          className={`relative p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg 
                            hover:shadow-xl transition-all duration-300 border ${colors.border} h-full
                            ${activeCard === member.id ? 'scale-105 -translate-y-2' : 'hover:scale-102'}`}
                        >
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.gradient} 
                              shadow-lg flex items-center justify-center transform group-hover:scale-110 
                              transition-transform duration-300`}>
                              {getIconComponent(member.side)}
                            </div>
                          </div>
                          <div className="pt-8 text-center relative z-10">
                            <h5 className="text-2xl font-semibold text-gray-800 mb-2 font-serif">{member.name}</h5>
                            <p className={`text-sm ${colors.text} font-medium mb-3 tracking-wide uppercase`}>{member.role}</p>
                            {member.description && (
                              <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                            )}
                          </div>
                        </div>
                      </MotionDiv>
                    );
                  })}
                </MotionDiv>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
