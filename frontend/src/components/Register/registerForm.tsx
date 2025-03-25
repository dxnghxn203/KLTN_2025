"use client";
import React, { useState } from "react";
import { validatePassword } from "@/utils/validation";

const RegisterForm: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");
    // Kiểm tra mật khẩu
    validatePassword(null, password)
      .then(() => {
        // Kiểm tra mật khẩu khớp
        if (password !== confirmPassword) {
          setConfirmPasswordError("Mật khẩu và mật khẩu nhập lại không khớp.");
        } else {
          setConfirmPasswordError("");
          window.location.href = "/register/verifyOTP";
        }
      })
      .catch((err) => setPasswordError(err.message));
  };

  return (
    <div className="mt-8">
      <div className="flex justify-center items-center">
        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          {/* Tên đăng nhập */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>

          {/* Giới tính */}
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Giới tính
            </label>
            <select
              id="gender"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            >
              <option value="" className="text-gray-400">
                Chọn giới tính
              </option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Ngày sinh */}
          <div className="space-y-2">
            <label htmlFor="dateOfBirth" className="text-sm font-medium">
              Ngày sinh
            </label>
            <input
              id="dateOfBirth"
              type="date"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>

          {/* Mật khẩu */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-[55px] rounded-3xl px-4 border ${
                passwordError ? "border-red-500" : "border-black/10"
              } focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all`}
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Nhập lại mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full h-[55px] rounded-3xl px-4 border ${
                confirmPasswordError ? "border-red-500" : "border-black/10"
              } focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all`}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm">{confirmPasswordError}</p>
            )}
          </div>

          {/* Nút gửi */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full text-base font-bold text-white bg-blue-700 rounded-3xl h-[55px] hover:bg-blue-800 transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
