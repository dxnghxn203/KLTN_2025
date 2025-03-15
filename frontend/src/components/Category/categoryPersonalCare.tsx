import Image from "next/image";
// Import các hình ảnh
import sanphamkhumui from "@/images/category/sanphamkhumui.jpg";
import chamsocrangmieng from "@/images/category/chamsocrangmieng.jpg";
import sanphamphongtam from "@/images/category/sanphamphongtam.jpg";
import vesinhphunu from "@/images/category/vesinhphunu.jpg";
import chamsocnamgioi from "@/images/category/chamsocnamgioi.jpg";

const productData = [
  { image: sanphamkhumui, title: "Sản phẩm khử mùi" },
  { image: chamsocrangmieng, title: "Chăm sóc răng miệng" },
  { image: sanphamphongtam, title: "Sản phẩm phòng tắm" },
  { image: vesinhphunu, title: "Vệ sinh phụ nữ" },
  { image: chamsocnamgioi, title: "Chăm sóc nam giới" },
];
export default function CategoryPersonalCare() {
  return (
    <div className="flex justify-start gap-6 flex-wrap px-5">
      {productData.map((product, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="rounded-full bg-[#EAEFFA] w-[130px] h-[130px] flex items-center justify-center">
            <Image src={product.image} alt="icon" width={120} height={120} />
          </div>
          <span className="mt-2 w-[130px] text-center">{product.title}</span>
        </div>
      ))}
    </div>
  );
}
