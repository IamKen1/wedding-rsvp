"use client";

import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaImage, FaTrash, FaEye } from 'react-icons/fa';
import Image from 'next/image';

interface PhotoUploadProps {
  label: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  placeholder?: string;
  isRequired?: boolean;
}

interface PhotoPreview {
  id: string;
  file: File;
  preview: string;
}

export default function PhotoUpload({
  label,
  photos,
  onPhotosChange,
  maxPhotos = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 5,
  isRequired = false
}: PhotoUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;

    setError(null);
    const fileArray = Array.from(files);

    // Check if adding these files would exceed the limit
    if (photos.length + fileArray.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    const validFiles: File[] = [];
    
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
    }

    // Convert files to base64 and add to photos
    setUploading(true);
    try {
      const newPhotos: string[] = [];
      
      for (const file of validFiles) {
        const base64 = await convertToBase64(file);
        newPhotos.push(base64);
      }
      
      onPhotosChange([...photos, ...newPhotos]);
      setError(null);
    } catch (error) {
      setError('Failed to process images');
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const totalPhotos = photos.length;
  const canAddMore = totalPhotos < maxPhotos;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
        <span className="text-gray-500 ml-2">({totalPhotos}/{maxPhotos})</span>
      </label>

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
            ${dragOver 
              ? 'border-mint-500 bg-mint-50' 
              : 'border-gray-300 hover:border-mint-400 hover:bg-gray-50'
            }
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
          />
          
          <div className="space-y-2">
            <FaUpload className="mx-auto text-2xl text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-mint-600">Click to upload</span>
              <span> or drag and drop</span>
            </div>
            <div className="text-xs text-gray-500">
              {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {maxSizeMB}MB
            </div>
          </div>

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-mint-500 border-t-transparent"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Existing Photos */}
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(photo, '_blank');
                    }}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    title="View full size"
                  >
                    <FaEye className="text-gray-700 text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(index);
                    }}
                    className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    title="Remove photo"
                  >
                    <FaTrash className="text-white text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}


        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && !canAddMore && (
        <div className="text-center py-8 text-gray-500">
          <FaImage className="mx-auto text-3xl mb-2" />
          <p>No photos uploaded</p>
        </div>
      )}
    </div>
  );
}