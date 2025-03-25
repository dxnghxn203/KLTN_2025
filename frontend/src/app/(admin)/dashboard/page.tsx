"use client";

import { useToast } from "@/providers/toastProvider";

const Dashboard = () => {
  const toast = useToast();
  
  const showtext = () => {
    toast.showToast("Hello, this is a sdsge dvcddfdf", "success");
    toast.showToast("Hello, this is a sdsge", "error");
    toast.showToast("Hello, this is a sdsge", "warning");
    toast.showToast("Hello, this is a sdsge", "info");
    toast.showToast("Hello, this is a sdsge cdcd ", "default");
    //chỉnh UI tại frontend/src/components/Toast/toast.tsx
  };

  return (
    <>
      <h2>Welcome to the Dashboard</h2>
      <button onClick={() => showtext()}>Click me</button>
    </>
  );
};

export default Dashboard;
