import React from "react";
import Image from "next/image";
import textlogo from "../../../images/medicare.png";
import logoyellow from "../../../images/Mvang.png";

const InfoFooter: React.FC = () => {
  return (
    <div className=" py-10 px-10">
      {/* Thêm px-10 để tạo khoảng cách hai bên */}
      <div className="grid grid-cols-4 gap-16 justify-between text-black max-md:grid-cols-2 max-sm:grid-cols-1">
        {/* Cột 1: Logo và giới thiệu */}
        <div className="flex flex-col items-start">
          <div className="relative flex self-start whitespace-nowrap -mt-10">
            <Image
              src={logoyellow}
              alt=""
              width={95}
              height={95}
              priority
              className="object-contain shrink-0 aspect-square w-[90px] z-0"
            />
            <Image
              src={textlogo}
              alt=""
              width={95}
              height={95}
              priority
              className="absolute top-1 left-20 z-10"
            />
          </div>

          <p className="mt-2 text-sm w-[250px] text-justify">
            Cửa hàng thực phẩm chức năng Medicare là địa chỉ tin cậy để bạn tìm
            kiếm những sản phẩm chất lượng nhất.
          </p>
          <br />

          <p className="mt-2 text-sm w-[250px] text-justify">
            Mã số thuế: 01234567891 - Sở Kế hoạch và Đầu tư Tp Hà Nội cấp ngày
            13/02/2024
          </p>
        </div>

        {/* Cột 2: Về chúng tôi */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">VỀ CHÚNG TÔI</h3>
          <ul className="mt-4 space-y-2 text-sm ">
            <li>
              <a href="#">Trang chủ</a>
            </li>
            <li>
              <a href="#">Giới thiệu</a>
            </li>
            <li>
              <a href="#">Sản phẩm</a>
            </li>
            <li>
              <a href="#">Góc sức khỏe</a>
            </li>
            <li>
              <a href="#">Video</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
            <li>
              <a href="#">Đặt lịch tư vấn</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Chính sách */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">CHÍNH SÁCH</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#">Chính sách giao hàng</a>
            </li>
            <li>
              <a href="#">Chính sách đổi trả</a>
            </li>
            <li>
              <a href="#">Chính sách bán hàng</a>
            </li>
            <li>
              <a href="#">Chính sách thành viên</a>
            </li>
            <li>
              <a href="#">Bảo mật thông tin cá nhân</a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Thông tin liên hệ */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">THÔNG TIN LIÊN HỆ</h3>
          <p className="mt-4 text-sm">
            📍 Số 1 Võ Văn Ngân, phường Linh Chiểu, thành phố Thủ Đức
          </p>
          <p className="mt-2 text-sm">📞 0943640913</p>
          <p className="mt-2 text-sm">✉️ support@henduyentuan.vn</p>

          <p className="text-sm font-medium mt-4">
            Mua hàng: <span className="text-[#002E99]">19006750</span>
          </p>
          <p className="mt-2 text-sm font-medium">
            Khiếu nại: <span className="text-[#002E99]">19006750</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoFooter;
