import Cookies from "js-cookie";

function parseUserCookie() {
  const userCookie = Cookies.get("user");
  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie);
  } catch (error) {
    console.error("Invalid user cookie JSON", error);
    return null;
  }
}

export function getAdminId() {
  const user = parseUserCookie();
  if (!user) return null;
  if (user?.adminId) {
    return user.adminId;
  }
  return user.id || null;
}

export function getUserId() {
  const user = parseUserCookie();
  return user?.id || null;
}

export function getUserName() {
  const user = parseUserCookie();
  return user?.userName || null;
}

export function getUserRole() {
  const user = parseUserCookie();
  return user?.role || null;
}

export function getUserBranch() {
  const user = parseUserCookie();
  return user?.branch || null;
}
