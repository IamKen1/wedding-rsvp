"use client";

import { useState, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaUsers, FaTshirt, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaClock, FaUpload } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';
import SuccessNotification from './SuccessNotification';
import WeddingDetailFormModal from './WeddingDetailFormModal';
import EntourageExcelUpload from './EntourageExcelUpload';
import SkeletonLoader from './SkeletonLoader';

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

interface WeddingEntourage {
  id: number;
  name: string;
  role: string;
  side: 'bride' | 'groom' | 'male' | 'female' | 'both';
  category: 'parents' | 'sponsors' | 'other';
  description: string;
  imageUrl: string;
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

interface WeddingAttire {
  id: number;
  category: string;
  title: string;
  description: string;
  colorScheme: string;
  dressCode: string;
  guidelines: string;
  sortOrder: number;
}

interface WeddingLocation {
  id: number;
  name: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  directions: string;
  specialInstructions: string;
  mapUrl: string;
  sortOrder: number;
}

type DetailCategory = 'schedule' | 'entourage' | 'attire' | 'locations';

export default function WeddingDetailsManager() {
  const [activeCategory, setActiveCategory] = useState<DetailCategory>('schedule');
  const [loading, setLoading] = useState<Record<DetailCategory, boolean>>({
    schedule: true,
    entourage: true,
    attire: true,
    locations: true
  });
  
  // Data states
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [entourage, setEntourage] = useState<WeddingEntourage[]>([]);
  const [attire, setAttire] = useState<WeddingAttire[]>([]);
  const [locations, setLocations] = useState<WeddingLocation[]>([]);
  
  // Cache states to avoid re-fetching
  const [dataLoaded, setDataLoaded] = useState<Record<DetailCategory, boolean>>({
    schedule: false,
    entourage: false,
    attire: false,
    locations: false
  });
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  
  // Notification state
  const [notification, setNotification] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Load all data in parallel on mount
  useEffect(() => {
    loadAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load specific category data when switching tabs (only if not already loaded)
  useEffect(() => {
    if (!dataLoaded[activeCategory]) {
      loadCategoryData(activeCategory);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const loadAllData = async () => {
    // Load all categories in parallel for better performance
    const promises = [
      loadCategoryData('schedule'),
      loadCategoryData('entourage'),
      loadCategoryData('attire'),
      loadCategoryData('locations')
    ];
    
    await Promise.all(promises);
  };

  const loadCategoryData = useCallback(async (category: DetailCategory) => {
    setLoading(prev => ({ ...prev, [category]: true }));
    try {
      const endpoint = `/api/admin/${category}`;
      const response = await fetch(endpoint, { 
        cache: 'no-store',
        next: { revalidate: 60 } 
      });
      
      if (response.ok) {
        const data = await response.json();
        
        switch (category) {
          case 'schedule':
            setEvents(data);
            break;
          case 'entourage':
            setEntourage(data);
            break;
          case 'attire':
            setAttire(data);
            break;
          case 'locations':
            setLocations(data);
            break;
        }
        
        setDataLoaded(prev => ({ ...prev, [category]: true }));
      }
    } catch (error) {
      console.error(`Error loading ${category}:`, error);
      setNotification({
        isVisible: true,
        message: `Failed to load ${category} data`,
        type: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  }, []);

  const refreshCurrentCategory = () => {
    setDataLoaded(prev => ({ ...prev, [activeCategory]: false }));
    loadCategoryData(activeCategory);
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setShowAddModal(true);
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item: any) => {
    setCurrentItem(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!currentItem) return;
    
    // Optimistic update - remove from UI immediately
    const updateState = (category: DetailCategory, id: number) => {
      switch (category) {
        case 'schedule':
          setEvents(prev => prev.filter(item => item.id !== id));
          break;
        case 'entourage':
          setEntourage(prev => prev.filter(item => item.id !== id));
          break;
        case 'attire':
          setAttire(prev => prev.filter(item => item.id !== id));
          break;
        case 'locations':
          setLocations(prev => prev.filter(item => item.id !== id));
          break;
      }
    };
    
    updateState(activeCategory, currentItem.id);
    setShowDeleteConfirm(false);
    setCurrentItem(null);
    
    try {
      const response = await fetch(`/api/admin/${activeCategory}?id=${currentItem.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setNotification({
          isVisible: true,
          message: `${activeCategory} item deleted successfully`,
          type: 'success'
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (deleteError) {
      console.error('Delete error:', deleteError);
      setNotification({
        isVisible: true,
        message: `Failed to delete ${activeCategory} item`,
        type: 'error'
      });
      // Reload data on error
      refreshCurrentCategory();
    }
  };

  const categories = [
    { key: 'schedule', label: 'Schedule', icon: FaCalendarAlt, color: 'mint' },
    { key: 'entourage', label: 'Entourage', icon: FaUsers, color: 'blush' },
    { key: 'attire', label: 'Attire', icon: FaTshirt, color: 'sage' },
    { key: 'locations', label: 'Locations', icon: FaMapMarkerAlt, color: 'forest' }
  ];

  const renderScheduleData = () => (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow p-4 border border-mint-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FaClock className="text-mint-500" />
                <h3 className="text-lg font-semibold font-sans text-forest-700">{event.eventName}</h3>
                <span className="text-sm text-gray-500">{formatTime(event.eventTime)}</span>
              </div>
              <p className="text-gray-600 mb-2">📍 {event.location}</p>
              <p className="text-sm text-gray-500">{event.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(event)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEntourageData = () => {
    // Group by category
    const parents = entourage.filter(m => m.category === 'parents');
    const brideParents = parents.filter(m => m.side === 'bride');
    const groomParents = parents.filter(m => m.side === 'groom');
    
    const sponsors = entourage.filter(m => m.category === 'sponsors');
    const maleSponsors = sponsors.filter(m => m.side === 'male');
    const femaleSponsors = sponsors.filter(m => m.side === 'female');
    
    const otherMembers = entourage.filter(m => m.category === 'other');

    const renderMemberCard = (member: WeddingEntourage, bgColor: string, borderColor: string, textColor: string) => (
      <div key={member.id} className={`${bgColor} rounded-lg p-4 border ${borderColor}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold font-sans text-forest-700">{member.name}</h4>
              <span className={`text-xs px-2 py-0.5 rounded ${bgColor} ${textColor} font-medium`}>
                {member.category === 'parents' ? 'Parent' : member.category === 'sponsors' ? 'Sponsor' : 'Entourage'}
              </span>
            </div>
            <p className={`text-sm ${textColor} font-medium`}>{member.role}</p>
            {member.description && <p className="text-sm text-gray-600 mt-1">{member.description}</p>}
            <p className="text-xs text-gray-400 mt-1">Order: {member.sortOrder}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(member)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(member)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-8">
        {/* Parents Section */}
        {(brideParents.length > 0 || groomParents.length > 0) && (
          <div>
            <h2 className="text-2xl font-serif text-forest-700 mb-4 flex items-center gap-2">
              👨‍👩‍👧‍👦 Parents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold font-sans text-rose-600 mb-3">Bride's Parents</h3>
                <div className="space-y-3">
                  {brideParents.length > 0 ? (
                    brideParents.map((member) => renderMemberCard(member, 'bg-rose-50', 'border-rose-200', 'text-rose-600'))
                  ) : (
                    <p className="text-gray-400 text-sm italic">No bride's parents added yet</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-sans text-purple-600 mb-3">Groom's Parents</h3>
                <div className="space-y-3">
                  {groomParents.length > 0 ? (
                    groomParents.map((member) => renderMemberCard(member, 'bg-purple-50', 'border-purple-200', 'text-purple-600'))
                  ) : (
                    <p className="text-gray-400 text-sm italic">No groom's parents added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sponsors Section */}
        {(maleSponsors.length > 0 || femaleSponsors.length > 0) && (
          <div>
            <h2 className="text-2xl font-serif text-forest-700 mb-4 flex items-center gap-2">
              🎩👗 Principal Sponsors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold font-sans text-purple-600 mb-3">Male Sponsors</h3>
                <div className="space-y-3">
                  {maleSponsors.length > 0 ? (
                    maleSponsors.map((member) => renderMemberCard(member, 'bg-purple-50', 'border-purple-200', 'text-purple-600'))
                  ) : (
                    <p className="text-gray-400 text-sm italic">No male sponsors added yet</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-sans text-rose-600 mb-3">Female Sponsors</h3>
                <div className="space-y-3">
                  {femaleSponsors.length > 0 ? (
                    femaleSponsors.map((member) => renderMemberCard(member, 'bg-rose-50', 'border-rose-200', 'text-rose-600'))
                  ) : (
                    <p className="text-gray-400 text-sm italic">No female sponsors added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Entourage - No Separation */}
        {otherMembers.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-forest-700 mb-4 flex items-center gap-2">
              💍 Wedding Entourage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherMembers.map((member) => renderMemberCard(member, 'bg-blue-50', 'border-blue-200', 'text-blue-600'))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {entourage.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No entourage members added yet</p>
            <p className="text-gray-500 text-sm mt-2">Click "Add New" to add your first member</p>
          </div>
        )}
      </div>
    );
  };

  const renderAttireData = () => (
    <div className="space-y-4">
      {attire.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-4 border border-sage-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.colorScheme }}></div>
                <h3 className="text-lg font-semibold font-sans text-forest-700">{item.title}</h3>
                <span className="text-sm bg-sage-100 text-sage-700 px-2 py-1 rounded">{item.category}</span>
              </div>
              <p className="text-gray-600 mb-2">Dress Code: {item.dressCode}</p>
              <p className="text-sm text-gray-500 mb-2">{item.description}</p>
              <p className="text-xs text-gray-400">{item.guidelines}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLocationsData = () => (
    <div className="space-y-4">
      {locations.map((location) => (
        <div key={location.id} className="bg-white rounded-lg shadow p-4 border border-forest-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FaMapMarkerAlt className="text-forest-500" />
                <h3 className="text-lg font-semibold font-sans text-forest-700">{location.name}</h3>
              </div>
              <p className="text-gray-600 mb-2">📍 {location.address}</p>
              {location.contactPhone && (
                <p className="text-sm text-gray-500 mb-1">📞 {location.contactPhone}</p>
              )}
              {location.contactEmail && (
                <p className="text-sm text-gray-500 mb-1">✉️ {location.contactEmail}</p>
              )}
              {location.directions && (
                <p className="text-sm text-gray-500 mb-2">🧭 {location.directions}</p>
              )}
              {location.specialInstructions && (
                <p className="text-xs text-gray-400">ℹ️ {location.specialInstructions}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(location)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(location)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderData = () => {
    // Show skeleton loader if current category is loading
    if (loading[activeCategory]) {
      return (
        <div className="space-y-4">
          <SkeletonLoader type="card" count={3} />
        </div>
      );
    }

    switch (activeCategory) {
      case 'schedule':
        return renderScheduleData();
      case 'entourage':
        return renderEntourageData();
      case 'attire':
        return renderAttireData();
      case 'locations':
        return renderLocationsData();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-serif text-forest-700">Wedding Details Management</h2>
        <div className="flex gap-2">
          {activeCategory === 'entourage' && (
            <button
              onClick={() => setShowExcelUpload(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-sans text-sm"
            >
              <FaUpload /> Mass Upload Excel
            </button>
          )}
          <button
            onClick={handleAdd}
            className="bg-mint-500 text-white px-4 py-2 rounded-lg hover:bg-mint-600 transition-colors flex items-center gap-2 font-sans text-sm"
          >
            <FaPlus /> Add New
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto mb-6 bg-gray-100 p-1 rounded-lg">
        <div className="flex space-x-1 min-w-max">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key as DetailCategory)}
                className={`py-2 px-2 sm:px-4 rounded-md font-sans text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap ${
                  activeCategory === category.key
                    ? 'bg-white text-forest-700 shadow'
                    : 'text-gray-600 hover:text-forest-600'
                }`}
              >
                <IconComponent className={activeCategory === category.key ? `text-${category.color}-500` : ''} />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Display */}
      <div className="min-h-[300px]">
        {renderData()}
        
        {/* Empty State */}
        {(
          (activeCategory === 'schedule' && events.length === 0) ||
          (activeCategory === 'entourage' && entourage.length === 0) ||
          (activeCategory === 'attire' && attire.length === 0) ||
          (activeCategory === 'locations' && locations.length === 0)
        ) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4 flex justify-center">
              {(() => {
                const category = categories.find(cat => cat.key === activeCategory);
                if (category) {
                  const IconComponent = category.icon;
                  return <IconComponent />;
                }
                return null;
              })()}
            </div>
            <p className="text-gray-500 font-sans">No {activeCategory} data found</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add New" to create your first entry</p>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      <WeddingDetailFormModal
        isOpen={showAddModal}
        title={`Add New ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Item`}
        category={activeCategory}
        onSave={(data) => {
          setNotification({
            isVisible: true,
            message: `${activeCategory} item added successfully`,
            type: 'success'
          });
          refreshCurrentCategory();
        }}
        onClose={() => setShowAddModal(false)}
      />

      {/* Edit Form Modal */}
      <WeddingDetailFormModal
        isOpen={showEditModal}
        title={`Edit ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Item`}
        category={activeCategory}
        item={currentItem}
        onSave={(data) => {
          setNotification({
            isVisible: true,
            message: `${activeCategory} item updated successfully`,
            type: 'success'
          });
          refreshCurrentCategory();
        }}
        onClose={() => {
          setShowEditModal(false);
          setCurrentItem(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title={`Delete ${activeCategory} Item`}
        message={`Are you sure you want to delete this ${activeCategory} item? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setCurrentItem(null);
        }}
      />

      {/* Success/Error Notification */}
      <SuccessNotification
        isVisible={notification.isVisible}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />

      {/* Excel Upload Modal */}
      <EntourageExcelUpload
        isVisible={showExcelUpload}
        onClose={() => setShowExcelUpload(false)}
        onEntourageUploaded={() => {
          setShowExcelUpload(false);
          setNotification({
            isVisible: true,
            message: 'Entourage members uploaded successfully!',
            type: 'success'
          });
          refreshCurrentCategory();
        }}
      />
    </div>
  );
}