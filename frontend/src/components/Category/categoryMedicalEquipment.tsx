import Image from "next/image";
// Import các hình ảnh
import dungcuyte from "@/images/category/dungcuyte.jpg";
import dungcutheodoi from "@/images/category/dungcutheodoi.jpg";
import dungcusocuu from "@/images/category/dungcusocuu.jpg";
import khautrang from "@/images/category/khautrang.jpg";

const productData = [
  { image: dungcuyte, title: "Dụng cụ y tế" },
  { image: dungcutheodoi, title: "Dụng cụ theo dõi" },
  { image: dungcusocuu, title: "Dụng cụ sơ cứu" },
  { image: khautrang, title: "Khẩu trang" },
];
export default function CategoryMedicalEquipment() {
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
