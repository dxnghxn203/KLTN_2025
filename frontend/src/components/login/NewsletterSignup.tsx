import React from 'react';

const NewsletterSignup: React.FC = () => {
    return (
        <div className="px-0 py-8 text-center bg-slate-100">
            <div className="mx-auto my-0 max-w-screen-xl">
                <h2 className="mb-5 text-2xl font-extrabold">Đăng ký nhận bản tin</h2>
                <p className="mb-8 text-sm">
                    Tham gia cùng hơn 60.000 người đăng ký và nhận phiếu giảm giá mới vào thứ bảy hàng tuần
                </p>
                <form className="flex gap-2.5 justify-center max-sm:flex-col max-sm:items-center">
                    <label htmlFor="emailInput" className="sr-only">Nhập email của bạn</label>
                    <input
                        type="email"
                        id="emailInput"
                        placeholder="Nhập email của bạn"
                        className="p-4 border-none rounded-[30px] w-[400px] max-sm:w-[90%]"
                    />
                    <button type="submit" className="px-8 py-4 font-bold text-white bg-blue-900 cursor-pointer border-none rounded-[30px]">
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewsletterSignup;