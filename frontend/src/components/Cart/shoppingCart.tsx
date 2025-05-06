"use client";
import React, {useState, useMemo} from "react";
import {ImBin} from "react-icons/im";
import Image from "next/image";
import DeleteProductDialog from "@/components/Dialog/deleteProductDialog";
import OrderSummary from "@/components/Cart/orderSumary";
import {useCart} from "@/hooks/useCart";
import {useToast} from "@/providers/toastProvider";
import {getPriceFromProduct} from "@/utils/price";

const ShoppingCart = ({
                          cart,
                          setIsCheckout,
                          setProductForCheckOut,
                          setPriceOrder,
                      }: any) => {
    const [selectedProducts, setSelectedProducts] = useState<{ product_id: string; price_id: string }[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedProductId, setSelectedProductId] = useState<string | null>(
        null
    );
    const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

    const {addProductTocart, getProductFromCart, removeProductFromCart} =
        useCart();
    const toast = useToast();

    const [loadingGetCart, setLoadingGetCart] = useState(false);

    const getCart = () => {
        setLoadingGetCart(true);
        getProductFromCart(
            () => {
                setLoadingGetCart(false);
            },
            (error: string) => {
                setLoadingGetCart(false);
            }
        );
    };
    const getPrice = (product: any, price_id: any) => {
        return getPriceFromProduct(product, price_id);
    };

    const getProductForCheckOut = () => {
        const selectedProductsData = cart.filter((item: any) =>
            selectedProducts.some(
                (selected) =>
                    selected.product_id === item.product.product_id &&
                    selected.price_id === item.price_id
            )
        );

        let products: any[] = [];
        selectedProductsData.forEach((item: any) => {
            const price = getPrice(item.product, item.price_id);
            if (price) {
                products.push({
                    product_id: item.product.product_id,
                    product_name: item.product.product_name,
                    image: item.product.images_primary,
                    price_id: item.price_id,
                    quantity: item.quantity,
                    price: price.price,
                    unit_price: price.unit_price,
                    unit: price.unit,
                    original_price: price.original_price,
                });
            }
        });

        return products;
    };

    const calculateCartTotals = useMemo(() => {
        let total_original_price = 0;
        let total_price = 0;
        let total_discount = 0;
        selectedProducts.forEach((selected) => {
            const cartItem = cart.find(
                (item: any) =>
                    item.product.product_id === selected.product_id && item.price_id === selected.price_id
            );

            if (cartItem) {
                const priceDetail = cartItem.product.prices.find(
                    (price: any) => price.price_id === cartItem.price_id
                );

                if (priceDetail) {
                    const quantity = cartItem.quantity;
                    total_price += priceDetail.price * quantity;
                    total_original_price += priceDetail.original_price * quantity;
                    total_discount += (priceDetail.original_price - priceDetail.price) * quantity;
                }
            }
        });

        setPriceOrder({
            total_original_price,
            total_price,
            total_discount,
        });

        return {
            total_original_price,
            total_price,
            total_discount,
        };
    }, [selectedProducts, cart]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allProducts = cart.map((item: any) => ({
                product_id: item.product.product_id,
                price_id: item.price_id,
            }));
            setSelectedProducts(allProducts);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (product_id: string, price_id: string) => {
        setSelectedProducts((prevSelected) => {
            const exists = prevSelected.some((item) => item.product_id === product_id && item.price_id === price_id);

            if (exists) {
                return prevSelected.filter((item) => !(item.product_id === product_id && item.price_id === price_id));
            } else {
                return [...prevSelected, {product_id, price_id}];
            }
        });
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

    const handleQuantityChange = (
        id: string,
        price_id: string,
        change: number
    ) => {
        addProductTocart(
            id,
            price_id,
            change,
            () => {
                toast.showToast("Cập nhật thành công", "success");
                getCart();
            },
            (error: string) => {
                toast.showToast("Cập nhật thất bại", "error");
            }
        );
    };

    const handleUnitChange = (
        id: string,
        newUnit: string,
        quantity: any,
        old_unit: string
    ) => {
        addProductTocart(
            id,
            newUnit,
            quantity,
            () => {
                removeProductFromCart(
                    id,
                    old_unit,
                    () => {
                        toast.showToast("Cập nhật thành công", "success");
                        getCart();
                    },
                    (error: string) => {
                        console.log(error);
                    }
                );
            },
            (error: string) => {
                console.log(error);
                toast.showToast("Cập nhật thất bại", "error");
            }
        );
    };

    const checkout = () => {
        setIsCheckout(true);
        setProductForCheckOut(getProductForCheckOut());
    };

    const renderPrice = (product: any, price_id: any) => {
        const price = getPrice(product.product, price_id);
        return (
            <>
                <div className="w-[15%] text-center flex flex-col items-center">
          <span className="text-lg font-semibold text-[#0053E2]">
            {price.price.toLocaleString("vi-VN")}đ
          </span>
                    {price.original_price !== price.price && price.original_price > 0 && (
                        <span className="text-sm text-gray-500 line-through font-semibold">
              {price?.original_price.toLocaleString("vi-VN")} đ
            </span>
                    )}
                </div>
                <div className="w-[15%] text-center flex items-center justify-center gap-2">
                    <button
                        onClick={() => {
                            handleQuantityChange(
                                product.product.product_id,
                                product.price_id,
                                -1
                            );
                        }}
                        className="px-2 py-1 border rounded disabled:cursor-not-allowed"
                        disabled={product.quantity === 1}
                    >
                        -
                    </button>
                    {product.quantity}
                    <button
                        onClick={() => {
                            handleQuantityChange(
                                product.product.product_id,
                                product.price_id,
                                1
                            );
                        }}
                        className="px-2 py-1 border rounded"
                    >
                        +
                    </button>
                </div>
                <div className="w-[15%] text-center">
                    <select
                        className="border rounded px-2 py-1"
                        value={price?.price_id}
                        onChange={(e) =>
                            handleUnitChange(
                                product.product.product_id,
                                e.target.value,
                                product.quantity,
                                price?.price_id
                            )
                        }
                    >
                        {product?.product?.prices &&
                            product?.product?.prices.map((price: any) => (
                                <option key={price?.price_id} value={price?.price_id}>
                                    {price?.unit}
                                </option>
                            ))}
                    </select>
                </div>
            </>
        );
    };


    return (
        <>
            <div className="flex pt-4 flex-col lg:flex-row gap-6 justify-center">
                <div
                    className="flex-col bg-[#F5F7F9] rounded-xl w-full "
                    style={{height: `${cart && cart?.length * 20}%`}}
                >
                    <div
                        className="flex px-4 items-center justify-between border-b border-black border-opacity-10 text-sm text-black font-medium">
                        <div className="w-[55%] p-5 flex items-center">
                            <input
                                type="checkbox"
                                id="select-all"
                                className="peer hidden"
                                checked={cart && selectedProducts.length === cart?.length}
                                onChange={handleSelectAll}
                            />
                            <label
                                htmlFor="select-all"
                                className="w-5 h-5 text-transparent peer-checked:text-white border border-gray-400 rounded-full flex items-center justify-center cursor-pointer peer-checked:bg-[#0053E2] peer-checked:border-[#0053E2]"
                            >
                                &#10003;
                            </label>

                            <label htmlFor="select-all" className="ml-4 cursor-pointer">
                                Chọn tất cả ({selectedProducts.length}/{cart?.length})
                            </label>
                        </div>
                        <div className="w-[15%] text-center">Giá thành</div>
                        <div className="w-[15%] text-center">Số lượng</div>
                        <div className="w-[15%] text-center">Đơn vị</div>
                        <div className="w-[15%] text-center"></div>
                    </div>

                    <div
                        className={` ${
                            loadingGetCart ? "pointer-events-none opacity-50" : ""
                        }`}
                    >
                        {cart &&
                            cart?.map((product: any, index: any) =>
                                (
                                    <div
                                        key={`product-${product.product.product_id}-${product.price_id}`}
                                        className={`flex items-center justify-between py-4 mx-5 text-sm ${
                                            index !== cart?.length - 1 ? "border-b border-gray-300" : ""
                                        }`}
                                    >
                                        <div className="w-[55%] flex items-center px-4 py-2">
                                            <label
                                                htmlFor={`product-${product.product.product_id}-${product.price_id}`}
                                                className="flex items-center justify-center w-5 h-5 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`product-${product.product.product_id}-${product.price_id}`}
                                                    className="peer hidden"
                                                    checked={selectedProducts.some((item) => item.product_id === product.product.product_id && item.price_id === product.price_id)}

                                                    onChange={() => {
                                                        handleSelectProduct(
                                                            product.product.product_id,
                                                            product.price_id
                                                        )
                                                    }
                                                    }
                                                />
                                                <span
                                                    className="w-5 h-5 text-transparent peer-checked:text-white border border-gray-400 rounded-full flex items-center justify-center transition-all peer-checked:bg-[#0053E2] peer-checked:border-[#0053E2]">
                        ✓
                      </span>
                                            </label>
                                            <Image
                                                src={product?.product?.images_primary}
                                                alt={product.product?.product_name || "Product Image"}
                                                width={55}
                                                height={55}
                                                className="ml-4 p-1 rounded-lg border border-stone-300"
                                            />
                                            <span className="ml-2 line-clamp-3 overflow-hidden text-ellipsis">
                      {product?.product?.product_name}
                    </span>
                                        </div>
                                        {renderPrice(product, product.price_id)}

                                        <div
                                            className="w-[15%] text-center text-black/50 hover:text-black transition-colors">
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        product.product.product_id,
                                                        product.price_id
                                                    )
                                                }
                                            >
                                                <ImBin size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>

                <OrderSummary
                    totalAmount={calculateCartTotals?.total_price || 0}
                    totalOriginPrice={calculateCartTotals?.total_original_price || 0}
                    totalDiscount={calculateCartTotals?.total_discount || 0}
                    totalSave={calculateCartTotals?.total_discount || 0}
                    checkout={checkout}
                />

                {isDeleteDialogOpen && selectedProductId !== null && (
                    <DeleteProductDialog
                        productId={selectedProductId}
                        priceId={selectedPriceId}
                        onClose={handleCloseDialog}
                        onConfirm={() => {
                            removeProductFromCart(
                                selectedProductId,
                                selectedPriceId,
                                () => {
                                    toast.showToast("Xóa sản phẩm thành công", "success");
                                    getCart();
                                },
                                (error: string) => {
                                    toast.showToast("Xóa sản phẩm thất bại", "error");
                                }
                            );
                            handleCloseDialog();
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default ShoppingCart;
