"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  Grid,
  Moon,
  ChevronDown,
  Users,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import CommunicationPanel from "@/components/dashboard/CommunicationPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsersData,
  getInbox,
  getUserConversations,
} from "@/redux/slices/messagesSlices/messagesSlices";
import { getCookie } from "cookies-next";
import { getUserName } from "@/utils/getCookies";

const roleOptions = [
  {
    id: "admin",
    title: "Admin Team",
    description: "Coordinate with leadership and support teams.",
    icon: ShieldCheck,
    role: "Admin",
  },
  {
    id: "subadmin",
    title: "Sub Admin",
    description: "Coordinate with leadership and support teams.",
    icon: ShieldCheck,
    role: "SubAdmin",
  },
  {
    id: "teacher",
    title: "Teachers",
    description: "Discuss classes, assignments, and academic updates.",
    icon: GraduationCap,
    role: "Teacher",
  },
  {
    id: "parent",
    title: "Parents",
    description: "Stay connected with guardians for student progress.",
    icon: Users,
    role: "Parent",
  },
  {
    id: "student",
    title: "Students",
    description: "Stay connected with guardians for student progress.",
    icon: Users,
    role: "Student",
  },
  {
    id: "superadmin",
    title: "Super Admin",
    description: "Coordinate with all administrative roles.",
    icon: ShieldCheck,
    role: "SuperAdmin",
  },
];

const roleCopy = {
  admin: {
    title: "Admin Communication Hub",
    subtitle: "Collaborate with school leadership and operations staff.",
  },
  teacher: {
    title: "Teacher Communication Hub",
    subtitle: "Share resources and coordinate lesson plans in real time.",
  },
  parent: {
    title: "Parent Communication Hub",
    subtitle: "Engage with families and share important student updates.",
  },
};

