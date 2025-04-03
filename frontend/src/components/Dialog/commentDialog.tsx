import React, { useState } from "react";
import { X } from "lucide-react"; // Import icon X
import Image from "next/image";
import { FaStar } from "react-icons/fa";
interface CommentDialogProps {
  onClose: () => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className="bg-white gap-4 py-6 rounded-lg flex flex-col items-center justify-center relative 
  max-h-full overflow-y-auto w-[600px]"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <div className="justify-between max-w-full text-2xl font-bold text-black px-6">
          Hỏi đáp
        </div>

        {/* Thêm gạch ngang */}
        {/* <div className="w-full border-b border-gray-300"></div> */}

        <form className="w-full space-y-4">
          <div className="px-6 w-full">
            <textarea
              placeholder="Nội dung đánh giá (Vui lòng gõ tiếng Việt có dấu)"
              className="w-full px-5 py-4 rounded-xl border border-black/10 
    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
    outline-none placeholder:text-[14px] placeholder:font-normal resize-none"
              rows={6}
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

export default CommentDialog;
