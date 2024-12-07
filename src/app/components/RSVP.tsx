/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { MotionDiv, MotionForm, MotionInput, MotionTextarea, MotionSelect } from '@/types/motion';
import { FaHeart, FaEnvelope, FaPhone, FaUsers, FaPen } from 'react-icons/fa';

interface FormData {
  name: string;
  willAttend: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  message: string;
}

export default function RSVP() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    willAttend: "",
    email: "",
    phone: "",
    numberOfGuests: 1,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('RSVP response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }
      
      setSubmitStatus('success');
      setFormData({
        name: "",
        willAttend: "",
        email: "",
        phone: "",
        numberOfGuests: 1,
        message: ""
      });
    } catch (error) {
      console.error('RSVP error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-secondary">
      <MotionDiv
        className="max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h3 className="text-5xl font-script text-primary mb-4">Will You Join Us?</h3>
          <p className="text-gray-600">We would be honored to have you celebrate with us</p>
        </div>

        {submitStatus === 'success' && (
          <MotionDiv 
            className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaHeart className="inline-block mr-2 text-green-500" />
            Thank you for your RSVP! We look forward to celebrating with you.
          </MotionDiv>
        )}

        {submitStatus === 'error' && (
          <MotionDiv 
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Something went wrong. Please try again.
          </MotionDiv>
        )}

        <MotionForm 
          onSubmit={handleSubmit} 
          className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8"
        >
          <div className="space-y-6">
            <div className="relative">
              <FaHeart className="absolute top-3 left-3 text-gray-400" />
              <MotionInput
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <MotionInput
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="relative">
              <FaPhone className="absolute top-3 left-3 text-gray-400" />
              <MotionInput
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <MotionSelect
              value={formData.willAttend}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, willAttend: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              whileFocus={{ scale: 1.01 }}
            >
              <option value="">Will you attend?</option>
              <option value="yes">Yes, I will be there!</option>
              <option value="no">Sorry, I cannot attend</option>
            </MotionSelect>

            <div className="relative">
              <FaUsers className="absolute top-3 left-3 text-gray-400" />
              <MotionInput
                type="number"
                placeholder="Number of Guests"
                value={formData.numberOfGuests}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, numberOfGuests: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
                max="5"
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div className="relative">
              <FaPen className="absolute top-3 left-3 text-gray-400" />
              <MotionTextarea
                placeholder="Message for the Couple (Optional)"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 disabled:opacity-50 transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaHeart className="mr-2" />
                  Send RSVP
                </span>
              )}
            </button>
          </div>
        </MotionForm>
      </MotionDiv>
    </div>
  );
}
