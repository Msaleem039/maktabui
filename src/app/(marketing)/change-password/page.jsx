"use client";
import React, { useState, useEffect } from "react";
import { LayoutGrid, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  clearOtpState,
} from "@/redux/slices/authSlices/userLoginSlice";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "text-gray-400",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { resetStatus, resetError, isOtpVerified } = useSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const otpParam = searchParams.get("otp");

    if (emailParam) {
      setEmail(emailParam);
    } else {
      const storedEmail = sessionStorage.getItem("resetEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }

    if (otpParam) {
      setOtp(otpParam);
    } else {
      const storedOtp = sessionStorage.getItem("otp");
      if (storedOtp) {
        setOtp(storedOtp);
      }
    }
  }, [searchParams, router, email, otp]);

  useEffect(() => {
    if (resetStatus === "succeeded") {
      setSuccess("Password successfully changed! Redirecting to login...");

      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("otp");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }

    if (resetStatus === "failed") {
      setError(resetError || "Failed to change password. Please try again.");
      setIsLoading(false);
    }
  }, [resetStatus, resetError, router]);

  useEffect(() => {
    return () => {
      dispatch(clearOtpState());
    };
  }, [dispatch]);

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = "";
    let color = "text-gray-400";

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
        message = "Very Weak";
        color = "text-red-500";
        break;
      case 1:
      case 2:
        message = "Weak";
        color = "text-orange-500";
        break;
      case 3:
        message = "Good";
        color = "text-yellow-500";
        break;
      case 4:
        message = "Strong";
        color = "text-green-500";
        break;
      case 5:
        message = "Very Strong";
        color = "text-[#0B4B31]";
        break;
      default:
        message = "";
    }

    setPasswordStrength({ score, message, color });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers,
      requirements: [
        { met: password.length >= minLength, text: "At least 8 characters" },
        { met: hasUpperCase, text: "One uppercase letter" },
        { met: hasLowerCase, text: "One lowercase letter" },
        { met: hasNumbers, text: "One number" },
      ],
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements");
      setIsLoading(false);
      return;
    }

    if (!email || !otp) {
      setError("Email or OTP missing. Please restart the process.");
      setIsLoading(false);
      router.push("/forgot-password");
      return;
    }

    try {
      await dispatch(
        resetPassword({
          email,
          otp,
          newPassword,
        })
      ).unwrap();
    } catch (err) {
      console.error("Reset password error:", err);
    }
  };

  const passwordValidation = validatePassword(formData.newPassword);

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
            onClick={() => router.push("/verify-otp")}
            className="absolute top-6 left-6 flex items-center gap-2 text-[#0B4B31] bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <p className="font-outfit text-center w-[90%] mb-5 mt-20 font-medium text-[32px] leading-[54px]">
            Knowledge is of two kinds: that which is absorbed and that which is
            heard. And that which is heard does not profit if it is not
            absorbed.
          </p>
          <p className="font-extrabold text-[32px] leading-[56px] text-center">
            Imam Ali (as)
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
            onClick={() => router.push("/verify-otp")}
            className="md:hidden absolute top-6 left-6 flex items-center gap-2 text-[#0B4B31]"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <div className="mb-8">
            <h2 className="font-medium text-[27px] leading-[136%] mb-1">
              Create New Password
            </h2>
            <h2 className="font-medium text-[20px] leading-[136%] text-[#0B4B31]">
              Secure Your Account
            </h2>
          </div>

          <p className="mb-8 text-[#2F2F2F] font-light text-[16px] leading-[136%]">
            Create a new strong password for your MaktabOS account. Make sure
            it's different from previous passwords.
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
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm">
                New Password
              </label>
              <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full hover:bg-gray-300 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-black mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="bg-transparent text-gray-800 font-semibold outline-none placeholder-gray-500 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-gray-600 hover:text-gray-800 ml-2"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {formData.newPassword && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Password Strength:
                    </span>
                    <span
                      className={`text-sm font-medium ${passwordStrength.color}`}
                    >
                      {passwordStrength.message}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2
                          ? "bg-red-500"
                          : passwordStrength.score === 3
                          ? "bg-yellow-500"
                          : passwordStrength.score === 4
                          ? "bg-green-500"
                          : "bg-[#0B4B31]"
                      }`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-gray-600 text-sm mb-2">
                  Password must contain:
                </p>
                <ul className="space-y-1">
                  {passwordValidation.requirements.map((req, index) => (
                    <li key={index} className="flex items-center text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 mr-2 ${
                          req.met ? "text-green-500" : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {req.met ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        )}
                      </svg>
                      <span
                        className={req.met ? "text-green-600" : "text-gray-500"}
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm">
                Confirm New Password
              </label>
              <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full hover:bg-gray-300 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-black mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-transparent text-gray-800 font-semibold outline-none placeholder-gray-500 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-600 hover:text-gray-800 ml-2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="flex items-center text-sm pt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 mr-2 ${
                      formData.newPassword === formData.confirmPassword
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {formData.newPassword === formData.confirmPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    )}
                  </svg>
                  <span
                    className={
                      formData.newPassword === formData.confirmPassword
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formData.newPassword === formData.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || resetStatus === "loading"}
              className="w-full text-white font-medium py-4 rounded-lg bg-[#084A2E] hover:bg-[#0B4B31] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading || resetStatus === "loading" ? (
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
                  Changing Password...
                </>
              ) : (
                "Change Password"
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
                  <p className="font-medium mb-1">Security Tips:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Use a unique password for MaktabOS</li>
                    <li>Avoid using personal information in passwords</li>
                    <li>Consider using a password manager</li>
                    <li>Update your password regularly</li>
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

export default ChangePassword;
