import React, { useState } from "react";
import { X } from "lucide-react"; // Import icon X
import Image from "next/image";
import { FaStar } from "react-icons/fa";
interface RatingDialogProps {
  onClose: () => void;
}

const RatingDialog: React.FC<RatingDialogProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0);

  const ratingTexts = [
    "Rất tệ",
    "Thất vọng",
    "Bình thường",
    "Hài lòng",
    "Tuyệt vời",
  ];
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className="bg-white gap-4 py-6 rounded-lg flex flex-col items-center justify-center relative 
  max-h-full overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <div className="justify-between max-w-full text-2xl font-bold text-black px-6">
          Đánh giá sản phẩm
        </div>

        {/* Thêm gạch ngang */}
        <div className="w-full border-b border-gray-300"></div>
        <div className="flex space-x-2">
          <Image
            src=""
            alt=""
            width={60}
            height={60}
            className="object-cover"
          />
          <div className="ml-3 flex-1 flex flex-col justify-center">
            <h4 className="font-medium text-gray-900">
              Viên uống hỗ trợ dạ dày Dr.Sto Jpanwell (60 viên)
            </h4>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={32}
                className={`cursor-pointer ${
                  star <= rating ? "text-orange-500" : "text-gray-400"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p className="text-lg text-orange-500">
            {rating > 0 ? ratingTexts[rating - 1] : "Chưa đánh giá"}
          </p>
        </div>
        <form className="w-full space-y-4">
          <div className="flex gap-4 w-full px-6">
            <input
              type="text"
              placeholder="Nhập họ và tên"
              className="w-full px-5 py-4 rounded-xl border border-black/10 
    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
    outline-none placeholder:text-[14px] placeholder:font-normal"
            />
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              className="w-full px-5 py-4 rounded-xl border border-black/10 
    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
    outline-none placeholder:text-[14px] placeholder:font-normal"
            />
          </div>
          <div className="px-6 w-full">
            <input
              type="email"
              placeholder="Nhập email (Không bắt buộc)"
              className="w-full px-5 py-4 rounded-xl border border-black/10 
    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
    outline-none placeholder:text-[14px] placeholder:font-normal"
            />
          </div>
          <div className="px-6 w-full">
            <textarea
              placeholder="Nội dung đánh giá (Vui lòng gõ tiếng Việt có dấu)"
              className="w-full px-5 py-4 rounded-xl border border-black/10 
    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
    outline-none placeholder:text-[14px] placeholder:font-normal resize-none"
              rows={4}
            />
          </div>
          <div className="px-6 w-full">
            <button className="bg-[#0053E2] text-white rounded-full h-[50px] font-bold w-full">
              Gửi bình luận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingDialog;
