"use client";

import { useState } from 'react';
import { 
  FaChurch, 
  FaGlassCheers, 
  FaUtensils, 
  FaHeart, 
  FaMusic, 
  FaCameraRetro,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaRing,
  FaGift,
  FaSeedling,
  FaCar,
  FaHome,
  FaWineGlass,
  FaBirthdayCake,
  FaUsers,
  FaDove,
  FaSun,
  FaMoon,
  FaStar,
  FaLeaf,
  FaTree,
  FaUmbrella,
  FaCloudSun,
  FaFire,
  FaHeart as FaHandHeart,
  FaPrayingHands,
  FaGem,
  FaTimes,
  FaSearch
} from 'react-icons/fa';

interface IconOption {
  name: string;
  component: React.ComponentType<any>;
  category: string;
  emoji: string;
  description: string;
}

interface IconPickerProps {
  selectedIcon?: string;
  onSelect: (iconName: string, emoji: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const iconOptions: IconOption[] = [
  // Ceremony Icons
  { name: 'FaChurch', component: FaChurch, category: 'ceremony', emoji: '⛪', description: 'Church/Chapel' },
  { name: 'FaPrayingHands', component: FaPrayingHands, category: 'ceremony', emoji: '🙏', description: 'Prayer/Blessing' },
  { name: 'FaDove', component: FaDove, category: 'ceremony', emoji: '🕊️', description: 'Peace/Dove' },
  { name: 'FaRing', component: FaRing, category: 'ceremony', emoji: '💍', description: 'Wedding Rings' },
  { name: 'FaHeart', component: FaHeart, category: 'ceremony', emoji: '❤️', description: 'Love/Heart' },
  { name: 'FaHandHeart', component: FaHandHeart, category: 'ceremony', emoji: '💖', description: 'Caring Heart' },

  // Reception Icons
  { name: 'FaGlassCheers', component: FaGlassCheers, category: 'reception', emoji: '🥂', description: 'Toast/Cheers' },
  { name: 'FaUtensils', component: FaUtensils, category: 'reception', emoji: '🍽️', description: 'Dining' },
  { name: 'FaWineGlass', component: FaWineGlass, category: 'reception', emoji: '🍷', description: 'Wine/Drinks' },
  { name: 'FaBirthdayCake', component: FaBirthdayCake, category: 'reception', emoji: '🎂', description: 'Wedding Cake' },
  { name: 'FaMusic', component: FaMusic, category: 'reception', emoji: '🎵', description: 'Music/Dancing' },
  { name: 'FaUsers', component: FaUsers, category: 'reception', emoji: '👥', description: 'Guests/People' },

  // Schedule & Time
  { name: 'FaCalendarAlt', component: FaCalendarAlt, category: 'schedule', emoji: '📅', description: 'Calendar/Date' },
  { name: 'FaClock', component: FaClock, category: 'schedule', emoji: '🕐', description: 'Time/Clock' },
  { name: 'FaSun', component: FaSun, category: 'schedule', emoji: '☀️', description: 'Daytime/Morning' },
  { name: 'FaMoon', component: FaMoon, category: 'schedule', emoji: '🌙', description: 'Evening/Night' },

  // Location & Travel
  { name: 'FaMapMarkerAlt', component: FaMapMarkerAlt, category: 'location', emoji: '📍', description: 'Location/Venue' },
  { name: 'FaCar', component: FaCar, category: 'location', emoji: '🚗', description: 'Transportation' },
  { name: 'FaHome', component: FaHome, category: 'location', emoji: '🏠', description: 'Home/Venue' },

  // Special Events
  { name: 'FaCameraRetro', component: FaCameraRetro, category: 'events', emoji: '📷', description: 'Photography' },
  { name: 'FaGift', component: FaGift, category: 'events', emoji: '🎁', description: 'Gifts/Registry' },
  { name: 'FaSeedling', component: FaSeedling, category: 'events', emoji: '🌼', description: 'Flowers/Bouquet' },
  { name: 'FaGem', component: FaGem, category: 'events', emoji: '💎', description: 'Jewelry/Precious' },

  // Nature & Weather
  { name: 'FaLeaf', component: FaLeaf, category: 'nature', emoji: '🌿', description: 'Nature/Garden' },
  { name: 'FaTree', component: FaTree, category: 'nature', emoji: '🌳', description: 'Outdoor/Trees' },
  { name: 'FaStar', component: FaStar, category: 'nature', emoji: '⭐', description: 'Stars/Special' },
  { name: 'FaUmbrella', component: FaUmbrella, category: 'nature', emoji: '☂️', description: 'Weather/Protection' },
  { name: 'FaCloudSun', component: FaCloudSun, category: 'nature', emoji: '⛅', description: 'Partly Cloudy' },
  { name: 'FaFire', component: FaFire, category: 'nature', emoji: '🔥', description: 'Warmth/Passion' }
];

const categories = [
  { id: 'all', name: 'All Icons', color: 'bg-gray-100 text-gray-700' },
  { id: 'ceremony', name: 'Ceremony', color: 'bg-purple-100 text-purple-700' },
  { id: 'reception', name: 'Reception', color: 'bg-pink-100 text-pink-700' },
  { id: 'schedule', name: 'Schedule', color: 'bg-blue-100 text-blue-700' },
  { id: 'location', name: 'Location', color: 'bg-green-100 text-green-700' },
  { id: 'events', name: 'Events', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'nature', name: 'Nature', color: 'bg-emerald-100 text-emerald-700' }
];

export default function IconPicker({ selectedIcon, onSelect, onClose, isOpen }: IconPickerProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredIcons = iconOptions.filter(icon => {
    const matchesCategory = activeCategory === 'all' || icon.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.emoji.includes(searchTerm);
    
    return matchesCategory && matchesSearch;
  });

  const handleIconSelect = (icon: IconOption) => {
    onSelect(icon.name, icon.emoji);
    // Add a brief success indication before closing
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 relative overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-mint-500 to-sage-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Choose an Icon</h3>
                <p className="text-mint-100 mt-1">Select the perfect icon for your wedding detail</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="mt-4 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mint-200" />
              <input
                type="text"
                placeholder="Search icons by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-0 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? category.color + ' shadow-md transform scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Icons Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {filteredIcons.map((icon) => {
                const IconComponent = icon.component;
                const isSelected = selectedIcon === icon.name;
                
                return (
                  <div
                    key={icon.name}
                    onClick={() => handleIconSelect(icon)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-mint-100 border-2 border-mint-500 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md hover:scale-105 border-2 border-transparent'
                    }`}
                    title={icon.description}
                  >
                    {/* Icon */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`text-2xl transition-colors ${
                        isSelected 
                          ? 'text-mint-600' 
                          : 'text-gray-600 group-hover:text-mint-600'
                      }`}>
                        <IconComponent />
                      </div>
                      
                      {/* Emoji Badge */}
                      <div className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                        {icon.emoji}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-mint-500 rounded-full flex items-center justify-center">
                        <FaHeart className="text-white text-xs" />
                      </div>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                        {icon.description}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">No icons found</h4>
                <p className="text-gray-500">Try adjusting your search or selecting a different category</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''} available
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}