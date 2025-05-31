"use client";
import { BsBox, BsBarChart } from "react-icons/bs";
import { LuUsers, LuRefreshCcw } from "react-icons/lu";
import { useState, useEffect } from "react";
import FilterBar from "./filterBar";
import Link from "next/link";
import { IoMdArrowUp } from "react-icons/io";
import AddNewDropdown from "./addNewDropdown";

import { IoArrowDown, IoFilter } from "react-icons/io5";
import TableProduct from "./tableProduct";
import {
  FaBox,
  FaCapsules,
  FaLungs,
  FaNotesMedical,
  FaPills,
  FaSyringe,
  FaTablets,
} from "react-icons/fa6";
import {
  FaExclamationTriangle,
  FaHeartbeat,
  FaTimesCircle,
} from "react-icons/fa";

const ManagerProducts = () => {
  const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">Quản lý sản phẩm</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/san-pham" className="text-gray-800">
          Sản phẩm
        </Link>
         <span> / </span>
        <Link href="/san-pham/quan-ly-san-pham" className="text-gray-800">
          Quản lý sản phẩm
        </Link>
      </div>

      <div className="flex space-x-4"></div>
      <div className="flex justify-between items-center">
        <button
          className="border border-gray-300 px-2 py-2 rounded-lg hover:text-[#1E4DB7] hover:border-[#1E4DB7] text-sm flex items-center gap-1"
          onClick={() => setShowFilter(!showFilter)}
        >
          <IoFilter className="text-lg" />
          Lọc
        </button>
        <div className="flex gap-2">
          <AddNewDropdown />

          <button className="border border-[#1E4DB7] text-[#1E4DB7] px-2 py-2 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-1">
            <IoArrowDown className="text-lg" />
            Tải CSV
          </button>
        </div>
      </div>

      {showFilter && (
        <FilterBar onFilterChange={(filters) => console.log(filters)} />
      )}
      <TableProduct />
    </div>
  );
};

export default ManagerProducts;
