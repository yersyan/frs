import React from 'react';
import {Metadata} from "next";
import Settings from "@/components/Settings/Settings";

export const metadata: Metadata = {
    title: "FRS | Settings",
    description: "",
};

export default function SettingsPage() {

    return (
        <main className="flex flex-col min-h-screen p-4 sm:py-6 md:py-8">
            <h1 className="text-xl font-bold mb-4">Settings</h1>
            <Settings/>
        </main>
    );
};