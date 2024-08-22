"use client";

import React, { FC, useEffect, useState } from 'react';
import {Match, Standings, Team} from "@/types/interfaces";
import MatchesComponent from "@/components/MatchesComponent";
import generateRoundRobinSchedule from "@/helpers/generateRoundRobinSchedule";
import simulateMatch from "@/helpers/simulateMatch";
import sortTeams from "@/helpers/sortTeams";
import StandingsTable from "@/components/StandingsTable";
import {HOME_PAGE, NATIONAL_TEAMS_PAGE, CLUBS_PAGE} from "@/urls/routes";
import Link from "next/link";

const Simulator: FC = () => {
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
    const [matches, setMatches] = useState<Match[][]>([]);
    const [standings, setStandings] = useState<Standings>({});

    useEffect(() => {
        const storedRightTeams = localStorage.getItem('rightTeams');
        if (storedRightTeams) {
            const teams = JSON.parse(storedRightTeams);
            setSelectedTeams(teams);
            setMatches(generateRoundRobinSchedule(teams));
        }
    }, []);

    const handleSimulateMatch = (roundIndex: number, matchIndex: number) => {
        const { updatedMatches, updatedStandings } = simulateMatch(matches, standings, roundIndex, matchIndex);
        setMatches(updatedMatches);
        setStandings(updatedStandings);
    };

    const sortedTeams = sortTeams(selectedTeams, standings);

    return (
        <div className="bg-gray-100 p-4">
            <div className="flex justify-between items-center">
                <h1 className="uppercase font-bold">Simulator</h1>
                <div className="flex gap-2">
                    <Link
                        href={HOME_PAGE}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 text-xs"
                    >
                        Home
                    </Link>
                    <Link
                        href={NATIONAL_TEAMS_PAGE}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-xs"
                    >
                        National Teams
                    </Link>
                    <Link
                        href={CLUBS_PAGE}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 text-xs"
                    >
                        Clubs
                    </Link>
                </div>
            </div>
            <div className="overflow-x-auto mt-2">
                <StandingsTable standings={standings} sortedTeams={sortedTeams} />
            </div>

            <MatchesComponent matches={matches} simulateMatch={handleSimulateMatch} />

        </div>
    );
};

export default Simulator;