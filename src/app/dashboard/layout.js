"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown, PlusIcon } from "lucide-react";
import { getCookie, deleteCookie } from "cookies-next";
import { useSelector } from "react-redux";

const NavItem = ({
  name,
  Icon,
  path,
  pathname,
  router,
  activeBg,
  isCollapsed,
  hasSubmenu,
  isOpen,
  onToggle,
  children,
  subItems,
}) => {
  let isActive = false;

  if (hasSubmenu && subItems) {
    isActive = subItems.some(
      (subItem) =>
        pathname === subItem.path ||
        (subItem.path && pathname.startsWith(subItem.path + "/"))
    );
  } else if (path) {
    isActive = pathname === path;
  }

  const baseClasses = `
        flex items-center my-1 rounded-xl text-white cursor-pointer w-full
        transition-all duration-200
    `;

  const collapsedClasses = "justify-center p-2 w-10 h-10 mx-auto";
  const unCollapsedClasses = "px-3 py-3";

  return (
    <div>
      <button
        onClick={() => (hasSubmenu ? onToggle() : router.push(path))}
        className={`
                    ${baseClasses}
                    ${isCollapsed ? collapsedClasses : unCollapsedClasses}
                    ${isActive
            ? "bg-[#13574A]"
            : hasSubmenu && isOpen
              ? "bg-[#0F5B3F]/70"
              : "hover:bg-[#13574A]/45"
          }
                `}
        title={isCollapsed ? name : undefined}
      >
        <div
          className={`flex items-center ${isCollapsed ? "space-x-0" : "space-x-4"
            }`}
        >
          {Icon ? (
            typeof Icon === "string" ? (
              <div
                className={`w-5 h-5 transition-all duration-200 ${isActive ? "opacity-100" : "opacity-80"
                  }`}
              >
                <Image
                  src={Icon}
                  alt={name}
                  width={21}
                  height={21}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${isActive ? "opacity-100" : "opacity-80"
                  }`}
              />
            )
          ) : (
            <div className="w-5 h-5" />
          )}

          {!isCollapsed && (
            <span
              className={`font-medium text-sm leading-5 tracking-normal transition-all duration-200 ${isActive ? "text-white" : "text-white/90"
                }`}
            >
              {name}
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className="ml-auto flex items-center pr-1">
            {hasSubmenu ? (
              <ChevronDown
                size={18}
                className={`text-white/80 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"
                  }`}
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-white/40 -rotate-90 transition-transform duration-200"
              />
            )}
          </div>
        )}
      </button>

      {!isCollapsed && hasSubmenu && isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#13574A]/30 pl-3 py-2">
          {children}
        </div>
      )}
    </div>
  );
};

const SubNavItem = ({ name, path, pathname, router, isCollapsed }) => {
  const isActive = pathname === path;

  return (
    <button
      onClick={() => router.push(path)}
      className={`
            flex items-center w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 group relative
            ${isActive
          ? "bg-gradient-to-r from-[#13574A] to-[#13574A]/80 text-white shadow-md"
          : "text-white/80 hover:bg-[#13574A]/20 hover:text-white hover:pl-6"
        }
        `}
    >
      {isActive && (
        <div className="absolute -left-5 w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>
      )}

      {!isActive && (
        <div className="absolute -left-5 w-1 h-1 bg-white/0 rounded-full transition-all duration-200 group-hover:bg-white/60 group-hover:w-1.5 group-hover:h-1.5"></div>
      )}

      <div
        className={`w-2 h-2 mr-3 transition-all duration-200 ${isActive
          ? "opacity-100 scale-110"
          : "opacity-40 group-hover:opacity-70 group-hover:scale-110"
          }`}
      >
        <div className="w-full h-full bg-current rounded-full" />
      </div>

      <span
        className={`font-medium transition-all duration-200 ${isActive ? "text-white" : "group-hover:text-white"
          }`}
      >
        {name}
      </span>
    </button>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [navItems, setNavItems] = useState([]);
  const userCookie = getCookie("user");

  // Get user role from Redux state
  const reduxUser = useSelector((state) => state.user?.userInfo);
  const reduxRole = reduxUser?.role;

  const getUserRole = () => {
    let role = null;

    // First try Redux state
    if (reduxRole) {
      role = reduxRole;
    } else {
      // Fallback to cookie
      try {
        if (userCookie) {
          const userData =
            typeof userCookie === "string"
              ? JSON.parse(userCookie)
              : userCookie;
          role = userData?.role;
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    if (role) {
      const normalizedRole = role.trim();
      if (normalizedRole.toLowerCase() === "super admin" || normalizedRole === "SuperAdmin") {
        return "Super Admin";
      }
      if (normalizedRole.toLowerCase() === "admin") {
        return "Admin";
      }
      if (normalizedRole.toLowerCase() === "teacher") {
        return "Teacher";
      }
      if (normalizedRole.toLowerCase() === "student") {
        return "Student";
      }
      if (normalizedRole.toLowerCase() === "parent") {
        return "Parent";
      }
      return normalizedRole;
    }

    return "Admin";
  };

  const userRole = getUserRole();

  const getNavItems = () => {
    const basePath = "/dashboard";

    const allItems = {
      dashboard: { name: "Dashboard", icon: "/01.png", path: `${basePath}/dashboard` },
      communication: { name: "Communication", icon: "/SMS.png", path: `${basePath}/communication` },
      parents: {
        name: "Parents",
        icon: "/Family Woman Woman.png",
        hasSubmenu: true,
        subItems: [
          { name: "Parents", path: `${basePath}/parent` },
          { name: "Add Parent", path: `${basePath}/parent/add` },
          { name: "Waiting List", path: `${basePath}/parent/waitlist` },
        ],
      },
      students: {
        name: "Students",
        icon: "/Graduation Cap.png",
        hasSubmenu: true,
        subItems: [
          { name: "Student", path: `${basePath}/student` },
          { name: "Add Student", path: `${basePath}/student/add` },
          { name: "Waiting List", path: `${basePath}/student/waiting-list` },
        ],
      },
      class: {
        name: "Class",
        icon: "/Classroom.png",
        hasSubmenu: true,
        subItems: [
          { name: "Class", path: `${basePath}/class` },
          { name: "Create Class", path: `${basePath}/class/createClass` },
          { name: "Timetable", path: `${basePath}/class/timetable` },
        ],
      },
      assignment: {
        name: "Assignment",
        icon: "/Classroom.png",
        hasSubmenu: true,
        subItems: [
          { name: "Assignments", path: `${basePath}/assignment` },
          { name: "Create Assignment", path: `${basePath}/assignment/add` },
          { name: "Submitted Assignment", path: `${basePath}/assignment/submittedAssignment` },
          { name: "Grade", path: `${basePath}/grade` },
        ],
      },
      notifications: {
        name: "Notification",
        icon: "/Literature.png",
        hasSubmenu: true,
        subItems: [{ name: "Notifications", path: `${basePath}/notifications` }],
      },
      attendance: {
        name: "Attendance",
        icon: "/Checked User Male.png",
        hasSubmenu: true,
        subItems: [{ name: "Mark Attendance", path: `${basePath}/attendance` }],
      },
      finance: {
        name: "Finance",
        icon: "/Coins.png",
        hasSubmenu: true,
        subItems: [
          { name: "Invoice", path: `${basePath}/finance/invoice` },
          { name: "Invoices Report", path: `${basePath}/finance/invoice-report` },
          { name: "Create Invoices", path: `${basePath}/finance/invoice/add` },
          { name: "Payments", path: `${basePath}/finance/payment` },
        ],
      },
      activities: {
        name: "Activities",
        icon: "/Rubik's Cube.png",
        hasSubmenu: true,
        subItems: [
          { name: "Activities", path: `${basePath}/activities` },
          { name: "Text Log", path: `${basePath}/activities/text-log` },
        ],
      },
      text: {
        name: "Send A Text",
        icon: "/SMS.png",
        hasSubmenu: true,
        subItems: [
          { name: "Send A Text", path: `${basePath}/text` },
          { name: "Schedule", path: `${basePath}/text/schedule` },
        ],
      },
      events: {
        name: "Events",
        icon: "/Calendar.png",
        hasSubmenu: true,
        subItems: [
          { name: "Send Event", path: `${basePath}/events` },
          { name: "Create Event", path: `${basePath}/events/create` },
        ],
      },
      team: {
        name: "Team",
        icon: "/Staff.png",
        hasSubmenu: true,
        subItems: [
          { name: "Admin", path: `${basePath}/team/admin` },
          { name: "Teachers", path: `${basePath}/team/teacher` },
          { name: "Permission", path: `${basePath}/team/permission` },
        ],
      },
      settings: { name: "Settings", icon: "/settings.jpeg", path: `${basePath}/s` },
    };

    const roleDashboardItems = {
      "Super Admin": allItems.dashboard,
      "Admin": allItems.dashboard,
      "Teacher": { ...allItems.dashboard, path: `${basePath}/teacher/dashboard` },
      "Student": { ...allItems.dashboard, path: `${basePath}/student/dashboard` },
      "Parent": { ...allItems.dashboard, path: `${basePath}/parent/dashboard` }
    };

    switch (userRole) {
      case "Super Admin":
      case "Admin":
        return [
          roleDashboardItems[userRole],
          allItems.parents,
          allItems.students,
          allItems.class,
          allItems.assignment,
          allItems.notifications,
          allItems.settings,
          allItems.attendance,
          allItems.finance,
          allItems.activities,
          allItems.text,
          allItems.events,
          allItems.communication,
          allItems.team,
        ];

      case "Teacher":
        return [
          roleDashboardItems[userRole],
          allItems.class,
          {
            ...allItems.students,
            subItems: allItems.students.subItems.filter(
              (item) => item.name === "Student"
            )
          },
          {
            ...allItems.assignment,
            subItems: allItems.assignment.subItems.filter(
              (item) => item.name === "Create Assignment" || item.name === "Submitted Assignment"
            )
          },
          allItems.settings,
          allItems.notifications,
          allItems.attendance,
          allItems.communication,
        ];

      case "Student":
        return [
          roleDashboardItems[userRole],
          {
            ...allItems.assignment,
            subItems: allItems.assignment.subItems.filter(
              (item) =>
                item.name === "Assignments" ||
                item.name === "Grade"
            )
          },
          {
            ...allItems.class,
            subItems: allItems.class.subItems.filter(
              (item) => item.name !== "Subject" && item.name !== "Create Class" && item.name !== "Timetable"
            )
          },
          allItems.notifications,
          allItems.settings,
          allItems.communication,
        ];

      case "Parent":
        return [
          roleDashboardItems[userRole],
          {
            ...allItems.finance,
            subItems: allItems.finance.subItems.filter(
              (i) => i.name === "Invoice" || i.name === "Payments"
            ),
          },
          {
            ...allItems.assignment,
            subItems: allItems.assignment.subItems.filter(
              (i) => i.name === "Assignments" || i.name === "Grade"
            ),
          },
          allItems.notifications,
          allItems.settings,
          allItems.communication,
        ];

      default:
        return [allItems.dashboard, allItems.communication];
    }
  };

  const sidebarBg = "bg-[#0B4B31]";
  const activeBg = "bg-[#13574A]";

  const handleToggleSubmenu = (menuName) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  useEffect(() => {
    setNavItems(getNavItems());
  }, [userRole, reduxRole]);

  useEffect(() => {
    const newOpenSubmenus = {};
    navItems.forEach((item) => {
      if (item.hasSubmenu && item.subItems) {
        const shouldBeOpen = item.subItems.some(
          (subItem) =>
            pathname === subItem.path || pathname.startsWith(subItem.path)
        );
        if (shouldBeOpen) {
          newOpenSubmenus[item.name] = true;
        }
      }
    });
    setOpenSubmenus(newOpenSubmenus);
  }, [pathname, navItems]);

  const handleLogout = () => {
    deleteCookie("user");
    deleteCookie("token");
    deleteCookie("authToken");
    deleteCookie("accessToken");
    deleteCookie("refreshToken");

    router.push("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        className={`
          fixed lg:static top-0 left-0 h-screen ${sidebarBg} flex flex-col justify-between p-4 shadow-2xl
          transition-all duration-300 ease-in-out z-50
          ${isCollapsed
            ? "w-20"
            : "w-[70%] sm:w-[45%] md:w-[32%] lg:w-[220px] min-w-[200px] max-w-[220px]"
          }
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          rounded-tr-[28px] rounded-br-[28px]
        `}
      >
        {/* Collapse button */}
        <div
          className="absolute right-0 top-[170px] -translate-y-1/2 translate-x-1/2 cursor-pointer 
               hidden lg:flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "24px",
            border: "0.5px solid #F5EFEB52",
            background: "#bccdc5",
          }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div
            className={`transform transition-transform duration-300 ${isCollapsed ? "rotate-180" : "rotate-0"
              }`}
          >
            <Image
              src="/collapsable-arrow.png"
              alt="toggle sidebar"
              width={12}
              height={6}
              className="w-3 h-1.5 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-8 overflow-y-auto flex-grow">
          <div
            className={`flex items-center space-x-2 text-white p-2 pt-10 ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <div className="w-6 h-6">
              <Image
                src="/01.png"
                alt="MaktabOS"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold tracking-wider">MaktabOS</h1>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            {!isCollapsed && (
              <h2 className="text-xs font-semibold uppercase text-white/50 px-2 tracking-widest">
                MAIN
              </h2>
            )}
            <nav>
              {navItems.map((item) => (
                <NavItem
                  key={item.name}
                  name={item.name}
                  Icon={item.icon}
                  path={item.path}
                  pathname={pathname}
                  router={router}
                  activeBg={activeBg}
                  isCollapsed={isCollapsed}
                  hasSubmenu={item.hasSubmenu}
                  isOpen={openSubmenus[item.name]}
                  onToggle={() => handleToggleSubmenu(item.name)}
                  subItems={item.subItems}
                >
                  {item.hasSubmenu &&
                    item.subItems.map((subItem) => (
                      <SubNavItem
                        key={subItem.path}
                        name={subItem.name}
                        path={subItem.path}
                        pathname={pathname}
                        router={router}
                        isCollapsed={isCollapsed}
                      />
                    ))}
                </NavItem>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 mt-2">
          <button
            onClick={handleLogout}
            className="w-full bg-white text-[#0B4B31] font-normal rounded-2xl py-3 flex items-center justify-center gap-2 shadow-sm hover:bg-gray-100 transition-all"
          >
            <Image
              src="/Logout.png"
              alt="logout"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />

            {!isCollapsed && (
              <>
                <span>Log Out</span>
                <Image
                  src="/Icon.png"
                  alt="icon"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const showStudentHeader = pathname?.includes("/parent") || pathname?.includes("/student") || pathname === "/dashboard/student";

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ fontFamily: "Inter, sans-serif" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#0B4B31] text-white p-3 rounded-md shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" />
        </svg>
      </button>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1 bg-[#f3f3f3] overflow-auto h-screen p-6 pt-10 pb-16 sm:pb-20">
        {showStudentHeader && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-3">
            <div>
              <p className="text-[2.5rem] font-[600]  text-[#0B4B31]">
                Welcome to
              </p>
              <p className="text-[1.75rem] font-[500] text-black ">
                MaktabOS
              </p>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}