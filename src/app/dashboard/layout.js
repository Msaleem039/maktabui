"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { getCookie, deleteCookie } from "cookies-next";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "@/redux/slices/themeSlices/themeSlice";
import { getThemeByBranchAction } from "@/redux/slices/adminSlices/adminSlices";

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 19, g: 87, b: 74 };
};

const NavItem = ({
  name,
  Icon,
  path,
  pathname,
  router,
  activeBgColor = "#13574A",
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

  const getBgColor = () => {
    if (isActive) return activeBgColor;
    if (hasSubmenu && isOpen) {
      // Calculate 70% opacity
      const rgb = hexToRgb(activeBgColor);
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;
    }
    return "transparent";
  };

  const getHoverColor = () => {
    const rgb = hexToRgb(activeBgColor);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`;
  };

  return (
    <div>
      <button
        onClick={() => (hasSubmenu ? onToggle() : router.push(path))}
        style={{
          backgroundColor: getBgColor(),
        }}
        onMouseEnter={(e) => {
          if (!isActive && !(hasSubmenu && isOpen)) {
            e.currentTarget.style.backgroundColor = getHoverColor();
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive && !(hasSubmenu && isOpen)) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
        className={`
                    ${baseClasses}
                    ${isCollapsed ? collapsedClasses : unCollapsedClasses}
                `}
        title={isCollapsed ? name : undefined}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "space-x-0" : "space-x-4"
          }`}
        >
          {Icon ? (
            typeof Icon === "string" ? (
              <div
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-80"
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
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-80"
                }`}
              />
            )
          ) : (
            <div className="w-5 h-5" />
          )}

          {!isCollapsed && (
            <span
              className={`font-medium text-sm leading-5 tracking-normal transition-all duration-200 ${
                isActive ? "text-white" : "text-white/90"
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
                className={`text-white/80 transition-transform duration-200 ${
                  isOpen ? "rotate-0" : "-rotate-90"
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

const SubNavItem = ({ name, path, pathname, router, isCollapsed, activeBgColor }) => {
  const isActive = pathname === path;
  const rgb = hexToRgb(activeBgColor || "#13574A");

  return (
    <button
      onClick={() => router.push(path)}
      style={{
        background: isActive
          ? `linear-gradient(to right, ${activeBgColor || "#13574A"}, ${activeBgColor || "#13574A"}CC)`
          : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
      className={`
            flex items-center w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 group relative
            ${
              isActive
                ? "text-white shadow-md"
                : "text-white/80 hover:text-white hover:pl-6"
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
        className={`w-2 h-2 mr-3 transition-all duration-200 ${
          isActive
            ? "opacity-100 scale-110"
            : "opacity-40 group-hover:opacity-70 group-hover:scale-110"
        }`}
      >
        <div className="w-full h-full bg-current rounded-full" />
      </div>

      <span
        className={`font-medium transition-all duration-200 ${
          isActive ? "text-white" : "group-hover:text-white"
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
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const userCookie = getCookie("user");

  const reduxUser = useSelector((state) => state.user?.userInfo);
  const reduxRole = reduxUser?.role;
  const reduxPermissions = reduxUser?.permissions;
  const theme = useSelector((state) => state.theme);
  const sidebarBgColor = theme.themeColor || "#0B4B31";
  const activeBgColor = theme.secondaryColor || "#13574A";
  const logoUrl = theme.logo || "/01.png";

  const getUserData = useCallback(() => {
    let role = null;
    let permissions = null;

    if (reduxRole) {
      role = reduxRole;
      permissions = reduxPermissions;
    } else {
      try {
        if (userCookie) {
          const userData =
            typeof userCookie === "string"
              ? JSON.parse(userCookie)
              : userCookie;
          role = userData?.role;
          permissions = userData?.permissions;
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    if (role) {
      const normalizedRole = role.trim();
      if (
        normalizedRole.toLowerCase() === "super admin" ||
        normalizedRole === "SuperAdmin"
      ) {
        return { role: "Super Admin", permissions };
      }
      if (normalizedRole.toLowerCase() === "admin") {
        return { role: "Admin", permissions };
      }
      if (
        normalizedRole.toLowerCase() === "subadmin" ||
        normalizedRole.toLowerCase() === "sub admin"
      ) {
        return { role: "Sub Admin", permissions };
      }
      if (normalizedRole.toLowerCase() === "teacher") {
        return { role: "Teacher", permissions };
      }
      if (normalizedRole.toLowerCase() === "student") {
        return { role: "Student", permissions };
      }
      if (normalizedRole.toLowerCase() === "parent") {
        return { role: "Parent", permissions };
      }
      return { role: normalizedRole, permissions };
    }

    return { role: null, permissions: null };
  }, [reduxRole, reduxPermissions, userCookie]);

  const { role: userRole, permissions: userPermissions } = useMemo(
    () => getUserData(),
    [getUserData]
  );

  // Set user data loaded after role and permissions are determined
  useEffect(() => {
    if (userRole) {
      setIsUserDataLoaded(true);
    }
  }, [userRole]);

  const hasPermission = useCallback(
    (permissionKey) => {
      if (userRole !== "Sub Admin") return true;
      if (!userPermissions || !Array.isArray(userPermissions)) return false;

      return userPermissions.some((perm) => perm[permissionKey] === true);
    },
    [userRole, userPermissions]
  );

  const getNavItems = useCallback(() => {
    const basePath = "/dashboard";

    const allItems = {
      communication: {
        name: "Communication",
        icon: "/SMS.png",
        path: `${basePath}/communication`,
      },
      parents: {
        name: "Parents",
        icon: "/Family Woman Woman.png",
        hasSubmenu: true,
        subItems: [
          { name: "Parents", path: `${basePath}/parent` },
          { name: "Add Parent", path: `${basePath}/parent/add` },
          { name: "Waiting List", path: `${basePath}/parent/waitlist` },
        ],
        permission: "manageParents",
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
        permission: "manageStudents",
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
        permission: "manageClasses",
      },
      assignment: {
        name: "Assignment",
        icon: "/Classroom.png",
        hasSubmenu: true,
        subItems: [
          { name: "Assignments", path: `${basePath}/assignment` },
          { name: "C Assignment", path: `${basePath}/assignment/add` },
          {
            name: "S Assignment",
            path: `${basePath}/assignment/submittedAssignment`,
          },
          { name: "Grade", path: `${basePath}/grade` },
        ],
        permission: "manageAssignments",
      },
      notifications: {
        name: "Notification",
        icon: "/Literature.png",
        hasSubmenu: true,
        subItems: [
          { name: "Notifications", path: `${basePath}/notifications` },
        ],
        permission: "manageNotifications",
      },
      attendance: {
        name: "Attendance",
        icon: "/Checked User Male.png",
        hasSubmenu: true,
        subItems: [{ name: "Mark Attendance", path: `${basePath}/attendance` }],
        permission: "manageAttendance",
      },
      finance: {
        name: "Finance",
        icon: "/Coins.png",
        hasSubmenu: true,
        subItems: [
          { name: "Invoice", path: `${basePath}/finance/invoice` },
          {
            name: "Invoices Report",
            path: `${basePath}/finance/invoice-report`,
          },
          {
            name: "Create Invoices",
            path: `${basePath}/finance/invoice/add`,
            hideForRoles: ["Super Admin"],
          },
          { name: "Payments", path: `${basePath}/finance/payment` },
        ],
        permission: "manageFinance",
      },
      events: {
        name: "Events",
        icon: "/event.png",
        hasSubmenu: true,
        subItems: [
          { name: "Events", path: `${basePath}/events` },
          { name: "Create Event", path: `${basePath}/events/create` },
        ],
        permission: "manageEvents",
      },
      team: {
        name: "Team",
        icon: "/Staff.png",
        hasSubmenu: true,
        subItems: [],
        permission: "manageTeachers",
      },
      myChildren: {
        name: "My Children",
        icon: "/Children.png",
        hasSubmenu: true,
        subItems: [
          { name: "My Children", path: `${basePath}/parent/my-children` },
        ],
      },
    };

    const roleDashboardItems = {
      "Super Admin": {
        name: "Dashboard",
        icon: "/01.png",
        path: `${basePath}/dashboard`,
      },
      Admin: {
        name: "Dashboard",
        icon: "/01.png",
        path: `${basePath}/admin-dashboard`,
      },
      "Sub Admin": {
        name: "Dashboard",
        icon: "/01.png",
        path: `${basePath}/admin-dashboard`,
      },
      Teacher: {
        name: "Dashboard",
        icon: "/01.png",
        path: `${basePath}/teacher/dashboard`,
      },
      Student: {
        name: "Dashboard",
        icon: "/01.png",
        path: `${basePath}/student/dashboard`,
      },
      Parent: {
        name: "Dashboard",
        icon: "/01.png",
        path: `${basePath}/parent/dashboard`,
      },
    };

    if (userRole === "Super Admin") {
      allItems.team.subItems = [
        { name: "Admin", path: `${basePath}/team/admin` },
      ];
    } else if (userRole === "Admin") {
      allItems.team.subItems = [
        { name: "Sub Admin", path: `${basePath}/team/sub-admin` },
        { name: "Teachers", path: `${basePath}/team/teacher` },
      ];
    } else if (userRole === "Sub Admin") {
      allItems.team.subItems = [
        { name: "Teachers", path: `${basePath}/team/teacher` },
      ];
    } else {
      allItems.team.subItems = [
        { name: "Admin", path: `${basePath}/team/admin` },
        { name: "Teachers", path: `${basePath}/team/teacher` },
      ];
    }

    const shouldIncludeItem = (item) => {
      if (userRole !== "Sub Admin") return true;
      if (!item.permission) return true;
      return hasPermission(item.permission);
    };

    switch (userRole) {
      case "Super Admin":
        return [
          roleDashboardItems[userRole],
          allItems.team,
          {
            ...allItems.finance,
            subItems: allItems.finance.subItems.filter(
              (item) => !item.hideForRoles?.includes("Super Admin")
            ),
          },
          allItems.communication,
        ];

      case "Admin":
        return [
          roleDashboardItems[userRole],
          allItems.communication,
          allItems.parents,
          allItems.students,
          allItems.class,
          allItems.notifications,
          allItems.finance,
          allItems.events,
          allItems.team,
          {
            name: "Settings",
            icon: "/Settings.png",
            path: `${basePath}/settings`,
          },
        ];

      case "Sub Admin":
        const subAdminItems = [roleDashboardItems[userRole]];

        if (shouldIncludeItem(allItems.communication))
          subAdminItems.push(allItems.communication);
        if (shouldIncludeItem(allItems.parents))
          subAdminItems.push(allItems.parents);
        if (shouldIncludeItem(allItems.students))
          subAdminItems.push(allItems.students);
        if (shouldIncludeItem(allItems.class))
          subAdminItems.push(allItems.class);
        if (shouldIncludeItem(allItems.assignment))
          subAdminItems.push(allItems.assignment);
        if (shouldIncludeItem(allItems.notifications))
          subAdminItems.push(allItems.notifications);
        if (shouldIncludeItem(allItems.attendance))
          subAdminItems.push(allItems.attendance);
        if (shouldIncludeItem(allItems.finance))
          subAdminItems.push(allItems.finance);
        if (shouldIncludeItem(allItems.events))
          subAdminItems.push(allItems.events);
        if (shouldIncludeItem(allItems.team)) subAdminItems.push(allItems.team);

        return subAdminItems;

      case "Teacher":
        return [
          roleDashboardItems[userRole],
          allItems.class,
          {
            ...allItems.students,
            subItems: allItems.students.subItems.filter(
              (item) => item.name === "Student"
            ),
          },
          {
            ...allItems.assignment,
            subItems: allItems.assignment.subItems.filter(
              (item) =>
                item.name === "C Assignment" || item.name === "S Assignment"
            ),
          },
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
              (item) => item.name === "Assignments" || item.name === "Grade"
            ),
          },
          {
            ...allItems.class,
            subItems: allItems.class.subItems.filter(
              (item) =>
                item.name !== "Subject" &&
                item.name !== "Create Class" &&
                item.name !== "Timetable"
            ),
          },
          allItems.notifications,
          allItems.communication,
        ];

      case "Parent":
        return [
          roleDashboardItems[userRole],
          allItems.myChildren, // Add My Children menu for Parent role
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
          allItems.communication,
        ];

      default:
        return [
          roleDashboardItems["Admin"],
          allItems.communication,
          allItems.parents,
          allItems.students,
          allItems.class,
          allItems.assignment,
          allItems.notifications,
          allItems.attendance,
          allItems.finance,
          allItems.events,
          allItems.team,
        ];
    }
  }, [userRole, userPermissions, hasPermission]);

  const navItems = useMemo(() => getNavItems(), [getNavItems]);

  const sidebarBg = "bg-[#0B4B31]";
  const activeBg = "bg-[#13574A]";

  const handleToggleSubmenu = useCallback((menuName) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  }, []);

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

  // Don't render sidebar until user data is loaded
  if (!isUserDataLoaded) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div
        style={{ backgroundColor: sidebarBgColor }}
        className={`
          fixed lg:static top-0 left-0 h-screen flex flex-col justify-between p-4 shadow-2xl
          transition-all duration-300 ease-in-out z-50
          ${
            isCollapsed
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
            className={`transform transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : "rotate-0"
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
            className={`flex items-center space-x-2 text-white p-2 pt-16 sm:pt-10 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-6 h-6">
              <Image
                src={logoUrl}
                alt={theme.mainText || "MaktabOS"}
                width={24}
                height={24}
                className="w-full h-full object-contain"
                unoptimized={logoUrl.startsWith("http")}
              />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold tracking-wider">{theme.mainText || "MaktabOS"}</h1>
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
                  activeBgColor={activeBgColor}
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
                        activeBgColor={activeBgColor}
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
            style={{ color: sidebarBgColor }}
            className="w-full bg-white font-normal rounded-2xl py-3 flex items-center justify-center gap-2 shadow-sm hover:bg-gray-100 transition-all"
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
  const [isInitializing, setIsInitializing] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const reduxUser = useSelector((state) => state.user?.userInfo);
  const sidebarBgColor = theme.themeColor || "#0B4B31";

  const showStudentHeader =
    pathname?.includes("/parent") ||
    pathname?.includes("/student") ||
    pathname === "/dashboard/student";

  // Load theme from branch on mount
  useEffect(() => {
    const loadThemeByBranch = async () => {
      // Get user role to check if they have permission
      let userRole = null;
      try {
        const userCookie = getCookie("user");
        if (userCookie) {
          const userData = typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
          userRole = userData?.role;
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }

      // Normalize role
      const normalizedRole = userRole?.trim().toLowerCase();
      const isAdminOrSubAdmin = 
        normalizedRole === "admin" || 
        normalizedRole === "subadmin" || 
        normalizedRole === "sub admin" ||
        normalizedRole === "super admin" ||
        normalizedRole === "superadmin";

      // Only fetch theme for Admin or SubAdmin users
      if (!isAdminOrSubAdmin) {
        return;
      }

      // Try to get branch from user data
      const branch = reduxUser?.admin?.branch || reduxUser?.branch || reduxUser?.admin?.branchName;
      
      // If no branch in Redux, try to get from cookie
      let userBranch = branch;
      if (!userBranch) {
        try {
          const userCookie = getCookie("user");
          if (userCookie) {
            const userData = typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
            userBranch = userData?.branch || userData?.admin?.branch;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
        }
      }

      // If still no branch, use default
      const branchToUse = userBranch || "Main Branch";

      // Only fetch if theme is not already loaded (check current theme state)
      const isDefaultTheme = !theme.themeColor || theme.themeColor === "#0B4B31";
      if (isDefaultTheme) {
        try {
          const themeResult = await dispatch(getThemeByBranchAction(branchToUse)).unwrap();
          if (themeResult?.success && themeResult?.theme) {
            const theme = themeResult.theme;
            dispatch(setTheme({
              themeColor: theme.themeColor || "#0B4B31",
              secondaryColor: theme.secondaryColor || "#13574A",
              logo: theme.logo || "",
              favicon: theme.favicon || "",
              mainText: theme.mainText || "MaktabOS",
            }));
          }
        } catch (themeError) {
          // Only log error if it's not a permission error
          if (!themeError?.includes?.("Access denied") && !themeError?.includes?.("role required")) {
            console.error("Failed to fetch theme by branch:", themeError);
          }
          // Fallback to websiteSettings if available
          if (reduxUser?.admin?.websiteSettings) {
            const websiteSettings = reduxUser.admin.websiteSettings;
            dispatch(setTheme({
              themeColor: websiteSettings.themeColor || "#0B4B31",
              secondaryColor: websiteSettings.secondaryColor || "#13574A",
              logo: websiteSettings.logo || "",
              favicon: websiteSettings.favicon || "",
              mainText: websiteSettings.mainText || "MaktabOS",
            }));
          }
        }
      }
    };

    loadThemeByBranch();
  }, [reduxUser, dispatch, theme.themeColor]);

  // Handle Sub Admin redirect and initialization
  useEffect(() => {
    const userCookie = getCookie("user");
    let userRole = null;

    try {
      if (userCookie) {
        const userData =
          typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
        userRole = userData?.role;
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setIsInitializing(false);
      return;
    }

    if (userRole) {
      const normalizedRole = userRole.trim().toLowerCase();

      if (normalizedRole === "subadmin" || normalizedRole === "sub admin") {
        // Only redirect if they're on the root dashboard path
        if (pathname === "/dashboard") {
          window.location.href = "/dashboard/communication";
          return;
        }
        // Don't redirect if they're already on a valid dashboard page
        if (
          pathname === "/dashboard/admin-dashboard" ||
          pathname === "/dashboard/communication" ||
          pathname?.startsWith("/dashboard/communication/")
        ) {
          setIsInitializing(false);
          return;
        }
      }
    }

    setIsInitializing(false);
  }, [pathname, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]"></div>
    );
  }

  return (
    <div
      className="min-h-screen flex overflow-hidden relative"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: sidebarBgColor }}
          className="lg:hidden fixed top-6 left-4 z-[60] text-white p-3 rounded-md shadow-md transition-colors hover:opacity-90"
          aria-label="Toggle menu"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z"
          />
        </svg>
      </button>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-1 bg-[#f3f3f3] overflow-auto h-screen p-6 pt-20 lg:pt-6">
        {showStudentHeader && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-3">
            <div>
              <p className="text-[2.5rem] font-[600]" style={{ color: sidebarBgColor }}>
                Welcome to
              </p>
              <p className="text-[1.75rem] font-[500] text-black">{theme.mainText || "MaktabOS"}</p>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}