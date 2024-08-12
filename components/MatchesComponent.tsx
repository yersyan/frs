import React, {ReactElement} from 'react';
import Image from 'next/image';
import {Match} from "@/types/interfaces";


interface Props {
    matches: Match[][];
    simulateMatch: (roundIndex: number, matchIndex: number) => void;
}

const MatchesComponent: React.FC<Props> = ({ matches, simulateMatch }) => {
    return (
        <>
            {matches
                .reduce<ReactElement[][]>((acc, round, roundIndex) => {
                    const rowIndex = Math.floor(roundIndex / 3);
                    if (!acc[rowIndex]) {
                        acc[rowIndex] = [];
                    }
                    acc[rowIndex].push(
                        <div
                            key={roundIndex}
                            className="flex-1 min-w-full lg:min-w-[50%] p-2 mb-2"
                        >
                            <div className="mb-2 flex flex-col justify-between h-full">
                                <h3 className="font-semibold mb-2">Round {roundIndex + 1}</h3>
                                <ul className="space-y-4 flex-grow">
                                    {round.map((match, matchIndex) => (
                                        <li
                                            key={matchIndex}
                                            className="flex items-center justify-between bg-white p-2 rounded shadow"
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
                                                        onClick={() => simulateMatch(roundIndex, matchIndex)}
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
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                    return acc;
                }, [])
                .map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex flex-wrap justify-between -mx-2"
                    >
                        {row}
                    </div>
                ))}
        </>
    );
};

export default MatchesComponent;