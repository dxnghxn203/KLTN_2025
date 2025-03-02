"use client";
import { useRouter } from "next/navigation";
import RegisterForm from "./RegisterForm";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/Footer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterWithEmail() {
  const router = useRouter(); // Khởi tạo router

  return (
    <div className="flex flex-col items-center bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col items-center w-full pt-14">
        <div className="w-full px-6">
          <Link
            href="/register"
            className="inline-flex items-center text-blue-700 hover:text-[#002E99] transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </Link>
        </div>
        <div className="text-3xl font-extrabold text-black">Đăng ký</div>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}
