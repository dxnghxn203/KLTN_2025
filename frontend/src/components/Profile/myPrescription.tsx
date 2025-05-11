import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx"; // hoặc classnames
import { useOrder } from "@/hooks/useOrder";
import { on } from "events";
import Image from "next/image";

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

  // console.log("fetchGetRequestOrder", allRequestOrder);
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
  console.log("selectedOrder", selectedOrder);

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

          <div className="border-b last:border-0 pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center ">
                <div className="">
                  <span className="font-semibold">Thông tin chung</span>
                  <div className="items-center justify-between mt-2">
                    <div className="flex-col text-sm space-y-2">
                      <div className="flex space-x-2 items-center">
                        <span className="text-gray-600"> Mã yêu cầu: </span>
                        <span className="text-sm">
                          {selectedOrder.request_id}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Trạng thái: </span>
                        <span
                          className={`text-xs font-medium rounded-full px-2 py-1 w-fit  ${
                            selectedOrder.status === "pending"
                              ? "text-yellow-500 bg-yellow-100"
                              : selectedOrder.status === "unconnect"
                              ? "text-gray-500  bg-gray-100"
                              : selectedOrder.status === "rejected"
                              ? "text-red-500 bg-red-100"
                              : selectedOrder.status === "approved"
                              ? "text-green-600 bg-green-100"
                              : "text-gray-400 bg-gray-100"
                          }`}
                        >
                          {selectedOrder.status === "pending"
                            ? "Đang chờ duyệt"
                            : selectedOrder.status === "unconnect"
                            ? "Chưa thể liên lạc"
                            : selectedOrder.status === "rejected"
                            ? "Từ chối"
                            : selectedOrder.status === "approved"
                            ? "Đã được duyệt"
                            : "Không rõ"}
                        </span>
                      </div>

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
                          {selectedOrder.pick_to.name}
                        </span>
                        <span className="mx-1">|</span>
                        <span className="text-gray-700">
                          {selectedOrder.pick_to.phone_number}
                        </span>
                      </div>
                      <div className="flex items-center">
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
                          {/* {`${selectedOrder.pick_to.address.address}, ${selectedOrder.pick_to.address.ward}, ${selectedOrder.pick_to.address.district}, ${allRequestOrder.pick_to.address.province}`} */}
                          {selectedOrder.pick_to.address.address}{" "}
                          {selectedOrder.pick_to.address.ward},{" "}
                          {selectedOrder.pick_to.address.district},{" "}
                          {selectedOrder.pick_to.address.province}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    {/* Cột sản phẩm */}
                    <div className="w-full my-2 border border-gray-300 rounded-lg p-4">
                      <span className="font-semibold">Thông tin sản phẩm</span>
                      {selectedOrder.product?.map(
                        (product: any, index: number) => (
                          <div
                            key={product.product_id}
                            className={`flex items-center py-2 text-sm ${
                              index !== selectedOrder.product.length - 1
                                ? "border-b border-gray-300"
                                : ""
                            }`}
                          >
                            <div className="flex items-center space-x-4 w-2/3">
                              <Image
                                src={product.images_primary}
                                alt={product.product_name}
                                width={70}
                                height={70}
                                className="rounded-lg object-cover"
                              />
                              <span className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
                                {product?.product_name}
                              </span>
                            </div>
                            <div className="flex justify-end items-center w-1/3 space-x-2">
                              <div className="text-center">
                                x{product.quantity} {product.unit}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Cột ảnh toa thuốc */}
                    <div className="w-full my-2 border border-gray-300 rounded-lg p-4">
                      <span className="font-semibold">Ảnh toa thuốc</span>
                      <div className="flex flex-wrap items-center gap-4 py-2 text-sm">
                        {selectedOrder.images &&
                        selectedOrder.images.length > 0 ? (
                          selectedOrder.images.map((image: any) => (
                            <div key={image.images_id}>
                              <Image
                                src={image.images_url}
                                alt="Ảnh toa thuốc"
                                width={160}
                                height={160}
                                className="object-cover rounded border"
                              />
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">
                            Không có ảnh toa thuốc
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedOrder.status === "rejected" && (
                    <div className="mt-4 space-y-2 w-[50%]">
                      <span className="font-semibold">Lý do từ chối</span>
                      <textarea
                        className="w-full h-24 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 resize-none"
                        value={selectedOrder.note}
                        readOnly
                        rows={4}
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm">
            {allRequestOrder
              ?.filter(
                (order: any) =>
                  activeTab === "all" || order.status === activeTab // Lọc theo trạng thái
              )
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
