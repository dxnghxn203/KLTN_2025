import { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const data: Record<string, { day: string; orders: number }[]> = {
  "2025-04": [
    { day: "Jan", orders: 186 },
    { day: "Feb", orders: 305 },
    { day: "Mar", orders: 237 },
    { day: "Apr", orders: 73 },
    { day: "May", orders: 209 },
    { day: "Jun", orders: 214 },
    { day: "Jul", orders: 186 },
    { day: "Aug", orders: 305 },
    { day: "Sep", orders: 237 },
    { day: "Oct", orders: 73 },
    { day: "Nov", orders: 209 },
    { day: "Dec", orders: 214 },
    // ...
  ],
  "2025-05": [
    { day: "Jul", orders: 186 },
    { day: "Aug", orders: 305 },
    { day: "Sep", orders: 237 },
    { day: "Oct", orders: 73 },
    { day: "Nov", orders: 209 },
    { day: "Dec", orders: 214 },
  ],
};

export default function OrderChartByWeek() {
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
    <div className="bg-white shadow rounded-lg p-6 w-full h-[350px]">
      <div className="flex items-center gap-2 justify-between">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Thống kê đơn hàng theo tháng
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
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={salesData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />{" "}
          {/* Bỏ đường dọc */}
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 5, stroke: "#f97316", strokeWidth: 2, fill: "#f97316" }}
          >
            <LabelList
              dataKey="orders"
              position="top"
              fill="#000"
              fontSize={14}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
