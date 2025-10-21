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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-purple-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-semibold text-white">
            Mass Upload Entourage
          </h2>
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-lg font-serif font-semibold text-blue-900 mb-2">
              📋 How to Use
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 font-sans text-sm">
              <li>Download the Excel template below</li>
              <li>Fill in your wedding entourage details (already pre-filled with your data)</li>
              <li>Make sure "side" is either "bride" or "groom"</li>
              <li>Save the file and upload it here</li>
              <li>Review the results and confirm</li>
            </ol>
          </div>

          {/* Download Template Button */}
          <div className="flex justify-center">
            <button
              onClick={handleTemplateDownload}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-mint-500 to-sage-500 
                text-white rounded-xl font-sans font-medium shadow-lg hover:shadow-xl 
                hover:scale-105 transition-all duration-300"
            >
              <FaDownload className="text-lg" />
              Download Excel Template
            </button>
          </div>

          {/* Upload Section */}
          <div className="border-2 border-dashed border-mint-300 rounded-xl p-8 text-center hover:border-mint-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="entourage-excel-upload"
            />
            <label
              htmlFor="entourage-excel-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center">
                {isUploading ? (
                  <FaSpinner className="text-3xl text-mint-600 animate-spin" />
                ) : (
                  <FaUpload className="text-3xl text-mint-600" />
                )}
              </div>
              <div>
                <p className="text-lg font-serif font-medium text-forest-800 mb-1">
                  {isUploading ? 'Uploading...' : 'Click to Upload Excel File'}
                </p>
                <p className="text-sm text-forest-600 font-sans">
                  Accepts .xlsx and .xls files
                </p>
              </div>
            </label>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className={`rounded-xl p-6 ${
              uploadResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${
                  uploadResult.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  {uploadResult.success ? (
                    <FaCheckCircle className="text-2xl" />
                  ) : (
                    <FaExclamationTriangle className="text-2xl" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-serif font-semibold text-lg mb-2 ${
                    uploadResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {uploadResult.success ? 'Upload Successful!' : 'Upload Failed'}
                  </h4>
                  <p className={`font-sans mb-3 ${
                    uploadResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {uploadResult.message || 
                      `Processed ${uploadResult.insertedCount} of ${uploadResult.totalProcessed} entries`}
                  </p>
                  
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="font-sans font-medium text-red-900 mb-2">Errors:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 max-h-40 overflow-y-auto">
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

          {uploadErrors.length > 0 && !uploadResult && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-serif font-semibold text-red-900 mb-2">Errors:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                {uploadErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl 
              font-sans font-medium hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          {uploadResult?.success && (
            <button
              onClick={handleConfirmUpload}
              className="px-6 py-2 bg-gradient-to-r from-mint-500 to-sage-500 text-white 
                rounded-xl font-sans font-medium shadow-lg hover:shadow-xl hover:scale-105 
                transition-all duration-300"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
