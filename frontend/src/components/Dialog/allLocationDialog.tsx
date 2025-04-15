import { useState } from "react";
import { IoChevronBack, IoCloseOutline } from "react-icons/io5";
import AddLocation from "../Location/addLocation";
import ListLocation from "../Location/listLocation";
import UpdateLocation from "../Location/updateLocation";

const AllLocationDialog = ({
  allLocation,
  closeDialog,
  getLocation,
  selectedLocation,
  setSelectedLocation,
}: {
  allLocation: any;
  closeDialog: any;
  selectedLocation: any;
  getLocation: any;
  setSelectedLocation: any;
}) => {
  const [onAddLocation, setOnAddLocation] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);
  const [locationUpdate, setLocationUpdate] = useState<any>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-[600px] shadow-lg overflow-hidden relative h-[95vh]">
        <div className="rounded-t-lg flex items-center justify-center relative p-4 z-10 bg-white">
          <div className="absolute top-2 right-2">
            <button
              onClick={() => {
                closeDialog(false);
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
            className={`absolute top-0 left-0 w-full h-full transition-all duration-500 transform ${
              onAddLocation || updateLocation
                ? "-translate-x-full"
                : "translate-x-0"
            }`}
          >
            <ListLocation
              allLocation={allLocation}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              setOnAddLocation={setOnAddLocation}
              setSelectedLocationUpdate={setLocationUpdate}
              setOnUpdateLocation={setUpdateLocation}
              closeDialog={closeDialog}
            />
          </div>
          <div
            className={`absolute top-0 left-0 w-full h-full transition-all duration-500 transform ${
              onAddLocation || updateLocation
                ? "translate-x-0"
                : "translate-x-full"
            }`}
          >
            <button
              onClick={() => {
                setOnAddLocation(false);
                setUpdateLocation(false);
                setLocationUpdate(null);
              }}
              className="pl-2 text-gray-600 w-full bg-black/5 h-10 flex items-center justify-between text-[#0053E2]"
            >
              <IoChevronBack className=" text-lg" />
            </button>
            <div className="overflow-y-scroll max-h-[550px] space-y-4 ">
              {onAddLocation && !updateLocation && (
                <AddLocation
                  getLocation={getLocation}
                  setOnAddLocation={setOnAddLocation}
                />
              )}
              {updateLocation && !onAddLocation && (
                <UpdateLocation
                  location={locationUpdate}
                  default_location={allLocation?.default_location}
                  getLocation={getLocation}
                  setUpdateLocation={setUpdateLocation}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLocationDialog;
