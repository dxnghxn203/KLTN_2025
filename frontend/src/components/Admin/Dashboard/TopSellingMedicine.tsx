// components/TopSellingMedicine.jsx
import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import image from "@/images/00032942_b_complex_vitamin_royal_care_60v_7411_61c0_large_e286cafde3.webp";

const monthlyMedicineData: Record<
  string,
  { day: string; value: number; color: string; image: string; name: string }[]
> = {
  "2025-04": [
    {
      day: "01",
      value: 23,
      color: "bg-orange-500",
      image: image.src,
      name: "dhfvbjdf",
    },
    {
      day: "02",
      value: 300,
      color: "bg-blue-500",
      image: image.src,
      name: "dhfvbjdf",
    },
    { day: "03", value: 75, color: "bg-lime-400", image: "", name: "dhfvbjdf" },
  ],
  "2025-05": [
    {
      day: "01",
      value: 70,
      color: "bg-orange-500",
      image: image.src,
      name: "dhfvbjdf",
    },
    {
      day: "02",
      value: 500,
      color: "bg-blue-500",
      image: image.src,
      name: "dhfvbjdf",
    },
    {
      day: "03",
      value: 75,
      color: "bg-lime-400",
      image: image.src,
      name: "dhfvbjdf",
    },
  ],
};

export default function TopSellingMedicine() {
  const maxValue = 500;
  const step = 100;
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

  const salesData = monthlyMedicineData[currentMonth] || [];

  const yLabels = [];
  for (let i = maxValue; i >= 0; i -= step) {
    yLabels.push(i);
  }

  return (
    <div className="rounded-2xl shadow p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Top thuốc bán chạy nhất
        </h2>
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
                {label.toLocaleString()}
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
                {item.value === maxValue && (
                  <div className="absolute -top-10 hidden group-hover:block bg-white border border-gray-300 text-xs px-2 py-1 rounded shadow z-10">
                    <div>{item.value.toLocaleString()}</div>
                  </div>
                )}

                <div className="flex flex-col items-center">
                  {/* Cột với ảnh ở dưới */}
                  <div className="relative h-64 w-12 rounded-full overflow-hidden flex flex-col justify-end items-center">
                    {/* Group cho cột màu */}
                    <div
                      className="group absolute bottom-0 left-0 w-12"
                      style={{ height: `${height}px` }}
                    >
                      {/* Tooltip động nằm trên đầu cột */}
                      <div
                        className="absolute hidden group-hover:block bg-white border border-gray-300 text-xs px-2 py-1 rounded shadow z-10 left-1/2 -translate-x-1/2 mb-2"
                        style={{ bottom: `${height}px` }}
                      >
                        <div>{item.value.toLocaleString()}</div>
                      </div>

                      {/* Cột màu */}
                      <div
                        className={`h-full w-full transition-all duration-300 rounded-full ${item.color}`}
                      ></div>
                    </div>

                    {/* Tên */}
                    <span
                      className="absolute top-1/2 text-white text-xs font-medium"
                      style={{ transform: "rotate(90deg)" }}
                    >
                      {item.name}
                    </span>

                    {/* Ảnh */}
                    <div className="z-10 mb-1 w-10 h-10 rounded-full border-4 border-white bg-white overflow-hidden shadow-md bottom-1">
                      <img
                        src={item.image || "/images/default.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-1">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
