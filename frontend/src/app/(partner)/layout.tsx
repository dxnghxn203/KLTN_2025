"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiPackage,
    FiShoppingBag,
    FiTruck,
    FiSettings,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronDown,
    FiHelpCircle,
    FiBell,
    FiRefreshCw
} from "react-icons/fi";

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    const pathname = usePathname();

    // Check if we're on mobile on mount and when window resizes
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobileView(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Clean up
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const navigation = [
        { name: 'Trang chủ', href: '/dashboard', icon: FiHome },
        { name: 'Sản phẩm', href: '/products', icon: FiPackage },
        { name: 'Đơn hàng', href: '/orders', icon: FiShoppingBag },
        { name: 'Vận chuyển', href: '/shipping', icon: FiTruck },
        { name: 'Cập nhật trạng thái', href: '/status-order', icon: FiRefreshCw },
        { name: 'Cài đặt', href: '/settings', icon: FiSettings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && isMobileView && (
                <div
                    className="fixed inset-0 z-20 bg-gray-800/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Đối tác giao hàng</span>
                        </Link>
                        {isMobileView && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <FiX size={24} />
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-4 px-3">
                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = (pathname ?? '') === item.href || (pathname ?? '').startsWith(`${item.href}/`);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-500'
                                                }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer/User Profile */}
                    <div className="p-4 border-t">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <FiUser size={20} />
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Pharmacy Partner</p>
                                <p className="text-xs text-gray-500 truncate">partner@example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`lg:pl-64 flex flex-col min-h-screen`}>
                {/* Top Header */}
                <header className="bg-white shadow z-10">
                    <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <FiMenu size={24} />
                        </button>

                        <div className="font-medium text-lg text-gray-900 lg:hidden">
                            Đối tác giao hàng
                        </div>

                        {/* Right buttons */}
                        <div className="flex items-center space-x-4">
                            {/* Help */}
                            <button className="text-gray-500 hover:text-gray-700">
                                <FiHelpCircle size={20} />
                            </button>

                            {/* Notifications dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setNotificationsOpen(!notificationsOpen);
                                        setProfileDropdownOpen(false);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 relative"
                                >
                                    <FiBell size={20} />
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                                </button>

                                {notificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-30" onClick={e => e.stopPropagation()}>
                                        <div className="py-2 px-4 border-b">
                                            <h3 className="text-sm font-medium text-gray-900">Thông báo</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {[1, 2, 3].map((notification) => (
                                                <div key={notification} className="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
                                                    <p className="text-sm font-medium text-gray-900">Đơn hàng mới #{notification}</p>
                                                    <p className="text-xs text-gray-500">Có đơn hàng mới cần xử lý</p>
                                                    <p className="text-xs text-gray-400 mt-1">2 phút trước</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="py-2 px-4 border-t text-center">
                                            <Link href="/notifications" className="text-xs text-blue-600 hover:text-blue-800">
                                                Xem tất cả thông báo
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Profile dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setProfileDropdownOpen(!profileDropdownOpen);
                                        setNotificationsOpen(false);
                                    }}
                                    className="flex items-center text-gray-700 hover:text-gray-900"
                                >
                                    <span className="hidden md:block text-sm mr-2">Pharmacy Partner</span>
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <FiUser size={16} />
                                    </div>
                                    <FiChevronDown size={16} className="ml-1 hidden md:block" />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-30" onClick={e => e.stopPropagation()}>
                                        <div className="py-1">
                                            <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <FiUser className="mr-2 h-4 w-4" /> Hồ sơ
                                            </Link>
                                            <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <FiSettings className="mr-2 h-4 w-4" /> Cài đặt
                                            </Link>
                                            <div className="border-t border-gray-100"></div>
                                            <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <FiLogOut className="mr-2 h-4 w-4" /> Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    {/* Close dropdowns when clicking elsewhere */}
                    {(profileDropdownOpen || notificationsOpen) && (
                        <div
                            className="fixed inset-0 z-20"
                            onClick={() => {
                                setProfileDropdownOpen(false);
                                setNotificationsOpen(false);
                            }}
                        />
                    )}

                    {/* Render children (page content) */}
                    <div className="py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
