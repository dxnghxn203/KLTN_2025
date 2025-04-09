import React from "react";
import g from "@/images/g.png";
import Image from "next/image";

const IntroMedicare: React.FC = () => {
  return (
    <div className="flex gap-5 max-md:flex-col rounded-2xl bg-slate-100 mt-8 mx-5">
      <div className="flex flex-col w-[66%] max-md:ml-0 max-md:w-full">
        <div className="flex flex-col self-stretch my-auto text-black max-md:mt-10 max-md:max-w-full">
          <div className="self-start ml-20 text-2xl font-bold max-md:max-w-full">
            Giới Thiệu về ứng dụng đặt thuốc online Medicare
          </div>
          <div className="mt-8 ml-20 text-sm font-medium max-md:mt-10 max-md:max-w-full">
            Ứng dụng giao thuốc Medigo mang trong mình sứ mệnh chăm sóc sức khỏe
            cho hàng triệu người dân Việt Nam. Chúng tôi luôn không ngừng nâng
            cao dịch vụ để mang lại chất lượng và trải nghiệm tốt nhất cho khách
            hàng.
            <br />
            <br />
            Với khát vọng trở thành nền tảng y tế từ xa uy tín, chất lượng hàng
            đầu Việt Nam và tương lai là vươn ra thế giới, Medigo không ngừng nỗ
            lực, sáng tạo để mang lại cho người dùng dịch vụ chăm sóc sức khỏe
            nhanh chóng và chất lượng nhất.
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-5 w-[34%] max-md:ml-0 max-md:w-full">
        <Image
          src={g}
          alt="Medicare app interface"
          className="object-contain grow w-full rounded-2xl aspect-[1.21] max-md:mt-10"
        />
      </div>
    </div>
  );
};

export default IntroMedicare;
