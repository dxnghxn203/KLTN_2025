import React from 'react';

const NavMenu: React.FC = () => {
    const menuItems = [
        "Thực phẩm chức năng",
        "Thuốc",
        "Dược mỹ phẩm",
        "Thiết bị y tế",
        "Chăm sóc cá nhân",
        "Mẹ và bé",
        "Sức khỏe sinh sản",
        "Góc sống khỏe"
    ];

    return (
        <nav className="flex justify-between px-20 py-2.5 mx-auto my-0 max-w-screen-xl bg-blue-50 max-md:flex-wrap max-md:gap-2.5 max-md:px-5 max-md:py-2.5 max-sm:hidden">
            {menuItems.map((item, index) => (
                <div key={index} className="text-sm text-blue-900 cursor-pointer">
                    {item}
                </div>
            ))}
        </nav>
    );
};

export default NavMenu;