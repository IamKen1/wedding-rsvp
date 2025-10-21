"use client";

import { FaSpinner } from 'react-icons/fa';

interface LoadingOverlayProps {
  isVisible: boolean;
  message: string;
}

export default function LoadingOverlay({ isVisible, message }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <FaSpinner className="text-4xl text-mint-500 animate-spin mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Processing...
          </h3>
          <p className="text-gray-600">
            {message}
          </p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-mint-500 to-sage-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Please wait, do not close this window...
          </p>
        </div>
      </div>
    </div>
  );
}