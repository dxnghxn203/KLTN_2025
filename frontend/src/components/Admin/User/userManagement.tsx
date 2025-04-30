"use client";
import { useState, useEffect } from "react";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";
import Link from "next/link";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { RiMore2Fill } from "react-icons/ri";
import { IoMdArrowUp } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import { ImBin } from "react-icons/im";
import { IoArrowDown, IoFilter } from "react-icons/io5";
import FilterBar from "./filterBar";
import AddUserDialog from "../Dialog/addUserDialog";
import TableUser from "./tableUser";
import { useUser } from "@/hooks/useUser";
import { formatDate } from "@/utils/string";

const UserManagement = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { allUserAdmin, getAllUser, page, setPage, setPageSize, pageSize } =
    useUser();

  useEffect(() => {
    getAllUser();
  }, []);

  const handleAddUser = (newUser: {
    name: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
  }) => {
    // console.log("User added:", newUser);
  };

  const exportToCSV = () => {
    if (!allUserAdmin || allUserAdmin.length === 0) return;

    const headers = [
      "ID",
      "Tên người dùng",
      "Giới tính",
      "Ngày sinh",
      "Email",
      "Số điện thoại",
      "Phương thức đăng ký",
      "Trạng thái",
      "Xác thực email",
      "Ngày tạo tài khoản",
    ];

    const rows = allUserAdmin.map((user: any) => [
      user._id,
      user.user_name,
      user.gender,
      formatDate(user.birthday),
      user.email,
      `="${user.phone_number}"`,
      user.auth_provider === "email" ? "Email" : "Google",
      user.active ? "Đã kích hoạt" : "Chưa kích hoạt",
      formatDate(user.verified_email_at),
      formatDate(user.created_at),
    ]);

    const bom = "\uFEFF";

    const csvContent =
      bom + [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "UserList.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-black">Quản lý người dùng</h2>
        <div className="my-2 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/users" className="text-gray-800">
            Quản lý người dùng
          </Link>
        </div>
        <div className="flex justify-between">
          <button
            className="justify-start border border-gray-300 px-2 py-2 rounded-lg hover:text-[#1E4DB7] hover:border-[#1E4DB7] text-sm flex items-center gap-1"
            onClick={() => setShowFilter(!showFilter)}
          >
            <IoFilter className="text-lg" />
            Bộ lọc
          </button>
          <div className="justify-end flex items-center gap-4">
            <button
              className="bg-[#1E4DB7] text-white px-2 py-2 rounded-lg hover:bg-[#173F98] text-sm flex items-center gap-1
          "
              onClick={() => setDialogOpen(true)}
            >
              <HiOutlinePlusSmall className="text-lg" />
              Thêm mới
            </button>
            <button
              className="flex items-center gap-1 px-2 py-2 border border-[#1E4DB7] text-[#1E4DB7] rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              onClick={exportToCSV}
            >
              <IoArrowDown />
              Tải CSV
            </button>
          </div>
        </div>
        {showFilter && (
          <FilterBar onFilterChange={(filters) => console.log(filters)} />
        )}

        <TableUser
          users={allUserAdmin}
          currentPage={page}
          pageSize={pageSize}
          totalUsers={allUserAdmin.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <AddUserDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default UserManagement;
