import {jwtDecode} from "jwt-decode";

// Updated interfaces to match new schema
interface UserInfo {
    userId: string;
    name: string;
    email: string;
  }


export const getUserInfo = (): UserInfo | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ userId: string; name: string; email: string }>(token);
    return {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    };
  } catch {
    return null;
  }
};
