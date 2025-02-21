"use client";
import { LuSearch } from "react-icons/lu";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi2";

import LocationDelivery from "./LocationDelivery";
import MenuHeader from "./MenuHeader";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Header chính */}
      <header className="bg-[#0053E2] h-[72px] w-full flex items-center justify-between px-10">
        {/* Giảm khoảng cách giữa LocationDelivery và Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/fc51114a36c58b35df723052a4789e3d3165c5e63dfdeb9c5ad43c09f3cb03e6?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
              alt="Company logo"
              className="object-contain shrink-0 max-w-full aspect-[2.16] w-[149px]"
            />
          </div>
          <LocationDelivery />

          {/* Ô tìm kiếm */}
          <div className="flex items-center bg-white rounded-full px-4 py-2 w-[480px] h-[48px]">
            <input
              type="text"
              placeholder="Nhập từ khóa hoặc sản phẩm..."
              className="w-full outline-none text-sm placeholder:text-black/40"
            />
            <button
              type="button"
              className="w-[32px] h-[32px] bg-[#002E99] rounded-full flex items-center justify-center shrink-0 hover:bg-[#001F70] transition"
            >
              <LuSearch className="text-white text-xl" />
            </button>
          </div>
        </div>

        {/* Giỏ hàng & Đăng nhập */}
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center cursor-pointer">
            <AiOutlineShoppingCart className="text-2xl" />
            <span className="ml-2 text-[14px] ">Giỏ hàng</span>
          </div>
          <div
            className="flex items-center cursor-pointer "
            onClick={() => (window.location.href = "/login")}
          >
            <HiOutlineUserCircle className="text-2xl" />
            <span className="ml-2 text-[14px] ">Đăng nhập</span>
          </div>
        </div>
      </header>

      {/* Menu cố định dưới header */}
      <MenuHeader />
    </div>
  );
}
