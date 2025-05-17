import React, {useState, useRef, useEffect} from "react";
import Image from "next/image";
import {IoMdAdd} from "react-icons/io";
import {BsCart, BsStarFill, BsStarHalf, BsStar} from "react-icons/bs";
import {MdVerified} from "react-icons/md";
import {formatCurrency} from "@/utils/string";
import clsx from "clsx";

interface ProductCardInCartProps {
    product: any;
    selectedUnit: string;
    onUnitChange: (priceId: string) => void;
    onAddToCart: () => void;
}

const ProductCardInCart: React.FC<ProductCardInCartProps> = ({
                                                                 product,
                                                                 selectedUnit,
                                                                 onUnitChange,
                                                                 onAddToCart
                                                             }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get the selected price details
    const selectedPrice = product.prices?.find((p: any) => p.price_id === selectedUnit) || product.prices?.[0];

    const discount = selectedPrice?.discount || 0;
    const hasDiscount = selectedPrice?.price < selectedPrice?.original_price;

    // Calculate savings
    const savings = hasDiscount
        ? selectedPrice.original_price - selectedPrice.price
        : 0;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const renderRatingStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<BsStarFill key={`star-${i}`} className="text-yellow-400"/>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<BsStarHalf key={`star-${i}`} className="text-yellow-400"/>);
            } else {
                stars.push(<BsStar key={`star-${i}`} className="text-yellow-400"/>);
            }
        }

        return stars;
    };

    return (
        <div
            className={clsx(
                "border rounded-xl overflow-hidden transition-all duration-300 bg-white",
                isHovered ? "shadow-lg border-[#0053E2] transform -translate-y-1" : "border-gray-200 shadow-sm"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={product.images_primary || "/placeholder-product.png"}
                    alt={product.product_name}
                    fill
                    className={clsx(
                        "object-cover transition-transform duration-500",
                        isHovered ? "scale-110" : "scale-100"
                    )}
                />

                {/* Quick action button */}
                <div
                    className={clsx(
                        "absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                >
                    <button
                        onClick={onAddToCart}
                        className="bg-[#0053E2] text-white p-3 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-110 active:scale-95"
                        title="Thêm vào giỏ hàng"
                    >
                        <IoMdAdd size={20}/>
                    </button>
                </div>

                {/* Discount tag */}
                <div className="absolute top-2 right-2 z-10">
                    {discount > 0 && (
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                            -{discount}%
                        </div>
                    )}
                </div>

                {/* Verified tag if applicable */}
                {product.is_verified && (
                    <div
                        className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <MdVerified size={12}/>
                        <span>Chính hãng</span>
                    </div>
                )}
            </div>

            <div className="p-3">
                {/* Product title */}
                <h3 className="font-medium line-clamp-2 h-10 hover:text-blue-600 cursor-pointer transition-colors text-gray-900 text-sm">
                    {product.name_primary || product.product_name}
                </h3>

                {/* Category */}
                <div className="mt-1 text-xs text-gray-500">
                    {product.category_name || "Dược phẩm"}
                </div>

                {/* Custom Unit Selection Dropdown - FIXED VERSION */}
                <div className="mt-3 relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className="w-full text-sm p-1.5 border rounded bg-gray-50 hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer flex justify-between items-center"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span>{selectedPrice?.unit || "Đơn vị"}</span>
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"
                             aria-hidden="true">
                            <path fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>

                    {/* Custom dropdown */}
                    {isDropdownOpen && (
                        <div
                            className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto py-1">
                            {product.prices && product.prices.map((priceOption: any) => (
                                <button
                                    key={priceOption.price_id}
                                    type="button"
                                    className={clsx(
                                        "w-full text-left px-3 py-2 hover:bg-blue-50 text-sm",
                                        selectedUnit === priceOption.price_id ? "bg-blue-50 text-blue-700" : "text-gray-900"
                                    )}
                                    onClick={() => {
                                        onUnitChange(priceOption.price_id);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {priceOption.unit} - {formatCurrency(priceOption.price)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price */}
                <div className="mt-3 flex flex-col">
                    <div className="flex items-end gap-2">
                        <div className="font-semibold text-[#0053E2] text-base">
                            {formatCurrency(selectedPrice?.price)}
                        </div>
                        {hasDiscount && (
                            <div className="text-xs text-gray-500 line-through">
                                {formatCurrency(selectedPrice?.original_price)}
                            </div>
                        )}
                    </div>

                    {/* Savings */}
                    {hasDiscount && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                            Tiết kiệm: {formatCurrency(savings)}
                        </div>
                    )}
                </div>

                {/* Rating and sales */}
                <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center text-xs gap-1">
                        <div className="flex">
                            {renderRatingStars(parseFloat(product.rating) || 4.5)}
                        </div>
                        <span className="text-gray-500">({product.rating || "4.5"})</span>
                    </div>

                    <div className="flex items-center text-xs gap-1">
                        <BsCart size={12} className="text-gray-500"/>
                        <span>{product.sold || 0} đã bán</span>
                    </div>
                </div>
            </div>

            {/* Add to cart button */}
            <div className="px-3 pb-3">
                <button
                    onClick={onAddToCart}
                    className="w-full py-2.5 text-sm text-white bg-[#0053E2] rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium flex items-center justify-center gap-2"
                >
                    <BsCart size={14}/>
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default ProductCardInCart;