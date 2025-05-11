import React, { useState } from "react";
import { X } from "lucide-react";
import DOMPurify from "dompurify";
import { useToast } from "@/providers/toastProvider";
import { validateEmptyFields } from "@/utils/validation";
import { useOrder } from "@/hooks/useOrder";

interface ApproveRequestDialogProps {
  requestSelected: any;
  isOpen: boolean;
  onClose: () => void;
}

const ApproveRequestDialog: React.FC<ApproveRequestDialogProps> = ({
  requestSelected,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const [rejectedNote, setRejectedNote] = useState("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const toast = useToast();
  const handleReject = () => {
    const emptyFieldErrors = validateEmptyFields({
      rejected_note: rejectedNote,
    });

    const formErrors: { [key: string]: string } = { ...emptyFieldErrors };
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      request_id: requestSelected.request_id,
      rejected_note: rejectedNote,
      is_approved: false,
    };
  };

  const handleApprove = () => {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-fit mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {requestSelected?.verified_by === ""
              ? "Duyệt sản phẩm"
              : "Thông tin sản phẩm"}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-6 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          <div className="flex gap-10 p-8 bg-white rounded-xl ">
            {/* Left Section: Request Info */}
            <div className="w-2/3 text-sm text-gray-700 space-y-2">
              {[
                ["Mã yêu cầu:", requestSelected?.request_id],

                ["Tên khách hàng:", requestSelected?.pick_to?.name],
                ["Số điện thoại:", requestSelected?.pick_to?.phone_number],

                ["Email:", requestSelected?.pick_to?.email],
              ].map(([label, value], index) => (
                <div key={index} className="grid grid-cols-[150px_1fr]">
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
              <div className="grid grid-cols-[150px_1fr]">
                <strong>Địa chỉ</strong>
                <span className="text-sm text-gray-700">
                  {requestSelected?.pick_to?.address?.address}
                  {" ,"}
                  {requestSelected?.pick_to?.address?.ward}
                  {" ,"}
                  {requestSelected?.pick_to?.address?.district}
                  {" ,"}
                  {requestSelected?.pick_to?.address?.province}
                </span>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center">
                <strong>Trạng thái:</strong>
                <span
                  className={`px-3 py-1 rounded-full w-fit items-center ${
                    requestSelected.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : requestSelected.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : requestSelected.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {requestSelected.status === "rejected"
                    ? "Đã từ chối"
                    : requestSelected.status === "pending"
                    ? "Chờ duyệt"
                    : requestSelected.status === "approved"
                    ? "Đã duyệt"
                    : "Chưa liên lạc được"}
                </span>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-start gap-y-2">
                <strong>Giá:</strong>
                <div className="flex flex-col gap-2">
                  {requestSelected?.prices?.map((item: any) => (
                    <div
                      key={item.price_id}
                      className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex justify-between items-center"
                    >
                      <div className="space-x-2">
                        <span>
                          <strong>{item.unit}</strong> –{" "}
                          {item.price.toLocaleString()}₫
                        </span>
                        <span>Giảm giá:{item.discount}%</span>
                      </div>

                      <span className="text-xs text-gray-500">
                        {item.weight} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[150px_1fr] items-start gap-y-2">
                <strong>Danh mục:</strong>
                <div className="flex flex-wrap gap-2 items-center">
                  {requestSelected?.category?.main_category_name && (
                    <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium">
                      {requestSelected.category.main_category_name}
                    </span>
                  )}
                  {requestSelected?.category?.sub_category_name && (
                    <span className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                      {requestSelected.category.sub_category_name}
                    </span>
                  )}
                  {requestSelected?.category?.child_category_name && (
                    <span className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm font-medium">
                      {requestSelected.category.child_category_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section: Upload Image */}
            <div className="w-1/3 flex flex-col items-center">
              <h3 className="text-sm font-semibold mb-2 self-start">
                Hình ảnh
              </h3>

              <div className="border p-2 rounded-lg w-full flex justify-center">
                <img
                  src={requestSelected?.images_primary}
                  alt="Main"
                  className="h-56 object-contain rounded-md"
                />
              </div>

              <div className="flex flex-wrap mt-2 gap-3 w-full">
                {Array.isArray(requestSelected?.images) &&
                  requestSelected.images.map((img: any, idx: number) => (
                    <img
                      key={idx}
                      src={img.images_url}
                      alt={`img-${idx}`}
                      className="object-contain rounded-lg border p-1 h-[84x] w-[84px]"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {requestSelected?.verified_by === "" && (
          <div className="px-6 py-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:scale-105 transition text-sm"
            >
              Duyệt
            </button>

            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 bg-red-100 text-red-800 font-medium rounded-lg hover:bg-red-500 hover:scale-105 transition text-sm"
            >
              Từ chối
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveRequestDialog;
