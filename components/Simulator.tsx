"use client";

import React, {FC, useEffect, useState} from 'react';
import {Match, Standings, Team} from "@/types/interfaces";
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
    const [thirdPlaceMatch, setThirdPlaceMatch] = useState<Match[][][]>([]); // State for third-place match
    const [thirdPlaceStandings, setThirdPlaceStandings] = useState<{ [key: number]: Standings }>({});

    useEffect(() => {
        if (Object.keys(thirdPlaceStandings).length > 0) {
            const teamsAdvance = parseInt(localStorage.getItem('teamsAdvance') || '1');
            const storedThirdPlaceTeams = localStorage.getItem('thirdPlaceTeams');
            const teams: Team[] = JSON.parse(storedThirdPlaceTeams);

            Object.keys(thirdPlaceStandings).forEach(groupIndex => {
                const sortedTeams = sortedTeamsByGroup(parseInt(groupIndex), teams, thirdPlaceMatch, thirdPlaceStandings);
                const thirdPlaceTeam = sortedTeams.slice(0, teamsAdvance);  // Get the third place team
                localStorage.setItem('topThreeTeams', JSON.stringify(thirdPlaceTeam))
            });
        }
    }, [thirdPlaceStandings])

    useEffect(() => {
        const storedRightTeams = localStorage.getItem('rightTeams');
        const gamesOption = parseInt(localStorage.getItem('gamesOption') || '1');
        const selectedGroupCount = parseInt(localStorage.getItem('selectedGroups') || '1');
        const storedThirdPlaceTeams = localStorage.getItem('thirdPlaceTeams');

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
                    [team.id]: {GP: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0}
                }), {}) as Standings;
            });
            setStandings(initialStandings);

            // Check if all groups have exactly 2 teams
            const allGroupsHaveTwoTeams = groups.every(group => group.length === 2);
            setHideTables(allGroupsHaveTwoTeams);

            // Handle third-place match if applicable
            if (teams.length === 2 && storedThirdPlaceTeams) {
                const thirdPlaceTeams: Team[] = JSON.parse(storedThirdPlaceTeams);
                if (thirdPlaceTeams.length === 2) {
                    // Create a third-place match
                    const thirdPlaceGroup = distributeTeamsIntoGroups(thirdPlaceTeams, 1);
                    const thirdPlaceMatch: Match[][][] = thirdPlaceGroup.map(group => generateRoundRobinSchedule(group, gamesOption));
                    setThirdPlaceMatch(thirdPlaceMatch);

                    const initialThirdPlaceStandings: { [key: number]: Standings } = {};
                    thirdPlaceGroup.forEach((group, index) => {
                        initialThirdPlaceStandings[index] = group.reduce((acc, team) => ({
                            ...acc,
                            [team.id]: {GP: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0}
                        }), {}) as Standings;
                    });
                    setThirdPlaceStandings(initialThirdPlaceStandings);
                }
            }
        }
    }, []);

    const checkAllMatchesCompleted = () => {
        // Check if all matches are completed in all groups
        const completed = groupsMatches.every(groupMatches =>
            groupMatches.every(roundMatches =>
                roundMatches.every(match => match.simulated)  // Assuming 'simulated' is a boolean flag on each match
            )
        );
        setAllMatchesCompleted(completed);
        if (completed) {
            determineAdvancingTeams();
        }
    };

    useEffect(() => {
        if (groupsMatches.length) {
            checkAllMatchesCompleted()
        }
    }, [groupsMatches]);

    const determineAdvancingTeams = () => {
        const teamsAdvance = parseInt(localStorage.getItem('teamsAdvance') || '1');
        const selectedGroupCount = parseInt(localStorage.getItem('selectedGroups') || '1');
        const additionalAdvance = parseInt(localStorage.getItem('additionalAdvance') || '0');
        const storedTopThreeTeams = localStorage.getItem('topThreeTeams');
        const advancing: Team[] = [];
        const thirdPlaceTeams: Team[] = []; // Array to store teams for the 3rd place match
        const topThreeTeams: Team[] = JSON.parse(storedTopThreeTeams) || []; // Array to store top 3 teams if needed

        Object.keys(standings).forEach(groupIndex => {
            const sortedTeams = sortedTeamsByGroup(parseInt(groupIndex), selectedTeams, groupsMatches, standings);
            const advancingFromGroup = sortedTeams.slice(0, teamsAdvance);  // Get the top teamsAdvance teams
            advancing.push(...advancingFromGroup);

            if (selectedGroupCount === 1) {
                if (teamsAdvance === 1) {
                    // For 1 group and 1 team advancing: store the top 3 teams
                    topThreeTeams.unshift(...sortedTeams.slice(0, 3));
                } else if (teamsAdvance === 2) {
                    // For 1 group and 2 teams advancing: store the 3rd place team
                    thirdPlaceTeams.push(sortedTeams[2]);
                }
            } else if (selectedTeams.length === 4 && selectedGroupCount === 2) {
                // For 4 teams in 2 groups: store the losing teams for the 3rd place match
                const losingTeams = sortedTeams.slice(teamsAdvance);  // Get the losing teams (those not in the top 'teamsAdvance')
                thirdPlaceTeams.push(...losingTeams);
            }
        });

        // Store the results in localStorage based on the conditions
        if (selectedGroupCount === 1) {
            if (teamsAdvance === 1) {
                // Store the top 3 teams
                localStorage.setItem('topThreeTeams', JSON.stringify(topThreeTeams));
            } else if (teamsAdvance === 2) {
                // Store the 3rd place team
                localStorage.setItem('thirdPlaceTeams', JSON.stringify(thirdPlaceTeams));
            }
        } else if (selectedTeams.length === 4 && selectedGroupCount === 2) {
            // Store the losing teams for the 3rd place match
            localStorage.setItem('thirdPlaceTeams', JSON.stringify(thirdPlaceTeams));
        }

        // Step 2: Determine the additional advancing teams based on the user selection
        if (additionalAdvance > 0) {
            const nextPositionTeams: Team[] = [];

            Object.keys(standings).forEach(groupIndex => {
                const sortedTeams = sortedTeamsByGroup(parseInt(groupIndex), selectedTeams, groupsMatches, standings);
                if (sortedTeams.length > teamsAdvance) {
                    nextPositionTeams.push(sortedTeams[teamsAdvance]);  // Get the team at the next rank position
                }
            });

            // Sort these teams by their points (and other criteria like goal difference if needed)
            nextPositionTeams.sort((a, b) => {
                const groupAIndex = getGroupIndexByTeam(a);
                const groupBIndex = getGroupIndexByTeam(b);

                const standingsA = standings[groupAIndex];
                const standingsB = standings[groupBIndex];

                const teamAStats = standingsA[a.id];
                const teamBStats = standingsB[b.id];

                // Sort by Points, then Goal Difference (GD), then Goals For (GF)
                if (teamAStats.Pts !== teamBStats.Pts) {
                    return teamBStats.Pts - teamAStats.Pts;
                } else if (teamAStats.GD !== teamBStats.GD) {
                    return teamBStats.GD - teamAStats.GD;
                } else {
                    return teamBStats.GF - teamAStats.GF;
                }
            });

            // Add the top 'additionalAdvance' number of teams to the advancing list
            advancing.push(...nextPositionTeams.slice(0, additionalAdvance));
        }

        setAdvancingTeams(advancing);
        localStorage.setItem('rightTeams', JSON.stringify(advancing));  // Store advancing teams in localStorage
        localStorage.removeItem('selectedGroups');
        localStorage.removeItem('teamsAdvance');
        localStorage.removeItem('additionalAdvance');
    };


    const getGroupIndexByTeam = (team: Team): number => {
        // Helper function to find the group index for a given team
        return Object.keys(standings).find(groupIndex =>
            groupsMatches[parseInt(groupIndex)].some(roundMatches =>
                roundMatches.some(match => match.home.id === team.id || match.away.id === team.id)
            )
        ) as unknown as number;
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
        const {
            updatedMatches,
            updatedStandings
        } = simulateMatch(groupMatches, standings[groupIndex], roundIndex, matchIndex);
        const updatedGroupsMatches = [...groupsMatches];
        updatedGroupsMatches[groupIndex] = updatedMatches;
        setGroupsMatches(updatedGroupsMatches);
        setStandings({...standings, [groupIndex]: updatedStandings});
    };

    const handleSimulateThirdPlaceMatch = (groupIndex: number, roundIndex: number, matchIndex: number) => {
        const groupMatches = thirdPlaceMatch[groupIndex];
        const {
            updatedMatches,
            updatedStandings
        } = simulateMatch(groupMatches, thirdPlaceStandings[groupIndex], roundIndex, matchIndex);
        const updatedGroupsMatches = [...thirdPlaceMatch];
        updatedGroupsMatches[groupIndex] = updatedMatches;
        setThirdPlaceMatch(updatedGroupsMatches);
        setThirdPlaceStandings({...thirdPlaceStandings, [groupIndex]: updatedStandings});
    };

    const sortedTeamsByGroup = (groupIndex: number, teams: Team[], matches: Match[][][], teamStandings: { [key: number]: Standings }) => {
        return sortTeams(
            teams.filter(team =>
                matches[groupIndex].some(match =>
                    match.some(m => m.home.id === team.id || m.away.id === team.id)
                )
            ),
            teamStandings[groupIndex]
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
                            sortedTeams={sortedTeamsByGroup(parseInt(groupIndex), selectedTeams, groupsMatches, standings)}
                        />
                    ))}
                </div>
            )}

            {thirdPlaceMatch.length > 0 && (
                <div>
                    <h2>Third Place Match</h2>
                    <MatchesComponent
                        groupsMatches={thirdPlaceMatch}
                        simulateMatch={handleSimulateThirdPlaceMatch}
                    />
                </div>
            )}

            <MatchesComponent groupsMatches={groupsMatches} simulateMatch={handleSimulateMatch}/>
        </div>
    );
};

export default Simulator;
