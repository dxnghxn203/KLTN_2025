"use client";

import React, {useEffect, useState} from "react";
import {X} from "lucide-react";
import Image from "next/image";
import voucher from "@/images/gift.png";

interface VoucherDialogProps {
    onClose: () => void;
    allVoucherUser: any;
    setVouchers?: (vouchers: any) => void;
    vouchers?: any;
    orderCheck: boolean
}

const VoucherDialog: React.FC<VoucherDialogProps> = ({
                                                         onClose,
                                                         allVoucherUser,
                                                         setVouchers,
                                                         vouchers,
                                                         orderCheck
                                                     }) => {
    const [voucherCode, setVoucherCode] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [selectedVoucherOrder, setSelectedVoucherOrder] = useState<any>(null);
    const [showAll, setShowAll] = useState(false);
    const [showAllOrder, setShowAllOrder] = useState(false);
    const deliveryVouchers = allVoucherUser.filter(
        (voucher: any) => voucher.voucher_type === "delivery"
    );


    const vouchersToShow = showAll
        ? deliveryVouchers
        : deliveryVouchers.slice(0, 3);
    const orderVouchers = allVoucherUser.filter(
        (voucher: any) => voucher.voucher_type === "order"
    );

    const orderVouchersToShow = showAllOrder
        ? orderVouchers
        : orderVouchers.slice(0, 3);

    useEffect(() => {
        if (vouchers && vouchers.selectedVoucher && vouchers.selectedVoucherOrder) {
            setSelectedVoucher(vouchers.selectedVoucher);
            setSelectedVoucherOrder(vouchers.selectedVoucherOrder);
        } else {
            if (deliveryVouchers && deliveryVouchers.length > 0) {
                setSelectedVoucher(deliveryVouchers[0]);
                if (setVouchers) {
                    setVouchers((props: any) => {
                            return {
                                ...props,
                                selectedVoucher: deliveryVouchers[0],
                            }
                        }
                    )
                }
            }
            if (orderVouchers && orderVouchers.length > 0) {
                setSelectedVoucherOrder(orderVouchers[0]);
                if (setVouchers) {
                    setVouchers((props: any) => {
                        return {
                            ...props,
                            selectedVoucherOrder: orderVouchers[0],
                        }
                    })
                }
            }
        }

    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVoucherCode(e.target.value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className="bg-white w-full max-w-lg max-h-[100vh] rounded-lg flex flex-col items-center relative overflow-hidden px-8 py-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <X size={24}/>
                </button>

                <div className="text-2xl font-bold text-black text-center mb-4">
                    Ưu đãi dành cho bạn
                </div>

                {!orderCheck && (
                    <div
                        className="w-full bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4">
                        <p className="text-center font-medium">Bạn hãy chọn sản phẩm để tiếp tục</p>
                    </div>
                )}

                <div
                    className="flex w-full max-w-3xl mt-2 text-black border border-zinc-400 border-opacity-40 rounded-full">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 bg-transparent border-none outline-none text-sm px-4 py-3"
                        value={voucherCode}
                        onChange={handleInputChange}
                        disabled={!orderCheck}
                    />
                    <button
                        type="submit"
                        className={`px-4 py-3 font-semibold rounded-full text-white text-sm transition ${
                            voucherCode && orderCheck
                                ? "bg-[#0053E2] hover:bg-[#002E99]"
                                : "bg-zinc-400 cursor-not-allowed"
                        }`}
                        disabled={!voucherCode || !orderCheck}
                    >
                        Xác nhận
                    </button>
                </div>

                {/* Nội dung voucher scrollable */}
                <div className="w-full max-w-lg overflow-y-auto scrollbar-hide mt-4 px-1 space-y-10 flex flex-col">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Mã Giảm giá Vận Chuyển
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">Có thể chọn 1 Voucher</p>

                        {vouchersToShow.map(
                            (voucher: any, index: number) =>
                                voucher.voucher_type === "delivery" && (
                                    <label
                                        key={voucher.voucher_id}
                                        className={`flex justify-between border rounded-xl mb-2 ${
                                            orderCheck ? "cursor-pointer hover:bg-gray-50" : "cursor-default opacity-80"
                                        }`}
                                    >
                                        <div className="flex">
                                            <div
                                                className="relative rang-cua-left w-32 bg-[#26A999] text-white text-center font-bold p-4 rounded-l-xl">
                                                FREE
                                                <br/>
                                                SHIP
                                                <p className="text-xs mt-2">Toàn Ngành Hàng</p>
                                            </div>
                                            <div className="flex flex-col px-4 py-2 justify-center">
                                                <p className="text-gray-700 font-semibold">
                                                    Giảm tối đa{" "}
                                                    {voucher.max_discount_value.toLocaleString("vi-VN")}đ
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Đơn tối thiểu{" "}
                                                    {voucher.min_order_value.toLocaleString("vi-VN")}đ
                                                </p>
                                                <div className="w-full h-2 bg-red-200 rounded mt-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                        style={{
                                                            width: `${
                                                                (voucher.used / voucher.inventory) * 100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Đã dùng {(voucher.used / voucher.inventory) * 100}%
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Sắp hết hạn:{" "}
                                                    {new Date(voucher.expired_date).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <input
                                            type="radio"
                                            name="selectedVoucher"
                                            value={voucher.voucher_id}
                                            checked={!(selectedVoucher?.voucher_id !== voucher.voucher_id)}
                                            onChange={() => {
                                                if (orderCheck) {
                                                    setSelectedVoucher(voucher);
                                                    if (setVouchers) {
                                                        setVouchers({
                                                            selectedVoucher: voucher,
                                                            selectedVoucherOrder: selectedVoucherOrder,
                                                        })
                                                    }
                                                }
                                            }}
                                            className={`mr-4 flex items-center ${orderCheck ? "cursor-pointer" : "cursor-not-allowed"}`}
                                            disabled={!orderCheck}
                                        />
                                    </label>
                                )
                        )}
                        <div className="flex justify-center items-center">
                            {deliveryVouchers.length > 3 && (
                                <button
                                    className="text-blue-600 text-sm underline ml-2 mt-2 "
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll ? "Ẩn bớt" : "Xem thêm"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Giảm Giá</h2>
                        <p className="text-sm text-gray-500 mb-4">Có thể chọn 1 Voucher</p>
                        {orderVouchersToShow.map(
                            (voucher: any, index: number) =>
                                voucher.voucher_type === "order" && (
                                    <label
                                        key={voucher.voucher_id}
                                        className={`flex justify-between border rounded-xl mb-2 ${
                                            orderCheck ? "cursor-pointer hover:bg-gray-50" : "cursor-default opacity-80"
                                        }`}
                                    >
                                        <div className="flex">
                                            <div
                                                className="relative rang-cua-left w-32 bg-[#EA4B2A] text-white text-center font-bold p-4 rounded-l-xl rang-cua-left">
                                                ĐƠN
                                                <br/>
                                                HÀNG
                                                <p className="text-xs mt-2">Toàn Ngành Hàng</p>
                                            </div>
                                            <div className="flex flex-col px-4 py-2 justify-center">
                                                <p className="text-gray-700 font-semibold">
                                                    Giảm tối đa{" "}
                                                    {voucher.max_discount_value.toLocaleString("vi-VN")}đ
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Đơn tối thiểu{" "}
                                                    {voucher.min_order_value.toLocaleString("vi-VN")}đ
                                                </p>
                                                <div className="w-full h-2 bg-red-200 rounded mt-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                        style={{
                                                            width: `${
                                                                (voucher.used / voucher.inventory) * 100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    Sắp hết hạn:{" "}
                                                    {new Date(voucher.expired_date).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <input
                                            type="radio"
                                            name="selectedVoucherOrder"
                                            value={voucher.voucher_id}
                                            checked={!(selectedVoucherOrder?.voucher_id !== voucher.voucher_id)}
                                            onChange={() => {
                                                if (orderCheck) {
                                                    setSelectedVoucherOrder(voucher);
                                                    if (setVouchers) {
                                                        setVouchers({
                                                            selectedVoucher: selectedVoucher,
                                                            selectedVoucherOrder: voucher,
                                                        })
                                                    }
                                                }
                                            }}
                                            className={`mr-4 flex items-center ${orderCheck ? "cursor-pointer" : "cursor-not-allowed"}`}
                                            disabled={!orderCheck}
                                        />
                                    </label>
                                )
                        )}
                        <div className="flex justify-center items-center">
                            {orderVouchers.length > 3 && (
                                <button
                                    className="text-blue-600 text-sm underline ml-2 mt-2"
                                    onClick={() => setShowAllOrder(!showAllOrder)}
                                >
                                    {showAllOrder ? "Ẩn bớt" : "Xem thêm"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6 w-full">
                    <button
                        onClick={onClose}
                        className={`font-semibold w-full max-w-3xl py-3 rounded-full ${
                            orderCheck
                                ? "bg-[#0053E2] text-white hover:bg-[#002E99]"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!orderCheck}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoucherDialog;

