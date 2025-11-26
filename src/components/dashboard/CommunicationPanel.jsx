"use client";

import React from "react";
import Image from "next/image";
import { Search, Send } from "lucide-react";

const defaultConversations = [
  {
    id: "conv-1",
    name: "John Smith",
    snippet: "Thanks for the quick response! Wh...",
    time: "2 min ago",
    status: "Active",
    tag: "RV001",
    avatar: "/main-dashboard.jpg",
  },
  {
    id: "conv-2",
    name: "Sarah Johnson",
    snippet: "Thanks for the quick response! Wh...",
    time: "1 hour ago",
    status: "Active",
    tag: "RV001",
    avatar: "/Section1.png",
  },
  {
    id: "conv-3",
    name: "Micheal Townley",
    snippet: "Thanks for the quick response! Wh...",
    time: "1 day ago",
    status: "Active",
    tag: "RV001",
    avatar: "/Landing.jpg",
  },
  {
    id: "conv-4",
    name: "Sarah Johnson",
    snippet: "Thanks for the quick response! Wh...",
    time: "1 hour ago",
    status: "Active",
    tag: "RV001",
    avatar: "/parentprofile.svg",
  },
  {
    id: "conv-5",
    name: "Micheal Townley",
    snippet: "Thanks for the quick response! Wh...",
    time: "1 day ago",
    status: "Active",
    tag: "RV001",
    avatar: "/proofile card 4.svg",
  },
];

const defaultMessages = [
  {
    id: "msg-1",
    sender: "advisor",
    text: "Hello! I understand you're interested in the new curriculum?",
    time: "7:20",
  },
  {
    id: "msg-2",
    sender: "client",
    text: "Hi! Yes, I have a 2020 Winnebago Adventurer student that I'm looking to enroll.",
    time: "7:20",
  },
  {
    id: "msg-3",
    sender: "advisor",
    text: "Great! What's the approximate mileage on your Winnebago Adventurer?",
    time: "7:20",
  },
  {
    id: "msg-4",
    sender: "client",
    text: "I'm interested in the new curriculum. Can you tell me more about it?",
    time: "7:21",
  },
  {
    id: "msg-5",
    sender: "client",
    text: "The new curriculum is a great way to learn. It's in excellent condition.",
    time: "7:22",
  },
];

export default function CommunicationPanel({
  panelTitle = "Communication",
  subtitle = "Track every conversation in one place",
  conversations = defaultConversations,
  activeConversation = defaultConversations[0],
  messages = defaultMessages,
  className = "",
}) {
  return (
    <section
      className={`rounded-[28px] bg-white border border-[#E2E7E4] shadow-sm overflow-hidden ${className}`}
    >
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#F0F4F2] flex-wrap gap-3">
        <div>
          <p className="text-lg font-semibold text-[#0B4B31]">{panelTitle}</p>
          <p className="text-sm text-[#5E6C64]">{subtitle}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F5E9] text-[#0B4B31]">
          Live
        </span>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Conversations List */}
        <aside className="lg:w-80 border-r border-[#F0F4F2] bg-[#FAFAFA]">
          <div className="p-5">
            <p className="text-sm font-semibold text-[#38413D] mb-3">Conversations</p>
            <div className="flex items-center bg-white border border-[#E0E6E3] rounded-full px-3 py-2 shadow-sm">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                placeholder="Search Conversations..."
                className="w-full text-sm bg-transparent outline-none text-[#0B4B31]"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[520px] divide-y divide-[#F1F1F1]">
            {conversations.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left transition ${
                  item.id === activeConversation.id ? "bg-white shadow-sm" : "bg-transparent hover:bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E7EB] flex-shrink-0">
                  <Image
                    src={item.avatar || "/main-dashboard.jpg"}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm font-semibold text-[#0B4B31]">
                    <span className="truncate max-w-[120px]">{item.name}</span>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#7C8580] truncate">{item.snippet}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] uppercase tracking-wide text-[#7C8580]">
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-semibold text-[#10B981] border border-[#CDEFD9] rounded-full px-2 py-0.5">
                      {item.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Conversation Detail */}
        <article className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F4F2] flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#E5E7EB]">
                <Image
                  src={activeConversation.avatar || "/main-dashboard.jpg"}
                  alt={activeConversation.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="font-semibold text-[#0B4B31]">{activeConversation.name}</p>
                <p className="text-xs text-[#7C8580]">
                  {activeConversation.tag} · Class A Motorhome
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#0B4B31]">
              {activeConversation.status}
            </span>
          </div>

          <div className="flex-1 px-6 py-8 bg-white space-y-6 overflow-y-auto">
            {messages.map((message) => {
              const isAdvisor = message.sender === "advisor";
              return (
                <div key={message.id} className={`flex ${isAdvisor ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[420px]`}>
                    <div
                      className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                        isAdvisor
                          ? "bg-[#F7A21B] text-white rounded-bl-none"
                          : "bg-[#F2F3F4] text-[#394240] rounded-br-none"
                      }`}
                    >
                      {message.text}
                    </div>
                    <p className={`text-xs mt-1 ${isAdvisor ? "text-[#D97706]" : "text-gray-400"} text-right`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#F0F4F2] px-6 py-4 bg-[#FAFAFA]">
            <div className="flex items-center bg-white border border-[#E0E6E3] rounded-full px-5 py-3 shadow-sm">
              <input
                placeholder="Type your message here..."
                className="flex-1 bg-transparent outline-none text-sm text-[#0B4B31]"
              />
              <button
                className="ml-3 bg-[#F7A21B] hover:bg-[#dd8c11] transition text-white rounded-full w-10 h-10 flex items-center justify-center shadow"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

