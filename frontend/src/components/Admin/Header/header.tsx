import { IoMenuOutline, IoChevronDownOutline } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import avata from "@/images/avataadmin.jpg";
import { MdOutlineAccountCircle } from "react-icons/md";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="w-full bg-[#FAFBFB] p-4 flex items-center justify-between">
      {/* Nút Toggle Sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-gray-600 hover:text-gray-900"
      >
        <IoMenuOutline size={24} />
      </button>

      {/* Profile Dropdown */}
      <div className="relative">
        <div
          className="flex items-center cursor-pointer px-2 py-1 rounded-full hover:bg-gray-100 transition"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <HiOutlineUserCircle className="text-2xl" />
          <span className="ml-2 text-sm">
            Hi, <strong>Thuy Duyen</strong>
          </span>
          <IoChevronDownOutline className="ml-1" />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-4 mt-2 bg-white rounded-lg shadow-lg min-w-max z-10 overflow-hidden">
            <div className="py-2">
              <span className="px-4 py-2 font-semibold">User Profile</span>
              <div className="flex px-4 py-2 items-center">
                <Image
                  src={avata}
                  alt=""
                  height={80}
                  width={80}
                  className="rounded-full"
                />
                <div className="flex flex-col ml-4">
                  <span className="font-medium">Thuy Duyen</span>
                  <span className="text-gray-500 text-sm">Admin</span>
                  <div className="flex items-center text-gray-600 text-sm break-all">
                    <HiOutlineMail className="mr-1" />
                    <span className="whitespace-nowrap">
                      lethithuyduyen230803@gmail.com
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/personal">
                <div className="flex px-4 py-2 items-center hover:bg-gray-100 cursor-pointer space-x-1">
                  <MdOutlineAccountCircle className="text-xl" />
                  <div className="text-gray-800 ">Thông tin tài khoản</div>
                </div>
              </Link>
              <Link href="/personal/order-history">
                <div className="text-red-600 flex px-4 py-2 items-center hover:bg-gray-100 cursor-pointer space-x-1">
                  <FiLogOut className="text-lg" />
                  <div className="text-red-600 ">Đăng xuất</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
