"use client"

import React from 'react';
import Logo from "@/components/ui/Logo";
import Title from "@/components/ui/Title";
import Pages from "@/components/ui/Pages";
import {CLUBS_PAGE, HOME_PAGE, NATIONAL_TEAMS_PAGE} from "@/utils/routes/pages";
import {usePathname} from "next/navigation";

const Header: React.FC = () => {
    const pathname = usePathname();
    let pages = [NATIONAL_TEAMS_PAGE, CLUBS_PAGE].filter(page => page.link !== pathname);

    return (
        <header className="h-auto bg-gray-800 text-white p-2">
            <div className="flex items-center justify-between">
                <Logo />
                <div className="hidden sm:block">
                    <Title />
                </div>
                <Pages pages={pages} />
            </div>
            <div className="sm:hidden">
                <Title />
            </div>
        </header>
    );
};

export default Header;