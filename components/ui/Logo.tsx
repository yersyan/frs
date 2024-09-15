import React from 'react';
import Link from 'next/link';
import {HOME_PAGE} from "@/utils/routes/pages";

const Logo: React.FC = () => {
    return (
        <Link href={HOME_PAGE.link} className="text-xl font-extrabold flex items-center italic">
            <span className="text-white">⚽</span>
            <span className="font-extrabold text-white">FRS</span>
        </Link>
    );
};

export default Logo;