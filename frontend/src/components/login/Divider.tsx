import React from 'react';

const Divider: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-5 items-center mt-9 font-medium text-zinc-400 max-md:mr-1 w-full">
            <div className="shrink-0 self-stretch my-auto h-px border border-solid border-zinc-400 w-[140px]" />
            <div className="self-stretch basis-auto">
                hoặc đăng nhập với email
            </div>
            <div className="shrink-0 self-stretch my-auto h-px border border-solid border-zinc-400 w-[140px]" />
        </div>
    );
};

export default Divider;