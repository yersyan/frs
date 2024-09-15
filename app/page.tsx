import React from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Football Results Simulator",
    description: "Simulate football matches and track results.",
};

const HomePage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-8 sm:py-10 md:py-12 bg-gray-100">
            <div className="flex flex-col items-center justify-center w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg py-8 space-y-6">
                <section className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Welcome to Football Results Simulator!</h1>
                    <p className="text-base sm:text-lg text-gray-700 mb-6">
                        This is your go-to place for simulating football matches and keeping track of results.
                    </p>
                    <p className="text-base sm:text-lg text-gray-700">
                        Explore our features to get started:
                    </p>
                </section>

                <section className="w-full max-w-md">
                    <div className="bg-gray-200 p-4 sm:p-6 rounded-lg shadow-md">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Features:</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li className="text-gray-600 text-sm sm:text-base">Simulate matches between various teams.</li>
                            <li className="text-gray-600 text-sm sm:text-base">Track match results and standings.</li>
                            <li className="text-gray-600 text-sm sm:text-base">Create custom tournaments and leagues.</li>
                        </ul>
                    </div>
                </section>

                <section className="text-center mt-6">
                    <p className="text-base sm:text-lg text-gray-700 mb-4">
                        Ready to get started? Check out our simulation tools and see our simulator in action!
                    </p>
                </section>
            </div>
        </main>
    );
};

export default HomePage;
