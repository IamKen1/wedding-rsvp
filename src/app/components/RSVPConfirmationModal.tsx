"use client";

import { useState } from 'react';
import { FaHeart, FaUsers, FaEnvelope, FaPhoneAlt, FaTimes, FaSpinner } from 'react-icons/fa';

interface RSVPConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  formData: {
    name: string;
    email: string;
    phone: string;
    willAttend: string;
    guestCount: number;
    message: string;
  };
}

export default function RSVPConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formData 
}: RSVPConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-mint-500 to-sage-500 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaHeart className="text-xl mr-3" />
                <h3 className="text-xl font-semibold">Confirm Your RSVP</h3>
              </div>
              {!isSubmitting && (
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <FaTimes className="text-lg" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Please review your RSVP details before submitting:
            </p>

            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center">
                <FaHeart className="text-mint-500 mr-3 w-5" />
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{formData.name}</span>
                </div>
              </div>

              {/* Email */}
              {formData.email && (
                <div className="flex items-center">
                  <FaEnvelope className="text-mint-500 mr-3 w-5" />
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{formData.email}</span>
                  </div>
                </div>
              )}

              {/* Phone */}
              {formData.phone && (
                <div className="flex items-center">
                  <FaPhoneAlt className="text-mint-500 mr-3 w-5" />
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-900">{formData.phone}</span>
                  </div>
                </div>
              )}

              {/* Attendance */}
              <div className="flex items-center">
                <FaHeart className="text-mint-500 mr-3 w-5" />
                <div>
                  <span className="font-medium text-gray-700">Attending:</span>
                  <span className={`ml-2 font-medium ${
                    formData.willAttend === 'yes' ? 'text-mint-600' : 'text-blush-600'
                  }`}>
                    {formData.willAttend === 'yes' ? 'Yes, I\'ll be there!' : 'Sorry, can\'t make it'}
                  </span>
                </div>
              </div>

              {/* Guest Count */}
              {formData.willAttend === 'yes' && (
                <div className="flex items-center">
                  <FaUsers className="text-mint-500 mr-3 w-5" />
                  <div>
                    <span className="font-medium text-gray-700">Number of Guests:</span>
                    <span className="ml-2 text-gray-900">
                      {formData.guestCount} guest{formData.guestCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Message */}
              {formData.message && (
                <div className="border-t pt-4 mt-4">
                  <span className="font-medium text-gray-700 block mb-2">Message:</span>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg italic">
                    "{formData.message}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 
                hover:bg-gray-100 transition-colors duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-mint-500 to-sage-500 text-white 
                rounded-lg hover:shadow-lg transform hover:scale-105 
                transition-all duration-200 disabled:opacity-50 
                disabled:cursor-not-allowed disabled:transform-none
                flex items-center cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaHeart className="mr-2" />
                  Confirm RSVP
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}