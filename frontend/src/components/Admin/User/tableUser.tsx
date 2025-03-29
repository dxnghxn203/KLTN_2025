"use client";
import { useState } from "react";
import { Copy, Check, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/providers/toastProvider";
import UserDetailModal from "./userDetailModal";

interface UserTableProps {
    users: any[];
    currentPage: number;
    pageSize: number;
    totalUsers: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

const UserTable = ({ users, currentPage, pageSize, totalUsers, onPageChange, onPageSizeChange }: UserTableProps) => {
    const toast = useToast();
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Các hàm xử lý
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.showToast("Đã sao chép ID người dùng", "success");
                setCopiedId(text);
                setTimeout(() => setCopiedId(null), 2000);
            })
            .catch(() => {
                toast.showToast("Không thể sao chép", "error");
            });
    };

    const openUserDetail = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // Tính toán phân trang
    const totalPages = Math.ceil(totalUsers / pageSize);

    // Format ngày tháng
    const formatDisplayDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID người dùng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thông tin người dùng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Liên hệ
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phương thức đăng ký
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày đăng ký
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users && users.map((user, index) => (
                                <tr key={user._id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                                                {user._id.substring(0, 10)}...
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(user._id)}
                                                className="ml-2 text-gray-400 hover:text-blue-500 focus:outline-none"
                                                title="Sao chép ID"
                                            >
                                                {copiedId === user._id ?
                                                    <Check size={16} className="text-green-500" /> :
                                                    <Copy size={16} />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.user_name}</div>
                                        <div className="text-sm text-gray-500">{user.gender}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                        <div className="text-sm text-gray-500">{user.phone_number}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.auth_provider === 'email'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                            }`}>
                                            {user.auth_provider === 'email' ? 'Email' : 'Google'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.active ? (
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                <CheckCircle className="h-4 w-4 mr-1" /> Đã kích hoạt
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                <XCircle className="h-4 w-4 mr-1" /> Chưa kích hoạt
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDisplayDate(user.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openUserDetail(user)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            <Eye size={18} className="inline mr-1" /> Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <span className="text-sm text-gray-700 mr-4">
                            Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalUsers)} trong {totalUsers} người dùng
                        </span>
                        <select
                            className="border border-gray-300 rounded-md text-sm px-2 py-1"
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        >
                            <option value={5}>5 / trang</option>
                            <option value={10}>10 / trang</option>
                            <option value={20}>20 / trang</option>
                            <option value={50}>50 / trang</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Nút phân trang */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                                pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                                pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + i;
                            } else {
                                pageNumber = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => onPageChange(pageNumber)}
                                    className={`px-3 py-1 border ${currentPage === pageNumber
                                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        } rounded-md`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal chi tiết người dùng */}
            {isModalOpen && selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default UserTable;
