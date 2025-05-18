import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const monthlySalesData: Record<string, { month: string; value: number }[]> = {
  "2025-04": [
    { month: "01", value: 8000 },
    { month: "02", value: 12500 },
    { month: "03", value: 7500 },
    { month: "04", value: 7700 },
    { month: "05", value: 11000 },
    { month: "06", value: 15000 },
    { month: "07", value: 18657 },
    { month: "08", value: 14000 },
    { month: "09", value: 12000 },
    { month: "10", value: 9000 },
    { month: "11", value: 13000 },
    { month: "12", value: 25000 },
  ],
  "2025-05": [
    { month: "01", value: 8000 },
    { month: "02", value: 12500 },
    { month: "03", value: 7500 },
    { month: "04", value: 7700 },
    { month: "05", value: 11000 },
    { month: "06", value: 15000 },
    { month: "07", value: 18657 },
    { month: "08", value: 14000 },
    { month: "09", value: 12000 },
    { month: "10", value: 9000 },
    { month: "11", value: 13000 },
    { month: "12", value: 25000 },
  ],
};

export default function MonthlySalesChart() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const maxValue = 25000;

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

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full h-full items-end">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Tiến độ hàng tháng
        </h3>
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

      <div className="flex items-end justify-between h-full pb-12">
        {salesData.map((item, i) => {
          const heightPercent = (item.value / maxValue) * 100;
          const isHovered = hoverIndex === i;

          return (
            <div
              key={i}
              className="relative flex flex-col items-center w-[20px] cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 bg-black text-white text-xs px-2 py-1 rounded z-10 text-center whitespace-nowrap">
                  <div>{item.month}</div>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <span>{item.value}k</span>
                  </div>
                </div>
              )}

              {/* Bar */}
              <div
                className="w-12 rounded-full transition-all duration-300 bg-[#10B981] group-hover:bg-[#000000]"
                style={{ height: `${heightPercent}px` }}
              ></div>

              {/* Label */}
              <div className="mt-2 text-sm text-gray-500">{item.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
