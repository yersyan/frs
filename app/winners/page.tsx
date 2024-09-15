import React from 'react';
import Winners from "@/components/Winners";
import {Metadata} from "next";
import {HOME_PAGE} from "@/utils/routes/pages";
import Pages from "@/components/ui/Pages";
import Title from "@/components/ui/Title";

export const metadata: Metadata = {
    title: "FRS | Winners",
    description: "",
};

export default function WinnersPage() {

    return (
        <main className="flex flex-col items-center min-h-screen py-4 sm:py-6 md:py-8">
            <Title text="🏆 Tournament Results"/>
            <Winners/>
            <Pages pages={[HOME_PAGE]}/>
        </main>
    );
};