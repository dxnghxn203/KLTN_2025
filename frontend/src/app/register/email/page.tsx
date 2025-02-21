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
      <main
        className="flex flex-col items-center space-y-8"
        style={{ paddingTop: "4rem" }}
      >
        <div className=" text-3xl font-extrabold text-black">Đăng ký</div>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}
