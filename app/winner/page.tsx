import React from 'react';
import Winner from "@/components/Winner";

const WinnerPage: React.FC = () => {

    return (
        <main className="flex flex-col items-center min-h-screen py-4 sm:py-6 md:py-8">
            <Winner/>
        </main>
    );
};

export default WinnerPage;