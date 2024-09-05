"use client";

import React, { useEffect, useState } from 'react';
import { Team } from "@/types/interfaces";
import Link from "next/link";
import { HOME_PAGE } from "@/urls/routes"; // Assuming you have a route constant for the home page

const Winner: React.FC = () => {
    const [winner, setWinner] = useState<Team | null>(null);

    useEffect(() => {
        // Retrieve the winner from localStorage
        const storedRightTeams = localStorage.getItem('rightTeams');
        if (storedRightTeams) {
            const teams: Team[] = JSON.parse(storedRightTeams);
            if (teams.length === 1) {
                setWinner(teams[0]); // Set the winner if only one team is left
            }
        }
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-4">
            {winner ? (
                <>
                    <h1 className="text-4xl font-bold mb-4">🏆 Congratulations!</h1>
                    <p className="text-2xl mb-4">The Winner is: <span className="font-bold">{winner.name}</span></p>
                    <img src={winner.image} alt={`${winner.name} logo`} className="w-32 h-32 mb-4" />
                    <Link
                        href={HOME_PAGE}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-xl"
                    >
                        Back to Home
                    </Link>
                </>
            ) : (
                <p className="text-2xl">No winner data available.</p>
            )}
        </div>
    );
};

export default Winner;