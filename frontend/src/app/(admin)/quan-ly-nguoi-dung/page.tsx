"use client";
import { useEffect, useState } from "react";
import UserManagement from "@/components/Admin/User/userManagement";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { admin } = useAuth();

  useEffect(() => {
    if (!admin) {
      router.push("/dang-nhap-admin");
    }
  }, [admin, router]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
      <UserManagement />
    </div>
  );
};

export default Dashboard;
