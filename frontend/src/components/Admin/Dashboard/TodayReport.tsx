import React from "react";

const data = [
  { label: "Tổng thu", color: "#F87171" }, // đỏ
  { label: "Tiền mặt", color: "#FACC15" }, // vàng
  { label: "Ngân hàng", color: "#3B82F6" }, // xanh dương
];

const totalEarning = 5098.0;

export default function TodayReport() {
  return (
    <div className="bg-white rounded-xl shadow flex gap-6 p-6">
      <div className="relative w-40 h-40">
        {[
          { radius: 70, strokeWidth: 10, color: "#F87171", value: 90 },
          { radius: 58, strokeWidth: 10, color: "#FACC15", value: 75 },
          { radius: 46, strokeWidth: 10, color: "#3B82F6", value: 60 },
        ].map(({ radius, strokeWidth, color, value }, i) => {
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset =
            circumference - (value / 100) * circumference;
          return (
            <svg
              key={i}
              className="absolute top-0 left-0 w-40 h-40"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#E5E7EB" // màu xám nền
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

      {/* Phần thông tin bên phải */}
      <div className="flex flex-col justify-center">
        <h3 className="font-semibold text-gray-700 mb-2">
          Phương thức thanh toán
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold">${totalEarning.toFixed(2)}</span>
        </div>

        {/* Legend */}
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
  );
}
