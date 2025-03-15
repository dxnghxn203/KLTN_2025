import Image from "next/image";
// Import các hình ảnh
import tpcn from "@/images/tpcn.png";
import danhchotreem from "@/images/category/danhchotreem.webp";
import chamsocsacdep from "@/images/category/chamsocsacdep.jpg";
import nhomtimmach from "@/images/category/nhomtimmach.jpg";
import nhomhohap from "@/images/category/nhomhohap.jpg";
import nhomtaimatmui from "@/images/category/nhomtaimatmui.jpg";
import nhomduonghuyet from "@/images/category/nhomduonghuyet.png";
import nhomcokhop from "@/images/category/nhomcokhop.png";
import nhomdaday from "@/images/category/nhomdaday.jpg";
import nhomthankinh from "@/images/category/nhomthankinh.jpg";
import tiethannieu from "@/images/category/tiethannieu.png";
import vitamin from "@/images/category/vitamin.jpg";
import hotrsinhly from "@/images/category/hotrsinhly.jpg";
import bogan from "@/images/category/bogan.png";
import giamcan from "@/images/category/giamcan.jpg";
import phunumangthai from "@/images/category/phunumangthai.jpg";

const productData = [
  { image: danhchotreem, title: "Dành cho trẻ em" },
  { image: chamsocsacdep, title: "Chăm sóc sắc đẹp" },
  { image: nhomtimmach, title: "Nhóm tim mạch" },
  { image: nhomhohap, title: "Nhóm hô hấp" },
  { image: nhomtaimatmui, title: "Nhóm tai/mắt/mũi" },
  { image: nhomduonghuyet, title: "Nhóm đường huyết" },
  { image: nhomcokhop, title: "Nhóm cơ khớp" },
  { image: nhomdaday, title: "Nhóm dạ dày" },
  { image: nhomthankinh, title: "Nhóm thần kinh" },
  { image: tiethannieu, title: "Nhóm thận tiết niệu" },
  { image: vitamin, title: "Vitamin & Khoáng chất" },
  { image: hotrsinhly, title: "Hỗ trợ sinh lý" },
  { image: bogan, title: "Chăm sóc gan" },
  { image: giamcan, title: "Giảm cân" },
  { image: phunumangthai, title: "Dành cho phụ nữ mang thai" },
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
