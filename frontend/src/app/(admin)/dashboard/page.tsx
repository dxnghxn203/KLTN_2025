"use client";

import { useToast } from "@/providers/toastProvider";

const Dashboard = () => {
  const toast = useToast();

  const showtext = () => {
    toast.showToast("Hello, this is a sdsge dvcddfdf", "success");

    setTimeout(function () {
      toast.showToast("Hello, this is a sdsge", "error");
    }, 1000);
    setTimeout(function () {
      toast.showToast("Hello, this is a sdsge", "warning");
    }
    , 2000);
    setTimeout(function () {
      toast.showToast("Hello, this is a sdsge", "info");
    }, 3000);
    setTimeout(function () {
      toast.showToast("Hello, this is a sdsge cdcd ", "default");
    }, 4000);
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
