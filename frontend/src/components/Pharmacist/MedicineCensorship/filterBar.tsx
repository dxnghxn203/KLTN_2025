import React, {useState, useEffect} from 'react';

interface FilterBarProps {
    onFilterChange: (filters: any) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({onFilterChange}) => {
    const [filters, setFilters] = useState({
        prescription: '',
        category: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange({
            prescription: filters.prescription === 'true' ? true :
                filters.prescription === 'false' ? false : '',
            category: filters.category
        });
    };

    const handleResetFilters = () => {
        setFilters({
            prescription: '',
            category: ''
        });
        onFilterChange({
            prescription: '',
            category: ''
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thuốc kê toa</label>
                    <select
                        name="prescription"
                        value={filters.prescription}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="true">Có</option>
                        <option value="false">Không</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="thuoc-khang-sinh">Thuốc kháng sinh</option>
                        <option value="thuoc-giam-dau">Thuốc giảm đau</option>
                        <option value="vitamin-tpcn">Vitamin & TPCN</option>
                        {/* Thêm các danh mục khác nếu cần */}
                    </select>
                </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
                <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Đặt lại
                </button>
                <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
