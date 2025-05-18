import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const monthlySalesData: Record<string, { day: string; value: number }[]> = {
  "2025-04": [
    { day: "01", value: 8000 },
    { day: "02", value: 12500 },
    { day: "03", value: 7500 },
    { day: "04", value: 7700 },
    { day: "05", value: 11000 },
    { day: "06", value: 15000 },
    { day: "07", value: 18657 },
    { day: "08", value: 14000 },
    { day: "09", value: 12000 },
    { day: "10", value: 9000 },
    { day: "11", value: 13000 },
    { day: "12", value: 25000 },
    // ...
  ],
  "2025-05": [
    { day: "01", value: 8000 },
    { day: "02", value: 12500 },
    { day: "03", value: 7500 },
  ],
};

export default function SalesChart() {
  const maxValue = 25000;
  const step = 5000;
  const chartHeight = 256;
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

  const salesData = monthlySalesData[currentMonth] || [];

  const yLabels = [];
  for (let i = maxValue; i >= 0; i -= step) {
    yLabels.push(i);
  }

  return (
    <div className="mx-auto rounded-2xl shadow p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Phân tích doanh thu</h2>
        <div className="flex items-center gap-2">
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
      </div>

      {/* Biểu đồ */}
      <div className="flex gap-4">
        {/* Trục Y với nhãn */}
        <div className=" w-14 h-64 flex flex-col justify-between items-end ">
          {yLabels.map((label, idx) => (
            <div
              key={idx}
              className="flex items-center justify-end h-0 relative"
              style={{ top: idx === 0 ? 0 : undefined }}
            >
              <span className="text-xs text-gray-500 absolute -left-2 translate-x-[-100%]">
                ${label.toLocaleString()}
              </span>
              <div className="absolute left-0 w-full border-t border-dashed border-gray-300"></div>
            </div>
          ))}
        </div>

        {/* Cột dữ liệu */}
        <div className="relative flex items-end bottom-0 gap-12 w-full">
          {salesData.map((item, idx) => {
            const height = (item.value / maxValue) * chartHeight;
            return (
              <div
                key={idx}
                className="flex flex-col items-center group w-6 relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 hidden group-hover:block bg-white border border-gray-300 text-xs px-2 py-1 rounded shadow z-10">
                  <div>${item.value.toLocaleString()}</div>
                </div>

                <div className="w-12 h-64 bg-gray-100 rounded-full relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 w-12 bg-[#1E4DB7] hover:bg-blue-700 transition-all duration-300 rounded-full"
                    style={{ height: `${height}px` }}
                  ></div>
                </div>

                {/* Cột */}

                {/* Nhãn trục X */}
                <span className="text-xs text-gray-600 mt-1">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
