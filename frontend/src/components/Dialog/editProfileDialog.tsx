"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: { label: string; value: string; type?: string }[];
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  isOpen,
  onClose,
  userInfo,
}) => {
  const [formData, setFormData] = useState(
    Object.fromEntries(userInfo.map((item) => [item.label, item.value]))
  );

  const handleChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg relative w-[450px] shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-center">
          Chỉnh sửa thông tin
        </h2>

        <div className="space-y-4">
          {userInfo
            .filter((item) => !["Giới tính", "Ngày sinh"].includes(item.label))
            .map((item, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <label className="text-sm font-semibold">{item.label}</label>
                <input
                  type={item.type || "text"}
                  value={formData[item.label]}
                  onChange={(e) => handleChange(item.label, e.target.value)}
                  className="px-4 py-4 rounded-3xl outline-none border border-gray-300 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none"
                />
              </div>
            ))}
          {userInfo.some((item) => item.label === "Giới tính") && (
            <div className="flex gap-4">
              {/* Giới tính */}
              <div className="flex flex-col w-1/2 space-y-2">
                <label className="text-sm font-semibold">Giới tính</label>
                <select
                  value={formData["Giới tính"]}
                  onChange={(e) => handleChange("Giới tính", e.target.value)}
                  className="px-4 py-4 rounded-3xl outline-none border border-gray-300 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              {/* Ngày sinh */}
              <div className="flex flex-col w-1/2 space-y-2">
                <label className="text-sm font-semibold">Ngày sinh</label>
                <input
                  type="date"
                  value={formData["Ngày sinh"]}
                  onChange={(e) => handleChange("Ngày sinh", e.target.value)}
                  className="px-4 py-4 rounded-3xl outline-none border border-gray-300 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-[#EAEFFA] text-[#0053E2] font-semibold w-[140px] py-3 rounded-full"
          >
            Hủy
          </button>
          <button className="bg-[#0053E2] text-white font-semibold w-[140px] py-3 rounded-full hover:bg-blue-700">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDialog;
