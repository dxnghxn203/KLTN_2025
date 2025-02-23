import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import google from "@/images/google.png";

const LoginForm: React.FC = () => {
  return (
    <div className="w-[393px] mx-auto">
      {/* Nút đăng nhập với Google */}
      <div className="flex justify-center items-center rounded-3xl border border-solid border-black border-opacity-10 h-[55px] w-full text-sm font-semibold text-black">
        <button className="flex items-center gap-2">
          <Image src={google} alt="" width={30} className="object-cover" />
          <span>Đăng nhập với Google</span>
        </button>
      </div>

      {/* Hoặc đăng nhập với email */}
      <div className="flex gap-2 items-center mt-4 text-sm text-black">
        <div className="flex-1 border-t-[0.5px] border-black border-opacity-10" />
        <div className="text-black/40">hoặc đăng nhập với email</div>
        <div className="flex-1 border-t-[0.5px] border-black border-opacity-10" />
      </div>

      {/* Form đăng nhập */}
      <form className="space-y-4 mt-4">
        {/* Tên đăng nhập */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Tên đăng nhập hoặc email
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none pr-10 transition-all"
            />
          </div>
        </div>

        {/* Mật khẩu */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none pr-10 transition-all"
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
        >
          Đăng nhập
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
