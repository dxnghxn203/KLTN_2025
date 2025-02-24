import React from "react";

const OrderSummary: React.FC = () => {
  return (
    <div className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col items-start pt-4 pr-7 pb-8 pl-3.5 mx-auto w-full font-medium rounded-xl bg-slate-100 max-md:pr-5 max-md:mt-8">
        <div className="flex gap-5 justify-between self-stretch px-4 py-3.5 text-sm text-blue-700 bg-indigo-50 rounded-xl max-md:mr-0.5 max-md:ml-2">
          <div className="self-start">Áp dụng ưu đãi để được giảm giá</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/578eba90d74e42a9a5e59d68f5f9b1b7/ea114104ad3ef0791d002897f7f4483b6477a0c967df6d8b11926796e1b46cf7?apiKey=578eba90d74e42a9a5e59d68f5f9b1b7&"
            className="object-contain shrink-0 w-5 aspect-square"
            alt=""
          />
        </div>
        <div className="flex gap-5 justify-between items-start mt-4 ml-2.5 max-w-full text-sm w-[337px]">
          <div className="flex flex-col text-black">
            <div className="self-start">Tổng tiền</div>
            <div className="mt-5">Giảm giá trực tiếp</div>
            <div className="mt-5 max-md:mr-1">Giảm giá voucher</div>
            <div className="self-start mt-5">Tiết kiệm được</div>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <div className="text-black">479.000đ</div>
            <div className="flex flex-col pl-1.5 mt-5 text-amber-300">
              <div>-81.080đ</div>
              <div className="self-end mt-5">0đ</div>
              <div className="self-start mt-5 max-md:ml-1.5">81.080đ</div>
            </div>
          </div>
        </div>
        <div className="shrink-0 mt-5 ml-2.5 max-w-full h-px border border-solid border-black border-opacity-10 w-[337px]" />
        <div className="flex gap-5 justify-between items-start mt-3 ml-2.5 max-w-full w-[337px]">
          <div className="mt-2.5 text-xl text-black">Thành tiền</div>
          <div className="flex gap-1 whitespace-nowrap">
            <div className="grow self-start mt-4 text-sm text-black">
              479.000đ
            </div>
            <div className="text-xl text-blue-700">397.920đ</div>
          </div>
        </div>
        <button className="px-16 py-4 mt-7 ml-2.5 max-w-full text-base font-bold text-white bg-blue-700 rounded-3xl w-[337px] max-md:px-5">
          Mua hàng
        </button>
        <div className="self-stretch mt-7 text-sm text-center text-black">
          Bằng việc tiến hành đặt mua hàng, bạn đồng ý với
          <br />
          Điều khoản dịch vụ và Chính sách xử lý dữ liệu cá nhân
          <br />
          của Nhà thuốc FPT Long Châu
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
