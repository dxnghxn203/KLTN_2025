import Image from "next/image";
import { title } from "process";
import { GoAlertFill } from "react-icons/go";
import { useState } from "react";

const sections = [
  {
    title: "Mô tả sản phẩm",
    content: [
      "Một dạ dày khỏe mạnh là nền tảng để duy trì sức khỏe tốt, vì 70% hệ thống miễn dịch của chúng ta nằm ở ruột. Dr.Sto chứa đến 10 dưỡng chất quan trọng và cần thiết cho hệ tiêu hóa, hỗ trợ giảm viêm loét dạ dày và các triệu chứng ăn không tiêu, cải thiện hoạt động đường ruột và nâng cao sức khỏe tổng thể.",
      "Sức khỏe hệ tiêu hóa phản ánh trực tiếp lối sống và chế độ sinh hoạt, ăn uống hằng ngày của chúng ta. Hệ tiêu hóa kém có thể là biểu hiện của việc ăn uống thất thường, kém vệ sinh, nạp nhiều thức ăn dầu mỡ, đồ uống có cồn; ít vận động, thường xuyên căng thẳng...",
      "Dr.Sto là sản phẩm hỗ trợ dạ dày tiên tiến tổng hợp năng lực mạnh mẽ của enzyme tiêu hóa và nấm men được chiết tách từ nhiều thành phần tự nhiên, cải thiện hiệu quả các vấn đề sức khỏe liên quan đến đường ruột.",
    ],
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/00032922_Vien_Uong_Ho_Tro_Da_Day_Dr_Sto_Jpanwell_60_V_1_76b02a4838.jpg",
  },
  {
    title: "Thành phần",
    content: [
      "Axit dịch vị đóng vai trò quan trọng với hoạt động tiêu hóa. Nhưng sự suy giảm của hệ thống bảo vệ dạ dày và sự tăng mạnh của axit có thể dẫn đến rối loạn tiêu hóa...",
      "Dr.Sto khi đi vào cơ thể sẽ điều hòa hoạt động tiết axit dịch vị, đồng thời thúc đẩy sản xuất chất nhầy tạo thành màng chắn phủ trên bề mặt niêm mạc...",
      "Không dừng lại ở đó, bằng cách kìm hãm sự phát triển của vi khuẩn HP - tác nhân chính làm mất chức năng của niêm mạc dạ dày, Dr.Sto còn phòng ngừa và hỗ trợ điều trị tận gốc bệnh dạ dày.",
    ],
  },
  {
    title: "Công dụng",
    content: [
      "Được nghiên cứu bởi các chuyên gia Nhật Bản, Dr.Sto hội tụ tất cả những thành phần tốt nhất cho dạ dày mà ít sản phẩm nào có được...",
      "Dr.Sto chứa các thành phần tự nhiên và cải thiện sức khỏe dạ dày bằng hoạt động thúc đẩy những phản ứng tự nhiên trong cơ thể, kích thích khả năng tự chữa lành, do đó không gây tác dụng phụ khi sử dụng lâu dài.",
    ],
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/00032922_Vien_Uong_Ho_Tro_Da_Day_Dr_Sto_Jpanwell_60_V_9330b38498.jpg",
  },
  {
    title: "Cách dùng",
    content: [
      "Trẻ trên 12 tuổi và người lớn: Uống 1 viên/lần/ngày, Nên uống sau bữa ăn 10 phút.",
      "Đối tượng sử dụng",
      "B Complex Vitamin Royal Care thích hợp sử dụng cho người có các triệu chứng mệt mỏi, căng thẳng, suy nhược thần kinh do thiếu magie, vitamin B6.",
    ],
  },
  {
    title: "Tác dụng phụ",
    content: [
      "Chưa có thông tin về tác dụng phụ của sản phẩm.",
      <div className="bg-[#FFF3E1] rounded-lg px-4 py-4 space-y-2">
        <div className="flex items-center space-x-2 text-[#FFC048] font-semibold">
          <GoAlertFill />
          <span>Lưu ý</span>
        </div>
        <div>
          Không dùng quá liều khuyến cáo. Không sử dụng cho người mẫn cảm, kiêng
          kỵ với bất kỳ thành phần nào của sản phẩm. Sản phẩm này không phải là
          thuốc và không có tác dụng thay thế thuốc chữa bệnh. Đọc kỹ hướng dẫn
          sử dụng trước khi dùng.
        </div>
      </div>,
    ],
  },
  {
    title: "Bảo quản",
    content: [
      "Bảo quản nơi khô ráo, thoáng mát, nhiệt độ không quá 30 độ C, tránh ánh sáng.",
      "Để xa tầm tay trẻ em.",
    ],
  },
];

const DescribeProduct = () => {
  const [expanded, setExpanded] = useState(false);

  const visibleSections = expanded ? sections : sections.slice(0, 2);

  return (
    <div className="bg-[#F5F7F9] rounded-lg p-5 space-y-4">
      {visibleSections.map((section, index) => (
        <div key={index} className="space-y-2">
          <div className="text-xl font-bold">{section.title}</div>
          {section.content.map((text, i) => (
            <div key={i}>{text}</div>
          ))}
          {section.image && (
            <Image
              src={section.image}
              alt=""
              width={863}
              height={552}
              className="w-full rounded-lg"
            />
          )}
        </div>
      ))}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mx-auto flex justify-center text-[#002E99]"
      >
        {expanded ? "Thu gọn" : "Xem thêm"}
      </button>
    </div>
  );
};

export default DescribeProduct;
