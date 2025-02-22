"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserFromToken: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const updateUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ name: string; email: string }>(token);
        setUser({
          name: decoded.name,
          email: decoded.email,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    Cookies.remove('auth-token');
    setUser(null);
    router.push('/auth');
  };

  useEffect(() => {
    updateUserFromToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, updateUserFromToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};