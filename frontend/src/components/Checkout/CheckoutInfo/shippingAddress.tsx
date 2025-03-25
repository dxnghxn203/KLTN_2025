"use client";
import React, { useEffect } from "react";
import { AddressFormData } from "../ProductInfo/types";
import { PiFireTruck } from "react-icons/pi";
import { useLocation } from "@/hooks/useLocation";

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
    "flex items-center justify-between flex-1 px-6 py-5 rounded-3xl border border-black/10 focus:border-[#0053E2] bg-white focus:ring-1 focus:ring-[#0053E2] outline-none";


  const { cities, districts, wards, getDistrictsByCityId, getCities, getWardsByDistrictId } = useLocation();

  useEffect(() => {
    getCities();
  }, []);
  
  return (
    <section className="flex flex-col gap-4 mt-6">
      <header className="flex gap-2 self-start text-sm text-black">
        <PiFireTruck className="text-2xl text-[#0053E2] mt-[-2px]" />
        <h3>Địa chỉ nhận hàng</h3>
      </header>

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

      <div className="flex gap-5 text-sm">
        <div className="relative flex-1">
          <select
            value={address.cityCode || ""}
            onChange={(e) => {
              const cityCode = Number(e.target.value);
              console.log(e.target.selectedOptions[0].text);
              onChange({ ...address, city: e.target.selectedOptions[0].text, cityCode: cityCode });
              if (cityCode) getDistrictsByCityId(cityCode.toString());
            }}
            className={`${buttonClass} appearance-none`}
          >
            <option value="" disabled>Chọn tỉnh/ thành phố</option>
            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1" >
          <select
            value={address.districtCode || ""}
            onChange={(e) => {
              const districtCode = Number(e.target.value);
              onChange({ ...address, district: e.target.selectedOptions[0].text, districtCode: districtCode });
              if (districtCode) getWardsByDistrictId(districtCode.toString());
            }}
            disabled={!address.city || districts.length === 0}
            className={`${buttonClass} appearance-none`}
          >
            <option value="" disabled>Chọn quận/ huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1">
          <select
            value={address.wardCode || ""}
            onChange={(e) => {
              const wardCode = Number(e.target.value);
              onChange({ ...address, ward: e.target.selectedOptions[0].text, wardCode: wardCode });
            }}
            disabled={!address.district || wards.length === 0}
            className={`${buttonClass} appearance-none`}
          >
            <option value="" disabled>Chọn phường/ xã</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
      </div>

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
