import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi2";

import LocationDelivery from "./locationDelivery";
import MenuHeader from "./menuHeader";
import LocationDialog from "@/components/dialog/locationDialog/locationDialog";

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  const cartItemCount = 3; // Thay bằng dữ liệu thực tế

  return (
    <div className="fixed top-0 left-0 w-full">
      <header className="bg-[#0053E2] h-[72px] w-full flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/fc51114a36c58b35df723052a4789e3d3165c5e63dfdeb9c5ad43c09f3cb03e6?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
                alt="Company logo"
                className="object-contain shrink-0 max-w-full aspect-[2.16] w-[149px]"
              />
            </div>
          </Link>

          {/* Bấm vào LocationDelivery để mở Dialog */}
          <div onClick={() => setIsDialogOpen(true)} className="cursor-pointer">
            <LocationDelivery />
          </div>

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
        <div className="flex items-center gap-2 text-white">
          <Link href="/cart" className="focus:outline-none">
            <div
              className={`relative flex items-center cursor-pointer px-3 py-1 rounded-full w-[120px] h-[48px] transition ${
                pathname === "/cart" ? "bg-[#002E99]" : "hover:bg-[#004BB7]"
              }`}
            >
              {/* Icon Giỏ hàng */}
              <div className="relative">
                <AiOutlineShoppingCart className="text-2xl" />

                {/* Badge số lượng sản phẩm */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>

              <span className="ml-2 text-[14px]">Giỏ hàng</span>
            </div>
          </Link>
          <Link href="/login" className="focus:outline-none">
            <div
              className={`relative flex items-center cursor-pointer px-2 py-1 rounded-full w-[120px] h-[48px] transition ${
                pathname === "/login" ? "bg-[#002E99]" : "hover:bg-[#004BB7]"
              }`}
            >
              <HiOutlineUserCircle className="text-2xl" />
              <span className="ml-2 text-[14px]">Đăng nhập</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Menu cố định dưới header */}
      <MenuHeader />

      {/* Dialog chọn vị trí */}
      <LocationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
