import React from 'react';

const SocialLogin: React.FC = () => {
  return (
    <button className="flex flex-col justify-center items-center px-16 py-5 mt-9 max-w-full font-semibold border-2 border-solid bg-slate-100 border-stone-300 border-opacity-80 rounded-[30px] w-[515px] max-md:px-5 max-md:mr-1">
      <div className="flex gap-2 w-52 max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/6c7162686cf4412c8ca98fb8a21f2997/f6d3d808ab4073688c4ad1c7066eb7286e3889dc42405f8a6653ac235230880a?apiKey=6c7162686cf4412c8ca98fb8a21f2997&"
          alt="Google logo"
          className="object-contain shrink-0 aspect-square w-[30px]"
        />
        <span className="grow shrink my-auto w-[164px]">
          Đăng nhập với Google
        </span>
      </div>
    </button>
  );
};

export default SocialLogin;