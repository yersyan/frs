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
                                className="text-white rounded text-xs hover:opacity-90 cursor-pointer py-2"
                            >
                                <Link href={link} className='p-2'>
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
