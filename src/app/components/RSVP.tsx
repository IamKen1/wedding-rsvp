"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MotionDiv } from '@/types/motion';
import { GuestInvitation } from '@/data/guests';
import RSVPConfirmationModal from './RSVPConfirmationModal';
import SkeletonLoader from './SkeletonLoader';
import { 
  FaHeart, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUsers, 
  FaComments,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';

interface RSVPFormData {
  name: string;
  email: string;
  phone: string;
  willAttend: string;
  guestCount: number;
  message: string;
}

interface RSVPFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  willAttend?: string;
  guestCount?: string;
  message?: string;
}

export default function RSVP() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get('invitation');
  
  const [guestInfo, setGuestInfo] = useState<GuestInvitation | null>(null);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [existingRSVP, setExistingRSVP] = useState<any | null>(null);
  const [isCheckingRSVP, setIsCheckingRSVP] = useState(false);
  
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    phone: '',
    willAttend: '',
    guestCount: 1,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<RSVPFormErrors>({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Fetch guest information if invitation ID is provided
  useEffect(() => {
    if (invitationId) {
      setIsLoadingGuest(true);
      setIsCheckingRSVP(true);
      
      // Parallel fetch for better performance
      Promise.all([
        fetch(`/api/guest?id=${invitationId}`),
        fetch(`/api/rsvp/check?invitationCode=${invitationId}`)
      ])
        .then(async ([guestResponse, rsvpResponse]) => {
          const [guestData, rsvpData] = await Promise.all([
            guestResponse.json(),
            rsvpResponse.json()
          ]);

          if (guestData.guest) {
            setGuestInfo(guestData.guest);
            // Pre-fill form with guest information only if no existing RSVP
            if (!rsvpData.hasRSVP) {
              setFormData(prev => ({
                ...prev,
                name: guestData.guest.name,
                email: guestData.guest.email || '',
                guestCount: Math.min(1, guestData.guest.allocatedSeats)
              }));
            }
            setGuestError(null);
          } else {
            setGuestError(guestData.error || 'Invalid invitation');
          }
          
          if (rsvpData.hasRSVP) {
            setExistingRSVP(rsvpData.rsvp);
          }
        })
        .catch(error => {
          console.error('Error fetching guest info:', error);
          setGuestError('Failed to load invitation details');
        })
        .finally(() => {
          setIsLoadingGuest(false);
          setIsCheckingRSVP(false);
        });
    }
  }, [invitationId]);

  const validateForm = () => {
    const newErrors: RSVPFormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.willAttend) newErrors.willAttend = 'Please let us know if you will attend';
    
    if (formData.willAttend === 'yes') {
      if (formData.guestCount < 1) {
        newErrors.guestCount = 'Please specify number of guests';
      } else if (guestInfo && formData.guestCount > guestInfo.allocatedSeats) {
        newErrors.guestCount = `You have ${guestInfo.allocatedSeats} seat${guestInfo.allocatedSeats > 1 ? 's' : ''} allocated`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Show confirmation modal instead of browser confirm
    setShowConfirmationModal(true);
  };

  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);
    setShowConfirmationModal(false);

    try {
      // Transform form data to match backend expectations
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        willAttend: formData.willAttend,
        numberOfGuests: formData.guestCount,
        message: formData.message,
        invitationId: invitationId || undefined
      };

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit RSVP');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      // Show error in a modal instead of alert
      setShowConfirmationModal(false);
      // TODO: Create error modal component
      alert(`There was an error submitting your RSVP: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RSVPFormData, value: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'guestCount' ? Number(value) : value 
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-soft from-sage-50 via-mint-50 to-blush-50 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-warm from-mint-100/30 via-transparent to-blush-100/30" />
        </div>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-[800px] mx-auto px-6 text-center relative z-10"
        >
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-mint-200/50">
            <div className="w-16 h-16 bg-gradient-to-br from-mint-400 to-blush-400 rounded-full 
              flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
            
            <h3 className="text-3xl font-serif text-forest-700 mb-4 font-semibold tracking-wide">
              Thank You!
            </h3>
            
            <p className="text-base text-forest-700 leading-relaxed mb-6 font-sans">
              Your RSVP has been received! We're so excited to celebrate with you on our special day.
              We'll be in touch with more details as the date approaches.
            </p>

            <div className="flex justify-center gap-2">
              <FaHeart className="text-blush-400 text-lg animate-pulse" />
              <FaHeart className="text-mint-400 text-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              <FaHeart className="text-sage-400 text-lg animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </MotionDiv>
      </section>
    );
  }

  // Show existing RSVP if user has already submitted
  if (existingRSVP) {
    return (
      <section className="py-16 bg-gradient-soft from-sage-50 via-mint-50 to-blush-50 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-warm from-mint-100/30 via-transparent to-blush-100/30" />
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[800px] mx-auto px-6 text-center relative z-10"
        >
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-mint-200/50">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full 
              flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
            
            <h3 className="text-3xl font-serif text-forest-700 mb-4 font-semibold tracking-wide">
              RSVP Already Submitted
            </h3>
            
            <p className="text-base text-forest-700 leading-relaxed mb-6 font-sans">
              Thank you! You have already submitted your RSVP for our wedding. Here are the details you provided:
            </p>

            <div className="bg-sage-50 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
              <div className="space-y-3 font-sans">
                <div className="flex justify-between">
                  <span className="font-medium text-forest-600">Name:</span>
                  <span className="text-forest-800">{existingRSVP.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-forest-600">Attendance:</span>
                  <span className={`font-medium ${existingRSVP.willAttend === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                    {existingRSVP.willAttend === 'yes' ? 'Will Attend' : 'Cannot Attend'}
                  </span>
                </div>
                {existingRSVP.willAttend === 'yes' && (
                  <div className="flex justify-between">
                    <span className="font-medium text-forest-600">Number of Guests:</span>
                    <span className="text-forest-800">{existingRSVP.numberOfGuests}</span>
                  </div>
                )}
                {existingRSVP.email && (
                  <div className="flex justify-between">
                    <span className="font-medium text-forest-600">Email:</span>
                    <span className="text-forest-800 text-sm">{existingRSVP.email}</span>
                  </div>
                )}
                {existingRSVP.phone && (
                  <div className="flex justify-between">
                    <span className="font-medium text-forest-600">Phone:</span>
                    <span className="text-forest-800">{existingRSVP.phone}</span>
                  </div>
                )}
                {existingRSVP.message && (
                  <div className="pt-2 border-t border-sage-200">
                    <span className="font-medium text-forest-600">Message:</span>
                    <p className="text-forest-800 text-sm mt-1">{existingRSVP.message}</p>
                  </div>
                )}
                <div className="text-xs text-gray-500 pt-2 border-t border-sage-200">
                  Submitted: {new Date(existingRSVP.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <p className="text-sm text-forest-600 leading-relaxed font-sans">
              If you need to make changes to your RSVP, please contact us directly. We're so excited to celebrate with you!
            </p>

            <div className="flex justify-center gap-2 mt-6">
              <FaHeart className="text-blush-400 text-lg animate-pulse" />
              <FaHeart className="text-mint-400 text-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              <FaHeart className="text-sage-400 text-lg animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </MotionDiv>
      </section>
    );
  }

  // Show loading state while checking guest info and existing RSVP
  if (isLoadingGuest || isCheckingRSVP) {
    return (
      <section className="py-16 bg-gradient-soft from-sage-50 via-mint-50 to-blush-50 relative">
        <div className="max-w-[800px] mx-auto px-6 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-mint-200/50">
            <SkeletonLoader type="form" count={1} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-soft from-sage-50 via-mint-50 to-blush-50 relative overflow-hidden">
      {/* Reduced background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-warm from-mint-100/20 via-transparent to-blush-100/20" />
        
        {/* Smaller floating elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-mint-200/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-blush-200/25 rounded-full blur-lg animate-float" 
             style={{ animationDelay: '2s' }} />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[1000px] mx-auto px-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-16">
          {isLoadingGuest && invitationId ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-3xl text-mint-500 mb-4" />
              <p className="text-forest-600">Loading your invitation details...</p>
            </div>
          ) : guestError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <p className="text-red-600 font-medium">⚠️ {guestError}</p>
              <p className="text-red-500 text-sm mt-2">
                Please check your invitation link or contact us for assistance.
              </p>
            </div>
          ) : guestInfo ? (
            <div className="bg-mint-50 border border-mint-200 rounded-xl p-6 mb-8">
              <h3 className="text-3xl md:text-4xl font-display text-forest-700 mb-4 font-light tracking-wide">
                Hello, {guestInfo.name}! 💕
              </h3>
              <p className="text-lg text-forest-600 mb-2 font-serif">
                We're so excited to celebrate with you!
              </p>
              <p className="text-mint-600 font-medium font-sans">
                Your invitation includes {guestInfo.allocatedSeats} seat{guestInfo.allocatedSeats > 1 ? 's' : ''}
                {guestInfo.notes && (
                  <span className="text-forest-500 font-normal"> • {guestInfo.notes}</span>
                )}
              </p>
            </div>
          ) : null}
          
          {!isLoadingGuest && (
            <>
              <h3 className="text-4xl md:text-5xl font-display text-forest-700 mb-6 font-light tracking-wide">
                {guestInfo ? 'Please Confirm Your Attendance' : 'Will You Join Us?'}
              </h3>
              <p className="text-lg md:text-xl text-forest-600 max-w-2xl mx-auto leading-relaxed font-sans">
                We would be honored to have you celebrate with us on our special day. 
                Please let us know if you'll be able to attend!
              </p>
            </>
          )}
        </div>

        {/* Form */}
        {!isLoadingGuest && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-mint-200/50 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-forest-800 font-semibold mb-2 font-sans">
                  <FaUser className="inline mr-2 text-mint-500" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 font-sans
                    ${errors.name 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-mint-200 focus:border-mint-400 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-mint-200`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1 font-sans">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-forest-800 font-semibold mb-2 font-sans">
                  <FaEnvelope className="inline mr-2 text-mint-500" />
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 font-sans
                    ${errors.email 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-mint-200 focus:border-mint-400 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-mint-200`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1 font-sans">{errors.email}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-forest-800 font-semibold mb-2 font-sans">
                <FaPhone className="inline mr-2 text-mint-500" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-mint-200 focus:border-mint-400 
                  bg-white focus:outline-none focus:ring-2 focus:ring-mint-200 transition-all duration-300 font-sans"
                placeholder="Your phone number"
              />
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-forest-800 font-semibold mb-4 font-sans">
                <FaHeart className="inline mr-2 text-blush-400" />
                Will you be able to attend? *
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('willAttend', 'yes')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer font-sans
                    ${formData.willAttend === 'yes'
                      ? 'border-mint-400 bg-mint-50 text-mint-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-mint-200'
                    }`}
                >
                  <FaCheckCircle className="mx-auto text-2xl mb-2" />
                  <div className="font-semibold">Yes, I'll be there!</div>
                  <div className="text-sm opacity-75">Can't wait to celebrate</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('willAttend', 'no')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer font-sans
                    ${formData.willAttend === 'no'
                      ? 'border-blush-400 bg-blush-50 text-blush-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blush-200'
                    }`}
                >
                  <FaHeart className="mx-auto text-2xl mb-2" />
                  <div className="font-semibold">Sorry, can't make it</div>
                  <div className="text-sm opacity-75">Will be there in spirit</div>
                </button>
              </div>
              {errors.willAttend && <p className="text-red-600 text-sm mt-2 font-sans">{errors.willAttend}</p>}
            </div>

            {/* Guest Count - only show if attending */}
            {formData.willAttend === 'yes' && (
              <div>
                <label className="block text-forest-800 font-semibold mb-2 font-sans">
                  <FaUsers className="inline mr-2 text-mint-500" />
                  Number of Guests (Including Yourself) *
                  {guestInfo && (
                    <span className="text-sm text-mint-700 font-medium ml-2">
                      (You have {guestInfo.allocatedSeats} seat{guestInfo.allocatedSeats > 1 ? 's' : ''} allocated)
                    </span>
                  )}
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-mint-200 focus:border-mint-400 
                    bg-white focus:outline-none focus:ring-2 focus:ring-mint-200 transition-all duration-300 cursor-pointer font-sans"
                >
                  {Array.from({ length: guestInfo?.allocatedSeats || 6 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.guestCount && <p className="text-red-600 text-sm mt-1 font-sans">{errors.guestCount}</p>}
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-forest-800 font-semibold mb-2 font-sans">
                <FaComments className="inline mr-2 text-mint-500" />
                Message for the Couple (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-mint-200 focus:border-mint-400 
                  bg-white focus:outline-none focus:ring-2 focus:ring-mint-200 transition-all duration-300 font-sans"
                rows={4}
                placeholder="Share your love, wishes, or any special message for Kenneth & Jenna..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-mint-500 to-sage-500 text-white px-12 py-4 
                  rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl 
                  transform hover:scale-105 transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer
                  focus:outline-none focus:ring-4 focus:ring-mint-200 font-sans"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin inline mr-2" />
                    Sending RSVP...
                  </>
                ) : (
                  <>
                    <FaHeart className="inline mr-2" />
                    Send RSVP
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        )}
      </MotionDiv>

      {/* Confirmation Modal */}
      <RSVPConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmSubmission}
        formData={formData}
      />
    </section>
  );
}

