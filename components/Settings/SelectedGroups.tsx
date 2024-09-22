"use client";

import React, {useEffect, useState} from "react";
import getValidGroupSizes from "@/utils/helpers/getValidGroupSizes";

interface SelectedGroupsProps {
    teamsCount: number,
    selectedGroups: number,
    setSelectedGroups: React.Dispatch<React.SetStateAction<number>>;
}

const SelectedGroups: React.FC<SelectedGroupsProps> = ({teamsCount, selectedGroups, setSelectedGroups}) => {

    const [groupOptions, setGroupOptions] = useState<number[]>([]);

    useEffect(() => {
        const validGroupSizes = getValidGroupSizes(teamsCount);
        setGroupOptions(validGroupSizes);
    }, []);

    // Handle change of group selection
    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGroupCount = parseInt(event.target.value);
        setSelectedGroups(selectedGroupCount);
    };

    return (
        <div className="my-4">
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

export default SelectedGroups;