"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Search, Send, Clock, Check, CheckCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  sendMessage,
  markAsRead,
  getUserConversations
} from "@/redux/slices/messagesSlices/messagesSlices";
import socketService from "@/services/socketService";

const getInitials = (name) => {
  if (!name) return "US";
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const getBackgroundColor = (name) => {
  const colors = [
    'bg-[#FF6B6B]', 'bg-[#4ECDC4]', 'bg-[#45B7D1]', 'bg-[#96CEB4]', 'bg-[#FFEAA7]',
    'bg-[#DDA0DD]', 'bg-[#98D8C8]', 'bg-[#F7DC6F]', 'bg-[#BB8FCE]', 'bg-[#85C1E9]',
  ];
  const index = name?.charCodeAt(0) % colors.length;
  return colors[index];
};

const MessageStatus = memo(({ isRead, isSent, isCurrentUser }) => {
  if (!isCurrentUser) return null;
  if (!isSent) return <Clock size={12} className="text-gray-400" />;
  if (isRead) return <CheckCheck size={12} className="text-blue-500" />;
  return <Check size={12} className="text-gray-400" />;
});

MessageStatus.displayName = 'MessageStatus';

const useMessagesSelector = (activeConversation, currentUser) => {
  const inbox = useSelector(state => state.message.inbox, shallowEqual);
  const userConversations = useSelector(state => state.message.conversations, shallowEqual);

  return useMemo(() => {
    if (!activeConversation || !currentUser?.id) return [];

    // First, check if activeConversation has its own messages from userConversations
    const conversationFromList = userConversations?.find(conv => 
      conv.participantId === activeConversation.id
    );

    if (conversationFromList?.messages?.length > 0) {
      const sortedMessages = [...conversationFromList.messages].sort(
        (a, b) => {
          try {
            const timeA = new Date(a.createdAt || a.timestamp);
            const timeB = new Date(b.createdAt || b.timestamp);
            return timeA - timeB;
          } catch (error) {
            return 0;
          }
        }
      );
      return sortedMessages;
    }

    // If no conversation messages, check inbox
    if (!inbox || inbox.length === 0) return [];

    // Filter messages for the current conversation
    const conversationMessages = inbox.filter(msg => {
      const senderId = msg.sender?.$oid || msg.sender?._id || msg.sender;
      const receiverId = msg.receiver?.$oid || msg.receiver?._id || msg.receiver;
      const currentUserId = currentUser.id;
      const activeConvId = activeConversation.id;

      const isCurrentUserToActive = 
        senderId === currentUserId && 
        receiverId === activeConvId;

      const isActiveToCurrentUser = 
        senderId === activeConvId && 
        receiverId === currentUserId;

      return isCurrentUserToActive || isActiveToCurrentUser;
    });

    return conversationMessages.sort((a, b) => {
      try {
        const timeA = new Date(a.createdAt?.$date || a.createdAt || a.timestamp);
        const timeB = new Date(b.createdAt?.$date || b.createdAt || b.timestamp);
        return timeA - timeB;
      } catch (error) {
        return 0;
      }
    });
  }, [inbox, activeConversation, currentUser, userConversations]);
};

const useSocketStatus = () => {
  return useSelector(state => state.socket.isConnected, shallowEqual);
};

const CommunicationPanel = memo(({
  panelTitle = "Communication",
  subtitle = "Track every conversation in one place",
  conversations = [],
  className = "",
  showUsersList = false,
  currentUser = {},
  selectedRoleOption = null,
  onRefresh = null,
  userConversations = [],
}) => {
  const dispatch = useDispatch();
  const isConnected = useSocketStatus();

  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  
  const messages = useMessagesSelector(activeConversation, currentUser);

  // Set initial active conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  // Socket connection and room management
  useEffect(() => {
    if (!currentUser?.id) return;

    socketService.connect();
    socketService.userConnected({
      userId: currentUser.id,
      userModel: currentUser.role
    });

    return () => {
      if (activeConversation) {
        socketService.leaveRoom(activeConversation.roomId);
      }
    };
  }, [currentUser?.id, currentUser?.role]);

  // Join room when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const roomId = activeConversation.roomId;
    socketService.joinRoom(roomId);

    return () => {
      socketService.leaveRoom(roomId);
    };
  }, [activeConversation?.id]);

  // Refresh messages when active conversation changes
  useEffect(() => {
    if (activeConversation && currentUser?.id && onRefresh) {
      setMessagesLoading(true);
      // Use setTimeout to allow UI to update before refresh
      setTimeout(() => {
        onRefresh();
        setMessagesLoading(false);
      }, 100);
    }
  }, [activeConversation?.id, currentUser?.id]);

  // Mark messages as read
  useEffect(() => {
    if (!activeConversation || !currentUser?.id || messages.length === 0) return;

    const unreadMessages = messages.filter(msg =>
      !msg.isRead &&
      ((msg.receiver?.$oid === currentUser.id || msg.receiver?._id === currentUser.id || msg.receiver === currentUser.id) &&
        (msg.sender?.$oid === activeConversation.id || msg.sender?._id === activeConversation.id || msg.sender === activeConversation.id))
    );

    unreadMessages.forEach(msg => {
      if (msg._id && !msg._id.startsWith('temp_')) {
        dispatch(markAsRead(msg._id));
        socketService.markAsRead(msg._id);
      }
    });
  }, [messages, activeConversation?.id, currentUser?.id, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: messages.length > 10 ? "smooth" : "auto"
    });
  }, [messages]);

  // Socket message listener
  useEffect(() => {
    if (!socketService.socket) return;

    const handleSocketMessage = (message) => {
      if (activeConversation && currentUser?.id) {
        const isRelevantMessage = 
          (message.sender === activeConversation.id && message.receiver === currentUser.id) ||
          (message.receiver === activeConversation.id && message.sender === currentUser.id);
        
        if (isRelevantMessage && onRefresh) {
          // Small delay to ensure message is processed
          setTimeout(() => {
            onRefresh();
          }, 100);
        }
      }
    };

    socketService.socket.on('receiveMessage', handleSocketMessage);

    return () => {
      if (socketService.socket) {
        socketService.socket.off('receiveMessage', handleSocketMessage);
      }
    };
  }, [activeConversation?.id, currentUser?.id, onRefresh]);

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !activeConversation || !currentUser.id || sendingMessage) return;

    const roomId = [currentUser.id, activeConversation.id].sort().join('_');
    const messageContent = messageInput.trim();

    const senderModel = currentUser.role === "Super Admin" ? "User" : currentUser.role;
    const receiverModel = activeConversation.receiverModel === "Super Admin" ? "User" : activeConversation.receiverModel;

    const messageData = {
      sender: currentUser.id,
      senderModel: senderModel,
      receiver: activeConversation.id,
      receiverModel: receiverModel || activeConversation.role,
      message: messageContent,
      roomId: roomId,
      subject: "Message",
      attachments: []
    };

    setSendingMessage(true);
    setMessageInput("");

    try {
      await dispatch(sendMessage(messageData)).unwrap();

      // Force immediate refresh after sending message
      if (onRefresh) {
        setTimeout(() => {
          onRefresh();
        }, 200);
      }

    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageInput(messageContent);
    } finally {
      setSendingMessage(false);
    }
  }, [messageInput, activeConversation, currentUser, sendingMessage, dispatch, onRefresh]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleConversationSelect = useCallback((conversation) => {
    setActiveConversation(conversation);
    // Refresh when switching conversations
    if (onRefresh) {
      setTimeout(() => {
        onRefresh();
      }, 100);
    }
  }, [onRefresh]);

  const formatMessageTime = useCallback((timestamp) => {
    try {
      const date = new Date(timestamp?.$date || timestamp);
      if (isNaN(date.getTime())) return "Now";
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Now";
    }
  }, []);

  const formatMessageDate = useCallback((timestamp) => {
    try {
      const date = new Date(timestamp?.$date || timestamp);
      if (isNaN(date.getTime())) return "";
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return "";
    }
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation =>
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.snippet.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  const messageGroups = useMemo(() => {
    const groups = {};
    messages.forEach(message => {
      const date = formatMessageDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  }, [messages, formatMessageDate]);

  if (conversations.length === 0) {
    return (
      <section className={`rounded-[28px] bg-white border border-[#E2E7E4] shadow-sm overflow-hidden ${className}`}>
        <header className="flex items-center justify-between px-6 py-5 border-b border-[#F0F4F2]">
          <div>
            <p className="text-lg font-semibold text-[#0B4B31]">{panelTitle}</p>
            <p className="text-sm text-[#5E6C64]">{subtitle}</p>
          </div>
        </header>
        <div className="flex items-center justify-center py-16 text-[#5E6C64]">
          <p>No users found for this role.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`rounded-[28px] bg-white border border-[#E2E7E4] shadow-sm overflow-hidden ${className}`}>
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#F0F4F2] flex-wrap gap-3">
        <div>
          <p className="text-lg font-semibold text-[#0B4B31]">{panelTitle}</p>
          <p className="text-sm text-[#5E6C64]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isConnected
            ? "bg-[#E8F5E9] text-[#0B4B31]"
            : "bg-[#FFEBEE] text-[#D32F2F]"
            }`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#E3F2FD] text-[#1976D2]">
            {conversations.length} {showUsersList ? "Users" : "Conversations"}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-2 py-1 rounded-full text-xs font-semibold bg-[#FFF3E0] text-[#F57C00] hover:bg-[#FFE0B2] transition"
            >
              Refresh
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[600px]">
        <aside className="lg:w-80 border-r border-[#F0F4F2] bg-[#FAFAFA] flex flex-col">
          <div className="p-5">
            <p className="text-sm font-semibold text-[#38413D] mb-3">
              {showUsersList ? "Users" : "Conversations"}
            </p>
            <div className="flex items-center bg-white border border-[#E0E6E3] rounded-full px-3 py-2 shadow-sm">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                placeholder={showUsersList ? "Search Users..." : "Search Conversations..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm bg-transparent outline-none text-[#0B4B31] placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#F1F1F1]">
            {filteredConversations.map((item) => (
              <button
                key={item.id}
                onClick={() => handleConversationSelect(item)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left transition ${activeConversation?.id === item.id
                  ? "bg-white shadow-sm border-r-2 border-[#0B4B31]"
                  : "bg-transparent hover:bg-white"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${getBackgroundColor(item.name)}`}
                >
                  {getInitials(item.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm font-semibold text-[#0B4B31]">
                    <span className="truncate max-w-[120px]">{item.name}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#7C8580] truncate">{item.snippet}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] uppercase tracking-wide text-[#7C8580]">
                      {item.tag}
                    </span>
                    {item.unreadCount > 0 && (
                      <span className="text-[10px] font-semibold bg-red-500 text-white rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {item.unreadCount}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-[#10B981] border border-[#CDEFD9] rounded-full px-2 py-0.5">
                      {item.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <article className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F4F2] flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-base ${getBackgroundColor(activeConversation.name)}`}
                  >
                    {getInitials(activeConversation.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B4B31]">{activeConversation.name}</p>
                    <p className="text-xs text-[#7C8580]">
                      {activeConversation.tag} • {showUsersList ? "Start a conversation" : "Online"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#0B4B31]">
                  {activeConversation.status}
                </span>
              </div>

              <div
                ref={messageContainerRef}
                className="flex-1 px-6 py-4 bg-white overflow-y-auto max-h-[400px]"
              >
                {messagesLoading ? (
                  <div className="text-center py-16 text-[#5E6C64]">
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16 text-[#5E6C64]">
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Start the conversation by sending a message!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(messageGroups).map(([date, dateMessages]) => (
                      <div key={date}>
                        {date && (
                          <div className="flex justify-center my-4">
                            <span className="bg-[#F5F5F5] text-[#666] text-xs px-3 py-1 rounded-full">
                              {date}
                            </span>
                          </div>
                        )}
                        <div className="space-y-4">
                          {dateMessages.map((message) => {
                            const isCurrentUser = message.sender === currentUser.id ||
                              message.sender?._id === currentUser.id ||
                              message.sender?.$oid === currentUser.id;
                            const messageTime = formatMessageTime(message.createdAt);
                            const messageContent = message.message || message.content;

                            return (
                              <div
                                key={message._id || `msg-${Date.now()}-${Math.random()}`}
                                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                              >
                                <div className="max-w-[420px]">
                                  <div
                                    className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${isCurrentUser
                                      ? "bg-[#0B4B31] text-white rounded-bl-none"
                                      : "bg-[#F2F3F4] text-[#394240] rounded-br-none"
                                      }`}
                                  >
                                    {messageContent}
                                  </div>
                                  <div className={`flex items-center gap-2 mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                    <p className={`text-xs ${isCurrentUser ? "text-[#0B4B31]" : "text-gray-400"}`}>
                                      {messageTime}
                                    </p>
                                    <MessageStatus
                                      isRead={message.isRead}
                                      isSent={true}
                                      isCurrentUser={isCurrentUser}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-[#F0F4F2] px-6 py-4 bg-[#FAFAFA]">
                <div className="flex items-center bg-white border border-[#E0E6E3] rounded-full px-5 py-3 shadow-sm">
                  <input
                    placeholder="Type your message here..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sendingMessage || messagesLoading}
                    className="flex-1 bg-transparent outline-none text-sm text-[#0B4B31] disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendingMessage || messagesLoading}
                    className={`ml-3 transition text-white rounded-full w-10 h-10 flex items-center justify-center shadow ${!messageInput.trim() || sendingMessage || messagesLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0B4B31] hover:bg-[#0a3f27]"
                      }`}
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#5E6C64]">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
});

CommunicationPanel.displayName = 'CommunicationPanel';

export default CommunicationPanel;