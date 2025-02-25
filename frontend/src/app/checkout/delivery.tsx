"use client";
import React, { useState } from "react";
import { DeliveryMethod } from "./deliveryMethod";
import { OrdererInfo } from "./orderInfo";
import { ShippingAddress } from "./shippingAddress";
import { PaymentMethod } from "./paymentMethod";
import { Toggle } from "./Toggle";
import { OrdererInfo as OrdererInfoType, AddressFormData } from "./types";

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

  return (
    <main className="flex overflow-hidden px-4 flex-col pt-7">
      <DeliveryMethod
        selectedMethod={deliveryMethod}
        onMethodChange={setDeliveryMethod}
      />

      <div className="flex flex-col px-5 py-6 mt-5 font-medium text-black rounded-xl bg-[#F5F7F9]">
        <OrdererInfo info={ordererInfo} onChange={setOrdererInfo} />
        <ShippingAddress address={addressInfo} onChange={setAddressInfo} />
      </div>

      <div className="flex items-center justify-between px-6 py-3 mt-1.5 max-w-full rounded-xl bg-[#F5F7F9] w-[800px] max-md:px-5 min-w-0">
        <p className="text-sm font-medium text-black whitespace-nowrap">
          Yêu cầu xuất hóa đơn điện tử
        </p>
        <Toggle isActive={requireInvoice} onChange={setRequireInvoice} />
      </div>

      <h2 className="my-6 text-sm font-medium text-black">
        Chọn phương thức thanh toán
      </h2>

      <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
    </main>
  );
};

export default Delivery;
