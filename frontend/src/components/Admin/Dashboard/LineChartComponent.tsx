import React, { useMemo, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
}

const monthLabels = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"];

const currentMonth = new Date().getMonth();
const data = monthLabels.slice(0, currentMonth + 1).map((month) => ({
  name: month,
  value1: Math.floor(Math.random() * 100) + 50,
  value2: Math.floor(Math.random() * 100) + 50,
  value3: Math.floor(Math.random() * 100) + 50,
}));
const COLORS = ["#F87171", "#34D399", "#3B82F6"];

const LineChartComponent: React.FC<Props> = () => {
  const initCurrentYear = new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(initCurrentYear);

  const data = useMemo(() => {
    const lastMonthIndex = currentYear === initCurrentYear ? currentMonth : 11;
    return monthLabels.map((month, idx) => {
      const showData = idx <= lastMonthIndex;
      return {
        name: month,
        value1: showData ? Math.floor(Math.random() * 100) + 50 : null,
        value2: showData ? Math.floor(Math.random() * 100) + 50 : null,
        value3: showData ? Math.floor(Math.random() * 100) + 50 : null,
      };
    });
  }, [currentYear, currentMonth, initCurrentYear]);

  const handlePrevYear = () => setCurrentYear((y) => y - 1);
  const handleNextYear = () => {
    if (currentYear < new Date().getFullYear()) setCurrentYear((y) => y + 1);
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-2">
        <button className="px-3 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-100">
          Năm {currentYear}
        </button>
        <button
          onClick={handlePrevYear}
          className="text-xl text-gray-500 hover:text-gray-700 p-1 border rounded-full"
        >
          <MdNavigateBefore />
        </button>
        <button
          onClick={handleNextYear}
          disabled={currentYear >= initCurrentYear}
          className={`text-xl p-1 border rounded-full ${
            currentYear >= initCurrentYear
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MdNavigateNext />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            interval={0}
            padding={{ left: 10, right: 10 }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value1"
            stroke={COLORS[0]}
            strokeWidth={3}
            dot={{ r: 4, stroke: COLORS[0], strokeWidth: 2, fill: COLORS[0] }}
          />
          <Line
            type="monotone"
            dataKey="value2"
            stroke={COLORS[1]}
            strokeWidth={3}
            dot={{ r: 4, stroke: COLORS[1], strokeWidth: 2, fill: COLORS[1] }}
          />
          <Line
            type="monotone"
            dataKey="value3"
            stroke={COLORS[2]}
            strokeWidth={3}
            dot={{ r: 4, stroke: COLORS[2], strokeWidth: 2, fill: COLORS[2] }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineChartComponent;
