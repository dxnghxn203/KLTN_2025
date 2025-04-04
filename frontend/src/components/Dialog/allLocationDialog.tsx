import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoChevronBack, IoChevronForward, IoCloseOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { OrdererInfo } from "../Checkout/CheckoutInfo/infoDelivery";
import { ShippingAddress } from "../Checkout/CheckoutInfo/shippingAddress";
import {
    OrdererInfo as OrdererInfoType,
    AddressFormData,
} from "@/components/Checkout/ProductInfo/types";
import { useLocation } from "@/hooks/useLocation";
import { useToast } from "@/providers/toastProvider";

const AllLocationDialog = ({ allLocation, closeDialog, getLocation }: {
    allLocation: any
    closeDialog: any
    getLocation: any
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
    const [loadingAddLocation, setLoadingAddLocation] = useState(false);

    const [onAddLocation, setOnAddLocation] = useState(false);
    const { addLocation, updateLocation } = useLocation();
    const [isUpdate, setIsUpdate] = useState(false);
    const [locationSelected, setLocationSelected] = useState<any>(null);
    const [locationSelectedUpdateId, setLocationSelectedUpdateId] = useState<any>(null);

    const toast = useToast();

    const setInfFromLocation = (location: any) => {
        setOrdererInfo({
            fullName: location.name,
            phone: location.phone_number,
            email: "",
        });

        setAddressInfo({
            fullName: location.name,
            phone: location.phone_number,
            email: "",
            city: location.province,
            district: location.district,
            ward: location.ward,
            address: location.address,
            cityCode: location.province_code,
            districtCode: location.district_code,
            wardCode: location.ward_code,
        });
        setIsUpdate(true);
        setOnAddLocation(true);
    };

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
            },
            () => {
                setLoadingAddLocation(false);
                setOnAddLocation(false);
                toast.showToast("Thêm địa chỉ thành công", "success");
                getLocation()
            },
            () => {
                setLoadingAddLocation(false);
                toast.showToast("Thêm địa chỉ thất bại", "error");
            }
        )
    };

    const handleUpdateLocation = () => {
        setLoadingAddLocation(true);
        updateLocation(
            locationSelectedUpdateId,
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
            },
            () => {
                setLoadingAddLocation(false);
                setOnAddLocation(false);
                toast.showToast("Cập nhật địa chỉ thành công", "success");
                getLocation()
            },
            () => {
                setLoadingAddLocation(false);
                toast.showToast("Cập nhật địa chỉ thất bại", "error");
            }
        )
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg w-[630px] shadow-lg overflow-hidden relative h-[600px]">
                <div className="rounded-t-lg flex items-center justify-center relative p-4 z-10 bg-white">
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={() => {
                                closeDialog(false)
                            }}
                            className="text-gray-500 hover:text-black"
                        >
                            <IoCloseOutline size={24} />
                        </button>
                    </div>
                    <div className="text-xl text-black">Chọn địa chỉ nhận hàng</div>
                </div>

                <div className="relative w-full h-full overflow-hidden">
                    <div
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-500 transform ${onAddLocation ? "-translate-x-full" : "translate-x-0"
                            }`}
                    >
                        <div className="pl-6 text-gray-600 w-full bg-black/5 h-10 flex items-center justify-between">
                            Danh sách địa chỉ
                        </div>
                        <div className="overflow-y-scroll max-h-[550px] space-y-4 pt-2">
                            {allLocation && allLocation.map((location: any, index: any) => (
                                <div key={location.location_id} className="w-full">
                                    <div
                                        className="flex flex-col w-full py-2 cursor-pointer px-6"
                                        onClick={() => {
                                            setLocationSelected(location)
                                        }}
                                    >
                                        <div className="flex items-center justify-between ">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`select-pharmacy-${location.location_id}`}
                                                    checked={locationSelected?.location_id === location.location_id}
                                                    className="peer hidden"
                                                />
                                                <label
                                                    htmlFor={`select-pharmacy-${location.location_id}`}
                                                    className="w-5 h-5 text-transparent peer-checked:text-white border border-gray-400 rounded-full flex items-center justify-center peer-checked:bg-[#0053E2] peer-checked:border-[#0053E2]"
                                                >
                                                    &#10003;
                                                </label>

                                                <span className="ml-2 py-1 text-[14px] font-medium text-black rounded-full">
                                                    {location?.name}
                                                </span>

                                                <div className="w-[1px] h-4 bg-gray-300 mx-2"></div>
                                                <span className="text-[14px] font-medium text-black/70">
                                                    {location?.phone_number}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setInfFromLocation(location);
                                                    setLocationSelectedUpdateId(location.location_id);
                                                }}
                                                className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-sm transition">
                                                Chỉnh sửa
                                                <IoChevronForward className="mr-1 text-[#0053E2] text-lg" />
                                            </button>
                                        </div>
                                        <div className="flex items-center text-xs text-black/50 ml-6 pt-2">
                                            <SlLocationPin className="text-base text-[#0053E2] mr-1" />
                                            <span>
                                                {location?.address}, {location?.ward}, {location?.district}, {location?.province}
                                            </span>
                                        </div>
                                    </div>
                                    <hr className="mx-10 border-t border-gray-300" />
                                </div>
                            ))}

                            <div className="flex items-center justify-center px-6">
                                <button
                                    className="flex items-center px-6 justify-center w-full text-[#0053E2] py-2 rounded-lg transition"
                                    onClick={() => setOnAddLocation(true)}
                                >
                                    <IoIosAddCircleOutline className="ml-2 text-[#0053E2] text-lg" />
                                    Thêm địa chỉ mới
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-500 transform ${onAddLocation ? "translate-x-0" : "translate-x-full"
                            }`}
                    >
                        <button
                            onClick={() => {
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
                                })
                                setOnAddLocation(false)
                            }}
                            className="pl-2 text-gray-600 w-full bg-black/5 h-10 flex items-center justify-between text-[#0053E2]"
                        >
                            <IoChevronBack className=" text-lg" />
                        </button>
                        <div className="overflow-y-scroll max-h-[550px] space-y-4 ">
                            <div className="mx-2 text-gray-600 pr-2 mt-2">
                                <OrdererInfo
                                    info={ordererInfo}
                                    onChange={setOrdererInfo}
                                />
                                <ShippingAddress
                                    address={addressInfo}
                                    onChange={setAddressInfo}
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                {
                                    loadingAddLocation ? (
                                        <>
                                            <button
                                                className="px-16 py-4 mt-2 ml-2.5 max-w-full text-base font-bold text-white bg-blue-700 rounded-3xl w-[337px] max-md:px-5 hover:bg-[#002E99]"
                                                disabled
                                            >
                                                <IoIosAddCircleOutline className="animate-spin mr-2" />
                                                Đang xử lý...
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="px-16 py-4 mt-2 ml-2.5 max-w-full text-base font-bold text-white bg-blue-700 rounded-3xl w-[337px] max-md:px-5 hover:bg-[#002E99]"
                                            onClick={() => {
                                                isUpdate ? handleUpdateLocation() : handleAddLocation()
                                            }}
                                        >
                                            Lưu địa chỉ
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AllLocationDialog;