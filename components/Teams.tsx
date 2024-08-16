"use client";

import React, {FC, useState, useEffect} from 'react';
import {Entity, Team} from "@/types/interfaces";
import Link from "next/link";
import Image from 'next/image';
import EntityFilter from "@/components/EntityFilter";
import {CLUBS_PAGE, HOME_PAGE, NATIONAL_TOURNAMENTS_PAGE, SIMULATOR_PAGE} from "@/urls/routes";
import {MdDelete} from "react-icons/md";

interface TeamProps {
    entities: Entity[]
    teamsData: Team[]
}

const Teams: FC<TeamProps> = ({entities, teamsData}) => {

    const [teams] = useState<Team[]>(teamsData);
    const [leftTeams, setLeftTeams] = useState<Team[]>(teams);
    const [rightTeams, setRightTeams] = useState<Team[]>([]);
    const [selectedConfederation, setSelectedConfederation] = useState<string>("");

    useEffect(() => {
        localStorage.setItem('rightTeams', JSON.stringify(rightTeams));
    }, [rightTeams]);

    const handleTeamClick = (team: Team) => {
        setLeftTeams(leftTeams.filter(t => t.id !== team.id));
        setRightTeams([...rightTeams, team]);
    };

    const handleRemoveTeamClick = (team: Team) => {
        setRightTeams(rightTeams.filter(t => t.id !== team.id));
        setLeftTeams([...leftTeams, team]);
    };

    const handleConfederationChange = (name: string) => {
        setSelectedConfederation(name);
    };

    const filteredLeftTeams = selectedConfederation === ""
        ? leftTeams.filter(team => team.position <= 32)
        : leftTeams.filter(team => team.entity === selectedConfederation);

    const sortedFilteredLeftTeams = filteredLeftTeams.sort((a, b) => a.position - b.position);

    return (
        <div className="bg-gray-100 p-4 h-screen overflow-auto md:overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[auto_320px] h-full gap-4">

                <div className="bg-white shadow-lg p-2 w-full">
                    <div className="flex items-center justify-between mb-2 p-2">
                        <h2 className="font-bold">Teams</h2>
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
                            <Link
                                href={NATIONAL_TOURNAMENTS_PAGE}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 text-xs"
                            >
                                National tournaments
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg p-2 mb-2">
                        <EntityFilter
                            entities={entities}
                            selectedEntity={selectedConfederation}
                            onEntityChange={handleConfederationChange}
                        />
                    </div>
                    <ul className="flex flex-wrap overflow-auto max-h-[calc(100vh-128px)] gap-1">
                        {sortedFilteredLeftTeams.map((team: Team) => (
                            <li
                                key={team.id}
                                className="bg-gray-50 rounded shadow-md overflow-hidden cursor-pointer p-2
                                            flex-[1_1_96%] max-w-[96%]
                                            lg:flex-[1_1_48%] lg:max-w-[48%]
                                            2xl:flex-[1_1_24%] 2xl:max-w-[24%]"
                                onClick={() => handleTeamClick(team)}
                            >
                                <div className="flex items-center space-x-2">
                                    <Image src={team.image} alt={team.name} width={16} height={10}
                                           className="rounded-sm"/>
                                    <h2 className="text-sm font-semibold">{team.name}</h2>
                                </div>
                                <p className="text-xs text-gray-600">Entity: {team.entity}</p>
                                <p className="text-xs text-gray-600">Ranking: {Math.round(team.position)}</p>
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
                        {rightTeams.map((team: Team) => (
                            <li key={team.id}
                                className="bg-gray-50 rounded-lg shadow-md overflow-hidden p-2 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Image src={team.image} alt={team.name} width={16} height={10}
                                               className="rounded-sm"/>
                                        <h2 className="text-sm font-semibold">{team.name}</h2>
                                    </div>
                                    <p className="text-xs text-gray-600">Entity: {team.entity}</p>
                                    <p className="text-xs text-gray-600">Ranking: {Math.round(team.position)}</p>
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