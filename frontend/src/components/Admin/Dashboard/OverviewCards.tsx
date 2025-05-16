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
  const { allStatistics365Days, statistics365Days } = useOrder();

  useEffect(() => {
    allStatistics365Days(
      () => {},
      () => {}
    );
  }, [statistics365Days]);
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
              {/* Icon nền góc dưới bên phải */}
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

      {selectedCard === cards[0] && (
        <div className="space-y-4">
          <SalesChart />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TodayReport />
            </div>
            <div className="lg:col-span-1">
              <TopSellingMedicine />
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

          {/* Cột 2: Hai biểu đồ đường */}
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

          {/* Cột 3: Top Customers */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#E7ECF7] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <span className="text-black font-medium">Tổng đơn hàng</span>
                <div className="flex text-[#1E4DB7] text-2xl items-center">
                  <span className="font-medium">
                    {statistics365Days?.total}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Tổng số đơn hàng trong 365 ngày qua
                </div>
              </div>

              <div className="bg-[#1E4DB7] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
                <BsInboxes className="text-white text-2xl" />
              </div>
            </div>

            <div className="bg-[#EBFAF2] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <span className="text-black font-medium">Đơn hàng mới</span>
                <div className="flex text-[#00C292] text-2xl items-center">
                  <span className="font-medium">{statistics365Days?.new}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Đơn hàng mới trong 365 ngày qua
                </div>
              </div>

              <div className="bg-[#00C292] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
                <BsBoxSeam className="text-white text-2xl" />
              </div>
            </div>

            <div className="bg-[#FDF3F5] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <span className="text-black font-medium">
                  Đơn hàng hoàn thành
                </span>
                <div className="flex text-[#FD5171] text-2xl items-center">
                  <span className="font-medium">
                    {statistics365Days?.completed}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Đơn hàng hoàn thành trong 365 ngày qua
                </div>
              </div>

              <div className="bg-[#FD5171] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
                <BsBox2Heart className="text-white text-2xl" />
              </div>
            </div>

            <div className="bg-[#FFF4E5] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <span className="text-black font-medium">Đơn hàng hủy</span>
                <div className="flex text-[#FDC90F] text-2xl items-center">
                  <span className="font-medium">
                    {statistics365Days?.cancel}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Đơn hàng hủy trong 365 ngày qua
                </div>
              </div>

              <div className="bg-[#FDC90F] rounded-full h-12 w-12 flex justify-center items-center self-start relative z-10 flex-shrink-0">
                <BsXCircle className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <OutOfStock />
        </div>
      )}

      {selectedCard === cards[3] && (
        <div className="space-y-4">
          <LatestOrders />
        </div>
      )}
    </>
  );
}
