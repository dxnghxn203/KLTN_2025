"use client";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import RegisterForm from "./registerForm";

export default function RegisterWithEmail() {
  const router = useRouter(); // Khởi tạo router

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col items-center space-y-8 pt-14">
        <div className=" mt-5 text-3xl font-extrabold text-black">Đăng ký</div>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}
