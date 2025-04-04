import { useAuth } from "@/hooks/useAuth";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ReviewContentProps {
  allReview: any[]; // Thay thế any bằng kiểu dữ liệu thực tế của allReview nếu có
}

const ReviewContent: React.FC<ReviewContentProps> = ({ allReview }) => {
  const [visibleReviews, setVisibleReviews] = useState(2); // Hiển thị 2 bình luận mặc định
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
  const { user } = useAuth();

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

  return (
    <>
      <div className="mt-6 border-t border-gray-300"></div>
      <div className="mt-6 space-y-4">
        {allReview.slice(0, visibleReviews).map((review: any) => (
          <div key={review?._id} className="pb-4 space-y-4">
            {/* Rating & Thời gian */}
            <div className="flex items-center">
              {Array(review.rating)
                .fill(0)
                .map((_, index) => (
                  <Star
                    key={index}
                    className="text-[#FCD53F] fill-[#FCD53F]"
                    size={16}
                  />
                ))}
              <div className="ml-2 text-sm text-gray-500">
                {getFormattedDate(review?.created_at)}
              </div>
            </div>

            {/* Thông tin người dùng & Comment */}
            <div className="mt-4 flex space-x-4">
              {/* <div> */}
              <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
                {getInitials(review?.user_name)}
              </div>
              <div className="">
                <div className="font-bold">{review?.user_name}</div>
                <div className="flex space-x-2">
                  {/* <div className="flex"> */}
                  {Array.isArray(review?.images) &&
                  review?.images.length > 0 ? (
                    review?.images.map((image: string, index: number) => (
                      <div key={index}>
                        <Image
                          src={image}
                          alt={`review-image-${index}`}
                          width={80} // Chỉnh kích thước theo yêu cầu
                          height={80} // Chỉnh kích thước theo yêu cầu
                          className="my-4 w-[80px] h-[80px]"
                        />
                      </div>
                    ))
                  ) : (
                    <p></p>
                  )}
                  {/* </div> */}
                </div>
                <div className="flex space-x-6 my-2">
                  <span>{review?.comment}</span>
                  <div
                    className="text-blue-500 text-sm cursor-pointer flex items-center space-x-1"
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === review._id ? null : review._id
                      )
                    }
                  >
                    <span>Trả lời</span>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
            {/* Hiển thị phần trả lời */}
            {replyingTo === review._id && (
              <div className="space-x-4 mx-12 flex items-center justify-center mt-3">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                  {getInitials(user?.user_name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">
                    Đang trả lời:{" "}
                    <span className="font-semibold">{review.user_name}</span>
                  </p>
                  <input
                    type="text"
                    placeholder="Nhập nội dung trả lời..."
                    className="w-full px-2 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-5">
                  <button className="text-sm bg-[#0053E2] text-white px-4 py-3 rounded-full font-semibold hover:bg-blue-700">
                    Gửi bình luận
                  </button>
                </div>
              </div>
            )}
            {/* Danh sách trả lời */}
            {review?.replies?.length > 0 && (
              <div className="mt-4 space-y-4 mx-12">
                {review?.replies.map((reply: any) => (
                  <div key={reply?._id}>
                    {/* Phần hiển thị trả lời */}
                    <div className="flex space-x-4 ">
                      {/* Avatar người trả lời */}
                      <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                        {getInitials(reply?.user_name)}
                      </div>

                      {/* Nội dung trả lời */}
                      <div className="space-y-2">
                        <div className="font-bold">{reply?.user_name}</div>
                        <p>{reply?.comment || "Không có nội dung"}</p>

                        <div className="flex space-x-6">
                          {/* Thời gian trả lời */}
                          <div className="text-sm text-gray-500">
                            {getFormattedDate(reply?.created_at)}
                          </div>

                          {/* Nút Trả lời */}
                          <div
                            className="text-blue-500 text-sm cursor-pointer flex items-center space-x-1"
                            onClick={() =>
                              setRepReplyingTo(
                                repreplyingTo === reply._id ? null : reply._id
                              )
                            }
                          >
                            <span>Trả lời</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form trả lời khi click vào nút "Trả lời" */}
                    {repreplyingTo === reply._id && (
                      <div className="space-x-4 mx-12 flex items-center justify-center mt-3">
                        {/* Avatar người đang trả lời */}
                        <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
                          {getInitials(user?.user_name)}
                        </div>

                        {/* Input trả lời */}
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">
                            Đang trả lời:{" "}
                            <span className="font-semibold">
                              {reply.user_name}
                            </span>
                          </p>
                          <input
                            type="text"
                            placeholder="Nhập nội dung trả lời..."
                            className="w-full px-2 py-3 mt-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Nút gửi bình luận */}
                        <div className="mt-5">
                          <button className="text-sm bg-[#0053E2] text-white px-4 py-3 rounded-full font-semibold hover:bg-blue-700">
                            Gửi bình luận
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        {visibleReviews < allReview.length ? (
          <button
            onClick={() => setVisibleReviews(allReview.length)}
            className="text-[#002E99] cursor-pointer"
          >
            Xem thêm {allReview.length - visibleReviews} bình luận
          </button>
        ) : (
          allReview.length > 2 && (
            <button
              onClick={() => setVisibleReviews(2)}
              className="text-[#002E99] cursor-pointer"
            >
              Thu gọn
            </button>
          )
        )}
      </div>
    </>
  );
};

export default ReviewContent;
