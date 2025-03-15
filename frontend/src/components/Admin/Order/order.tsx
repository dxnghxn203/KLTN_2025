'use client'
import { useState } from "react";
import CustomPagination from "../CustomPagination/customPagination";
import Link from "next/link";
import { useOrder } from "@/hooks/useOrder";

const Order = () => {
  const { allOrder } = useOrder();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 6; // Số đơn hàng hiển thị trên mỗi trang

  // Tính toán dữ liệu hiển thị theo trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrder.slice(indexOfFirstOrder, indexOfLastOrder);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-extrabold text-black">Order Management</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Home
        </Link>
        <span> / </span>
        <Link href="/order" className="text-gray-800">
          Order management
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-2xl ">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead className="text-sm border-b border-gray-200">
              <tr>
                <th className="p-6 text-left">Order ID</th>
                <th className="p-6 text-left">Customer</th>
                <th className="p-6 text-left">Order Date</th>
                <th className="p-6 text-left">Total</th>
                <th className="p-6 text-left">Status</th>
                <th className="p-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order: any, index: any) => (
                <tr
                  key={order.id}
                  className={`text-sm hover:bg-gray-50 transition ${
                    index !== currentOrders.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <td className="p-6 text-left">{order?.id}</td>
                  <td className="p-6 text-left">{order?.customer?.name}</td>
                  <td className="p-6 text-left">{order?.createdAt}</td>
                  <td className="p-6 text-left">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="p-6 text-left">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Ordered"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 flex items-center space-x-4">
                    <button className="text-blue-500 hover:text-blue-700">
                      Chi tiết
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      Hủy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* CustomPagination */}
        <div className="flex justify-center p-6">
          <CustomPagination
            current={currentPage}
            total={allOrder?.length}
            pageSize={ordersPerPage}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Order;
