"use client";

import React, {FC, useState, useEffect} from 'react';
import {Club, Entity, Team} from "@/types/interfaces";
import Link from "next/link";
import Image from 'next/image';
import EntityFilter from "@/components/EntityFilter";
import {CLUBS_PAGE, HOME_PAGE, NATIONAL_TEAMS_PAGE, SIMULATOR_PAGE} from "@/urls/routes";
import {MdDelete} from "react-icons/md";
import {usePathname} from "next/navigation";

interface ClubsProps {
    entities: Entity[]
    clubs: Club[]
}

const Teams: FC<ClubsProps> = ({entities, clubs}) => {

    const pathname = usePathname()
    const ntp = pathname === NATIONAL_TEAMS_PAGE
    const [teams] = useState<Club[]>(clubs);
    const [leftTeams, setLeftTeams] = useState<Club[]>(teams);
    const [rightTeams, setRightTeams] = useState<Club[]>([]);
    const [selectedConfederation, setSelectedConfederation] = useState<string>("");

    useEffect(() => {
        localStorage.setItem('rightTeams', JSON.stringify(rightTeams));
    }, [rightTeams]);

    const handleTeamClick = (team: Club) => {
        setLeftTeams(leftTeams.filter(t => t.member.id !== team.member.id));
        setRightTeams([...rightTeams, team]);
    };

    const handleRemoveTeamClick = (team: Club) => {
        setRightTeams(rightTeams.filter(t => t.member.id !== team.member.id));
        setLeftTeams([...leftTeams, team]);
    };

    const handleConfederationChange = (name: string) => {
        setSelectedConfederation(name);
    };

    const filteredLeftTeams = selectedConfederation === ""
        ? leftTeams.filter(team => team.overallRanking.position <= 32)
        : leftTeams.filter(team => team.member.countryName === selectedConfederation);

    const sortedFilteredLeftTeams = filteredLeftTeams.sort((a, b) => a.overallRanking.position - b.overallRanking.position);

    return (
        <div className="bg-gray-100 p-4 h-screen overflow-auto md:overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[auto_320px] h-full gap-4">

                <div className="bg-white shadow-lg p-2 w-full">
                    <div className="flex items-center justify-between mb-2 p-2">
                        <h2 className="font-bold">{ntp ? "National Teams" : "Clubs"}</h2>
                        <div className="flex gap-2">
                            <Link
                                href={HOME_PAGE}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 text-xs"
                            >
                                Home
                            </Link>
                            <Link
                                href={CLUBS_PAGE}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 text-xs"
                            >
                                Clubs
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg p-2 mb-2">
                        <EntityFilter
                            entities={entities}
                            selectedEntity={selectedConfederation}
                            onEntityChange={handleConfederationChange}
                            club
                        />
                    </div>
                    <ul className="flex flex-wrap overflow-auto max-h-[calc(100vh-128px)] gap-1">
                        {sortedFilteredLeftTeams.map((team: Club) => (
                            <li
                                key={team.member.id}
                                className="bg-gray-50 rounded shadow-md overflow-hidden cursor-pointer p-2
                                            flex-[1_1_96%] max-w-[96%]
                                            lg:flex-[1_1_48%] lg:max-w-[48%]
                                            2xl:flex-[1_1_24%] 2xl:max-w-[24%]"
                                onClick={() => handleTeamClick(team)}
                            >
                                <div className="flex items-center space-x-2">
                                    <Image src={team.member.logoUrl} alt={team.member.displayNameShort} width={16} height={10}
                                           className="rounded-sm"/>
                                    <h2 className="text-sm font-semibold">{team.member.displayNameShort}</h2>
                                </div>
                                <p className="text-xs text-gray-600">Country: {team.member.countryName}</p>
                                <p className="text-xs text-gray-600">Ranking: {Math.round(team.overallRanking.position)}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-gray-200 shadow-lg p-2">
                    <div className="flex items-center justify-between mb-2 p-2">
                        <h2 className="font-bold">Selected Teams</h2>
                        {rightTeams.length >= 3 && (
                            <div>
                                <Link href={SIMULATOR_PAGE}
                                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-xs">
                                    Simulator
                                </Link>
                            </div>
                        )}
                    </div>

                    <ul className="grid grid-cols-1 gap-y-2 overflow-y-auto max-h-[calc(100vh-96px)] px-2">
                        {rightTeams.map((team: Club) => (
                            <li key={team.member.id}
                                className="bg-gray-50 rounded-lg shadow-md overflow-hidden p-2 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Image src={team.member.logoUrl} alt={team.member.displayNameShort} width={16} height={10}
                                               className="rounded-sm"/>
                                        <h2 className="text-sm font-semibold">{team.member.displayNameShort}</h2>
                                    </div>
                                    <p className="text-xs text-gray-600">Country: {team.member.countryName}</p>
                                    <p className="text-xs text-gray-600">Ranking: {Math.round(team.overallRanking.position)}</p>
                                </div>
                                <button
                                    className="ml-4 text-red-500 p-1 rounded text-xl"
                                    onClick={() => handleRemoveTeamClick(team)}
                                >
                                    <MdDelete/>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Teams;