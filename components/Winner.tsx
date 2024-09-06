"use client";

import React, {useEffect, useState} from 'react';
import {Team} from "@/types/interfaces";
import Link from "next/link";
import {HOME_PAGE} from "@/urls/routes"; // Assuming you have a route constant for the home page

const Winner: React.FC = () => {
    const [winner, setWinner] = useState<Team | null>(null);
    const [secondPlace, setSecondPlace] = useState<Team | null>(null);
    const [thirdPlace, setThirdPlace] = useState<Team | null>(null);

    useEffect(() => {
        // Retrieve the teams from localStorage
        const storedTopThreeTeams = localStorage.getItem('topThreeTeams');

        if (storedTopThreeTeams) {
            const teams: Team[] = JSON.parse(storedTopThreeTeams);

            setWinner(teams[0]); // Set the winner if there are teams left
            setSecondPlace(teams[1]); // Set second place if available
            setThirdPlace(teams[2]); // Set third place if available
        }
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-4">
            <h1 className="text-4xl font-bold mb-4">🏆 Tournament Results</h1>
            {winner ? (
                <div className="mb-4 text-center">
                    <p className="text-2xl mb-2">The Winner is: <span className="font-bold">{winner.name}</span></p>
                    <img src={winner.image} alt={`${winner.name} logo`} className="w-32 h-32 mb-4"/>
                </div>
            ) : (
                <p className="text-2xl mb-2">No winner data available.</p>
            )}

            {secondPlace ? (
                <div className="mb-4 text-center">
                    <p className="text-xl mb-2">Second Place: <span className="font-bold">{secondPlace.name}</span></p>
                    <img src={secondPlace.image} alt={`${secondPlace.name} logo`} className="w-24 h-24 mb-4"/>
                </div>
            ) : null}

            {thirdPlace ? (
                <div className="mb-4 text-center">
                    <p className="text-xl mb-2">Third Place: <span className="font-bold">{thirdPlace.name}</span></p>
                    <img src={thirdPlace.image} alt={`${thirdPlace.name} logo`} className="w-24 h-24 mb-4"/>
                </div>
            ) : null}

            <Link
                href={HOME_PAGE}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-xl"
            >
                Back to Home
            </Link>
        </div>
    );
};

export default Winner;