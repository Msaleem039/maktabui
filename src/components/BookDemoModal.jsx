"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Mail, Phone, User, MapPin, MessageSquare } from "lucide-react";

const BookDemoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your API
      console.log("Demo request submitted:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        message: "",
      });
      setErrors({});
      
      alert("Thank you! We'll contact you soon to schedule your demo.");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-[36px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-gray-100">
        {/* Header with gradient */}
        <div
          className="relative px-6 py-5 sm:px-8 sm:py-6 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0B4B31 0%, #13574A 50%, #0B4B31 100%)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-sm">
                Book a Demo
              </h2>
              <p className="text-white/95 text-sm sm:text-base font-medium">
                Experience MaktabOS in action. Schedule your personalized demo today!
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full bg-white/20 hover:bg-white/30 p-2.5 text-white transition-all duration-200 disabled:opacity-50 backdrop-blur-sm hover:scale-110 active:scale-95"
              aria-label="Close modal"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-8 sm:px-10 sm:py-10 max-h-[70vh] overflow-y-auto bg-gradient-to-b from-white to-gray-50/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2.5 group">
              <label
                htmlFor="demo-name"
                className="flex items-center gap-2.5 text-sm font-bold text-[#0B4B31] mb-2"
              >
                <div className="p-1.5 rounded-lg bg-[#0B4B31]/10">
                  <User size={16} className="text-[#0B4B31]" />
                </div>
                Full Name
              </label>
              <div className="relative">
                <input
                  id="demo-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:border-[#0B4B31] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0B4B31]/10 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0B4B31]/0 via-[#0B4B31]/0 to-[#0B4B31]/0 group-focus-within:from-[#0B4B31]/5 group-focus-within:via-[#0B4B31]/10 group-focus-within:to-[#0B4B31]/5 pointer-events-none transition-all duration-300"></div>
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-2 mt-1.5 font-medium animate-in slide-in-from-top-1">
                  <span className="text-red-500">⚠</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2.5 group">
              <label
                htmlFor="demo-email"
                className="flex items-center gap-2.5 text-sm font-bold text-[#0B4B31] mb-2"
              >
                <div className="p-1.5 rounded-lg bg-[#0B4B31]/10">
                  <Mail size={16} className="text-[#0B4B31]" />
                </div>
                Email Address
              </label>
              <div className="relative">
                <input
                  id="demo-email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:border-[#0B4B31] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0B4B31]/10 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0B4B31]/0 via-[#0B4B31]/0 to-[#0B4B31]/0 group-focus-within:from-[#0B4B31]/5 group-focus-within:via-[#0B4B31]/10 group-focus-within:to-[#0B4B31]/5 pointer-events-none transition-all duration-300"></div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-2 mt-1.5 font-medium animate-in slide-in-from-top-1">
                  <span className="text-red-500">⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2.5 group">
              <label
                htmlFor="demo-phone"
                className="flex items-center gap-2.5 text-sm font-bold text-[#0B4B31] mb-2"
              >
                <div className="p-1.5 rounded-lg bg-[#0B4B31]/10">
                  <Phone size={16} className="text-[#0B4B31]" />
                </div>
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="demo-phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:border-[#0B4B31] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0B4B31]/10 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0B4B31]/0 via-[#0B4B31]/0 to-[#0B4B31]/0 group-focus-within:from-[#0B4B31]/5 group-focus-within:via-[#0B4B31]/10 group-focus-within:to-[#0B4B31]/5 pointer-events-none transition-all duration-300"></div>
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-2 mt-1.5 font-medium animate-in slide-in-from-top-1">
                  <span className="text-red-500">⚠</span> {errors.phone}
                </p>
              )}
            </div>

            {/* Organization Field */}
            <div className="space-y-2.5 group">
              <label
                htmlFor="demo-organization"
                className="flex items-center gap-2.5 text-sm font-bold text-[#0B4B31] mb-2"
              >
                <div className="p-1.5 rounded-lg bg-[#0B4B31]/10">
                  <MapPin size={16} className="text-[#0B4B31]" />
                </div>
                Organization / Institution
              </label>
              <div className="relative">
                <input
                  id="demo-organization"
                  name="organization"
                  type="text"
                  placeholder="Your school or organization name"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:border-[#0B4B31] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0B4B31]/10 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0B4B31]/0 via-[#0B4B31]/0 to-[#0B4B31]/0 group-focus-within:from-[#0B4B31]/5 group-focus-within:via-[#0B4B31]/10 group-focus-within:to-[#0B4B31]/5 pointer-events-none transition-all duration-300"></div>
              </div>
              {errors.organization && (
                <p className="text-sm text-red-600 flex items-center gap-2 mt-1.5 font-medium animate-in slide-in-from-top-1">
                  <span className="text-red-500">⚠</span> {errors.organization}
                </p>
              )}
            </div>

            {/* Message Field */}
            {/* <div className="space-y-2">
              <label
                htmlFor="demo-message"
                className="flex items-center gap-2 text-sm font-semibold text-[#0B4B31]"
              >
                <MessageSquare size={16} />
                Additional Message (Optional)
              </label>
              <textarea
                id="demo-message"
                name="message"
                placeholder="Tell us about your specific needs or questions..."
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#0B4B31] focus:bg-white focus:outline-none transition-all resize-none"
              />
            </div> */}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-2xl border-2 border-gray-300 bg-white px-6 py-4 text-sm font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-2xl bg-gradient-to-r from-[#0B4B31] to-[#13574A] px-6 py-4 text-sm font-bold text-white transition-all duration-200 hover:from-[#084A2E] hover:to-[#0B4B31] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-xl shadow-[#0B4B31]/25 hover:shadow-2xl hover:shadow-[#0B4B31]/40 hover:scale-[1.02] active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2.5 border-white border-t-transparent" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Calendar size={20} className="drop-shadow-sm" />
                    <span>Schedule Demo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookDemoModal;

