"use client";
import CartEmpty from "@/components/Cart/emptyCart";
import ShoppingCart from "@/components/Cart/shoppingCart";
import ProductsViewedList from "@/components/Product/productsViewedList";
import { useCart } from "@/hooks/useCart";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import Loading from "../loading";
import Checkout from "@/components/Checkout/checkout";
import { useOrder } from "@/hooks/useOrder";
import { useToast } from "@/providers/toastProvider";
import LoaingCenter from "@/components/loading/loading";
import QRPayment from "@/components/Checkout/qrPayment";

export default function Cart() {
  const { cart, getProductFromCart } = useCart();

  const [loadingGetCart, setLoadingGetCart] = useState(false);

  const fetchingCart = () => {
    setLoadingGetCart(true);
    getProductFromCart(
      () => {
        setLoadingGetCart(false);
      },
      (error: string) => {
        setLoadingGetCart(false);
        console.error(error);
      }
    );
  };
  useEffect(() => {
    fetchingCart();
  }
    , []);

  const [isCheckout, setIsCheckout] = useState(false);
  const [productForCheckOut, setProductForCheckOut] = useState<any[]>([]);
  const [data, setData] = useState<any>({});
  const { checkOrder } = useOrder();
  const toast = useToast();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [isQR, setIsQR] = useState(false);
  const [orderID, setOrderID] = useState<string | null>(null);
  const [priceOrder, setPriceOrder] = useState<any | null>(null);
  const [imageQR, setImageQR] = useState<any>(null);
  const [isCOD, setIsCOD] = useState(false);

  const validateData = () => {
    const orderInf = data?.ordererInfo;
    const addressInf = data?.addressInfo;
    if (!orderInf.fullName || !orderInf.phone) {
      toast.showToast("Vui lòng nhập đầy đủ thông tin", "error");
      return false;
    }

    if (!addressInf.address || !addressInf.cityCode || !addressInf.districtCode || !addressInf.wardCode) {
      toast.showToast("Vui lòng chọn địa chỉ giao hàng", "error");
      return false;
    }
    return true;
  }
  const checkOrderStatus = () => {
    if (!validateData()) {
      return;
    }
    setLoadingCheckout(true);
    checkOrder(
      {
        orderData: {
          product: productForCheckOut,
          ...data,
        },
      },
      (data: any) => {
        toast.showToast("Đặt hàng thành công", "success");
        if (data && data?.order_id) {
          setOrderID(data?.order_id);
          if (data.isQR && data?.qr_code && data?.qr_code !== "") {
            setIsQR(true);
            setImageQR(data?.qr_code);
          }
        }
        if (data && data?.order_id && !data.isQR) {
          fetchingCart();
          setIsCOD(true);
          setIsCheckout(false);
        }
        setLoadingCheckout(false);
      },
      (error: any) => {
        toast.showToast("Đặt hàng thất bại", error);
        setLoadingCheckout(false);
      }
    )
  }
  const handleCheckout = () => {
    checkOrderStatus();
  };

  const closeQR = () => {
    setIsQR(false);
    setIsCheckout(false);
    setProductForCheckOut([]);
    setLoadingCheckout(false);
    setImageQR(null);
  }

  return (
    <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
      {
        isQR && orderID && imageQR && productForCheckOut ? (
          <QRPayment image={imageQR} order_id={orderID} price={priceOrder} setClose={closeQR} />
        ) : (
          <>
            {
              isCheckout ? (
                <>
                  <Checkout back={() => setIsCheckout(false)} price={priceOrder} productForCheckOut={productForCheckOut} setData={setData} handleCheckout={handleCheckout} />
                  {
                    loadingCheckout && <LoaingCenter />
                  }
                </>
              ) : (
                <main className="flex flex-col space-y-8 w-full">
                  <div className="flex flex-col px-5 ">
                    <div className="pt-14">
                      <Link
                        href="/"
                        className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
                      >
                        <ChevronLeft size={20} />
                        <span>Tiếp tục mua sắm</span>
                      </Link>
                    </div>
                    {
                      loadingGetCart ? (
                        <Loading />
                      ) : (
                        <>
                          {cart && cart?.length ? <ShoppingCart cart={cart} setIsCheckout={setIsCheckout} setProductForCheckOut={setProductForCheckOut} setPriceOrder={setPriceOrder} /> : <CartEmpty />}
                        </>
                      )}
                  </div>

                  <div className="self-start text-2xl font-extrabold text-black px-5">
                    Sản phẩm vừa xem
                  </div>
                  <div className="px-5">
                    <ProductsViewedList />
                  </div>
                </main>
              )
            }
          </>
        )
      }
    </div>
  );
}
