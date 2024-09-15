"use client";

import React, { FC, useState, useEffect } from 'react';
import { Entity, Team } from "@/utils/types/interfaces";
import EntityFilter from "@/components/EntityFilter";
import { TOURNAMENT_OPTIONS_PAGE } from "@/utils/routes/pages";
import Pages from "@/components/ui/Pages";
import TeamList from "@/components/teams/TeamList";

interface TeamProps {
    entities: Entity[],
    teamsData: Team[]
}

const Teams: FC<TeamProps> = ({ entities, teamsData }) => {

    const [teams] = useState(teamsData);
    const [leftTeams, setLeftTeams] = useState(teams);
    const [rightTeams, setRightTeams] = useState<Team[]>([]);
    const [selectedConfederation, setSelectedConfederation] = useState("");

    useEffect(() => {
        localStorage.setItem('rightTeams', JSON.stringify(rightTeams));
        ['gamesOption', 'selectedGroups', 'teamsAdvance', 'additionalAdvance', 'thirdPlaceTeams', 'topThreeTeams'].forEach(key => localStorage.removeItem(key));
    }, [rightTeams]);

    const handleTeamClick = (team: Team) => {
        setLeftTeams(leftTeams.filter(t => t.id !== team.id));
        setRightTeams([...rightTeams, team]);
    };

    const handleRemoveTeamClick = (team: Team) => {
        setRightTeams(rightTeams.filter(t => t.id !== team.id));
        setLeftTeams([...leftTeams, team]);
    };

    const filteredLeftTeams = selectedConfederation === ""
        ? leftTeams.filter(team => team.position <= 32).sort((a, b) => a.position - b.position).filter((_, index) => index < 32)
        : leftTeams.filter(team => team.entity === selectedConfederation).sort((a, b) => a.position - b.position);

    const filteredRightTeams = rightTeams.sort((a, b) => a.position - b.position);

    return (
        <div className="bg-gray-100 p-2 h-screen overflow-auto md:overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[auto_320px] h-full gap-2">
                <div className="bg-white shadow-lg p-2 w-full">
                    <EntityFilter entities={entities} selectedEntity={selectedConfederation} onEntityChange={setSelectedConfederation} />
                    <TeamList teams={filteredLeftTeams} handleTeamClick={handleTeamClick}/>
                </div>
                <div className="bg-gray-200 shadow-lg p-2">
                    <header className="flex items-center justify-between bg-gray-800 text-white p-2 mb-2">
                        <h2 className="font-bold">Selected Teams</h2>
                        {rightTeams.length >= 2 && <Pages pages={[TOURNAMENT_OPTIONS_PAGE]} />}
                    </header>
                    <TeamList teams={filteredRightTeams} handleRemoveTeamClick={handleRemoveTeamClick}/>
                </div>
            </div>
        </div>
    );
};

export default Teams;