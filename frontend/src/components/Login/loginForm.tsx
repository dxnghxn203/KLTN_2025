"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import google from "@/images/google.png";
import { useToast } from "@/providers/toastProvider";
import { ToastType } from "@/components/Toast/toast";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail, validateEmptyFields } from "@/utils/validation";

const LoginForm: React.FC = () => {
  const { signInWithGoogle, login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [localLoadingGG, setLocalLoadingGG] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    setLocalLoadingGG(true);
    e.preventDefault();
    try {
      await signInWithGoogle();
      toast.showToast("Đăng nhập bằng Google thành công", ToastType.SUCCESS);
      setLocalLoadingGG(false);
    } catch (error) {
      toast.showToast("Đăng nhập bằng Google thất bại", ToastType.ERROR);
      setLocalLoadingGG(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // Xóa lỗi khi thay đổi giá trị
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emptyFieldErrors = validateEmptyFields(formData);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };
    if (!errors.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        errors.email = emailError;
      }
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    setLocalLoading(true);
    toast.showToast("Đang xử lý đăng nhập...", ToastType.INFO);
    //
    
  };

  const loadingGG = () => {
    return (
      <>
        <span>Đang xử lý...</span>
        <div className="w-5 h-5 border border-t-[3px] border-[#0053E2] rounded-full animate-spin" />
      </>
    );
  };

  return (
    <div className="w-[393px] mx-auto">
      <div className="flex justify-center items-center rounded-3xl border border-solid border-black border-opacity-10 h-[55px] w-full text-sm font-semibold text-black">
        <button
          className="flex items-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={localLoading}
        >
          <Image src={google} alt="" width={30} className="object-cover" />
          {localLoading ? loadingGG() : <span>Đăng nhập với Google</span>}
        </button>
      </div>

      <div className="flex gap-2 items-center mt-4 text-sm text-black">
        <div className="flex-1 border-t-[0.5px] border-black border-opacity-10" />
        <div className="text-black/40">hoặc đăng nhập với email</div>
        <div className="flex-1 border-t-[0.5px] border-black border-opacity-10" />
      </div>

      <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email đăng nhập
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
            <input
              id="email"
              placeholder=""
              value={formData.email}
              onChange={handleChange}
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm font-bold text-[#0053E2] hover:text-[#002E99] transition-colors"
          >
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          className="w-full h-[55px] rounded-3xl bg-[#0053E2] text-white font-bold hover:bg-[#0042b4] transition-colors"
          disabled={isLoading || localLoading}
        >
          {localLoading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <div className="flex gap-2 text-sm justify-center mt-4">
        <span className="font-medium">Bạn chưa có tài khoản?</span>
        <Link href="/dang-ky" legacyBehavior>
          <a className="font-bold text-[#0053E2] hover:text-[#002E99] transition-colors">
            Đăng ký ngay
          </a>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
