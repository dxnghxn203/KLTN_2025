"use client";

import { useState } from "react";
import { OrderStatusCode, getOrderStatusInfo } from "@/utils/orderStatusMapping";
import { useRouter } from "next/navigation";

// Mock types for our data model - replace with your actual types
interface Order {
    id: string;
    orderCode: string;
    status: string;
    customerName: string;
    customerPhone: string;
    createdAt: string;
    totalAmount: number;
    products: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
    }>;
    deliveryAddress: string;
}

export default function StatusOrderPage() {
    const [orderCode, setOrderCode] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    // Mock function to fetch order data - replace with actual API call
    const searchOrder = async (code: string) => {
        setIsSearching(true);
        setError("");

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (code === "NOT_FOUND") {
                throw new Error("Không tìm thấy đơn hàng");
            }

            // Mock data
            const mockOrder: Order = {
                id: "order1",
                orderCode: code,
                status: "delivering", // Default status
                customerName: "Khách hàng A",
                customerPhone: "0987654321",
                createdAt: new Date().toISOString(),
                totalAmount: 350000,
                products: [
                    {
                        id: "prod1",
                        name: "Paracetamol 500mg",
                        quantity: 2,
                        price: 150000,
                    },
                    {
                        id: "prod2",
                        name: "Vitamin C 1000mg",
                        quantity: 1,
                        price: 50000,
                    },
                ],
                deliveryAddress: "123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
            };

            setOrder(mockOrder);
            // Initialize new status to current status
            setNewStatus(mockOrder.status);
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi tìm kiếm đơn hàng");
            setOrder(null);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle submit status change - replace with actual API call
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!order || !newStatus || newStatus === order.status) return;

        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful update
            setSuccess(`Đã cập nhật trạng thái đơn hàng ${order.orderCode} thành công!`);
            setOrder({ ...order, status: newStatus });
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get a list of status options that would be logical next steps from current status
    const getAvailableNextStatuses = (currentStatus: string) => {
        // This is a simplified flow - update with your actual business rules
        const statusFlow: Record<string, string[]> = {
            "created": ["waiting_to_pick", "canceled"],
            "waiting_to_pick": ["picking", "canceled"],
            "picking": ["delivering", "canceled"],
            "delivering": ["delivery_success", "delivery_part_success", "delivery_fail"],
            "delivery_fail": ["waiting_to_return"],
            "delivery_part_success": ["delivery_part_waiting_to_return"],
            "delivery_part_waiting_to_return": ["delivery_part_returned"],
            "waiting_to_return": ["returned"],
            "delivery_success": [], // End state
            "delivery_part_returned": [], // End state
            "returned": [], // End state
            "canceled": [], // End state
        };

        return Object.values(OrderStatusCode).filter(status => {
            if (!currentStatus) return false;
            // Allow selecting all statuses for flexibility in the demo
            return true; // Replace with: return statusFlow[currentStatus]?.includes(status) || false;
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Cập nhật trạng thái đơn hàng</h1>
                <p className="text-gray-600 mt-2">
                    Nhập mã đơn hàng và chọn trạng thái mới để cập nhật
                </p>
            </div>

            {/* Order search section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                        <label htmlFor="orderCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Mã đơn hàng
                        </label>
                        <input
                            id="orderCode"
                            type="text"
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                            placeholder="Nhập mã đơn hàng cần tìm..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isSearching}
                        />
                    </div>
                    <div className="sm:self-end">
                        <button
                            onClick={() => searchOrder(orderCode)}
                            disabled={!orderCode.trim() || isSearching}
                            className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSearching ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang tìm...
                                </span>
                            ) : (
                                "Tìm kiếm"
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Order details and status update form */}
            {order && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order details panel */}
                    <div className="md:col-span-2">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="text-lg font-semibold text-gray-800">Thông tin đơn hàng</h2>
                            </div>

                            <div className="px-6 py-4">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                        <p className="font-semibold">{order.orderCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Trạng thái hiện tại</p>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Thời gian tạo</p>
                                        <p>{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng tiền</p>
                                        <p className="font-semibold">{order.totalAmount.toLocaleString("vi-VN")}đ</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                                    <p>{order.customerName}</p>
                                    <p>{order.customerPhone}</p>
                                    <p className="text-sm text-gray-600 mt-1">{order.deliveryAddress}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Sản phẩm</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tên sản phẩm
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Số lượng
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Đơn giá
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Thành tiền
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {order.products.map((product) => (
                                                    <tr key={product.id}>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{product.quantity}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{product.price.toLocaleString("vi-VN")}đ</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{(product.price * product.quantity).toLocaleString("vi-VN")}đ</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status update panel */}
                    <div>
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="text-lg font-semibold text-gray-800">Cập nhật trạng thái</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="px-6 py-4">
                                <div className="mb-6">
                                    <label htmlFor="currentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Trạng thái hiện tại
                                    </label>
                                    <StatusBadge status={order.status} size="large" />
                                    <div className="text-sm text-gray-500 mt-2">
                                        {getOrderStatusInfo(order.status).description}
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="mb-6">
                                    <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Trạng thái mới
                                    </label>
                                    <select
                                        id="newStatus"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        disabled={isSubmitting}
                                    >
                                        <option value="">-- Chọn trạng thái --</option>
                                        {getAvailableNextStatuses(order.status).map((status) => (
                                            <option
                                                key={status}
                                                value={status}
                                                disabled={status === order.status}
                                            >
                                                {getOrderStatusInfo(status).displayName}
                                            </option>
                                        ))}
                                    </select>

                                    {newStatus && newStatus !== order.status && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                                            <StatusBadge status={newStatus} />
                                            <p className="text-sm text-gray-600 mt-2">
                                                {getOrderStatusInfo(newStatus).description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {success && (
                                    <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-green-700">{success}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !newStatus || newStatus === order.status}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[200px]"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang cập nhật...
                                            </span>
                                        ) : "Xác nhận cập nhật"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state when no order is loaded */}
            {!order && !isSearching && !error && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                    <h2 className="mt-2 text-lg font-medium text-gray-900">Chưa có đơn hàng được chọn</h2>
                    <p className="mt-1 text-sm text-gray-500">Vui lòng nhập mã đơn hàng để bắt đầu.</p>
                </div>
            )}
        </div>
    );
}

interface StatusBadgeProps {
    status: string;
    size?: 'small' | 'large';
}

function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
    const statusInfo = getOrderStatusInfo(status);
    const sizeClasses = size === 'large' ? 'px-4 py-2 text-base' : 'px-2.5 py-1 text-xs';

    return (
        <span className={`inline-flex items-center rounded-full ${statusInfo.colors.bg} ${statusInfo.colors.text} ${sizeClasses} font-medium`}>
            <span className="h-2 w-2 rounded-full bg-current mr-1.5"></span>
            {statusInfo.displayName}
        </span>
    );
}