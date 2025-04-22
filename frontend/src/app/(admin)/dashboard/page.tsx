"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/toastProvider";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const toast = useToast();
  const router = useRouter();
  const { admin } = useAuth();

  useEffect(() => {
    if (!admin) {
      router.push("/dang-nhap-admin");
    }
  }, [admin, router]);

  const showtext = () => {
    toast.showToast("Hello, this is a sdsge dvcddfdf", "success");

    setTimeout(() => {
      toast.showToast("Hello, this is a sdsge", "error");
    }, 1000);
    setTimeout(() => {
      toast.showToast("Hello, this is a sdsge", "warning");
    }, 2000);
    setTimeout(() => {
      toast.showToast("Hello, this is a sdsge", "info");
    }, 3000);
    setTimeout(() => {
      toast.showToast("Hello, this is a sdsge cdcd ", "default");
    }, 4000);
  };

  return (
    <>
      <h2>Welcome to the Dashboard</h2>
      <button onClick={showtext}>Click me</button>
    </>
  );
};

export default Dashboard;
