"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
export default function Profile() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col pb-12 bg-white pt-[80px]">
      <Header />
      <main className="flex flex-col pt-14">
        <div className="text-sm text-[#0053E2] px-5">
          <Link href="/" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          {pathname === "/profile" && (
            <span className="text-gray-500"> / Thông tin cá nhân</span>
          )}
        </div>
        <div className="flex min-h-screen p-5">
          {/* Sidebar */}
          <div className="w-1/4 bg-blue-600 text-white p-6 rounded-lg h-60"></div>

          {/* Profile Info */}
          <div className="flex-1 p-10">
            <div className="bg-[#F5F7F9] p-6 rounded-lg"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
