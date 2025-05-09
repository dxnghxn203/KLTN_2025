"use client";
import { useOrder } from "@/hooks/useOrder";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { GoZoomIn } from "react-icons/go";
import SearchProductDialog from "../Dialog/searchProductDialog";
import { FiMinus, FiPlus } from "react-icons/fi";
import { ImBin } from "react-icons/im";
import { useToast } from "@/providers/toastProvider";
import { validateEmptyFields } from "@/utils/validation";
import { original } from "@reduxjs/toolkit";

export default function RequestDetailPage() {
  const {
    fetchGetApproveRequestOrder,
    allRequestOrderApprove,
    fetchApproveRequestOrder,
  } = useOrder();
  const searchParams = useSearchParams();
  const detailId = searchParams.get("chi-tiet");
  const editId = searchParams.get("edit");
  const requestId = detailId || editId;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [requestItem, setRequestItem] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<any[]>([]);
  const toast = useToast();
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [statusApprove, setStatusApprove] = useState<string>("pending");
  const [noteApprove, setNoteApprove] = useState<string>("");
  const [original_price, setOriginalPrice] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const router = useRouter();
  useEffect(() => {
    if (requestItem) return;

    const item = allRequestOrderApprove.find(
      (item: any) => item.request_id === requestId
    );
    if (item) {
      setRequestItem(item);
      fetchGetApproveRequestOrder(
        () => {},
        () => {}
      );
    }
  }, [allRequestOrderApprove, detailId, requestItem]);

  if (!requestItem) return <div>Loading...</div>;

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedProduct((prev) =>
      prev.map((product) =>
        product.product_id === productId
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };
  const handleRemove = (productId: string) => {
    setSelectedProduct((prev) =>
      prev.filter((product) => product.product_id !== productId)
    );
  };
  const updateUnit = (
    productId: string,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedUnit = e.target.value;
    const selectedPrice = selectedProduct
      .find((product) => product.product_id === productId)
      ?.prices.find((price: any) => price.unit === selectedUnit);
    if (selectedPrice) {
      setOriginalPrice(selectedPrice.original_price);
      setPrice(selectedPrice.price);
    }
    setSelectedProduct((prev) =>
      prev.map((product) =>
        product.product_id === productId
          ? {
              ...product,

              price_id: selectedPrice.price_id,
              original_price: selectedPrice.original_price,
              price: selectedPrice.price,
              unit: selectedUnit,
            }
          : product
      )
    );
  };
  const body = {
    request_id: requestItem.request_id,
    status: statusApprove,
    product: selectedProduct.map((product) => ({
      product_id: product.product_id,
      quantity: product.quantity,
      price_id: product.price_id,
    })),
    note: noteApprove,
  };
  const bodyReject = {
    request_id: requestItem.request_id,
    status: statusApprove,
    product: requestItem.product.map((product: any) => ({
      product_id: product.product_id,
      quantity: product.quantity,
      price_id: product.price_id,
    })),
    note: noteApprove,
  };
  console.log("bodyReject", bodyReject);
  console.log("body", body);

  const handleApprove = () => {
    if (statusApprove === "rejected") {
      if (noteApprove === "") {
        toast.showToast("Vui lòng điền lý do từ chối!", "warning");
        return;
      }
      fetchApproveRequestOrder(
        { bodyReject },
        () => {
          toast.showToast("Từ chối yêu cầu thành công", "success");
          router.push("/kiem-duyet-yeu-cau-tu-van-thuoc");
        },
        () => {
          toast.showToast("Từ chối yêu cầu thất bại", "error");
        }
      );
    } else if (statusApprove === "approved") {
      if (selectedProduct.length === 0) {
        toast.showToast("Vui lòng thêm ít nhất 1 sản phẩm!", "warning");
        return;
      }
      fetchApproveRequestOrder(
        { body },
        () => {
          toast.showToast("Duyệt yêu cầu thành công", "success");
          setErrors({});
          router.push("/kiem-duyet-yeu-cau-tu-van-thuoc");
        },
        () => {
          toast.showToast("Duyệt yêu cầu thất bại", "error");
          setErrors({});
        }
      );
    }
  };

  const productUnit = selectedProduct.map((product) =>
    product.prices.map((item: any) => item.unit)
  );
  // console.log("productUnit", productUnit);
  console.log("product", selectedProduct);
  const totalOriginPrice = selectedProduct.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  // totalDiscount = original_price - price
  const totalDiscount = selectedProduct.reduce(
    (total, product) =>
      total + (product.original_price - product.price) * product.quantity,
    0
  );
  const totalSave = totalDiscount;
  const shippingFee = requestItem.shipping_fee;
  const totalAmount = totalDiscount + shippingFee?.shipping_fee || 0;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-black">
        <h1>Chi tiết yêu cầu</h1>
      </h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/create-single-product" className="text-gray-800">
          Chi tiết yêu cầu
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-6">
        {/* Cột trái */}
        <div className="flex flex-col h-full">
          <div className="bg-white shadow-sm rounded-2xl space-y-4 p-4">
            <h4 className="text-lg font-semibold">Thông tin khách hàng</h4>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Mã yêu cầu
                </label>
                <input
                  type="text"
                  value={requestItem.request_id}
                  className="border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600 text-sm"
                  disabled={!!requestId}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-600">
                  Trạng thái yêu cầu
                </label>
                {requestItem.status === "pending" ? (
                  <span className="text-yellow-500 font-semibold text-sm bg-yellow-100 rounded-full px-2 py-1">
                    Đang chờ duyệt
                  </span>
                ) : requestItem.status === "approved" ? (
                  <span className="text-green-500 font-semibold text-sm bg-green-100 rounded-full px-2 py-1">
                    Đã duyệt
                  </span>
                ) : requestItem.status === "rejected" ? (
                  <span className="text-red-500 font-semibold text-sm bg-red-100 rounded-full px-2 py-1">
                    Đã từ chối
                  </span>
                ) : (
                  <span className="text-blue-500 font-semibold text-sm bg-blue-100 rounded-full px-2 py-1">
                    Chưa liên lạc được
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Tên khách hàng
                </label>
                <input
                  className="text-sm border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                  value={requestItem.pick_to.name}
                  disabled={!!requestId}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Số điện thoại
                </label>
                <input
                  className="text-sm border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                  value={requestItem.pick_to.phone_number}
                  disabled={!!requestId}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Email
              </label>
              <input
                className="text-sm border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                value={requestItem.pick_to.email}
                disabled={!!requestId}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Địa chỉ
              </label>
              <input
                className="text-sm border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                value={`${requestItem.pick_to.address.address}, ${requestItem.pick_to.address.ward}, ${requestItem.pick_to.address.district}, ${requestItem.pick_to.address.province}`}
                disabled={!!requestId}
              />
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-2xl p-4 mt-4 flex flex-col gap-4">
            <h4 className="text-lg font-semibold">Sản phẩm cần tư vấn</h4>
            {requestItem.product?.length > 0 ? (
              requestItem.product.map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border rounded-lg p-4 bg-white shadow-sm mb-4"
                >
                  <Image
                    src={product.images_primary}
                    alt={product.product_name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-gray-800">
                      {product.product_name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {product.product_id}
                    </span>
                    <span>Đơn vị: {product.unit}</span>
                    <span>Số lượng: {product.quantity}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="italic text-gray-500">
                Không có thông tin sản phẩm
              </p>
            )}
          </div>
          {editId && (
            <div className="bg-white shadow-sm rounded-2xl space-y-4 p-4 mt-4">
              <div className="w-full font-semibold rounded-lg mb-3">
                Thêm sản phẩm tư vấn
              </div>
              <button
                className="text-sm text-blue-700 bg-[#EAEFFA] w-full py-3.5 rounded-full flex items-center justify-center space-x-2 font-semibold"
                onClick={() => setIsOpen(true)}
              >
                + Thêm sản phẩm/thuốc
              </button>

              {/* </div> */}
              {selectedProduct.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedProduct.map((product: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between gap-3 pb-2 text-sm ${
                        index === selectedProduct.length - 1 ? "" : "border-b"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-4 items-center">
                          <Image
                            src={product.images_primary}
                            alt={product.product_name}
                            width={70}
                            height={70}
                            className="rounded-lg object-cover border p-2"
                          />
                          <span className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
                            {product?.name_primary}
                          </span>
                        </div>

                        <div className="flex">
                          <button
                            onClick={() =>
                              updateQuantity(product.product_id, -1)
                            }
                            className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                          >
                            <FiMinus />
                          </button>
                          <input
                            value={product.quantity}
                            disabled={!!requestId}
                            className="text-center w-8"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(product.product_id, 1)
                            }
                            className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                          >
                            <FiPlus />
                          </button>
                        </div>

                        <select
                          onChange={(e) => updateUnit(product.product_id, e)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          {product?.prices.map((item: any) => (
                            <option key={item.price_id} value={item.unit}>
                              {item.unit}
                            </option>
                          ))}
                        </select>

                        <div className="text-black/50 hover:text-black transition-colors">
                          <button
                            onClick={() => handleRemove(product.product_id)}
                          >
                            <ImBin size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {selectedProduct.length > 0 && (
            <div className="bg-white shadow-sm rounded-2xl p-4 mt-4">
              <div className="flex flex-col mt-4 max-w-full text-sm">
                <h4 className="text-lg font-semibold">Thông tin đơn hàng</h4>

                <div className="">
                  {selectedProduct.map((product: any, index: any) => (
                    <div
                      key={product.product_id}
                      className={`flex items-center py-4 text-sm ${
                        index !== selectedProduct.length - 1
                          ? "border-b border-gray-300"
                          : ""
                      }`}
                    >
                      {/* Cột 1: Hình ảnh + Tên sản phẩm */}
                      <div className="flex items-center space-x-4 w-2/3">
                        <Image
                          src={product.images_primary}
                          alt={product.product_name}
                          width={70}
                          height={70}
                          className="rounded-lg object-cover border p-2"
                        />
                        <span className="text-sm line-clamp-3 overflow-hidden text-ellipsis">
                          {product?.name_primary}
                        </span>
                      </div>

                      {/* Cột 2: Giá gốc và giá khuyến mãi */}
                      <div className="flex justify-end items-center space-x-4 w-1/3">
                        <div className="text-center">
                          <div className="flex flex-col items-center">
                            {product.original_price !== product.price && (
                              <span className="text-gray-500 line-through font-semibold text-sm">
                                {product.original_price.toLocaleString("vi-VN")}
                                đ
                              </span>
                            )}

                            <span className="text-base font-semibold text-[#0053E2]">
                              {product.price.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>

                        {/* Cột 3: Số lượng và đơn vị */}
                        <div className="text-center">
                          x{product.quantity} {product.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-black mt-5">
                  <div>Tổng tiền</div>
                  <div>{totalOriginPrice.toLocaleString("vi-VN")}đ</div>
                </div>
                <div className="flex justify-between text-black mt-5">
                  <div>Giảm giá trực tiếp</div>
                  <div className="text-amber-500">
                    - {totalDiscount.toLocaleString("vi-VN")}đ
                  </div>
                </div>
                <div className="flex justify-between text-black mt-5">
                  <div>Giảm giá voucher</div>
                  <div className="text-amber-500">0đ</div>
                </div>
                <div className="flex justify-between text-black mt-5">
                  <div>Tiết kiệm được</div>
                  <div className="text-amber-500">
                    {totalSave.toLocaleString("vi-VN")}đ
                  </div>
                </div>
              </div>

              <div className="shrink-0 mt-5 max-w-full border-b" />
              <div className="flex justify-between items-center mt-3 max-w-full text-sm text-black ">
                <div>Phí vận chuyển</div>
                <div className="flex items-center gap-2">
                  {shippingFee?.shipping_fee === 0 ? (
                    <div className="flex px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H18a1 1 0 001-1v-4a1 1 0 00-1-1h-8a1 1 0 00-.8.4L8 4H3z" />
                      </svg>
                      <span className="text-xs font-medium text-blue-600">
                        Miễn phí vận chuyển
                      </span>
                    </div>
                  ) : (
                    <div className="text-amber-500">
                      {shippingFee?.shipping_fee?.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                </div>
              </div>
              <div className="shrink-0 mt-3 max-w-full border-b " />
              <div className="flex justify-between items-center mt-3  max-w-full text-sm text-black">
                <div>Thời gian giao hàng dự kiến</div>
                {shippingFee?.delivery_time ? (
                  <div className="flex items-center gap-2">
                    <div className="flex px-3 py-1.5 rounded-full bg-green-50 shadow-sm items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-500 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <span className="text-xs font-medium text-green-600">
                        {new Date(shippingFee.delivery_time).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex gap-5 justify-between items-center mt-3  max-w-full">
                <div className="text-xl text-black">Thành tiền</div>
                <div className="flex gap-2 whitespace-nowrap items-center">
                  {totalDiscount > 0 && (
                    <div className="text-lg text-gray-500 line-through mt-0.5">
                      {totalOriginPrice.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                  <div className="text-xl font-semibold text-blue-700">
                    {(totalAmount + shippingFee?.shipping_fee).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cột phải */}
        <div className=" h-full">
          <div className="bg-white shadow-sm rounded-2xl p-4">
            <h4 className="text-lg font-semibold">Ảnh toa thuốc</h4>
            <div className="flex gap-4">
              {requestItem.images && requestItem.images.length > 0 ? (
                requestItem.images.map((img: any, imgIndex: number) => (
                  <div key={imgIndex} className="mb-4 mt-4">
                    <div className="flex">
                      {/* Hiển thị ảnh */}
                      <div className="relative">
                        <Image
                          src={img.images_url}
                          alt={`Ảnh toa thuốc ${imgIndex + 1}`}
                          className="object-cover rounded-lg border p-2"
                          width={130}
                          height={130}
                        />
                        <div className="absolute bottom-1 right-1 bg-black/40 rounded-full p-1 shadow-md">
                          <GoZoomIn
                            className="w-3 h-3 text-white cursor-pointer"
                            onClick={() => setSelectedImage(img.images_url)}
                          />
                        </div>
                      </div>

                      {/* Phóng to ảnh */}
                      {selectedImage && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="relative bg-white p-4 rounded-lg">
                            <button
                              className="absolute top-2 right-2 text-gray-600 hover:text-black"
                              onClick={() => setSelectedImage(null)}
                            >
                              <X size={24} />
                            </button>
                            <Image
                              src={selectedImage}
                              alt="Phóng to ảnh toa thuốc"
                              width={600}
                              height={600}
                              className="max-h-[80vh] object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Không có ảnh toa thuốc
                </p>
              )}
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-2xl p-4 mt-4">
            <h4 className="text-lg font-semibold mb-1">Ghi chú</h4>
            <h5 className="text-sm mb-4 text-gray-500">
              (Nếu từ chối yêu cầu, vui lòng ghi rõ lý do)
            </h5>
            {detailId && (
              <textarea
                className="border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                value={requestItem.note}
                disabled={!!requestId}
                rows={6}
              ></textarea>
            )}
            {editId && (
              <textarea
                className="border rounded-lg p-2 w-full focus:border-blue-600 focus:ring-blue-600"
                value={noteApprove}
                onChange={(e) => {
                  setNoteApprove(e.target.value);
                }}
                rows={6}
              ></textarea>
            )}
            {errors.note && (
              <p className="text-red-500 text-sm">{errors.note}</p>
            )}

            {editId && (
              <div>
                <h4 className="text-lg font-semibold mt-4">Trạng thái duyệt</h4>

                <select
                  className="border rounded-lg mt-2 p-2 w-full focus:border-blue-600 focus:ring-blue-600 focus:ring-2"
                  value={statusApprove}
                  onChange={(e) => {
                    setStatusApprove(e.target.value);
                  }}
                >
                  <option value="pending">Chọn trạng thái</option>
                  <option value="approved">Duyệt</option>
                  <option value="rejected">Từ chối</option>
                  <option value="uncontacted">Chưa liên lạc được</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      {editId && (
        <div className="mt-4 flex justify-end gap-4 w-full">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 font-medium"
            onClick={handleApprove}
          >
            Duyệt yêu cầu
          </button>
        </div>
      )}

      <SearchProductDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSelectProduct={(product) => {
          if (
            selectedProduct.some((p) => p.product_id === product.product_id)
          ) {
            toast.showToast("Sản phẩm đã được thêm", "error");
            return;
          }
          const defaultPrice = product.prices?.[0];
          const defaultUnit = defaultPrice?.price_id;
          // const selectedPrice = product.prices.find(
          //   (price: any) => price.price_id === defaultUnit
          // );
          // if (!selectedPrice) return;

          setSelectedProduct((prev) => [
            ...prev,
            {
              ...product,
              quantity: quantity,
              price_id: defaultUnit,
              original_price: defaultPrice.original_price,
              price: defaultPrice.price,
              unit: defaultPrice.unit,
            },
          ]);
        }}
      />
    </div>
  );
}
