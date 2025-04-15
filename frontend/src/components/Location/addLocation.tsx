import { useState } from "react";
import { OrdererInfo } from "../Checkout/CheckoutInfo/infoDelivery";
import { ShippingAddress } from "../Checkout/CheckoutInfo/shippingAddress";

import {
  OrdererInfo as OrdererInfoType,
  AddressFormData,
} from "@/components/Checkout/ProductInfo/types";
import { useToast } from "@/providers/toastProvider";
import { useLocation } from "@/hooks/useLocation";

const AddLocation = ({
  getLocation,
  setOnAddLocation,
}: {
  getLocation: any;
  setOnAddLocation: any;
}) => {
  const [ordererInfo, setOrdererInfo] = useState<OrdererInfoType>({
    fullName: "",
    phone: "",
    email: "",
  });

  const [addressInfo, setAddressInfo] = useState<AddressFormData>({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    cityCode: "",
    districtCode: "",
    wardCode: "",
  });
  const toast = useToast();
  const { addLocation } = useLocation();

  const resetData = () => {
    setOrdererInfo({
      fullName: "",
      phone: "",
      email: "",
    });
    setAddressInfo({
      fullName: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      ward: "",
      address: "",
      cityCode: "",
      districtCode: "",
      wardCode: "",
    });
  };
  const [loadingAddLocation, setLoadingAddLocation] = useState(false);
  const handleAddLocation = () => {
    setLoadingAddLocation(true);
    addLocation(
      {
        name: ordererInfo.fullName,
        phone_number: ordererInfo.phone,
        address: addressInfo.address,
        province: addressInfo.city,
        province_code: addressInfo.cityCode,
        district_code: addressInfo.districtCode,
        district: addressInfo.district,
        ward: addressInfo.ward,
        ward_code: addressInfo.wardCode,
        is_default: locationDefault,
      },
      () => {
        setLoadingAddLocation(false);
        toast.showToast("Thêm địa chỉ thành công", "success");
        getLocation();
        setOnAddLocation(false);
        resetData();
      },
      () => {
        setLoadingAddLocation(false);
        toast.showToast("Thêm địa chỉ thất bại", "error");
      }
    );
  };
  const [locationDefault, setLocationDefault] = useState<any | null>(null);

  return (
    <>
      <div className="text-gray-600 mt-3 mx-4">
        <OrdererInfo info={ordererInfo} onChange={setOrdererInfo} />
        <ShippingAddress address={addressInfo} onChange={setAddressInfo} />
        <div className="flex items-center justify-start mt-4 ml-2 gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            checked={locationDefault}
            onChange={(e) => {
              setLocationDefault(e.target.checked);
            }}
          />
          <span className="text-sm font-semibold text-gray-700">
            Đặt làm địa chỉ mặc định
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center py-0">

        <button
          className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"
          onClick={() => {
            handleAddLocation();
          }}
          disabled={loadingAddLocation}
        >
          {loadingAddLocation ? "Đang xử lý..." : "Thêm địa chỉ"}
        </button>
      </div>
    </>
  );
};

export default AddLocation;
