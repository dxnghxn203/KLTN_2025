"use client";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import medicine from "@/images/medicinee.png";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "processing", label: "Đang xử lý" },
  { id: "delivered", label: "Đã giao" },
  { id: "cancelled", label: "Đã hủy" },
];

const orders = [
  {
    id: "1",
    pharmacy: "122 Hoàng Diệu 2",
    product:
      "Thuốc dùng ngoài Ketovazol 2% điều trị nhiễm nấm ngoài da (tuýp 5g)",
    type: "Tuýp",
    price: 9000,
    time: "17:34 06/11/2024",
    points: 90,
    image: medicine,
    quantity: 1,
  },
  {
    id: "SGPMC277-SGPMC27702-288306",
    pharmacy: "90 Lý Thường Kiệt",
    product: "Paracetamol 500mg - Giảm đau, hạ sốt",
    type: "Hộp",
    price: 35000,
    time: "12:15 05/11/2024",
    points: 120,
    image: medicine,
    quantity: 2,
  },
];

const HistoryOrder: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Lịch sử đơn hàng</h2>

        {/* Ô tìm kiếm */}
        <div className="relative w-[410px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex space-x-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nội dung tab "Tất cả" */}
      {activeTab === "all" &&
        orders.map((order) => (
          <div key={order.id} className="bg-[#F5F7F9] rounded-lg p-4 mt-4">
            <div className="border-b last:border-0">
              <div className="flex justify-between items-center">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  Mua tại nhà thuốc
                </span>
                <span className="text-gray-500 text-sm">{order.time}</span>
              </div>
              <div className="border-t border-dashed border-gray-400 w-full my-2"></div>

              <p className="mt-2">
                Nhà thuốc: <strong>{order.pharmacy}</strong>
              </p>

              <div className="flex mt-3">
                <Image
                  src={order.image}
                  alt="Product"
                  className="w-16 h-16 rounded-lg object-cover border"
                />
                <div className="ml-4 flex-1">
                  <p className="font-medium text-black">{order.product}</p>
                  <p className="text-gray-500 text-sm">
                    Phân loại: {order.type}
                  </p>
                </div>
                <span className="font-medium">
                  {order.price.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className="mt-3 flex self-end">
                <p className="">
                  Thành tiền:{" "}
                  <span className="font-semibold">
                    {order.price.toLocaleString("vi-VN")}đ
                  </span>
                </p>
              </div>

              <div className="flex justify-between mt-2">
                <div className="bg-[#FFFBE6] text-[#FAB328] p-2 rounded-lg text-sm font-semibold w-[90%]">
                  Tích lũy {order.points} điểm
                </div>
                <Link href={`/personal/order-history/${order.id}`}>
                  <button className="px-2 py-2 text-sm bg-[#0053E2] items-center font-semibold text-white rounded-lg">
                    Chi tiết
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default HistoryOrder;
