"use client";
import { Search, X } from "lucide-react";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrder";
import { formatDate } from "@/utils/string";
import { getOrderStatusInfo } from "@/utils/orderStatusMapping";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "processing", label: "Đang xử lý" },
  { id: "delivered", label: "Đã giao" },
  { id: "cancelled", label: "Đã hủy" },
];

const HistoryOrder: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { ordersUser, getOrdersByUser } = useOrder();

  const getOrders = () => {
    getOrdersByUser();
  }

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="font-semibold text-lg">Lịch sử đơn hàng</h2>
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
            className={`py-2 px-4 text-sm font-medium ${activeTab === tab.id
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
        ordersUser && ordersUser.map((order: any) => (
          <div key={order?.order_id} className="bg-[#F5F7F9] rounded-lg p-4 mt-4">
            <div className="border-b last:border-0">

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Link href={`/ca-nhan/lich-su-don-hang/${order?.order_id}`}>
                    <span className="text-blue-600 hover:text-blue-800 font-semibold mr-2">{order?.order_id}</span>
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(order?.order_id);
                    }}
                    className="text-gray-500 hover:text-blue-600 cursor-pointer"
                    title="Copy mã đơn hàng"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
                {(() => {
                  const statusInfo = getOrderStatusInfo(order.status);
                  return (
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.colors.bg} ${statusInfo.colors.text}`}>
                      <span className={`mr-1.5 ${statusInfo.colors.text}`}>●</span>
                      {statusInfo.displayName}
                    </span>
                  );
                })()}
                <span className="text-gray-500 text-sm">{formatDate(order.created_date) || "14:35 AM 12/08/2025"}</span>
              </div>
              <div className="border-t border-dashed border-gray-400 w-full my-2"></div>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">Người nhận:</span>
                  <span className="font-semibold ml-1">{order.pick_to.name}</span>
                  <span className="mx-1">|</span>
                  <span className="text-gray-700">{order.pick_to.phone_number}</span>
                </div>

                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">Nơi giao hàng:
                  </span>
                  <span className="font-semibold block ml-1">
                    {order.pick_to.address.address}, {order.pick_to.address.ward}, {order.pick_to.address.district}, {order.pick_to.address.province}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex">
                <div className=" px-4 py-2 rounded-md">
                  <span className="text-gray-600">Thành tiền:</span>
                  <span className="font-bold text-lg ml-2 text-blue-700">{order?.total_fee.toLocaleString("vi-VN")}đ</span>
                </div>
                {
                  <div className="flex items-center border-l pl-4 ml-4">
                    <div className="flex items-center">
                      {order?.payment_type === "COD" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium text-gray-700">Phương thức: </span>
                          <span className="ml-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-sm font-medium">
                            Thanh toán khi nhận hàng COD
                          </span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="font-medium text-gray-700">Phương thức: </span>
                          <span className="ml-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-md text-sm font-medium">
                            Thanh toán trước
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                }
              </div>

              {/* <div className="flex justify-between mt-2">
                <div className="bg-[#FFFBE6] text-[#FAB328] p-2 rounded-lg text-sm font-semibold w-[90%]">
                  Tích lũy {order.points} điểm
                </div>
                <Link href={`/ca-nhan/lich-su-don-hang/${order.id}`}>
                  <button className="px-2 py-2 text-sm bg-[#0053E2] items-center font-semibold text-white rounded-lg">
                    Chi tiết
                  </button>
                </Link>
              </div> */}
            </div>
          </div>
        ))}
    </div>
  );
};

export default HistoryOrder;
