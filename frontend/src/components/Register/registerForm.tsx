import React from "react";

const RegisterForm: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="flex justify-center items-center">
        <form className="space-y-4 w-full ">
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

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Nhập lại mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full h-[55px] rounded-3xl px-4 border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none transition-all"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full text-base font-bold text-white bg-blue-700 rounded-3xl h-[55px] hover:bg-blue-800 transition-colors"
            >
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
