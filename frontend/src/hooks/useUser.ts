import { fetchInsertUserStart, fetchSendOtpStart, fetchVerifyOtpStart } from "@/store";
import { insertUserSelector } from "@/store/user/userSelector";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "@/providers/authProvider";
import { useSession } from "next-auth/react";

export interface UserData {
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

export function useUser() {
  const dispatch = useDispatch();
  const insertUser: any = useSelector(insertUserSelector);
  const { data: session } = useSession();
  const { user, setUser, isLoading } = useAuthContext();

  // Lưu user data vào localStorage và state
  const saveUser = (userData: UserData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Xóa user data khỏi localStorage và state
  const clearUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Cập nhật user data
  const updateUser = (updatedData: Partial<UserData>) => {
    if (user) {
      const newUserData = { ...user, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
    }
  };

  // Hàm khởi động fetch dữ liệu cho tất cả danh mục
  const fetchInsertUser = ({
    param, onSuccess, onFailure
  }: {
    param: any;
    onSuccess: (message: string) => void;
    onFailure: (message: string) => void;
  }) => {
    dispatch(fetchInsertUserStart({
      ...param,
      onSuccess,
      onFailure
    }));
  };

  const verifyOtp = ({
    param, onSuccess, onFailure
  }: {
    param: any;
    onSuccess: (message: string) => void;
    onFailure: (message: string) => void;
  }) => {
    dispatch(fetchVerifyOtpStart({
      ...param,
      onSuccess,
      onFailure
    }));
  };

  const sendOtp = ({
    param, onSuccess, onFailure
  }: {
    param: any;
    onSuccess: (message: string) => void;
    onFailure: (message: string) => void;
  }) => {
    dispatch(fetchSendOtpStart({
      ...param,
      onSuccess,
      onFailure
    }));
  }

  return {
    insertUser,
    fetchInsertUser,
    verifyOtp,
    sendOtp,
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role_id === "admin",
    saveUser,
    clearUser,
    updateUser,
  };
}

