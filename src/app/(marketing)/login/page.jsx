"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import axios from "axios";

const Page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const roles = [
        { value: "Super Admin", label: "Super Admin" },
        { value: "Admin", label: "Admin" },
        { value: "Teacher", label: "Teacher" },
        { value: "Student", label: "Student" }
    ];

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setIsDropdownOpen(false);
    };

    const setCookie = (name, value, days = 1) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${JSON.stringify(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email || !password || !role) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password,
                role
            });

            const data = response.data;

            const userData = {
                email: data.email,
                role: data.role,
                token: data.token
            };
            
            setCookie('user', userData, rememberMe ? 30 : 1);
            
            setCookie('token', data.token, rememberMe ? 30 : 1);

            router.push('/dashboard');

        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                setError(error.response.data.message || 'Login failed');
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100 items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-6xl grid md:grid-cols-2">
                <div
                    className="text-white flex flex-col justify-center items-center p-12 min-h-[600px]"
                    style={{
                        background:
                            "linear-gradient(217.64deg, #0B4B31 -5.84%, #85A598 106.72%, #FFFFFF 106.73%)",
                    }}
                >
                    <p className="font-outfit text-center w-[90%] mb-8 font-medium text-[32px] leading-[54px]">
                        Do not withhold your knowledge, for whoever withholds it will be bridled
                        with a bridle of fire on the Day of Resurrection.
                    </p>
                    <p className="font-extrabold text-[32px] leading-[56px] text-center">
                        Sunan Abi Dawud 3658
                    </p>

                    <div className="flex items-center gap-3 my-10">
                        <LayoutGrid size={40} className="text-[#0B4B31] fill-[#0B4B31]" />
                        <span className="text-[#0B4B31] text-4xl font-semibold">MaktabOS</span>
                    </div>
                </div>

                <div className="p-12 flex flex-col justify-center bg-white">
                    <div className="mb-1">
                        <h2 className="font-medium text-[27px] leading-[136%] mb-1 text-[#2F2F2F]">
                            Welcome to
                        </h2>
                        <h2 className="font-medium text-[20px] leading-[136%] text-[#0B4B31]">
                            MaktabOS
                        </h2>
                    </div>

                    <p className="mb-8 text-[#2F2F2F] font-light text-[20px] leading-[136%]">
                        Please login to continue
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 mb-6 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-[#2F2F2F] font-normal">Login with Google</span>
                    </button>

                    <div className="flex items-center mb-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-600 text-sm font-medium">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-black mr-3 shrink-0"
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
                                    className=" text-gray-800 font-semibold outline-none placeholder-gray-500 w-full bg-transparent"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-black mr-3 shrink-0"
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
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-black ml-3"
                                disabled={isLoading}
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
                                onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center bg-gray-200 rounded-xl px-4 py-3 w-full cursor-pointer hover:bg-gray-300 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-black mr-3 shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z" />
                                </svg>
                                <div className="flex-1 flex flex-col">
                                    <span className="text-gray-600 text-sm font-medium mb-1">
                                        {role ? role : "Select Your Role"}
                                    </span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-5 h-5 text-black ml-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                            {isDropdownOpen && !isLoading && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-10 border border-gray-200 animate-slideDown">
                                    {roles.map((roleOption, index) => (
                                        <div
                                            key={roleOption.value}
                                            onClick={() => handleRoleSelect(roleOption.value)}
                                            className="px-4 py-3 hover:bg-[#0B4B31] hover:text-white cursor-pointer transition-all duration-200 flex items-center justify-between group"
                                            style={{
                                                animationDelay: `${index * 50}ms`
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

                        {/* Remember Me + Forgot Password */}
                        <div className="flex items-center justify-between text-sm w-full">
                            <label className="flex items-center text-gray-800 font-medium">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => !isLoading && setRememberMe(!rememberMe)}
                                    disabled={isLoading}
                                    className="mr-2 h-4 w-4 text-[#0B4B31] border-gray-300 rounded focus:ring-[#0B4B31]"
                                />
                                Remember me
                            </label>
                            <a
                                href="#"
                                className={`text-[#0B4B31] font-semibold hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Forgot Password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-white font-medium py-4 rounded-xl bg-[#0B4B31] hover:bg-[#084A2E] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-gray-600 mt-8 font-medium">
                        Don't have an account?{" "}
                        <a 
                            href="#" 
                            className={`text-[#0B4B31] hover:underline font-semibold ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;