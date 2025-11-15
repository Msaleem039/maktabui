"use client";

import { useState } from "react";
import { X, Send, Paperclip, ThumbsUp, DollarSign, HelpCircle, Grid3x3 } from "lucide-react";
import Image from "next/image";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0B4B31] text-white shadow-lg transition hover:bg-[#0B4B31]/90 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] rounded-[28px] border border-[#E2E7E4] bg-white shadow-[0_30px_80px_-50px_rgba(11,75,49,0.35)] overflow-hidden">
          {/* Header */}
          <div className="relative h-[120px] bg-[#0B4B31] overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
                <path
                  d="M0,60 Q100,20 200,60 T400,60 L400,120 L0,120 Z"
                  fill="white"
                  opacity="0.3"
                />
                <path
                  d="M0,80 Q150,40 300,80 T400,80 L400,120 L0,120 Z"
                  fill="white"
                  opacity="0.2"
                />
              </svg>
            </div>
            <div className="relative p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Grid3x3 size={18} />
                  <span className="font-semibold">MaktabOS</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/20 p-1.5 hover:bg-white/30 transition"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">Questions? Chat With Us!</p>
                <div className="flex items-center justify-center gap-2 text-xs opacity-90">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <span>Last Active 5 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {/* Bot Avatar */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B4B31] text-white font-semibold">
                M
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">MaktabOS</p>
                <div className="rounded-2xl bg-[#0B4B31] px-4 py-3 text-white text-sm">
                  Anything You Want to Ask?
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>7:20</span>
                  <Paperclip size={14} className="text-gray-400" />
                  <ThumbsUp size={14} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-full border border-[#E2E7E4] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                <DollarSign size={16} className="text-yellow-500" />
                Pricing
              </button>
              <button className="flex items-center gap-2 rounded-full border border-[#E2E2E4] bg-white px-4 py-2 text-sm text-[#0B4B31] transition hover:bg-[#F3F6F5]">
                <HelpCircle size={16} className="text-yellow-500" />
                FAQs
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-[#E2E7E4] p-4 bg-[#F7FAF8]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 rounded-full bg-[#D5E2DB] px-4 py-3 text-sm text-[#0B4B31] placeholder-[#0B4B31]/60 outline-none focus:ring-2 focus:ring-[#0B4B31]/30"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setMessage("");
                  }
                }}
              />
              <button
                onClick={() => setMessage("")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B4B31] text-white transition hover:bg-[#0B4B31]/90"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

