import danhchotreem from "@/images/category/danhchotreem.webp";
import chamsocsacdep from "@/images/category/chamsocsacdep.jpg";
import { StaticImageData } from "next/image";

interface SubSubCategory {
  name: string;
  link: string;
  img: string | StaticImageData;

}

interface SubCategory {
  name: string;
  link: string;
  productCount: number;
  subSubCategories: SubSubCategory[]; 
}

interface CategoryCardProps {
  icon: string | StaticImageData;
  subCategories: SubCategory;
  
}

export const categoryProducts: Record<string, CategoryCardProps[]> = {
  "thuc-pham-chuc-nang": [
    {
      icon: danhchotreem,
      subCategories: 
        {
          name: "Vitamin & Khoáng chất",
          link: "vitamin-khoang-chat",
          productCount: 10,
          subSubCategories: [
            { name: "Bổ sung Canxi & Vitamin D", link: "canxi-vitamin-d", img: danhchotreem },
            { name: "Vitamin tổng hợp", link: "vitamin-tong-hop", img: danhchotreem },
            { name: "Dầu cá, Omega 3, DHA", link: "dau-ca-omega3-dha", img: danhchotreem },
            { name: "Vitamin C các loại", link: "vitamin-c", img: danhchotreem },
            { name: "Bổ sung Sắt & Axit Folic", link: "sat-axit-folic", img: danhchotreem },
            { name: "Vitamin E các loại", link: "vitamin-e", img: danhchotreem },
            { name: "Bổ sung kẽm và Magie", link: "kem-mg", img: danhchotreem },
          ],
        },

      
    },
    {
      icon: chamsocsacdep,
      subCategories: 
        {
          name: "Sinh lý - Nội tiết tố",
          link: "sinh-ly-noi-tiet-to",
          productCount: 8,
          subSubCategories: [
            { name: "Sinh lý nam", link: "sinh-ly-nam", img: chamsocsacdep },
            { name: "Sinh lý nữ", link: "sinh-ly-nu", img: chamsocsacdep },
            { name: "Sức khỏe tình dục", link: "sinh-ly-nu", img: chamsocsacdep },
            { name: "Cân bằng nội tiết tố", link: "can-bang-noi-tiet-to", img: chamsocsacdep },
            { name: "Hỗ trợ mãn kinh", link: "ho-tro-man-kinh", img: chamsocsacdep },
          ],
        },
    },
    {
      icon: danhchotreem,
      subCategories:{
        name:"Cải thiện tăng cường chức năng",
        link: "cai-thien-tang-cuong-chuc-nang",
        productCount: 5,
        subSubCategories: [
          {name:"Chống lão hóa", link: "chong-lao-hoa", img: danhchotreem},
          {name:"Chức năng gan", link: "chuc-nang-gan", img: danhchotreem},
          {name:"Tăng sức đề kháng, miễn dịch", link: "tang-suc-de-khang-mien-dich", img: danhchotreem},
          {name:"Bổ mắt, bảo vệ mắt", link: "bo-mat-bao-ve-mat", img: danhchotreem},
          {name:"Hỗ trợ trao đổi chất", link: "ho-tro-trao-doi-chat", img: danhchotreem},
          {name:"Giải rượu, cai rượu", link: "giai-ruou-cai-ruou", img: danhchotreem},
          {name:"Chống lão hóa", link: "chong-lao-hoa", img: danhchotreem},
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories:{
        name:"Hỗ trợ điều trị",
        link: "ho-tro-dieu-tri",
        productCount: 5,
        subSubCategories: [
          {name:"Hỗ trợ điều trị tiểu đường", link: "ho-tro-dieu-tri-tieu-duong", img: chamsocsacdep},
          {name:"Hỗ trợ điều trị ung thư", link: "ho-tro-dieu-tri-ung-thu", img: chamsocsacdep},
          {name:"Cơ xương khớp", link: "co-xuong-khop", img: chamsocsacdep},
          {name:"Hô hấp, ho, xoang", link: "ho-hap-ho-xoang", img: chamsocsacdep},
          {name:"Thận, tiền liệt tuyến", link: "than-tien-liet-tuyen", img: chamsocsacdep},
          {name:"Hỗ trợ điều trị trĩ", link: "ho-tro-dieu-tri-tri", img: chamsocsacdep},
          {name:"Hỗ trợ điều trị gout", link: "ho-tro-dieu-tri-gout", img: chamsocsacdep},
          {name:"Hỗ trợ trị tiểu đường", link: "ho-tro-tri-tieu-duong", img: chamsocsacdep},
          {name:"Hỗ trợ điều trị ung thư", link: "ho-tro-dieu-tri-ung-thu", img: chamsocsacdep},
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories:{
        name:"Hỗ trợ tiêu hóa",
        link: "ho-tro-tieu-hoa",
        productCount: 5,
        subSubCategories: [
          {name:"Dạ dày, tá tràng", link: "da-day-ta-trang", img: chamsocsacdep},
          {name:"Táo bón", link: "tao-bon", img: chamsocsacdep},
          {name:"Vi sinh - Probiotic", link: "vi-sinh-probiotic", img: chamsocsacdep},
          {name:"Đại tràng", link: "dai-trang", img: chamsocsacdep},
          {name:"Khó tiêu", link: "kho-tieu", img: chamsocsacdep},
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories:{
        name:"Thần kinh não",
        link: "than-kinh-nao",
        productCount: 5,
        subSubCategories: [
          {name:"Bổ não - cải thiện trí nhớ", link: "bo-nao-cai-thien-tri-nho", img: chamsocsacdep},
          {name:"Hỗ trợ giấc ngủ ngon", link: "ho-tro-giac-ngu-ngon", img: chamsocsacdep},
          {name:"Tuần hoàn máu", link: "tuan-hoan-mau", img: chamsocsacdep},
          {name:"Kiểm soát căng thẳng", link: "kiem-soat-cang-thang", img: chamsocsacdep},
          {name:"Hoạt huyết", link: "hoat-huyet", img: chamsocsacdep},
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories:{
        name:"Hỗ trợ làm đẹp",
        link: "ho-tro-lam-dep",
        productCount: 5,
        subSubCategories: [
          {name:"Da", link: "da", img: chamsocsacdep},
          {name:"Hỗ trợ giảm cân", link: "ho-tro-giam-can", img: chamsocsacdep},
          {name:"Tóc", link: "toc", img: chamsocsacdep},
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories:{
        name:"Sức khỏe tim mạch",
        link: "suc-khoe-tim-mach",
        productCount: 5,
        subSubCategories: [
          {name:"Giảm Cholesterol", link: "giam-cholesterol", img: chamsocsacdep},
          {name:"Huyết áp", link: "huyet-ap", img: chamsocsacdep},
          {name:"Suy giãn tĩnh mạch", link: "suy-gian-tinh-mach", img: chamsocsacdep},
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories:{
        name:"Dinh dưỡng",
        link: "dinh-duong",
        productCount: 5,
        subSubCategories: [
          {name:"Sữa", link: "sua", img: chamsocsacdep},
          {name:"Dinh dưỡng trẻ em", link: "dinh-duong-tre-em", img: chamsocsacdep},
        ],
      }
    }
  ],
 
  thuoc: [
    {
      icon: danhchotreem,
      subCategories: {
        name: "Thuốc dị ứng",
        link: "thuoc-di-ung",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc chống dị ứng", link: "thuoc-di-ung", img: danhchotreem },
          { name: "Thuốc say tàu xe", link: "thuoc-say-tau-xe", img: danhchotreem },
        ],
      }
      
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name: "Thuốc giải độc, khử độc và hỗ trợ cai nghiện",
        link: "thuoc-giai-doc-khu-doc-ho-tro-cai-nghien",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc hỗ trợ cai nghiện ma tuý", link: "thuoc-ho-tro-cai-nghien-ma-tuy", img: chamsocsacdep },
          { name: "Cấp cứu giải độc", link: "cap-cuu-giai-doc", img: chamsocsacdep },
          { name: "Viên cai thuốc lá", link: "vien-cai-thuoc-la", img: chamsocsacdep },
        ],
    }
  },
    {
      icon: danhchotreem,
      subCategories: {
        name:"Thuốc da liễu",
        link: "thuoc-da-lieu",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc trị mụn", link: "thuoc-tri-mun", img: danhchotreem },
          { name: "Thuốc bôi ngoài da", link: "thuoc-boi-ngoai-da", img: danhchotreem },
          { name: "Thuốc sát khuẩn", link: "thuoc-sat-khuan", img: danhchotreem },
          { name: "Thuốc bôi sẹo - liền sẹo", link: "thuoc-boi-seo-lien-seo", img: danhchotreem },
          { name: "Dầu mù u", link: "dau-mu-u", img: danhchotreem },
          { name: "Dầu gội trị gàu", link: "dau-goi-tri-gau", img: danhchotreem },
        ],
      }
      
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Miệng dán, cao xoa, dầu",
        link: "mieng-dan-cao-xoa-dau",
        productCount: 5,
        subSubCategories: [
          { name: "Dầu gió", link: "dau-gio", img: chamsocsacdep },
          { name: "Cao xoa", link: "cao-xoa", img: chamsocsacdep },
          { name: "Miếng dán giảm đau", link: "mieng-dan-giam-dau", img: chamsocsacdep },
          { name: "Miếng dán say tàu xe", link: "mieng-dan-say-tau-xe", img: chamsocsacdep },
          { name: "Miếng dán hạ sốt", link: "mieng-dan-ha-sot", img: chamsocsacdep },
          { name: "Miếng dán thư giãn", link: "mieng-dan-thu-gian", img: chamsocsacdep },
          { name: "Dầu nóng xoa bóp", link: "dau-nong-xoa-bop", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: 
      {
        name:"Cơ - xương - khớp",
        link: "co-xuong-khop",
        productCount: 27,
        subSubCategories: [
          { name: "Thuốc trị gout", link: "thuoc-tri-gout", img: chamsocsacdep },
          { name: "Thuốc trị thoái hoá khớp", link: "thuoc-tri-thoai-hoa-khop", img: chamsocsacdep },
          { name: "Thuốc giãn cơ", link: "thuoc-gian-co", img: chamsocsacdep },
          { name: "Thuốc xương khớp", link: "thuoc-xuong-khop", img: chamsocsacdep },
        ],

      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuôc bổ & vitamin",
        link: "thuoc-bo-vitamin",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc bổ", link: "thuoc-bo", img: chamsocsacdep },
          { name: "Thuốc bù điện giải", link: "thuoc-bu-dien-giai", img: chamsocsacdep },
          { name: "Dinh dưỡng", link: "dinh-duong", img: chamsocsacdep },
          { name: "Bổ xương khớp", link: "bo-xuong-khop", img: chamsocsacdep },
          { name: "Thuốc tăng cường sức đề kháng", link: "thuoc-tang-cuong-suc-de-khang", img: chamsocsacdep },
          { name: "Siro bổ", link: "siro-bo", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc ung thư",
        link: "thuoc-ung-thu",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc điều trị ung thư", link: "thuoc-dieu-tri-ung-thu", img: chamsocsacdep },
          { name: "Thuốc chống ung thư", link: "thuoc-chong-ung-thu", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc giảm đau, hạ sốt, kháng viêm",
        link: "thuoc-giam-dau-ha-sot-khang-viem",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc giảm đau hạ sốt", link: "thuoc-giam-dau-ha-sot", img: chamsocsacdep },
          { name: "Thuốc giảm đau kháng viêm", link: "thuoc-giam-dau-khang-viem", img: chamsocsacdep },
          { name: "Thuốc kháng viêm", link: "thuoc-khang-viem", img: chamsocsacdep },
          { name: "Thuốc trị đau nửa đầu", link: "thuoc-tri-dau-nua-dau", img: chamsocsacdep },
        ],
      }
      
    },
    {
      icon: chamsocsacdep,
      subCategories: 
      {
        name:"Thuốc hô hấp",
        link: "thuoc-ho-hap",
        productCount: 5,
        subSubCategories: [
          { name: "Siro trị ho cảm", link: "siro-tri-ho-cam", img: chamsocsacdep },
          { name: "Thuốc trị ho cảm", link: "thuoc-tri-ho-cam", img: chamsocsacdep },
          { name: "Siro hen suyễn", link: "siro-hen-suyen", img: chamsocsacdep },
          { name: "Thuốc trị hen suyễn", link: "thuoc-tri-hen-suyen", img: chamsocsacdep },
          { name: "Siro trị sổ mũi", link: "siro-tri-so-mui", img: chamsocsacdep },
          { name: "Viên ngậm trị ho, viêm họng", link: "vien-ngam-tri-ho-viem-hong", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories:{
        name:"Thuốc kháng sinh, kháng nấm",
        link: "thuoc-khang-sinh-khang-nam",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc kháng nấm", link: "thuoc-khang-nam", img: chamsocsacdep },
          { name: "Siro kháng sinh", link: "siro-khang-sinh", img: chamsocsacdep },
          { name: "Thuốc kháng lao", link: "thuoc-khang-lao", img: chamsocsacdep },
          { name: "Thuốc kháng sinh", link: "thuoc-khang-sinh", img: chamsocsacdep },
          { name: "Thuốc trị giun sán", link: "thuoc-tri-giun-san", img: chamsocsacdep },
          { name: "Thuốc kháng virus", link: "thuoc-khang-virus", img: chamsocsacdep },
          { name: "Thuốc trị sốt rét", link: "thuoc-tri-sot-ret", img: chamsocsacdep },
        ],
      } 
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc mắt, tai, mũi, họng",
        link: "thuoc-mat-tai-mui-hong",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc xịt mũi", link: "thuoc-xit-mui", img: chamsocsacdep },
          { name: "Thuốc nhỏ tai", link: "thuoc-nho-tai", img: chamsocsacdep },
          { name: "Thuốc trị viêm xoang", link: "thuoc-tri-viem-xoang", img: chamsocsacdep },
          { name: "Ống hít mũi", link: "ong-hit-mui", img: chamsocsacdep },
          { name: "Dung dịch súc miệng", link: "dung-dich-suc-mieng", img: chamsocsacdep },
          { name: "Thuốc tai mũi họng", link: "thuoc-tai-mui-hong", img: chamsocsacdep },
          { name: "Thuốc bôi răng miệng", link: "thuoc-boi-rang-mieng", img: chamsocsacdep },
          { name: "Thuốc xịt hen suyễn", link: "thuoc-xit-hen-suyen", img: chamsocsacdep },
          { name: "Thuốc trị tăng nhãn áp", link: "thuoc-tri-tang-nhan-ap", img: chamsocsacdep },
          { name: "Thuốc nhỏ mắt", link: "thuoc-nho-mat", img: chamsocsacdep },
          { name: "Thuốc tra mắt", link: "thuoc-tra-mat", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc hệ thần kinh",
        link: "thuoc-he-than-kinh",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc an thần", link: "thuoc-an-than", img: chamsocsacdep },
          { name: "Thuốc chống trầm cảm", link: "thuoc-chong-tram-cam", img: chamsocsacdep },
          { name: "Thuốc thần kinh", link: "thuoc-than-kinh", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc tiêm chích & dịch truyền",
        link: "thuoc-tiem-chich-dich-truyen",
        productCount: 5,
        subSubCategories: [
          { name: "Dịch truyền", link: "dich-truyen", img: chamsocsacdep },
          { name: "Thuốc tiêm chích", link: "thuoc-tiem-chich", img: chamsocsacdep },
          { name: "Dung dịch tiêm", link: "dung-dich-tiem", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories:{
        name:"Thuốc tiêu hóa & gan mật",
        link: "thuoc-tieu-hoa-gan-mat",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc lợi tiểu", link: "thuoc-loi-tieu", img: chamsocsacdep },
          { name: "Thuốc gan mật", link: "thuoc-gan-mat", img: chamsocsacdep },
          { name: "Thuốc dạ dày", link: "thuoc-da-day", img: chamsocsacdep },
          { name: "Siro tiêu hóa", link: "siro-tieu-hoa", img: chamsocsacdep },
          { name: "Thuốc trị tiêu chảy", link: "thuoc-tri-tieu-chay", img: chamsocsacdep },
          { name: "Thuốc tiêu hóa", link: "thuoc-tieu-hoa", img: chamsocsacdep },
          { name: "Thuốc trị táo bón", link: "thuoc-tri-tao-bon", img: chamsocsacdep },
          { name: "Thuốc trị bệnh gan", link: "thuoc-tri-benh-gan", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc tim mạch & máu",
        link: "thuoc-tim-mach-mau",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc chống đông máu", link: "thuoc-chong-dong-mau", img: chamsocsacdep },
          { name: "Thuốc tim mạch huyết áp", link: "thuoc-tim-mach-huyet-ap", img: chamsocsacdep },
          { name: "Thuốc tăng cường tuần hoàn não", link: "thuoc-tang-cuong-tuan-hoan-nao", img: chamsocsacdep },
          { name: "Thuốc trị trĩ, suy giãn tĩnh mạch", link: "thuoc-tri-tri-suy-gian-tinh-mach", img: chamsocsacdep },
          { name: "Thuốc trị mỡ máu", link: "thuoc-tri-mo-mau", img: chamsocsacdep },
          { name: "Thuốc cầm máu", link: "thuoc-cam-mau", img: chamsocsacdep },
          { name: "Thuốc trị thiếu máu", link: "thuoc-tri-thieu-mau", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc tiết niệu - sinh dục",
        link: "thuoc-tiet-nieu-sinh-duc",
        productCount: 5,
        subSubCategories: [
          { name: "Thuốc tránh thai", link: "thuoc-tranh-thai", img: chamsocsacdep },
          { name: "Thuốc trị bệnh thận", link: "thuoc-tri-benh-than", img: chamsocsacdep },
          { name: "Thuốc trị cường giáp", link: "thuoc-tri-cuong-giap", img: chamsocsacdep },
          { name: "Thuốc trị bệnh tuyến tiền liệt", link: "thuoc-tri-benh-tuyen-tien-liet", img: chamsocsacdep },
          { name: "Thuốc điều hoà kinh nguyệt", link: "thuoc-dieu-hoa-kinh-nguyet", img: chamsocsacdep },
          { name: "Thuốc trị bệnh tuyến giáp", link: "thuoc-tri-benh-tuyen-giap", img: chamsocsacdep },
          { name: "Thuốc nội tiết tố", link: "thuoc-noi-tiet-to", img: chamsocsacdep },
          { name: "Thuốc đặt âm đạo", link: "thuoc-dat-am-dao", img: chamsocsacdep },
          { name: "Hormon", link: "hormon", img: chamsocsacdep },
          { name: "Dung dịch vệ sinh phụ nữ", link: "dung-dich-ve-sinh-phu-nu", img: chamsocsacdep },
          { name: "Thuốc trị rối loạn cương dương", link: "thuoc-tri-roi-loan-cuong-duong", img: chamsocsacdep },
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc tiểu đường",
        link: "thuoc-tieu-duong",
        productCount: 5,
        subSubCategories: [
          
        ],
      }
    },
    {
      icon: chamsocsacdep,
      subCategories: {
        name:"Thuốc tê bôi",
        link: "thuoc-te-boi",
        productCount: 5,
        subSubCategories: [
        ],
      }
    },
  ],
  "duoc-my-pham": [
    {
      icon: danhchotreem,
      subCategories: {
        name: "Chăm sóc da mặt",
        link: "cham-soc-da-mat",
        productCount: 181,
        subSubCategories: [
          { name: "Sữa rửa mặt (Kem, gel, sữa)", link: "sua-rua-mat", img: danhchotreem },
          { name: "Kem chống nắng da mặt", link: "kem-chong-nang-da-mat", img: danhchotreem },
          { name: "Dưỡng da mặt", link: "duong-da-mat", img: danhchotreem },
          { name: "Mặt nạ", link: "mat-na", img: danhchotreem },
          { name: "Serum, Essence hoặc Ampoule", link: "serum-essence-ampoule", img: danhchotreem },
          { name: "Toner (nước hoa hồng) / Lotion", link: "toner-lotion", img: danhchotreem },
          { name: "Tẩy tế bào chết", link: "tay-te-bao-chet", img: danhchotreem },
          { name: "Xịt khoáng", link: "xit-khoang", img: danhchotreem },
          { name: "Nước tẩy trang, dầu tẩy trang", link: "nuoc-tay-trang-dau-tay-trang", img: danhchotreem },
        ],
      }
      
    },
    {
      icon: danhchotreem,
      subCategories:{
        name:"Chăm sóc cơ thể",
        link: "cham-soc-co-the",
        productCount: 213,
        subSubCategories: [
          { name: "Sữa tắm, xà bông", link: "sua-tam-xa-bong", img: danhchotreem },
          { name: "Chống nắng toàn thân", link: "chong-nang-toan-than", img: danhchotreem },
          { name: "Lăn khử mùi, xịt khử mùi", link: "lan-khu-mui-xit-khu-mui", img: danhchotreem },
          { name: "Sữa dưỡng thể, kem dưỡng thể", link: "sua-duong-the-kem-duong-the", img: danhchotreem },
          { name: "Trị nứt da", link: "tri-nut-da", img: danhchotreem },
          { name: "Kem dưỡng da tay, chân", link: "kem-duong-da-tay-chan", img: danhchotreem },
          { name: "Chăm sóc ngực", link: "cham-soc-nguc", img: danhchotreem },
          { name: "Massage", link: "massage", img: danhchotreem },
        ],
      } 
    },
    {
      icon: danhchotreem,
      subCategories: {
        name:"Giải pháp làn da",
        link: "giai-phap-lan-da",
        productCount: 89,
        subSubCategories: [
          { name: "Trị sẹo, mờ vết thâm", link: "tri-seo-mo-vet-tham", img: danhchotreem },
          { name: "Kem trị mụn, gel trị mụn", link: "kem-tri-mun-gel-tri-mun", img: danhchotreem },
          { name: "Dưỡng da bị khô, thiếu ẩm", link: "duong-da-kho-thieu-am", img: danhchotreem },
          { name: "Kem trị nám, tàn nhang, đốm nâu", link: "kem-tri-nam-tan-nhang-dom-nau", img: danhchotreem },
          { name: "Viêm da cơ địa", link: "viem-da-co-dia", img: danhchotreem },
          { name: "Da bị kích ứng", link: "da-bi-kich-ung", img: danhchotreem },
          { name: "Tái tạo, chống lão hóa da", link: "tai-tao-chong-lao-hoa-da", img: danhchotreem },
          { name: "Da sạm, xỉn màu", link: "da-sam-xin-mau", img: danhchotreem },
        ],
      }
    },
    {
      icon: danhchotreem,
      subCategories: {
        name:"Chăm sóc tóc - da đầu",
        link: "cham-soc-toc-da-dau",
        productCount: 70,
        subSubCategories: [
          { name: "Dầu gội đầu xả", link: "dau-goi-dau-xa", img: danhchotreem },
          { name: "Dầu gội trị nấm", link: "dau-goi-tri-nam", img: danhchotreem },
          { name: "Dưỡng tóc, ủ tóc", link: "duong-toc-u-toc", img: danhchotreem },
          { name: "Đặc trị cho tóc", link: "dac-tri-cho-toc", img: danhchotreem },
        ],
      }
    },
    {
      icon: danhchotreem,
      subCategories: {
        name:"Mỹ phẩm trang điểm",
        link: "my-pham-trang-diem",
        productCount: 18,
        subSubCategories: [
          { name: "Son môi", link: "son-moi", img: danhchotreem },
          { name: "Trang điểm mặt", link: "trang-diem-mat", img: danhchotreem },
        ],
      }
    },
    {
      icon: danhchotreem,
      subCategories: {
        name:"Chăm sóc da vùng mắt",
        link: "cham-soc-da-vung-mat",
        productCount: 5,
        subSubCategories: [
          { name: "Trị quầng thâm, bọng mắt", link: "tri-quang-tham-bong-mat", img: danhchotreem },
          { name: "Xóa nếp nhăn vùng mắt", link: "xoa-nep-nhan-vung-mat", img: danhchotreem },
          { name: "Dưỡng da mắt", link: "duong-da-mat", img: danhchotreem },
        ],

      }
    },
    {
      icon: danhchotreem,
      subCategories: {
        name:"Chăm sóc môi",
        link: "cham-soc-moi",
        productCount: 5,
        subSubCategories: [
          { name: "Kem dưỡng môi", link: "kem-duong-moi", img: danhchotreem },
          { name: "Son dưỡng môi", link: "son-duong-moi", img: danhchotreem },
          { name: "Son môi", link: "son-moi", img: danhchotreem },
        ],

      }
    },
  ],
  "thiet-bi-y-te": [
    {
      icon: danhchotreem,
      subCategories: {
        name: "Dụng cụ y tế",
        link: "dung-cu-y-te",
        productCount: 441,
        subSubCategories: [
          { name: "Dụng cụ vệ sinh mũi", link: "dung-cu-ve-sinh-mui", img: danhchotreem },
          { name: "Kim các loại", link: "kim-cac-loai", img: danhchotreem },
          { name: "Máy massage", link: "may-massage", img: danhchotreem },
          { name: "Túi chườm", link: "tui-chuom", img: danhchotreem },
          { name: "Vớ ngăn tĩnh mạch", link: "vo-ngan-tinh-mach", img: danhchotreem },
          { name: "Găng tay", link: "gang-tay", img: danhchotreem },
          { name: "Đai lưng", link: "dai-lung", img: danhchotreem },
          { name: "Dụng cụ vệ sinh tai", link: "dung-cu-ve-sinh-tai", img: danhchotreem },
          { name: "Đai nẹp", link: "dai-nep", img: danhchotreem },
          { name: "Máy xông khí dung", link: "may-xong-khi-dung", img: danhchotreem },
          { name: "Các dụng cụ và sản phẩm khác", link: "cac-dung-cu-va-san-pham-khac", img: danhchotreem }
        ]
      }
    },
    {
      icon: danhchotreem,
      subCategories: {
        name: "Dụng cụ theo dõi",
        link: "dung-cu-theo-doi",
        productCount: 92,
        subSubCategories: [
          { name: "Máy đo huyết áp", link: "may-do-huyet-ap", img: danhchotreem },
          { name: "Máy, que thử đường huyết", link: "may-que-thu-duong-huyet", img: danhchotreem },
          { name: "Thử thai", link: "thu-thai", img: danhchotreem },
          { name: "Nhiệt kế", link: "nhiet-ke", img: danhchotreem },
          { name: "Kit Test Covid", link: "kit-test-covid", img: danhchotreem },
          { name: "Máy đo SpO2", link: "may-do-spo2", img: danhchotreem }
        ]
      }
    },
    {
      icon: danhchotreem,
      subCategories: {
        name: "Dụng cụ sơ cứu",
        link: "dung-cu-so-cuu",
        productCount: 172,
        subSubCategories: [
          { name: "Băng y tế", link: "bang-y-te", img: danhchotreem },
          { name: "Bông y tế", link: "bong-y-te", img: danhchotreem },
          { name: "Cồn, nước sát trùng, nước muối", link: "con-nuoc-sat-trung-nuoc-muoi", img: danhchotreem },
          { name: "Chăm sóc vết thương", link: "cham-soc-vet-thuong", img: danhchotreem },
          { name: "Xịt giảm đau, kháng viêm", link: "xit-giam-dau-khang-viem", img: danhchotreem },
          { name: "Miếng dán giảm đau, hạ sốt", link: "mieng-dan-giam-dau-ha-sot", img: danhchotreem }
        ]
      }
    },
    {
      icon: danhchotreem,
      subCategories: {
        name: "Khẩu trang",
        link: "khau-trang",
        productCount: 38,
        subSubCategories: [
          { name: "Khẩu trang y tế", link: "khau-trang-y-te", img: danhchotreem },
          { name: "Khẩu trang vải", link: "khau-trang-vai", img: danhchotreem }
        ]
      }
    }
  ],
  
  "cham-soc-ca-nhan": [
    {
      icon: danhchotreem,
      subCategories:{
        name:"Hỗ trợ tình dục",
        link: "ho-tro-tinh-duc",
        productCount: 41,
        subSubCategories: [
          { name: "Bao cao su", link: "bao-cao-su", img: danhchotreem },
          { name: "Gel bôi trơn", link: "gel-boi-tron", img: danhchotreem }
        ]
      } 
    },
    {
      icon: danhchotreem,
      subCategories: {
        name:"Thực phẩm - Đồ uống",
        link: "thuc-pham-do-uong",
        productCount: 133,
        subSubCategories: [
          { name: "Nước Yến", link: "nuoc-yen", img: danhchotreem },
          { name: "Kẹo cứng", link: "keo-cung", img: danhchotreem },
          { name: "Nước uống không gas", link: "nuoc-uong-khong-gas", img: danhchotreem },
          { name: "Đường ăn kiêng", link: "duong-an-kieng", img: danhchotreem },
          { name: "Trà thảo dược", link: "tra-thao-duoc", img: danhchotreem },
          { name: "Kẹo dẻo", link: "keo-deo", img: danhchotreem },
          { name: "Tổ yến", link: "to-yen", img: danhchotreem }
        ]


      }
    },
    {
      icon: danhchotreem,
      subCategories:{
        name:"Vệ sinh cá nhân",
        link: "ve-sinh-ca-nhan",
        productCount: 64,
        subSubCategories: [
          { name: "Dung dịch vệ sinh phụ nữ", link: "dung-dich-ve-sinh-phu-nu", img: danhchotreem },
          { name: "Vệ sinh tai", link: "ve-sinh-tai", img: danhchotreem },
          { name: "Băng vệ sinh", link: "bang-ve-sinh", img: danhchotreem },
          { name: "Nước rửa tay", link: "nuoc-rua-tay", img: danhchotreem }
        ]
      } 
    },
    {
      icon: danhchotreem,
      subCategories:{
        name:"Chăm sóc răng miệng",
        link: "cham-soc-rang-mieng",
        productCount: 48,
        subSubCategories: [
          { name: "Kem đánh răng", link: "kem-danh-rang", img: danhchotreem },
          { name: "Bàn chải điện", link: "ban-chai-dien", img: danhchotreem },
          { name: "Chi nha khoa", link: "chi-nha-khoa", img: danhchotreem },
          { name: "Chăm sóc răng", link: "cham-soc-rang", img: danhchotreem },
          { name: "Nước súc miệng", link: "nuoc-suc-mieng", img: danhchotreem }
        ]
      } 
    },
    {
      icon: danhchotreem,
      subCategories: {
        name:"Đồ dùng gia đình",
        link: "do-dung-gia-dinh",
        productCount: 35,
        subSubCategories: [
          { name: "Chống muỗi & côn trùng", link: "chong-muoi-con-trung", img: danhchotreem },
          { name: "Đồ dùng cho bé", link: "do-dung-cho-be", img: danhchotreem },
          { name: "Đồ dùng cho mẹ", link: "do-dung-cho-me", img: danhchotreem }
        ]
      }
    },
    {
      icon: danhchotreem,
      subCategories:{
        name:"Hàng tổng hợp",
        link: "hang-tong-hop",
        productCount: 16,
        subSubCategories: [
          { name: "Khăn giấy, khăn ướt", link: "khan-giay-khan-uot", img: danhchotreem }
        ]
      } 
    },
    {
      icon: danhchotreem,
      subCategories:{
        name:"Tinh dầu các loại",
        link: "tinh-dau-cac-loai",
        productCount: 12,
        subSubCategories: [
          { name: "Tinh dầu massage", link: "tinhdau-massage", img: danhchotreem },
          { name: "Tinh dầu trị cảm", link: "tinh-dau-tri-cam", img: danhchotreem },
          { name: "Tinh dầu xông", link: "tinh-dau-xong", img: danhchotreem }
        ]
      } 
    },
    {
      icon: danhchotreem,
      subCategories:{
        name:"Thiết bị làm đẹp",
        link: "thiet-bi-lam-dep",
        productCount: 2,
        subSubCategories: [
          { name: "Dụng cụ tẩy lông", link: "dung-cu-tay-long", img: danhchotreem },
          { name: "Dụng cụ cạo râu", link: "dung-cu-cao-rau", img: danhchotreem }
        ]
      }
    },
  ]
  
};
