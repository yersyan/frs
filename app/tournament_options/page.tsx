import React from 'react';
import Options from "@/components/Options";
import {Metadata} from "next";
import Pages from "@/components/ui/Pages";
import {SIMULATOR_PAGE} from "@/utils/routes/pages";

export const metadata: Metadata = {
    title: "FRS | Tournament Options",
    description: "",
};

export default function TournamentOptions() {

    return (
        <main className="flex flex-col items-center min-h-screen py-4 sm:py-6 md:py-8">
            <h1 className="text-xl font-bold mb-4">Tournament Options</h1>

            {/* Add form elements here to select options like tournament type, number of teams, etc. */}
            <Options/>

            {/* Navigate to the simulator page */}
            <Pages pages={[SIMULATOR_PAGE]}/>
        </main>
    );
};