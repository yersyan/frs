"use client";

import React, { FC, useEffect, useState } from 'react';
import { Match, Standings, Team } from "@/types/interfaces";
import MatchesComponent from "@/components/MatchesComponent";
import generateRoundRobinSchedule from "@/helpers/generateRoundRobinSchedule";
import simulateMatch from "@/helpers/simulateMatch";
import sortTeams from "@/helpers/sortTeams";
import StandingsTable from "@/components/StandingsTable";
import {HOME_PAGE, NATIONAL_TEAMS_PAGE, CLUBS_PAGE, TOURNAMENT_OPTIONS_PAGE, WINNER_PAGE} from "@/urls/routes";
import Link from "next/link";
import distributeTeamsIntoGroups from "@/helpers/distributeTeamsIntoGroups";
import shuffleTeamsKeepPositions from "@/helpers/shuffleTeamsKeepPositions";
import shuffleTeamsRandomly from "@/helpers/shuffleTeamsRandomly";

const Simulator: FC = () => {
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
    const [groupsMatches, setGroupsMatches] = useState<Match[][][]>([]);
    const [standings, setStandings] = useState<{ [key: number]: Standings }>({});
    const [hideTables, setHideTables] = useState(false);
    const [isRandomShuffleApplied, setIsRandomShuffleApplied] = useState(false);
    const [allMatchesCompleted, setAllMatchesCompleted] = useState(false);  // New state to track if all matches are completed
    const [advancingTeams, setAdvancingTeams] = useState<Team[]>([]);  // State to store advancing teams

    useEffect(() => {
        const storedRightTeams = localStorage.getItem('rightTeams');
        const gamesOption = parseInt(localStorage.getItem('gamesOption') || '1');
        const selectedGroupCount = parseInt(localStorage.getItem('selectedGroups') || '1');

        if (storedRightTeams) {
            const teams: Team[] = JSON.parse(storedRightTeams);
            setSelectedTeams(teams);

            const groups = distributeTeamsIntoGroups(teams, selectedGroupCount);
            const allGroupsMatches: Match[][][] = groups.map(group => generateRoundRobinSchedule(group, gamesOption));
            setGroupsMatches(allGroupsMatches);

            // Initialize standings for each group
            const initialStandings: { [key: number]: Standings } = {};
            groups.forEach((group, index) => {
                initialStandings[index] = group.reduce((acc, team) => ({
                    ...acc,
                    [team.id]: { GP: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }
                }), {}) as Standings;
            });
            setStandings(initialStandings);

            // Check if all groups have exactly 2 teams
            const allGroupsHaveTwoTeams = groups.every(group => group.length === 2);
            setHideTables(allGroupsHaveTwoTeams);
        }
    }, []);


    const checkAllMatchesCompleted = () => {
        // Check if all matches are completed in all groups
        const completed = groupsMatches.every(groupMatches =>
            groupMatches.every(roundMatches =>
                roundMatches.every(match => match.simulated)  // Assuming 'completed' is a boolean flag on each match
            )
        );
        setAllMatchesCompleted(completed);
        if (completed) {
            determineAdvancingTeams();
        }
    };

    useEffect(() => {
        if(groupsMatches.length){
            checkAllMatchesCompleted()
        }
    }, [groupsMatches])

    const determineAdvancingTeams = () => {
        const teamsAdvance = parseInt(localStorage.getItem('teamsAdvance') || '1');
        const advancing: Team[] = [];

        Object.keys(standings).forEach(groupIndex => {
            const sortedTeams = sortedTeamsByGroup(parseInt(groupIndex));
            const advancingFromGroup = sortedTeams.slice(0, teamsAdvance);  // Get the top teamsAdvance teams
            advancing.push(...advancingFromGroup);
        });

        setAdvancingTeams(advancing);
        localStorage.setItem('rightTeams', JSON.stringify(advancing));  // Store advancing teams in localStorage
        localStorage.removeItem('selectedGroups');
        localStorage.removeItem('teamsAdvance');
    };

    // Function to shuffle teams while keeping positions
    const handleShuffleKeepPositions = () => {
        if (isRandomShuffleApplied) {
            window.location.reload();
        } else {
            const newGroupsMatches = shuffleTeamsKeepPositions(groupsMatches);
            setGroupsMatches(newGroupsMatches);
        }
    };

    // Function to shuffle teams randomly
    const handleShuffleRandomly = () => {
        const newGroupsMatches = shuffleTeamsRandomly(groupsMatches);
        setGroupsMatches(newGroupsMatches);
        setIsRandomShuffleApplied(true);
    };

    const handleSimulateMatch = (groupIndex: number, roundIndex: number, matchIndex: number) => {
        const groupMatches = groupsMatches[groupIndex];
        const { updatedMatches, updatedStandings } = simulateMatch(groupMatches, standings[groupIndex], roundIndex, matchIndex);
        const updatedGroupsMatches = [...groupsMatches];
        updatedGroupsMatches[groupIndex] = updatedMatches;
        setGroupsMatches(updatedGroupsMatches);
        setStandings({ ...standings, [groupIndex]: updatedStandings });
    };


    const sortedTeamsByGroup = (groupIndex: number) => {
        return sortTeams(
            selectedTeams.filter(team =>
                groupsMatches[groupIndex].some(match =>
                    match.some(m => m.home.id === team.id || m.away.id === team.id)
                )
            ),
            standings[groupIndex]
        );
    };

    // Determine the route based on the number of teams left
    const getProceedToNextRoute = () => {
        if (advancingTeams.length === 1) {
            return WINNER_PAGE;  // Navigate to winner page
        }
        return TOURNAMENT_OPTIONS_PAGE;  // Navigate to tournament options page
    };

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

            {/* Shuffle button */}
            <div className="mt-4 flex gap-2">
                {!allMatchesCompleted ? (
                    <>
                        <button
                            onClick={handleShuffleKeepPositions}
                            className="text-sm bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                        >
                            {isRandomShuffleApplied ? "Reset" : "Shuffle (Keep Positions)"}
                        </button>

                        <button
                            onClick={handleShuffleRandomly}
                            className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Shuffle (Randomly)
                        </button>
                    </>
                ) : (
                    <Link
                        href={getProceedToNextRoute()}
                        className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Next
                    </Link>
                )}
            </div>

            {!hideTables && (
                <div className="overflow-x-auto mt-2">
                    {Object.keys(standings).map((groupIndex) => (
                        <StandingsTable
                            key={groupIndex}
                            groupIndex={parseInt(groupIndex)}
                            standings={standings[parseInt(groupIndex)]}
                            sortedTeams={sortedTeamsByGroup(parseInt(groupIndex))}
                        />
                    ))}
                </div>
            )}

            <MatchesComponent groupsMatches={groupsMatches} simulateMatch={handleSimulateMatch} />
        </div>
    );
};

export default Simulator;