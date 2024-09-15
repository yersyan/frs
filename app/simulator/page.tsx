import React from 'react';
import Simulator from "@/components/Simulator";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "FRS | Simulator",
    description: "",
};

export default function SimulatorPage() {
    return (
        <main>
            <Simulator/>
        </main>
    );
};
