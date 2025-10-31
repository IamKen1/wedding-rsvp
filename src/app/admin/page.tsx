"use client";

import { useState, useEffect } from 'react';
import InvitationManager from '../components/InvitationManager';
import WeddingDetailsManager from '../components/WeddingDetailsManager';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessNotification from '../components/SuccessNotification';
import { FaUsers, FaEnvelope, FaCogs, FaCameraRetro } from 'react-icons/fa';
import PrenupPhotoManager from '../components/PrenupPhotoManager';

interface RSVPData {
  id: string;
  name: string;
  willAttend: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  dietaryRequirements?: string;
  songRequest?: string;
  message: string;
  invitationId?: string;
  createdAt: string;
}

enum TabType {
  INVITATIONS = 'invitations',
  RSVPS = 'rsvps',
  WEDDING_DETAILS = 'wedding-details',
  PRENUP_PHOTOS = 'prenup-photos'
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.INVITATIONS);
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  const [notification, setNotification] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        setLoading(true);
        // Fetch RSVPs from API instead of using sample data
        const response = await fetch('/api/admin/rsvps');
        if (response.ok) {
          const data = await response.json();
          setRsvps(data);
        } else {
          console.error('Failed to fetch RSVPs');
          setRsvps([]);
        }
      } catch (error) {
        console.error('Error fetching RSVPs:', error);
        setRsvps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRSVPs();
  }, []);

  const handleDownload = async () => {
    setShowDownloadConfirm(true);
  };

  const confirmDownload = async () => {
    setShowDownloadConfirm(false);
    setDownloadingExcel(true);
    try {
      const response = await fetch('/api/admin/download');
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setNotification({
        isVisible: true,
        message: 'Excel file downloaded successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Download failed:', error);
      setNotification({
        isVisible: true,
        message: 'Failed to download Excel file. Please try again.',
        type: 'error'
      });
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleClearRSVPs = () => {
    setShowClearConfirm(true);
  };

  const confirmClearRSVPs = async () => {
    setShowClearConfirm(false);
    setClearingData(true);
    try {
      const response = await fetch('/api/admin/rsvps', {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Clear operation failed');
      }
      
      // Refresh the RSVP list
      setRsvps([]);
      setNotification({
        isVisible: true,
        message: 'All RSVP data has been cleared successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Clear failed:', error);
      setNotification({
        isVisible: true,
        message: 'Failed to clear RSVP data. Please try again.',
        type: 'error'
      });
    } finally {
      setClearingData(false);
    }
  };

  const attendingCount = rsvps.filter(rsvp => rsvp.willAttend === 'yes').length;
  const totalGuests = rsvps.filter(rsvp => rsvp.willAttend === 'yes').reduce((sum, rsvp) => sum + rsvp.numberOfGuests, 0);
  const notAttendingCount = rsvps.filter(rsvp => rsvp.willAttend === 'no').length;

  const isInvitationsTab = activeTab === TabType.INVITATIONS;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg font-sans text-gray-600">Loading RSVPs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Header with Tabs */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-900 mb-4">Wedding Admin Dashboard</h1>
          
          {/* Tab Navigation - Mobile Responsive */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
              <button
                onClick={() => setActiveTab(TabType.INVITATIONS)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-semibold text-sm sm:text-base font-sans cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  isInvitationsTab
                    ? 'border-mint-500 text-mint-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <FaUsers className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Manage </span>Invitations
              </button>
              <button
                onClick={() => setActiveTab(TabType.RSVPS)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-semibold text-sm sm:text-base font-sans cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  activeTab === TabType.RSVPS
                    ? 'border-mint-500 text-mint-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <FaEnvelope className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">View </span>RSVPs ({rsvps.length})
              </button>
              <button
                onClick={() => setActiveTab(TabType.WEDDING_DETAILS)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-semibold text-sm sm:text-base font-sans cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  activeTab === TabType.WEDDING_DETAILS
                    ? 'border-mint-500 text-mint-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <FaCogs className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Wedding </span>Details
              </button>
              <button
                onClick={() => setActiveTab(TabType.PRENUP_PHOTOS)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-semibold text-sm sm:text-base font-sans cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  activeTab === TabType.PRENUP_PHOTOS
                    ? 'border-mint-500 text-mint-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <FaCameraRetro className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Prenup </span>Photos
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === TabType.INVITATIONS ? (
          <InvitationManager />
        ) : activeTab === TabType.RSVPS ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold font-sans text-green-600">{attendingCount}</div>
                <div className="text-base font-sans text-gray-600">Attending Parties</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold font-sans text-blue-600">{totalGuests}</div>
                <div className="text-base font-sans text-gray-600">Total Guests</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold font-sans text-red-600">{notAttendingCount}</div>
                <div className="text-base font-sans text-gray-600">Not Attending</div>
              </div>
            </div>

        {/* Action Buttons */}
        <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-3">
          <button
            onClick={handleDownload}
            disabled={downloadingExcel || clearingData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
                     disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                     transition-all duration-200 flex items-center justify-center gap-2 font-sans text-sm font-medium"
          >
            {downloadingExcel ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Excel...</span>
              </>
            ) : (
              <>
                <span>📊 Download Excel Report</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleClearRSVPs}
            disabled={downloadingExcel || clearingData || rsvps.length === 0}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 
                     disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                     transition-all duration-200 flex items-center justify-center gap-2 font-sans text-sm font-medium"
          >
            {clearingData ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Clearing Data...</span>
              </>
            ) : (
              <>
                <span>🗑️ Clear All RSVP Data</span>
              </>
            )}
          </button>
        </div>

        {/* RSVPs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold font-sans text-gray-900">All RSVPs ({rsvps.length})</h2>
          </div>

          {rsvps.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-6xl mb-4">💌</div>
              <div className="text-xl font-sans mb-2">No RSVPs yet</div>
              <div className="font-sans">RSVPs will appear here once guests start responding</div>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on Mobile */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                        Invitation ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                        Attendance
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium font-sans text-base text-gray-900">{rsvp.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {rsvp.invitationId || 'N/A'}
                          </code>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-sm font-semibold font-sans rounded-full ${
                            rsvp.willAttend === 'yes' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {rsvp.willAttend === 'yes' ? 'Attending' : 'Not Attending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-base font-sans text-gray-900">
                          {rsvp.numberOfGuests}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-sans text-gray-900">{rsvp.email}</div>
                          {rsvp.phone && <div className="text-sm font-sans text-gray-600">{rsvp.phone}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
                            {rsvp.dietaryRequirements && (
                              <div className="text-sm font-sans text-gray-900 mb-1">
                                <strong>Dietary:</strong> {rsvp.dietaryRequirements}
                              </div>
                            )}
                            {rsvp.songRequest && (
                              <div className="text-sm font-sans text-gray-900 mb-1">
                                <strong>Song:</strong> {rsvp.songRequest}
                              </div>
                            )}
                            {rsvp.message && (
                              <div className="text-sm font-sans text-gray-600">
                                <strong>Message:</strong> {rsvp.message}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-sans text-gray-600">
                          {new Date(rsvp.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Visible on Mobile Only */}
              <div className="md:hidden divide-y divide-gray-200">
                {rsvps.map((rsvp) => (
                  <div key={rsvp.id} className="p-4 hover:bg-gray-50">
                    {/* Name and Status */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-medium font-sans text-base text-gray-900">{rsvp.name}</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold font-sans rounded-full ${
                        rsvp.willAttend === 'yes' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rsvp.willAttend === 'yes' ? 'Attending' : 'Not Attending'}
                      </span>
                    </div>

                    {/* Invitation ID */}
                    {rsvp.invitationId && (
                      <div className="mb-2">
                        <span className="text-xs font-sans text-gray-500">Invitation ID: </span>
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {rsvp.invitationId}
                        </code>
                      </div>
                    )}

                    {/* Guests Count */}
                    <div className="mb-2">
                      <span className="text-xs font-sans text-gray-500">Guests: </span>
                      <span className="text-sm font-sans text-gray-900">{rsvp.numberOfGuests}</span>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-2">
                      <div className="text-sm font-sans text-gray-900">{rsvp.email}</div>
                      {rsvp.phone && <div className="text-sm font-sans text-gray-600">{rsvp.phone}</div>}
                    </div>

                    {/* Additional Info */}
                    {(rsvp.dietaryRequirements || rsvp.songRequest || rsvp.message) && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {rsvp.dietaryRequirements && (
                          <div className="text-sm font-sans text-gray-900 mb-1">
                            <strong>Dietary:</strong> {rsvp.dietaryRequirements}
                          </div>
                        )}
                        {rsvp.songRequest && (
                          <div className="text-sm font-sans text-gray-900 mb-1">
                            <strong>Song:</strong> {rsvp.songRequest}
                          </div>
                        )}
                        {rsvp.message && (
                          <div className="text-sm font-sans text-gray-600">
                            <strong>Message:</strong> {rsvp.message}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Date */}
                    <div className="mt-2 text-xs font-sans text-gray-500">
                      {new Date(rsvp.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
          </>
        ) : activeTab === TabType.WEDDING_DETAILS ? (
          /* Wedding Details Tab Content */
          <WeddingDetailsManager />
        ) : (
          /* Prenup Photos Tab Content */
          <PrenupPhotoManager />
        )}
      </div>

      {/* Download Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDownloadConfirm}
        title="Download RSVP Data"
        message="Are you sure you want to download the RSVP data as an Excel file? This will include all guest responses and personal information."
        confirmText="Download"
        cancelText="Cancel"
        type="info"
        onConfirm={confirmDownload}
        onCancel={() => setShowDownloadConfirm(false)}
        isProcessing={downloadingExcel}
      />

      {/* Clear RSVPs Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirm}
        title="Clear All RSVP Data"
        message="Are you sure you want to permanently delete ALL RSVP responses? This action cannot be undone and will remove all guest responses from the database."
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmClearRSVPs}
        onCancel={() => setShowClearConfirm(false)}
        isProcessing={clearingData}
      />

      {/* Success/Error Notification */}
      <SuccessNotification
        isVisible={notification.isVisible}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </div>
  );
}