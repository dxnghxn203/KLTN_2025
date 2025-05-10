"use client";
import React from "react";
import Image from "next/image";

// viết drops cho DetailRequestOrder
interface DetailRequestOrderProps {
  order: {
    product: any[];
    images: any[];
    status: string;
    note?: string;
    request_id: string;
    pick_to: {
      name: string;
      phone_number: string;
      address: {
        address: string;
        ward: string;
        district: string;
        province: string;
      };
    };
  };
}
const DetailRequestOrder: React.FC<DetailRequestOrderProps> = ({ order }) => {
  return (
    <div className="">
      <div className="items-center justify-between space-y-2">
        <span className="font-semibold">Thông tin chung</span>
        <div className="flex flex-col text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Mã yêu cầu: {order.request_id}
            </span>
            <span
              className={`text-sm font-medium rounded-full px-2 py-1  ${
                order.status === "pending"
                  ? "text-yellow-500 bg-yellow-100"
                  : order.status === "unconnect"
                  ? "text-gray-500  bg-gray-100"
                  : order.status === "rejected"
                  ? "text-red-500 bg-red-100"
                  : order.status === "approved"
                  ? "text-green-600 bg-green-100"
                  : "text-gray-400 bg-gray-100"
              }`}
            >
              {order.status === "pending"
                ? "Đang chờ duyệt"
                : order.status === "unconnect"
                ? "Chưa thể liên lạc"
                : order.status === "rejected"
                ? "Từ chối"
                : order.status === "approved"
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
            <span className="font-medium ml-1">{order.pick_to.name}</span>
            <span className="mx-1">|</span>
            <span className="text-gray-700">{order.pick_to.phone_number}</span>
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
              {`${order.pick_to.address.address}, ${order.pick_to.address.ward}, ${order.pick_to.address.district}, ${order.pick_to.address.province}`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        {/* Cột sản phẩm */}
        <div className="w-full my-2 border border-gray-300 rounded-lg p-4">
          <span className="font-semibold">Thông tin sản phẩm</span>
          {order.product?.map((product: any, index: number) => (
            <div
              key={product.product_id}
              className={`flex items-center py-2 text-sm ${
                index !== order.product.length - 1
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
          ))}
        </div>

        {/* Cột ảnh toa thuốc */}
        <div className="w-full my-2 border border-gray-300 rounded-lg p-4">
          <span className="font-semibold">Ảnh toa thuốc</span>
          <div className="flex flex-wrap items-center gap-2 py-2 text-sm">
            {order.images && order.images.length > 0 ? (
              order.images.map((image: any) => (
                <div key={image.images_id}>
                  <Image
                    src={image.images_url}
                    alt="Ảnh toa thuốc"
                    width={120}
                    height={120}
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
      {order.status === "rejected" && (
        <div className="mt-4 space-y-2 w-[50%]">
          <span className="font-semibold">Lý do từ chối</span>
          <textarea
            className="w-full h-24 border border-gray-300 rounded-lg p-2 text-sm text-gray-700 resize-none"
            value={order.note}
            readOnly
            rows={4}
          ></textarea>
        </div>
      )}
    </div>
  );
};
export default DetailRequestOrder;
