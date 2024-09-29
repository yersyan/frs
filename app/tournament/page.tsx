import React from 'react';
import {Metadata} from "next";
import Tournament from "@/components/Tournament";

export const metadata: Metadata = {
    title: "FRS | Tournament",
    description: "",
};

export default function TournamentPage() {
    return (
        <main>
            <Tournament/>
        </main>
    );
};
