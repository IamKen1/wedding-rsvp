"use client";

import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaUsers, FaStickyNote, FaPlus } from 'react-icons/fa';
import { GuestInvitation } from '@/data/guests';
import ConfirmationModal from './ConfirmationModal';

interface AddInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: Omit<GuestInvitation, 'invitationCode'>) => void;
  initialData?: {
    name: string;
    email: string;
    allocatedSeats: number;
    notes: string;
  };
  isEditMode?: boolean;
}

export default function AddInvitationModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  initialData,
  isEditMode = false 
}: AddInvitationModalProps) {
  const [formData, setFormData] = useState(() => 
    initialData || {
      name: '',
      email: '',
      allocatedSeats: 1,
      notes: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
      setErrors({});
      setIsSubmitting(false);
    } else if (isOpen && !initialData) {
      const defaultData = initialData || {
        name: '',
        email: '',
        allocatedSeats: 1,
        notes: ''
      };
      setFormData(defaultData);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    const defaultData = initialData || {
      name: '',
      email: '',
      allocatedSeats: 1,
      notes: ''
    };
    setFormData(defaultData);
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email is optional now
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.allocatedSeats < 1 || formData.allocatedSeats > 10) {
      newErrors.allocatedSeats = 'Allocated seats must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Store form data and show confirmation modal
    setPendingFormData(formData);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmission = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const newGuest: Omit<GuestInvitation, 'invitationCode'> = {
        name: pendingFormData.name.trim(),
        email: pendingFormData.email.trim() || undefined,
        allocatedSeats: pendingFormData.allocatedSeats,
        notes: pendingFormData.notes.trim() || undefined
      };

      onAdd(newGuest);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding invitation:', error);
      // Error will be handled by the parent component via notification
    } finally {
      setIsSubmitting(false);
      setPendingFormData(null);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-forest-700 flex items-center gap-3">
              <FaPlus className="text-mint-500" />
              {isEditMode ? 'Edit Invitation' : 'Add New Invitation'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-mint-500" />
                Guest/Family Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  errors.name 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-200 focus:border-mint-400 bg-white'
                } focus:outline-none focus:ring-2 focus:ring-mint-200`}
                placeholder="e.g., John & Jane Smith, The Johnson Family"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-mint-500" />
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-200 focus:border-mint-400 bg-white'
                } focus:outline-none focus:ring-2 focus:ring-mint-200`}
                placeholder="guest@example.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Allocated Seats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline mr-2 text-mint-500" />
                Allocated Seats *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.allocatedSeats}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    allocatedSeats: parseInt(e.target.value) || 1 
                  }))}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    errors.allocatedSeats 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-gray-200 focus:border-mint-400 bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-mint-200`}
                  disabled={isSubmitting}
                />
                {errors.allocatedSeats && <p className="text-red-500 text-sm mt-1">{errors.allocatedSeats}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaStickyNote className="inline mr-2 text-mint-500" />
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-mint-400 
                  bg-white focus:outline-none focus:ring-2 focus:ring-mint-200 transition-all duration-300"
                placeholder="e.g., Vegetarian, Best Man, Mother's side, etc."
                disabled={isSubmitting}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl 
                  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 
                  transition-all duration-300 disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-mint-500 to-sage-500 text-white px-6 py-3 
                  rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                  disabled:transform-none focus:outline-none focus:ring-4 focus:ring-mint-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEditMode ? 'Updating...' : 'Adding Invitation...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaPlus />
                    {isEditMode ? 'Update Invitation' : 'Add Invitation'}
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={isEditMode ? 'Update Invitation' : 'Create Invitation'}
        message={pendingFormData ? 
          `Please confirm the ${isEditMode ? 'update' : 'creation'} of invitation:\n\n• Name: ${pendingFormData.name}\n• Email: ${pendingFormData.email || 'Not provided'}\n• Allocated Seats: ${pendingFormData.allocatedSeats}\n• Notes: ${pendingFormData.notes || 'None'}\n\nAre you sure you want to ${isEditMode ? 'update' : 'create'} this invitation?` 
          : ''
        }
        confirmText={isEditMode ? 'Update' : 'Create'}
        cancelText="Cancel"
        type="info"
        onConfirm={handleConfirmSubmission}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingFormData(null);
        }}
        isProcessing={isSubmitting}
      />
    </div>
  );
}