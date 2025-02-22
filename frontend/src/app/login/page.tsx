"use client";
import Header from "@/components/header/Header";
import LoginForm from "./LoginForm";
import Footer from "@/components/footer/Footer";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main
        className="flex flex-col items-center space-y-8"
        style={{ paddingTop: "4rem" }}
      >
        <h1 className="text-3xl font-extrabold text-black ">Đăng nhập </h1>
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
