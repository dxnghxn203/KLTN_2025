import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  color: "red" | "green";
}

const allMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const currentMonth = new Date().getMonth();
const data = allMonths.slice(0, currentMonth + 1).map((month) => ({
  name: month,
  value: Math.floor(Math.random() * 100) + 50,
}));

const LineChartComponent: React.FC<Props> = ({ color }) => {
  const strokeColor = color === "red" ? "#F87171" : "#34D399";

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          interval={0} // hiển thị tất cả các nhãn
          padding={{ left: 10, right: 10 }} // thu hẹp khoảng cách đầu/cuối
          tick={{ fontSize: 12 }} // thu nhỏ chữ nếu muốn
        />
        {/* <YAxis /> */}
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={3}
          dot={{ r: 4, stroke: strokeColor, strokeWidth: 2, fill: strokeColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
