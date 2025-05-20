"use client";
import DiscountManagement from "@/components/Admin/Discount/managementDiscount";
import Order from "@/components/Admin/Order/orderManagement";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <DiscountManagement />
    </div>
  );
};

export default Dashboard;
