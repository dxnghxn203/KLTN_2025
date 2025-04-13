"use client";
import { ToastType } from "@/components/Toast/toast";
import { useAuth } from "@/hooks/useAuth";
import imgLoginAdmin from "@/images/loginAdmin.png";
import { useToast } from "@/providers/toastProvider";
import { validateEmail, validateEmptyFields } from "@/utils/validation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
export default function LoginPage() {
  const { loginAdmin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
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

    setIsLoading(true);
    loginAdmin(
      formData,
      () => {
        toast.showToast("Đăng nhập thành công", ToastType.SUCCESS);
        router.push("/admin");
      },
      (message: string) => {
        toast.showToast(message, ToastType.ERROR);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#C3E3F3]">
      <div className="flex w-[70%] h-[85%] rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="w-1/2 flex flex-col items-center justify-center text-white p-8 bg-[#EAF3FC]">
          <div className="">
            <Image src={imgLoginAdmin} alt="Illustration" />
          </div>
        </div>

        <div className="w-1/2 flex flex-col items-center justify-center p-12">
          <h2 className="text-3xl font-bold text-[#0053E2] mb-6">Đăng nhập</h2>
          <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <div className="relative mt-2">
                <input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                />

                <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                  <MdOutlineEmail />
                </span>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Mật khẩu
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="text-sm w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                />

                <span className="absolute left-2 inset-y-0 flex items-center text-gray-400">
                  <MdLockOutline />
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-end mb-4">
              <a
                href="#"
                className="text-sm text-[#0053E2] hover:underline font-medium"
              >
                Quên mật khẩu?
              </a>
            </div>
            <button
              disabled={isLoading}
              className={`w-full text-white text-sm font-semibold py-3 px-4 rounded-lg transition duration-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0053E2] hover:bg-blue-600"
              }`}
              type="submit"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <div className="mt-4 text-center text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <a
                href="#"
                className="text-[#0053E2] hover:underline font-medium"
              >
                Đăng ký
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
