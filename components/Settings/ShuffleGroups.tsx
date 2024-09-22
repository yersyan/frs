"use client";

import React, {useState} from "react";
import distributeTeamsIntoGroups from "@/utils/helpers/distributeTeamsIntoGroups";
import shuffleTeamsKeepPositions from "@/utils/helpers/settings/shuffleTeamsKeepPositions";
import shuffleTeamsRandomly from "@/utils/helpers/settings/shuffleTeamsRandomly";
import {Team} from "@/utils/types/interfaces";

interface ShuffleGroupsProps {
    teams: Team[]
    groups: Team[][]
    setGroups: React.Dispatch<React.SetStateAction<Team[][]>>;
}

const ShuffleGroups: React.FC<ShuffleGroupsProps> = ({teams, groups, setGroups}) => {
    const [isRandomShuffleApplied, setIsRandomShuffleApplied] = useState(false);

    // Function to shuffle teams while keeping positions
    const handleShuffleKeepPositions = () => {
        const selectedGroups = +localStorage.getItem("selectedGroups");
        if (isRandomShuffleApplied) {
            const allGroups = distributeTeamsIntoGroups(teams, selectedGroups);
            setGroups(allGroups)
            setIsRandomShuffleApplied(false)
        } else {
            const newGroups = shuffleTeamsKeepPositions(groups);
            setGroups(newGroups)
        }
    };

    // Function to shuffle teams randomly
    const handleShuffleRandomly = () => {
        const newGroups = shuffleTeamsRandomly(teams, groups.length);
        setGroups(newGroups)
        setIsRandomShuffleApplied(true);
    };


    return (
        <div className="flex gap-4 my-4">
            <button
                onClick={handleShuffleKeepPositions}
                className="text-sm bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700"
            >
                {isRandomShuffleApplied ? "Reset" : "Shuffle (Keep Positions)"}
            </button>

            <button
                onClick={handleShuffleRandomly}
                className="text-sm bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
                Shuffle (Randomly)
            </button>
        </div>
    );
};

export default ShuffleGroups;