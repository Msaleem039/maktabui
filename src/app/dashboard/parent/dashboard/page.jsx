"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { Search, Grid, Moon, ChevronDown, Users, GraduationCap, Calendar, CalendarCheck, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getParentDashboard, setAttendanceYear, clearDashboardError } from "@/redux/slices/parentSlices/parentSlice";
import { getCookie } from "cookies-next";

const Page = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.parentDashboard);

    const user = useMemo(() => {
      const userCookie = getCookie("user");
      return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
    }, []);

  useEffect(() => {
    if (user?.id) {
      dispatch(getParentDashboard(user?.id));
    }
  }, [dispatch, user?.id]);

  const handleYearChange = (year) => {
    dispatch(setAttendanceYear(year));
  };

  const handleRetry = () => {
    dispatch(clearDashboardError());
    if (parentId) {
      dispatch(getParentDashboard(parentId));
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate overall attendance percentage from childAttendance
  const calculateOverallAttendance = () => {
    if (!dashboard.childAttendance.data || dashboard.childAttendance.data.length === 0) return 0;
    
    let totalPresent = 0;
    let totalDays = 0;
    
    dashboard.childAttendance.data.forEach(child => {
      if (child.attendance) {
        totalPresent += child.attendance.present || 0;
        totalDays += child.attendance.total || 0;
      }
    });
    
    return totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;
  };

  // Get attendance status color
  const getAttendanceStatusColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-amber-100 text-amber-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallAttendance = calculateOverallAttendance();

  // Loading state
  if (dashboard.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B31] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboard.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error loading dashboard</div>
          <p className="text-gray-600 mb-4">{dashboard.error}</p>
          <button
            onClick={handleRetry}
            className="bg-[#0B4B31] text-white px-6 py-2 rounded-lg hover:bg-[#0a3f27] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 py-2 sm:py-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
          <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 sm:flex-none min-w-[200px] shadow-sm">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent focus:outline-none text-sm text-[#0B4B31] placeholder:text-[#979699]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0B4B31] bg-white shadow-sm">
              <Grid size={18} className="text-[#0B4B31]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0B4B31] bg-white shadow-sm">
              <Moon size={18} className="text-[#0B4B31]" />
            </button>
            <div className="flex items-center gap-2 bg-white border border-[#0B4B31] rounded-full px-2 py-1.5 pr-3 cursor-pointer hover:bg-emerald-50 shadow-sm">
              <div className="relative w-8 h-8 rounded-full border border-gray-200 overflow-hidden">
                <Image
                  src="/main-dashboard.jpg"
                  alt="user"
                  width={32}
                  height={32}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-gray-800 font-medium text-sm truncate max-w-[80px] sm:max-w-[120px]">
                {dashboard.parentInfo?.fullName || "Ahmed J."}
              </span>
              <ChevronDown size={16} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </header>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* My Children */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Children</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-[#0B4B31]">
                  {dashboard.keyMetrics.myChildren || 0}
                </p>
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <TrendingUp size={12} />
                  <span>+11.01%</span>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <Users size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Fees</p>
              <p className="text-3xl font-bold text-[#0B4B31]">
                ${(dashboard.keyMetrics.pendingFees || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <GraduationCap size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
              <p className="text-3xl font-bold text-[#0B4B31]">
                {overallAttendance}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <Calendar size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Events</p>
              <p className="text-3xl font-bold text-[#0B4B31]">
                {dashboard.keyMetrics.eventsCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center">
              <CalendarCheck size={24} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Charts */}
      <div className="flex flex-col xl:flex-row gap-6 pb-6">
        <div className="flex-1 flex flex-col gap-6">
          {/* Child Attendance Overview */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
              <h3 className="font-semibold text-[#0B4B31] text-[14px] leading-[20px]">
                Child Attendance Overview
              </h3>
              
              <select 
                value={dashboard.monthlyAttendance.selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-emerald-500"
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>
            </div>

            {dashboard.childAttendance.loading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B4B31]"></div>
              </div>
            ) : dashboard.childAttendance.data.length > 0 ? (
              <div className="space-y-6">
                {/* Attendance Cards for each child */}
                {dashboard.childAttendance.data.map((child, index) => (
                  <div key={child.studentId} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#E5EFEB] flex items-center justify-center flex-shrink-0">
                          <Users size={20} className="text-[#0B4B31]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{child.studentName}</h4>
                          <p className="text-sm text-gray-500">{child.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(child.status)}`}>
                          {child.status || 'No Status'}
                        </span>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            (child.attendance?.percentage || 0) >= 80 ? 'text-green-600' :
                            (child.attendance?.percentage || 0) >= 60 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {child.attendance?.percentage || 0}%
                          </div>
                          <div className="text-xs text-gray-500">Attendance</div>
                        </div>
                      </div>
                    </div>

                    {/* Attendance Stats */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-green-600 font-bold text-lg">{child.attendance?.present || 0}</div>
                        <div className="text-green-700 text-sm">Present</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-red-600 font-bold text-lg">{child.attendance?.absent || 0}</div>
                        <div className="text-red-700 text-sm">Absent</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-amber-600 font-bold text-lg">{child.attendance?.late || 0}</div>
                        <div className="text-amber-700 text-sm">Late</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-600 font-bold text-lg">{child.attendance?.total || 0}</div>
                        <div className="text-blue-700 text-sm">Total Days</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Attendance Progress</span>
                        <span>{child.attendance?.percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (child.attendance?.percentage || 0) >= 80 ? 'bg-green-500' :
                            (child.attendance?.percentage || 0) >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${child.attendance?.percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No attendance data available</p>
                <p className="text-gray-400 text-sm mt-1">Attendance records will appear here once available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Cards */}
        <div className="w-full xl:w-80 flex flex-col gap-4">
          {/* Total Fees Paid - Enhanced */}
          <div
            className="rounded-2xl p-4 sm:p-6 shadow-md flex-shrink-0"
            style={{
              background:
                "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 13.66%, rgba(133, 165, 152, 0.965) 99.29%)",
            }}
          >
            <h3 className="text-white text-[1.125rem] leading-[100%] mb-4 font-extrabold">Fee Summary</h3>

            <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center justify-center bg-[#0b4b31] w-12 h-12 rounded-full flex-shrink-0">
                <DollarSign size={24} className="text-white" />
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <h2 className="text-[#0B4B31] text-[1.5rem] leading-[100%] font-extrabold">
                  ${(dashboard.feeStats.totalFeesPaid || 0).toLocaleString()}
                </h2>
                <p className="text-gray-600 text-sm mt-1">Total Paid</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-white text-sm">
              <div className="flex justify-between">
                <span className="opacity-90">Pending Fees:</span>
                <span className="font-semibold">${(dashboard.feeStats.pendingFees || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Next Due Date:</span>
                <span className="font-semibold">
                  {formatDate(dashboard.feeStats.nextDueDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Pending Payments:</span>
                <span className="font-semibold">{dashboard.pendingPayments.data.length}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div
            className="rounded-2xl p-4 sm:p-6 text-white shadow-md flex-shrink-0"
            style={{
              background:
                "linear-gradient(53.14deg, rgba(11, 75, 49, 0.93) 29.92%, rgba(133, 165, 152, 0.965) 99.29%, #FFFFFF 99.3%)",
            }}
          >
            <h3 className="font-outfit font-extrabold text-[18px] leading-[100%] mb-1">Upcoming Events</h3>
            <p className="text-xs opacity-80 mb-4">Events scheduled for your children</p>

            <div className="space-y-3 text-sm">
              {dashboard.upcomingEvents.data.length > 0 ? (
                dashboard.upcomingEvents.data.slice(0, 3).map((event, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Clock size={14} className="opacity-80 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-xs opacity-80">
                        {formatDate(event.date)} | {event.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/70 text-sm">No upcoming events found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Fee Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h3 className="text-[#0B4B31] text-[18px] font-semibold uppercase tracking-wide">RECENT FEE PAYMENTS</h3>
            <button className="text-[12px] px-3 py-[2px] rounded-full transition text-[#0B4B31] bg-[#c9d7d2] hover:bg-[#E3F1EB]">See All ↗</button>
          </div>
          <p className="text-[#000000] text-sm mb-4">Your recent fee payment history</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px] sm:min-w-full">
              <thead>
                <tr className="bg-[#0B4B31] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-md">Child Name ↕</th>
                  <th className="text-left px-3 py-2">Date ↕</th>
                  <th className="text-right px-3 py-2 rounded-tr-md">Amount ↕</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentPayments.data.length > 0 ? (
                  dashboard.recentPayments.data.map((payment, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-3">{payment.childName}</td>
                      <td className="py-3 px-3">{payment.date}</td>
                      <td className={`py-3 px-3 text-right font-medium ${
                        payment.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {payment.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500">
                      No recent payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Fee Payments - Fixed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h3 className="text-[#0B4B31] text-[18px] font-semibold uppercase tracking-wide">PENDING FEE PAYMENTS</h3>
            <button className="text-[12px] px-3 py-[2px] rounded-full transition text-[#F14336] bg-[#fde1df] hover:bg-[#FADDDD]">See All ↗</button>
          </div>
          <p className="text-[#000000] text-sm mb-4">Outstanding fees for your children</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px] sm:min-w-full">
              <thead>
                <tr className="bg-[#0B4B31] text-white">
                  <th className="text-left px-3 py-2 rounded-tl-md">Child Name ↕</th>
                  <th className="text-left px-3 py-2">Due Date ↕</th>
                  <th className="text-right px-3 py-2 rounded-tr-md">Amount ↕</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.pendingPayments.data.length > 0 ? (
                  dashboard.pendingPayments.data.map((payment, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-3">{payment.childName}</td>
                      <td className="py-3 px-3">{payment.date}</td>
                      <td className="py-3 px-3 text-right font-medium text-red-500">
                        {payment.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500">
                      No pending payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Page;