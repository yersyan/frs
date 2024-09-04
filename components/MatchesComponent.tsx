import React, { ReactElement } from 'react';
import Image from 'next/image';
import { Match } from "@/types/interfaces";

interface Props {
    groupsMatches: Match[][][];  // Array of matches for each group
    simulateMatch: (groupIndex: number, roundIndex: number, matchIndex: number) => void;
}

const MatchesComponent: React.FC<Props> = ({ groupsMatches, simulateMatch }) => {
    // Determine the total number of rounds by finding the max round length
    const maxRounds = Math.max(...groupsMatches.map(groupMatches => groupMatches.length));

    // Create an array of rounds, where each round contains matches from all groups
    const rounds = Array.from({ length: maxRounds }, (_, roundIndex) =>
        groupsMatches.map(groupMatches => groupMatches[roundIndex] || []) // Get matches for the roundIndex, fallback to empty array if not available
    );

    return (
        <>
            {rounds.map((roundMatches, roundIndex) => (
                <div key={roundIndex} className="mb-6">
                    <h2 className="text-lg font-bold mb-4">Round {roundIndex + 1}</h2>
                    {roundMatches
                        .reduce<ReactElement[]>((acc, matches, groupIndex) => {
                            if (matches.length > 0) {
                                acc.push(
                                    <div key={groupIndex} className="mb-6">
                                        <h3 className="text-sm font-bold mb-4">Group {groupIndex + 1}</h3>
                                        {matches.map((match, matchIndex) => (
                                            <div
                                                key={matchIndex}
                                                className="flex items-center justify-between bg-white p-2 rounded shadow mb-2"
                                            >
                                                <div className="flex flex-col md:flex-row w-full">
                                                    <div className="flex justify-between md:justify-start items-center">
                                                        <div className="flex items-center">
                                                            <Image
                                                                src={match.home.image}
                                                                alt={match.home.name}
                                                                width={16}
                                                                height={10}
                                                                objectFit="cover"
                                                                className="rounded-sm"
                                                            />
                                                            <span className="ml-2 text-sm font-bold">{match.home.name}</span>
                                                        </div>
                                                        <span className="md:hidden font-bold">{match.homeGoals}</span>
                                                    </div>
                                                    <div className="hidden md:flex items-center mx-2">-</div>
                                                    <div className="flex items-center mt-2 md:mt-0 justify-between md:justify-start">
                                                        <div className="flex flex-row-reverse md:flex-row items-center">
                                                            <span className="ml-2 md:ml-0 mr-0 md:mr-2 text-sm font-bold">{match.away.name}</span>
                                                            <Image
                                                                src={match.away.image}
                                                                alt={match.away.name}
                                                                width={16}
                                                                height={10}
                                                                objectFit="cover"
                                                                className="rounded-sm"
                                                            />
                                                        </div>
                                                        <span className="md:hidden font-bold">{match.awayGoals}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    {match.simulated ? (
                                                        <span className="hidden md:inline-flex mx-2 font-bold min-w-20 justify-end">
                                                            {match.homeGoals} - {match.awayGoals}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => simulateMatch(groupIndex, roundIndex, matchIndex)}
                                                            className={`mx-2 px-2 py-1 text-white text-sm rounded ${
                                                                match.simulated
                                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                                    : 'bg-blue-500'
                                                            }`}
                                                            disabled={match.simulated}
                                                        >
                                                            Simulate
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return acc;
                        }, [])
                    }
                </div>
            ))}
        </>
    );
};

export default MatchesComponent;
