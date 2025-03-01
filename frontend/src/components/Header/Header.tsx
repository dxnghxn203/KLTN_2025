import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";

import LocationDelivery from "./locationDelivery";
import MenuHeader from "./menuHeader";
import LocationDialog from "@/components/dialog/locationDialog/locationDialog";
import { useAuth } from "@/store/auth/useAuth";
import { useCart } from "@/store/cart/useCart";  // Import from correct path

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartLocal } = useCart();  // Make sure you're using the correct property name

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };


  return (
    <div className="fixed top-0 left-0 w-full z-[50]">
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

          <div onClick={() => setIsDialogOpen(true)} className="cursor-pointer">
            <LocationDelivery />
          </div>

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

        <div className="flex items-center gap-2 text-white">
          <Link href="/cart" className="focus:outline-none">
            <div
              className={`relative flex items-center cursor-pointer px-3 py-1 rounded-full w-[120px] h-[48px] transition ${pathname === "/cart" ? "bg-[#002E99]" : "hover:bg-[#004BB7]"
                }`}
            >
              <div className="relative">
                <AiOutlineShoppingCart className="text-2xl" />

                {cartLocal && cartLocal.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartLocal.length}
                  </span>
                )}
              </div>

              <span className="ml-2 text-[14px]">Giỏ hàng</span>
            </div>
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className={`relative flex items-center cursor-pointer px-3 py-1 rounded-full min-w-[150px] h-[48px] transition ${showDropdown ? "bg-[#002E99]" : "hover:bg-[#004BB7]"
                  }`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <HiOutlineUserCircle className="text-2xl" />
                </div>

                <div className="ml-2 flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {user?.name || 'hxn203'}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {user?.email || ''}
                  </p>
                </div>
                <IoChevronDownOutline
                  className={`ml-1 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                />
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                  <div className="py-2 text-sm">
                    <Link href="/profile">
                      <div className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                        Thông tin tài khoản
                      </div>
                    </Link>
                    <Link href="/orders">
                      <div className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                        Lịch sử đơn hàng
                      </div>
                    </Link>
                    <div
                      className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="mr-2" />
                      Đăng xuất
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="focus:outline-none">
              <div
                className={`relative flex items-center cursor-pointer px-2 py-1 rounded-full w-[120px] h-[48px] transition ${pathname === "/login" ? "bg-[#002E99]" : "hover:bg-[#004BB7]"
                  }`}
              >
                <HiOutlineUserCircle className="text-2xl" />
                <span className="ml-2 text-[14px]">Đăng nhập</span>
              </div>
            </Link>
          )}
        </div>
      </header>

      <MenuHeader />

      <LocationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
