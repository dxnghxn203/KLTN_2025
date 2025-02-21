"use client";
import Image from "next/image";
import delivery from "../../../images/c.png";

export default function LocationDelivery() {
  return (
    <div className="flex items-center p-2 w-fit bg-[#002E99] rounded-full w-[430px] h-[48px]">
      {/* Icon vị trí */}
      <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center bg-[#D3EFF8]">
        <Image
          src={delivery}
          alt="Delivery icon"
          width={30}
          height={30}
          className="object-cover"
        />
      </div>
      {/* Nội dung */}
      <div className="flex flex-col ml-2">
        <span className="text-sm text-white">Giao đến</span>
        <span className="text-sm text-white">
          1234 đường số 11, phường Bình ...
        </span>
      </div>
    </div>
  );
}
