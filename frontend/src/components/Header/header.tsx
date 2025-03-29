"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
import Image from "next/image";
import { ImBin } from "react-icons/im";
import textlogo from "@/images/medicare.png";
import logoyellow from "@/images/MM.png";
import LocationDelivery from "./locationDelivery";
import MenuHeader from "./menuHeader";
import LocationDialog from "@/components/Dialog/locationDialog"; // Import from correct path
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Menu } from "antd";
import MenuFullDropdown from "./menuFullDropdown";

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartLocal, removeFromCart } = useCart();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCartDropdown(false);
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
    <>
      <div className="fixed top-0 left-0 w-full z-[50]">
        <header className="bg-[#0053E2] h-[72px] w-full flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="flex self-start whitespace-nowrap">
                  <Image
                    src={logoyellow}
                    alt=""
                    width={40}
                    height={40}
                    priority
                    className="object-contain aspect-square z-0"
                  />
                  <Image
                    src={textlogo}
                    alt=""
                    width={80}
                    height={80}
                    priority
                    className="top-1 ml-2 "
                  />
                </div>
              </div>
            </Link>
            <div
              onClick={() => setIsDialogOpen(true)}
              className="cursor-pointer ml-4"
            >
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
            <div
              className="relative"
              ref={cartDropdownRef}
              onMouseEnter={() => setShowCartDropdown(true)}
              onMouseLeave={() => setShowCartDropdown(false)}
            >
              <Link href="/gio-hang" className="focus:outline-none">
                <div
                  className={`relative flex items-center cursor-pointer px-3 py-1 ml-4 rounded-full w-[120px] h-[48px] transition ${pathname === "/cart" ? "bg-[#002E99]" : "hover:bg-[#004BB7]"
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

              {showCartDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-[60]">
                  <div className="p-4">
                    <h3 className="text-black font-semibold">Giỏ hàng của bạn</h3>

                    {!cartLocal || cartLocal.length === 0 ? (
                      <div className="py-6 text-center text-gray-500">
                        Giỏ hàng trống
                      </div>
                    ) : (
                      <>
                        <div
                          className={`max-h-[250px] overflow-y-auto ${cartLocal.length > 3 ? "scrollbar-thin" : ""
                            }`}
                        >
                          {cartLocal.map((item: any, index: any) => (
                            <div
                              key={item.id}
                              className={`flex py-3 ${index !== cartLocal.length - 1 ? "border-b" : ""
                                }`}
                            >
                              <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                <Image
                                  src={item.imageSrc}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                  className="object-cover"
                                  priority
                                />
                              </div>

                              <div className="ml-3 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {item.name}
                                  </h4>
                                </div>
                                <div className="flex ml-auto items-center justify-between w-full">
                                  <div className="text-[#0053E2] font-medium">
                                    {(item.price * item.quantity).toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    x{item.quantity} {item.unit}
                                  </span>
                                </div>
                              </div>
                              <button
                                className="ml-3 text-black/50 hover:text-red-800"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <ImBin className="text-lg hover:text-black/70" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <Link href="/gio-hang" legacyBehavior>
                          <a className="mt-4 text-sm block w-full py-2 px-4 bg-[#0053E2] text-white text-center font-medium rounded-3xl hover:bg-[#0042b4] transition-colors">
                            Xem giỏ hàng
                          </a>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {isAuthenticated ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className={`relative flex items-center cursor-pointer px-3 py-1 rounded-full min-w-[150px] h-[48px] transition ${showDropdown ? "bg-[#002E99]" : "hover:bg-[#004BB7]"
                      }`}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      {user?.image ? (
                        <img
                          src={user?.image}
                          alt={"User"}
                          className="text-2xl rounded-full object-cover"
                        />
                      ) : (
                        <HiOutlineUserCircle className="text-2xl" />
                      )}
                    </div>

                    <div className="ml-2 flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {user?.name || user?.user_name || ""}
                      </p>
                      <p className="text-xs text-white/70 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                    <IoChevronDownOutline
                      className={`ml-1 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""
                        }`}
                    />
                  </div>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                      <div className="py-2 text-sm">
                        <Link href="/ca-nhan">
                          <div className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                            Thông tin tài khoản
                          </div>
                        </Link>
                        <Link href="/ca-nhan/lich-su-don-hang">
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
              </>
            ) : (
              <Link href="/dang-nhap" className="focus:outline-none">
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
    </>
  );
}
