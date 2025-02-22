"use client";
import Header from "@/components/Header/Header";
import LoginForm from "./LoginForm";
import Footer from "@/components/Footer/Footer";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col items-center space-y-8 pt-14">
        <h1 className="mt-5 text-3xl font-extrabold text-black">Đăng nhập </h1>
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
