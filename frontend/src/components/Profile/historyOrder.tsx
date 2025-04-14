"use client";
import { Search, X } from "lucide-react";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrder";
import { formatDate } from "@/utils/string";
import { getOrderStatusInfo, canCancelOrder, OrderStatusCode, ORDER_STATUS_NAMES } from "@/utils/orderStatusMapping";
import { useToast } from "@/providers/toastProvider";

const HistoryOrder: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { ordersUser, getOrdersByUser, cancelOrder } = useOrder();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState<string | null>(null);

  const toast = useToast();
  const getOrders = () => {
    getOrdersByUser();
  };

  useEffect(() => {
    getOrders();
  }, []);

  const openCancelDialog = (orderId: string) => {
    setOrderIdToCancel(orderId);
    setIsCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setIsCancelDialogOpen(false);
    setOrderIdToCancel(null);
  };

  const handleCancelOrder = async () => {
    if (orderIdToCancel) {
      cancelOrder(
        orderIdToCancel,
        () => {
          toast.showToast("Hủy đơn hàng thành công", "success");
          getOrders();
        },
        (error) => {
          toast.showToast("Hủy đơn hàng thất bại", "error");
          console.error(error);
        }
      );
      closeCancelDialog();
    }
  };

  const tabs = [
    { id: "all", label: "Tất cả" },
    ...Object.keys(ORDER_STATUS_NAMES).map((status) => ({
      id: status,
      label: ORDER_STATUS_NAMES[status as keyof typeof ORDER_STATUS_NAMES],
    })),
  ];

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

      <div className="mt-4 flex space-x-4 border-b border-gray-300 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === tab.id
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 hover:text-blue-500"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <button className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-blue-500 whitespace-nowrap">
          +
        </button>
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
                <div className="px-4 py-2 rounded-md">
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
            </div>
            {canCancelOrder(order.status) && (
              <>
                <button
                  onClick={() => openCancelDialog(order.order_id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Hủy đơn hàng
                </button>
                {isCancelDialogOpen && (
                  <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center">
                      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                      </div>

                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Xác nhận hủy đơn hàng
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Bạn có chắc chắn muốn hủy đơn hàng này?
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={handleCancelOrder}
                          >
                            Xác nhận
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={closeCancelDialog}
                          >
                            Hủy bỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default HistoryOrder;
