"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BsBoxSeam } from "react-icons/bs";
import { BsInboxes, BsBox2Heart, BsXCircle } from "react-icons/bs";
import Image from "next/image";
import { Table, X } from "lucide-react";
import { DatePicker } from "antd";
import { FaSyncAlt } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import "dayjs/locale/en"; // Import locale nếu cần
import TableOrdersAdmin from "./tableOrders";
import { useOrder } from "@/hooks/useOrder";
import { all } from "axios";

const { RangePicker } = DatePicker;
const statuses = [
  {
    label: "Unpaid",
    count: 4,
    bgColor: "bg-gray-300",
    textColor: "text-gray-500",
  },
  {
    label: "Paid",
    count: 1,
    bgColor: "bg-gray-300",
    textColor: "text-gray-500",
  },
  {
    label: "Processing",
    count: 2,
    bgColor: "bg-gray-300",
    textColor: "text-gray-500",
  },
  {
    label: "Refunded",
    count: 1,
    bgColor: "bg-gray-300",
    textColor: "text-gray-500",
  },
];
const Order = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
  const [selectedTab, setSelectedTab] = useState("Unpaid");
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().startOf("month"), // Ngày đầu tháng hiện tại
    dayjs().endOf("month"), // Ngày cuối tháng hiện tại
  ]);
  const { allStatistics365Days, statistics365Days } = useOrder();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const handleAddOrder = (newUser: {
    name: string;
    email: string;
    phoneNumber: number;
    role: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log("User added:", newUser);
  };
  useEffect(() => {
    allStatistics365Days(
      () => {},
      () => {}
    );
  }, [statistics365Days]);

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-black">Quản lý đơn hàng</h2>
        <div className="my-4 text-sm">
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Dashboard
          </Link>
          <span> / </span>
          <Link href="/order" className="text-gray-800">
            Quản lý đơn hàng
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#E7ECF7] rounded-3xl p-4 flex items-center justify-between w-full max-w-sm relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="text-black font-medium">Tổng đơn hàng</span>
              <div className="flex text-[#1E4DB7] text-2xl items-center">
                <span className="font-medium">{statistics365Days?.total}</span>
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
                <span className="font-medium">{statistics365Days?.cancel}</span>
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
        <div className="flex items-center justify-between w-full">
          <div className="flex  ">
            <RangePicker
              value={dates}
              onChange={(values) =>
                setDates(
                  values
                    ? (values as [Dayjs | null, Dayjs | null])
                    : [null, null]
                )
              }
              format="DD MMM, YYYY"
              size="large"
              className="rounded-lg p-2 space-x-1 w-[270px]"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center gap-2 px-4 py-3 bg-[#1E4DB7] text-white rounded-lg text-sm font-medium transition">
              <FaSyncAlt className="text-white" />
              Đồng bộ hóa
            </button>

            <button className="flex items-center gap-2 px-4 py-3 border border-[#1E4DB7] text-[#1E4DB7] rounded-lg text-sm font-medium hover:bg-gray-200 transition">
              <FiDownload className="text-[#1E4DB7]" />
              Tải về CSV
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-1 py-1 rounded-2xl w-fit">
          {statuses.map((status) => (
            <button
              key={status.label}
              className={`flex items-center gap-1 px-2 py-2 rounded-2xl text-sm font-medium transition ${
                selectedTab === status.label
                  ? "bg-[#1E4DB7] text-white"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedTab(status.label)}
            >
              {status.label}
              <span
                className={`rounded-full w-4 h-4 text-xs font-semibold ${
                  selectedTab === status.label
                    ? "bg-white text-[#1E4DB7]"
                    : status.bgColor + " " + status.textColor
                }`}
              >
                {status.count}
              </span>
            </button>
          ))}
        </div>
        <TableOrdersAdmin />
      </div>
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-[400px] h-full shadow-lg p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">
                Order #{selectedOrder?.id}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <X className="text-2xl text-gray-700" />
              </button>
            </div>

            <div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold my-4">
                  Order items{" "}
                  <span className="text-gray-500 ml-1">
                    {selectedOrder?.products?.length || 0}
                  </span>
                </h2>

                {Array.isArray(selectedOrder?.products) &&
                  selectedOrder.products.map((product: any, index: number) => (
                    <div
                      key={index}
                      className="border-b pb-3 flex items-center space-x-4"
                    >
                      <Image
                        src={product?.img}
                        alt={product?.name}
                        className="w-16 h-16 rounded-lg border border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-2">{product?.name}</p>
                      </div>
                      <span className="space-x-4">
                        <span className="font-semibold">
                          {product?.quantity || 0}
                        </span>
                        <span className="font-normal text-gray-500">x</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product?.price || 0)}
                        </span>
                      </span>
                    </div>
                  ))}

                <div className="mt-3 text-right text-lg text-gray-500">
                  Total
                  <span className="ml-4 text-black font-semibold">
                    {selectedOrder?.total?.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <h2 className="text-lg font-semibold my-4">Contact</h2>
                <div className="gap-4">
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Customer:</p>
                    <p className="w-2/3">{selectedOrder?.customer?.name}</p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Phone:</p>
                    <p className="w-2/3">{selectedOrder?.customer?.phone}</p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Email:</p>
                    <p className="w-2/3">{selectedOrder?.customer?.email}</p>
                  </div>
                  <div className="flex">
                    <p className="text-gray-500 font-medium w-1/3">Address:</p>
                    <p className="w-2/3">
                      {selectedOrder?.customer?.address
                        ? `${selectedOrder.customer.address.street}, ${selectedOrder.customer.address.ward}, ${selectedOrder.customer.address.district}, ${selectedOrder.customer.address.city}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button className="bg-[#1E4DB7] text-white px-2 text-sm py-2 rounded-lg hover:bg-[#173F98]">
                Download Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
