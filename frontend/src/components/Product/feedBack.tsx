import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import RatingBar from "./ratingBar";
import RatingDialog from "../Dialog/ratingDialog";
import CommentDialog from "../Dialog/commentDialog";
import { useReview } from "@/hooks/useReview";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { get } from "http";

const FeedBack = ({ product, productId }: { product: any; productId: any }) => {
  const [visibleReviews, setVisibleReviews] = useState(2); // Hiển thị 2 bình luận mặc định
  const [isDialogRatingOpen, setIsDialogRatingOpen] = useState(false);
  const [isDialogCommentOpen, setIsDialogCommentOpen] = useState(false);
  const [visibleAQ, setVisibleAQ] = useState(2); // Hiển thị 2 câu hỏi mặc định
  const { allReview, fetchGetAllReview, allComment, fetchGetAllComment } =
    useReview();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<{ [key: string]: boolean }>({});
  const [selected, setSelected] = useState<string>("newest");
  const [repreplyingTo, setRepReplyingTo] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (productId) {
      fetchGetAllReview(
        productId,
        () => {
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
      fetchGetAllComment(
        productId,
        () => {
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    }
  }, [productId]);

  const getInitials = (name: string | undefined | null) => {
    if (!name) return ""; // Trả về rỗng nếu tên không có

    return name
      .trim() // Bỏ khoảng trắng thừa ở đầu và cuối
      .split(/\s+/) // Tách các từ dựa trên khoảng trắng (bao gồm nhiều khoảng trắng liên tiếp)
      .map((word) => word.charAt(0).toUpperCase()) // Lấy chữ cái đầu và chuyển thành chữ hoa
      .join(""); // Kết hợp lại thành chuỗi
  };
  console.log("namemmmm", getInitials("Thùy duyen"));

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
    <div className="">
      <div className="mx-auto bg-[#F5F7F9] p-5 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Trung bình đánh giá</h2>
            <div className="text-4xl font-bold mt-1">{product?.rating}/5.0</div>
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Star
                    key={index}
                    className="text-[#FCD53F] fill-[#FCD53F]"
                    size={20}
                  />
                ))}
              <span className="ml-2 text-gray-500">
                {product?.count_review} đánh giá
              </span>
            </div>
          </div>
          <RatingBar allReviews={allReview} />

          <button
            className="bg-[#0053E2] text-white px-4 rounded-full h-[50px] font-bold"
            onClick={() => setIsDialogRatingOpen(true)}
          >
            Viết đánh giá
          </button>
        </div>
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
                            className="my-4"
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
      </div>
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
      </div>

      {isDialogRatingOpen && (
        <RatingDialog onClose={() => setIsDialogRatingOpen(false)} />
      )}
      {isDialogCommentOpen && (
        <CommentDialog onClose={() => setIsDialogCommentOpen(false)} />
      )}
    </div>
  );
};

export default FeedBack;
