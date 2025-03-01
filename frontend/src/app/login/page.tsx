"use client";
import { useEffect } from "react";
import Header from "@/components/header/header";
import LoginForm from "./LoginForm";
import AlreadyLoggedIn from "./AlreadyLoggedIn";
import Footer from "@/components/footer/footer";
import { useAuth } from "@/store/auth/useAuth";
import { useToast } from "@/providers/ToastProvider";
import { ToastType } from "@/components/Toast/Toast";

export default function LoginPage() {
  const { isAuthenticated, error } = useAuth();
  const { showToast } = useToast();
  
  // Show success toast when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, showing success toast");
      showToast("Đăng nhập thành công!", ToastType.SUCCESS);
    }
  }, [isAuthenticated, showToast]);
  
  // Show error toast when there's an authentication error
  useEffect(() => {
    if (error) {
      console.log("Authentication error, showing error toast:", error);
      showToast(error, ToastType.ERROR);
    }
  }, [error, showToast]);
  
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
