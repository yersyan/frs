import React, {FC} from 'react';
import {Entity} from "@/types/interfaces";

interface EntityFilterProps {
    entities: Entity[];
    selectedEntity: number | string;
    onEntityChange: (id: number | string) => void;
    club?: boolean
}

const EntityFilter: FC<EntityFilterProps> = ({ entities, selectedEntity, onEntityChange, club }) => {

    return (
        <div>
            <ul className="flex flex-wrap justify-center gap-2">
                <li
                    key={0}
                    className={`cursor-pointer text-sm font-bold transition-colors duration-300 ${club ? (selectedEntity === "" ? 'text-blue-700' : 'hover:text-blue-700') : (selectedEntity === 0 ? 'text-blue-700' : 'hover:text-blue-700')}`}
                    onClick={() => onEntityChange(club ? "" : 0)}
                >
                    TOP 32
                </li>
                {entities.map(entity => (
                    <li
                        key={entity.id}
                        className={`cursor-pointer italic text-sm font-bold transition-colors duration-300 ${club ? (selectedEntity === entity.name ? 'text-blue-700' : 'hover:text-blue-700') : (selectedEntity === entity.id ? 'text-blue-700' : 'hover:text-blue-700')}`}
                        onClick={() => onEntityChange(club ? entity.name : entity.id)}
                    >
                        {entity.name}
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default EntityFilter;
