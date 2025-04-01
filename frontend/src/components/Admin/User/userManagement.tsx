"use client";
import { useState, useEffect } from "react";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";
import Link from "next/link";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import { RiMore2Fill } from "react-icons/ri";
import { IoMdArrowUp } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import { ImBin } from "react-icons/im";
import { IoFilter } from "react-icons/io5";
import FilterBar from "./filterBar";
import AddUserDialog from "../Dialog/addUserDialog";
import TableUser from "./tableUser";
import { useUser } from "@/hooks/useUser";

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
    console.log("User added:", newUser);
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
            Filter
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
            <button className="text-sm flex items-center gap-1 px-2 py-2 bg-[#1E4DB7] text-white rounded-lg shadow-md hover:bg-[#173F98] transition">
              <IoMdArrowUp />
              Xuất file
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
          totalUsers={0}
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
