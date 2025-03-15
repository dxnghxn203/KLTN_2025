import Image from "next/image";
// Import các hình ảnh
import chamsocdamat from "@/images/category/chamsocdamat.png";
import chamsoccothe from "@/images/category/chamsoccothe.jpg";
import chamocvungmat from "@/images/category/chamocvungmat.jpg";
import chamsocdadau from "@/images/category/chamsocdadau.jpg";
import trangdiem from "@/images/category/trangdiem.jpg";

const productData = [
  { image: chamsocdamat, title: "Chăm sóc da mặt" },
  { image: chamsoccothe, title: "Chăm sóc cơ thể" },
  { image: trangdiem, title: "Mỹ phẩm trang điểm" },
  { image: chamocvungmat, title: "Chăm sóc vùng mắt" },
  { image: chamsocdadau, title: "Chăm sóc tóc - da đầu" },
];
export default function CategoryCosmetics() {
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
