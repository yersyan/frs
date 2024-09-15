import React, { FC } from 'react';
import { Entity } from "@/utils/types/interfaces";

interface EntityFilterProps {
    entities: Entity[];
    selectedEntity: string;
    onEntityChange: (name: string) => void;
}

const EntityFilter: FC<EntityFilterProps> = ({ entities, selectedEntity, onEntityChange }) => {

    return (
        <header className="bg-gray-800 text-white p-2 mb-2">
            <nav className="flex flex-wrap justify-center gap-2">
                <div
                    className={`cursor-pointer text-sm font-bold transition-colors duration-300 ${selectedEntity === "" ? 'text-blue-300' : 'hover:text-blue-300'}`}
                    onClick={() => onEntityChange("")}
                >
                    TOP 32
                </div>
                {entities.map(entity => (
                    <div
                        key={entity.id}
                        className={`cursor-pointer text-sm font-bold transition-colors duration-300 ${selectedEntity === entity.name ? 'text-blue-300' : 'hover:text-blue-300'}`}
                        onClick={() => onEntityChange(entity.name)}
                    >
                        {entity.name}
                    </div>
                ))}
            </nav>
        </header>
    );
};

export default EntityFilter;