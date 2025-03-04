import React from 'react';

const SearchBar: React.FC = (frameClassName: any) => {
  return (
    <div className="w-[454px] ">
      <div className={`flex w-[430px] h-12 items-center justify-between px-3 py-[5px] relative left-2.5 bg-white rounded-[50px] border border-solid border-white `}>
        <label htmlFor="searchInput" className="sr-only">Nhập từ khóa hoặc sản phẩm</label>
        <input
          type="text"
          id="searchInput"
          placeholder="Nhập từ khóa hoặc sản phẩm..."
          className="flex-1 p-2.5 text-sm text-sky-800 border-none"
        />
        <button type="submit" className="flex justify-center items-center p-1.5 bg-blue-900 rounded-full h-[30px] w-[30px]">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1705b8579efc0d949a4f5e70c4c493cf814a7763" alt="Search" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;