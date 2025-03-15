import Image from "next/image";
// Import các hình ảnh
import hotrotinhduc from "@/images/category/hotrotinhduc.jpg";
import kehoachhoagiadinh from "@/images/category/kehoachhoagiadinh.jpg";

const productData = [
  { image: hotrotinhduc, title: "Hỗ trợ tình dục" },
  { image: kehoachhoagiadinh, title: "Kế hoạch hóa gia đình" },
];
export default function CategoryReproductiveHealth() {
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
