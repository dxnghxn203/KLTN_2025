"use client";

import {Manufacturer, ErrorMessage} from "./types";

interface ManufacturerFormProps {
    manufacturer: Manufacturer;
    updateManufacturer: (manufacturer: Manufacturer) => void;
    brand: string;
    updateBrand: (brand: string) => void;
    errors: Record<string, string>;
    hasError: (fieldName: string) => boolean;
    isViewOnly: boolean;
}

export const ManufacturerForm = ({
                                     manufacturer,
                                     updateManufacturer,
                                     brand,
                                     updateBrand,
                                     errors,
                                     hasError,
                                     isViewOnly
                                 }: ManufacturerFormProps) => {
    return (
        <div className="bg-white shadow-sm rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-3">Nhà sản xuất</h3>
            <div className="grid grid-cols-2 gap-4">
                <div data-error={hasError("manufacture_name")}>
                    <label className="block text-sm font-medium mb-1">
                        Tên nhà sản xuất <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={manufacturer.manufacture_name}
                        onChange={(e) =>
                            updateManufacturer({
                                ...manufacturer,
                                manufacture_name: e.target.value,
                            })
                        }
                        disabled={isViewOnly}
                        className={`border rounded-lg p-2 w-full ${
                            hasError("manufacture_name") ? "border-red-500" : ""
                        }`}
                    />
                    {hasError("manufacture_name") && (
                        <ErrorMessage message={errors.manufacture_name}/>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Liên hệ nhà sản xuất
                    </label>
                    <input
                        type="text"
                        value={manufacturer.manufacture_contact}
                        onChange={(e) =>
                            updateManufacturer({
                                ...manufacturer,
                                manufacture_contact: e.target.value,
                            })
                        }
                        disabled={isViewOnly}
                        className="border rounded-lg p-2 w-full"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                        Địa chỉ sản xuất
                    </label>
                    <input
                        type="text"
                        value={manufacturer.manufacture_address}
                        onChange={(e) =>
                            updateManufacturer({
                                ...manufacturer,
                                manufacture_address: e.target.value,
                            })
                        }
                        disabled={isViewOnly}
                        className="border rounded-lg p-2 w-full"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                        Thương hiệu sản phẩm
                    </label>
                    <input
                        type="text"
                        name="brand"
                        className="border rounded-lg p-2 w-full"
                        onChange={(e) => updateBrand(e.target.value)}
                        value={brand}
                        disabled={isViewOnly}
                    />
                </div>
            </div>
        </div>
    );
};