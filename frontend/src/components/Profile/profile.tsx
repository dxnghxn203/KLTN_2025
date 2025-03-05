import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FiUser } from "react-icons/fi";
import EditProfileDialog from "../Dialog/editProfileDialog";

const PersonalInformation: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở dialog

  const userInfo = [
    { label: "Họ và tên", value: user?.name ?? "" },
    { label: "Email", value: user?.email ?? "" },
    { label: "Số điện thoại", value: "0943640913" },
    { label: "Giới tính", value: "" },
    { label: "Ngày sinh", value: "" },
  ];

  return (
    <div>
      <h2 className="font-semibold">Thông tin cá nhân</h2>
      <div className="bg-[#F5F7F9] h-40 p-6 rounded-lg flex items-center justify-center">
        {user?.image ? (
          <img
            src={user?.image}
            alt={user.name || "User"}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <FiUser className="w-8 h-8 text-[#0053E2]" />
        )}
      </div>
      <div className="space-y-6 px-[200px]">
        {userInfo.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <h2 className="text-black/50">{item.label}</h2>
            <div className="flex items-center gap-x-2">
              <p
                className={
                  !item.value || item.value === "Thêm thông tin"
                    ? "text-[#0053E2] cursor-pointer"
                    : "text-black"
                }
                onClick={() => setIsOpen(true)}
              >
                {item.value || "Thêm thông tin"}
              </p>
              {(!item.value || item.value === "Thêm thông tin") && (
                <span
                  className="text-[#0053E2] cursor-pointer"
                  onClick={() => setIsOpen(true)}
                ></span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center pt-10">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0053E2] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#003da5] transition"
        >
          Chỉnh sửa thông tin
        </button>
      </div>

      {/* Gọi Dialog chỉnh sửa */}
      <EditProfileDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userInfo={userInfo}
      />
    </div>
  );
};

export default PersonalInformation;
