import React, {FC} from 'react';
import {Entity} from "@/types/interfaces";

interface EntityFilterProps {
    entities: Entity[];
    selectedEntity: number;
    onEntityChange: (id: number) => void;
}

const EntityFilter: FC<EntityFilterProps> = ({ entities, selectedEntity, onEntityChange }) => {

    return (
        <div>
            <ul className="flex flex-wrap justify-center gap-2">
                <li
                    key={0}
                    className={`cursor-pointer text-sm font-bold transition-colors duration-300 ${selectedEntity === 0 ? 'text-blue-700' : 'hover:text-blue-700'}`}
                    onClick={() => onEntityChange(0)}
                >
                    TOP 32
                </li>
                {entities.map(entity => (
                    <li
                        key={entity.id}
                        className={`cursor-pointer italic text-sm font-bold transition-colors duration-300 ${selectedEntity === entity.id ? 'text-blue-700' : 'hover:text-blue-700'}`}
                        onClick={() => onEntityChange(entity.id)}
                    >
                        {entity.name}
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default EntityFilter;
