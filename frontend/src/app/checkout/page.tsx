"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import OrderSummary from "@/components/Checkout/ProductInfo/orderSumary";
import Footer from "@/components/Footer/footer";
import Header from "@/components/Header/header";
import Image, { StaticImageData } from "next/image";
import Delivery from "@/components/Checkout/CheckoutInfo/pickupPharma";
import ProductList from "@/components/Checkout/ProductInfo/productList";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product";
import { useOrder } from "@/hooks/useOrder";
import sepay_qr_ORDER7NS1742504401 from "@/images/sepay_qr_ORDER7NS1742504401.png";

const ShoppingCart: React.FC = () => {
  const { cartLocal, cartSelected } = useCart();

  const products: Product[] = useMemo(() => {
    return cartLocal
      .filter((product) => cartSelected.includes(product.id.toString()))
      .map((product) => ({
        id: product.id,
        name: product.name,
        imageSrc: product.imageSrc,
        price: product.price,
        originPrice: product.originPrice,
        quantity: product.quantity,
        unit: product.unit,
        discount: (product.originPrice - product.price).toString(),
      }));
  }, [cartLocal, cartSelected]);

  const totalAmount = useMemo(() => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }, [products]);

  const totalOriginPrice = useMemo(() => {
    return products.reduce((total, product) => {
      return total + product.originPrice * product.quantity;
    }, 0);
  }, [products]);

  const value = totalOriginPrice - totalAmount;
  const totalDiscount = value > 0 ? value : 0;
  const totalSave = totalDiscount;

  const { checkOrder } = useOrder();
  const checkout = () => {
    const infor = {
      orderData: {
        product: products,
        ...data,
      },
    };
    checkOrder(
      infor,
      (data: any) => {
        console.log("Order success");
        setShowSuccessModal(true);
      },
      () => {
        console.error("Order failed:");
      }
    );
  };

  const [data, setData] = useState<any>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<StaticImageData | string | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (typeof qrCodeData === "string" && qrCodeData.startsWith("blob:")) {
        URL.revokeObjectURL(qrCodeData);
      }
    };
  }, [qrCodeData]);

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      {/* <Header /> */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Thanh toán!</h3>
              <p className="mb-4">
                Cảm ơn bạn đã đặt hàng. Vui lòng sử dụng mã QR để thanh toán.
              </p>
              <div className="flex justify-center mb-4">
                <Image
                  src={sepay_qr_ORDER7NS1742504401}
                  className="ml-4 rounded-lg border border-stone-300"
                  alt={"QR code"}
                />
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex flex-col px-5">
        <div className="flex flex-col">
          <div className="pt-14">
            <Link
              href="/cart"
              className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Quay lại giỏ hàng</span>
            </Link>
          </div>
          <h3 className="font-semibold mt-2 mb-3 ml-4">Sản phẩm đã chọn</h3>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 rounded-xl">
            <ProductList products={products} />
            <Delivery setData={setData} />
          </div>
          <OrderSummary
            totalAmount={totalAmount}
            totalOriginPrice={totalOriginPrice}
            totalDiscount={totalDiscount}
            totalSave={totalSave}
            checkout={checkout}
          />
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;
