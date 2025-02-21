import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const RegisterForm: React.FC = () => {
  return (
    <div className="w-[393px] mx-auto h-full">
      <Link
        href="/register"
        className="absolute left-4 top-[130px] inline-flex items-center text-blue-700 hover:text-blue-800 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Quay lại</span>
      </Link>

      {/* Form đăng nhập */}
      <form className="space-y-4">
        {/* Tên đăng nhập */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Tên đăng nhập
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none pr-10 transition-all"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
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
        {/* Nhập lại mật khẩu */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type="password"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none pr-10 transition-all"
            />
          </div>
        </div>

        {/* Nút tạo tài khoản */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full text-base font-bold text-white bg-blue-700 rounded-3xl cursor-pointer border-[none] h-[55px] hover:bg-blue-800 transition-colors"
          >
            Tạo tài khoản
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
