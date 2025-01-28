"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  name: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserFromToken: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

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
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Initialize user data from token when provider mounts
  useEffect(() => {
    updateUserFromToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, updateUserFromToken }}>
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
