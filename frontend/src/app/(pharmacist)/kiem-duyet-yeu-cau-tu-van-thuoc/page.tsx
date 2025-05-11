"use client";
import ConsolutingList from "@/components/Pharmacist/Consulting/consultingList";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import RequestDetailPage from "@/components/Pharmacist/Consulting/approveConsoluting";

const Consulting = () => {
  const { pharmacist } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const detailId = searchParams.get("chi-tiet");
  const editId = searchParams.get("edit");
  const requestId = detailId || editId;

  useEffect(() => {
    if (!pharmacist) {
      router.push("/dang-nhap-admin");
    }
  }, [pharmacist, router]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFBFB] p-4">
      {requestId ? <RequestDetailPage /> : <ConsolutingList />}
    </div>
  );
};

export default Consulting;
