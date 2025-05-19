"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiClock, FiLogOut } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
import Image from "next/image";
import { ImBin } from "react-icons/im";
import textlogo from "@/images/medicare.png";
import logoyellow from "@/images/MM.png";
import LocationDelivery from "./locationDelivery";
import MenuHeader from "./menuHeader";
import LocationDialog from "@/components/Dialog/locationDialog"; // Import from correct path
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { getPriceFromProduct } from "@/utils/price";
import { useToast } from "@/providers/toastProvider";
import DeleteProductDialog from "../Dialog/deleteProductDialog";
import { useProduct } from "@/hooks/useProduct";
import { X } from "lucide-react";
import { GoHistory } from "react-icons/go";
import Loading from "@/app/loading";
import { RiSearchLine } from "react-icons/ri";

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { removeProductFromCart, getProductFromCart, cart } = useCart();
  const [loadingGetCart, setLoadingGetCart] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const toast = useToast();
  const { fetchSearchProduct, fetchClearSearch, searchResult } = useProduct();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResultProduct, setSearchResultProduct] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [searchHistory, setSearchHistory] = useState([
    "Thuốc nhỏ mắt",
    "Canxi",
  ]);
  const topSearches = [
    "Omega 3",
    "Canxi",
    "Dung dịch vệ sinh",
    "Thuốc nhỏ mắt",
    "Men vi sinh",
    "Kẽm",
    "Siro ho",
  ];
  const inputRef = useRef(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleClearHistory = () => setSearchHistory([]);
  const removeItem = (item: string) =>
    setSearchHistory((prev) => prev.filter((term) => term !== item));

  function handleSearch() {
    setIsLoading(true);
    fetchSearchProduct(
      {
        query: search,
        page: 1,
        page_size: 100,
      },
      (responseData: any) => {
        setSearchResultProduct(false);
        setShowSuggestions(false);
        setIsLoading(false);
        router.push(`/tim-kiem?search=${encodeURIComponent(search)}`);
      },
      () => {
        setIsLoading(false);
      }
    );
  }
  const handleSuggestionClick = (term: string) => {
    setSearch(term);
    // nếu như chuyển
  };

  const handleClear = () => {
    setSearch("");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSearchResultProduct(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (search.trim() === "") {
      // setShowSuggestions(true);
      setSearchResultProduct(false);
      return;
    }

    setShowSuggestions(false);

    debounceTimeout.current = setTimeout(() => {
      setSearchResultProduct(true);
      fetchSearchProduct(
        {
          query: search,
          page: 1,
          page_size: 100,
        },
        (responseData: any) => {
          setSearchResultProduct(true);
          setIsLoading(false);
        },
        () => {
          setSearchResultProduct(false);
        }
      );
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCartDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // If the cart dropdown menu is open and the click is outside the menu, close it.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logout clicked");
    logout(
      "user",
      () => {
        // toast.showToast("Đăng xuất thành công", "success");
      },
      (error: string) => {
        console.error("Logout error:", error);
        toast.showToast("Đăng xuất thất bại", "error");
      }
    );
    setShowDropdown(false);
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

  useEffect(() => {
    getCart();
  }, []);

  const renderCartItems = (product: any, price_id: any, quantity: any) => {
    const price = getPriceFromProduct(product, price_id);
    return (
      <>
        <div className="flex ml-auto items-center justify-between w-full">
          <div className="text-[#0053E2] font-medium">
            {price.price.toLocaleString("vi-VN")}đ
          </div>
          <span className="text-xs text-gray-500">
            x{quantity} {price.unit}
          </span>
        </div>
      </>
    );
  };

  const handlRemoveFromCart = (product_id: any, price_id: any) => {
    setSelectedProductId(product_id);
    setSelectedPriceId(price_id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProductId(null);
    setSelectedPriceId(null);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[50] bg-[#0053E2]">
        <header className="w-full px-4 md:px-8 transition-all duration-300">
          <div className="relative flex items-center justify-between h-[72px] sm:h-[72px] px-4">
            <div className="flex items-center gap-4 min-w-[160px]">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <Image
                    src={logoyellow}
                    alt=""
                    width={32}
                    height={32}
                    className="object-contain aspect-square sm:w-[32px] sm:h-[32px] md:w-[40px] md:h-[40px]"
                  />
                  <Image
                    src={textlogo}
                    alt=""
                    width={80}
                    height={80}
                    priority
                    className="top-1 ml-2 hidden sm:block"
                  />
                </div>
              </Link>
            </div>

            <div className="flex-grow max-w-[580px]" ref={searchRef}>
              <div className="flex items-center bg-white rounded-full px-4 py-2 h-[48px]">
                <input
                  type="text"
                  value={search}
                  placeholder="Tìm kiếm theo tên sản phẩm..."
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => {
                    if (search.trim() === "") {
                      setShowSuggestions(true);
                      setSearchResultProduct(false);
                    } else {
                      setShowSuggestions(false);
                      setSearchResultProduct(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (search.trim() !== "") {
                        e.currentTarget.blur();
                        sessionStorage.setItem("searchTriggered", "true");
                        handleSearch();
                      }
                    }
                  }}
                  className="w-full outline-none text-sm placeholder:text-black/40"
                />
                <button
                  type="button"
                  className="flex items-center justify-center shrink-0 transition"
                  onClick={handleSearch}
                >
                  <RiSearchLine className="text-[#0053E2] text-2xl" />
                </button>
              </div>

              {showSuggestions && (
                <div className="absolute bg-white shadow-lg rounded-lg z-50 p-4 w-full max-w-[580px] mt-1">
                  {/* Lịch sử tìm kiếm */}
                  <div>
                    <div className="flex justify-between items-center mb-2 font-medium text-sm">
                      <span>Lịch sử tìm kiếm</span>
                      {searchHistory.length > 0 && (
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={handleClearHistory}
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </div>
                    {searchHistory.length > 0 ? (
                      searchHistory.map((term, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-blue-600 hover:underline mb-1"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleSuggestionClick(term)}
                          >
                            <GoHistory
                              className="text-gray-400 mr-1"
                              size={16}
                            />
                            <span>{term}</span>
                          </div>
                          <button onClick={() => removeItem(term)}>
                            <X size={16} className="text-gray-400" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm">
                        Không có lịch sử
                      </div>
                    )}
                  </div>

                  {/* Tra cứu hàng đầu */}
                  <div className="mt-4">
                    <div className="text-sm font-semibold mb-2">
                      Tra cứu hàng đầu
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topSearches.map((item, i) => (
                        <button
                          key={i}
                          className="border px-3 py-1 rounded-full text-sm text-gray-800 hover:bg-gray-100"
                          onClick={() => handleSuggestionClick(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {searchResultProduct && searchResult !== null && !isLoading && (
                <div className="absolute bg-white shadow-lg rounded-lg z-50 w-full max-w-[580px] overflow-y-auto max-h-[500px] hide-scrollbar mt-1 ">
                  {searchResult.length > 0 ? (
                    <>
                      {searchResult
                        .slice(0, 5)
                        .map((product: any, index: any) => (
                          <div
                            key={product.id}
                            className={`flex gap-3 items-center hover:bg-gray-100 cursor-pointer p-4 ${
                              index !== Math.min(4, searchResult.length - 1)
                                ? "border-b"
                                : ""
                            }`}
                          >
                            <Image
                              width={70}
                              height={70}
                              src={product.images_primary}
                              alt={product.name}
                              className="p-1 rounded-lg object-cover border"
                            />
                            <div className="flex-grow">
                              <div className="text-sm">
                                {product.name_primary}
                              </div>
                            </div>
                          </div>
                        ))}

                      {searchResult.length > 5 && (
                        <div className="text-center">
                          <button
                            onClick={() => {}}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Xem tất cả {searchResult.length} sản phẩm
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-sm text-gray-500 p-4 w-full">
                      Không tìm thấy sản phẩm phù hợp.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* GIỎ HÀNG + ĐĂNG NHẬP BÊN PHẢI */}
            <div className="flex items-center gap-2 min-w-[260px] justify-end text-white">
              <div className="flex items-center gap-2 text-white h-full justify-end">
                {/* Cart icon */}
                <div
                  className="relative h-full"
                  ref={cartDropdownRef}
                  onMouseEnter={() => setShowCartDropdown(true)}
                  onMouseLeave={() => setShowCartDropdown(false)}
                >
                  <Link
                    href="/gio-hang"
                    className="focus:outline-none h-full flex items-center"
                  >
                    <div
                      className={`relative flex items-center cursor-pointer px-3 ml-4 rounded-full w-[120px] h-[48px] transition ${
                        pathname === "/cart"
                          ? "bg-[#002E99]"
                          : "hover:bg-[#004BB7]"
                      }`}
                    >
                      <div className="relative">
                        <AiOutlineShoppingCart className="text-2xl" />
                        {cart && cart?.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {cart?.length}
                          </span>
                        )}
                      </div>
                      <span className="ml-2 text-[14px] hidden sm:inline">
                        Giỏ hàng
                      </span>
                    </div>
                  </Link>
                  {showCartDropdown && (
                    <div className="absolute right-0 w-80 bg-white rounded-lg shadow-lg z-[51]">
                      <div className="p-4">
                        <h3 className="text-black font-semibold">
                          Giỏ hàng của bạn
                        </h3>

                        {!cart ? (
                          <div className="py-6 text-center text-gray-500">
                            Giỏ hàng trống
                          </div>
                        ) : (
                          <>
                            <div
                              className={`max-h-[250px] overflow-y-auto ${
                                cart.length > 3 ? "scrollbar-thin" : ""
                              }`}
                            >
                              {cart &&
                                cart.map((item: any, index: any) => (
                                  <div
                                    key={item.id}
                                    className={`flex py-3 ${
                                      index !== cart?.length - 1
                                        ? "border-b"
                                        : ""
                                    }`}
                                  >
                                    <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                      <Image
                                        src={item.product?.images_primary}
                                        alt={item.name}
                                        width={50}
                                        height={50}
                                        className="object-cover"
                                        priority
                                      />
                                    </div>

                                    <div className="ml-3 flex-1 flex flex-col justify-between">
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                          {item.product?.product_name}
                                        </h4>
                                      </div>
                                      {renderCartItems(
                                        item.product,
                                        item.price_id,
                                        item.quantity
                                      )}
                                    </div>
                                    <button
                                      className="ml-3 text-black/50 hover:text-red-800"
                                      onClick={() =>
                                        handlRemoveFromCart(
                                          item.product?.product_id,
                                          item.price_id
                                        )
                                      }
                                    >
                                      <ImBin className="text-lg hover:text-black/70" />
                                    </button>
                                  </div>
                                ))}
                            </div>

                            <Link href="/gio-hang" legacyBehavior>
                              <a className="mt-4 text-sm block w-full py-2 px-4 bg-[#0053E2] text-white text-center font-medium rounded-3xl hover:bg-[#0042b4] transition-colors">
                                Xem giỏ hàng
                              </a>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Login or User */}
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className={`relative flex items-center cursor-pointer px-3 py-1 rounded-full min-w-[150px] h-[48px] transition ${
                        showDropdown ? "bg-[#002E99]" : "hover:bg-[#004BB7]"
                      }`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        {user?.image ? (
                          <img
                            src={user?.image}
                            alt={"User"}
                            className="text-2xl rounded-full object-cover"
                          />
                        ) : (
                          <HiOutlineUserCircle className="text-2xl" />
                        )}
                      </div>

                      <div className="ml-2 flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {user?.name || user?.user_name || ""}
                        </p>
                        <p className="text-xs text-white/70 truncate hidden md:block">
                          {user?.email || ""}
                        </p>
                      </div>
                      <IoChevronDownOutline
                        className={`ml-1 transition-transform duration-200 ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                        <div className="py-2 text-sm">
                          <Link href="/ca-nhan">
                            <div className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                              Thông tin tài khoản
                            </div>
                          </Link>
                          <Link href="/ca-nhan/lich-su-don-hang">
                            <div className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
                              Lịch sử đơn hàng
                            </div>
                          </Link>
                          <div
                            className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={handleLogout}
                          >
                            <FiLogOut className="mr-2" />
                            Đăng xuất
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/dang-nhap" className="focus:outline-none">
                    <div
                      className={`relative flex items-center cursor-pointer px-2 py-1 rounded-full w-[120px] h-[48px] transition ${
                        pathname === "/dang-nhap"
                          ? "bg-[#002E99]"
                          : "hover:bg-[#004BB7]"
                      }`}
                    >
                      <HiOutlineUserCircle className="text-2xl" />
                      <span className="ml-2 text-[14px]">Đăng nhập</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Các Dialog giữ nguyên */}
        <MenuHeader />
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
        <LocationDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>
    </>
  );
}
