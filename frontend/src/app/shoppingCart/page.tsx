import React from "react";
import CartItem from "./CartItem";
import OrderSummary from "./orderSumary";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface CartItemData {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
}

const cartItems: CartItemData[] = [
  {
    id: 1,
    name: "Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo 15% bổ thận, chắc xương, bổ dưỡng sức khỏe (6 Lọ x 70ml)",
    price: 236000,
    originalPrice: 295000,
    image:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/8a978f3adc0ea4808b9478c1482cf24c2ccd03e707cae16a8b0f494e5a67be47?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
  {
    id: 2,
    name: "Nước Yến Sào Cao Cấp Đông Trùng Hạ Thảo 15% bổ thận, chắc xương, bổ dưỡng sức khỏe (6 Lọ x 70ml)",
    price: 236000,
    originalPrice: 295000,
    image:
      "https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/8a978f3adc0ea4808b9478c1482cf24c2ccd03e707cae16a8b0f494e5a67be47?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&",
  },
];

const ShoppingCart: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col px-5 pt-32 bg-white pb-[1266px] max-md:py-24">
      {/* Nút quay lại Home */}
      <Link
        href="/home"
        className="absolute left-4 top-[130px] inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Tiếp tục mua sắm</span>
      </Link>
      <div className="mt-6 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[67%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col pt-3 pb-60 mx-auto w-full rounded-xl bg-slate-100 max-md:pb-24 max-md:mt-8 max-md:max-w-full">
              <div className="flex flex-wrap gap-5 justify-between items-start ml-6 max-w-full text-sm text-black w-[662px]">
                <div className="flex gap-2.5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/388b7251b7e148062903bd8e6bbfb7d92eb940c52c17d72896f7ab84c434e2ea?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
                    className="object-contain shrink-0 rounded-full aspect-square w-[18px]"
                    alt=""
                  />
                  <div className="flex gap-1 self-start">
                    <div className="grow">Chọn tất cả</div>
                    <div>(2)</div>
                  </div>
                </div>
                <div className="flex gap-10">
                  <div>Giá thành</div>
                  <div>Số lượng</div>
                  <div>Đơn vị</div>
                </div>
              </div>
              <div className="shrink-0 mt-4 h-px border-2 border-solid border-black border-opacity-10 max-md:max-w-full" />
              {cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>
          </div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
