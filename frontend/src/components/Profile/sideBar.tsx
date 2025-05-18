"use client";
import { FiUser, FiLogOut } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuFileClock } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import HistoryOrder from "@/components/Profile/historyOrder";
import PersonalInfomation from "./personalInfo";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import { useToast } from "@/providers/toastProvider";
import { FaRegFileAlt } from "react-icons/fa";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout(
        "user",
        () => {
          // toast.showToast("Đăng xuất thành công", "success");
        },
        (error) => {
          toast.showToast(error, "error");
        }
      );

      toast.showToast("Đăng xuất thành công", "success");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex w-1/4 p-5">
      <div className="w-full">
        <div className="bg-[#F5F7F9] w-full h-40 rounded-lg flex flex-col items-center justify-center">
          {user?.image ? (
            <img
              src={user?.image}
              alt={user.name || "User"}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <HiOutlineUserCircle className="w-8 h-8 text-[#0053E2]" />
          )}
          <h2 className="text-lg text-black font-semibold mt-2">
            {user?.user_name}
          </h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
        <div className="bg-[#F5F7F9] w-full mt-2 rounded-lg">
          <div>
            <Link href="/ca-nhan/thong-tin-ca-nhan">
              <button
                className={`font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer 
      ${
        pathname === "/ca-nhan" || pathname === "/ca-nhan/thong-tin-ca-nhan"
          ? "bg-[#F0F5FF] text-[#0053E2]"
          : "text-gray-800 hover:bg-[#EBEBEB]"
      }`}
              >
                <FaRegCircleUser className="mr-2 text-xl" />
                Thông tin cá nhân
              </button>
            </Link>

            <Link href="/ca-nhan/lich-su-don-hang">
              <button
                className={`px-4 py-4 font-medium w-full text-left flex items-center rounded-lg cursor-pointer 
                ${
                  pathname === "/ca-nhan/lich-su-don-hang"
                    ? "bg-[#F0F5FF] text-[#0053E2]"
                    : "text-gray-800 hover:bg-[#EBEBEB]"
                }`}
              >
                <LuFileClock className="mr-2 text-xl" />
                Lịch sử đơn hàng
              </button>
            </Link>
            <Link href="/ca-nhan/don-thuoc-cua-toi">
              <button
                className={`px-4 py-4 font-medium w-full text-left flex items-center rounded-lg cursor-pointer 
                ${
                  pathname === "/ca-nhan/don-thuoc-cua-toi"
                    ? "bg-[#F0F5FF] text-[#0053E2]"
                    : "text-gray-800 hover:bg-[#EBEBEB]"
                }`}
              >
                <FaRegFileAlt className="mr-2 text-xl" />
                Đơn thuốc của tôi
              </button>
            </Link>
            <Link href="/ca-nhan/doi-mat-khau">
              <button
                className={`px-4 py-4 font-medium w-full text-left flex items-center rounded-lg cursor-pointer 
                ${
                  pathname === "/ca-nhan/doi-mat-khau"
                    ? "bg-[#F0F5FF] text-[#0053E2]"
                    : "text-gray-800 hover:bg-[#EBEBEB]"
                }`}
              >
                <MdLockOutline className="mr-2 text-xl" />
                Đổi mật khẩu
              </button>
            </Link>

            <button
              className="font-medium px-4 py-4 w-full text-left flex items-center rounded-lg cursor-pointer text-gray-800 hover:bg-[#EBEBEB]"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2 text-xl" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* <div className="flex-1">
        {(pathname === "/ca-nhan" ||
          pathname === "/ca-nhan/thong-tin-ca-nhan") && (
          <PersonalInfomation />
        )}
        {pathname === "/ca-nhan/lich-su-don-hang" && <HistoryOrder />}
      </div> */}
    </div>
  );
};

export default Sidebar;
