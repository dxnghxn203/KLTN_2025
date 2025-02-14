import React from 'react';

const LoginForm: React.FC = () => {
    return (
        <form className="w-full">
            <div className="mb-6">
                <label htmlFor="username" className="block mb-2 font-medium">
                    Tên đăng nhập hoặc email
                </label>
                <input
                    type="text"
                    id="username"
                    className="flex shrink-0 w-full max-w-full h-[66px] rounded-3xl border-2 border-solid bg-slate-100 border-stone-300 border-opacity-80"
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block mb-2 font-medium">
                    Mật khẩu
                </label>
                <input
                    type="password"
                    id="password"
                    className="flex shrink-0 w-full max-w-full h-[66px] rounded-3xl border-2 border-solid bg-slate-100 border-stone-300 border-opacity-80"
                    required
                />
            </div>
            <div className="text-right mb-6">
                <a href="#" className="font-bold">Quên mật khẩu?</a>
            </div>
            <button
                type="submit"
                className="w-full px-16 py-5 text-xl font-bold text-white bg-blue-700 rounded-3xl border-2 border-solid border-zinc-400 border-opacity-80 max-md:px-5"
            >
                Đăng nhập
            </button>
        </form>
    );
};

export default LoginForm;