import { fetchChangePasswordAdminStart, fetchChangePasswordStart, fetchForgotPasswordAdminStart, fetchForgotPasswordStart, fetchGetAllUserAdminStart, fetchInsertUserStart, fetchSendOtpStart, fetchVerifyOtpStart } from "@/store";
import { insertUserSelector, selectAllUserAdmin } from "@/store/user/userSelector";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "@/providers/authProvider";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
  const allUserAdmin = useSelector(selectAllUserAdmin);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const saveUser = (userData: UserData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const clearUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedData: Partial<UserData>) => {
    if (user) {
      const newUserData = { ...user, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
    }
  };

  const getAllUser=() => {
    dispatch(fetchGetAllUserAdminStart({
      page: page,
      pageSize: pageSize
    }));
  };

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

  const forgotPasswordUser = (
    params: any,
    onSuccess: (message: string) => void,
    onFailure: (message: string) => void
  ) => {
    dispatch(fetchForgotPasswordStart({
      ...params,
      onSuccess,
      onFailure
    }));

  }

  const changePasswordUser = (
    params: any,
    onSuccess: (message: string) => void,
    onFailure: (message: string) => void
  ) => {
    dispatch(fetchChangePasswordStart({
      ...params,
      onSuccess,
      onFailure
    }));
  }

  const changePasswordAdmin = (
    params: any,
    onSuccess: (message: string) => void,
    onFailure: (message: string) => void
  ) => {
    dispatch(fetchChangePasswordAdminStart({
      ...params,
      onSuccess,
      onFailure
    }));
  }

  const forgotPasswordAdmin = (
    params: any,
    onSuccess: (message: string) => void,
    onFailure: (message: string) => void
  ) => {
    dispatch(fetchForgotPasswordAdminStart({
      ...params,
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
    getAllUser,
    allUserAdmin,
    page,
    setPage,
    pageSize,
    setPageSize,
    forgotPasswordUser,
    changePasswordUser,
    changePasswordAdmin,
    forgotPasswordAdmin,
  };
}

