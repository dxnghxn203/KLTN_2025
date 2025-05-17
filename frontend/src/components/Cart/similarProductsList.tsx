"use client";
import React, {useState, useEffect, Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {FiX, FiFilter, FiSearch} from "react-icons/fi";
import {getSimilarProducts} from "@/services/productService";
import ProductCardInCart from "./ProductCardInCart";
import Pagination from "../Common/Pagination";
import {formatRelativeTime} from "@/utils/string";
import clsx from "clsx";

interface SimilarProductsListProps {
    product: any;
    onClose: () => void;
    addToCart: (productId: string, priceId: string, quantity: number) => void;
}

const SimilarProductsList: React.FC<SimilarProductsListProps> = ({
                                                                     product,
                                                                     onClose,
                                                                     addToCart,
                                                                 }) => {
    // Product state
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [isOpen, setIsOpen] = useState(true); // Dialog state
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    // Pagination state - increased items per page to show more products
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Filter state
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

    useEffect(() => {
        // Fetch similar products when component mounts
        fetchSimilarProducts();
    }, [product]);

    // Apply filters and sorting to products
    useEffect(() => {
        if (allProducts.length === 0) return;

        let result = [...allProducts];

        // Apply search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(item =>
                (item.product_name?.toLowerCase().includes(search)) ||
                (item.name_primary?.toLowerCase().includes(search)) ||
                (item.category_name?.toLowerCase().includes(search))
            );
        }

        // Apply price filter
        result = result.filter(item => {
            const price = item.prices?.[0]?.price || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Apply sorting
        switch (sortOption) {
            case "price-asc":
                result.sort((a, b) => (a.prices?.[0]?.price || 0) - (b.prices?.[0]?.price || 0));
                break;
            case "price-desc":
                result.sort((a, b) => (b.prices?.[0]?.price || 0) - (a.prices?.[0]?.price || 0));
                break;
            case "name-asc":
                result.sort((a, b) => (a.product_name || "").localeCompare(b.product_name || ""));
                break;
            case "name-desc":
                result.sort((a, b) => (b.product_name || "").localeCompare(a.product_name || ""));
                break;
            case "rating":
                result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
                break;
            case "popular":
                result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
                break;
            // Default sorting is by relevance (as returned by API)
        }

        setFilteredProducts(result);

        // Update the displayed products based on pagination
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setSimilarProducts(result.slice(start, end));

    }, [allProducts, searchTerm, sortOption, priceRange, currentPage, itemsPerPage]);

    const fetchSimilarProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get data from API - increased the limit to get more products at once
            const result = await getSimilarProducts(product.product_id, 100, 1);
            const newProducts = result.products || [];

            // Initialize selected units
            initializeSelectedUnits(newProducts);

            setAllProducts(newProducts);
            setFilteredProducts(newProducts);

            // Update displayed products
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            setSimilarProducts(newProducts.slice(start, end));
        } catch (error) {
            console.error("Failed to fetch similar products:", error);
            setError("Không thể tải sản phẩm tương tự");
        } finally {
            setLoading(false);
        }
    };

    // Initialize the selected unit for each product to be the first price option
    const initializeSelectedUnits = (products: any[]) => {
        const newSelectedUnits = {...selectedUnits};

        products.forEach(product => {
            if (product.product_id && !newSelectedUnits[product.product_id] &&
                product.prices && product.prices.length > 0) {
                newSelectedUnits[product.product_id] = product.prices[0].price_id;
            }
        });

        setSelectedUnits(newSelectedUnits);
    };

    const handleUnitChange = (productId: string, priceId: string) => {
        setSelectedUnits(prev => ({
            ...prev,
            [productId]: priceId
        }));
    };

    const handleAddToCart = (productId: string) => {
        const priceId = selectedUnits[productId];
        if (priceId) {
            addToCart(productId, priceId, 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // Reset to first page when searching
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSortOption("default");
        setPriceRange([0, 1000000]);
        setCurrentPage(1);
    };

    // Close dialog and notify parent
    const closeModal = () => {
        setIsOpen(false);
        onClose();
    };

    // Function to format price values with commas
    const formatPriceDisplay = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50"/>
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-2 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className="w-full max-w-7xl max-h-[90vh] transform overflow-hidden rounded-lg bg-white shadow-xl transition-all flex flex-col">
                                {/* Header */}
                                <div
                                    className="sticky top-0 bg-white p-3 border-b flex justify-between items-center z-20 shadow-sm">
                                    <Dialog.Title as="h2" className="text-lg font-bold text-gray-800">
                                        Sản phẩm tương tự
                                    </Dialog.Title>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-gray-600 flex items-center gap-2">
                                            <span
                                                className="hidden sm:inline">{formatRelativeTime("2025-05-17 14:42:38")}</span>
                                            <span className="hidden sm:inline">|</span>
                                            <span className="font-medium text-blue-600">dxnghxn203</span>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="Đóng"
                                        >
                                            <FiX size={20}/>
                                        </button>
                                    </div>
                                </div>

                                {/* Search and filters bar */}
                                <div
                                    className="bg-white p-3 border-b flex flex-wrap gap-3 items-center justify-between sticky top-14 z-10">
                                    <div className="flex items-center flex-1 min-w-[280px]">
                                        <div className="relative flex-1 max-w-md">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                placeholder="Tìm kiếm sản phẩm..."
                                                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                            <FiSearch
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                size={18}/>
                                            {searchTerm && (
                                                <button
                                                    onClick={clearSearch}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <FiX size={18}/>
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                                            className={clsx(
                                                "ml-3 p-2 border rounded-lg flex items-center gap-1 transition-colors",
                                                showFilterPanel ? "bg-blue-50 border-blue-300 text-blue-600" : "hover:bg-gray-100"
                                            )}
                                        >
                                            <FiFilter size={18}/>
                                            <span className="hidden sm:inline">Bộ lọc</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center">
                                        <select
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        >
                                            <option value="default">Phổ biến</option>
                                            <option value="price-asc">Giá tăng dần</option>
                                            <option value="price-desc">Giá giảm dần</option>
                                            <option value="rating">Đánh giá cao</option>
                                            <option value="popular">Bán chạy</option>
                                            <option value="name-asc">Tên A-Z</option>
                                            <option value="name-desc">Tên Z-A</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Filter panel - simplified version */}
                                <Transition
                                    show={showFilterPanel}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <div className="bg-gray-50 p-3 border-b">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Price range filter */}
                                            <div className="flex-1 min-w-[200px] max-w-md">
                                                <h3 className="font-medium mb-2 text-sm">Khoảng giá</h3>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={priceRange[0]}
                                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                        min="0"
                                                        className="w-full p-2 border rounded"
                                                        placeholder="Từ"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        type="number"
                                                        value={priceRange[1]}
                                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                                                        min="0"
                                                        className="w-full p-2 border rounded"
                                                        placeholder="Đến"
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                                                    <span>{formatPriceDisplay(priceRange[0])}đ</span>
                                                    <span>{formatPriceDisplay(priceRange[1])}đ</span>
                                                </div>
                                            </div>

                                            {/* Preset price ranges */}
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setPriceRange([0, 50000])}
                                                    className="px-3 py-1 text-sm border rounded-full hover:bg-blue-50 hover:border-blue-300"
                                                >
                                                    Dưới 50.000đ
                                                </button>
                                                <button
                                                    onClick={() => setPriceRange([50000, 100000])}
                                                    className="px-3 py-1 text-sm border rounded-full hover:bg-blue-50 hover:border-blue-300"
                                                >
                                                    50.000đ - 100.000đ
                                                </button>
                                                <button
                                                    onClick={() => setPriceRange([100000, 200000])}
                                                    className="px-3 py-1 text-sm border rounded-full hover:bg-blue-50 hover:border-blue-300"
                                                >
                                                    100.000đ - 200.000đ
                                                </button>
                                                <button
                                                    onClick={() => setPriceRange([200000, 500000])}
                                                    className="px-3 py-1 text-sm border rounded-full hover:bg-blue-50 hover:border-blue-300"
                                                >
                                                    200.000đ - 500.000đ
                                                </button>
                                                <button
                                                    onClick={() => setPriceRange([500000, 1000000])}
                                                    className="px-3 py-1 text-sm border rounded-full hover:bg-blue-50 hover:border-blue-300"
                                                >
                                                    Trên 500.000đ
                                                </button>
                                            </div>

                                            {/* Reset button */}
                                            <div className="flex items-center ml-auto">
                                                <button
                                                    onClick={resetFilters}
                                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                                                >
                                                    Xóa bộ lọc
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>

                                {/* Content area */}
                                <div className="flex-1 overflow-y-auto">
                                    {loading && similarProducts.length === 0 ? (
                                        <div className="flex justify-center items-center p-10">
                                            <div
                                                className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : error && similarProducts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-10 text-center">
                                            <div className="text-red-500 mb-2">{error}</div>
                                            <div className="text-sm text-gray-500">Không thể tải sản phẩm tương tự</div>
                                            <button
                                                onClick={fetchSimilarProducts}
                                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Thử lại
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-3">
                                            {/* Results summary */}
                                            <div className="text-sm text-gray-600 mb-3">
                                                Tìm thấy {filteredProducts.length} sản phẩm tương tự với
                                                "{product.name_primary || product.product_name}"
                                            </div>

                                            {similarProducts && similarProducts.length > 0 ? (
                                                <div
                                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                                    {similarProducts.map((similarProduct) => (
                                                        <ProductCardInCart
                                                            key={similarProduct.product_id}
                                                            product={similarProduct}
                                                            selectedUnit={selectedUnits[similarProduct.product_id] || ''}
                                                            onUnitChange={(priceId) => handleUnitChange(similarProduct.product_id, priceId)}
                                                            onAddToCart={() => handleAddToCart(similarProduct.product_id)}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                                                    <div className="text-lg mb-2">Không tìm thấy sản phẩm tương tự</div>
                                                    <div className="text-sm">Vui lòng thử lại với bộ lọc khác</div>
                                                </div>
                                            )}

                                            {/* Pagination */}
                                            {filteredProducts.length > itemsPerPage && (
                                                <div className="mt-4">
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
                                                        onPageChange={handlePageChange}
                                                    />
                                                </div>
                                            )}

                                            {loading && similarProducts.length > 0 && (
                                                <div className="flex justify-center items-center py-4">
                                                    <div
                                                        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div
                                    className="sticky bottom-0 bg-white p-3 border-t flex justify-between z-10 shadow-md">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-[#0053E2] text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default SimilarProductsList;