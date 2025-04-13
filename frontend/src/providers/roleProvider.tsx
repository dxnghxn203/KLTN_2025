"use client";

import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import { usePathname } from "next/navigation";
import { ADMIN_ROUTES, PARTNER_ROUTES } from "@/utils/constants";

export function RoleProvider({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const isAdmin = ADMIN_ROUTES.some(route => pathname?.startsWith(route) ?? false);
    const isPartner = PARTNER_ROUTES.some(route => pathname?.startsWith(route) ?? false);
    return (
        <>          
            {isAdmin || isPartner ? null : <Header />}
            {children}
            {isAdmin || isPartner ? null : <Footer />}
        </>
    )
}
