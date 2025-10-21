"use client";

import { useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface SuccessNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  autoCloseDelay?: number;
}

export default function SuccessNotification({ 
  isVisible, 
  message, 
  onClose, 
  autoCloseDelay = 5000 
}: SuccessNotificationProps) {
  useEffect(() => {
    if (isVisible && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Success!
            </p>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FaTimes className="text-gray-400 text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}