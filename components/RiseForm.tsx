"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function RiseForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    address: "",
    enterprise: "",
    sponsorName: "",
    sponsorPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!formData.fullName.trim())
      newErrors.fullName = "অনুগ্রহ করে আপনার নাম লিখুন";

    // Phone
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "মোবাইল নম্বর আবশ্যক";
    else if (!/^[0-9+\-\s()]+$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "সঠিক ফোন নম্বর দিন";

    // Email
    if (!formData.email.trim()) newErrors.email = "ইমেইল ঠিকানা দিতে হবে";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "বৈধ ইমেইল দিন";

    // Address
    if (!formData.address.trim()) newErrors.address = "সম্পূর্ণ ঠিকানা লিখুন";

    // Enterprise
    if (!formData.enterprise.trim())
      newErrors.enterprise = "প্রতিষ্ঠানের নাম আবশ্যক";

    // Sponsor Name
    if (!formData.sponsorName.trim())
      newErrors.sponsorName = "রেফারারের নাম প্রয়োজন";

    // Sponsor Phone
    if (!formData.sponsorPhone.trim())
      newErrors.sponsorPhone = "রেফারারের নম্বর দিন";
    else if (!/^[0-9+\-\s()]+$/.test(formData.sponsorPhone))
      newErrors.sponsorPhone = "সঠিক নম্বর দিন";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      console.log("Form Data:", formData);

      // Clear the form after logging the data
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        address: "",
        enterprise: "",
        sponsorName: "",
        sponsorPhone: "",
      });

      // Create the payload for the API call
      const paymentPayload = {
        amount: 4200,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        address: formData.address,
        enterprise: formData.enterprise,
        sponsorName: formData.sponsorName,
        sponsorPhone: formData.sponsorPhone,
      };

      try {
        // Sending the API request
        const response = await fetch("/api/payment/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload), // Sending the form data as JSON
        });

        const result = await response.json();

        // Handle success or failure
        if (result.success && result.data) {
          const paymentResponse = result.data;
          window.location.href = paymentResponse.checkout_url;
        } else {
          setError(result.error || "Payment initiation failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors); // Set form validation errors if any
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3f8fb] to-[#d8eaf2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          {/* Header */}
          {/* <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-8"> */}

          <div className="bg-[#5b9cb9] px-8 py-8">
            <div className="text-center">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
                  <Image
                    src="/cropped-logo-tiens-baru.png"
                    alt="rise enterprise"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              </div>
              <h2 className="text-4xl font-bold italic text-white drop-shadow-md">
                Rise Enterprise
              </h2>
              <p className="text-white/95 mt-2 text-lg">
                সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-10">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5b9cb9] focus:bg-white transition-all"
                  placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-[11px] mt-1.5 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Mobile Number*/}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5b9cb9] focus:bg-white transition-all"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-[11px] mt-1.5 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5b9cb9] focus:bg-white transition-all"
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1.5 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5b9cb9] focus:bg-white transition-all resize-none"
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                />
                {errors.address && (
                  <p className="text-red-500 text-[11px] mt-1.5 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.address}
                  </p>
                )}
              </div>

              {/* এন্টারপ্রাইজ */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  এন্টারপ্রাইজ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="enterprise"
                  value={formData.enterprise}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5b9cb9] focus:bg-white transition-all"
                  placeholder="আপনার এন্টারপ্রাইজের নাম"
                />
                {errors.enterprise && (
                  <p className="text-red-500 text-[11px] mt-1.5 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.enterprise}
                  </p>
                )}
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-[#5b9cb9]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  স্পনসর ইনফরমেশন
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* স্পনসরের নাম */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      স্পনসরের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sponsorName"
                      value={formData.sponsorName}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5b9cb9] focus:bg-white transition-all"
                      placeholder="স্পনসরের নাম লিখুন"
                    />
                    {errors.sponsorName && (
                      <p className="text-red-500 text-[11px] mt-1.5 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.sponsorName}
                      </p>
                    )}
                  </div>

                  {/* স্পনসরের নাম্বার */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      স্পনসরের নাম্বার <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="sponsorPhone"
                      value={formData.sponsorPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5b9cb9] focus:bg-white transition-all"
                      placeholder="+880 1XXX-XXXXXX"
                    />
                    {errors.sponsorPhone && (
                      <p className="text-red-500 text-[11px] mt-1.5 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.sponsorPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r cursor-pointer from-[#5b9cb9] to-[#3c7f9a] text-white font-bold py-4 px-6 rounded-xl hover:from-[#4f90ad] hover:to-[#2f6f89] focus:outline-none focus:ring-4 focus:ring-[#5b9cb9]/30 transform hover:scale-[1.01] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mt-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="text-center mt-4 flex items-center justify-center text-gray-600">
          <svg
            className="w-4 h-4 mr-1 text-[#5b9cb9]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-[10px] font-medium">
            সকল তথ্য সুরক্ষিত এবং গোপনীয় থাকবে
          </span>
        </div>
      </div>
    </div>
  );
}
