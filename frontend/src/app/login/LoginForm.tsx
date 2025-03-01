"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import google from "@/images/google.png";
import { useAuth } from "@/store/auth/useAuth";

const LoginForm: React.FC = () => {
  const { signInWithGoogle, logout, isLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signInWithGoogle();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalLoading(false);
  };

  const loadingGG = () => {
    return (
      <>
            <span>Đang xử lý...</span>
            <div className="w-5 h-5 border border-t-[3px] border-[#0053E2] rounded-full animate-spin" />
      </>
    )
  }

  return (
    <div className="w-[393px] mx-auto">
      <div className="flex justify-center items-center rounded-3xl border border-solid border-black border-opacity-10 h-[55px] w-full text-sm font-semibold text-black">
        <button 
          className="flex items-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isLoading || localLoading}
        >
          <Image src={google} alt="" width={30} className="object-cover" />
          {isLoading ? loadingGG() :<span>Đăng nhập với Google</span> }
        </button>
      </div>

      <div className="flex gap-2 items-center mt-4 text-sm text-black">
        <div className="flex-1 border-t-[0.5px] border-black border-opacity-10" />
        <div className="text-black/40">hoặc đăng nhập với số điện thoại</div>
        <div className="flex-1 border-t-[0.5px] border-black border-opacity-10" />
      </div>

      {/* Form đăng nhập */}
      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium">
            Số điện thoại đăng nhập
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>
        </div>

        {/* Mật khẩu */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>
        </div>

        {/* Quên mật khẩu */}
        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm font-bold text-[#0053E2] hover:text-[#002E99] transition-colors"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Nút đăng nhập */}
        <button
          type="submit"
          className="w-full h-[55px] rounded-3xl bg-[#0053E2] text-white font-bold hover:bg-[#0042b4] transition-colors"
          disabled={isLoading || localLoading}
        >
          {localLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      {/* Đăng ký */}
      <div className="flex gap-2 text-sm justify-center mt-4">
        <span className="font-medium">Bạn chưa có tài khoản?</span>
        <Link href="/register" legacyBehavior>
          <a className="font-bold text-[#0053E2] hover:text-[#002E99] transition-colors">
            Đăng ký ngay
          </a>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
