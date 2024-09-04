"use client";

import React, { useState, useEffect } from "react";
import getValidGroupSizes from "@/helpers/getValidGroupSizes";

const Options: React.FC = () => {
    const [gamesOption, setGamesOption] = useState<number>(1); // State to track number of games (1 or 2)
    const [teamCount, setTeamCount] = useState<number>(0); // State to store the number of teams
    const [groupOptions, setGroupOptions] = useState<number[]>([]); // Options for number of groups
    const [selectedGroups, setSelectedGroups] = useState<number>(2); // State to track selected number of groups

    useEffect(() => {
        // Retrieve the array of teams from localStorage
        const storedTeams = localStorage.getItem("rightTeams");

        if (storedTeams) {
            const teamsArray = JSON.parse(storedTeams);
            const teamsCount = teamsArray.length; // Calculate the number of teams
            setTeamCount(teamsCount);

            // Calculate valid group sizes based on the number of teams
            const validGroupSizes = getValidGroupSizes(teamsCount);
            setGroupOptions(validGroupSizes);
        }
    }, []); // Run once on component mount

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
        </div>
    );
};

export default Options;
