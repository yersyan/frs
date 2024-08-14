import React, {FC} from 'react';
import {Entity} from "@/types/interfaces";

interface EntityFilterProps {
    entities: Entity[];
    selectedEntity: string;
    onEntityChange: (name: string) => void;
}

const EntityFilter: FC<EntityFilterProps> = ({ entities, selectedEntity, onEntityChange }) => {

    return (
        <div>
            <ul className="flex flex-wrap justify-center gap-2">
                <li
                    key={0}
                    className={`cursor-pointer text-sm font-bold transition-colors duration-300 ${selectedEntity === "" ? 'text-blue-700' : 'hover:text-blue-700'}`}
                    onClick={() => onEntityChange("")}
                >
                    TOP 32
                </li>
                {entities.map(entity => (
                    <li
                        key={entity.id}
                        className={`cursor-pointer italic text-sm font-bold transition-colors duration-300 ${selectedEntity === entity.name ? 'text-blue-700' : 'hover:text-blue-700'}`}
                        onClick={() => onEntityChange(entity.name)}
                    >
                        {entity.name}
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default EntityFilter;
