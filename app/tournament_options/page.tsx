import React from 'react';
import Link from 'next/link';
import { SIMULATOR_PAGE } from "@/urls/routes";
import Options from "@/components/Options";

const TournamentOptions: React.FC = () => {

    return (
        <main className="flex flex-col items-center min-h-screen py-4 sm:py-6 md:py-8">
            <h1 className="text-xl font-bold mb-4">Tournament Options</h1>

            {/* Add form elements here to select options like tournament type, number of teams, etc. */}
            <Options/>

            {/* Navigate to the simulator page */}
            <div>
                <Link href={SIMULATOR_PAGE}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-xs">
                    Simulator
                </Link>
            </div>
        </main>
    );
};

export default TournamentOptions;