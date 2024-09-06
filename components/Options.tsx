"use client";

import React, { useState, useEffect } from "react";
import getValidGroupSizes from "@/helpers/getValidGroupSizes";

const Options: React.FC = () => {
    const [gamesOption, setGamesOption] = useState<number>(1); // State to track number of games (1 or 2)
    const [groupOptions, setGroupOptions] = useState<number[]>([]); // Options for number of groups
    const [selectedGroups, setSelectedGroups] = useState<number>(1); // State to track selected number of groups
    const [teamsAdvanceOptions, setTeamsAdvanceOptions] = useState<number[]>([]); // Options for teams advancing
    const [teamsAdvance, setTeamsAdvance] = useState<number>(1); // State to track number of teams advancing
    const [additionalAdvanceOptions, setAdditionalAdvanceOptions] = useState<number[]>([]); // Options for additional advancing teams
    const [additionalAdvance, setAdditionalAdvance] = useState<number>(0); // State to track number of additional teams advancing

    useEffect(() => {
        // Retrieve the array of teams from localStorage
        const storedTeams = localStorage.getItem("rightTeams");

        if (storedTeams) {
            const teamsArray = JSON.parse(storedTeams);
            const teamsCount = teamsArray.length; // Calculate the number of teams

            // Calculate valid group sizes based on the number of teams
            const validGroupSizes = getValidGroupSizes(teamsCount);
            setGroupOptions(validGroupSizes);

            // Update teams advancing options based on the number of groups
            updateTeamsAdvanceOptions(teamsCount, selectedGroups);
        }
    }, [selectedGroups]); // Update when selectedGroups changes

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

    // Handle change of radio button selection for the number of games
    const handleGamesOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedGamesOption = parseInt(event.target.value);
        setGamesOption(selectedGamesOption);
        localStorage.setItem("gamesOption", selectedGamesOption.toString()); // Store the number of games in localStorage
    };

    // Handle change of group selection
    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGroupCount = parseInt(event.target.value);
        setSelectedGroups(selectedGroupCount);
        localStorage.setItem("selectedGroups", selectedGroupCount.toString()); // Store the number of groups in localStorage

        // Update teams advancing options based on the new number of groups
        const storedTeams = localStorage.getItem("rightTeams");
        if (storedTeams) {
            const teamsArray = JSON.parse(storedTeams);
            updateTeamsAdvanceOptions(teamsArray.length, selectedGroupCount);
        }
    };

    // Handle change of teams advancing selection
    const handleTeamsAdvanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTeamsAdvance = parseInt(event.target.value);
        setTeamsAdvance(selectedTeamsAdvance);
        localStorage.setItem("teamsAdvance", selectedTeamsAdvance.toString()); // Store the number of teams advancing in localStorage

        // Update additional advancing options based on the newly selected advancing teams
        updateAdditionalAdvanceOptions(selectedGroups);
        setAdditionalAdvance(0); // Reset additional advance
    };

    // Handle change of additional advancing teams selection
    const handleAdditionalAdvanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAdditionalAdvance = parseInt(event.target.value);
        setAdditionalAdvance(selectedAdditionalAdvance);
        localStorage.setItem("additionalAdvance", selectedAdditionalAdvance.toString()); // Store the number of additional advancing teams in localStorage
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Number of Games Between Teams:</label>
            <div className="flex items-center space-x-4 mb-4">
                {/* Radio button for 1 game */}
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="games"
                        value={1}
                        checked={gamesOption === 1}
                        onChange={handleGamesOptionChange}
                        className="form-radio"
                    />
                    <span>1 Game</span>
                </label>

                {/* Radio button for 2 games (home and away) */}
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name="games"
                        value={2}
                        checked={gamesOption === 2}
                        onChange={handleGamesOptionChange}
                        className="form-radio"
                    />
                    <span>2 Games (Home and Away)</span>
                </label>
            </div>

            {/* Option to select number of groups */}
            <label className="block text-sm font-semibold mb-2">Number of Groups:</label>
            <select
                className="form-select mt-1 block w-full"
                value={selectedGroups}
                onChange={handleGroupChange}
            >
                {groupOptions.map((groupSize) => (
                    <option key={groupSize} value={groupSize}>
                        {groupSize} Groups
                    </option>
                ))}
            </select>

            {/* Option to select how many teams advance from each group */}
            {teamsAdvanceOptions.length > 0 && (
                <>
                    <label className="block text-sm font-semibold mb-2 mt-4">Number of Teams Advancing from Each Group:</label>
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
            )}

            {/* Option to select how many additional teams advance based on the next ranking position */}
            {additionalAdvanceOptions.length > 0 && (
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
            )}
        </div>
    );
};

export default Options;
