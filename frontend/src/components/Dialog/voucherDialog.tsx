"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import voucher from "@/images/gift.png";

interface DeleteDialogProps {
  onClose: () => void;
  allVoucherUser: any;
}

const VoucherDialog: React.FC<DeleteDialogProps> = ({
  onClose,
  allVoucherUser,
}) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedVoucherOrder, setSelectedVoucherOrder] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  console.log("allVouchersByUser", allVoucherUser);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-lg flex flex-col items-center relative overflow-hidden px-8 py-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <div className="text-2xl font-bold text-black text-center mb-4">
          Ưu đãi dành cho bạn
        </div>

        <div className="flex w-full max-w-3xl mt-2 text-black border border-zinc-400 border-opacity-40 rounded-full">
          <input
            type="text"
            placeholder="Nhập mã giảm giá"
            className="flex-1 bg-transparent border-none outline-none text-sm px-4 py-3"
            value={voucherCode}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className={`px-4 py-3 font-semibold rounded-full text-white text-sm transition ${
              voucherCode
                ? "bg-[#0053E2] hover:bg-[#002E99]"
                : "bg-zinc-400 cursor-not-allowed"
            }`}
            disabled={!voucherCode}
          >
            Xác nhận
          </button>
        </div>

        {/* Nội dung voucher scrollable */}
        <div className="w-full max-w-5xl overflow-y-auto scrollbar-hide mt-4 px-1 space-y-10 flex-1">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Mã Miễn Phí Vận Chuyển
            </h2>
            <p className="text-sm text-gray-500 mb-4">Có thể chọn 1 Voucher</p>

            {allVoucherUser.map(
              (voucher: any, index: number) =>
                voucher.voucher_type === "delivery" && (
                  <label
                    key={voucher.voucher_id}
                    className="flex justify-between border rounded-xl cursor-pointer hover:bg-gray-50 mb-2"
                  >
                    {/* Left content: FREE SHIP + thông tin */}
                    <div className="flex">
                      <div className="w-24 bg-[#26A999] text-white text-center font-bold py-6 rounded-l-xl p-4 rang-cua-left">
                        FREE
                        <br />
                        SHIP
                        <p className="text-xs mt-2">Toàn Ngành Hàng</p>
                      </div>
                      <div className="flex flex-col px-4 py-2 justify-center">
                        <p className="text-gray-700 font-semibold">
                          Giảm tối đa{" "}
                          {voucher.max_discount_value.toLocaleString("vi-VN")}đ
                        </p>
                        {/* <p className="text-gray-700 font-semibold">
                          Giảm {voucher.discount.toLocaleString("vi-VN")} %
                        </p> */}
                        <p className="text-sm text-gray-500">
                          {voucher.description}
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

                    {/* Right: radio button */}
                    <input
                      type="radio"
                      name="selectedVoucher"
                      value={voucher.voucher_id}
                      checked={selectedVoucher === voucher.voucher_id}
                      onChange={() => setSelectedVoucher(voucher.voucher_id)}
                      className="mr-4 flex items-center cursor-pointer"
                    />
                  </label>
                )
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">Giảm Giá</h2>
            <p className="text-sm text-gray-500 mb-4">Có thể chọn 1 Voucher</p>
            {allVoucherUser.map(
              (voucher: any, index: number) =>
                voucher.voucher_type === "order" && (
                  <label
                    key={voucher.voucher_id}
                    className="flex justify-between border rounded-xl cursor-pointer hover:bg-gray-50 mb-2"
                  >
                    {/* Left content: FREE SHIP + thông tin */}
                    <div className="flex">
                      <div className="w-24 bg-[#EA4B2A] text-white text-center font-bold py-6 rounded-l-xl p-4 rang-cua-left">
                        ĐƠN
                        <br />
                        HÀNG
                        <p className="text-xs mt-2">Toàn Ngành Hàng</p>
                      </div>
                      <div className="flex flex-col px-4 py-2 justify-center">
                        <p className="text-gray-700 font-semibold">
                          Giảm tối đa{" "}
                          {voucher.max_discount_value.toLocaleString("vi-VN")}đ
                        </p>
                        {/* <p className="text-gray-700 font-semibold">
                          Giảm {voucher.discount.toLocaleString("vi-VN")} %
                        </p> */}
                        <p className="text-sm text-gray-500">
                          {voucher.description}
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

                    {/* Right: radio button */}
                    <input
                      type="radio"
                      name="selectedVoucherOrder"
                      value={voucher.voucher_id}
                      checked={selectedVoucherOrder === voucher.voucher_id}
                      onChange={() =>
                        setSelectedVoucherOrder(voucher.voucher_id)
                      }
                      className="mr-4 flex items-center cursor-pointer"
                    />
                  </label>
                )
            )}
          </div>
        </div>

        {/* Nút xác nhận */}
        <div className="flex justify-center mt-6 w-full">
          <button className="bg-[#0053E2] text-white font-semibold w-full max-w-3xl py-3 rounded-full hover:bg-[#002E99]">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherDialog;
