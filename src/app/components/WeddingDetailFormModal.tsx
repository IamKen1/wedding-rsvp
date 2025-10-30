"use client";

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import IconPicker from './IconPicker';
import PhotoUpload from './PhotoUpload';

interface FormModalProps {
  isOpen: boolean;
  title: string;
  category: 'schedule' | 'entourage' | 'attire' | 'locations';
  item?: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function WeddingDetailFormModal({ 
  isOpen, 
  title, 
  category, 
  item, 
  onSave, 
  onClose 
}: FormModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData(item);
      } else {
        // Initialize empty form based on category
        switch (category) {
          case 'schedule':
            setFormData({
              eventName: '',
              eventTime: '',
              location: '',
              description: '',
              icon: '📅',
              color: '#10B981',
              sortOrder: 0
            });
            break;
          case 'entourage':
            setFormData({
              name: '',
              role: '',
              side: 'bride',
              category: 'other',
              description: '',
              imageUrl: '',
              sortOrder: 0
            });
            break;
          case 'attire':
            setFormData({
              category: '',
              title: '',
              description: '',
              colorScheme: '#10B981',
              dressCode: '',
              guidelines: '',
              photos: [],
              sortOrder: 0
            });
            break;
          case 'locations':
            setFormData({
              name: '',
              address: '',
              contactPhone: '',
              contactEmail: '',
              directions: '',
              specialInstructions: '',
              mapUrl: '',
              mapPhoto: null,
              sortOrder: 0
            });
            break;
        }
      }
    }
  }, [isOpen, item, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = item ? 'PUT' : 'POST';
      const url = item 
        ? `/api/admin/${category}?id=${item.id}`
        : `/api/admin/${category}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave(formData);
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        alert('Failed to save. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save. Please try again.');
    }

    setLoading(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const renderScheduleForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name *
          </label>
          <input
            type="text"
            value={formData.eventName || ''}
            onChange={(e) => updateField('eventName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Time *
          </label>
          <input
            type="text"
            value={formData.eventTime || ''}
            onChange={(e) => updateField('eventTime', e.target.value)}
            placeholder="e.g., 2:00 PM"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icon *
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowIconPicker(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-mint-400 focus:ring-2 focus:ring-mint-500 focus:border-mint-500 bg-white hover:bg-mint-25 transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {formData.icon || '📅'}
              </span>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700 group-hover:text-mint-600">
                  {formData.icon ? 'Change Icon' : 'Choose Icon'}
                </div>
                <div className="text-xs text-gray-500">
                  Click to open icon picker
                </div>
              </div>
              <span className="text-mint-400 group-hover:text-mint-600 transition-colors">
                🎨
              </span>
            </button>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>💡</span>
              <span>Pro tip: Use the icon picker for best results or manually type an emoji</span>
            </div>
            <input
              type="text"
              value={formData.icon || ''}
              onChange={(e) => updateField('icon', e.target.value)}
              placeholder="📅 Or type emoji here..."
              className="w-full px-3 py-2 text-center text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            type="color"
            value={formData.color || '#10B981'}
            onChange={(e) => updateField('color', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sortOrder || 0}
            onChange={(e) => updateField('sortOrder', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );

  const renderEntourageForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <input
            type="text"
            value={formData.role || ''}
            onChange={(e) => updateField('role', e.target.value)}
            placeholder="e.g., Maid of Honor, Best Man"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category || 'other'}
            onChange={(e) => {
              updateField('category', e.target.value);
              // Auto-update side based on category
              if (e.target.value === 'parents') {
                if (!formData.side || formData.side === 'male' || formData.side === 'female') {
                  updateField('side', 'bride');
                }
              } else if (e.target.value === 'sponsors') {
                if (formData.side === 'bride' || formData.side === 'groom') {
                  updateField('side', 'male');
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
            required
          >
            <option value="parents">Parents</option>
            <option value="sponsors">Principal Sponsors</option>
            <option value="other">Other Entourage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {formData.category === 'parents' ? 'Side *' : formData.category === 'sponsors' ? 'Gender *' : 'Optional Side'}
          </label>
          <select
            value={formData.side || (formData.category === 'parents' ? 'bride' : formData.category === 'sponsors' ? 'male' : 'both')}
            onChange={(e) => updateField('side', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
            required
          >
            {formData.category === 'parents' ? (
              <>
                <option value="bride">Bride's Side</option>
                <option value="groom">Groom's Side</option>
              </>
            ) : formData.category === 'sponsors' ? (
              <>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </>
            ) : (
              <>
                <option value="both">No Separation</option>
                <option value="bride">Bride's Side</option>
                <option value="groom">Groom's Side</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sortOrder || 0}
            onChange={(e) => updateField('sortOrder', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={formData.imageUrl || ''}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            placeholder="Brief description about this person"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blush-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );

  const renderAttireForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            required
          >
            <option value="">Select category</option>
            <option value="bridal-party">Bridal Party</option>
            <option value="groomsmen">Groomsmen</option>
            <option value="family">Family</option>
            <option value="guests">Guests</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sortOrder || 0}
            onChange={(e) => updateField('sortOrder', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., Bridesmaids Dresses"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dress Code *
          </label>
          <input
            type="text"
            value={formData.dressCode || ''}
            onChange={(e) => updateField('dressCode', e.target.value)}
            placeholder="e.g., Cocktail, Formal"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color Scheme
          </label>
          <input
            type="color"
            value={formData.colorScheme || '#10B981'}
            onChange={(e) => updateField('colorScheme', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            placeholder="Description of the attire"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guidelines
          </label>
          <textarea
            value={formData.guidelines || ''}
            onChange={(e) => updateField('guidelines', e.target.value)}
            rows={3}
            placeholder="Specific guidelines or requirements"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <PhotoUpload
            label="Reference Photos"
            photos={formData.photos || []}
            onPhotosChange={(photos) => updateField('photos', photos)}
            maxPhotos={5}
            placeholder="Upload reference photos to help guests understand the attire requirements"
            isRequired={false}
          />
        </div>
      </div>
    </>
  );

  const renderLocationsForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <textarea
            value={formData.address || ''}
            onChange={(e) => updateField('address', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contactPhone || ''}
            onChange={(e) => updateField('contactPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            value={formData.contactEmail || ''}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Directions
          </label>
          <textarea
            value={formData.directions || ''}
            onChange={(e) => updateField('directions', e.target.value)}
            rows={3}
            placeholder="How to get to this location"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions
          </label>
          <textarea
            value={formData.specialInstructions || ''}
            onChange={(e) => updateField('specialInstructions', e.target.value)}
            rows={3}
            placeholder="Parking info, dress code, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Map URL
          </label>
          <input
            type="url"
            value={formData.mapUrl || ''}
            onChange={(e) => updateField('mapUrl', e.target.value)}
            placeholder="Google Maps link"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sortOrder || 0}
            onChange={(e) => updateField('sortOrder', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          />
        </div>

        <div className="col-span-2">
          <PhotoUpload
            label="Map Photo"
            photos={formData.mapPhoto ? [formData.mapPhoto] : []}
            onPhotosChange={(photos) => updateField('mapPhoto', photos.length > 0 ? photos[0] : null)}
            maxPhotos={1}
            placeholder="Upload a map or direction photo to help guests find this location easily"
            isRequired={false}
          />
        </div>
      </div>
    </>
  );

  const renderForm = () => {
    switch (category) {
      case 'schedule':
        return renderScheduleForm();
      case 'entourage':
        return renderEntourageForm();
      case 'attire':
        return renderAttireForm();
      case 'locations':
        return renderLocationsForm();
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold font-proxima-regular text-forest-700">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {renderForm()}

          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-proxima-regular"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors font-proxima-regular disabled:opacity-50"
            >
              {loading ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      {/* Icon Picker Modal */}
      <IconPicker
        isOpen={showIconPicker}
        selectedIcon={formData.iconName}
        onSelect={(iconName, emoji) => {
          updateField('icon', emoji);
          updateField('iconName', iconName);
        }}
        onClose={() => setShowIconPicker(false)}
      />
    </div>
  );
}