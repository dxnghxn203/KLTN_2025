import React, { useEffect, useState } from "react";
import {
  BsBox2Heart,
  BsBoxSeam,
  BsFillCartCheckFill,
  BsFillPeopleFill,
  BsInboxes,
  BsXCircle,
} from "react-icons/bs";
import { FaChartLine } from "react-icons/fa";
import {
  FaCartShopping,
  FaCircleDollarToSlot,
  FaProductHunt,
} from "react-icons/fa6";
import { IoImage, IoPeople } from "react-icons/io5";
import SalesChart from "./SalesChart";
import LatestOrders from "./LatestOrders";
import TopSellingMedicine from "./TopSellingMedicine";
import PieChartComponent from "./PieChartComponent.tsx";
import LineChartComponent from "./LineChartComponent";
import TopCustomers from "./TopCustomers";
import { GiMedicines } from "react-icons/gi";
import TodayReport from "./TodayReport";
import MonthlySalesChart from "./MonthlySalesChart";
import { useOrder } from "@/hooks/useOrder";
import { MdMoreHoriz } from "react-icons/md";
import { useProduct } from "@/hooks/useProduct";
import Image from "next/image";
import OutOfStock from "./OutOfStock";
import CategoryRevenueChart from "./CategoryRevenueChart";
import OrderChartByWeek from "./OrderCharyByWeekk";
// import { OrderChartByWeek } from "./OrderCharyByWeekk";

const cards = [
  {
    title: "Tổng doanh thu",
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
    title: "Tổng sản phẩm",
    value: "2,549",
    subtitle: "Kể từ tuần trước",
    icon: <FaProductHunt />,
    change: "+6%",
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
  const selectedCard = cards[selectedIndex];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {cards.map((card, i) => {
          const isSelected = selectedIndex === i;
          return (
            <div
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all shadow ${
                isSelected
                  ? "bg-[#1E4DB7] text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              <div className="absolute bottom-2 right-2 opacity-20 text-gray-400 text-6xl">
                {i === 0 ? (
                  <FaChartLine />
                ) : i === 1 ? (
                  <BsFillPeopleFill />
                ) : i === 2 ? (
                  <GiMedicines />
                ) : (
                  <BsFillCartCheckFill />
                )}
              </div>

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

      {selectedCard === cards[0] && (
        <div className="space-y-4">
          <SalesChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <CategoryRevenueChart />
            </div>
            <div className="lg:col-span-1">
              <TodayReport />
            </div>
          </div>
        </div>
      )}
      {selectedCard === cards[1] && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-[#f8fbfc] min-h-screen my-4 h-full">
          <div className="bg-white rounded-2xl p-4 shadow flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">Tổng người dùng</h2>
            <PieChartComponent total={500} />
          </div>

          <div className="flex flex-col h-full space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow h-full">
              <h2 className="text-sm font-semibold mb-2">Tỉ lệ duy trì</h2>
              <LineChartComponent color="red" />
            </div>
            <div className="bg-white rounded-2xl p-4 shadow h-full">
              <h2 className="text-sm font-semibold mb-2">Khách hàng mua lại</h2>
              <LineChartComponent color="green" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow">
            <TopCustomers />
          </div>
        </div>
      )}
      {selectedCard === cards[2] && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 h-full">
              <MonthlySalesChart />
            </div>
            <div className="lg:col-span-1 h-full">
              <TopSellingMedicine />
            </div>
          </div>
          <OutOfStock />
        </div>
      )}

      {selectedCard === cards[3] && (
        <div className="space-y-4">
          <OrderChartByWeek />
          <LatestOrders />
        </div>
      )}
    </>
  );
}
