"use client";

import { useState, useRef } from 'react';
import { FaUpload, FaDownload, FaCheckCircle, FaTimes, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

interface EntourageExcelUploadProps {
  onEntourageUploaded: () => void;
  isVisible: boolean;
  onClose: () => void;
}

interface UploadResult {
  success: boolean;
  insertedCount: number;
  totalProcessed: number;
  errors?: string[];
  message?: string;
}

export default function EntourageExcelUpload({ onEntourageUploaded, isVisible, onClose }: EntourageExcelUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateDownload = async () => {
    try {
      const response = await fetch('/api/admin/entourage/template');
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding-entourage-template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);
    setUploadErrors([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/entourage/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadErrors(data.errors || [data.error]);
        setUploadResult({
          success: false,
          insertedCount: 0,
          totalProcessed: data.totalRows || 0,
          errors: data.errors,
          message: data.error
        });
      } else {
        setUploadResult(data);
        if (data.success) {
          // Wait a bit before calling the callback
          setTimeout(() => {
            onEntourageUploaded();
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadErrors(['Failed to upload file. Please try again.']);
      setUploadResult({
        success: false,
        insertedCount: 0,
        totalProcessed: 0,
        message: 'Upload failed'
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmUpload = () => {
    setUploadResult(null);
    setUploadErrors([]);
    onClose();
  };

  const handleCancel = () => {
    setUploadResult(null);
    setUploadErrors([]);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-mint-500 to-sage-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <FaUpload />
              Upload Wedding Entourage
            </h2>
          </div>

          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* Instructions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">How to use:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Download the Excel template below</li>
                <li>Fill in your entourage details (name, role, category, side, description, sortOrder)</li>
                <li>Category: "parents", "sponsors", or "other"</li>
                <li>Side: "bride"/"groom" for parents, "male"/"female" for sponsors, "both" for others</li>
                <li>Upload the completed Excel file</li>
              </ol>
            </div>

            {/* Template Download */}
            <div className="mb-6">
              <button
                onClick={handleTemplateDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <FaDownload />
                Download Excel Template
              </button>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Excel File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-mint-50 file:text-mint-700 hover:file:bg-mint-100 disabled:opacity-50"
              />
              {isUploading && (
                <div className="flex items-center gap-2 mt-2 text-blue-600">
                  <FaSpinner className="animate-spin" />
                  <span className="text-sm">Processing file...</span>
                </div>
              )}
            </div>

            {/* Upload Errors */}
            {uploadErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Upload Errors:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                      {uploadErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Results */}
            {uploadResult && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">Upload Successful!</h4>
                    <p className="text-sm text-green-700">
                      Successfully processed {uploadResult.totalProcessed} entourage member(s).
                      {uploadResult.insertedCount > 0 && ` Inserted ${uploadResult.insertedCount} new member(s).`}
                    </p>
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium text-red-800 mb-1">Some errors occurred:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                          {uploadResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Close
            </button>
            {uploadResult?.success && (
              <button
                onClick={handleConfirmUpload}
                className="px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors font-medium"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
