"use client";
import {useState, useEffect} from "react";
import CustomPagination from "@/components/Admin/CustomPagination/customPagination";
import Link from "next/link";
import {X} from "lucide-react";
import Image from "next/image";
import {RiMore2Fill} from "react-icons/ri";
// Remove FilterBar import
import {IoImage} from "react-icons/io5";
import {useProduct} from "@/hooks/useProduct";
import {
    MdNavigateBefore,
    MdNavigateNext,
    MdOutlineModeEdit,
} from "react-icons/md";
import ApproveProductDialog from "../Dialog/approveProductDialog";
import {FiEye} from "react-icons/fi";
import {LuBadgeCheck, LuEye} from "react-icons/lu";
import {useOrder} from "@/hooks/useOrder";
// import ApproveRequestDialog from "../Dialog/approveRequestDialog";
import {useRouter} from "next/navigation";

const ConsultingList = () => {
    const {fetchGetApproveRequestOrder, allRequestOrderApprove} = useOrder();

    // Combine currentPage into pages state for cleaner state management
    const [pages, setPages] = useState<any>({
        page: 1,
        page_size: 10,
    });

    // Get data from API response
    const totalOrders = allRequestOrderApprove
        ? allRequestOrderApprove.total_orders
        : 0;
    const ordersList = allRequestOrderApprove
        ? allRequestOrderApprove.orders || []
        : [];

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / pages.page_size);

    const [selectedOrderRequest, setSelectedOrderRequest] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState<string | number | null>(null);
    // Remove showFilter state
    const [isDialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();

    // Update onPageChange to modify pages state
    const onPageChange = (page: number) => {
        setPages((prevPages: any) => ({
            ...prevPages,
            page: page
        }));
    };

    // Add page size change handler
    const handlePageSizeChange = (size: number) => {
        setPages((prevPages: any) => ({
            ...prevPages,
            page_size: size,
            page: 1 // Reset to first page when changing page size
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest(".menu-container")) {
                setMenuOpen(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchGetApproveRequestOrder(
            pages,
            () => {
                console.log("Successfully fetched orders for page", pages.page);
            },
            (error: any) => {
                console.error("Error fetching orders:", error);
            }
        );
    }, [pages]); // Dependency on pages ensures fetch happens when page changes

    return (
        <div>
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-black">
                    Danh sách yêu cầu tư vấn thuốc
                </h2>
                <div className="my-4 text-sm">
                    <Link href="/dashboard" className="hover:underline text-blue-600">
                        Dashboard
                    </Link>
                    <span> / </span>
                    <Link href="/kiem-duyet-yeu-cau-tu-van-thuoc" className="text-gray-800">
                        Danh sách yêu cầu tư vấn thuốc
                    </Link>
                </div>

                {/* Remove filter button and FilterBar component */}

                <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
                            <tr className="uppercase text-sm">
                                <th className="py-3 pl-4">Mã yêu cầu</th>
                                <th className="py-3  ">Tên khách hàng</th>
                                <th className="py-3 ">SĐT</th>
                                <th className="py-3 ">Email</th>
                                <th className="py-3">Trạng thái</th>
                                <th className="py-3 pr-4"></th>
                            </tr>
                            </thead>

                            <tbody>
                            {ordersList && ordersList.length > 0 ? (
                                ordersList.map((request: any, index: number) => (
                                    <tr
                                        key={request.request_id}
                                        className={`text-sm hover:bg-gray-50 transition ${
                                            index !== ordersList.length - 1
                                                ? "border-b border-gray-200"
                                                : ""
                                        }`}
                                    >
                                        <td className="py-4 pl-4">{request.request_id}</td>
                                        <td className="py-4 ">{request.pick_to.name}</td>
                                        <td className="py-4 ">{request.pick_to.phone_number}</td>
                                        <td className="py-4">{request.pick_to.email}</td>

                                        <td className="py-4 text-center">
                        <span
                            className={`px-2 py-1 rounded-full ${
                                request.status === "rejected"
                                    ? "bg-red-100 text-red-600"
                                    : request.status === "pending"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : request.status === "approved"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-blue-100 text-blue-600"
                            }`}
                        >
                          {request.status === "rejected"
                              ? "Đã từ chối"
                              : request.status === "pending"
                                  ? "Chờ duyệt"
                                  : request.status === "approved"
                                      ? "Đã duyệt"
                                      : "Chưa liên lạc được"}
                        </span>
                                        </td>

                                        <td className="py-4 pl-4 text-center relative">
                                            {["approved", "rejected"].includes(request.status) ? (
                                                <button
                                                    className="py-2 font-medium flex items-center gap-1 text-sm text-gray-500"
                                                    onClick={() => {
                                                        router.push(
                                                            `/kiem-duyet-yeu-cau-tu-van-thuoc?chi-tiet=${request.request_id}`
                                                        );
                                                    }}
                                                >
                                                    <FiEye className="text-gray-500 text-lg"/>
                                                    Chi tiết
                                                </button>
                                            ) : (
                                                <button
                                                    className="underline py-2 text-blue-600 font-medium rounded-lg  flex items-center gap-2 text-sm"
                                                    onClick={() => {
                                                        router.push(
                                                            `/kiem-duyet-yeu-cau-tu-van-thuoc?edit=${request.request_id}`
                                                        );
                                                    }}
                                                >
                                                    <LuBadgeCheck className="text-blue-600 text-lg"/>
                                                    Duyệt
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center text-gray-500">
                                        Không có yêu cầu nào
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    {/* Page size selector */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Hiển thị:</span>
                        <select
                            value={pages.page_size}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>/ trang</span>
                    </div>

                    {/* Current page display */}
                    <div className="text-sm text-gray-600">
                        Hiển
                        thị {ordersList.length > 0 ? (pages.page - 1) * pages.page_size + 1 : 0} - {Math.min(pages.page * pages.page_size, totalOrders)} trong
                        tổng số {totalOrders} yêu cầu
                    </div>

                    {/* Page navigation */}
                    <div className="flex items-center justify-center space-x-2">
                        {/* Previous button */}
                        <button
                            onClick={() => onPageChange(pages.page - 1)}
                            disabled={pages.page === 1}
                            className="text-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MdNavigateBefore className="text-xl"/>
                        </button>

                        {/* Page numbers */}
                        {Array.from({length: totalPages}, (_, index) => {
                            const pageNumber = index + 1;

                            // Show page numbers with smart ellipsis
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= pages.page - 1 && pageNumber <= pages.page + 1) ||
                                (pages.page <= 3 && pageNumber <= 5) ||
                                (pages.page >= totalPages - 2 && pageNumber >= totalPages - 4)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => onPageChange(pageNumber)}
                                        className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                                            pages.page === pageNumber
                                                ? "bg-blue-700 text-white"
                                                : "text-black hover:bg-gray-200"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            }

                            // Show ellipsis where needed
                            if (
                                (pageNumber === pages.page - 2 && pages.page > 4) ||
                                (pageNumber === pages.page + 2 && pages.page < totalPages - 3)
                            ) {
                                return (
                                    <span key={pageNumber} className="px-2 text-gray-500">
                                        ...
                                    </span>
                                );
                            }

                            return null;
                        })}

                        {/* Next button */}
                        <button
                            onClick={() => onPageChange(pages.page + 1)}
                            disabled={pages.page === totalPages || totalPages === 0}
                            className="text-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MdNavigateNext className="text-xl"/>
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ConsultingList;

