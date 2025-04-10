import { useLocation } from "@/hooks/useLocation";
import { use, useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoChevronForward, IoCloseCircle, IoCloseOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import AllLocationDialog from "../Dialog/allLocationDialog";
import { getLocationDefault } from "@/utils/location";

const LocationCheckout = ({ setDataLocation, setNote }: { setDataLocation: (data: any) => void,  setNote: (data: any)=> void}) => {
    const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
    const { allLocation, getAllLocation } = useLocation();
    const [loadingGetLocation, setLoadingGetLocation] = useState(false);
    const [openModalLocation, setOpenModalLocation] = useState(false);


    const getLocation = () => {
        setLoadingGetLocation(true);
        getAllLocation(
            () => {
                setLoadingGetLocation(false);
                const location_default= getLocationDefault(allLocation?.default_location, allLocation?.locations)
                setDataLocation(location_default);
                setSelectedLocation(location_default);
            },
            () => {
                setLoadingGetLocation(false);
            }
        );
    }

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <section className="flex flex-col gap-4 mt-6">
            <header className="flex gap-2 self-start text-sm text-black">
                <HiOutlineUserCircle className="text-2xl text-[#0053E2] mt-[-2px]" />
                <h3>Thông tin người đặt</h3>
            </header>

            {
                allLocation &&  allLocation.locations && allLocation.locations.length > 0 ? (
                    <>
                        {selectedLocation ? (
                            <>
                                <div className="flex items-center justify-between ml-6 ">
                                    <div className="flex items-center">
                                        <span className="py-1 text-[14px] font-medium text-black rounded-full">
                                            {selectedLocation?.name}
                                        </span>

                                        <div className="w-[1px] h-4 bg-gray-300 mx-2"></div>
                                        <span className="text-[14px] font-medium text-black/50">
                                            {selectedLocation?.phone_number}
                                        </span>
                                    </div>
                                    <button
                                        className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-[14px] transition"
                                        onClick={
                                            (e) => {
                                                setOpenModalLocation(true);
                                            }}
                                    >
                                        Thay đổi
                                        < IoChevronForward className="mr-1 text-[#0053E2] text-lg" />
                                    </button>
                                </div>
                                <div className="flex items-center text-xs text-black/50 ml-6 pt-2">
                                    <SlLocationPin className="text-base text-black/50 mr-1" />
                                    <span>
                                        {selectedLocation?.address}, {selectedLocation?.ward}, {selectedLocation?.district}, {selectedLocation?.province}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-between ml-6">
                                <div className="flex items-center gap-2">
                                    <FaLocationDot className="text-[#0053E2] animate-pulse" />
                                    <span className="py-1 text-[14px] font-medium text-black/70">
                                        Đang tải địa chỉ...
                                    </span>
                                </div>
                                <button
                                    className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-[14px] transition"
                                    onClick={(e) => {
                                        setOpenModalLocation(true);
                                    }}
                                >
                                    Chọn địa chỉ
                                    <IoChevronForward className="ml-1 text-[#0053E2] text-lg" />
                                </button>
                            </div>
                        )
                        }
                    </>
                ) : (
                    <div className="flex items-center justify-between ml-6 ">
                        <div className="flex items-center">
                            <span className="py-1 text-[14px] font-medium text-black rounded-full">
                                Chưa có địa chỉ
                            </span>
                        </div>
                        <button
                            className="flex items-center justify-center text-[#0053E2] px-3 py-1 rounded-full text-[14px] transition"
                            onClick={
                                (e) => {
                                    setOpenModalLocation(true);
                                }}
                        >
                            Thêm địa chỉ
                            < IoChevronForward className="mr-1 text-[#0053E2] text-lg" />
                        </button>
                    </div>
                )
            }
            <div className="bg-white flex flex-col items-start pt-5 pr-20 pb-12 pl-5 rounded-3xl border border-black/10">
                <label className="text-xs">Ghi chú (không bắt buộc)</label>
                <textarea
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Hãy gọi cho tôi 15 phút trước khi giao hàng"
                    className="w-full mt-3.5 text-sm bg-transparent outline-none resize-none placeholder:text-[14px] placeholder:font-normal"
                />
            </div>

            {
                openModalLocation && (
                    <AllLocationDialog
                        allLocation={allLocation}
                        closeDialog={setOpenModalLocation}
                        getLocation={getLocation}
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                    />
                )
            }
        </section>
    );
}
export default LocationCheckout;