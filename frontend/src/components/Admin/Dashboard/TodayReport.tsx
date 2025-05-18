import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

// Dữ liệu chú thích
const data = [
  { label: "Tổng thu", color: "#F87171" }, // đỏ
  { label: "Tiền mặt", color: "#FACC15" }, // vàng
  { label: "Ngân hàng", color: "#3B82F6" }, // xanh dương
];

const totalEarning = 5098.0;
const chartData: Record<
  string,
  { value: number; radius: number; strokeWidth: number; color: string }[]
> = {
  "2025-04": [
    { radius: 70, strokeWidth: 10, color: "#F87171", value: 90 },
    { radius: 58, strokeWidth: 10, color: "#FACC15", value: 75 },
    { radius: 46, strokeWidth: 10, color: "#3B82F6", value: 60 },
    // ...
  ],
  "2025-05": [
    { radius: 70, strokeWidth: 10, color: "#F87171", value: 90 },
    { radius: 58, strokeWidth: 10, color: "#FACC15", value: 75 },
  ],
};

export default function TodayReport() {
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

  const salesData = chartData[currentMonth] || [];

  return (
    <div className="bg-white rounded-xl shadow gap-6 p-6 h-full">
      <div className="flex items-center gap-2 justify-end">
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
      <div className="h-full justify-center flex items-center gap-4 h-full">
        <div className="relative w-48 h-48">
          {salesData.map(({ radius, strokeWidth, color, value }, i) => {
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset =
              circumference - (value / 100) * circumference;

            return (
              <svg
                key={i}
                className="absolute top-0 left-0 w-48 h-48"
                viewBox="0 0 160 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E5E7EB"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                />
              </svg>
            );
          })}
        </div>

        <div className="flex flex-col justify-center ml-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Phương thức thanh toán
          </h3>

          <div className="text-2xl font-bold text-gray-900 mb-4">
            ${totalEarning.toFixed(2)}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            {data.map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
