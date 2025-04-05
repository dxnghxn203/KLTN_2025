import { useState } from "react";
import {
    OrdererInfo as OrdererInfoType,
    AddressFormData,
} from "@/components/Checkout/ProductInfo/types";
import { OrdererInfo } from "../Checkout/CheckoutInfo/infoDelivery";
import { ShippingAddress } from "../Checkout/CheckoutInfo/shippingAddress";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/providers/toastProvider";

const UpdateLocation = ({ location, default_location, getLocation, setUpdateLocation }: any) => {

    const [ordererInfo, setOrdererInfo] = useState<OrdererInfoType>({
        fullName: location.name,
        phone: location.phone_number,
        email: "",
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
        wardCode: location.ward_code
    });
    const [locationDefault, setLocationDefault] = useState(default_location == location.location_id);
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
                province_code: addressInfo.cityCode,
                district_code: addressInfo.districtCode,
                district: addressInfo.district,
                ward: addressInfo.ward,
                ward_code: addressInfo.wardCode,
                is_default: locationDefault
            },
            () => {
                setLoadingUpdateLocation(false);
                setUpdateLocation(false);
                toast.showToast("Cập nhật địa chỉ thành công", "success");
                getLocation()
            },
            () => {
                setLoadingUpdateLocation(false);
                toast.showToast("Cập nhật địa chỉ thất bại", "error");
            }
        )
    }


    return (
        <>
            <div className="mx-2 text-gray-600 pr-2 mt-2">
                <OrdererInfo
                    info={ordererInfo}
                    onChange={setOrdererInfo}
                />
                <ShippingAddress
                    address={addressInfo}
                    onChange={setAddressInfo}
                />
                <div className="flex items-center justify-start mt-4 ml-2 gap-2">
                    <span className="text-sm font-semibold text-gray-700">Địa chỉ mặc định</span>
                    <input
                        type="checkbox"
                        className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        checked={locationDefault}
                        onChange={(e) => {
                            setLocationDefault(e.target.checked)
                        }
                        }
                    />
                </div>
            </div>
            <div className="flex items-center justify-center py-0">
                <button
                    className="px-16 py-2 my-2 ml-2.5 max-w-full text-base font-bold text-white bg-blue-700 rounded-3xl w-[337px] max-md:px-5 hover:bg-[#002E99]"
                    onClick={() => {
                        handleUpdateLocation()
                    }}
                    disabled={loadingUpdateLocation}
                >
                    {loadingUpdateLocation ? "Đang xử lý..." : "Cập nhật địa chỉ"}
                </button>
            </div>
        </>
    )
}

export default UpdateLocation;