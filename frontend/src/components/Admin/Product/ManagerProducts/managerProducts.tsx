'use client'
import { BsBox, BsBarChart } from "react-icons/bs";
import { LuUsers, LuRefreshCcw } from "react-icons/lu";
import { useState, useEffect } from "react";
import FilterBar from "./filterBar";
import Link from "next/link";
import { IoMdArrowUp } from "react-icons/io";
import AddNewDropdown from "./addNewDropdown";

import { IoFilter } from "react-icons/io5";
import TableProduct from "./tableProduct";

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
      <h2 className="text-2xl font-extrabold text-black">Product Management</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Home
        </Link>
        <span> / </span>
        <Link href="/product/product-management" className="text-gray-800">
          Product management
        </Link>
      </div>

      <div className="flex space-x-4">
        <div className="bg-white rounded-3xl flex w-full items-center justify-between shadow-sm">
          <div className="flex-1 py-6 flex flex-col items-center space-y-3">
            <div className="bg-[#EFF9FF] rounded-full h-16 w-16 flex justify-center items-center">
              <LuUsers className="text-[#1A97F5] text-3xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-2xl">39,354</span>
              <span className="text-sm text-[#9297A0]">Customers</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 py-6 flex flex-col items-center space-y-3">
            <div className="bg-[#FFF4E5] rounded-full h-16 w-16 flex justify-center items-center">
              <BsBox className="text-[#FDC90F] text-3xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-2xl">4,396</span>
              <span className="text-sm text-[#9297A0]">Products</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 py-6 flex flex-col items-center space-y-3">
            <div className="bg-[#FDF3F5] rounded-full h-16 w-16 flex justify-center items-center">
              <BsBarChart className="text-[#FD5171] text-3xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-2xl">423,39</span>
              <span className="text-sm text-[#9297A0]">Sales</span>
            </div>
          </div>

          <div className="w-[0.5px] h-full bg-gray-200"></div>

          <div className="flex-1 py-6 flex flex-col items-center space-y-3">
            <div className="bg-[#EBFAF2] rounded-full h-16 w-16 flex justify-center items-center">
              <LuRefreshCcw className="text-[#00C292] text-3xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-2xl">835</span>
              <span className="text-sm text-[#9297A0]">Refunds</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button
          className="border border-gray-300 px-2 py-2 rounded-lg hover:text-[#1E4DB7] hover:border-[#1E4DB7] text-sm flex items-center gap-1"
          onClick={() => setShowFilter(!showFilter)}
        >
          <IoFilter className="text-lg" />
          Filter
        </button>
        <div className="flex gap-2">
          <AddNewDropdown />

          <button className="border border-[#1E4DB7] text-[#1E4DB7] px-2 py-2 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-1">
            <IoMdArrowUp className="text-lg" />
            Export
          </button>
        </div>
      </div>
      {showFilter && (
        <FilterBar onFilterChange={(filters) => console.log(filters)} />
      )}
      <TableProduct/>
    </div>
  );
};

export default ManagerProducts;
