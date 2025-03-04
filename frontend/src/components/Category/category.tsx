import Image from "next/image";
// Import các hình ảnh
import tpcn from "@/images/tpcn.png";
const productData = [
  { image: tpcn, title: "Dành cho trẻ em" },
  { image: tpcn, title: "Dành cho người lớn" },
  { image: tpcn, title: "Bổ sung vitamin" },
  { image: tpcn, title: "Hỗ trợ tiêu hóa" },
  { image: tpcn, title: "Tăng cường miễn dịch" },
  { image: tpcn, title: "Chăm sóc xương khớp" },
  { image: tpcn, title: "Hỗ trợ tim mạch" },
  { image: tpcn, title: "Thải độc cơ thể" },
  { image: tpcn, title: "Thải độc cơ thể" },
  { image: tpcn, title: "Thải độc cơ thể" },
  { image: tpcn, title: "Thải độc cơ thể" },
  { image: tpcn, title: "Thải độc cơ thể" },
];
export default function CategoryFunctionalProduct() {
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
