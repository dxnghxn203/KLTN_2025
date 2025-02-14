import Divider from '@/components/login/Divider';
import LoginForm from '@/components/login/LoginForm';
import SocialLogin from '@/components/login/SocialLogin';
import React from 'react';

const LoginPage: React.FC = () => {
    return (
        <div className="overflow-hidden pl-14 bg-slate-100 max-md:pl-5">
            <div className="flex gap-5 max-md:flex-col">
                <div className="flex flex-col w-[46%] max-md:ml-0 max-md:w-full">
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/6c7162686cf4412c8ca98fb8a21f2997/1d5cc004fa51143a25609730c63c9f61cea3d8073fd6070c6317692bba8c0ed2?apiKey=6c7162686cf4412c8ca98fb8a21f2997&"
                        alt="Login page illustration"
                        className="object-contain self-stretch my-auto w-full aspect-[1.36] max-md:mt-10 max-md:max-w-full"
                    />
                </div>
                <div className="flex flex-col ml-5 w-[54%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col items-end px-20 py-32 mx-auto w-full text-base bg-white text-blue-950 max-md:px-5 max-md:py-24 max-md:mt-10 max-md:max-w-full">
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/6c7162686cf4412c8ca98fb8a21f2997/92a7273d771306019ac51aae53ccba4b974c255e24ab54cc41ee4bd025b5a1fb?apiKey=6c7162686cf4412c8ca98fb8a21f2997&"
                            alt="Company logo"
                            className="object-contain self-center max-w-full aspect-square w-[100px]"
                        />
                        <h1 className="self-center mt-6 text-4xl font-extrabold">
                            Đăng nhập
                        </h1>
                        <SocialLogin />
                        <Divider />
                        <LoginForm />
                        <div className="flex gap-1.5 self-center mt-9 ml-5 max-w-full w-[289px]">
                            <p className="grow font-medium">Bạn chưa có tài khoản?</p>
                            <a href="#" className="grow shrink font-bold w-[85px]">Đăng ký ngay</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;