import React, {useEffect, useState} from "react";
import {Team} from "@/utils/types/interfaces";

interface TeamsAdvance {
    teams: Team[]
    selectedGroups: number
    teamsAdvance: number
    setTeamsAdvance: React.Dispatch<React.SetStateAction<number>>;
    additionalAdvance: number
    setAdditionalAdvance: React.Dispatch<React.SetStateAction<number>>
}

const TeamsAdvance: React.FC<TeamsAdvance> = ({teams, selectedGroups, teamsAdvance, setTeamsAdvance, additionalAdvance, setAdditionalAdvance}) => {

    const [teamsAdvanceOptions, setTeamsAdvanceOptions] = useState<number[]>([]); // Options for teams advancing
    const [additionalAdvanceOptions, setAdditionalAdvanceOptions] = useState<number[]>([]); // Options for additional advancing teams

    // Handle change of teams advancing selection
    const handleTeamsAdvanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTeamsAdvance = parseInt(event.target.value);
        setTeamsAdvance(selectedTeamsAdvance);

        // Update additional advancing options based on the newly selected advancing teams
        updateAdditionalAdvanceOptions(selectedGroups);
        setAdditionalAdvance(0); // Reset additional advance
    };

    // Handle change of additional advancing teams selection
    const handleAdditionalAdvanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAdditionalAdvance = parseInt(event.target.value);
        setAdditionalAdvance(selectedAdditionalAdvance);
    };

    const updateTeamsAdvanceOptions = (teamsCount: number, groupCount: number) => {
        const teamsPerGroup = Math.floor(teamsCount / groupCount);
        const maxAdvance = teamsPerGroup - 1;
        const options = Array.from({ length: maxAdvance }, (_, i) => i + 1);
        setTeamsAdvanceOptions(options);
        // Update additional advancing options dynamically based on teams advancing from each group
        updateAdditionalAdvanceOptions(groupCount);
    };

    const updateAdditionalAdvanceOptions = (groupCount: number) => {
        // Options range from 1 to (number of groups - 1)
        const additionalOptions = Array.from({ length: groupCount - 1 }, (_, i) => i + 1);
        setAdditionalAdvanceOptions(additionalOptions);
    };

    useEffect(() => {
        if(teams.length){
            // Update teams advancing options based on the number of groups
            updateTeamsAdvanceOptions(teams.length, selectedGroups);
        }
    }, [teams, selectedGroups])

    return <div>
        {
            teamsAdvanceOptions.length > 0 && <>
                <label className="block text-sm font-semibold mb-2 mt-4">Number of Teams Advancing from Each
                    Group:</label>
                <select
                    className="form-select mt-1 block w-full"
                    value={teamsAdvance}
                    onChange={handleTeamsAdvanceChange}
                >
                    {teamsAdvanceOptions.map((option) => (
                        <option key={option} value={option}>
                            {option} Teams
                        </option>
                    ))}
                </select>
            </>
        }
        {
            additionalAdvanceOptions.length > 0 && (
                <>
                    <label className="block text-sm font-semibold mb-2 mt-4">
                        Number of Best Ranked Teams Advancing from Next Position (e.g., {teamsAdvance + 1} Place):
                    </label>
                    <select
                        className="form-select mt-1 block w-full"
                        value={additionalAdvance}
                        onChange={handleAdditionalAdvanceChange}
                    >
                        <option value={0}>None</option>
                        {additionalAdvanceOptions.map((option) => (
                            <option key={option} value={option}>
                                {option} Teams
                            </option>
                        ))}
                    </select>
                </>
            )
        }
    </div>
}

export default TeamsAdvance