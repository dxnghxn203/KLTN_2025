import Image from "next/image";
// Import các hình ảnh
import sanphamchobe from "@/images/category/sanphamchobe.jpg";
import sanphamchome from "@/images/category/sanphamchome.jpg";
const productData = [
  { image: sanphamchobe, title: "Sản phẩm cho mẹ" },
  { image: sanphamchome, title: "Sản phẩm cho bé" },
];
export default function CategoryMomAndBaby() {
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
