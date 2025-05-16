import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface Props {
  total: number;
}

const data = [
  { name: "Khách hàng", value: 200 },
  { name: "Dược sĩ", value: 60 },
  { name: "Admin", value: 40 },
];

const COLORS = ["#56bfa0", "#c5e37d", "#f5a5ab"];

const PieChartComponent: React.FC<Props> = ({ total }) => {
  return (
    <div className="w-[400px] h-[400px] relative">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={140}
          dataKey="value"
          cornerRadius={8}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) / 2;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight={600}
              >
                {`${data[index].name} (${(percent * 100).toFixed(0)}%)`}
              </text>
            );
          }}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [value, name]}
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          itemStyle={{ color: "#333" }}
        />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
