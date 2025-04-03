import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Check } from "lucide-react";
import RatingBar from "./ratingBar";
import RatingDialog from "../Dialog/ratingDialog";
import CommentDialog from "../Dialog/commentDialog";
import { useReview } from "@/hooks/useReview";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";

const FeedBack = ({ product, productId }: { product: any; productId: any }) => {
  const [visibleReviews, setVisibleReviews] = useState(2); // Hiển thị 2 bình luận mặc định
  const [visibleAQ, setVisibleAQ] = useState(2); // Hiển thị 2 bình luận mặc định
  const [selected, setSelected] = useState("newest");
  const [isDialogRatingOpen, setIsDialogRatingOpen] = useState(false);
  const [isDialogCommentOpen, setIsDialogCommentOpen] = useState(false);
  const { allReview, fetchGetAllReview } = useReview();
  const { productBySlug, fetchProductBySlug } = useProduct();
  const params = useParams();
  const [loading, setLoading] = useState(false);
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

  console.log(allReview, "allReview");

  return (
    <div className="">
      <div className="mx-auto bg-[#F5F7F9] p-5 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Trung bình đánh giá</h2>
            <div className="text-4xl font-bold mt-1">4.6/5.0</div>
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Star
                    key={index}
                    className="text-orange-500 fill-orange-500"
                    size={20}
                  />
                ))}
              <span className="ml-2 text-gray-500">1.9K ratings</span>
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
                      className="text-orange-500 fill-orange-500"
                      size={16}
                    />
                  ))}

                <div className="ml-2 text-sm text-gray-500">
                  {review?.created_at}
                </div>
              </div>

              {/* Thông tin người dùng & Comment */}
              <div className="mt-4 flex space-x-2">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                  {review?.user_name?.charAt(0)}
                </div>
                <div className="space-y-2">
                  <div className="font-bold">{review?.user_name}</div>
                  <div className="flex space-x-6">
                    <span>{review?.comment}</span>
                    <div className="text-blue-500 text-sm cursor-pointer flex items-center space-x-1">
                      <span>Trả lời</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách trả lời */}
              {review?.replies?.length > 0 && (
                <div className="mt-4 space-y-4 mx-12">
                  {review?.replies.map((reply: any, index: any) => (
                    <div key={index} className="flex space-x-2">
                      {/* Avatar của người trả lời */}
                      <div className="w-10 h-10 bg-gray-400 text-white flex items-center justify-center rounded-full font-bold">
                        {reply?.user_name?.charAt(0)}
                      </div>
                      {/* Nội dung trả lời */}
                      <div className="space-y-1">
                        <div className="font-bold">{reply?.user_name}</div>
                        <p>{reply?.comment || "Không có nội dung"}</p>
                        <div className="text-sm text-gray-500">
                          {reply?.created_at}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nút Xem thêm / Thu gọn */}
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
      {/* <div className="mt-6 mx-auto bg-[#F5F7F9] p-5 rounded-lg space-y-4">
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold">Hỏi và đáp</div>
          <div className="text-black/50">(127 bình luận)</div>
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
        {questionsanswers.slice(0, visibleAQ).map((questionsanswers) => (
          <div key={questionsanswers.id} className="pb-4 space-y-4">
            <div className="mt-4 flex space-x-2">
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                {questionsanswers.user.charAt(0)}
              </div>
              <div className="space-y-2">
                <div className="font-bold">{questionsanswers.user}</div>
                <div className="flex space-x-6">
                  <span>{questionsanswers.rating}</span>
                </div>
                <div className="flex space-x-6">
                  <div className="text-sm text-gray-500">
                    {questionsanswers.time}
                  </div>
                  <div className="text-blue-500 text-sm cursor-pointer">
                    Trả lời
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2 mx-12">
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                {questionsanswers.reply.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <div className="font-bold">{questionsanswers.reply.name}</div>
                <div>
                  {questionsanswers.reply.message.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                <div className="flex space-x-6">
                  <div className="text-sm text-gray-500">
                    {questionsanswers.reply.time}
                  </div>
                  <div className="text-blue-500 text-sm cursor-pointer">
                    Trả lời
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-6 text-center">
          {visibleAQ < questionsanswers.length ? (
            <button
              onClick={() => setVisibleAQ(questionsanswers.length)}
              className="text-[#002E99] cursor-pointer"
            >
              Xem thêm {questionsanswers.length - visibleAQ} bình luận
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
      </div> */}
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
