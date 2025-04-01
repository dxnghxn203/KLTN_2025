"use client";
import { useState } from "react";
import UserManagement from "@/components/Admin/User/userManagement";

const Dashboard = () => {

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
      <UserManagement />
    </div>
  );
};

export default Dashboard;
