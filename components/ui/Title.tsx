"use client"

import React from 'react';
import {usePathname} from "next/navigation";
import {pages} from "@/utils/routes/pages";

const Title: React.FC = () => {
    const pathname = usePathname()

    const currentPage = pages.find(page => page.link === pathname)

    return (
        <h1 className="text-base font-bold text-center p-2 uppercase">
            {currentPage ? currentPage.name :  ""}
        </h1>
    );
};

export default Title;