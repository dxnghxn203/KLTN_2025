"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ImBin } from "react-icons/im";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import DeleteProductDialog from "@/components/Dialog/deleteProductDialog";
import OrderSummary from "@/components/Cart/orderSumary";
import SimilarProductsList from "@/components/Cart/similarProductsList";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/providers/toastProvider";
import { getPriceFromProduct } from "@/utils/price";
import { getAvailableProduct } from "@/services/productService";
import clsx from "clsx";

const ShoppingCart = forwardRef(
  (
    {
      cart,
      setIsCheckout,
      setProductForCheckOut,
      setPriceOrder,
      setVouchers,
      shippingFee,
    }: any,
    ref
  ) => {
    const [selectedProducts, setSelectedProducts] = useState<
      { product_id: string; price_id: string }[]
    >([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSimilarProductsOpen, setIsSimilarProductsOpen] = useState(false);
    const [currentProductForSimilar, setCurrentProductForSimilar] =
      useState<any>(null);
    const [openDropdowns, setOpenDropdowns] = useState<{
      [key: string]: boolean;
    }>({});
    const [availableQuantities, setAvailableQuantities] = useState<{
      [key: string]: number | null;
    }>({});
    const [loadingQuantities, setLoadingQuantities] = useState<{
      [key: string]: boolean;
    }>({});

    const [selectedProductId, setSelectedProductId] = useState<string | null>(
      null
    );
    const [vouchersCart, setVouchersCart] = useState<any>({});

    const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
    const [inputQuantities, setInputQuantities] = useState<{
      [key: string]: number;
    }>({});
    const { addProductTocart, getProductFromCart, removeProductFromCart } =
      useCart();
    const toast = useToast();
    const [loadingGetCart, setLoadingGetCart] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useImperativeHandle(ref, () => ({
      handleShowSimilarProducts: (product: any) => {
        setCurrentProductForSimilar(product);
        setIsSimilarProductsOpen(true);
      },
    }));

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
          if (ref && !ref.contains(event.target as Node)) {
            setOpenDropdowns((prev) => ({ ...prev, [key]: false }));
          }
        });
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    useEffect(() => {
      if (cart && cart.length > 0) {
        cart.forEach((item: any) => {
          fetchAvailableQuantity(item.product.product_id, item.price_id);
        });
      }
    }, [cart]);

    const changeSelectVouhcher = (voucher: any) => {
      setVouchersCart(voucher);
      setVouchers(voucher);
    };

    const fetchAvailableQuantity = async (
      productId: string,
      priceId: string
    ) => {
      const key = `${productId}-${priceId}`;

      if (loadingQuantities[key]) return;

      setLoadingQuantities((prev) => ({ ...prev, [key]: true }));

      try {
        const response = await getAvailableProduct(productId, priceId);

        if (response.status_code === 200 && response.data !== null) {
          setAvailableQuantities((prev) => ({ ...prev, [key]: response.data }));
        } else {
          setAvailableQuantities((prev) => ({ ...prev, [key]: null }));
        }
      } catch (error) {
        console.error("Error fetching available quantity:", error);
        setAvailableQuantities((prev) => ({ ...prev, [key]: null }));
      } finally {
        setLoadingQuantities((prev) => ({ ...prev, [key]: false }));
      }
    };

    const handleDebouncedQuantityChange = (
      productId: string,
      priceId: string,
      newQuantity: number,
      oldQuantity: number
    ) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (newQuantity !== oldQuantity) {
          handleQuantityChange(productId, priceId, newQuantity - oldQuantity);
        }
      }, 500);
    };

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
            item.product.product_id === selected.product_id &&
            item.price_id === selected.price_id
        );

        if (cartItem) {
          const priceDetail = cartItem.product.prices.find(
            (price: any) => price.price_id === cartItem.price_id
          );

          if (priceDetail) {
            const quantity = cartItem.quantity;
            total_price += priceDetail.price * quantity;
            total_original_price += priceDetail.original_price * quantity;
            total_discount +=
              (priceDetail.original_price - priceDetail.price) * quantity;
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
        const exists = prevSelected.some(
          (item) => item.product_id === product_id && item.price_id === price_id
        );

        if (exists) {
          return prevSelected.filter(
            (item) =>
              !(item.product_id === product_id && item.price_id === price_id)
          );
        } else {
          return [...prevSelected, { product_id, price_id }];
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

    const handleShowSimilarProducts = (product: any) => {
      setCurrentProductForSimilar(product);
      setIsSimilarProductsOpen(true);
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
      fetchAvailableQuantity(id, newUnit);

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
    };

    useEffect(() => {
      if (selectedProducts) {
        setProductForCheckOut(getProductForCheckOut());
      }
    }, [selectedProducts]);

    const calculateTotalPrice = (price: number, quantity: number) => {
      return price * quantity;
    };

    const toggleDropdown = (productId: string) => {
      setOpenDropdowns((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
    };

    const renderPrice = (product: any, price_id: any) => {
      const price = getPrice(product.product, price_id);
      const productId = product.product.product_id;
      const dropdownKey = `${productId}-${price_id}`;
      const availableQuantity = availableQuantities[dropdownKey];
      const isLoadingQuantity = loadingQuantities[dropdownKey];

      return (
        <>
          <div className="w-[12%] text-center flex flex-col items-center">
            <span className="text-lg font-semibold text-[#0053E2]">
              {price?.price.toLocaleString("vi-VN")}đ
            </span>
            {price.original_price !== price.price &&
              price.original_price > 0 && (
                <span className="text-sm text-gray-500 line-through font-semibold">
                  {price?.original_price.toLocaleString("vi-VN")}đ
                </span>
              )}
          </div>
          <div className="w-[12%] text-center flex items-center justify-center gap-2">
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

            <input
              value={
                inputQuantities[`${product.product.product_id}`] ??
                product.quantity
              }
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const newQuantity = isNaN(value) || value <= 0 ? 1 : value;

                setInputQuantities((prev) => ({
                  ...prev,
                  [`${product.product.product_id}`]: newQuantity,
                }));

                handleDebouncedQuantityChange(
                  product.product.product_id,
                  product.price_id,
                  newQuantity,
                  product.quantity
                );
              }}
              className="w-14 text-center border rounded px-2 py-1"
            />

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

          <div
            className="w-[12%] text-center relative flex flex-col"
            ref={(el) => {
              dropdownRefs.current[dropdownKey] = el;
            }}
          >
            <div
              className="border rounded px-2 py-1 cursor-pointer flex justify-between items-center bg-white"
              onClick={() => toggleDropdown(dropdownKey)}
            >
              <span>{price?.unit}</span>
              <svg
                className="h-4 w-4 text-gray-400 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {isLoadingQuantity ? (
              <div className="text-xs text-gray-500 mt-1">Đang tải...</div>
            ) : availableQuantity !== null &&
              availableQuantity !== undefined &&
              availableQuantity <= 10 ? (
              <div className="text-xs text-gray-500 mt-1">
                <span
                  className={
                    availableQuantity < 10 ? "text-orange-500 font-medium" : ""
                  }
                >
                  Còn {availableQuantity} {price?.unit}
                </span>
              </div>
            ) : null}

            {openDropdowns[dropdownKey] && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto top-9">
                {product?.product?.prices &&
                  product?.product?.prices.map((priceOption: any) => (
                    <div
                      key={priceOption.price_id}
                      className={clsx(
                        "px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm",
                        priceOption.price_id === price_id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-900"
                      )}
                      onClick={() => {
                        if (priceOption.price_id !== price_id) {
                          handleUnitChange(
                            product.product.product_id,
                            priceOption.price_id,
                            product.quantity,
                            price?.price_id
                          );
                        }
                        toggleDropdown(dropdownKey);
                      }}
                    >
                      {priceOption.unit} -{" "}
                      {priceOption.price.toLocaleString("vi-VN")}đ
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="w-[12%] text-center font-semibold text-[#0053E2]">
            {calculateTotalPrice(price?.price, product.quantity).toLocaleString(
              "vi-VN"
            )}
            đ
          </div>
        </>
      );
    };

    return (
      <>
        <div className="flex pt-4 flex-col lg:flex-row gap-6 justify-center">
          <div
            className="flex-col bg-[#F5F7F9] rounded-xl w-full "
            style={{ height: `${cart && cart?.length * 20}%` }}
          >
            <div className="flex px-4 items-center justify-between border-b border-black border-opacity-10 text-sm text-black font-medium">
              <div className="w-[40%] p-5 flex items-center">
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
              <div className="flex justify-between w-[60%]">
                <div className="text-center">Giá thành</div>
                <div className="text-center">Số lượng</div>
                <div className="text-center">Đơn vị</div>
                <div className="text-center">Thành tiền</div>
                <div className="text-center"></div>
              </div>
            </div>

            <div
              className={` ${
                loadingGetCart ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {cart &&
                cart?.map((product: any, index: any) => (
                  <div
                    key={`product-${product.product.product_id}-${product.price_id}`}
                    className={`flex items-center justify-between py-4 mx-5 text-sm ${
                      index !== cart?.length - 1
                        ? "border-b border-gray-300"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center px-4 py-2 w-[40%]">
                        <label
                          htmlFor={`product-${product.product.product_id}-${product.price_id}`}
                          className="flex items-center justify-center w-5 h-5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            id={`product-${product.product.product_id}-${product.price_id}`}
                            className="peer hidden"
                            checked={selectedProducts.some(
                              (item) =>
                                item.product_id ===
                                  product.product.product_id &&
                                item.price_id === product.price_id
                            )}
                            onChange={() => {
                              handleSelectProduct(
                                product.product.product_id,
                                product.price_id
                              );
                            }}
                          />
                          <span className="w-5 h-5 text-transparent peer-checked:text-white border border-gray-400 rounded-full flex items-center justify-center transition-all peer-checked:bg-[#0053E2] peer-checked:border-[#0053E2]">
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
                          {product?.product?.name_primary}
                        </span>
                      </div>
                      {renderPrice(product, product.price_id)}

                      <div className="w-[10%] flex flex-col items-center justify-center gap-2">
                        {/* Delete button */}
                        <button
                          title="Xóa sản phẩm"
                          onClick={() =>
                            handleDeleteClick(
                              product.product.product_id,
                              product.price_id
                            )
                          }
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <ImBin size={16} />
                        </button>

                        {/* Updated Similar Products Button with Text */}
                        <button
                          title="Tìm sản phẩm tương tự"
                          onClick={() => handleShowSimilarProducts(product)}
                          className="flex items-center px-2 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                        >
                          <FiSearch size={10} className="mr-1" />
                          <span>Tương tự</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <OrderSummary
            totalAmount={calculateCartTotals?.total_price || 0}
            totalOriginPrice={calculateCartTotals?.total_original_price || 0}
            totalDiscount={calculateCartTotals?.total_discount || 0}
            totalSave={calculateCartTotals?.total_discount || 0}
            shippingFee={shippingFee}
            checkout={checkout}
            vouchers={vouchersCart}
            setVouchers={changeSelectVouhcher}
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

        {isSimilarProductsOpen && currentProductForSimilar && (
          <SimilarProductsList
            product={currentProductForSimilar}
            onClose={() => setIsSimilarProductsOpen(false)}
            addToCart={(productId, priceId, quantity) => {
              addProductTocart(
                productId,
                priceId,
                quantity,
                () => {
                  toast.showToast("Thêm vào giỏ hàng thành công", "success");
                  getCart();
                  setIsSimilarProductsOpen(false);
                },
                (error: string) => {
                  toast.showToast("Thêm vào giỏ hàng thất bại", "error");
                }
              );
            }}
          />
        )}
      </>
    );
  }
);

export default ShoppingCart;
