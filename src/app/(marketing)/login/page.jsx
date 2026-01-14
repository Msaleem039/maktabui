"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/slices/authSlices/userLoginSlice";
import { setTheme } from "../../../redux/slices/themeSlices/themeSlice";
import { getThemeByBranchAction } from "../../../redux/slices/adminSlices/adminSlices";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    status,
    error: loginError,
    userInfo,
  } = useSelector((state) => state.user);

  const roles = [
    { value: "Super Admin", label: "Super Admin" },
    { value: "Admin", label: "Admin" },
    { value: "Teacher", label: "Teacher" },
    { value: "Parent", label: "Parent" },
    { value: "Student", label: "Student" },
    { value: "SubAdmin", label: "Sub Admin" },
  ];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password, role }));

      if (loginUser.fulfilled.match(resultAction)) {
        const tokenOptions = rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {};

        const payload = resultAction.payload;
        console.log("payload", payload);

        setCookie("token", payload.token, tokenOptions);

        const userCookie = {
          email: payload.email,
          role: payload.role,
          id: payload.id || "",
          branch:payload.branch
        };

        if (payload.role === "SubAdmin") {
          userCookie.permissions = payload.permissions || [];
          userCookie.adminId = payload.adminId || null;
        }

        setCookie("user", JSON.stringify(userCookie), tokenOptions);

        // Only fetch theme for Admin or SubAdmin users (NOT Super Admin)
        const normalizedRole = payload.role?.trim().toLowerCase();
        const isAdminOrSubAdmin = 
          normalizedRole === "admin" || 
          normalizedRole === "subadmin" || 
          normalizedRole === "sub admin";

        if (isAdminOrSubAdmin) {
          // Clear old theme from localStorage first to avoid showing old/black theme
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("maktabTheme");
            } catch (e) {
              console.error("Error clearing theme from localStorage:", e);
            }
          }
          
          // Reset theme to defaults first to avoid showing old/black theme
          dispatch(setTheme({
            themeColor: "#0B4B31",
            secondaryColor: "#13574A",
            logo: "",
            favicon: "",
            mainText: "MaktabOS",
          }));

          const branch = payload.admin?.branch || payload.branch || payload.admin?.branchName || "Main Branch";
          
          try {
            const themeResult = await dispatch(getThemeByBranchAction(branch)).unwrap();
            if (themeResult?.success && themeResult?.theme) {
              const theme = themeResult.theme;
              // Validate colors - reject black colors
              const validThemeColor = theme.themeColor && 
                                      theme.themeColor !== "#000000" && 
                                      theme.themeColor !== "black" &&
                                      theme.themeColor.trim() !== ""
                                      ? theme.themeColor 
                                      : "#0B4B31";
              
              const validSecondaryColor = theme.secondaryColor && 
                                          theme.secondaryColor !== "#000000" && 
                                          theme.secondaryColor !== "black" &&
                                          theme.secondaryColor.trim() !== ""
                                          ? theme.secondaryColor 
                                          : "#13574A";
              
              dispatch(setTheme({
                themeColor: validThemeColor,
                secondaryColor: validSecondaryColor,
                logo: theme.logo || "",
                favicon: theme.favicon || "",
                mainText: theme.mainText || "MaktabOS",
              }));
            }
          } catch (themeError) {
            console.error("Failed to fetch theme by branch:", themeError);
            if (payload.role === "Admin" && payload.admin?.websiteSettings) {
              const websiteSettings = payload.admin.websiteSettings;
              // Validate colors - reject black colors
              const validThemeColor = websiteSettings.themeColor && 
                                      websiteSettings.themeColor !== "#000000" && 
                                      websiteSettings.themeColor !== "black" &&
                                      websiteSettings.themeColor.trim() !== ""
                                      ? websiteSettings.themeColor 
                                      : "#0B4B31";
              
              const validSecondaryColor = websiteSettings.secondaryColor && 
                                          websiteSettings.secondaryColor !== "#000000" && 
                                          websiteSettings.secondaryColor !== "black" &&
                                          websiteSettings.secondaryColor.trim() !== ""
                                          ? websiteSettings.secondaryColor 
                                          : "#13574A";
              
              dispatch(setTheme({
                themeColor: validThemeColor,
                secondaryColor: validSecondaryColor,
                logo: websiteSettings.logo || "",
                favicon: websiteSettings.favicon || "",
                mainText: websiteSettings.mainText || "MaktabOS",
              }));
            } else {
              // Ensure defaults are set even if API fails and no websiteSettings
              dispatch(setTheme({
                themeColor: "#0B4B31",
                secondaryColor: "#13574A",
                logo: "",
                favicon: "",
                mainText: "MaktabOS",
              }));
            }
          }
        } else {
          // For non-admin users, ensure default theme is set
          dispatch(setTheme({
            themeColor: "#0B4B31",
            secondaryColor: "#13574A",
            logo: "",
            favicon: "",
            mainText: "MaktabOS",
          }));
        }

        const userRole = payload.role;
        if (userRole === "Parent") {
          router.push("/dashboard/parent/dashboard");
        } else if (userRole === "Student") {
          router.push("/dashboard/student/dashboard");
        } else if (userRole === "Teacher") {
          router.push("/dashboard/teacher/dashboard");
        } else if (userRole === "Admin") {
          router.push("/dashboard/admin-dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(resultAction.payload || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong during login");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 items-center justify-center px-6 py-14">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-6xl grid md:grid-cols-2">
        {/* Left Section */}
        <div
          className="text-white flex flex-col justify-center items-center p-12 min-h-[700px] relative overflow-hidden"
          style={{
            background:
              "linear-gradient(217.64deg, #0B4B31 -5.84%, #85A598 106.72%, #FFFFFF 106.73%)",
          }}
        >
          {/* MaktabOS Learning Management System Image */}
          <div className="my-10 relative z-10 w-full flex justify-center">
            <Image
              src="/welcome.png"
              alt="Maktab OS Learning Management System"
              width={600}
              height={400}
              className="object-contain max-w-full h-auto"
              priority
            />
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* <LayoutGrid size={40} className="text-[#0B4B31] fill-[#0B4B31]" /> */}
            {/* <span className="text-[#0B4B31] text-4xl font-semibold">
              MaktabOS
            </span> */}
          </div>
        </div>

        {/* Right Section */}
        <div className="p-2 px-12 pb-12 flex flex-col justify-center bg-gray-50 min-h-[720px]">
          <div className="mb-1">
            <h2 className=" font-medium text-[27px] leading-[136%] mb-1">
              Welcome to
            </h2>
            <h2 className=" font-medium text-[20px] leading-[136%] text-[#0B4B31]">
              School Management System
            </h2>
          </div>

          <p className="mb-8 text-[#2F2F2F]  font-light text-[20px] leading-[136%]">
            Please login to continue
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-black mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <div className="flex-1 flex flex-col">
                <label className="text-gray-600 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-gray-800 font-semibold outline-none placeholder-gray-500 w-full"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-black mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-6V9a6 6 0 10-12 0v2H4v10h16V11h-2z" />
              </svg>
              <div className="flex-1 flex flex-col">
                <label className="text-gray-600 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-gray-800 font-semibold outline-none placeholder-gray-500 w-full"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-black ml-3"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-6.325M6.343 6.343A9.956 9.956 0 0012 5c5.523 0 10 4.477 10 10 0 1.656-.404 3.22-1.125 4.6M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Role Selection - Custom Dropdown */}
            <div className="relative w-full">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full cursor-pointer hover:bg-gray-300 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z" />
                </svg>
                <div className="flex-1">
                  <span
                    className={`text-sm ${
                      role
                        ? "text-black font-bold"
                        : "text-gray-600 font-medium"
                    }`}
                  >
                    {role ? role : "Select Your Role"}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 text-[#0B4B31] ml-3 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-10 border border-gray-200 animate-slideDown">
                  {roles.map((roleOption, index) => (
                    <div
                      key={roleOption.value}
                      onClick={() => handleRoleSelect(roleOption.value)}
                      className="px-4 py-3 hover:bg-[#0B4B31] hover:text-white cursor-pointer transition-all duration-200 flex items-center justify-between group"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <span className="font-semibold">{roleOption.label}</span>
                      {role === roleOption.value && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm w-full">
              <label className="flex items-center text-gray-800 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2 h-4 w-4 text-green-700 border-gray-300 rounded focus:ring-green-600"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  router.push("/forgot-password");
                }}
                className="text-[#0B4B31] hover:text-[#084A2E] font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full text-white font-medium py-4 rounded-lg bg-[#084A2E] hover:bg-[#0B4B31] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {status === "loading" ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;