"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Eye, Edit, MessageSquare, Trash2, Download, Calendar, FileText, User, BookOpen } from "lucide-react";

const AssignmentDetailCard = ({ assignmentData, onEditAssignment, onViewSubmissions }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  const actionMenuItems = [
    { label: "View", icon: Eye, action: "view" },
    { label: "Download", icon: Download, action: "download" },
    { label: "Remove", icon: Trash2, action: "remove" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdownId(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleActionClick = (action, attachment, event) => {
    event.stopPropagation();
    if (action === "download" && attachment.url) {
      window.open(attachment.url, '_blank');
    }
    console.log(`${action} clicked for attachment`, attachment);
    setOpenDropdownId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (dueDate) => {
    if (!dueDate) return { text: "No Due Date", color: "bg-gray-100 text-gray-700" };
    
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return { text: "Overdue", color: "bg-red-100 text-red-700" };
    } else if (daysDiff === 0) {
      return { text: "Due Today", color: "bg-orange-100 text-orange-700" };
    } else if (daysDiff <= 7) {
      return { text: "Due Soon", color: "bg-yellow-100 text-yellow-700" };
    } else {
      return { text: "Active", color: "bg-green-100 text-green-700" };
    }
  };

  const statusBadge = getStatusBadge(assignmentData.dueDate);

  return (
    <div className="rounded-[28px] border border-[#E2E7E4] bg-white shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)] overflow-hidden">
      {/* Header with assignment type icon */}
      <div className="relative h-[200px] bg-gradient-to-br from-[#0B4B31] to-[#1C6A45] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-white/30"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white/20"></div>
        </div>

        {/* Assignment Type Icon */}
        <div className="absolute left-8 bottom-[-60px] z-30">
          <div className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-[0_30px_60px_-45px_rgba(0,0,0,0.7)] ring-8 ring-[#D5E2DB]">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#C7D7D0] bg-[#E5EFEB]">
              {assignmentData.type === "quiz" && (
                <BookOpen size={32} className="text-[#0B4B31]" />
              )}
              {assignmentData.type === "project" && (
                <FileText size={32} className="text-[#0B4B31]" />
              )}
              {assignmentData.type === "exam" && (
                <FileText size={32} className="text-[#0B4B31]" />
              )}
              {(!assignmentData.type || assignmentData.type === "Assignment") && (
                <FileText size={32} className="text-[#0B4B31]" />
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-6 right-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-8 pb-8 pt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold text-[#0B4B31]">{assignmentData.title}</h2>
            <p className="text-sm uppercase tracking-[0.35em] text-[#627169] mt-1">
              {assignmentData.type} • {assignmentData.subject}
            </p>
            
            {/* Description */}
            <div className="mt-4">
              <p className="text-[#627169] leading-relaxed">
                {assignmentData.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="rounded-[18px] bg-[#E5EFEB] px-4 py-2 text-center">
              <p className="text-xs font-semibold text-[#627169]">Total Marks</p>
              <p className="text-lg font-bold text-[#0B4B31]">{assignmentData.totalMarks}</p>
            </div>
            <div className="rounded-[18px] bg-[#E5EFEB] px-4 py-2 text-center">
              <p className="text-xs font-semibold text-[#627169]">Submissions</p>
              <p className="text-lg font-bold text-[#0B4B31]">{assignmentData.solutions?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Assignment Details Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-[18px] bg-[#FBFDFB] border border-[#E2E7E4]">
            <Calendar size={20} className="text-[#0B4B31]" />
            <div>
              <p className="text-xs font-semibold text-[#627169]">Due Date</p>
              <p className="text-sm font-medium text-[#0B4B31]">
                {formatDate(assignmentData.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-[18px] bg-[#FBFDFB] border border-[#E2E7E4]">
            <User size={20} className="text-[#0B4B31]" />
            <div>
              <p className="text-xs font-semibold text-[#627169]">Teacher</p>
              <p className="text-sm font-medium text-[#0B4B31]">{assignmentData.teacher}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-[18px] bg-[#FBFDFB] border border-[#E2E7E4]">
            <BookOpen size={20} className="text-[#0B4B31]" />
            <div>
              <p className="text-xs font-semibold text-[#627169]">Class</p>
              <p className="text-sm font-medium text-[#0B4B31]">{assignmentData.class}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-[18px] bg-[#FBFDFB] border border-[#E2E7E4]">
            <FileText size={20} className="text-[#0B4B31]" />
            <div>
              <p className="text-xs font-semibold text-[#627169]">Attachments</p>
              <p className="text-sm font-medium text-[#0B4B31]">{assignmentData.attachments.length}</p>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        {assignmentData.attachments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#0B4B31] mb-4">Attachments</h3>
            <div className="space-y-3">
              {assignmentData.attachments.map((attachment, index) => {
                const isDropdownOpen = openDropdownId === attachment.fileName;
                return (
                  <div
                    key={attachment.fileName || index}
                    className="flex items-center justify-between rounded-[18px] border border-[#E2E7E4] bg-[#FBFDFB] p-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F5EF]">
                        <FileText size={16} className="text-[#0B4B31]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0B4B31] truncate">{attachment.name}</p>
                        <p className="text-xs text-[#627169]">
                          {attachment.type} • {Math.round(attachment.size / 1024)} KB
                        </p>
                      </div>
                    </div>

                    <div className="relative" ref={el => dropdownRefs.current[attachment.fileName] = el}>
                      <button
                        onClick={(e) => toggleDropdown(attachment.fileName, e)}
                        className="p-2 hover:bg-[#E5EFEB] rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4 text-[#627169]" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 top-10 z-40 w-48 rounded-2xl border border-[#E2E7E4] bg-white shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)] overflow-hidden">
                          {actionMenuItems.map((item) => (
                            <button
                              key={item.action}
                              onClick={(e) => handleActionClick(item.action, attachment, e)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#627169] hover:bg-[#F3F6F5] transition-colors"
                            >
                              <item.icon size={16} />
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onViewSubmissions}
            className="px-6 py-3 bg-[#0B4B31] text-white rounded-full hover:bg-[#083823] transition-colors font-semibold"
          >
            View Submissions ({assignmentData.solutions?.length || 0})
          </button>
          <button
            onClick={onEditAssignment}
            className="px-6 py-3 bg-[#E5EFEB] text-[#0B4B31] rounded-full hover:bg-[#D4E6DE] transition-colors font-semibold"
          >
            Edit Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailCard;