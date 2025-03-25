"use client";
import React, { useState } from "react";
import {
  validatePassword,
  validateEmail,
  validateEmptyFields,
} from "@/utils/validation";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // Xóa lỗi khi người dùng thay đổi giá trị
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {
      username: "",
      gender: "",
      dateOfBirth: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    const emptyFieldError = validateEmptyFields(formData);
    if (emptyFieldError) {
      const field = emptyFieldError.match(/Trường (\w+)/)?.[1];
      // if (field) newErrors[field] = emptyFieldError;
    }

    // Kiểm tra email
    try {
      await validateEmail(formData.email);
    } catch (err: any) {
      newErrors.email = err.message;
    }

    // Kiểm tra mật khẩu
    try {
      await validatePassword(formData.password);
    } catch (err: any) {
      newErrors.password = err.message;
    }

    // Kiểm tra mật khẩu nhập lại
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và mật khẩu nhập lại không khớp.";
    }

    // Nếu có lỗi, cập nhật state lỗi
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    // Không có lỗi, chuyển trang
    window.location.href = "/register/verifyOTP";
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <form className="space-y-4 w-full" onSubmit={handleSubmit}>
        {/* Tên đăng nhập */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Tên đăng nhập
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        {/* Giới tính */}
        <div className="space-y-2">
          <label htmlFor="gender" className="text-sm font-medium">
            Giới tính
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Ngày sinh */}
        <div className="space-y-2">
          <label htmlFor="dateOfBirth" className="text-sm font-medium">
            Ngày sinh
          </label>
          <input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Mật khẩu */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
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
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full text-base font-bold text-white bg-blue-700 rounded-3xl py-4 mt-4"
        >
          Tiếp tục
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
