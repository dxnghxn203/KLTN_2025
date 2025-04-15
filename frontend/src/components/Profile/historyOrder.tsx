"use client";
import { Search, X, ArrowLeft, Truck, Package, CheckCircle, XCircle, Clock, Archive, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { formatDate } from "@/utils/string";
import { getOrderStatusInfo, canCancelOrder, ORDER_STATUS_NAMES } from "@/utils/orderStatusMapping";
import { useToast } from "@/providers/toastProvider";
import Image from "next/image";

const HistoryOrder: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { ordersUser, getOrdersByUser, cancelOrder, getTrackingCode } = useOrder();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState<string | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);

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
          closeCancelDialog();
          if (viewMode === "detail") {
            setViewMode("list");
            setSelectedOrderDetail(null);
          }
          getOrders();
        },
        (error) => {
          toast.showToast("Hủy đơn hàng thất bại", "error");
          console.error(error);
          closeCancelDialog();
        }
      );
    }
  };

  const showOrderDetail = (order: any) => {
    setSelectedOrderDetail(order);
    setViewMode("detail");
    setTrackingHistory([]);
    setLoadingTracking(true);
    getTrackingCode(
      order.order_id,
      (data: any) => {
        setTrackingHistory(data);
        setLoadingTracking(false);
      },
      (error: any) => {
        console.error("Failed to fetch tracking history:", error);
        setLoadingTracking(false);
        toast.showToast("Không thể tải lịch sử vận đơn", "error");
      }
    );
  };

  const showOrderList = () => {
    setSelectedOrderDetail(null);
    setViewMode("list");
  };

  const tabs = [
    { id: "all", label: "Tất cả" },
    ...Object.keys(ORDER_STATUS_NAMES).map((status) => ({
      id: status,
      label: ORDER_STATUS_NAMES[status as keyof typeof ORDER_STATUS_NAMES],
    })),
  ];

  const renderOrderDetail = (order: any) => {
    const statusInfo = getOrderStatusInfo(order.status);

    const trackingIconMap: { [key: string]: React.ElementType } = {
      created: Package,
      confirmed: Package,
      waiting_to_pick: Clock,
      picking: Truck,
      picked: Truck,
      delivering: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
      returning: Truck,
      returned: Archive,
    };

    const processedTrackingHistory = (trackingHistory || [])
      .sort((a: any, b: any) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
      .map((event: any) => {
        const statusKey = event.status as keyof typeof ORDER_STATUS_NAMES;
        const statusText = ORDER_STATUS_NAMES[statusKey] || `Trạng thái: ${event.status}`;
        const statusIcon = trackingIconMap[event.status] || Package;

        return {
          status: statusText + (event.shipper_name ? ` (Shipper: ${event.shipper_name})` : ''),
          time: event.created_date,
          icon: statusIcon,
        };
      });

    return (
      <div className="bg-white shadow rounded-lg p-6 mt-4">
        <button onClick={showOrderList} className="mb-4 flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
        </button>
        <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-4">
          Chi tiết đơn hàng: {order.order_id}
        </h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">Thông tin chung</h4>
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-gray-600">Mã theo dõi:</span> {order.tracking_id}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Trạng thái:</span>
                  <span
                    className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusInfo.colors.bg} ${statusInfo.colors.text}`}
                  >
                    {statusInfo.displayName}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">Ngày tạo:</span> {formatDate(order.created_date)}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Shipper:</span> {order.shipper_name} ({order.shipper_id})
                </p>
                <p>
                  <span className="font-medium text-gray-600">Hướng dẫn giao hàng:</span> {order.delivery_instruction || "Không có"}
                </p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">Thông tin thanh toán</h4>
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-gray-600">Hình thức:</span> {order.payment_type}
                </p>
                <p className="flex items-center">
                  <span className="font-medium text-gray-600 mr-2">Trạng thái TT:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    order.payment_status === 'PAID'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-600">Tiền hàng:</span> {order.product_fee?.toLocaleString("vi-VN")}đ
                </p>
                <p>
                  <span className="font-medium text-gray-600">Phí ship:</span> {order.shipping_fee?.toLocaleString("vi-VN")}đ
                </p>
                <p className="font-semibold text-blue-700">
                  <span className="font-medium text-gray-600">Tổng tiền:</span> {order.total_fee?.toLocaleString("vi-VN")}đ
                </p>
                <p>
                  <span className="font-medium text-gray-600">Cân nặng:</span> {order.weight} kg
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">Thông tin người nhận</h4>
              <p>
                <span className="font-medium text-gray-600">Tên:</span> {order.pick_to.name}
              </p>
              <p>
                <span className="font-medium text-gray-600">SĐT:</span> {order.pick_to.phone_number}
              </p>
              <p>
                <span className="font-medium text-gray-600">Địa chỉ:</span>{" "}
                {`${order.pick_to.address.address}, ${order.pick_to.address.ward}, ${order.pick_to.address.district}, ${order.pick_to.address.province}`}
              </p>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-800">Sản phẩm</h4>
            <ul className="space-y-4">
              {order.product.map((product: any) => (
                <li key={product.product_id} className="flex items-center border-b pb-4 last:border-b-0">
                  <div className="flex-shrink-0 mr-4">
                    <Image
                      src={product.images_primary || "/placeholder-image.png"}
                      alt={product.product_name}
                      width={64}
                      height={64}
                      className="object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png";
                      }}
                      unoptimized={product.images_primary?.includes("https://kltn2025.s3")}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{product.product_name}</p>
                    <p className="text-xs text-gray-500">
                      SL: {product.quantity} {product.unit}
                    </p>
                  </div>
                  <p className="font-medium ml-4 flex-shrink-0">{product.price?.toLocaleString("vi-VN")}đ</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border rounded-lg min-h-[150px]">
            <h4 className="font-semibold mb-3 text-gray-800">Lịch sử vận đơn</h4>
            {loadingTracking ? (
              <div className="flex items-center justify-center text-gray-500 py-4">
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                <span>Đang tải lịch sử...</span>
              </div>
            ) : processedTrackingHistory.length > 0 ? (
              <div className="relative pl-6">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <ul className="space-y-6">
                  {processedTrackingHistory.map((item: any, index: number) => (
                    <li key={index} className="relative flex items-start">
                      <div className={`absolute left-0 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        <item.icon size={14} />
                      </div>
                      <div className="ml-6 pl-4">
                        <p className={`font-medium ${index === 0 ? 'text-green-700' : 'text-gray-700'}`}>{item.status}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.time)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có thông tin vận đơn.</p>
            )}
          </div>
          {canCancelOrder(order.status) && (
            <div className="mt-4">
              <button
                onClick={() => openCancelDialog(order.order_id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Hủy đơn hàng này
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

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
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <button className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-blue-500 whitespace-nowrap">+</button>
      </div>
      {viewMode === "list" && (
        <>
          {activeTab === "all" &&
            ordersUser &&
            ordersUser.map((order: any) => (
              <div key={order?.order_id} className="bg-[#F5F7F9] rounded-lg p-4 mt-4">
                <div className="border-b last:border-0 pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span
                        onClick={() => showOrderDetail(order)}
                        className="text-blue-600 hover:text-blue-800 font-semibold mr-2 cursor-pointer"
                      >
                        {order?.order_id}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order?.order_id);
                        }}
                        className="text-gray-500 hover:text-blue-600 cursor-pointer"
                        title="Copy mã đơn hàng"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      const statusInfo = getOrderStatusInfo(order.status);
                      return (
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.colors.bg} ${statusInfo.colors.text}`}
                        >
                          <span className={`mr-1.5 ${statusInfo.colors.text}`}>●</span>
                          {statusInfo.displayName}
                        </span>
                      );
                    })()}
                    <span className="text-gray-500 text-sm">{formatDate(order.created_date) || "N/A"}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-400 w-full my-2"></div>
                  <div className="mt-3 space-y-2.5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-gray-600">Người nhận:</span>
                      <span className="font-semibold ml-1">{order.pick_to.name}</span>
                      <span className="mx-1">|</span>
                      <span className="text-gray-700">{order.pick_to.phone_number}</span>
                    </div>
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-600">Nơi giao hàng:</span>
                      <span className="font-semibold block ml-1">
                        {`${order.pick_to.address.address}, ${order.pick_to.address.ward}, ${order.pick_to.address.district}, ${order.pick_to.address.province}`}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                    <div className="flex items-center">
                      <div className="px-4 py-2 rounded-md">
                        <span className="text-gray-600">Thành tiền:</span>
                        <span className="font-bold text-lg ml-2 text-blue-700">{order?.total_fee.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <div className="flex items-center border-l pl-4 ml-4">
                        <div className="flex items-center">
                          {order?.payment_type === "COD" ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-amber-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="font-medium text-gray-700">Phương thức: </span>
                              <span className="ml-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-sm font-medium">
                                Thanh toán khi nhận hàng COD
                              </span>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                              </svg>
                              <span className="font-medium text-gray-700">Phương thức: </span>
                              <span className="ml-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-md text-sm font-medium">
                                Thanh toán trước
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => openCancelDialog(order.order_id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </>
      )}
      {viewMode === "detail" && selectedOrderDetail && renderOrderDetail(selectedOrderDetail)}
      {isCancelDialogOpen && (
        <div className="fixed z-20 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Xác nhận hủy đơn hàng</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Bạn có chắc chắn muốn hủy đơn hàng {orderIdToCancel}?</p>
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
                  Xác nhận hủy
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeCancelDialog}
                >
                  Không
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryOrder;
