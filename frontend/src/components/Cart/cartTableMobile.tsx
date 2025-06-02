// components/CartTableMobile.tsx
import Image from "next/image";
import { ImBin } from "react-icons/im";

export default function CartTableMobile({
  cart,
  selectedProducts,
  handleSelectAll,
  handleSelectProduct,
  handleDeleteClick,
  handleShowSimilarProducts,
  renderOriginalPrice,
  renderQuantityControls,
  renderUnit,
  renderTotalPrice,
  loadingGetCart,
}: any) {
  return (
    <div className="block md:hidden">
      <div className="px-4 py-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="select-all-mobile"
          checked={cart && selectedProducts.length === cart?.length}
          onChange={handleSelectAll}
        />
        <label htmlFor="select-all-mobile" className="cursor-pointer">
          Chọn tất cả ({selectedProducts.length}/{cart?.length})
        </label>
      </div>
      <div className={loadingGetCart ? "opacity-50 pointer-events-none" : ""}>
        {cart?.map((product: any) => (
          <div
            key={`mobile-${product.product.product_id}-${product.price_id}`}
            className="border-b border-gray-200 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedProducts.some(
                  (item: any) =>
                    item.product_id === product.product.product_id &&
                    item.price_id === product.price_id
                )}
                onChange={() =>
                  handleSelectProduct(
                    product.product.product_id,
                    product.price_id
                  )
                }
              />
              <Image
                src={product?.product?.images_primary}
                alt={product.product?.product_name || "Product"}
                width={50}
                height={50}
                className="border border-gray-300 rounded-lg"
              />
              <span className="text-sm font-medium line-clamp-2">
                {product?.product?.name_primary}
              </span>
              <div className="flex items-center justify-between mt-2 gap-2 ml-auto">
                <button
                  onClick={() =>
                    handleDeleteClick(
                      product.product.product_id,
                      product.price_id
                    )
                  }
                  className="text-gray-500 hover:text-red-600"
                >
                  <ImBin size={16} />
                </button>
                <button
                  onClick={() => handleShowSimilarProducts(product)}
                  className="text-xs text-red-500 underline"
                >
                  Tìm tương tự
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-4 space-y-4 mx-6">
              <div className="flex items-center gap-2">
                <strong>Giá thành:</strong>{" "}
                {renderOriginalPrice(product, product.price_id)}
              </div>
              <div className="flex items-center gap-2">
                <strong>Số lượng:</strong>{" "}
                {renderQuantityControls(product, product.price_id)}
              </div>
              <div className="flex items-center gap-2">
                <strong>Đơn vị:</strong> {renderUnit(product, product.price_id)}
              </div>
              <div className="flex items-center gap-2">
                <strong>Thành tiền:</strong>{" "}
                {renderTotalPrice(product, product.price_id)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
