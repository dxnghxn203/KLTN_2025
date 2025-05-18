"use client";
import CartEmpty from "@/components/Cart/emptyCart";
import ShoppingCart from "@/components/Cart/shoppingCart";
import ProductsViewedList from "@/components/Product/productsViewedList";
import {useCart} from "@/hooks/useCart";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
import React, {useEffect, useState, useRef} from "react";
import Loading from "../loading";
import Checkout from "@/components/Checkout/checkout";
import {useOrder} from "@/hooks/useOrder";
import {useToast} from "@/providers/toastProvider";
import LoaingCenter from "@/components/loading/loading";
import QRPayment from "@/components/Checkout/qrPayment";
import OutOfStock from "@/components/Checkout/outOfStock";

export default function Cart() {
    const {cart, getProductFromCart} = useCart();
    const [loadingGetCart, setLoadingGetCart] = useState(false);

    // Reference to ShoppingCart component to access its methods
    const shoppingCartRef = useRef<any>(null);

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
    }, []);

    const [isCheckout, setIsCheckout] = useState(false);
    const [productForCheckOut, setProductForCheckOut] = useState<any[]>([]);
    const [data, setData] = useState<any>({});
    const {checkOrder, checkShippingFee} = useOrder();
    const toast = useToast();
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [isQR, setIsQR] = useState(false);
    const [orderID, setOrderID] = useState<string | null>(null);
    const [priceOrder, setPriceOrder] = useState<any | null>(null);
    const [imageQR, setImageQR] = useState<any>(null);
    const [isCOD, setIsCOD] = useState(false);
    const [isOutOfStock, setIsOutOfStock] = useState(false);
    const [productsOutOfStock, setProductsOutOfStock] = useState<any>([])
    const [isLoadingCheckFee, setIsLoadingCheckFee] = useState(false);

    // Function to trigger showing similar products through the ShoppingCart component
    const handleShowSimilarProducts = (product: any) => {
        // Close the OutOfStock dialog
        setIsOutOfStock(false);

        // Use a small timeout to ensure proper render sequence
        setTimeout(() => {
            // Access the ShoppingCart's method to show similar products
            if (shoppingCartRef.current && shoppingCartRef.current.handleShowSimilarProducts) {
                shoppingCartRef.current.handleShowSimilarProducts(product);
            }
        }, 100);
    };

    const validateData = () => {
        if (!data || !data?.ordererInfo || !data?.addressInfo) {
            return false;
        }
        const orderInf = data?.ordererInfo;
        const addressInf = data?.addressInfo;
        if (!orderInf || !orderInf.fullName || !orderInf.phone || !orderInf.email) {
            return false;
        }
        return !(!addressInf ||
            !addressInf.address ||
            !addressInf.cityCode ||
            !addressInf.districtCode ||
            !addressInf.wardCode);
    };

    const [shippingFee, setShippingFee] = useState<any>({});

    const checkShippingFeeUI = () => {
        if (!validateData()) {
            return;
        }
        setProductsOutOfStock([])
        setIsLoadingCheckFee(true)
        checkShippingFee(
            {
                orderData: {
                    product: productForCheckOut,
                    ...data,
                },
            },
            (data: any) => {
                setIsLoadingCheckFee(false)
                if (data) {
                    setShippingFee(data);
                }
            },
            (error: any) => {
                setIsLoadingCheckFee(false)
                setIsOutOfStock(error.isOutOfStock)
                setProductsOutOfStock(error?.data)
                closeQR()
                toast.showToast("Lỗi khi kiểm tra phí vận chuyển", error.message);
            }
        );
    };

    useEffect(() => {
        checkShippingFeeUI();
    }, [data]);

    const checkOrderStatus = () => {
        if (!validateData()) {
            toast.showToast("Vui lòng nhập đầy đủ thông tin", "error");
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
        );
    };
    const handleCheckout = () => {
        checkOrderStatus();
    };

    const calculateCartTotals = () => {
        let total_original_price = 0;
        let total_price = 0;
        let total_discount = 0;
        productForCheckOut.forEach((product) => {
            const {quantity = 0, price = 0, original_price = 0, unit_price} = product;
            const calculated_unit_price = unit_price !== undefined ? unit_price : original_price;
            if (quantity > 0 && calculated_unit_price >= 0 && price >= 0) {
                total_original_price += calculated_unit_price * quantity; // Original price before discount
                total_price += price * quantity;                         // Price after discount
                total_discount += (calculated_unit_price - price) * quantity; // Discount amount
            }
        });
        return {
            total_original_price: total_original_price || 0,
            total_price: total_price || 0,
            total_discount: total_discount || 0,
        };
    };

    const closeQR = () => {
        setIsQR(false);
        setIsCheckout(false);
        setProductForCheckOut([]);
        setLoadingCheckout(false);
        setImageQR(null);
    };

    // Current date and user information
    const currentDateTime = "2025-05-17 17:30:06";
    const currentUser = "dxnghxn203";

    return (
        <div className="flex flex-col items-center pb-12 bg-white pt-[80px]">
            {isQR && orderID && imageQR && productForCheckOut ? (
                <QRPayment
                    image={imageQR}
                    order_id={orderID}
                    price={calculateCartTotals()}
                    setClose={closeQR}
                />
            ) : (
                <>
                    {isCheckout ? (
                        <>
                            <Checkout
                                back={() => setIsCheckout(false)}
                                price={calculateCartTotals()}
                                productForCheckOut={productForCheckOut}
                                setData={setData}
                                handleCheckout={handleCheckout}
                                shippingFee={shippingFee}
                            />
                            {loadingCheckout && <LoaingCenter/>}
                        </>
                    ) : (
                        <main className="flex flex-col space-y-8 w-full">
                            <div className="flex flex-col px-5 ">
                                <div className="pt-14">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center text-[#0053E2] hover:text-[#002E99] transition-colors"
                                    >
                                        <ChevronLeft size={20}/>
                                        <span>Tiếp tục mua sắm</span>
                                    </Link>
                                </div>
                                {loadingGetCart ? (
                                    <Loading/>
                                ) : (
                                    <>
                                        {cart && cart?.length ? (
                                            <ShoppingCart
                                                ref={shoppingCartRef}
                                                cart={cart}
                                                setIsCheckout={setIsCheckout}
                                                setProductForCheckOut={setProductForCheckOut}
                                                setPriceOrder={setPriceOrder}
                                            />
                                        ) : (
                                            <CartEmpty/>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="self-start text-2xl font-extrabold text-black px-5">
                                Sản phẩm vừa xem
                            </div>
                            <div className="px-5">
                                <ProductsViewedList/>
                            </div>
                        </main>
                    )}
                </>
            )}

            {/* OutOfStock component */}
            {isOutOfStock && (
                <OutOfStock
                    products={productsOutOfStock}
                    onContinue={() => {
                        setIsOutOfStock(false);
                        setIsCheckout(true);
                        setProductForCheckOut(productsOutOfStock?.availableProducts);
                    }}
                    closeDialog={(isClose: boolean) => {
                        setIsOutOfStock(isClose);
                    }}
                    onShowSimilarProducts={handleShowSimilarProducts}
                />
            )}

            {isLoadingCheckFee && <LoaingCenter/>}
        </div>
    );
}