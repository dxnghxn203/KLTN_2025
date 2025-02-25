"use client";
import React from "react";

type PaymentType = "cash" | "qr" | "bank";

interface PaymentMethodProps {
  selected: PaymentType;
  onSelect: (method: PaymentType) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selected,
  onSelect,
}) => {
  const methods = [
    {
      type: "cash",
      label: "Thanh toán tiền mặt khi nhận hàng",
      icon: "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/c45480d681035faa4f9b86501e16701cdb31af935aacbb052f6225c8ee6448b7?placeholderIfAbsent=true",
    },
    {
      type: "qr",
      label: "Thanh toán bằng chuyển khoản (QR Code)",
      icon: "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/ef2a528bd3ff354fc1498a931df4f4010b4ef9f868879479a670ea309caca048?placeholderIfAbsent=true",
    },
    {
      type: "bank",
      label: "Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng",
      icon: "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/fdc877a8a44a0135f2a37d6f510531e5f4bdfedae3585bdc2de05b8af6098c4f?placeholderIfAbsent=true",
    },
  ];

  return (
    <section className="flex flex-col items-start max-w-full rounded-xl bg-[#F5F7F9] w-[800px]">
      {methods.map((method, index) => (
        <React.Fragment key={method.type}>
          <button
            onClick={() => onSelect(method.type as PaymentType)}
            className="flex gap-3 items-center w-full px-8 py-6 hover:bg-[#F5F7F9] rounded transition"
          >
            {selected === method.type ? (
              <img
                src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/388b7251b7e148062903bd8e6bbfb7d92eb940c52c17d72896f7ab84c434e2ea?placeholderIfAbsent=true"
                alt=""
                className="w-[18px] h-[18px] rounded-full"
              />
            ) : (
              <div className="w-[18px] h-[18px] rounded-full border-2 border-black border-opacity-50" />
            )}
            <img
              src={method.icon}
              alt=""
              className="w-[35px] h-[35px] rounded-md"
            />
            <span className="text-sm text-black">{method.label}</span>
          </button>
          {index < methods.length - 1 && (
            <div className="self-stretch border border-black border-opacity-10" />
          )}
        </React.Fragment>
      ))}
    </section>
  );
};
