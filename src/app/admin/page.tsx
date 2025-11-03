"use client";

import { useState, useEffect } from 'react';
import InvitationManager from '../components/InvitationManager';
import WeddingDetailsManager from '../components/WeddingDetailsManager';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessNotification from '../components/SuccessNotification';
import { FaUsers, FaEnvelope, FaCogs, FaCameraRetro, FaExclamationCircle, FaCheckCircle, FaClock, FaSearch, FaTimes } from 'react-icons/fa';
import PrenupPhotoManager from '../components/PrenupPhotoManager';
import { GuestInvitation } from '@/data/rsvp';

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
  PENDING = 'pending',
  WEDDING_DETAILS = 'wedding-details',
  PRENUP_PHOTOS = 'prenup-photos'
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.INVITATIONS);
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [guests, setGuests] = useState<GuestInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both RSVPs and guest invitations
        const [rsvpsResponse, guestsResponse] = await Promise.all([
          fetch('/api/admin/rsvps'),
          fetch('/api/admin/guests')
        ]);
        
        if (rsvpsResponse.ok) {
          const rsvpsData = await rsvpsResponse.json();
          setRsvps(rsvpsData);
        } else {
          console.error('Failed to fetch RSVPs');
          setRsvps([]);
        }
        
        if (guestsResponse.ok) {
          const guestsData = await guestsResponse.json();
          setGuests(guestsData);
        } else {
          console.error('Failed to fetch guests');
          setGuests([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRsvps([]);
        setGuests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Calculate pending RSVPs (guests who haven't responded yet)
  const rsvpInvitationCodes = new Set(rsvps.map(rsvp => rsvp.invitationId));
  const pendingGuests = guests.filter(guest => !rsvpInvitationCodes.has(guest.invitationCode));
  const pendingCount = pendingGuests.length;

  // Filter RSVPs based on search query and sort by name
  const filteredRsvps = rsvps
    .filter(rsvp => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        rsvp.name.toLowerCase().includes(query) ||
        rsvp.email.toLowerCase().includes(query) ||
        (rsvp.phone && rsvp.phone.toLowerCase().includes(query)) ||
        (rsvp.invitationId && rsvp.invitationId.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  // Filter pending guests based on search query and sort by name
  const filteredPendingGuests = pendingGuests
    .filter(guest => {
      if (!pendingSearchQuery.trim()) return true;
      const query = pendingSearchQuery.toLowerCase();
      return (
        guest.name.toLowerCase().includes(query) ||
        (guest.email && guest.email.toLowerCase().includes(query)) ||
        guest.invitationCode.toLowerCase().includes(query) ||
        (guest.notes && guest.notes.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

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
                <FaCheckCircle className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Confirmed </span>RSVPs ({rsvps.length})
              </button>
              <button
                onClick={() => setActiveTab(TabType.PENDING)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-semibold text-sm sm:text-base font-sans cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  activeTab === TabType.PENDING
                    ? 'border-mint-500 text-mint-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <FaClock className="inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Pending </span>({pendingCount})
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-600 text-lg" />
                  <div className="text-2xl font-bold font-sans text-green-600">{attendingCount}</div>
                </div>
                <div className="text-base font-sans text-gray-600">Attending Parties</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-blue-600 text-lg" />
                  <div className="text-2xl font-bold font-sans text-blue-600">{totalGuests}</div>
                </div>
                <div className="text-base font-sans text-gray-600">Total Guests</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaExclamationCircle className="text-red-600 text-lg" />
                  <div className="text-2xl font-bold font-sans text-red-600">{notAttendingCount}</div>
                </div>
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

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or invitation code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg font-sans text-sm focus:ring-2 focus:ring-mint-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* RSVPs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold font-sans text-gray-900">
              All RSVPs ({filteredRsvps.length}{searchQuery && ` of ${rsvps.length}`})
            </h2>
          </div>

          {filteredRsvps.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-6xl mb-4">{searchQuery ? '�' : '�💌'}</div>
              <div className="text-xl font-sans mb-2">
                {searchQuery ? 'No matching RSVPs found' : 'No RSVPs yet'}
              </div>
              <div className="font-sans">
                {searchQuery ? 'Try adjusting your search terms' : 'RSVPs will appear here once guests start responding'}
              </div>
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
                    {filteredRsvps.map((rsvp) => (
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
                {filteredRsvps.map((rsvp) => (
                  <div key={rsvp.id} className="p-4 hover:bg-gray-50 transition-colors">
                    {/* Header: Name and Status Badge */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="font-semibold font-sans text-base text-gray-900 flex-1">
                        {rsvp.name}
                      </h3>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold font-sans rounded-full whitespace-nowrap ${
                        rsvp.willAttend === 'yes' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rsvp.willAttend === 'yes' ? '✓ Attending' : '✗ Declined'}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-2 mb-3">
                      {/* Invitation ID */}
                      {rsvp.invitationId && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-sans text-gray-500 min-w-[80px]">Invitation:</span>
                          <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded flex-1">
                            {rsvp.invitationId}
                          </code>
                        </div>
                      )}

                      {/* Guests Count with Icon */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-sans text-gray-500 min-w-[80px]">Guests:</span>
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                          <FaUsers className="text-blue-600 text-xs" />
                          <span className="text-sm font-semibold font-sans text-blue-700">
                            {rsvp.numberOfGuests}
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-sans text-gray-500 min-w-[80px]">Submitted:</span>
                        <span className="text-sm font-sans text-gray-700">
                          {new Date(rsvp.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="text-xs font-sans font-semibold text-gray-600 mb-2">Contact Info</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-xs" />
                          <span className="text-sm font-sans text-gray-900 break-all">{rsvp.email}</span>
                        </div>
                        {rsvp.phone && (
                          <div className="text-sm font-sans text-gray-700">📞 {rsvp.phone}</div>
                        )}
                      </div>
                    </div>

                    {/* Additional Info - Only show if exists */}
                    {(rsvp.dietaryRequirements || rsvp.songRequest || rsvp.message) && (
                      <div className="bg-mint-50 rounded-lg p-3 space-y-2">
                        <div className="text-xs font-sans font-semibold text-forest-700 mb-2">Additional Details</div>
                        {rsvp.dietaryRequirements && (
                          <div className="text-sm font-sans">
                            <span className="font-semibold text-gray-700">🍽️ Dietary:</span>
                            <span className="text-gray-900 ml-1">{rsvp.dietaryRequirements}</span>
                          </div>
                        )}
                        {rsvp.songRequest && (
                          <div className="text-sm font-sans">
                            <span className="font-semibold text-gray-700">🎵 Song:</span>
                            <span className="text-gray-900 ml-1">{rsvp.songRequest}</span>
                          </div>
                        )}
                        {rsvp.message && (
                          <div className="text-sm font-sans">
                            <span className="font-semibold text-gray-700">💬 Message:</span>
                            <p className="text-gray-900 mt-1 italic">{rsvp.message}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
          </>
        ) : activeTab === TabType.PENDING ? (
          <>
            {/* Pending RSVPs Info Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <FaClock className="text-amber-600 text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold font-sans text-gray-900 mb-1">
                    Guests with Generated Invitations
                  </h3>
                  <p className="text-sm font-sans text-gray-700">
                    This list shows all guests who have invitation codes but haven't responded yet. 
                    Note: An invitation code doesn't mean the invitation was sent—these guests may or may not have received their invitations.
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Count Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-3 rounded-full">
                  <FaClock className="text-amber-600 text-2xl" />
                </div>
                <div>
                  <div className="text-3xl font-bold font-sans text-amber-600">{pendingCount}</div>
                  <div className="text-base font-sans text-gray-600">Guests Without Response</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, invitation code, or notes..."
                  value={pendingSearchQuery}
                  onChange={(e) => setPendingSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg font-sans text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                {pendingSearchQuery && (
                  <button
                    onClick={() => setPendingSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Pending Guests Table/List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold font-sans text-gray-900">
                  Guests Without RSVP Response ({filteredPendingGuests.length}{pendingSearchQuery && ` of ${pendingCount}`})
                </h2>
              </div>

              {filteredPendingGuests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-6xl mb-4">{pendingSearchQuery ? '🔍' : '🎉'}</div>
                  <div className="text-xl font-sans mb-2">
                    {pendingSearchQuery ? 'No matching guests found' : 'All guests have responded!'}
                  </div>
                  <div className="font-sans">
                    {pendingSearchQuery ? 'Try adjusting your search terms' : 'Every invited guest has submitted their RSVP'}
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                            Guest Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                            Invitation Code
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                            Allocated Seats
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium font-sans text-gray-700 uppercase tracking-wider">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPendingGuests.map((guest) => (
                          <tr key={guest.invitationCode} className="hover:bg-amber-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-medium font-sans text-base text-gray-900">{guest.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <code className="text-xs font-mono bg-amber-100 px-2 py-1 rounded">
                                {guest.invitationCode}
                              </code>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-sans text-gray-900">
                                {guest.email || <span className="text-gray-400 italic">No email</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <FaUsers className="text-gray-400 text-xs" />
                                <span className="text-sm font-sans text-gray-900">{guest.allocatedSeats}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-sans text-gray-600">
                                {guest.notes || <span className="text-gray-400 italic">No notes</span>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-gray-200">
                    {filteredPendingGuests.map((guest) => (
                      <div key={guest.invitationCode} className="p-4 hover:bg-amber-50 transition-colors">
                        {/* Header */}
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="font-semibold font-sans text-base text-gray-900 flex-1">
                            {guest.name}
                          </h3>
                          <span className="inline-flex px-3 py-1 text-xs font-semibold font-sans rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">
                            ⏱️ No Response
                          </span>
                        </div>

                        {/* Info Grid */}
                        <div className="space-y-2 mb-3">
                          {/* Invitation Code */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-sans text-gray-500 min-w-[80px]">Invitation:</span>
                            <code className="text-xs font-mono bg-amber-100 px-2 py-1 rounded flex-1">
                              {guest.invitationCode}
                            </code>
                          </div>

                          {/* Allocated Seats */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-sans text-gray-500 min-w-[80px]">Seats:</span>
                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                              <FaUsers className="text-gray-500 text-xs" />
                              <span className="text-sm font-semibold font-sans text-gray-700">
                                {guest.allocatedSeats}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        {guest.email && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-gray-400 text-xs" />
                              <span className="text-sm font-sans text-gray-900 break-all">{guest.email}</span>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {guest.notes && (
                          <div className="text-sm font-sans text-gray-600">
                            <span className="font-semibold text-gray-700">📝 Notes:</span>
                            <span className="ml-1">{guest.notes}</span>
                          </div>
                        )}
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
        ) : activeTab === TabType.PRENUP_PHOTOS ? (
          /* Prenup Photos Tab Content */
          <PrenupPhotoManager />
        ) : null}
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