const parseUserCookie = (cookieValue) => {
  if (!cookieValue) return null;
  try {
    if (typeof cookieValue === "object") return cookieValue;
    if (typeof cookieValue === "string") {
      let decodedValue = cookieValue;
      try {
        decodedValue = decodeURIComponent(cookieValue);
      } catch (e) {}
      return JSON.parse(decodedValue);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const CommunicationPage = () => {
  const dispatch = useDispatch();
  const {
    usersList,
    loading,
    error,
    inbox,
    conversations: userConversations,
  } = useSelector((state) => state.message);
  const userName = getUserName();
  console.log("userName",userName);
  
  const [roleChoice, setRoleChoice] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRoleOption, setSelectedRoleOption] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    try {
      const userCookie = getCookie("user");
      const parsedUser = parseUserCookie(userCookie);
      setUserData(parsedUser);
    } catch (error) {
      setUserData(null);
    }
  }, []);

  const currentUser = useMemo(() => {
    if (!userData) return null;
    return {
      id: userData.id || userData._id || "unknown-id",
      role: userData.role || "Unknown",
      name: userData.name || "User",
    };
  }, [userData]);

  const filteredRoleOptions = useMemo(() => {
    if (!currentUser?.role) return roleOptions;

    const userRole = currentUser.role.toLowerCase();

    switch (userRole) {
      case "super admin":
        return roleOptions.filter((role) => role.id === "admin");

      case "admin":
        return roleOptions.filter((role) =>
          ["superadmin", "subadmin", "teacher", "student", "parent"].includes(
            role.id
          )
        );

      case "subadmin":
        return roleOptions.filter((role) => role.id === "admin");

      case "teacher":
        return roleOptions.filter((role) =>
          ["parent", "student"].includes(role.id)
        );

      case "parent":
        return roleOptions.filter((role) => role.id === "teacher");

      case "student":
        return roleOptions.filter((role) => role.id === "teacher");

      default:
        return [];
    }
  }, [currentUser?.role]);

  useEffect(() => {
    if (!currentUser?.id) return;

    dispatch(getInbox({ userId: currentUser.id, userModel: currentUser.role }));
    dispatch(
      getUserConversations({
        userId: currentUser.id,
        userModel:
          currentUser.role === "Super Admin" ? "User" : currentUser.role,
      })
    );
  }, [currentUser?.id, currentUser?.role, dispatch]);

  const activeRoleCopy = useMemo(() => {
    if (!selectedRole) return null;
    return roleCopy[selectedRole];
  }, [selectedRole]);

  const handleRoleSelect = useCallback(
    (roleId) => {
      const roleOption = filteredRoleOptions.find((role) => role.id === roleId);
      if (roleOption) {
        setRoleChoice(roleId);
        setSelectedRole(roleId);
        setSelectedRoleOption(roleOption);

        const currentUserRole = currentUser?.role.toLowerCase();
        const targetRoleId = roleOption.id;
        const targetRole = roleOption.role;

        if (currentUserRole === "admin" && targetRoleId === "superadmin") {
          dispatch(
            getUsersData({
              role: "superadmin",
              id: "get_superadmin",
            })
          );
        } else if (
          currentUserRole === "super admin" &&
          targetRoleId === "admin"
        ) {
          dispatch(
            getUsersData({
              role: "admin",
              id: "super_admin_all_admins",
            })
          );
        } else {
          dispatch(
            getUsersData({
              role: targetRole,
              id: currentUser.id,
            })
          );
        }
      }
    },
    [dispatch, filteredRoleOptions, currentUser]
  );

  const handleStartChat = useCallback(() => {
    if (roleChoice) {
      handleRoleSelect(roleChoice);
    }
  }, [roleChoice, handleRoleSelect]);

  const usersConversations = useMemo(() => {
    if (!currentUser?.id || !selectedRole) {
      return [];
    }

    const conversations = [];
    const addedUserIds = new Set();

    if (userConversations && userConversations.length > 0) {
      userConversations
        .filter((conv) => {
          const convModel =
            conv.participantModel === "Super Admin"
              ? "User"
              : conv.participantModel;
          const selectedModel = selectedRoleOption?.role || "";
          return convModel === selectedModel;
        })
        .forEach((conv) => {
          const roomId = [currentUser.id, conv.participantId].sort().join("_");

          let lastMessage = conv.lastMessage || "Start a conversation...";
          let lastMessageTime = "Online";

          if (conv.lastMessageTime) {
            try {
              const msgDate = new Date(conv.lastMessageTime);
              lastMessageTime = msgDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            } catch (e) {
              lastMessageTime = "Online";
            }
          }

          conversations.push({
            id: conv.participantId,
            name: conv.participantName || `${conv.participantModel} User`,
            snippet: lastMessage,
            time: lastMessageTime,
            status: "Active",
            tag: conv.participantModel,
            role: conv.participantModel,
            receiverModel: conv.participantModel,
            roomId: roomId,
            hasExistingConversation: true,
            unreadCount: conv.unreadCount || 0,
            conversationMessages: conv.messages || [],
          });

          addedUserIds.add(conv.participantId);
        });
    }

    if (usersList && usersList.length > 0) {
      usersList.forEach((user) => {
        let userData = user;
        let userId = user._id;

        if (user.subAdmin && typeof user.subAdmin === "object") {
          userData = { ...user.subAdmin, role: "SubAdmin" };
          userId = userData._id;

          if (user.parentAdmin) {
            userData.parentAdmin = user.parentAdmin;
          }
        }

        if (!addedUserIds.has(userId)) {
          const roomId = [currentUser.id, userId].sort().join("_");

          const userName =
            userData.name ||
            userData.fullName ||
            userData.username ||
            userData.studentName ||
            `${userData.role} User`;

          conversations.push({
            id: userId,
            name: userName,
            snippet: "Start a conversation...",
            time: "Online",
            status: "Active",
            tag: userData.role,
            role: userData.role,
            receiverModel: selectedRoleOption?.role || userData.role,
            roomId: roomId,
            hasExistingConversation: false,
            unreadCount: 0,
            conversationMessages: [],
            userData: userData,
          });
        }
      });
    }

    return conversations.sort((a, b) => {
      if (a.hasExistingConversation && !b.hasExistingConversation) return -1;
      if (!a.hasExistingConversation && b.hasExistingConversation) return 1;

      if (a.hasExistingConversation && b.hasExistingConversation) {
        const timeA = new Date(
          userConversations.find((c) => c.participantId === a.id)
            ?.lastMessageTime || 0
        );
        const timeB = new Date(
          userConversations.find((c) => c.participantId === b.id)
            ?.lastMessageTime || 0
        );
        return timeB - timeA;
      }

      return a.name.localeCompare(b.name);
    });
  }, [
    usersList,
    currentUser?.id,
    selectedRoleOption,
    userConversations,
    selectedRole,
  ]);

  const resetRoleSelection = useCallback(() => {
    setSelectedRole(null);
    setRoleChoice("");
    setSelectedRoleOption(null);
  }, []);

  const handleRefresh = useCallback(() => {
    if (currentUser?.id && currentUser?.role) {
      dispatch(
        getInbox({ userId: currentUser.id, userModel: currentUser.role })
      );
      dispatch(
        getUserConversations({
          userId: currentUser.id,
          userModel:
            currentUser.role === "Super Admin" ? "User" : currentUser.role,
        })
      );
    }
  }, [currentUser?.id, currentUser?.role, dispatch]);

  const communicationPanelProps = useMemo(
    () => ({
      panelTitle: activeRoleCopy?.title || "Live Conversations",
      subtitle:
        activeRoleCopy?.subtitle ||
        "Monitor, reply, and collaborate across roles",
      conversations: usersConversations,
      showUsersList: true,
      currentUser: currentUser,
      selectedRoleOption: selectedRoleOption,
      onRefresh: handleRefresh,
      userConversations: userConversations,
    }),
    [
      activeRoleCopy,
      usersConversations,
      currentUser,
      selectedRoleOption,
      handleRefresh,
      userConversations,
    ]
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#0B4B31]">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 py-2 sm:py-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
          {/* <div className="flex items-center border border-[#0B4B31] bg-white rounded-full px-4 py-2 flex-1 sm:flex-none min-w-[200px] shadow-sm">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-transparent focus:outline-none text-sm text-[#0B4B31] placeholder:text-[#979699]"
            />
          </div> */}

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
                {userName}
              </span>
              <ChevronDown size={16} className="text-[#0B4B31]" />
            </div>
          </div>
        </div>
      </header>

      <div className="mb-6">
        <p className="text-[2.5rem] font-semibold text-[#0B4B31] leading-tight">
          Communication Center
        </p>
        <p className="text-[1.25rem] text-[#5E6C64]">
          Seamless conversations between administrators, teachers, parents, and
          students
        </p>
      </div>

      {!selectedRole ? (
        <section className="rounded-[32px] border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-[#0B4B31]">
              Choose who you'd like to chat with
            </h2>
            <p className="text-sm text-[#5E6C64]">
              Select a role to filter conversations and keep your communication
              focused.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredRoleOptions.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`rounded-3xl border px-5 py-6 text-left transition shadow-sm ${
                  roleChoice === role.id
                    ? "border-[#0B4B31] bg-[#F2F7F5]"
                    : "border-[#E2E7E4] bg-white hover:border-[#0B4B31]/40"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0B4B31]/10 flex items-center justify-center text-[#0B4B31] mb-4">
                  <role.icon size={24} />
                </div>
                <p className="text-lg font-semibold text-[#0B4B31]">
                  {role.title}
                </p>
                <p className="text-sm text-[#5E6C64] mt-2">
                  {role.description}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#0B4B31] mb-2">
                Select Role
              </label>
              <select
                value={roleChoice}
                onChange={(e) => handleRoleSelect(e.target.value)}
                className="w-full rounded-full border border-[#0B4B31] bg-white px-4 py-3 text-sm text-[#0B4B31] focus:outline-none focus:ring-2 focus:ring-[#0B4B31]/40"
              >
                <option value="">Choose...</option>
                {filteredRoleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartChat}
              disabled={!roleChoice}
              className={`rounded-full px-8 py-3 text-sm font-semibold text-white transition ${
                roleChoice
                  ? "bg-[#0B4B31] hover:bg-[#0a3f27]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Start Chat
            </button>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          <button
            onClick={resetRoleSelection}
            className="inline-flex items-center text-sm text-[#0B4B31] font-semibold hover:underline"
          >
            ← Choose another role
          </button>

          {loading && (
            <div className="text-center py-8">
              <p className="text-[#0B4B31]">
                Loading{" "}
                {filteredRoleOptions.find((r) => r.id === selectedRole)?.title}
                ...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              <p>Error loading users: {error}</p>
            </div>
          )}

          {!error && <CommunicationPanel {...communicationPanelProps} />}
        </div>
      )}
    </div>
  );
};

export default CommunicationPage;