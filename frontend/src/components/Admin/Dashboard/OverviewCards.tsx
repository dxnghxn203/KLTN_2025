import React, { useState } from "react";
import { BsFillCartCheckFill, BsFillPeopleFill } from "react-icons/bs";
import { FaChartLine } from "react-icons/fa";
import { FaCartShopping, FaCircleDollarToSlot } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";

const cards = [
  {
    title: "Tổng lợi nhuận",
    value: "$12,500",
    subtitle: "Kể từ tuần trước",
    icon: <FaCircleDollarToSlot />,
    change: "+2%",
  },
  {
    title: "Tổng khách hàng",
    value: "1,200",
    subtitle: "Kể từ tuần trước",
    icon: <IoPeople />,
    change: "-0.2%",
  },
  {
    title: "Tổng đơn hàng",
    value: "2,549",
    subtitle: "Kể từ tuần trước",
    icon: <FaCartShopping />,
    change: "+6%",
  },
];

export default function OverviewCards() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => {
        const isSelected = selectedIndex === i;
        return (
          <div
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all shadow ${
              isSelected ? "bg-[#1E4DB7] text-white" : "bg-white text-gray-900"
            }`}
          >
            {/* Icon nền góc dưới bên phải */}

            <div className="absolute bottom-2 right-2 opacity-20 text-gray-400 text-6xl">
              {i === 0 ? (
                <FaChartLine />
              ) : i === 1 ? (
                <BsFillPeopleFill />
              ) : (
                <BsFillCartCheckFill />
              )}
            </div>

            {/* Header của card */}
            <div className="flex justify-between items-center relative z-10">
              <div
                className={`text-2xl rounded-full p-2 ${
                  isSelected
                    ? "bg-white text-blue-700"
                    : "bg-gray-100 text-[#1E4DB7]"
                }`}
              >
                {card.icon}
              </div>
            </div>

            {/* Nội dung chính */}
            <div className="mt-4 relative z-10">
              <h4
                className={`text-sm ${
                  isSelected ? "text-white" : "text-gray-500"
                }`}
              >
                {card.title}
              </h4>
              <p className="text-xl font-bold">{card.value}</p>
              <span
                className={`text-xs ${
                  isSelected ? "text-white" : "text-gray-400"
                }`}
              >
                {card.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
