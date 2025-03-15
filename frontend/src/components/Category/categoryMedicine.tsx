import Image from "next/image";
// Import các hình ảnh
import thuockedon from "@/images/category/thuockedon.png";
import thuockhongkedon from "@/images/category/thuockhongkedon.png";
import thuockhac from "@/images/category/thuockhac.jpg";

const productData = [
  { image: thuockedon, title: "Thuốc kê đơn" },
  { image: thuockhongkedon, title: "Thuốc không kê đơn" },
  { image: thuockhac, title: "Thuốc khác" },
];
export default function CategoryMedicine() {
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
