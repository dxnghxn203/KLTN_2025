"use client";
import { useState } from "react";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";
import Link from "next/link";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { RiMore2Fill } from "react-icons/ri";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Số user hiển thị trên mỗi trang

  // Danh sách user giả
  const fakeUsers = [
    {
      id: "U001",
      name: "Nguyễn Văn A",
      email: "a@gmail.com",
      role: "Admin",
      createdAt: "2025-03-10",
    },
    {
      id: "U002",
      name: "Trần Thị B",
      email: "b@gmail.com",
      role: "User",
      createdAt: "2025-03-11",
    },
    {
      id: "U003",
      name: "Lê Minh C",
      email: "c@gmail.com",
      role: "User",
      createdAt: "2025-03-12",
    },
    {
      id: "U004",
      name: "Phạm Hoàng D",
      email: "d@gmail.com",
      role: "User",
      createdAt: "2025-03-13",
    },
    {
      id: "U005",
      name: "Đặng Văn E",
      email: "e@gmail.com",
      role: "User",
      createdAt: "2025-03-14",
    },
    {
      id: "U006",
      name: "Ngô Minh F",
      email: "f@gmail.com",
      role: "Admin",
      createdAt: "2025-03-15",
    },
    {
      id: "U007",
      name: "Hoàng Quốc G",
      email: "g@gmail.com",
      role: "User",
      createdAt: "2025-03-16",
    },
    {
      id: "U008",
      name: "Võ Hoàng H",
      email: "h@gmail.com",
      role: "User",
      createdAt: "2025-03-17",
    },
    {
      id: "U009",
      name: "Trịnh Minh I",
      email: "i@gmail.com",
      role: "User",
      createdAt: "2025-03-18",
    },
    {
      id: "U010",
      name: "Lý Văn J",
      email: "j@gmail.com",
      role: "User",
      createdAt: "2025-03-19",
    },
  ];

  // Xử lý phân trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = fakeUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <h2 className="text-2xl font-bold text-black">User Management</h2>
      <div className="my-2 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Home
        </Link>
        <span> / </span>
        <Link href="/user" className="text-gray-800">
          User management
        </Link>
      </div>
      <div className="flex items-center justify-end gap-4">
        <button className="bg-[#1E4DB7] text-white px-2 py-2 rounded-lg hover:bg-[#173F98] text-sm flex items-center gap-1">
          <HiOutlinePlusSmall className="text-lg" />
          Add new
        </button>
        <button className="text-sm flex items-center gap-1 px-2 py-2 bg-[#1E4DB7] text-white rounded-xl shadow-md hover:bg-[#173F98] transition">
          <IoMdArrowUp />
          Export
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-2xl mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead className="text-[#1E4DB7] text-sm border-b border-gray-200 bg-[#F0F3FD]">
              <tr>
                <th className="px-6 py-4 text-left">User ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Created At</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="text-sm hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <td className="p-6 text-left">{user.id}</td>
                  <td className="p-6 text-left">{user.name}</td>
                  <td className="p-6 text-left">{user.email}</td>
                  <td className="p-6 text-left">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6 text-left">{user.createdAt}</td>
                  <td className="py-4 px-6 text-center flex justify-center">
                    <RiMore2Fill className="cursor-pointer text-xl" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* CustomPagination */}
        <div className="flex justify-center p-6">
          <CustomPagination
            current={currentPage}
            total={fakeUsers.length}
            pageSize={usersPerPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
