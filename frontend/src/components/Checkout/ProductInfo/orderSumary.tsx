import VoucherDialog from "@/components/Dialog/voucherDialog";
import React, { useState } from "react";
import Link from "next/link";

interface OrderSummaryProps {
  totalAmount: number;
  totalOriginPrice: number;
  totalDiscount: number;
  totalSave: number;
  checkout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalAmount,
  totalOriginPrice,
  totalDiscount,
  totalSave,
  checkout,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col items-start pt-4 pr-7 pb-8 pl-3.5 mx-auto w-full font-medium rounded-xl bg-[#F5F7F9] max-md:pr-5 max-md:mt-8">
        <div
          className="flex gap-5 justify-between self-stretch px-4 py-3.5 text-sm text-[#0053E2] bg-indigo-50 rounded-xl max-md:mr-0.5 max-md:ml-2 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="self-start">Áp dụng ưu đãi để được giảm giá</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/ea114104ad3ef0791d002897f7f4483b6477a0c967df6d8b11926796e1b46cf7?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
            className="object-contain shrink-0 w-5 aspect-square"
            alt=""
          />
        </div>

        <div className="flex flex-col mt-4 ml-2.5 max-w-full text-sm w-[337px]">
          <div className="flex justify-between text-black">
            <div>Tổng tiền</div>
            <div>{totalOriginPrice.toLocaleString("vi-VN")}đ</div>
          </div>
          <div className="flex justify-between text-black mt-5">
            <div>Giảm giá trực tiếp</div>
            <div className="text-amber-300">
              - {totalDiscount.toLocaleString("vi-VN")}đ
            </div>
          </div>
          <div className="flex justify-between text-black mt-5">
            <div>Giảm giá voucher</div>
            <div className="text-amber-300">0đ</div>
          </div>
          <div className="flex justify-between text-black mt-5">
            <div>Tiết kiệm được</div>
            <div className="text-amber-300">
              {totalSave.toLocaleString("vi-VN")}đ
            </div>
          </div>
        </div>

        <div className="shrink-0 mt-5 ml-2.5 max-w-full h-px border border-black border-opacity-10 w-[337px]" />

        <div className="flex gap-5 justify-between items-center mt-3 ml-2.5 max-w-full w-[337px]">
          <div className="text-xl text-black">Thành tiền</div>
          <div className="flex gap-2 whitespace-nowrap">
            <div className="text-[16px] pt-1 text-gray-500 line-through">
              {totalOriginPrice.toLocaleString("vi-VN")}đ
            </div>
            <div className="text-xl font-semisemibold text-blue-700">
              {" "}
              {totalAmount.toLocaleString("vi-VN")}đ
            </div>
          </div>
        </div>

        <button
          onClick={checkout}
          className="px-16 py-4 mt-7 ml-2.5 max-w-full text-base font-bold text-white bg-blue-700 rounded-3xl w-[337px] max-md:px-5 hover:bg-[#002E99]"
        >
          Thanh toán
        </button>

        <div className="mt-7 text-sm text-center font-normal">
          Bằng việc tiến hành đặt mua hàng, bạn đồng ý với Điều khoản dịch vụ và
          Chính sách xử lý dữ liệu cá nhân của Nhà thuốc Medicare
        </div>
      </div>
      {isDialogOpen && <VoucherDialog onClose={() => setIsDialogOpen(false)} />}
    </div>
  );
};

export default OrderSummary;
