import React, { useState } from "react";
import { X } from "lucide-react"; // Import icon X
import Image from "next/image";
import voucher from "@/images/gift.png";

interface DeleteDialogProps {
  onClose: () => void;
  //   onConfirm: () => void;
}

const VoucherDialog: React.FC<DeleteDialogProps> = ({
  onClose,
  //   onConfirm,
}) => {
  const [voucherCode, setVoucherCode] = useState("");

  // Hàm để xử lý thay đổi giá trị input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white py-6 gap-4 rounded-lg flex flex-col items-center justify-center relative w-[550px]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <div className="justify-between max-w-full text-2xl font-bold text-black px-6">
          Ưu đãi dành cho bạn
        </div>
        <div className="flex w-[500px] mt-5 text-black border border-zinc-400 border-opacity-40 rounded-[30px] h-[55px]">
          <form className="flex w-full items-center">
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="flex-1 bg-transparent border-none outline-none text-sm ml-4"
              aria-label="Nhập mã giảm giá"
              value={voucherCode}
              onChange={handleInputChange} // Xử lý thay đổi giá trị input
            />
            <button
              type="submit"
              className={`px-6 py-4 font-semibold rounded-[30px] text-white text-[14px] ${
                voucherCode ? "bg-[#0053E2] hover:bg-[#002E99]" : "bg-zinc-400"
              }`}
              disabled={!voucherCode} // Vô hiệu hóa nút nếu không có mã giảm giá
            >
              Xác nhận
            </button>
          </form>
        </div>

        <div className="relative flex items-center justify-center w-full h-full bg-[#D9D9D9]/40">
          <Image
            src={voucher}
            alt=""
            width={180}
            height={180}
            className="object-cover px-4 py-14"
          />
        </div>

        <div className="w-full text-sm text-zinc-400 px-6 text-left">
          Vui lòng chọn ưu đãi
        </div>

        <div className="flex justify-center gap-4">
          <button
            // onClick={onConfirm}
            className="mt-2 bg-[#0053E2] text-white font-semibold w-[500px] py-3 rounded-full hover:bg-[#002E99]"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherDialog;
