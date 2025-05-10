import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx"; // hoặc classnames
import { useOrder } from "@/hooks/useOrder";
import { on } from "events";
import Image from "next/image";
import DetailRequestOrder from "@/components/Profile/DetailRequestOrder";

const tabs = [
  { label: "Tất cả", value: "all" },
  { label: "Đang chờ duyệt", value: "pending" },
  { label: "Chưa thể liên lạc", value: "unconnect" },
  { label: "Từ chối", value: "rejected" },
];

const MyPrescriptionComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { fetchGetRequestOrder, allRequestOrder } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  console.log("fetchGetRequestOrder", allRequestOrder);
  useEffect(() => {
    fetchGetRequestOrder(
      (onSuccess: any) => {
        console.log("fetchGetRequestOrder", onSuccess);
      },
      (onError: any) => {
        console.log("fetchGetRequestOrder", onError);
      }
    );
  }, []);
  const countByStatus = (status: string) => {
    return allRequestOrder.filter((order: any) => order.status === status)
      .length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Đơn thuốc của tôi</h2>
        <div className="relative w-[410px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Tabs trạng thái */}
      <div className="flex gap-4 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={clsx(
              "pb-2 px-3 text-sm font-medium border-b-2 transition flex items-center",
              activeTab === tab.value
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500"
            )}
          >
            {tab.label}
            {tab.value !== "all" && (
              <span className="ml-2 w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full flex items-center justify-center">
                {countByStatus(tab.value)}
              </span>
            )}
            {tab.value === "all" && (
              <span className="ml-2 w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full flex items-center justify-center">
                {allRequestOrder.length}
              </span>
            )}
          </button>
        ))}
      </div>
      {selectedOrder ? (
        <div className="bg-[#F5F7F9] rounded-lg p-4 mt-4">
          <button
            className="mb-4 text-sm text-blue-600  flex "
            onClick={() => setSelectedOrder(null)}
          >
            <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
          </button>
          <DetailRequestOrder order={selectedOrder} />
        </div>
      ) : (
        <div>
          <p className="text-sm">
            {allRequestOrder
              ?.filter(
                (order: any) =>
                  activeTab === "all" || order.status === activeTab // Lọc theo trạng thái
              ) // Lọc theo tab
              .map((allRequestOrder: any) => (
                <div
                  key={allRequestOrder?.request_id}
                  className="bg-[#F5F7F9] rounded-lg p-4 mt-4"
                >
                  <div className="border-b last:border-0 pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center ">
                        <span
                          onClick={() => {
                            setSelectedOrder(allRequestOrder);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold mr-2 cursor-pointer"
                        >
                          {allRequestOrder?.request_id}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              allRequestOrder?.request_id
                            );
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
                      {activeTab === "all" && (
                        <span
                          className={`ml-2 text-sm font-medium px-2 py-1 rounded-full ${
                            allRequestOrder.status === "pending"
                              ? "bg-yellow-100 text-yellow-500"
                              : allRequestOrder.status === "unconnect"
                              ? "bg-green-100 text-green-700"
                              : allRequestOrder.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : allRequestOrder.status === "approved"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }`}
                        >
                          ●{" "}
                          {allRequestOrder.status === "pending"
                            ? "Đang chờ duyệt"
                            : allRequestOrder.status === "unconnect"
                            ? "Chưa thể liên lạc"
                            : allRequestOrder.status === "rejected"
                            ? "Từ chối"
                            : allRequestOrder.status === "approved"
                            ? "Đã được duyệt"
                            : ""}
                        </span>
                      )}
                    </div>
                    <div className="border-t border-dashed border-gray-400 w-full my-2"></div>
                    <div className="mt-3 space-y-2.5 ">
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
                        <span className="text-gray-600 ">Người nhận:</span>
                        <span className="font-medium ml-1">
                          {allRequestOrder.pick_to.name}
                        </span>
                        <span className="mx-1">|</span>
                        <span className="text-gray-700">
                          {allRequestOrder.pick_to.phone_number}
                        </span>
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
                        <span className="font-medium block ml-1">
                          {`${allRequestOrder.pick_to.address.address}, ${allRequestOrder.pick_to.address.ward}, ${allRequestOrder.pick_to.address.district}, ${allRequestOrder.pick_to.address.province}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyPrescriptionComponent;
