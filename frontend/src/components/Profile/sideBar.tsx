"use client";
import { FiUser, FiLogOut } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuFileClock } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import HistoryOrder from "@/components/Profile/historyOrder";
import PersonalInfomation from "./personalInfo";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen p-5">
      <div className="w-1/4">
        <div className="bg-[#F5F7F9] h-40 p-6 rounded-lg flex flex-col items-center justify-center">
          {user?.image ? (
            <img
              src={user?.image}
              alt={user.name || "User"}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <FiUser className="w-8 h-8 text-[#0053E2]" />
          )}
          <h2 className="text-lg text-black font-semibold mt-2">
            {user?.name}
          </h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
        <div className="bg-[#F5F7F9] mt-2 rounded-lg">
          <div>
            <Link href="/personal/personal-infomation">
              <button
                className={`font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer 
      ${
        pathname === "/personal" || pathname === "/personal/personal-infomation"
          ? "bg-[#F0F5FF] text-[#0053E2]"
          : "text-gray-800 hover:bg-[#EBEBEB]"
      }`}
              >
                <FaRegCircleUser className="mr-2 text-xl" />
                Thông tin cá nhân
              </button>
            </Link>

            <Link href="/personal/order-history">
              <button
                className={`px-4 py-4 font-medium w-full text-left flex items-center rounded-lg cursor-pointer 
                ${
                  pathname === "/personal/order-history"
                    ? "bg-[#F0F5FF] text-[#0053E2]"
                    : "text-gray-800 hover:bg-[#EBEBEB]"
                }`}
              >
                <LuFileClock className="mr-2 text-xl" />
                Lịch sử đơn hàng
              </button>
            </Link>

            <button
              className="font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer text-gray-800 hover:bg-[#EBEBEB]"
              onClick={logout}
            >
              <FiLogOut className="mr-2 text-xl" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5">
        {(pathname === "/personal" ||
          pathname === "/personal/personal-infomation") && (
          <PersonalInfomation />
        )}
        {pathname === "/personal/order-history" && <HistoryOrder />}
      </div>
    </div>
  );
};

export default Sidebar;
