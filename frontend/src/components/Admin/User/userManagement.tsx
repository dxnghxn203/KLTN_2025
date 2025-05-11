"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { IoArrowDown, IoFilter } from "react-icons/io5";
import AddUserDialog from "../Dialog/addUserDialog";
import TableUser from "./tableUser";
import { useUser } from "@/hooks/useUser";
import { formatDate } from "@/utils/string";
import clsx from "clsx";
import TableAdmin from "./tableAdmin";
import TablePharmacist from "./tablePharmacist";

const UserManagement = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Khách hàng");
  const tabs = ["Khách hàng", "Quản trị viên", "Dược sĩ"];

  const {
    allUserAdmin,
    getAllUser,
    page,
    setPage,
    setPageSize,
    pageSize,
    allAdmin,
    fetchAllAdmin,
    fetchAllPharmacist,
    allPharmacist,
  } = useUser();

  useEffect(() => {
    getAllUser();
    fetchAllAdmin();
    fetchAllPharmacist();
  }, []);
  // const filteredUsers = allUserAdmin.filter(user=> user.role === selectedRole);

  const handleAddUser = (newUser: {
    name: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
  }) => {};

  // console.log("allAdmin", allAdmin);
  // console.log("allPharmacist", allPharmacist);

  const exportToCSV = () => {
    let dataToExport: any[] = [];

    if (activeTab === "Khách hàng") {
      dataToExport = allUserAdmin;
    } else if (activeTab === "Quản trị viên") {
      dataToExport = allAdmin;
    } else if (activeTab === "Dược sĩ") {
      dataToExport = allPharmacist;
    }

    if (!dataToExport || dataToExport.length === 0) return;

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

    const rows = dataToExport.map((user: any) => [
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
    link.setAttribute("download", `DanhSach_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold text-black py-6">
          Quản lý người dùng
        </h2>
        <div className="my-2 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Trang chủ
          </Link>
          <span> / </span>
          <Link href="/users" className="text-gray-800">
            Quản lý người dùng
          </Link>
        </div>
        <div className="flex justify-end">
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
        <div className="flex gap-2 py-2">
          {tabs.map((role) => (
            <button
              key={role}
              onClick={() => setActiveTab(role)}
              className={clsx(
                "pb-2 px-3 text-sm font-medium border-b-2 transition flex items-center",
                activeTab === role
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-500"
              )}
            >
              {role}
            </button>
          ))}
        </div>
        {activeTab === "Khách hàng" && (
          <TableUser
            users={allUserAdmin}
            currentPage={page}
            pageSize={pageSize}
            totalUsers={allUserAdmin.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
        {activeTab === "Quản trị viên" && (
          <TableAdmin
            admins={allAdmin}
            currentPage={page}
            pageSize={pageSize}
            totalAdmins={allAdmin.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
        {activeTab === "Dược sĩ" && (
          <TablePharmacist
            pharmacists={allPharmacist}
            currentPage={page}
            pageSize={pageSize}
            totalPharmacists={allPharmacist.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
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
