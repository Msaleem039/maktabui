"use client";

import { useState } from "react";

const CareersSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    availability: "",
    address: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.availability.trim()) {
      newErrors.availability = "Availability/Interest is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Background Experience is required";
    } else if (formData.experience.trim().length < 10) {
      newErrors.experience = "Please provide at least 10 characters";
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
      console.log("Form submitted:", formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        name: "",
        phone: "",
        email: "",
        availability: "",
        address: "",
        experience: "",
      });
      setErrors({});
      alert("Thank you! Your application has been submitted successfully.");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="careers" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="bg-white py-10 text-center">
        <h2 className="text-3xl leading-[1.2] md:text-[3rem] md:leading-normal font-medium text-[#121212] ">
          Careers at MaktabOS — Now <br /> Hiring!
        </h2>
      </div>

      <div className="bg-[#0B4B31] px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base leading-6 font-medium text-white md:text-lg md:leading-8 lg:text-[1.5rem] lg:leading-9">
            We're currently hiring a motivated Sales Account Executive to help expand the reach of MaktabOS.
          </p>
          <p className="mt-2 text-base leading-6 font-medium text-white md:text-lg md:leading-8 lg:text-[1.5rem] lg:leading-9">
            Join us in building the digital backbone for Islamic education worldwide.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl bg-[#D9D9D9] px-10 py-12 text-left text-[#0B4B31] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.65)]">
          <h3 className="text-lg font-medium text-[#000000]">Fill Out The Form</h3>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6 text-sm font-normal text-[#000000] md:grid-cols-2 md:gap-8">
            <div className="space-y-2">
              <label htmlFor="career-name" className="block mb-3">
                Name
              </label>
              <input
                id="career-name"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="career-phone" className="block mb-3">
                Phone
              </label>
              <input
                id="career-phone"
                name="phone"
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="career-email" className="block mb-3">
                Email
              </label>
              <input
                id="career-email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="career-availability" className="block mb-3">
                Availability / Interest
              </label>
              <input
                id="career-availability"
                name="availability"
                type="text"
                placeholder="Write"
                value={formData.availability}
                onChange={handleChange}
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
              {errors.availability && (
                <p className="mt-1 text-sm text-red-500">{errors.availability}</p>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="career-address" className="block mb-3">
                Address
              </label>
              <input
                id="career-address"
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-full bg-[#0B4B3199] px-6 py-3 text-white placeholder:text-[#000000] focus:outline-none"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="career-experience" className="block mb-3">
                Background Experience
              </label>
              <textarea
                id="career-experience"
                name="experience"
                placeholder="Share a brief summary"
                rows={3}
                value={formData.experience}
                onChange={handleChange}
                className="w-full rounded-3xl bg-[#0B4B3199] px-6 py-4 text-white placeholder:text-[#000000] focus:outline-none"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
              )}
            </div>
            <div className="md:col-span-2 flex justify-start">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;


