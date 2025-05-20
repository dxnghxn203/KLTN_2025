import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data: Record<string, { name: string; value: number }[]> = {
  "2025-04": [
    { name: "Thuốc kê đơn", value: 35000000 },
    { name: "Thuốc không kê đơn", value: 22000000 },
    { name: "Thực phẩm chức năng", value: 18000000 },
    { name: "Dụng cụ y tế", value: 7000000 },
  ],
  "2025-05": [
    { name: "Thuốc kê đơn", value: 35000000 },
    { name: "Thuốc không kê đơn", value: 22000000 },
    { name: "Thực phẩm chức năng", value: 18000000 },
  ],
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#FFBB28",
];

export default function CategoryRevenueChart() {
  const [currentMonth, setCurrentMonth] = useState("2025-04");

  const handlePrevMonth = () => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth + "-01");
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date.toISOString().slice(0, 7));
  };

  const salesData = data[currentMonth] || [];
  const total = salesData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full h-[420px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Doanh thu theo danh mục
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="text-xl text-gray-500 hover:text-gray-700 p-1 border rounded-full"
          >
            <MdNavigateBefore />
          </button>
          <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
            {new Date(currentMonth).toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })}
          </button>
          <button
            onClick={handleNextMonth}
            className="text-xl text-gray-500 hover:text-gray-700 p-1 border rounded-full"
          >
            <MdNavigateNext />
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Danh sách danh mục */}
        <div className="w-1/2 space-y-3 pr-4">
          {salesData.map((item, index) => {
            const percent = ((item.value / total) * 100).toFixed(0);
            return (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="text-gray-500">– {percent}%</span>
              </div>
            );
          })}
        </div>

        {/* Biểu đồ Pie */}
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                cornerRadius={8}
              >
                {salesData.map((_, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `${value.toLocaleString("vi-VN")} đ`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
