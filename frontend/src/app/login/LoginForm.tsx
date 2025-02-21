import React, { useState } from "react";
import Image from "next/image";
import google from "../../../images/google.png";
import { X } from "lucide-react";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-medium">
            Tên đăng nhập hoặc email
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none pr-10 transition-all"
            />
            {username && (
              <button
                type="button"
                onClick={() => setUsername("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Mật khẩu */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none pr-10 transition-all"
            />
            {password && (
              <button
                type="button"
                onClick={() => setPassword("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Quên mật khẩu */}
        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm font-bold text-[#0053E2] hover:text-[#0042b4] transition-colors"
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
        <a
          href="#"
          className="font-bold text-[#0053E2] hover:text-[#0042b4] transition-colors"
        >
          Đăng ký ngay
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
