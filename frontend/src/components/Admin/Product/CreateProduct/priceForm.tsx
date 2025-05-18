"use client";

import {PriceItem, ErrorMessage} from "./types";

interface PriceFormProps {
    prices: PriceItem[];
    updatePrices: (prices: PriceItem[]) => void;
    errors: Record<string, string>;
    hasError: (fieldName: string) => boolean;
    isViewOnly: boolean;
}

export const PriceForm = ({
                              prices,
                              updatePrices,
                              errors,
                              hasError,
                              isViewOnly
                          }: PriceFormProps) => {
    const unitOptions: string[] = ["Gói", "Hộp", "Viên", "Vỉ", "Chai", "Tuýp"];

    const addPriceItem = () => {
        updatePrices([
            ...prices,
            {
                original_price: 0,
                discount: 0,
                unit: "",
                amount: 0,
                weight: 0,
            }
        ]);
    };

    const removePriceItem = (index: number) => {
        updatePrices(prices.filter((_, i) => i !== index));
    };

    const updatePriceItem = (
        index: number,
        field: keyof PriceItem,
        value: string | number
    ) => {
        const updatedPrices = [...prices];
        updatedPrices[index] = {...updatedPrices[index], [field]: value};
        updatePrices(updatedPrices);
    };

    return (
        <div className="bg-white shadow-sm rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-3">Giá và đơn vị</h3>
            <div className="space-y-4">
                {prices.map((price, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Tùy chọn giá {index + 1}</h4>
                            {prices.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePriceItem(index)}
                                    className="text-red-500 text-sm"
                                    disabled={isViewOnly}
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-3 mb-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Giá gốc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={price.original_price}
                                    onChange={(e) =>
                                        updatePriceItem(
                                            index,
                                            "original_price",
                                            Number(e.target.value)
                                        )
                                    }
                                    disabled={isViewOnly}
                                    className="border rounded-lg p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Giảm giá
                                </label>
                                <input
                                    type="number"
                                    value={price.discount}
                                    onChange={(e) =>
                                        updatePriceItem(
                                            index,
                                            "discount",
                                            Number(e.target.value)
                                        )
                                    }
                                    disabled={isViewOnly}
                                    className="border rounded-lg p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Số lượng tương ứng
                                </label>
                                <input
                                    type="text"
                                    value={price.amount}
                                    onChange={(e) =>
                                        updatePriceItem(index, "amount", e.target.value)
                                    }
                                    className="border rounded-lg p-2 w-full"
                                    disabled={isViewOnly}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Đơn vị <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={price.unit}
                                    onChange={(e) =>
                                        updatePriceItem(index, "unit", e.target.value)
                                    }
                                    className="border rounded-lg p-2 w-full"
                                    disabled={isViewOnly}
                                >
                                    <option value="">Chọn 1 đơn vị</option>
                                    {unitOptions.map((unit, idx) => (
                                        <option key={idx} value={unit}>
                                            {unit}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Trọng lượng (kg)
                                </label>
                                <input
                                    type="text"
                                    value={price.weight}
                                    onChange={(e) =>
                                        updatePriceItem(index, "weight", e.target.value)
                                    }
                                    className="border rounded-lg p-2 w-full"
                                    disabled={isViewOnly}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {hasError("prices") && <ErrorMessage message={errors.prices}/>}
                <button
                    type="button"
                    onClick={addPriceItem}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                    disabled={isViewOnly}
                >
                    + Thêm tùy chọn giá mới
                </button>
            </div>
        </div>
    );
};