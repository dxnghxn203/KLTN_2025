import {IoCloseOutline} from "react-icons/io5";
import Image from "next/image";
import React from "react";

const OutOfStock = (
    {
        products,
        closeDialog,
        onContinue
    }: {
        products: {
            outOfStockProducts: any[];
            availableProducts: any[];
        };
        closeDialog: (isOpen: boolean) => void;
        onContinue: () => void;
    }
) => {
    const {outOfStockProducts, availableProducts} = products;

    const formatPrice = (price: number) => {
        if (typeof price !== 'number' || isNaN(price)) {
            return "N/A";
        }
        return price.toLocaleString("vi-VN", {style: "currency", currency: "VND"});
    };

    const renderProductItem = (product: any, index: number, isLast: boolean, isAvailable: boolean = false) => (
        <div
            key={`${product?.product_id}-${product?.price_id}`}
            className={`flex items-center justify-between py-3 text-sm ${
                !isLast ? "border-b border-gray-200" : ""
            }`}
        >
            <div className="w-[40%] flex items-center">
                <Image
                    src={product?.image}
                    alt={product?.product_name || "Product Image"}
                    width={40}
                    height={40}
                    className="rounded-md border border-stone-300 p-0.5"
                />
                <span className="ml-3 line-clamp-2 overflow-hidden text-ellipsis">
                    {product?.product_name} {isAvailable && "(Còn hàng)"}
                </span>
            </div>
            <div className="w-[25%] text-center flex flex-col items-center">
                {product?.original_price > 0 && product?.original_price !== product?.price && (
                    <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product?.original_price)}
                    </span>
                )}
                <span className="text-sm font-semibold text-blue-600">
                    {formatPrice(product?.price)}
                </span>
            </div>
            <div className="w-[20%] text-center text-xs text-gray-700">
                SL: {product?.quantity}
            </div>
            <div className="w-[15%] text-center text-xs text-gray-700">
                {product?.unit}
            </div>
        </div>
    );


    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-auto p-4">
            <div className="bg-white rounded-lg w-full max-w-xl shadow-xl relative my-10 transition-all duration-300">
                <div className="flex items-center justify-center relative p-3 border-b border-gray-200">
                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <button
                            onClick={() => closeDialog(false)}
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <IoCloseOutline size={28}/>
                        </button>
                    </div>
                    <div className="text-base font-semibold text-red-600">
                        SẢN PHẨM KHÔNG ĐỦ HÀNG
                    </div>
                </div>

                <div className="relative w-full overflow-hidden transition-all duration-300">
                    <div className="flex flex-col px-4 py-3">
                        <p className="text-sm text-gray-700 mb-2">Các sản phẩm sau đã hết hàng hoặc không đủ số
                            lượng:</p>
                        <div className="max-h-52 overflow-y-auto pr-2 mb-1">
                            {outOfStockProducts && outOfStockProducts.length > 0 ? (
                                outOfStockProducts.map((product: any, index: number) =>
                                    renderProductItem(product, index, index === outOfStockProducts.length - 1)
                                )
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-2">Không có sản phẩm nào hết
                                    hàng.</p>
                            )}
                        </div>
                        {outOfStockProducts && outOfStockProducts.length > 0 && (
                            <div className="flex justify-end mb-3">
                                <button
                                    onClick={() => {
                                        // Placeholder for related products logic
                                        console.log("Navigate to related products");
                                        // You might want to close the dialog or navigate elsewhere
                                        // closeDialog(false);
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                                >
                                    Sản phẩm liên quan
                                </button>
                            </div>
                        )}


                        {availableProducts && availableProducts.length > 0 && (
                            <>
                                <hr className="my-3 border-gray-200"/>
                                <p className="text-sm text-gray-700 mb-2">
                                    Bạn có muốn tiếp tục đặt hàng với các sản phẩm còn lại không?
                                </p>
                                <div className="max-h-52 overflow-y-auto pr-2 mb-3">
                                    {availableProducts.map((product: any, index: number) =>
                                        renderProductItem(product, index, index === availableProducts.length - 1, true)
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3 pt-3 pb-2">
                                    <button
                                        onClick={() => closeDialog(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        onClick={() => {
                                            onContinue();
                                            closeDialog(false);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </>
                        )}
                        {(!availableProducts || availableProducts.length === 0) && (
                            <div
                                className={`flex justify-end ${outOfStockProducts && outOfStockProducts.length > 0 ? 'pt-0' : 'pt-3'} pb-2`}>
                                <button
                                    onClick={() => closeDialog(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OutOfStock;