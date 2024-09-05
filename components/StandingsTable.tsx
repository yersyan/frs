"use client"

import React, {FC, useEffect, useState} from 'react';
import { Team } from "@/types/interfaces";
import Image from 'next/image';

interface Props {
    groupIndex: number;
    standings: { [key: number]: { GP: number, W: number, D: number, L: number, GF: number, GA: number, GD: number, Pts: number } };
    sortedTeams: Team[];
}

const StandingsTable: FC<Props> = ({ groupIndex, standings, sortedTeams }) => {

    const [teamsAdvance, setTeamsAdvance] = useState<number>(1);  // Default to 1 in case nothing is set

    useEffect(() => {
        // Retrieve the number of teams advancing from localStorage
        const storedTeamsAdvance = localStorage.getItem("teamsAdvance");
        if (storedTeamsAdvance) {
            setTeamsAdvance(parseInt(storedTeamsAdvance, 10));
        }
    }, []);  // Only run on mount

    return (
        <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Group {groupIndex + 1} Standings</h2>
            <table className="min-w-full bg-gray-100 table-auto text-sm">
                <thead>
                <tr>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">N</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">Team</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">GP</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">W</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">D</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">L</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">GF</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">GA</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">GD</th>
                    <th className="py-1 px-2 bg-gray-300 text-gray-700">Pts</th>
                </tr>
                </thead>
                <tbody>
                {sortedTeams.map((team: Team, index) => {
                    // Apply different colors based on the teamsAdvance value from localStorage
                    const bgColor = index < teamsAdvance ? "bg-green-300" : "";

                    return <tr key={team.id} className={`border-b ${bgColor}`}>
                        <td className="py-1 px-2 text-center">{index + 1}.</td>
                        <td className="py-1 px-2 flex items-center">
                            <Image
                                src={team.image}
                                alt={team.name}
                                width={16}
                                height={10}
                                objectFit="cover"
                                className="rounded-sm"
                            />
                            <span className="ml-2 text-sm font-semibold">{team.name}</span>
                        </td>
                        <td className="py-1 px-2 text-center">{standings[team.id]?.GP || 0}</td>
                        <td className="py-1 px-2 text-center">{standings[team.id]?.W || 0}</td>
                        <td className="py-1 px-2 text-center">{standings[team.id]?.D || 0}</td>
                        <td className="py-1 px-2 text-center">{standings[team.id]?.L || 0}</td>
                        <td className="py-1 px-2 text-center">{standings[team.id]?.GF || 0}</td>
                        <td className="py-1 px-2 text-center">{standings[team.id]?.GA || 0}</td>
                        <td className="py-1 px-2 text-center">{standings[team.id]?.GD || 0}</td>
                        <td className="py-1 px-2 text-center font-bold">{standings[team.id]?.Pts || 0}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    );
};

export default StandingsTable;