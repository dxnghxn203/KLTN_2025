"use client";
import { useAuth } from "@/hooks/useAuth";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function InfoPersonal() {
  const { admin } = useAuth();
  console.log("admin", admin);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">Thông tin của tôi</h2>

      <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-6">
        <div className="relative">
          <Image
            src="/avatar.jpg" // Thay bằng ảnh thực tế
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
            <Image
              src="/camera-icon.png" // biểu tượng máy ảnh nếu có
              alt="Edit"
              width={16}
              height={16}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-700">
            {admin?.user_name}
          </h3>
          <p className="text-sm text-gray-500">Admin</p>
          <p className="text-sm text-gray-500">Leeds, United Kingdom</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Thông tin cá nhân
          </h3>
          <button className="flex items-center space-x-1 bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition">
            <Edit className="w-4 h-4" />
            <span className="text-sm">Chỉnh sửa</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Tên</p>
            <p className="font-medium">{admin?.user_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Ngày sinh</p>
            <p className="font-medium">
              {admin?.birthday &&
                new Date(admin.birthday)
                  .toLocaleDateString("en-GB")
                  .split("/")
                  .join("-")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{admin?.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Số điện thoại</p>
            <p className="font-medium">{admin?.phone_number}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
