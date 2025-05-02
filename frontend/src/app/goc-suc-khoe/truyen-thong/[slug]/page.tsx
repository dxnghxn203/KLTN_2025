import Head from "next/head";

const TraCuuThuocPage = () => {
  return (
    <div className="pt-[120px] pb-12">
      <Head>
        <title>
          Cách tra cứu thông tin đăng ký thuốc | Nhà thuốc Long Châu
        </title>
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Cách tra cứu thông tin đăng ký thuốc
        </h1>

        <p className="mb-4">
          Việc tra cứu thông tin đăng ký thuốc giúp người tiêu dùng xác định
          thuốc có được Bộ Y tế cấp phép lưu hành hay không, từ đó tránh mua
          phải hàng giả, hàng không rõ nguồn gốc.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          Hướng dẫn tra cứu thông tin đăng ký thuốc
        </h2>

        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            Truy cập cổng thông tin của Cục Quản lý Dược tại:{" "}
            <a
              href="https://dichvucong.dav.gov.vn/congbothuoc/index"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://dichvucong.dav.gov.vn/congbothuoc/index
            </a>
          </li>
          <li>Chọn mục "Tra cứu thông tin thuốc".</li>
          <li>Nhập tên thuốc, số đăng ký hoặc tên nhà sản xuất để tìm kiếm.</li>
          <li>
            Xem kết quả chi tiết như số đăng ký, hoạt chất, dạng bào chế,...
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          Tra cứu nhanh qua ứng dụng Nhà thuốc Long Châu
        </h2>

        <p className="mb-4">
          Bạn có thể sử dụng ứng dụng Nhà thuốc Long Châu để kiểm tra thông tin
          thuốc nhanh chóng:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Tải ứng dụng tại:{" "}
            <a
              href="https://dl.ntlc.com.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://dichvucong.dav.gov.vn/congbothuoc/index
            </a>
          </li>
          <li>Sử dụng tính năng "Tra cứu thuốc" trong ứng dụng.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          Liên hệ hỗ trợ
        </h2>
        <p className="mb-4 text-gray-700">
          Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ tổng đài tư vấn miễn phí:
        </p>
        <p className="text-lg font-bold text-red-600">1800 6928</p>
      </div>
    </div>
  );
};

export default TraCuuThuocPage;
