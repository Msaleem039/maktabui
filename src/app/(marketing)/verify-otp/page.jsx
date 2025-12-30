"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyOTP,
  resendOTP,
  clearOtpState,
} from "@/redux/slices/authSlices/userLoginSlice";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  const {
    verifyStatus,
    verifyError,
    resendStatus,
    resendError,
    isOtpVerified,
  } = useSelector((state) => state.user);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  useEffect(() => {
    return () => {
      dispatch(clearOtpState());
    };
  }, [dispatch]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleSubmit();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const pastedOtp = pastedData.split("");
      const newOtp = [...otp];
      pastedOtp.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await dispatch(verifyOTP({ email, otp: otpCode })).unwrap();
      const params = new URLSearchParams({
        email: email,
        otp: otpCode,
      });

      router.push(`/change-password?${params.toString()}`);
    } catch (err) {
      console.error("OTP verification error:", err);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError("");

    try {
      await dispatch(resendOTP({ email })).unwrap();
    } catch (err) {
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
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
            onClick={() => router.push("/forgot-password")}
            className="absolute top-6 left-6 flex items-center gap-2 text-[#0B4B31] bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <p className="font-outfit text-center w-[90%] mb-5 mt-20 font-medium text-[32px] leading-[54px]">
            Knowledge is a treasure whose key is inquiry.
          </p>
          <p className="font-extrabold text-[32px] leading-[56px] text-center">
            Arabic Proverb
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
            onClick={() => router.push("/forgot-password")}
            className="md:hidden absolute top-6 left-6 flex items-center gap-2 text-[#0B4B31]"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="mb-8">
            <h2 className="font-medium text-[27px] leading-[136%] mb-1">
              Verify Your Identity
            </h2>
            <h2 className="font-medium text-[20px] leading-[136%] text-[#0B4B31]">
              Enter Verification Code
            </h2>
          </div>

          <p className="mb-8 text-[#2F2F2F] font-light text-[16px] leading-[136%]">
            We've sent a 6-digit verification code to{" "}
            <span className="font-semibold text-[#0B4B31]">{email}</span>. Enter
            the code below to verify your identity.
          </p>

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

          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="space-y-4">
              <label className="text-gray-700 font-medium text-sm">
                6-Digit Verification Code
              </label>
              <div className="flex justify-between gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(index, e.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold bg-gray-200 border-2 border-transparent rounded-xl focus:border-[#0B4B31] focus:bg-white outline-none transition-all duration-200 hover:bg-gray-300"
                  />
                ))}
              </div>
              <p className="text-gray-500 text-xs pt-1">
                Enter the code exactly as it appears in the email
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-2">
                {canResend ? (
                  "Code expired. Request a new one."
                ) : (
                  <>
                    Code expires in:{" "}
                    <span className="font-bold text-[#0B4B31]">
                      {formatTime(timer)}
                    </span>
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || isLoading || resendStatus === "loading"}
                className="text-[#0B4B31] hover:text-[#084A2E] font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {resendStatus === "loading"
                  ? "Sending..."
                  : "Resend Verification Code"}
              </button>
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                otp.some((digit) => digit === "") ||
                verifyStatus === "loading"
              }
              className="w-full text-white font-medium py-4 rounded-lg bg-[#084A2E] hover:bg-[#0B4B31] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading || verifyStatus === "loading" ? (
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
                  Verifying...
                </>
              ) : (
                "Verify and Continue"
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
                  <p className="font-medium mb-1">Important:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>The code is valid for 5 minutes only</li>
                    <li>Check your spam folder if you don't see the email</li>
                    <li>Do not share this code with anyone</li>
                    <li>Enter the code exactly as received</li>
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
              Having trouble? Contact our support team at{" "}
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

export default OTPVerification;
