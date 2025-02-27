"use client";
import React, { useState } from "react";
import { DeliveryMethod } from "./deliveryMethod";
import { OrdererInfo } from "@/app/checkout/checkoutInfo/delivery/orderInfo";
import { OrdererInfoPickup } from "./pickupPharma/orderInfo";
import { ShippingAddress } from "@/app/checkout/checkoutInfo/delivery/shippingAddress";
import { PaymentMethod } from "./paymentMethod";
import { Toggle } from "@/components/toggle/toggle";
import { FaTruckFast } from "react-icons/fa6";
import {
  OrdererInfo as OrdererInfoType,
  AddressFormData,
} from "../productInfo/types";
import { PharmaInfo } from "./pickupPharma/pharmaInfo";
import ReceiveDialog from "@/components/dialog/receiveDialog/receiveDialog";

const Delivery: React.FC = () => {
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
    province: "",
    district: "",
    ward: "",
    address: "",
    notes: "",
  });
  const [requireInvoice, setRequireInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qr" | "bank">(
    "cash"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <main className="flex overflow-hidden flex-col pt-7">
      <DeliveryMethod
        selectedMethod={deliveryMethod}
        onMethodChange={setDeliveryMethod}
      />

      <div className="flex flex-col px-5 py-6 mt-5 font-medium text-black rounded-xl bg-[#F5F7F9]">
        {deliveryMethod === "delivery" ? (
          <>
            <OrdererInfo info={ordererInfo} onChange={setOrdererInfo} />
            <ShippingAddress address={addressInfo} onChange={setAddressInfo} />
          </>
        ) : (
          <>
            <OrdererInfoPickup info={ordererInfo} onChange={setOrdererInfo} />
            <PharmaInfo />
          </>
        )}
      </div>
      {deliveryMethod === "pickup" && (
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
      )}
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
