import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data: Record<string, { name: string; value: number }[]> = {
  "2025-04": [
    { name: "Thuốc kê đơn", value: 35000000 },
    { name: "Thuốc không kê đơn", value: 22000000 },
    { name: "Thực phẩm chức năng", value: 18000000 },
    { name: "Dụng cụ y tế", value: 7000000 },
    // ...
  ],
  "2025-05": [
    { name: "Thuốc kê đơn", value: 35000000 },
    { name: "Thuốc không kê đơn", value: 22000000 },
    { name: "Thực phẩm chức năng", value: 18000000 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function CategoryRevenueChart() {
  const [currentMonth, setCurrentMonth] = useState("2025-04");
  const handlePrevMonth = () => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() - 1);
    const formatted = date.toISOString().slice(0, 7);
    setCurrentMonth(formatted);
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + 1);
    const formatted = date.toISOString().slice(0, 7);
    setCurrentMonth(formatted);
  };

  const salesData = data[currentMonth] || [];
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full h-[420px] text-xs">
      <div className="flex items-center gap-2 justify-between">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Doanh thu theo danh mục
        </h3>
        <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
          {new Date(currentMonth).toLocaleDateString("vi-VN", {
            month: "long",
            year: "numeric",
          })}
        </button>
        <button
          onClick={handlePrevMonth}
          className="text-xl text-gray-500 hover:text-gray-700 p-1 border rounded-full"
        >
          <MdNavigateBefore />
        </button>
        <button
          onClick={handleNextMonth}
          className="text-xl text-gray-500 hover:text-gray-700 p-1 border rounded-full"
        >
          <MdNavigateNext />
        </button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={salesData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            cornerRadius={8}
          >
            {salesData.map((_, index: number) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number) => `${value.toLocaleString("vi-VN")} đ`}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* <Legend className="w-full" /> */}
    </div>
  );
}
