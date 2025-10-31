"use client";

import { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEdit, FaSave, FaTimes, FaImages, FaPlus } from 'react-icons/fa';
import PhotoUpload from './PhotoUpload';
import ConfirmationModal from './ConfirmationModal';
import LoadingOverlay from './LoadingOverlay';
import SuccessNotification from './SuccessNotification';

interface PrenupPhoto {
  id: number;
  photoUrl: string;
  caption: string;
  sortOrder: number;
}

export default function PrenupPhotoManager() {
  const [photos, setPhotos] = useState<PrenupPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ isVisible: boolean; message: string }>({
    isVisible: false,
    message: ''
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/prenup');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      showNotification('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification({ isVisible: true, message });
  };

  const handleMassUpload = async () => {
    if (uploadPhotos.length === 0) return;

    setIsProcessing(true);
    try {
      const photosData = uploadPhotos.map((url, index) => ({
        photoUrl: url,
        caption: '',
        sortOrder: photos.length + index
      }));

      const response = await fetch('/api/admin/prenup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: photosData })
      });

      if (response.ok) {
        await fetchPhotos();
        setShowUploadModal(false);
        setUploadPhotos([]);
        showNotification(`Successfully uploaded ${uploadPhotos.length} photos!`);
      } else {
        showNotification('Failed to upload photos');
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      showNotification('Error uploading photos');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSingle = async (photoUrl: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/prenup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoUrl,
          caption: '',
          sortOrder: photos.length
        })
      });

      if (response.ok) {
        await fetchPhotos();
        showNotification('Photo added successfully!');
      } else {
        showNotification('Failed to add photo');
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      showNotification('Error adding photo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateCaption = async (id: number) => {
    setIsProcessing(true);
    try {
      const photo = photos.find(p => p.id === id);
      if (!photo) return;

      const response = await fetch('/api/admin/prenup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          photoUrl: photo.photoUrl,
          caption: editCaption,
          sortOrder: photo.sortOrder
        })
      });

      if (response.ok) {
        await fetchPhotos();
        setEditingId(null);
        setEditCaption('');
        showNotification('Caption updated successfully!');
      } else {
        showNotification('Failed to update caption');
      }
    } catch (error) {
      console.error('Error updating caption:', error);
      showNotification('Error updating caption');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!photoToDelete) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/prenup?id=${photoToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPhotos();
        showNotification('Photo deleted successfully!');
      } else {
        showNotification('Failed to delete photo');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      showNotification('Error deleting photo');
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      setPhotoToDelete(null);
    }
  };

  const startEdit = (photo: PrenupPhoto) => {
    setEditingId(photo.id);
    setEditCaption(photo.caption || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCaption('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LoadingOverlay 
        isVisible={isProcessing} 
        message="Processing..." 
      />

      <SuccessNotification
        isVisible={notification.isVisible}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Photo"
        message="Are you sure you want to delete this photo? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setPhotoToDelete(null);
        }}
        isProcessing={isProcessing}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-proxima-bold">Prenup Photos</h2>
          <p className="text-gray-600 font-proxima-regular mt-1">
            Manage your prenup photo gallery
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 transition-colors font-proxima-regular"
        >
          <FaUpload />
          Mass Upload
        </button>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FaImages className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-proxima-regular mb-4">No prenup photos yet</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 bg-forest-600 text-white px-6 py-3 rounded-lg hover:bg-forest-700 transition-colors font-proxima-regular"
          >
            <FaPlus />
            Add Your First Photos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img
                  src={photo.photoUrl}
                  alt={photo.caption || 'Prenup photo'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                {editingId === photo.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Enter caption..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent font-proxima-regular"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateCaption(photo.id)}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 bg-forest-600 text-white px-3 py-2 rounded-lg hover:bg-forest-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-proxima-regular text-sm"
                      >
                        <FaSave />
                        {isProcessing ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-proxima-regular text-sm"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 font-proxima-regular text-sm mb-3 min-h-[40px]">
                      {photo.caption || 'No caption'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(photo)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors font-proxima-regular text-sm"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setPhotoToDelete(photo.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors font-proxima-regular text-sm"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mass Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 font-proxima-bold">Upload Photos</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadPhotos([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <PhotoUpload
              label="Prenup Photos"
              photos={uploadPhotos}
              onPhotosChange={setUploadPhotos}
              maxPhotos={50}
              placeholder="Upload multiple prenup photos at once"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleMassUpload}
                disabled={uploadPhotos.length === 0 || isProcessing}
                className="flex-1 bg-forest-600 text-white px-6 py-3 rounded-lg hover:bg-forest-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-proxima-regular"
              >
                {isProcessing ? 'Uploading...' : `Upload ${uploadPhotos.length} Photo${uploadPhotos.length !== 1 ? 's' : ''}`}
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadPhotos([]);
                }}
                disabled={isProcessing}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-proxima-regular"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
