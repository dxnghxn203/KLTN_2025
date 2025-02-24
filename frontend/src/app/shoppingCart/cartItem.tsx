import React from "react";

interface CartItemProps {
  name: string;
  price: number;
  originalPrice: number;
  image: string;
}

const CartItem: React.FC<CartItemProps> = ({
  name,
  price,
  originalPrice,
  image,
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-5 justify-between items-center mt-4 mr-7 ml-6 max-md:mr-2.5 max-md:max-w-full">
        <div className="flex gap-4 self-stretch">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/388b7251b7e148062903bd8e6bbfb7d92eb940c52c17d72896f7ab84c434e2ea?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
            className="object-contain shrink-0 my-auto rounded-full aspect-square w-[18px]"
            alt=""
          />
          <div className="flex flex-col justify-center px-2 py-2 rounded-lg border border-solid border-stone-300">
            <img
              loading="lazy"
              src={image}
              className="object-contain aspect-square w-[47px]"
              alt={name}
            />
          </div>
          <div className="text-sm text-black basis-auto">{name}</div>
        </div>
        <div className="flex gap-5 items-start self-stretch my-auto whitespace-nowrap">
          <div className="flex flex-col mt-2">
            <div className="text-sm font-semibold text-blue-700">
              {price.toLocaleString()}đ
            </div>
            <div className="self-start ml-4 text-xs font-medium text-black max-md:ml-2.5">
              {originalPrice.toLocaleString()}đ
            </div>
          </div>
          <div className="flex gap-2.5 px-2.5 py-px text-xl font-light text-black border border-solid border-zinc-400 rounded-[40px]">
            <div className="flex gap-1.5 text-black">
              <div className="my-auto">-</div>
              <div className="shrink-0 w-px border border-solid border-zinc-400 h-[30px]" />
            </div>
            <div className="self-start text-sm">1</div>
            <div className="flex gap-1">
              <div className="shrink-0 w-px border border-solid border-zinc-400 h-[30px]" />
              <div>+</div>
            </div>
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/9243bcfe2902331f1960d57c7209fe56f28fccaf429e1cf506d8ff851fb9aa75?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
            className="object-contain shrink-0 aspect-[2.69] rounded-[40px] w-[86px]"
            alt=""
          />
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/bf94572aeb9db5f7bf07b8026657a0cba51f81fc1016f466c92349e79fd93cbd?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
          className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
          alt=""
        />
      </div>
      <div className="shrink-0 mt-6 mr-7 ml-6 max-w-full h-px border border-solid border-black border-opacity-10 w-[752px] max-md:mr-2.5" />
    </>
  );
};

export default CartItem;
