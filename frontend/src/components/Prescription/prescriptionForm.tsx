"use client";
import { useEffect, useState } from "react";
import { FiCamera, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useToast } from "@/providers/toastProvider";
import { ImBin } from "react-icons/im";
import Image from "next/image";
import image from "@/images/1.jpg";
import { FaFilePrescription } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import DeleteProductDialog from "../Dialog/deleteProductDialog";
import LocationCheckout from "../Checkout/locationCheckout";
import { useRouter, usePathname } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
import { PiNumberCircleNineDuotone } from "react-icons/pi";

const PrescriptionForm = () => {
  const router = useRouter();
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const toast = useToast();
  const { user } = useAuth();
  const { fetchRequestPrescription } = useOrder();
  const [medicine, setMedicine] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  //   const [unit, setUnit] = useState<string>("viên");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedPrice, setSelectedPrice] = useState<any | null>(null);

  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dataLocation, setDataLocation] = useState<any | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [unit, setUnit] = useState("");
  const [priceId, setPriceId] = useState("");

  const isFromChiTietSanPham = `/chi-tiet-san-pham/${medicine?.product?.slug}`;

  useEffect(() => {
    const stored = localStorage.getItem("selectedMedicine");
    if (stored) {
      setMedicine(JSON.parse(stored));
    }
  }, []);
  useEffect(() => {
    if (medicine?.product_price?.length > 0) {
      const first = medicine.product_price[0];
      setUnit(first.unit);
      setPriceId(first._id);
    }
  }, [medicine]);

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value;
    setUnit(selectedUnit);

    const selected = medicine?.product_price.find(
      (item: any) => item.unit === selectedUnit
    );

    if (selected) {
      setPriceId(selected._id); // nếu bạn vẫn cần
      setSelectedPrice(selected); // lưu đối tượng giá vào state
      //   console.log("Matched price object:", selected);
    }
  };

  const handleDeleteClick = (product_id: string, price_id: string) => {
    setSelectedProductId(product_id);
    setSelectedPriceId(price_id);
    setIsDeleteDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductId(null);
    setSelectedPriceId(null);
  };
  const handleDeleteProduct = () => {
    if (!selectedProductId || !selectedPriceId) return;

    const updatedPrices = medicine.product_price.filter(
      (item: any) => item._id !== selectedPriceId
    );

    const updatedMedicine = {
      ...medicine,
      product_price: updatedPrices,
    };

    setMedicine(updatedMedicine);
    localStorage.setItem("selectedMedicine", JSON.stringify(updatedMedicine));
    toast.showToast("Đã xóa sản phẩm thành công", "success");

    // Reset dialog state
    handleCloseDialog();
  };

  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file: any) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (images.length + validImages.length > 5) {
      toast.showToast("Chỉ được chọn tối đa 5 ảnh", "warning");
      return;
    }

    const newImages = validImages.map((file: any) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev: any[]) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setImages(newImages);
  };
  const handleSendRequest = () => {
    if (!dataLocation) {
      toast.showToast("Vui lòng chọn địa chỉ nhận hàng", "warning");
      return;
    }
    if (!medicine) {
      toast.showToast("Vui lòng chọn sản phẩm cần tư vấn", "warning");
      return;
    }

    const data = {
      product: [
        {
          product_id: medicine.product_id,
          price_id: selectedPrice.price_id,
          quantity: quantity,
        },
      ],
      pick_to: {
        name: user?.user_name,
        phone_number: user?.phone_number,
        email: user?.email,
        address: {
          address: dataLocation?.address,
          ward: dataLocation?.ward,
          district: dataLocation?.district,
          province: dataLocation?.province,
        },
      },
      receiver_province_code: dataLocation?.province_code,
      receiver_district_code: dataLocation?.district_code,
      receiver_commune_code: dataLocation?.ward_code,
    };

    fetchRequestPrescription(
      data,
      (message: any) => {
        toast.showToast(message, "success");
      },
      (message: any) => {
        toast.showToast(message, "error");
      }
    );
    console.log("Data to send:", data);
  };
  console.log("selectedPriceId", selectedPrice?.price_id);

  return (
    <div className="pt-14 mx-4">
      <h2 className="font-semibold mb-4 text-lg">Cần mua thuốc</h2>
      {/* Grid 2 cột */}
      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {/* Cột trái (chiếm 2/3) */}
        <div className="col-span-2 space-y-4">
          <div className="bg-[#F5F7F9] p-4 rounded-xl space-y-4">
            <div className="font-medium">Thông tin liên hệ</div>
            <div className="flex space-x-4 ">
              <div className="relative w-full">
                <input
                  type="text"
                  id="name"
                  className={`peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl outline-none transition-all 
                    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2]`}
                  placeholder=" "
                  defaultValue={user?.user_name}
                  readOnly
                />
                <label
                  htmlFor="name"
                  className="absolute text-xs text-gray-500 left-4 top-2 transition-all peer-placeholder-shown:top-4 
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm 
                    peer-focus:text-gray-500"
                >
                  Họ và tên
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="tel"
                  id="phone"
                  className={`peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl outline-none transition-all 
                    focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2]`}
                  defaultValue={user?.phone_number}
                  readOnly
                />
                <label
                  htmlFor="phone"
                  className="absolute text-xs text-gray-500 left-4 top-2 transition-all peer-placeholder-shown:top-4 
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm 
                    peer-focus:text-gray-500"
                >
                  Số điện thoại
                </label>
              </div>
            </div>
            <div className="relative w-full">
              <label
                htmlFor="note"
                className="absolute text-xs text-gray-500 left-4 top-2"
              >
                Ghi chú (không bắt buộc)
              </label>
              <textarea
                id="note"
                className="pt-6 w-full px-4 pt-6 pb-2 border border-gray-300 rounded-xl outline-none transition-all 
                  focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] placeholder:font-normal placeholder:text-[14px]"
                placeholder="Ví dụ: Tôi cần tư vấn về thuốc đau đầu"
                rows={4}
              />
            </div>
          </div>
          <div className="bg-[#F5F7F9] p-4 rounded-xl space-y-4">
            <div className="font-medium">Chọn địa chỉ nhận hàng</div>
            <LocationCheckout
              setDataLocation={setDataLocation}
              setNote={setNote}
            />
          </div>
          {!showUploadBox && (
            <div
              className="relative bg-[#F5F7F9] py-4 px-4 rounded-xl space-y-1"
              onClick={() => setShowUploadBox(true)}
            >
              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-blue-700 font-bold"
                aria-label="Thêm ảnh"
              >
                <FiPlus />
              </button>

              <div className="w-full text-blue-700 font-semibold rounded-lg">
                Thêm ảnh nếu có đơn thuốc (không bắt buộc)
              </div>
              <div className="text-sm">Giúp dược sĩ tư vấn chính xác nhất</div>
            </div>
          )}

          {showUploadBox && (
            <div className="bg-[#F5F7F9] py-4 px-4 rounded-xl space-y-2">
              <div className="w-full text-blue-700 font-semibold rounded-lg">
                Ảnh chụp đơn thuốc
              </div>
              <div className="border border-dashed border-[#0053E2] bg-[#F0F9FF] rounded-xl px-4 py-6 space-y-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <FiCamera className="text-xl text-gray-600" />
                  <span className="text-gray-700 text-sm">
                    Thêm tối đa 5 ảnh, mỗi ảnh dưới 5MB (định dạng jpg, jpeg,
                    png)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/jpg"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded overflow-hidden border border-gray-300"
                    >
                      <img
                        src={img.url}
                        alt={`image-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                      >
                        <FiX className="text-red-500 text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {!isFromChiTietSanPham && (
            <div className="relative bg-[#F5F7F9] py-4 px-4 rounded-xl space-y-1">
              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-xl text-blue-700 font-bold"
                aria-label="Thêm ảnh"
              >
                <FiPlus />
              </button>
              <div className="w-full text-blue-700 font-semibold rounded-lg">
                Thêm thuốc cần tư vấn (không bắt buộc)
              </div>
              <div className="text-sm">Nhập theo tên thuốc hoặc sản phẩm</div>
            </div>
          )}

          {isFromChiTietSanPham && (
            <div className="bg-[#F5F7F9] py-4 px-4 rounded-xl space-y-1">
              <div className="w-full text-blue-700 font-semibold rounded-lg mb-3">
                Danh sách sản phẩm cần tư vấn
              </div>
              <button className="text-sm text-blue-700 bg-[#EAEFFA] w-full py-3.5 rounded-full flex items-center justify-center space-x-2 font-semibold">
                + Thêm sản phẩm/thuốc
              </button>
              <div
                className="flex items-center justify-between py-3 text-sm 
                                border-b border-gray-300"
              >
                <div className="flex items-center w-[55%]">
                  <Image
                    src={medicine?.image}
                    alt={""}
                    width={55}
                    height={55}
                    className="rounded-lg border border-stone-300 p-1"
                  />
                  <span className="ml-4 line-clamp-3 overflow-hidden text-ellipsis">
                    {medicine?.name}
                  </span>
                </div>
                <div className="flex items-center mt-2 gap-2">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(prev - 1, 0))}
                    className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="text-center w-8 bg-[#F5F7F9]"
                    readOnly
                  />
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>

                  {/* Unit dropdown */}
                  <select
                    value={unit}
                    onChange={handleUnitChange}
                    className="ml-10 border rounded px-2 py-1 text-sm"
                  >
                    {medicine?.product_price?.map((item: any) => (
                      <option key={item.price_id} value={item.unit}>
                        {item.unit}
                      </option>
                    ))}
                  </select>

                  <div className="ml-10 text-black/50 hover:text-black transition-colors">
                    <button
                      onClick={() =>
                        handleDeleteClick(
                          medicine._id,
                          medicine.product_price[0]?._id
                        )
                      }
                    >
                      <ImBin size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cột phải (chiếm 1/3) */}
        <div className="flex w-full flex-col space-y-4">
          <div className="bg-[#F5F7F9] p-4 rounded-lg w-full">
            <button
              className="bg-blue-700 text-white font-medium py-4 px-4 rounded-full hover:bg-[#002E99] w-full"
              onClick={() => {
                handleSendRequest();
              }}
            >
              Gửi yêu cầu tư vấn
            </button>
          </div>
          <div className="bg-[#F5F7F9] p-4 rounded-lg w-full text-sm">
            <h2 className=" font-semibold mb-4">
              Quy trình tư vấn tại Medicare
            </h2>
            <div className="relative pl-10">
              {/* Đường timeline kéo từ 1 đến 2 */}
              <div className="absolute left-[10px] top-0 bottom-[26px] w-[2px] bg-[#D6E3F3]"></div>

              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute -left-[40px] top-0 w-6 h-6 bg-[#9BB8E3] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p>
                    Quý khách vui lòng điền thông tin liên hệ, cung cấp ảnh đơn
                    thuốc hoặc tên sản phẩm cần tư vấn (nếu có).
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[40px] top-0 w-6 h-6 bg-[#9BB8E3] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p>
                    Dược sĩ chuyên môn của nhà thuốc sẽ gọi lại tư vấn miễn phí
                    cho quý khách.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[40px] top-0 w-6 h-6 bg-[#9BB8E3] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p>
                    Quý khách có thể tới các Nhà thuốc Medicare gần nhất để được
                    hỗ trợ mua hàng trực tiếp.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#F5F7F9] p-4 rounded-lg w-full text-sm items-center flex justify-center space-x-2">
            <button className="text-blue-700 font-medium flex">
              <FaFilePrescription className="text-xl mr-2" />
              Xem lại đơn thuốc của tôi
            </button>
          </div>
        </div>
      </div>
      {isDeleteDialogOpen && selectedProductId !== null && (
        <DeleteProductDialog
          productId={selectedProductId}
          priceId={selectedPriceId}
          onClose={handleCloseDialog}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  );
};
export default PrescriptionForm;
