import { useState } from "react";
import {
  OrdererInfo as OrdererInfoType,
  AddressFormData,
} from "@/components/Checkout/ProductInfo/types";
import { OrdererInfo } from "../Checkout/CheckoutInfo/infoDelivery";
import { ShippingAddress } from "../Checkout/CheckoutInfo/shippingAddress";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/providers/toastProvider";

const UpdateLocation = ({
  location,
  default_location,
  getLocation,
  setUpdateLocation,
  setOnAddLocation,
  setLocationUpdate,
}: any) => {
  const [ordererInfo, setOrdererInfo] = useState<OrdererInfoType>({
    fullName: location.name,
    phone: location.phone_number,
    email: location.email,
  });

  const [addressInfo, setAddressInfo] = useState<AddressFormData>({
    fullName: "",
    phone: "",
    email: "",
    city: location.province,
    district: location.district,
    ward: location.ward,
    address: location.address,
    cityCode: location.province_code,
    districtCode: location.district_code,
    wardCode: location.ward_code,
  });
  const [locationDefault, setLocationDefault] = useState(
    default_location == location.location_id
  );
  const [loadingUpdateLocation, setLoadingUpdateLocation] = useState(false);
  const { updateLocation } = useLocation();
  const toast = useToast();
  const handleUpdateLocation = () => {
    setLoadingUpdateLocation(true);
    updateLocation(
      location.location_id,
      {
        name: ordererInfo.fullName,
        phone_number: ordererInfo.phone,
        address: addressInfo.address,
        province: addressInfo.city,
        email: ordererInfo.email,
        province_code: addressInfo.cityCode,
        district_code: addressInfo.districtCode,
        district: addressInfo.district,
        ward: addressInfo.ward,
        ward_code: addressInfo.wardCode,
        is_default: locationDefault,
      },
      () => {
        setLoadingUpdateLocation(false);
        setUpdateLocation(false);
        toast.showToast("Cập nhật địa chỉ thành công", "success");
        getLocation();
      },
      () => {
        setLoadingUpdateLocation(false);
        toast.showToast("Cập nhật địa chỉ thất bại", "error");
      }
    );
  };

  return (
    <>
      <div className="mx-4 text-gray-600">
        <OrdererInfo info={ordererInfo} onChange={setOrdererInfo} />
        <ShippingAddress address={addressInfo} onChange={setAddressInfo} />
        <div className="flex items-center justify-start mt-4 ml-2 gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 accent-[#1E4DB7]"
            checked={locationDefault}
            onChange={(e) => {
              setLocationDefault(e.target.checked);
            }}
          />
          <span className="text-sm text-gray-500">
            Đặt làm địa chỉ mặc định
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-4 mx-4">
        <button
          className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-semibold py-2 px-6 rounded-lg"
          onClick={() => {
            setOnAddLocation(false);
            setUpdateLocation(false);
            setLocationUpdate(null);
          }}
        >
          Trở về
        </button>
        <button
          className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#002E99]"
          onClick={() => {
            handleUpdateLocation();
          }}
          type="button"
          disabled={loadingUpdateLocation}
        >
          {loadingUpdateLocation ? "Đang xử lý..." : "Cập nhật"}
        </button>
      </div>
    </>
  );
};

export default UpdateLocation;
