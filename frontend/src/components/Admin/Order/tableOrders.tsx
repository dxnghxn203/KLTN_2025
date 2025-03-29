"use client";
import { useOrder } from "@/hooks/useOrder";
import { useEffect, useState } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { ChevronDown, ChevronUp, Edit, Eye, Trash2, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import React from "react";
import { useToast } from "@/providers/toastProvider";

const statusConfig: Record<string, { label: string; color: string; textColor: string }> = {
    create_order: {
        label: "Đã tạo đơn",
        color: "bg-blue-100",
        textColor: "text-blue-700"
    },
    confirmed: {
        label: "Đã xác nhận",
        color: "bg-green-100",
        textColor: "text-green-700"
    },
    processing: {
        label: "Đang xử lý",
        color: "bg-yellow-100",
        textColor: "text-yellow-700"
    },
    shipping: {
        label: "Đang vận chuyển",
        color: "bg-purple-100",
        textColor: "text-purple-700"
    },
    delivered: {
        label: "Đã giao hàng",
        color: "bg-green-100",
        textColor: "text-green-700"
    },
    cancelled: {
        label: "Đã hủy",
        color: "bg-red-100",
        textColor: "text-red-700"
    }
};

const TableOrdersAdmin = () => {
    const { getAllOrdersAdmin, allOrderAdmin, page, setPage, pageSize, setPageSize } = useOrder();
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [showActions, setShowActions] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const toast = useToast();
    
    useEffect(() => {
        getAllOrdersAdmin();
    }, [page, pageSize]);

    const totalOrders = allOrderAdmin ? allOrderAdmin.length : 0;
    const totalPages = Math.ceil(totalOrders / pageSize);   

    const calculateOrderTotal = (products: any[]) => {
        return products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(amount)
            .replace('₫', 'đ');
    };

    const toggleActions = (orderId: string) => {
        setShowActions(showActions === orderId ? null : orderId);
    };

    const toggleExpand = (orderId: string) => {
        setExpandedRow(expandedRow === orderId ? null : orderId);
    };

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setPage(pageNumber);
            setExpandedRow(null); // Đóng tất cả các hàng mở rộng khi chuyển trang
            setShowActions(null); // Đóng tất cả menu action khi chuyển trang
        }
    };

    // Hàm thay đổi số lượng hiển thị mỗi trang
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1); // Reset về trang đầu tiên
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.showToast("Đã sao chép mã đơn hàng", "success");
                setCopiedId(text);
                setTimeout(() => setCopiedId(null), 2000);
            })
            .catch((err) => {
                toast.showToast("Không thể sao chép mã đơn hàng", "error");
                console.error('Không thể sao chép: ', err);
            });
    };

    return (
        <>
            {allOrderAdmin && allOrderAdmin.length > 0 ? (
                <>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã đơn hàng
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Người nhận
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allOrderAdmin.map((order: any) => (
                                    <React.Fragment key={order.order_id}>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => toggleExpand(order.order_id)}
                                                        className="mr-2 text-gray-400 hover:text-gray-500"
                                                    >
                                                        {expandedRow === order.order_id ?
                                                            <ChevronUp size={16} /> :
                                                            <ChevronDown size={16} />
                                                        }
                                                    </button>
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{order.order_id}</div>
                                                            <div className="text-xs text-gray-500">{order.tracking_id}</div>
                                                        </div>
                                                        <button 
                                                            onClick={() => copyToClipboard(order.order_id)}
                                                            className="ml-2 text-gray-400 hover:text-blue-500 focus:outline-none"
                                                            title="Sao chép mã đơn hàng"
                                                        >
                                                            {copiedId === order.order_id ? 
                                                                <Check size={16} className="text-green-500" /> : 
                                                                <Copy size={16} />
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                                                    ${statusConfig[order.status]?.color || 'bg-gray-100'} 
                                                    ${statusConfig[order.status]?.textColor || 'text-gray-800'}`
                                                }>
                                                    {statusConfig[order.status]?.label || order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.pick_to.name}</div>
                                                <div className="text-xs text-gray-500">{order.pick_to.phone_number}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {order.product.length} sản phẩm
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {formatCurrency(calculateOrderTotal(order.product))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => toggleActions(order.order_id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <RiMore2Fill size={20} />
                                                    </button>

                                                    {showActions === order.order_id && (
                                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                            <div className="py-1" role="menu">
                                                                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                    <Eye size={16} className="mr-2" />
                                                                    Xem chi tiết
                                                                </button>
                                                                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                    <Edit size={16} className="mr-2" />
                                                                    Chỉnh sửa
                                                                </button>
                                                                <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                                                    <Trash2 size={16} className="mr-2" />
                                                                    Hủy đơn
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>

                                        {expandedRow === order.order_id && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                                    <div className="rounded-lg border border-gray-200 p-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {/* Thông tin sản phẩm */}
                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-3">Sản phẩm đặt hàng</h4>
                                                                <div className="space-y-3">
                                                                    {order.product.map((item: any, idx: number) => (
                                                                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                                                                            <div>
                                                                                <div className="text-sm font-medium">{item.product_name}</div>
                                                                                <div className="text-xs text-gray-500">
                                                                                    {item.quantity} x {formatCurrency(item.price)} ({item.unit})
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-sm font-medium">
                                                                                {formatCurrency(item.price * item.quantity)}
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    <div className="flex justify-between py-2 font-medium">
                                                                        <div>Tổng cộng</div>
                                                                        <div>{formatCurrency(calculateOrderTotal(order.product))}</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin vận chuyển</h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h5 className="text-xs font-medium text-gray-700">Người gửi</h5>
                                                                        <div className="text-sm mt-1">{order.pick_from.name}</div>
                                                                        <div className="text-xs text-gray-500">{order.pick_from.phone_number}</div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {`${order.pick_from.address.address}, ${order.pick_from.address.ward}, ${order.pick_from.address.district}, ${order.pick_from.address.province}`}
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <h5 className="text-xs font-medium text-gray-700">Người nhận</h5>
                                                                        <div className="text-sm mt-1">{order.pick_to.name}</div>
                                                                        <div className="text-xs text-gray-500">{order.pick_to.phone_number}</div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {`${order.pick_to.address.address}, ${order.pick_to.address.ward}, ${order.pick_to.address.district}, ${order.pick_to.address.province}`}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {order.delivery_instruction && (
                                                                    <div className="mt-4">
                                                                        <h5 className="text-xs font-medium text-gray-700">Chỉ dẫn giao hàng</h5>
                                                                        <div className="text-sm mt-1 italic">{order.delivery_instruction}</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Phân trang */}
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <span className="text-sm text-gray-700 mr-4">
                                Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalOrders || 0)} trong {totalOrders || 0} đơn hàng
                            </span>
                            <select 
                                className="border border-gray-300 rounded-md text-sm px-2 py-1"
                                value={pageSize}
                                onChange={handlePageSizeChange}
                            >
                                <option value={1}>1 / trang</option>
                                <option value={2}>2 / trang</option>
                                <option value={5}>5 / trang</option>
                                <option value={50}>50 / trang</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                // onClick={() => paginate(page - 1)}
                                disabled={page === 1}
                                className={`px-2 py-1 border border-gray-300 rounded-md ${
                                    page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Logic hiển thị số trang
                                let pageToShow;
                                if (totalPages <= 5) {
                                    pageToShow = i + 1;
                                } else if (page <= 3) {
                                    pageToShow = i + 1;
                                } else if (page >= totalPages - 2) {
                                    pageToShow = totalPages - 4 + i;
                                } else {
                                    pageToShow = page - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={i}
                                        onClick={() => paginate(pageToShow)}
                                        className={`px-3 py-1 border ${
                                            page === pageToShow
                                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        } rounded-md`}
                                    >
                                        {pageToShow}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => paginate(page + 1)}
                                disabled={page === totalPages}
                                className={`px-2 py-1 border border-gray-300 rounded-md ${
                                    page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center py-10 text-gray-500">
                    Không tìm thấy đơn hàng nào
                </div>
            )}
        </>
    );
};

export default TableOrdersAdmin;