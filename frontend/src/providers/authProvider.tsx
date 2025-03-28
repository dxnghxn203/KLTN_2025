"use client";

import { SessionProvider, useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  _id: string;
  phone_number: string;
  user_name: string;
  email: string;
  gender: string;
  auth_provider: string;
  birthday: string;
  role_id: string;
  active: boolean;
  verified_email_at: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Khi session thay đổi, kiểm tra localStorage hoặc api
    if (status === "authenticated") {
      // Kiểm tra xem có dữ liệu người dùng trong localStorage không
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data from localStorage");
        }
      } else if (session?.user) {
        // Nếu không có trong localStorage nhưng có trong session, cần gọi API để lấy thông tin chi tiết
        // Ví dụ code gọi API:
        // fetchUserData(session.user.email).then(userData => {
        //   setUser(userData);
        //   localStorage.setItem("user", JSON.stringify(userData));
        // });
      }
    }
    setIsLoading(status === "loading");
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}
