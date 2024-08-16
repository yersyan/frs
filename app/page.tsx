import React from 'react';
import Link from "next/link";
import {CLUBS_PAGE, NATIONAL_TEAMS_PAGE, NATIONAL_TOURNAMENTS_PAGE} from "@/urls/routes";

const HomePage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-6 md:py-8">
            <div className="flex flex-col items-center justify-center w-full max-w-screen-lg px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">
                    Football Results Simulator
                </h1>
                <div className="space-y-4 sm:space-y-6">
                    <Link
                        href={NATIONAL_TEAMS_PAGE}
                        className="block px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 mx-2 sm:mx-4 md:mx-6"
                    >
                        National Teams
                    </Link>
                    <Link
                        href={CLUBS_PAGE}
                        className="block px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl bg-green-500 text-white rounded hover:bg-green-700 transition-colors duration-300 mx-2 sm:mx-4 md:mx-6"
                    >
                        Clubs
                    </Link>
                    <Link
                        href={NATIONAL_TOURNAMENTS_PAGE}
                        className="block px-4 py-2 text-center text-sm sm:text-base md:text-lg lg:text-xl bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-300 mx-2 sm:mx-4 md:mx-6"
                    >
                        National Tournaments
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default HomePage;