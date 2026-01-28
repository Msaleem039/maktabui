"use client";
import React, { useState, useEffect } from "react";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  clearOtpState,
} from "@/redux/slices/authSlices/userLoginSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { otpStatus, otpError } = useSelector((state) => state.user);

  useEffect(() => {
    if (otpStatus === "succeeded") {
      setSuccess(`Password reset OTP has been sent to ${email}`);
      setError("");
      setEmail("");
      setIsLoading(false);
    }

    if (otpStatus === "failed") {
      setError(otpError || "Failed to send OTP. Please try again.");
      setSuccess("");
      setIsLoading(false);
    }
  }, [otpStatus, otpError, email, router]);

  useEffect(() => {
    return () => {
      dispatch(clearOtpState());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(forgotPassword({ email })).unwrap();

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      console.error("Forgot password error:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 items-center justify-center px-6 py-14">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-6xl grid md:grid-cols-2">
        <div
          className="text-white flex flex-col justify-center items-center p-12 min-h-[700px] relative"
          style={{
            background:
              "linear-gradient(217.64deg, #0B4B31 -5.84%, #85A598 106.72%, #FFFFFF 106.73%)",
          }}
        >
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 flex items-center gap-2 text-[#0B4B31] bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Login</span>
          </button>

          <p className="font-outfit text-center w-[90%] mb-5 mt-20 font-medium text-[32px] leading-[54px]">
            Do not withhold your knowledge, for whoever withholds it will be
            bridled with a bridle of fire on the Day of Resurrection.
          </p>
          <p className="font-extrabold text-[32px] leading-[56px] text-center">
            Sunan Abi Dawud 3658
          </p>
          <div className="flex items-center gap-3 my-10">
            <LayoutGrid size={40} className="text-[#0B4B31] fill-[#0B4B31]" />
            <span className="text-[#0B4B31] text-4xl font-semibold">
              MaktabOS
            </span>
          </div>
        </div>

        <div className="p-2 px-12 pb-12 flex flex-col justify-center bg-gray-50 min-h-[720px] relative">
          <button
            onClick={() => router.back()}
            className="md:hidden absolute top-6 left-6 flex items-center gap-2 text-[#0B4B31]"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="mb-8">
            <h2 className="font-medium text-[27px] leading-[136%] mb-1">
              Reset Your Password
            </h2>
            <h2 className="font-medium text-[20px] leading-[136%] text-[#0B4B31]">
              MaktabOS Account
            </h2>
          </div>

          <p className="mb-8 text-[#2F2F2F] font-light text-[16px] leading-[136%]">
            Enter the email address associated with your account and we'll send
            you instructions to reset your password.
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{success}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2 mb-8">
              <label className="text-gray-700 font-medium text-sm">
                Email Address
              </label>
              <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full hover:bg-gray-300 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-black mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-gray-800 font-semibold outline-none placeholder-gray-500 w-full"
                  required
                />
              </div>
              <p className="text-gray-500 text-xs pt-1">
                Enter the email you used to create your MaktabOS account
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpStatus === "loading"}
              className="w-full text-white font-medium py-4 rounded-lg bg-[#084A2E] hover:bg-[#0B4B31] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading || otpStatus === "loading" ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending Instructions...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </button>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What to expect:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Check your inbox for an email from MaktabOS</li>
                    <li>
                      Click the reset link in the email (expires in 1 hour)
                    </li>
                    <li>Follow instructions to create a new password</li>
                    <li>If you don't see the email, check your spam folder</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-[#0B4B31] hover:text-[#084A2E] font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <ArrowLeft size={16} />
                Return to Login Page
              </button>
            </div>
          </form>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@maktabos.com"
                className="text-[#0B4B31] hover:underline font-medium"
              >
                support@maktabos.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
