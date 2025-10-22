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
  FaSpinner,
  FaClock,
  FaTimesCircle
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

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPastDeadline, setIsPastDeadline] = useState(false);

  // RSVP deadline: December 24, 2025 at 23:59:59
  const deadline = new Date('2025-12-24T23:59:59');

  // Countdown timer effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();

      if (difference <= 0) {
        setIsPastDeadline(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

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
      <section id="rsvp" className="py-16 bg-gradient-to-br from-[#F5EEE6] via-[#E6D5BE] to-[#F5EEE6] relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-warm from-[#E6D5BE]/30 via-transparent to-[#C9A87C]/20" />
        </div>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-[700px] mx-auto px-6 text-center relative z-10"
        >
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-[#C9A87C]/50">
            <div className="w-14 h-14 bg-gradient-to-br from-[#C9A87C] to-[#8B6F47] rounded-full 
              flex items-center justify-center mx-auto mb-5">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            
            <h3 className="text-2xl font-great-vibes text-[#4A3C2E] mb-3 font-semibold tracking-tight">
              Thank You!
            </h3>
            
            <p className="text-sm text-[#6B5D4F] leading-relaxed mb-5 font-sans">
              Your RSVP has been received! We're so excited to celebrate with you on our special day.
              We'll be in touch with more details as the date approaches.
            </p>

            <div className="flex justify-center gap-2 mb-5">
              <FaHeart className="text-[#C9A87C] text-base animate-pulse" />
              <FaHeart className="text-[#8B6F47] text-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
              <FaHeart className="text-[#C9A87C] text-base animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Wedding Hashtag */}
            <div className="pt-4 border-t border-[#C9A87C]/30">
              <p className="text-base font-serif text-[#8B6F47] tracking-wider">
                Share your photos with #TheJenuineKennection
              </p>
            </div>
          </div>
        </MotionDiv>
      </section>
    );
  }

  // Show existing RSVP if user has already submitted
  if (existingRSVP) {
    return (
      <section id="rsvp" className="py-16 bg-gradient-to-br from-[#F5EEE6] via-[#E6D5BE] to-[#F5EEE6] relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-warm from-[#E6D5BE]/30 via-transparent to-[#C9A87C]/20" />
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[700px] mx-auto px-6 text-center relative z-10"
        >
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-[#C9A87C]/50">
            <div className="w-14 h-14 bg-gradient-to-br from-[#8B6F47] to-[#C9A87C] rounded-full 
              flex items-center justify-center mx-auto mb-5">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            
            <h3 className="text-2xl font-great-vibes text-[#4A3C2E] mb-3 font-semibold tracking-tight">
              RSVP Already Submitted
            </h3>
            
            <p className="text-sm text-[#6B5D4F] leading-relaxed mb-5 font-sans">
              Thank you! You have already submitted your RSVP for our wedding. Here are the details you provided:
            </p>

            <div className="bg-[#F5EEE6] rounded-xl p-5 mb-5 text-left max-w-md mx-auto border border-[#C9A87C]/30">
              <div className="space-y-2.5 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-[#6B5D4F]">Name:</span>
                  <span className="text-[#4A3C2E]">{existingRSVP.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#6B5D4F]">Attendance:</span>
                  <span className={`font-medium ${existingRSVP.willAttend === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                    {existingRSVP.willAttend === 'yes' ? 'Will Attend' : 'Cannot Attend'}
                  </span>
                </div>
                {existingRSVP.willAttend === 'yes' && (
                  <div className="flex justify-between">
                    <span className="font-medium text-[#6B5D4F]">Number of Guests:</span>
                    <span className="text-[#4A3C2E]">{existingRSVP.numberOfGuests}</span>
                  </div>
                )}
                {existingRSVP.email && (
                  <div className="flex justify-between">
                    <span className="font-medium text-[#6B5D4F]">Email:</span>
                    <span className="text-[#4A3C2E] text-xs">{existingRSVP.email}</span>
                  </div>
                )}
                {existingRSVP.phone && (
                  <div className="flex justify-between">
                    <span className="font-medium text-[#6B5D4F]">Phone:</span>
                    <span className="text-[#4A3C2E]">{existingRSVP.phone}</span>
                  </div>
                )}
                {existingRSVP.message && (
                  <div className="pt-2 border-t border-[#C9A87C]/30">
                    <span className="font-medium text-[#6B5D4F]">Message:</span>
                    <p className="text-[#4A3C2E] text-xs mt-1">{existingRSVP.message}</p>
                  </div>
                )}
                <div className="text-xs text-[#8B6F47] pt-2 border-t border-[#C9A87C]/30">
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

            <p className="text-xs text-[#6B5D4F] leading-relaxed font-sans">
              If you need to make changes to your RSVP, please contact us directly. We're so excited to celebrate with you!
            </p>

            <div className="flex justify-center gap-2 mt-5">
              <FaHeart className="text-[#C9A87C] text-base animate-pulse" />
              <FaHeart className="text-[#8B6F47] text-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
              <FaHeart className="text-[#C9A87C] text-base animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </MotionDiv>
      </section>
    );
  }

  // Show loading state while checking guest info and existing RSVP
  if (isLoadingGuest || isCheckingRSVP) {
    return (
      <section id="rsvp" className="py-16 bg-gradient-to-br from-[#F5EEE6] via-[#E6D5BE] to-[#F5EEE6] relative">
        <div className="max-w-[700px] mx-auto px-6 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-[#C9A87C]/50">
            <SkeletonLoader type="form" count={1} />
          </div>
        </div>
      </section>
    );
  }

  // Show deadline passed message
  if (isPastDeadline) {
    return (
      <section id="rsvp" className="py-16 bg-gradient-to-br from-[#F5EEE6] via-[#E6D5BE] to-[#F5EEE6] relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-warm from-[#E6D5BE]/30 via-transparent to-[#C9A87C]/20" />
        </div>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-[800px] mx-auto px-6 text-center relative z-10"
        >
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-orange-300/50">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full 
              flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="text-white text-2xl" />
            </div>
            
            <h3 className="text-2xl font-great-vibes text-[#4A3C2E] mb-4 font-semibold tracking-tight">
              RSVP Deadline Has Passed
            </h3>
            
            <p className="text-base text-[#6B5D4F] leading-relaxed mb-4 font-sans">
              We're sorry, but the RSVP deadline of <strong>December 24, 2025</strong> has passed.
            </p>

            <p className="text-base text-[#6B5D4F] leading-relaxed mb-6 font-sans">
              All available seats may have been taken. If you would still like to attend, 
              please contact us directly and we'll do our best to accommodate you.
            </p>

            <div className="bg-[#F5EEE6] rounded-xl p-6 mb-6 border border-[#C9A87C]/30">
              <p className="text-[#4A3C2E] font-medium mb-2">Contact Information:</p>
              <p className="text-[#6B5D4F] text-sm">
                Email us or reach out through our wedding hashtag
              </p>
              <p className="text-[#8B6F47] font-semibold mt-3 text-lg">
                #TheJenuineKennection
              </p>
            </div>

            <div className="flex justify-center gap-2">
              <FaHeart className="text-[#C9A87C] text-lg animate-pulse" />
              <FaHeart className="text-[#8B6F47] text-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              <FaHeart className="text-[#C9A87C] text-lg animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </MotionDiv>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-20 bg-gradient-to-br from-[#F5EEE6] via-[#E6D5BE] to-[#F5EEE6] relative overflow-hidden">
      {/* Enhanced Hero-style background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#E6D5BE]/40 via-transparent to-[#C9A87C]/20" />
        
        {/* More prominent floating elements with warm tones */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-[#C9A87C]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-10 w-36 h-36 bg-[#D4B896]/25 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/4 w-44 h-44 bg-[#E6D5BE]/25 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-[#C9A87C]/20 rounded-full blur-3xl animate-float" 
             style={{ animationDelay: '1s' }} />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[1000px] mx-auto px-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          {isLoadingGuest && invitationId ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-2xl text-[#8B6F47] mb-4" />
              <p className="text-[#6B5D4F] text-sm">Loading your invitation details...</p>
            </div>
          ) : guestError ? (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 mb-6">
              <p className="text-red-600 font-medium text-sm">⚠️ {guestError}</p>
              <p className="text-red-500 text-xs mt-2">
                Please check your invitation link or contact us for assistance.
              </p>
            </div>
          ) : guestInfo ? (
            <div className="bg-[#F5EEE6] border-2 border-[#C9A87C]/40 rounded-xl p-6 mb-6">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-great-vibes text-[#4A3C2E] mb-4 font-medium tracking-tight">
                Hello, {guestInfo.name}! 💕
              </h3>
              <p className="text-lg md:text-xl text-[#6B5D4F] mb-3 font-serif">
                We're so excited to celebrate with you!
              </p>
              <p className="text-[#8B6F47] font-semibold font-sans text-base md:text-lg">
                Your invitation includes {guestInfo.allocatedSeats} seat{guestInfo.allocatedSeats > 1 ? 's' : ''}
                {guestInfo.notes && (
                  <span className="text-[#6B5D4F] font-normal"> • {guestInfo.notes}</span>
                )}
              </p>
            </div>
          ) : null}
          
          {!isLoadingGuest && (
            <>
              <h3 className="text-3xl md:text-4xl font-great-vibes text-[#4A3C2E] mb-4 font-semibold tracking-tight">
                {guestInfo ? 'Confirm Your Attendance' : 'Will You Celebrate With Us?'}
              </h3>
              <p className="text-base md:text-lg text-[#6B5D4F] max-w-2xl mx-auto leading-relaxed font-serif mb-4">
                We would be honored to have you celebrate with us on our special day
              </p>
              
              {/* Countdown Timer */}
              <div className="bg-gradient-to-r from-[#F5EEE6] via-[#E6D5BE] to-[#F5EEE6] rounded-2xl p-4 md:p-6 mb-6 max-w-2xl mx-auto border-2 border-[#C9A87C]/50 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FaClock className="text-[#8B6F47] text-lg md:text-xl" />
                  <p className="text-sm md:text-base text-[#4A3C2E] font-semibold font-sans">
                    RSVP Deadline: December 24, 2025
                  </p>
                </div>
                
                <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-md mx-auto">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center border-2 border-[#C9A87C]/30 shadow-md">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#8B6F47] font-sans">
                      {timeLeft.days}
                    </div>
                    <div className="text-[10px] md:text-xs text-[#6B5D4F] font-sans mt-1">Days</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center border-2 border-[#C9A87C]/30 shadow-md">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#8B6F47] font-sans">
                      {timeLeft.hours}
                    </div>
                    <div className="text-[10px] md:text-xs text-[#6B5D4F] font-sans mt-1">Hours</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center border-2 border-[#C9A87C]/30 shadow-md">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#8B6F47] font-sans">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-[10px] md:text-xs text-[#6B5D4F] font-sans mt-1">Minutes</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center border-2 border-[#C9A87C]/30 shadow-md">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#8B6F47] font-sans">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-[10px] md:text-xs text-[#6B5D4F] font-sans mt-1">Seconds</div>
                  </div>
                </div>
                
                <p className="text-[10px] md:text-xs text-[#6B5D4F] mt-3 font-sans text-center">
                  Please submit your RSVP before the deadline to secure your seat!
                </p>
              </div>
              
              {/* Wedding Hashtag */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A87C]"></div>
                <p className="text-xl md:text-2xl font-serif text-[#8B6F47] tracking-wider">
                  #TheJenuineKennection
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A87C]"></div>
              </div>
            </>
          )}
        </div>

        {/* Form - Enhanced prominence */}
        {!isLoadingGuest && (
          <div className="bg-white/98 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#C9A87C]/60 p-8 md:p-10 relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E6D5BE]/40 to-transparent rounded-bl-[80px]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#C9A87C]/30 to-transparent rounded-tr-[80px]" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Basic Info Row */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-[#4A3C2E] font-semibold mb-2 font-sans text-sm">
                  <FaUser className="inline mr-2 text-[#8B6F47] text-xs" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 font-sans text-sm
                    ${errors.name 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-[#C9A87C]/40 focus:border-[#8B6F47] bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-[#C9A87C]/30`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-600 text-xs mt-1 font-sans">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#4A3C2E] font-semibold mb-2 font-sans text-sm">
                  <FaEnvelope className="inline mr-2 text-[#8B6F47] text-xs" />
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-300 font-sans text-sm
                    ${errors.email 
                      ? 'border-red-400 bg-red-50' 
                      : 'border-[#C9A87C]/40 focus:border-[#8B6F47] bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-[#C9A87C]/30`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1 font-sans">{errors.email}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#4A3C2E] font-semibold mb-2 font-sans text-sm">
                <FaPhone className="inline mr-2 text-[#8B6F47] text-xs" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#C9A87C]/40 focus:border-[#8B6F47] 
                  bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A87C]/30 transition-all duration-300 font-sans text-sm"
                placeholder="Your phone number"
              />
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-[#4A3C2E] font-semibold mb-3 font-sans text-sm">
                <FaHeart className="inline mr-2 text-[#C9A87C] text-xs" />
                Will you be able to attend? *
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('willAttend', 'yes')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer font-sans
                    ${formData.willAttend === 'yes'
                      ? 'border-[#8B6F47] bg-[#F5EEE6] text-[#4A3C2E]'
                      : 'border-[#C9A87C]/30 bg-white text-[#6B5D4F] hover:border-[#C9A87C]'
                    }`}
                >
                  <FaCheckCircle className="mx-auto text-xl mb-2" />
                  <div className="font-semibold text-sm">Yes, I'll be there!</div>
                  <div className="text-xs opacity-75">Can't wait to celebrate</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('willAttend', 'no')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center cursor-pointer font-sans
                    ${formData.willAttend === 'no'
                      ? 'border-[#8B6F47] bg-[#F5EEE6] text-[#4A3C2E]'
                      : 'border-[#C9A87C]/30 bg-white text-[#6B5D4F] hover:border-[#C9A87C]'
                    }`}
                >
                  <FaHeart className="mx-auto text-xl mb-2" />
                  <div className="font-semibold text-sm">Sorry, can't make it</div>
                  <div className="text-xs opacity-75">Will be there in spirit</div>
                </button>
              </div>
              {errors.willAttend && <p className="text-red-600 text-xs mt-2 font-sans">{errors.willAttend}</p>}
            </div>

            {/* Guest Count - only show if attending */}
            {formData.willAttend === 'yes' && (
              <div>
                <label className="block text-[#4A3C2E] font-semibold mb-2 font-sans text-sm">
                  <FaUsers className="inline mr-2 text-[#8B6F47] text-xs" />
                  Number of Guests (Including Yourself) *
                  {guestInfo && (
                    <span className="text-xs text-[#8B6F47] font-medium ml-2">
                      (You have {guestInfo.allocatedSeats} seat{guestInfo.allocatedSeats > 1 ? 's' : ''} allocated)
                    </span>
                  )}
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#C9A87C]/40 focus:border-[#8B6F47] 
                    bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A87C]/30 transition-all duration-300 cursor-pointer font-sans text-sm"
                >
                  {Array.from({ length: guestInfo?.allocatedSeats || 6 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.guestCount && <p className="text-red-600 text-xs mt-1 font-sans">{errors.guestCount}</p>}
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-[#4A3C2E] font-semibold mb-2 font-sans text-sm">
                <FaComments className="inline mr-2 text-[#8B6F47] text-xs" />
                Message for the Couple (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#C9A87C]/40 focus:border-[#8B6F47] 
                  bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A87C]/30 transition-all duration-300 font-sans text-sm"
                rows={4}
                placeholder="Share your love, wishes, or any special message for Kenneth & Jenna..."
              />
            </div>

            {/* Submit Button - Enhanced */}
            <div className="text-center pt-6 border-t border-[#C9A87C]/30">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative bg-gradient-to-r from-[#C9A87C] via-[#8B6F47] to-[#C9A87C] text-white px-12 py-4 
                  rounded-2xl font-bold text-base shadow-2xl hover:shadow-3xl 
                  transform hover:scale-105 transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer
                  focus:outline-none focus:ring-4 focus:ring-[#C9A87C]/40 font-great-vibes
                  overflow-hidden group"
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2 text-lg" />
                      Submitting Your RSVP...
                    </>
                  ) : (
                    <>
                      <FaHeart className="inline mr-2 text-lg" />
                      Confirm My Attendance
                      <FaHeart className="inline ml-2 text-lg" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
              <p className="text-xs text-[#6B5D4F] mt-3 font-sans">
                Your RSVP helps us prepare for the perfect celebration! 🎉
              </p>
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



