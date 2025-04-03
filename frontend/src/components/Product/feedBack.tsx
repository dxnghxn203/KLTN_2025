import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import RatingBar from "./ratingBar";
import RatingDialog from "../Dialog/ratingDialog";
import CommentDialog from "../Dialog/commentDialog";
import { useReview } from "@/hooks/useReview";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const FeedBack = ({ product, productId }: { product: any; productId: any }) => {
  const [visibleReviews, setVisibleReviews] = useState(2); // Hiển thị 2 bình luận mặc định
  const [isDialogRatingOpen, setIsDialogRatingOpen] = useState(false);
  const [isDialogCommentOpen, setIsDialogCommentOpen] = useState(false);
  const { allReview, fetchGetAllReview } = useReview();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<{ [key: string]: boolean }>({});
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
    }
  }, [productId]);

  const getInitials = (name: any) => {
    if (!name) return "";
    return name
      .trim()
      .split(" ")
      .map((word: string) => word.charAt(0))
      .join("")
      .toUpperCase();
  };
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
                {product?.count_review} ratings
              </span>
            </div>
          </div>
          <RatingBar />
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
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
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
                  <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
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
                      <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
                          {getInitials(reply?.user_name)}
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold">{reply?.user_name}</div>
                          <p>{reply?.comment || "Không có nội dung"}</p>
                          <div className="flex space-x-6">
                            <div className="text-sm text-gray-500">
                              {new Date(reply?.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
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
                      {repreplyingTo === reply._id && (
                        <div className="space-x-4 mx-12 flex items-center justify-center mt-3">
                          <div className="w-10 h-10 bg-[#C1C8D1] text-white flex items-center justify-center rounded-full font-bold">
                            {getInitials(user?.user_name)}
                          </div>
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
