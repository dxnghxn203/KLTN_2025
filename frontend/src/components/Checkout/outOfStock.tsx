import {IoCloseOutline} from "react-icons/io5";
import Image from "next/image";
import React from "react";

const OutOfStock = (
    {
        products,
        closeDialog
    }
    : any
) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-auto">
            <div className="bg-white rounded-lg w-auto shadow-lg relative my-10 transition-all duration-300">
                <div className="flex items-center justify-center relative p-4  bg-white rounded-t-lg">
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={() => closeDialog(false)}
                            className="text-gray-500 hover:text-black"
                        >
                            <IoCloseOutline size={24}/>
                        </button>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                        SẢN PHẨM KHÔNG ĐỦ HÀNG
                    </div>
                </div>

                <div className="relative w-full overflow-hidden transition-all duration-300 mb-4">

                    <div className="flex flex-col px-5 py-4">
                        <ul className="list-disc pl-5">
                            {products && products.map((product: any) => (
                                <div
                                    key={product?.product_id}
                                    className={`flex iems-center justify-center`}
                                >
                                    <Image
                                        src={product?.image}
                                        alt={product?.products_name || "Product Image"}
                                        width={55}
                                        height={55}
                                        className="ml-4 p-1 rounded-lg border border-stone-300"
                                    />
                                    <span className="ml-2 line-clamp-3 overflow-hidden text-ellipsis">
                                          {product?.products_name}
                                    </span>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OutOfStock;