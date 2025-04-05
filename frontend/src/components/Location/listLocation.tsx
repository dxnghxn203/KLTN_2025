import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoChevronForward } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";


const ListLocation = ({
    allLocation, 
    selectedLocation, 
    setSelectedLocation, 
    setOnAddLocation,
    setSelectedLocationUpdate,
    setOnUpdateLocation
    
}: any) => {
    
    return (
        <>
            <div className="pl-6 text-gray-600 w-full bg-black/5 h-10 flex items-center justify-between">
                Danh sách địa chỉ
            </div>
            <div className="overflow-y-scroll max-h-[550px] space-y-4 pt-2">
                {allLocation && allLocation.locations.map((location: any, index: any) => (
                    <div key={location.location_id} className="w-full">
                        <div
                            className="flex flex-col w-full py-2 cursor-pointer px-6"
                            onClick={() => {
                                setSelectedLocation(location)
                            }}
                        >
                            <div className="flex items-center justify-between ">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`select-pharmacy-${location.location_id}`}
                                        checked={selectedLocation?.location_id === location.location_id}
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
                                    {
                                        location?.location_id === allLocation.default_location && (
                                            <span className="ml-2 text-xs text-[#0053E2] font-medium">
                                                (Địa chỉ mặc định)
                                            </span>
                                        )
                                    }

                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedLocationUpdate(location)
                                        setOnUpdateLocation(true)
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

                <div className="flex items-center justify-center">
                    <button
                        className="flex items-center px-6 justify-center w-full text-[#0053E2] py-2 rounded-lg transition"
                        onClick={() => setOnAddLocation(true)}
                    >
                        <IoIosAddCircleOutline className="ml-2 text-[#0053E2] text-lg" />
                        Thêm địa chỉ mới
                    </button>
                </div>
            </div>
        </>
    );
}
export default ListLocation;