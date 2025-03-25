"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  validatePassword,
  validateEmail,
  validateEmptyFields,
} from "@/utils/validation";
import Link from "next/link";
import { fetchInsertUserStart } from "@/store";
import { useDispatch } from "react-redux";
import { useUser } from "@/hooks/useUser";
// useDispatch

const RegisterForm: React.FC = () => {
  const [isFormValid, setIsFormValid] = React.useState(false);
  const { insertUser, fetchInsertUser } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const router = useRouter();
  const dispatch = useDispatch();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // Xóa lỗi khi thay đổi giá trị
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường trống
    const emptyFieldErrors = validateEmptyFields(formData);

    // Tạo object để chứa lỗi
    const errors: { [key: string]: string } = { ...emptyFieldErrors };

    // Kiểm tra email
    if (!errors.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        errors.email = emailError; // Gán lỗi định dạng email nếu có
      }
    }

    // Kiểm tra mật khẩu
    if (!errors.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        errors.password = passwordError; // Gán lỗi định dạng mật khẩu nếu có
      }
    }
    if (!errors.confirmPassword) {
      if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
      }
    }

    // Cập nhật lỗi vào state nếu có
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setIsFormValid(false);
      return;
    }

    // Nếu không có lỗi, xử lý tiếp

    fetchInsertUser(formData);
    console.log("insert user: ", insertUser);
    if (insertUser) {
      setIsFormValid(true);
    }
    // setIsFormValid(true);
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
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium">
            Số điện thoại
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2]"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
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
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
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
        {/* Nút submit */}

        <div className="">
          {isFormValid ? (
            <Link
              href="/register/verifyOTP"
              className="block w-full text-center text-base font-bold text-white bg-blue-700 rounded-3xl py-4 mt-4"
            >
              Tiếp tục
            </Link>
          ) : (
            <button
              type="submit"
              className="w-full text-base font-bold text-white bg-blue-700 rounded-3xl py-4 mt-4"
            >
              Tiếp tục
            </button>
          )}
        </div>
        {/* <div className="">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full text-base font-bold text-white bg-blue-700 rounded-3xl py-4 mt-4"
          >
            Tiếp tục
          </button> */}
        {/* </div> */}
      </form>
    </div>
  );
};

export default RegisterForm;
