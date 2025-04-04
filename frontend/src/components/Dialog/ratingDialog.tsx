import React, { JSX, useState } from "react";
import { X } from "lucide-react"; // Import icon X
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useToast } from "@/providers/toastProvider";
import { useReview } from "@/hooks/useReview";
import { validateEmptyFields } from "@/utils/validation";

interface RatingDialogProps {
  onClose: () => void;
  product: any;
  productId: any;
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  onClose,
  product,
  productId,
}): JSX.Element => {
  const [rating, setRating] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const { insertReview, fetchInsertReview } = useReview();
  const hasError = (fieldName: string): boolean => {
    return formSubmitted && !!errors[fieldName];
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.includes("image")
      );

      const updatedImages = [...images, ...fileArray];
      setImages(updatedImages);

      // Generate preview URLs
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreviewUrls((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const updatedImages = [...images, ...fileArray];
      setImages(updatedImages); // Cập nhật state images

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreviewUrls((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <p className="text-red-500 text-xs mt-1">{message}</p>
  );

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviewUrls];
    newPreviews.splice(index, 1);
    setImagePreviewUrls(newPreviews);
  };

  const ratingTexts = [
    "Rất tệ",
    "Thất vọng",
    "Bình thường",
    "Hài lòng",
    "Tuyệt vời",
  ];

  const toast = useToast();
  const [formData, setFormData] = useState<{
    images: File[];
    rating: string;
    comment: string;
    productId: any;
  }>({
    images: [],
    rating: "",
    comment: "",
    productId: productId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate chỉ với rating và comment
    const validationErrors = validateEmptyFields({
      rating: rating ? "valid" : "",
      comment: formData.comment,
    });
    setErrors(validationErrors);

    const updatedFormData = {
      ...formData,
      rating: rating ? rating.toString() : "", // Đảm bảo rating là chuỗi nếu có
      images: images, // Thêm hình ảnh vào formData
    };

    if (Object.keys(validationErrors).length === 0) {
      try {
        await fetchInsertReview({
          param: updatedFormData,
          onSuccess: (message: string) => {
            toast.showToast(message, "success");
          },
          onFailure: (message: string) => {
            toast.showToast(message, "error");
          },
        });
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  const handleRatingChange = (star: number) => {
    setRating(star);
    setFormData({
      ...formData,
      rating: star.toString(), // Cập nhật rating vào formData
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full">
        <div className="border border-b-1 border-gray-300 rounded-t-lg flex items-center justify-center relative p-4">
          <div className="absolute top-2 right-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
          </div>
          <div className="text-2xl font-bold text-black">Đánh giá sản phẩm</div>
        </div>
        <div className="overflow-y-scroll max-h-[550px] px-6 py-4 space-y-4">
          <form className="w-full space-y-4 " onSubmit={handleSubmit}>
            <div className="flex-col space-y-2 items-center justify-center flex">
              <div className="ml-3 flex-1 flex flex-col justify-center">
                <h4 className="font-semibold text-gray-900 text-center">
                  {product?.name_primary}
                </h4>
              </div>

              <div data-error={hasError("images")}>
                <label className="block text-sm font-medium mb-1">
                  Ảnh sản phẩm{" "}
                  <span className="text-blue-500">
                    (Được phép thêm nhiều ảnh)
                  </span>
                </label>

                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="text-center py-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="flex flex-col items-center text-sm text-gray-600">
                      <p className="font-medium">
                        Kéo và thả hình ảnh ở đây, hoặc
                      </p>
                      <label className="mt-2 cursor-pointer text-blue-600 hover:text-blue-800">
                        <span>Bấm để chọn tệp</span>
                        <input
                          type="file"
                          name="images"
                          multiple
                          onChange={handleImagesChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Mỗi PNG, JPG, GIF lên đến 10mb
                    </p>
                  </div>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">
                        {images.length} image{images.length !== 1 ? "s" : ""}{" "}
                        selected
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setImages([]);
                          setImagePreviewUrls([]);
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="h-20 w-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={32}
                    className={`cursor-pointer ${
                      star <= rating ? "text-[#FCD53F]" : "text-gray-400"
                    }`}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
              <p className="text-[#FCD53F]">
                {rating > 0 ? ratingTexts[rating - 1] : "Chưa đánh giá"}
              </p>
              {errors.rating && (
                <div className="text-red-500 text-sm px-6">{errors.rating}</div>
              )}
            </div>
            <div className="px-6 w-full">
              <textarea
                placeholder="Nội dung đánh giá (Vui lòng gõ tiếng Việt có dấu)"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full p-4 rounded-xl border-gray-300 border-2 mt-2"
              ></textarea>
              {errors.comment && (
                <div className="text-red-500 text-sm">{errors.comment}</div>
              )}
            </div>

            <div className="mt-4 flex justify-center gap-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-black rounded-xl py-2 px-6"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-[#FCD53F] text-white rounded-xl py-2 px-6"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingDialog;
