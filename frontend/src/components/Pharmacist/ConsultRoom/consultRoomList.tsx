"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import {Loader2, RotateCw} from 'lucide-react';
import {MdNavigateBefore, MdNavigateNext} from "react-icons/md";
import {useChat} from "@/hooks/useChat";
import {Conversation} from "@/types/chat";
import {PharmacistChatModal} from "@/components/Pharmacist/ConsultRoom/pharmacistChatModal";
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';

const ConsultRoomList = () => {
    const {fetchGetAllConversationWaiting, allConversationWaiting, acceptConversation} = useChat();
    const [loadingAcceptConversation, setLoadingAcceptConversation] = useState(false);
    const [isOpenChat, setIsOpenChat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentUTCTime, setCurrentUTCTime] = useState('');
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [totalItems, setTotalItems] = useState<number>(0);

    // Use pages state for server-side pagination
    const [pages, setPages] = useState<any>({
        page: 1,
        page_size: 10,
    });

    // Calculate total pages based on total items and page size
    const totalPages = Math.ceil(totalItems / pages.page_size);
    const currentPageData = (pages.page - 1) * pages.page_size;
    const firstIndex = totalItems > 0 ? currentPageData + 1 : 0;
    const lastIndex = Math.min(currentPageData + pages.page_size, totalItems);

    useEffect(() => {
        const updateUTCTime = () => {
            const now = new Date();
            const utcDate = new Date(now.toISOString());
            setCurrentUTCTime(format(utcDate, 'yyyy-MM-dd HH:mm:ss'));
        };

        updateUTCTime();
        const interval = setInterval(updateUTCTime, 1000);

        return () => clearInterval(interval);
    }, []);

    const loadConversations = async () => {
        setIsRefreshing(true);
        try {
            fetchGetAllConversationWaiting(
                pages,
                () => {
                    setIsRefreshing(false);
                    setError(null);
                },
                () => {
                    setError('Không thể tải danh sách cuộc tư vấn. Vui lòng thử lại.');
                    setIsRefreshing(false);
                }
            );
        } catch (error) {
            setError('Đã xảy ra lỗi khi tải dữ liệu.');
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadConversations();
    }, [pages]);

    useEffect(() => {
        if (allConversationWaiting && typeof allConversationWaiting.total === 'number') {
            setTotalItems(allConversationWaiting.total);
        }
    }, [allConversationWaiting]);

    const handlerAcceptConversation = async (id: string) => {
        setLoadingAcceptConversation(true);
        setIsOpenChat(false);
        try {
            acceptConversation(
                id,
                (data: Conversation) => {
                    setIsOpenChat(true);
                    setLoadingAcceptConversation(false);
                    setConversation(data);
                },
                () => {
                    setError('Không thể tiếp nhận cuộc tư vấn. Vui lòng thử lại.');
                    setIsOpenChat(false);
                    setLoadingAcceptConversation(false);
                }
            );
        } catch (error) {
            setError('Đã xảy ra lỗi khi tiếp nhận cuộc tư vấn.');
            setLoadingAcceptConversation(false);
        }
    };

    const onPageChange = (page: number) => {
        setPages((prev: any) => ({
            ...prev,
            page: page
        }));
    };

    const handlePageSizeChange = (size: number) => {
        setPages((prev: any) => ({
            ...prev,
            page_size: size,
            page: 1 // Reset to first page when page size changes
        }));
    };

    const renderTableContent = () => {
        if (isRefreshing) {
            return (
                <tr>
                    <td colSpan={6} className="p-8">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2"/>
                            <p className="text-sm text-gray-600">
                                Đang làm mới dữ liệu...
                            </p>
                        </div>
                    </td>
                </tr>
            );
        }

        if (!allConversationWaiting || !allConversationWaiting.conversations || allConversationWaiting.conversations.length === 0) {
            return (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                        Không có phòng chờ tư vấn nào
                    </td>
                </tr>
            );
        }

        return allConversationWaiting.conversations.map((cvs: any, index: number) => (
            <tr
                key={cvs._id}
                className={`text-sm hover:bg-gray-50 transition ${
                    index !== allConversationWaiting.conversations.length - 1
                        ? "border-b border-gray-200"
                        : ""
                }`}
            >
                <td className="py-4 px-4">
                    <div className="font-medium line-clamp-1">
                        {cvs._id}
                    </div>
                </td>
                <td className="py-4 px-2">
                    <div className="font-medium">
                        {cvs.guest_name || 'Khách vãng lai'}
                    </div>
                </td>
                <td className="py-4 px-2">
                    <div className="text-gray-600">
                        {cvs.guest_email || '---'}
                    </div>
                </td>
                <td className="py-4 px-2">
                    <div className="text-gray-600">
                        {cvs.guest_phone || '---'}
                    </div>
                </td>
                <td className="py-4 px-2">
                    <div className="text-gray-600">
                        {format(new Date(cvs.created_at), 'HH:mm:ss', {locale: vi})}
                    </div>
                </td>
                <td className="py-4 px-4">
                    <button
                        onClick={() => handlerAcceptConversation(cvs._id)}
                        disabled={loadingAcceptConversation}
                        className={`px-4 py-2 font-medium flex items-center justify-center gap-2 text-sm text-white 
                            ${loadingAcceptConversation
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-[#1E4DB7] hover:bg-blue-700'} 
                            rounded-full transition-colors min-w-[100px]`}
                    >
                        {loadingAcceptConversation ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin"/>
                                <span>Đang xử lý</span>
                            </>
                        ) : (
                            'Tham gia'
                        )}
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="relative">
            {loadingAcceptConversation && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600"/>
                        <p className="text-sm text-gray-600">Đang tiếp nhận cuộc tư vấn...</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-extrabold text-black">
                            Danh sách phòng chờ tư vấn
                        </h2>
                        <button
                            onClick={loadConversations}
                            disabled={isRefreshing}
                            className={`p-2 rounded-lg transition-colors ${
                                isRefreshing
                                    ? 'bg-gray-100 cursor-not-allowed'
                                    : 'hover:bg-gray-100'
                            }`}
                            title="Làm mới danh sách"
                        >
                            <RotateCw
                                className={`w-5 h-5 text-gray-600 ${
                                    isRefreshing ? 'animate-spin' : ''
                                }`}
                            />
                        </button>
                    </div>
                    <div className="flex flex-col items-end text-sm text-gray-500">
                        <div>UTC: {currentUTCTime}</div>
                        <div>Trang: {pages.page}/{totalPages || 1}</div>
                    </div>
                </div>

                <div className="my-4 text-sm">
                    <Link href="/dashboard" className="hover:underline text-blue-600">
                        Dashboard
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800">
                        Danh sách phòng chờ tư vấn
                    </span>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead className="text-left text-[#1E4DB7] font-bold border-b border-gray-200 bg-[#F0F3FD]">
                            <tr className="uppercase text-sm">
                                <th className="py-3 px-4">Mã tư vấn</th>
                                <th className="py-3 px-2">Tên khách hàng</th>
                                <th className="py-3 px-2">Email</th>
                                <th className="py-3 px-2">Số điện thoại</th>
                                <th className="py-3 px-2">Thời gian chờ</th>
                                <th className="py-3 px-4 text-center"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderTableContent()}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination controls */}
                {totalItems > 0 && totalPages > 0 && (
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
                            Hiển thị {firstIndex} - {lastIndex} trong
                            tổng số {totalItems} cuộc tư vấn
                        </div>

                        {/* Page navigation */}
                        <div className="flex items-center justify-center space-x-2">
                            {/* Previous button */}
                            <button
                                onClick={() => onPageChange(pages.page - 1)}
                                disabled={pages.page === 1}
                                className="p-2 rounded-lg transition-colors text-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
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
                                            className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors ${
                                                pages.page === pageNumber
                                                    ? "bg-blue-600 text-white"
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
                                className="p-2 rounded-lg transition-colors text-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <MdNavigateNext className="text-xl"/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <PharmacistChatModal
                isOpen={isOpenChat}
                onClose={() => {
                    setIsOpenChat(false);
                }}
                conversation={conversation}
            />
        </div>
    );
};

export default ConsultRoomList;
