import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import RatingBar from "./ratingBar";
import RatingDialog from "../Dialog/ratingDialog";
import { useReview } from "@/hooks/useReview";
import ReviewContent from "./reviewContent";
import CommentContent from "./commentContent";

const FeedBack = ({ product, productId }: { product: any; productId: any }) => {
  const [isDialogRatingOpen, setIsDialogRatingOpen] = useState(false);
  const { allReview, fetchGetAllReview, allComment, fetchGetAllComment } =
    useReview();
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
        <ReviewContent allReview={allReview} />
      </div>
      <CommentContent allComment={allComment} productId={productId} />
      {isDialogRatingOpen && (
        <RatingDialog
          onClose={() => setIsDialogRatingOpen(false)}
          product={product}
          productId={productId}
        />
      )}
    </div>
  );
};

export default FeedBack;
