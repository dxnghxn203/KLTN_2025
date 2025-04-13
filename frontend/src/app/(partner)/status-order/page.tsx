"use client";

import { useState } from "react";
import { OrderStatusCode, getOrderStatusInfo } from "@/utils/orderStatusMapping";
import { FiSearch, FiCheck, FiAlertTriangle, FiArrowRight } from "react-icons/fi";

// Mock types for our data model - replace with your actual types
interface Order {
    id: string;
    orderCode: string;
    status: string;
    customerName: string;
    customerPhone: string;
    createdAt: string;
    expectedDeliveryDate?: string;
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
    const [statusNote, setStatusNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Mock function to fetch order data - replace with actual API call
    const searchOrder = async (code: string) => {
        setIsSearching(true);
        setError("");
        setSuccess("");
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (code === "NOT_FOUND") {
                throw new Error("Không tìm thấy đơn hàng với mã này");
            }
            
            // Mock data
            const mockOrder: Order = {
                id: Math.random().toString(36).substring(2, 15),
                orderCode: code,
                status: "delivering", // Default status
                customerName: "Nguyễn Văn A",
                customerPhone: "0987654321",
                createdAt: new Date().toISOString(),
                expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
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
            // Do not initialize new status automatically
            setNewStatus("");
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
        
        if (!order || !newStatus) {
            setError("Vui lòng chọn trạng thái mới cho đơn hàng");
            return;
        }
        
        if (newStatus === order.status) {
            setError("Trạng thái mới phải khác trạng thái hiện tại");
            return;
        }
        
        setIsSubmitting(true);
        setError("");
        setSuccess("");
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock successful update
            setSuccess(`Đã cập nhật trạng thái đơn hàng ${order.orderCode} từ "${getOrderStatusInfo(order.status).displayName}" thành "${getOrderStatusInfo(newStatus).displayName}" thành công!`);
            setOrder({...order, status: newStatus});
            setStatusNote("");
            setNewStatus("");
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get a list of status options that would be logical next steps from current status
    const getAvailableNextStatuses = (currentStatus: string) => {
        // Define logical status progression based on business rules
        const statusFlow: Record<string, string[]> = {
            "created": ["waiting_to_pick", "canceled"],
            "waiting_to_pick": ["picking", "canceled"],
            "picking": ["delivering", "canceled"],
            "delivering": ["delivery_success", "delivery_fail"],
            "delivery_fail": ["waiting_to_return"],
            "waiting_to_return": ["returned"],
            "delivery_success": [], // End state
            "returned": [], // End state
            "canceled": [], // End state
        };
        
        // For status-order page, we may want to allow all status transitions for admins/partners
        // or restrict based on logical flow
        const allowAllTransitions = true; // Set to false to restrict based on flow
        
        if (!currentStatus || !order) return [];
        
        if (allowAllTransitions) {
            // Only filter out current status and end states if needed
            return Object.values(OrderStatusCode).filter(status => status !== currentStatus);
        } else {
            // Return only valid next statuses based on flow
            return Object.values(OrderStatusCode).filter(status => {
                return statusFlow[currentStatus]?.includes(status);
            });
        }
    };

    return (
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Cập nhật trạng thái đơn hàng</h1>
                <p className="text-gray-600 mt-1">
                    Nhập mã đơn hàng và chọn trạng thái mới để cập nhật
                </p>
            </div>

            {/* Order search section */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Tìm kiếm đơn hàng</h2>
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                <span className="flex items-center">
                                    <FiSearch className="mr-2" />
                                    Tìm kiếm
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                
                {error && (
                    <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiAlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {success && (
                    <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FiCheck className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {order && (
                <>
                    {/* Order details section */}
                    <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Thông tin đơn hàng</h2>
                            <StatusBadge status={order.status} size="large" />
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Chi tiết đơn hàng</h3>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <p className="text-sm text-gray-500">Mã đơn hàng:</p>
                                            <p className="text-sm font-medium text-gray-900">{order.orderCode}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <p className="text-sm text-gray-500">Ngày tạo:</p>
                                            <p className="text-sm text-gray-900">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        {order.expectedDeliveryDate && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <p className="text-sm text-gray-500">Dự kiến giao:</p>
                                                <p className="text-sm text-gray-900">
                                                    {new Date(order.expectedDeliveryDate).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-2">
                                            <p className="text-sm text-gray-500">Tổng tiền:</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Thông tin khách hàng</h3>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-900">{order.customerName}</p>
                                        <p className="text-sm text-gray-900">{order.customerPhone}</p>
                                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Sản phẩm</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {order.products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-900">{product.quantity}</td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-900">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-gray-900">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * product.quantity)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                
                    {/* Status update form */}
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">Cập nhật trạng thái</h2>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                {/* Current status */}
                                <div className="mb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                        <div className="w-full sm:w-1/3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Trạng thái hiện tại
                                            </label>
                                        </div>
                                        <div className="w-full sm:w-2/3">
                                            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                                <StatusBadge status={order.status} size="large" />
                                                <p className="text-sm text-gray-600 mt-2">
                                                    {getOrderStatusInfo(order.status).description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status change visualization */}
                                {newStatus && (
                                    <div className="mb-6 flex justify-center items-center">
                                        <StatusBadge status={order.status} />
                                        <FiArrowRight className="mx-3 text-gray-400" />
                                        <StatusBadge status={newStatus} />
                                    </div>
                                )}
                                
                                {/* New status selection */}
                                <div className="mb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <div className="w-full sm:w-1/3">
                                            <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700">
                                                Chọn trạng thái mới
                                            </label>
                                        </div>
                                        <div className="w-full sm:w-2/3">
                                            <select
                                                id="newStatus"
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                disabled={isSubmitting}
                                            >
                                                <option value="">-- Chọn trạng thái mới --</option>
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
                                            
                                            {newStatus && (
                                                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    <p className="text-sm text-gray-600">
                                                        {getOrderStatusInfo(newStatus).description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status update note */}
                                <div className="mb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <div className="w-full sm:w-1/3">
                                            <label htmlFor="statusNote" className="block text-sm font-medium text-gray-700">
                                                Ghi chú (nếu có)
                                            </label>
                                        </div>
                                        <div className="w-full sm:w-2/3">
                                            <textarea
                                                id="statusNote"
                                                value={statusNote}
                                                onChange={(e) => setStatusNote(e.target.value)}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                placeholder="Nhập ghi chú về việc thay đổi trạng thái (nếu cần)"
                                                rows={3}
                                                disabled={isSubmitting}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Submit button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !newStatus || newStatus === order.status}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                </>
            )}
            
            {/* Empty state when no order is loaded */}
            {!order && !isSearching && !error && (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đơn hàng nào</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Vui lòng tìm kiếm một đơn hàng để cập nhật trạng thái.
                    </p>
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
    const sizeClasses = size === 'large' ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs';
    
    return (
        <span className={`inline-flex items-center rounded-full ${statusInfo.colors.bg} ${statusInfo.colors.text} ${sizeClasses} font-medium`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5"></span>
            {statusInfo.displayName}
        </span>
    );
}