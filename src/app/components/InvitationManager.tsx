"use client";

import { useState, useEffect } from 'react';
import { getAllGuests, addGuest, deleteGuest, GuestInvitation } from '@/data/rsvp';
import { FaUsers, FaCopy, FaEnvelope, FaEdit, FaTrash, FaPlus, FaDownload, FaFileExcel, FaSearch, FaTimes } from 'react-icons/fa';
import AddInvitationModal from './AddInvitationModal';
import SuccessNotification from './SuccessNotification';
import LoadingOverlay from './LoadingOverlay';
import ExcelUpload from './ExcelUpload';
import ConfirmationModal from './ConfirmationModal';

const generateInvitationUrl = (baseUrl: string, invitationCode: string) => {
  return `${baseUrl}?invitation=${invitationCode}`;
};

export default function InvitationManager() {
  const [guests, setGuests] = useState<GuestInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<{ id: string; name: string } | null>(null);
  const [guestToEdit, setGuestToEdit] = useState<GuestInvitation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ isVisible: boolean; message: string }>({
    isVisible: false,
    message: ''
  });
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const loadGuests = async () => {
    try {
      setLoading(true);
      const guestList = await getAllGuests();
      setGuests(guestList);
    } catch (error) {
      console.error('Error loading guests:', error);
      setNotification({
        isVisible: true,
        message: 'Error loading guest invitations'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, []);

  const copyInvitationUrl = async (guestId: string) => {
    const url = generateInvitationUrl(baseUrl, guestId);
    const guestName = guests.find(g => g.invitationCode === guestId)?.name || 'guest';
    
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(guestId);
      setNotification({
        isVisible: true,
        message: `Invitation URL copied to clipboard for ${guestName}!`
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(guestId);
      setNotification({
        isVisible: true,
        message: `Invitation URL copied to clipboard for ${guestName}!`
      });
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getTotalSeats = () => {
    return guests.reduce((total, guest) => total + guest.allocatedSeats, 0);
  };

  const filteredGuests = guests.filter(guest => {
    const query = searchQuery.toLowerCase();
    return (
      guest.name.toLowerCase().includes(query) ||
      (guest.email && guest.email.toLowerCase().includes(query)) ||
      (guest.notes && guest.notes.toLowerCase().includes(query)) ||
      guest.invitationCode.toLowerCase().includes(query)
    );
  });

  const handleAddInvitation = () => {
    setShowAddModal(true);
  };

  const handleExcelUpload = () => {
    setShowExcelUpload(true);
  };

  const handleGuestsUploaded = async (uploadedGuests: GuestInvitation[]) => {
    setUploadingExcel(true);
    
    try {
      // Save each guest to the database through the API
      const savedGuests: GuestInvitation[] = [];
      
      for (const guest of uploadedGuests) {
        try {
          const response = await fetch('/api/admin/guests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: guest.name,
              email: guest.email,
              allocatedSeats: guest.allocatedSeats,
              notes: guest.notes,
              invitationCode: guest.invitationCode // Use the generated code from Excel upload
            }),
          });

          if (response.ok) {
            const result = await response.json();
            savedGuests.push(result.guest);
          } else {
            console.error('Failed to save guest:', guest.name);
          }
        } catch (error) {
          console.error('Error saving guest:', guest.name, error);
        }
      }

      // Refresh the entire guest list from database to ensure consistency
      await loadGuests();
      setShowExcelUpload(false);
      
      // Show success notification
      const failedCount = uploadedGuests.length - savedGuests.length;
      const message = failedCount > 0 
        ? `Successfully imported ${savedGuests.length} out of ${uploadedGuests.length} guest invitation${uploadedGuests.length !== 1 ? 's' : ''}! ${failedCount} failed to import.`
        : `Successfully imported all ${savedGuests.length} guest invitation${uploadedGuests.length !== 1 ? 's' : ''}!`;
      
      setNotification({
        isVisible: true,
        message
      });

    } catch (error) {
      console.error('Error processing Excel upload:', error);
      setNotification({
        isVisible: true,
        message: 'Error importing guests. Please try again.'
      });
    } finally {
      setUploadingExcel(false);
    }
  };

  const handleAddGuest = async (guestData: Omit<GuestInvitation, 'invitationCode'>) => {
    try {
      const newGuest = await addGuest(guestData);
      
      // Refresh the guest list to ensure consistency
      await loadGuests();
      
      // Show success notification
      setNotification({
        isVisible: true,
        message: `Invitation created successfully for ${newGuest.name}! Invitation Code: ${newGuest.invitationCode}`
      });
    } catch (error) {
      console.error('Error adding guest:', error);
      setNotification({
        isVisible: true,
        message: 'Error creating invitation. Please try again.'
      });
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    setGuestToDelete({ id: guestId, name: guestName });
    setShowDeleteConfirm(true);
  };

  const handleEditGuest = (guest: GuestInvitation) => {
    setGuestToEdit(guest);
    setShowEditModal(true);
  };

  const handleUpdateGuest = async (updatedGuest: Omit<GuestInvitation, 'invitationCode'>) => {
    if (!guestToEdit) return;
    
    try {
      const response = await fetch('/api/admin/guests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitationCode: guestToEdit.invitationCode,
          ...updatedGuest
        }),
      });

      if (response.ok) {
        // Refresh the guest list to ensure consistency
        await loadGuests();
        setNotification({
          isVisible: true,
          message: `Invitation for ${updatedGuest.name} has been updated successfully.`
        });
        setShowEditModal(false);
        setGuestToEdit(null);
      } else {
        throw new Error('Update operation failed');
      }
    } catch (error) {
      console.error('Error updating guest:', error);
      setNotification({
        isVisible: true,
        message: 'Error updating invitation. Please try again.'
      });
    }
  };

  const confirmDeleteGuest = async () => {
    if (!guestToDelete) return;
    
    try {
      const success = await deleteGuest(guestToDelete.id);
      if (success) {
        // Refresh the guest list to ensure consistency
        await loadGuests();
        setNotification({
          isVisible: true,
          message: `Invitation for ${guestToDelete.name} has been deleted successfully.`
        });
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
      setNotification({
        isVisible: true,
        message: 'Error deleting invitation. Please try again.'
      });
    } finally {
      setShowDeleteConfirm(false);
      setGuestToDelete(null);
    }
  };

  const handleExportGuestList = async () => {
    setShowExportConfirm(true);
  };

  const confirmExportGuestList = async () => {
    setShowExportConfirm(false);
    setIsExporting(true);
    try {
      // Create CSV content from current guests state (including newly added ones)
      const csvHeaders = ['Name', 'Email', 'Allocated Seats', 'Notes', 'Invitation Code'];
      const csvRows = guests.map(guest => [
        guest.name,
        guest.email || '',
        guest.allocatedSeats.toString(),
        guest.notes || '',
        guest.invitationCode
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `guest-list-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setNotification({
        isVisible: true,
        message: `Guest list exported successfully! Downloaded ${guests.length} invitations.`
      });
    } catch (error) {
      console.error('Export failed:', error);
      setNotification({
        isVisible: true,
        message: 'Failed to export guest list. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-mint-50 py-6 flex items-center justify-center">
        <div className="text-lg font-proxima-regular text-gray-600">Loading invitations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-mint-50 py-6">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-proxima-regular font-bold text-forest-700 mb-2">
              Wedding Invitation Manager
            </h1>
            <p className="text-lg font-proxima-regular text-forest-600">
              Manage guest invitations and generate personalized RSVP links
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold font-proxima-regular text-blue-700">{guests.length}</div>
              <div className="text-sm font-proxima-regular text-blue-600">Total Invitations</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold font-proxima-regular text-green-700">{getTotalSeats()}</div>
              <div className="text-sm font-proxima-regular text-green-600">Total Seats Allocated</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleAddInvitation}
              disabled={uploadingExcel}
              className="bg-mint-500 text-white px-4 py-2 rounded-lg hover:bg-mint-600 
                transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 cursor-pointer
                disabled:cursor-not-allowed font-proxima-regular text-sm font-medium"
            >
              <FaPlus /> Add New Invitation
            </button>
            <button 
              onClick={handleExcelUpload}
              disabled={uploadingExcel}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
                transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 cursor-pointer
                disabled:cursor-not-allowed font-proxima-regular text-sm font-medium"
            >
              {uploadingExcel ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FaFileExcel /> Upload Excel
                </>
              )}
            </button>
            <button 
              onClick={handleExportGuestList}
              disabled={isExporting || uploadingExcel}
              className="bg-sage-500 text-white px-4 py-2 rounded-lg hover:bg-sage-600 
                transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 cursor-pointer
                disabled:cursor-not-allowed font-proxima-regular text-sm font-medium"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <FaDownload /> Export Guest List
                </>
              )}
            </button>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-forest-50 border-b border-forest-100">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold font-proxima-regular text-forest-700 flex items-center gap-2">
                  <FaUsers /> Guest Invitations
                </h2>
                {searchQuery && (
                  <span className="text-sm font-proxima-regular text-gray-600">
                    ({filteredGuests.length} of {guests.length} shown)
                  </span>
                )}
              </div>
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email or code..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent font-proxima-regular text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium font-proxima-regular text-gray-700 uppercase tracking-wider">
                    Guest/Family
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium font-proxima-regular text-gray-700 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium font-proxima-regular text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium font-proxima-regular text-gray-700 uppercase tracking-wider">
                    Invitation Link
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium font-proxima-regular text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500 font-proxima-regular">
                      {searchQuery ? `No invitations found matching "${searchQuery}"` : 'No invitations yet'}
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                  <tr key={guest.invitationCode} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium font-proxima-regular text-base text-gray-900">{guest.name}</div>
                        {guest.notes && (
                          <div className="text-sm font-proxima-regular text-gray-600">{guest.notes}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-mint-500" />
                        <span className="font-medium font-proxima-regular text-base">{guest.allocatedSeats}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {guest.email ? (
                          <>
                            <FaEnvelope className="text-gray-400" />
                            <span className="text-sm font-proxima-regular text-gray-700">{guest.email}</span>
                          </>
                        ) : (
                          <span className="text-sm font-proxima-regular text-gray-400 italic">No email</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {`${baseUrl}?invitation=${guest.invitationCode}`.substring(0, 50)}...
                        </code>
                        <button
                          onClick={() => copyInvitationUrl(guest.invitationCode)}
                          className={`p-2 rounded-lg transition-colors duration-300 cursor-pointer ${
                            copiedId === guest.invitationCode
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Copy invitation URL"
                        >
                          <FaCopy className="text-sm" />
                        </button>
                      </div>
                      {copiedId === guest.invitationCode && (
                        <div className="text-xs font-proxima-regular text-green-600 mt-1">
                          ✓ Copied to clipboard!
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditGuest(guest)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300 cursor-pointer"
                          title="Edit invitation"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.invitationCode, guest.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300 cursor-pointer"
                          title="Delete invitation"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-mint-50 border border-mint-200 rounded-xl p-4">
          <h3 className="font-semibold font-proxima-regular text-base text-forest-700 mb-3">How to use invitation links:</h3>
          <ul className="space-y-2 text-forest-600 font-proxima-regular">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-mint-400 rounded-full mt-2 flex-shrink-0"></span>
              Each guest/family has a unique invitation ID that tracks their allocated seats
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-mint-400 rounded-full mt-2 flex-shrink-0"></span>
              Copy the invitation link and send it to guests via email or messaging
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-mint-400 rounded-full mt-2 flex-shrink-0"></span>
              When guests click the link, they'll see a personalized RSVP form with their seat allocation
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-mint-400 rounded-full mt-2 flex-shrink-0"></span>
              Guests can only RSVP for up to their allocated number of seats
            </li>
          </ul>
        </div>
      </div>

      {/* Add Invitation Modal */}
      <AddInvitationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGuest}
      />

      {/* Edit Invitation Modal */}
      <AddInvitationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setGuestToEdit(null);
        }}
        onAdd={handleUpdateGuest}
        initialData={guestToEdit ? {
          name: guestToEdit.name,
          email: guestToEdit.email || '',
          allocatedSeats: guestToEdit.allocatedSeats,
          notes: guestToEdit.notes || ''
        } : undefined}
        isEditMode={true}
      />

      {/* Excel Upload Modal */}
      <ExcelUpload
        isVisible={showExcelUpload}
        onClose={() => setShowExcelUpload(false)}
        onGuestsUploaded={handleGuestsUploaded}
      />

      {/* Success Notification */}
      <SuccessNotification
        isVisible={notification.isVisible}
        message={notification.message}
        onClose={() => setNotification({ isVisible: false, message: '' })}
      />

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={uploadingExcel}
        message="Uploading and saving guest invitations to database. This may take a moment..."
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Invitation"
        message={`Are you sure you want to delete the invitation for ${guestToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDeleteGuest}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setGuestToDelete(null);
        }}
      />

      {/* Export Confirmation Modal */}
      <ConfirmationModal
        isOpen={showExportConfirm}
        title="Export Guest List"
        message={`Are you sure you want to export the guest list? This will download a CSV file with ${guests.length} guest invitation(s) including their personal information.`}
        confirmText="Export"
        cancelText="Cancel"
        type="info"
        onConfirm={confirmExportGuestList}
        onCancel={() => setShowExportConfirm(false)}
        isProcessing={isExporting}
      />
    </div>
  );
}