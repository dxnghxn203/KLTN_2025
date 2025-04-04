import { useAuth } from "@/hooks/useAuth";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CommentDialog from "../Dialog/commentDialog";

interface CommentContentProps {
  allComment: any[]; // Thay thế any bằng kiểu dữ liệu thực tế của allComment nếu có
  productId: any;
}

const CommentContent: React.FC<CommentContentProps> = ({
  allComment,
  productId,
}) => {
  const [visibleComments, setVisibleComments] = useState(2); // Hiển thị 2 bình luận mặc định
  const [repreplyingTo, setRepReplyingTo] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyingTo, setReplyingTo] = useState<{ [key: string]: boolean }>({});
  const getInitials = (name: string | undefined | null) => {
    if (!name) return ""; // Trả về rỗng nếu tên không có

    return name
      .trim() // Bỏ khoảng trắng thừa ở đầu và cuối
      .split(/\s+/) // Tách các từ dựa trên khoảng trắng (bao gồm nhiều khoảng trắng liên tiếp)
      .map((word) => word.charAt(0).toUpperCase()) // Lấy chữ cái đầu và chuyển thành chữ hoa
      .join(""); // Kết hợp lại thành chuỗi
  };
  const [isDialogCommentOpen, setIsDialogCommentOpen] = useState(false);
  const { user } = useAuth();
  const [selected, setSelected] = useState<string>("newest");
  const [visibleAQ, setVisibleAQ] = useState(2); // Hiển thị 2 câu hỏi mặc định

  const getFormattedDate = (date: any) => {
    const now = new Date();
    const createdAt = new Date(date);
    const differenceInDays = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24)
    );

    if (differenceInDays === 0) {
      return "Hôm nay";
    } else if (differenceInDays === 1) {
      return "Hôm qua";
    } else if (differenceInDays === 2) {
      return "Hôm kia";
    } else {
      return createdAt.toLocaleDateString("vi-VN");
    }
  };
  // console.log("productId: ", productId);

  return (
    <div className="mt-6 mx-auto bg-[#F5F7F9] p-5 rounded-lg space-y-4">
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold">Hỏi và đáp</div>
        <div className="text-black/50">({allComment?.length} bình luận)</div>
      </div>
      <button
        className="bg-[#0053E2] text-white px-4 rounded-full h-[50px] font-bold"
        onClick={() => setIsDialogCommentOpen(true)}
      >
        Gửi bình luận
      </button>
      <div className="mt-6 border-t border-gray-300"></div>
      <div className="flex items-center space-x-3">
        <span className="text-gray-500">Lọc theo:</span>
        <button
          onClick={() => setSelected("newest")}
          className={`relative flex items-center px-4 py-1.5 rounded-full border ${
            selected === "newest"
              ? "border-blue-600 text-blue-600"
              : "border-gray-300 text-gray-500"
          }`}
        >
          Mới nhất
        </button>
        <button
          onClick={() => setSelected("oldest")}
          className={`px-4 py-1.5 rounded-full border ${
            selected === "oldest"
              ? "border-blue-600 text-blue-600"
              : "border-gray-300 text-gray-500"
          }`}
        >
          Cũ nhất
        </button>
      </div>
      {allComment?.slice(0, visibleAQ).map((comment: any) => (
        <div key={comment?.id} className="pb-4 space-y-4">
          <div className="mt-4 flex space-x-4">
            <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
              {getInitials(comment?.user_name)}
            </div>
            <div className="space-y-2">
              <div className="font-bold">{comment?.user_name}</div>
              <div className="flex space-x-6">
                <span>{comment?.comment}</span>
              </div>
              <div className="flex space-x-6">
                <div className="text-sm text-gray-500">
                  {getFormattedDate(comment?.created_at)}
                </div>
                <div className="text-blue-500 text-sm cursor-pointer">
                  Trả lời
                </div>
              </div>
            </div>
          </div>
          {comment?.answers?.length > 0 && (
            <div className="mt-4 flex space-x-4 mx-12">
              {/* Hiển thị thông tin trả lời */}
              {comment?.answers.map((answer: any, index: number) => (
                <div key={index} className="flex space-x-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                    {getInitials(answer?.user_name)}
                  </div>
                  {/* Thông tin người trả lời và nội dung trả lời */}
                  <div className="space-y-2">
                    <div className="font-bold">{answer.user_name}</div>
                    <p>{answer.comment}</p>
                    <div className="flex space-x-6">
                      <div className="text-sm text-gray-500">
                        {getFormattedDate(answer.created_at)}
                      </div>
                      <div className="text-blue-500 text-sm cursor-pointer">
                        Trả lời
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="mt-6 text-center">
        {visibleAQ < allComment?.length ? (
          <button
            onClick={() => setVisibleAQ(allComment?.length)}
            className="text-[#002E99] cursor-pointer"
          >
            Xem thêm {allComment?.length - visibleAQ} bình luận
          </button>
        ) : (
          <button
            onClick={() => setVisibleAQ(2)}
            className="text-[#002E99] cursor-pointer"
          >
            Thu gọn
          </button>
        )}
      </div>
      {isDialogCommentOpen && (
        <CommentDialog
          onClose={() => setIsDialogCommentOpen(false)}
          productId={productId}
        />
      )}
    </div>
  );
};

export default CommentContent;
