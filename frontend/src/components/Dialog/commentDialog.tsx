import React, { useState } from "react";
import { X } from "lucide-react";
import { useReview } from "@/hooks/useReview";
import { validateEmptyFields } from "@/utils/validation";
import { useToast } from "@/providers/toastProvider";
interface CommentDialogProps {
  onClose: () => void;
  productId: any;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  onClose,
  productId,
}) => {
  const [rating, setRating] = useState(0);
  const { fetchInsertComment, insertComment } = useReview();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    productId: productId,
    comment: "",
  });
  const toast = useToast();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateEmptyFields(formData);
    setErrors(validationErrors);

    // Kiểm tra dữ liệu formData trước khi gửi
    console.log("formData trước khi gửi: ", formData);

    // Nếu không có lỗi validation
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Gọi API insert comment
        await fetchInsertComment({
          param: formData,
          onSuccess: (message: string) => {
            toast.showToast(message, "success");
            onClose(); // Đóng modal sau khi thành công
          },
          onFailure: (message: string) => {
            toast.showToast(message, "error");
          },
        });
      } catch (error) {
        toast.showToast("Bình luận không thành công!", "error");
      }
    }
    console.log("formData sau khi gửi: ", formData);
    console.log("insertComment: ", insertComment);
  };

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

        <form className="w-full space-y-4" onSubmit={onSubmit}>
          <div className="px-6 w-full">
            <textarea
              placeholder="Nội dung đánh giá (Vui lòng gõ tiếng Việt có dấu)"
              className="w-full px-5 py-4 rounded-xl border border-black/10 
    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
    outline-none placeholder:text-[14px] placeholder:font-normal resize-none"
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              rows={6}
              value={formData.comment}
            />
          </div>
          {errors.comment && (
            <div className="text-red-500 text-sm px-6">{errors.comment}</div>
          )}
          <div className="px-6 w-full">
            <button
              className="bg-[#0053E2] text-white rounded-full h-[50px] font-bold w-full"
              type="submit"
            >
              Gửi bình luận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentDialog;
