"use client";
import React from "react";
import { AddressFormData } from "../productInfo/types";
import { PiFireTruck } from "react-icons/pi";

interface ShippingAddressProps {
  address: AddressFormData;
  onChange: (address: AddressFormData) => void;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({
  address,
  onChange,
}) => {
  const inputClass =
    "w-full px-5 py-5 rounded-3xl border border-black/10 focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] outline-none placeholder:text-[14px] placeholder:font-normal";

  const buttonClass =
    "flex items-center justify-between flex-1 px-6 py-5 rounded-3xl border border-black/10 focus:border-[#0053E2] bg-white";

  return (
    <section className="flex flex-col gap-4 mt-6">
      <header className="flex gap-2 self-start text-sm text-black">
        <PiFireTruck className="text-2xl text-[#0053E2] mt-[-2px]" />
        <h3>Địa chỉ nhận hàng</h3>
      </header>

      {/* Họ và tên + Số điện thoại (cùng 1 hàng) */}
      <div className="flex gap-5 text-sm">
        <input
          type="text"
          value={address.fullName}
          onChange={(e) => onChange({ ...address, fullName: e.target.value })}
          placeholder="Họ và tên người nhận hàng"
          className={inputClass}
        />
        <input
          type="tel"
          value={address.phone}
          onChange={(e) => onChange({ ...address, phone: e.target.value })}
          placeholder="Số điện thoại"
          className={inputClass}
        />
      </div>

      {/* Chọn tỉnh/thành phố + Chọn quận/huyện */}
      <div className="flex gap-5 text-sm">
        <button className={buttonClass}>
          <span className="text-[14px] font-normal text-[#9CA3AF]">
            Chọn tỉnh/ thành phố
          </span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/c42641fbb9d2d25efb54c01baf92422b1b029d282229366b15196bcbbdeb58c2?placeholderIfAbsent=true"
            alt=""
            className="object-contain shrink-0 w-6 aspect-square ml-auto"
          />
        </button>

        <button className={buttonClass}>
          <span className="text-[14px] font-normal text-[#9CA3AF]">
            Chọn quận/ huyện
          </span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/c42641fbb9d2d25efb54c01baf92422b1b029d282229366b15196bcbbdeb58c2?placeholderIfAbsent=true"
            alt=""
            className="object-contain shrink-0 w-6 aspect-square ml-auto"
          />
        </button>
      </div>

      {/* Chọn phường/xã */}
      <button className={buttonClass}>
        <span className="text-[14px] font-normal text-[#9CA3AF]">
          Chọn phường/ xã
        </span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/c42641fbb9d2d25efb54c01baf92422b1b029d282229366b15196bcbbdeb58c2?placeholderIfAbsent=true"
          alt=""
          className="object-contain shrink-0 w-6 aspect-square ml-auto"
        />
      </button>

      {/* Địa chỉ cụ thể */}
      <input
        type="text"
        value={address.address}
        onChange={(e) => onChange({ ...address, address: e.target.value })}
        placeholder="Địa chỉ cụ thể"
        className={inputClass}
      />

      {/* Ghi chú */}
      <div className="bg-white flex flex-col items-start pt-5 pr-20 pb-12 pl-5 rounded-3xl border border-black/10">
        <label className="text-xs">Ghi chú (không bắt buộc)</label>
        <textarea
          value={address.notes}
          onChange={(e) => onChange({ ...address, notes: e.target.value })}
          placeholder="Ví dụ: Hãy gọi cho tôi 15 phút trước khi giao hàng"
          className="w-full mt-3.5 text-sm bg-transparent outline-none resize-none placeholder:text-[14px] placeholder:font-normal"
        />
      </div>
    </section>
  );
};
