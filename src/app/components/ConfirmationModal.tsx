"use client";

import { FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  onConfirm,
  onCancel,
  isProcessing = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 text-3xl" />;
      case 'danger':
        return <FaExclamationTriangle className="text-red-500 text-3xl" />;
      default:
        return <FaCheckCircle className="text-mint-500 text-3xl" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-200';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-200';
      default:
        return 'bg-mint-500 hover:bg-mint-600 focus:ring-mint-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isProcessing ? onCancel : undefined}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              {getIcon()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 p-6 pt-0">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl 
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 
                transition-all duration-300 disabled:opacity-50 font-medium"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className={`flex-1 text-white px-4 py-2 rounded-xl font-medium 
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed 
                focus:outline-none focus:ring-4 ${getConfirmButtonClass()}`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}