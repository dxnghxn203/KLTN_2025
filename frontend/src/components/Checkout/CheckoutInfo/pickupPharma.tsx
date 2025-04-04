"use client";
import React, { use, useEffect, useState } from "react";
import { DeliveryMethod } from "./deliveryMethod";
import { OrdererInfo } from "@/components/Checkout/CheckoutInfo/infoDelivery";
import { OrdererInfoPickup } from "./orderPickupPharma";
import { ShippingAddress } from "@/components/Checkout/CheckoutInfo/shippingAddress";
import { PaymentMethod } from "./paymentMethod";
import { Toggle } from "@/components/toggle/toggle";
import { FaTruckFast } from "react-icons/fa6";
import {
  OrdererInfo as OrdererInfoType,
  AddressFormData,
} from "../ProductInfo/types";
import { PharmaInfo } from "./pharmaInfo";
import ReceiveDialog from "@/components/Dialog/receiveDialog";
import { PAYMENT_COD } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import LocationCheckout from "../locationCheckout";

interface DeliveryProps {
  setData: (data: any) => void;
}

const Delivery: React.FC<DeliveryProps> = ({ setData }) => {
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery"
  );


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
    notes: "",
    cityCode: "",
    districtCode: "",
    wardCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<any>(PAYMENT_COD);

  useEffect(() => {
    setData({ ordererInfo, addressInfo, deliveryMethod, paymentMethod });
  }
    , [ordererInfo, addressInfo, deliveryMethod, paymentMethod]);

  const [requireInvoice, setRequireInvoice] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [dataLocation, setDataLocation] = useState<any | null>(null);

  const { isAuthenticated } = useAuth();
  return (
    <main className="flex overflow-hidden flex-col pt-7">
      <DeliveryMethod
        selectedMethod={deliveryMethod}
        onMethodChange={setDeliveryMethod}
      />

      <div className="flex flex-col px-5 py-6 mt-5 font-medium text-black rounded-xl bg-[#F5F7F9]">
        {/* {deliveryMethod === "delivery" ? (
          <>
            <OrdererInfo info={ordererInfo} onChange={setOrdererInfo} />
            <ShippingAddress address={addressInfo} onChange={setAddressInfo} />
          </>
        ) : (
          <>
            <OrdererInfoPickup info={ordererInfo} onChange={setOrdererInfo} />
            <PharmaInfo />
          </>
        )} */}

        {
          isAuthenticated ?  (
            <>
              <LocationCheckout setDataLocation={setDataLocation}/>
            </>
          ):(
            <>
              <OrdererInfo info={ordererInfo} onChange={setOrdererInfo} />
              <ShippingAddress address={addressInfo} onChange={setAddressInfo} />
            </>
          )
        }
      </div>
      {/* {deliveryMethod === "pickup" && (
        <div className="flex items-center justify-between px-6 py-3 mt-1.5 rounded-xl bg-[#F5F7F9] max-md:px-5 min-w-0">
          <p className="text-sm font-medium text-black/50 whitespace-nowrap flex items-center gap-2 py-1">
            <FaTruckFast size={16} className="text-[#0053E2]" />
            Thời gian nhận hàng dự kiến
            <p className="text-sm font-medium text-black">
              Từ 13:00 - 14:00 Hôm nay, 19/02/2025
            </p>
          </p>
          <p
            className="text-sm font-medium text-[#0053E2] whitespace-nowrap flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            Thay đổi
          </p>
        </div>
      )} */}
      <div className="flex items-center justify-between px-6 py-3 mt-1.5 rounded-xl bg-[#F5F7F9] max-md:px-5 min-w-0">
        <p className="text-sm font-medium text-black whitespace-nowrap">
          Yêu cầu xuất hóa đơn điện tử
        </p>
        <Toggle isActive={requireInvoice} onChange={setRequireInvoice} />
      </div>

      <h2 className="my-6 text-sm font-medium text-black">
        Chọn phương thức thanh toán
      </h2>
      <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
      {isDialogOpen && <ReceiveDialog onClose={() => setIsDialogOpen(false)} />}
    </main>
  );
};

export default Delivery;
