"use client";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { validateEmptyFields } from "@/utils/validation";
import { useToast } from "@/providers/toastProvider";

const ForgetPassword = () => {
  const { forgotPasswordUser } = useUser();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emptyFieldErrors = validateEmptyFields(formData);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    forgotPasswordUser(
      formData,
      (message) => {
        toast.showToast(message, "success");
        setFormData({ email: "" });
      },
      (message) => {
        toast.showToast(message, "error");
      }
    );
  };
  return (
    <div className="flex flex-col items-center bg-white pt-[80px]">
      <main className="flex flex-col items-center w-full pt-14 mb-10">
        <div className="w-full px-6 items-center">
          <Link
            href="/dang-ky"
            className="inline-flex items-center text-blue-700 hover:text-[#002E99] transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Quay lại</span>
          </Link>
        </div>
        <div className="text-3xl font-extrabold text-black">Quên mật khẩu</div>
        <form
          className="space-y-4 mt-6 w-full max-w-[400px]"
          onSubmit={handleSubmit}
        >
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

          <button
            type="submit"
            className="w-full h-[55px] rounded-3xl bg-[#0053E2] text-white font-bold hover:bg-[#0042b4] transition-colors"
          >
            Gửi yêu cầu
          </button>
        </form>
      </main>
    </div>
  );
};

export default ForgetPassword;
