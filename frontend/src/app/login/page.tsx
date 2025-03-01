"use client";
import Header from "@/components/header/header";
import LoginForm from "./LoginForm";
import AlreadyLoggedIn from "./AlreadyLoggedIn";
import Footer from "@/components/footer/footer";
import { useAuth } from "@/store/auth/useAuth";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col items-center space-y-8 pt-14">
        <h1 className="mt-5 text-3xl font-extrabold text-black">
          {isAuthenticated ? "Bạn đã đăng nhập" : "Đăng nhập"}
        </h1>
        
        {isAuthenticated ? <AlreadyLoggedIn /> : <LoginForm />}
      </main>
      <Footer />
    </div>
  );
}
