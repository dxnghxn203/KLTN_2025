import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHome, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";

const AlreadyLoggedIn: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // router.push("/");
    }
  }, [countdown, router]);

  console.log(user);
  return (
    <div className="w-[393px] mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          {user?.image ? (
            <img
              src={user?.image}
              alt={user.name || "User"}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <FiUser className="w-8 h-8 text-[#0053E2]" />
          )}
        </div>

        <h2 className="text-xl font-semibold mb-1">{user?.name || "hxn203"}</h2>

        <p className="text-gray-500 text-sm mb-4">
          {user?.email || "dxnghxn203@gmail.com"}
        </p>

        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
          <p>Bạn đã đăng nhập thành công!</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <p className="text-sm">Bạn sẽ được chuyển hướng trong</p>
            <span className="text-sm font-bold bg-green-200 px-2 py-0.5 rounded-full">
              {countdown}s
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <Link href="/">
          <div className="flex items-center justify-center gap-2 w-full h-[55px] rounded-3xl bg-[#0053E2] text-white font-medium hover:bg-[#0042b4] transition-colors">
            <FiHome className="text-lg" />
            <span>Đi đến trang chủ</span>
          </div>
        </Link>

        <Link href="/personal">
          <div className="flex items-center justify-center gap-2 w-full h-[55px] rounded-3xl border border-[#0053E2] text-[#0053E2] font-medium hover:bg-blue-50 transition-colors">
            <FiUser className="text-lg" />
            <span>Xem thông tin cá nhân</span>
          </div>
        </Link>

        <button
          onClick={() => logout()}
          className="flex items-center justify-center gap-2 w-full h-[55px] rounded-3xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <FiLogOut className="text-lg" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AlreadyLoggedIn;
