import React, { FC } from 'react';
import { Page } from "@/utils/types/interfaces";
import Link from "next/link";

interface PagesProps {
    pages: Page[]
}

const Pages: FC<PagesProps> = ({ pages }) => {

    return (
        <nav>
            <ul className="flex gap-2">
                {
                    pages.map(({ name, link, color }) => {
                        return (
                            <li
                                key={name}
                                style={{ backgroundColor: color }}
                                className="text-white p-2 rounded text-xs hover:opacity-90 cursor-pointer"
                            >
                                <Link href={link}>
                                    {name}
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    );
};

export default Pages;
