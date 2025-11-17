"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown, PlusIcon } from "lucide-react";
import { getCookie, deleteCookie } from "cookies-next";
import Chatbot from "@/components/dashboard/Chatbot";
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
  // More precise active state logic - only one item should be active at a time
  let isActive = false;

  if (hasSubmenu && subItems) {
    // For items with submenus (path is empty), check if any subItem matches the current pathname
    isActive = subItems.some(
      (subItem) =>
        pathname === subItem.path ||
        (subItem.path && pathname.startsWith(subItem.path + "/"))
    );
  } else if (path) {
    // For items without submenus, only match exact path
    // Don't use startsWith for parent paths to avoid multiple matches
    isActive = pathname === path;
  }

  const baseClasses = `
        flex items-center my-1 rounded-xl text-white cursor-pointer w-full
        transition-all duration-200
    `;

  const collapsedClasses = "justify-center p-2 w-10 h-10 mx-auto";
  const unCollapsedClasses = "px-3 py-3";
  console.log("get cookies data", getCookie("user"))
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

  const getUserRole = () => {
    try {
      if (userCookie) {
        const userData =
          typeof userCookie === "string"
            ? JSON.parse(userCookie)
            : userCookie;
        return userData?.role || "Admin";
      }
      return "Admin";
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      return "Admin";
    }
  };

  const userRole = getUserRole();

  const getNavItems = () => {
    const basePath = "/dashboard";

    const items = [
      {
        name: "Dashboard",
        icon: "/01.png",
        path: userRole === "Parent" ? "/dashboard/parent" : `${basePath}/dashboard`,
      },
      {
        name: "Parents",
        icon: "/Family Woman Woman.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Parents", path: "/dashboard/parent/parents" },
          { name: "Add Parent", path: `${basePath}/parent/add` },
          { name: "Waiting List", path: `${basePath}/parent/waiting-list` },
        ],
      },
      {
        name: "Students",
        icon: "/Graduation Cap.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Student", path: "/dashboard/student" },
          { name: "Add Student", path: `${basePath}/student/add` },
          { name: "Waiting List", path: `${basePath}/student/waiting-list` },
          { name: "Incidents", path: `${basePath}/incidents` },
        ],
      },
      {
        name: "Class",
        icon: "/Classroom.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Class", path: `${basePath}/class` },
          { name: "Subject", path: `${basePath}/subject` },
        ],
      },
      {
        name: "Learning",
        icon: "/Literature.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Learning", path: `${basePath}/learning` },
          { name: "Quran Tracker", path: `${basePath}/learning/quran-tracker` },
        ],
      },
      {
        name: "Attendance",
        icon: "/Checked User Male.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Attendance", path: `${basePath}/attendance` },
          { name: "Report By Class", path: `${basePath}/attendance/report-by-class` },
        ],
      },
      {
        name: "Finance",
        icon: "/Coins.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Invoice", path: `${basePath}/finance/invoice` },
          { name: "Invoices Report", path: `${basePath}/finance/invoice-report` },
          { name: "Payments", path: `${basePath}/finance/payment` },
        ],
      },
      {
        name: "Activities",
        icon: "/Rubik's Cube.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Activities", path: `${basePath}/activities` },
          { name: "Text Log", path: `${basePath}/activities/text-log` },
        ],
      },
      {
        name: "Send A Text",
        icon: "/SMS.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Send A Text", path: `${basePath}/text` },
          { name: "Schedule", path: `${basePath}/text/schedule` },
        ],
      },
    ];

    if (userRole === "Super Admin") {
      const teamItem = {
        name: "Team",
        icon: "/Staff.png",
        path: "",
        hasSubmenu: true,
        subItems: [
          { name: "Admin", path: `${basePath}/team/admin` },
          { name: "Staff", path: `${basePath}/team/staff` },
          { name: "Teachers", path: `${basePath}/team/teacher` },
          { name: "Permission", path: `${basePath}/team/permission` },
        ],
      };
      items.splice(3, 0, teamItem);
    }

    return items;
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
  }, [userRole]);

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

  // Only show header and action buttons on Parent and Student pages
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
      <main className="flex-1 bg-[#f3f3f3] overflow-auto h-screen p-6 pt-10">
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
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#B4B31] border border-[#0B4B31]/25 px-4 py-2 text-sm font-semibold text-[#0B4B31] transition hover:bg-[#F3F6F5]"
              >
                Archived Students
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/85"
              >
                <PlusIcon size={20} /> Add Students
              </button>
            </div>
          </div>
        )}
        {children}
      </main>
      <Chatbot />
    </div>
  );
}