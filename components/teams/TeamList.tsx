import React from 'react';
import Image from 'next/image';
import {Team} from "@/utils/types/interfaces";
import {MdDelete} from "react-icons/md";

interface TeamListProps {
    teams: Team[];
    handleTeamClick?: (team: Team) => void;
    handleRemoveTeamClick?: (team: Team) => void;
}

const TeamList: React.FC<TeamListProps> = ({teams, handleTeamClick, handleRemoveTeamClick}) => {
    return (
        <ul className={`flex flex-wrap gap-2 overflow-auto max-h-[calc(100vh_-_112px)] grid ${!handleRemoveTeamClick ? "lg:grid-cols-2 xl:grid-cols-4" : ""}`}>
            {teams.map(team => (
                <li key={team.id}
                    className="bg-slate-100 rounded shadow-md p-2 cursor-pointer "
                    onClick={() => handleTeamClick ? handleTeamClick(team) : null}>
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                            <Image src={team.image} alt={team.name} width={16} height={10} className="rounded-sm"/>
                            <h2 className="font-bold mx-[2px]">{team.name}</h2>
                            <p>({Math.round(team.position)})</p>
                        </div>
                        <div>
                            {handleRemoveTeamClick && <button
                                className="ml-4 text-red-500 p-1 rounded text-xl"
                                onClick={() => handleRemoveTeamClick ? handleRemoveTeamClick(team) : null}
                            >
                                    <MdDelete/>
                            </button>}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default TeamList;