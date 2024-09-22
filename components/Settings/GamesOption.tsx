"use client";

import React, {useEffect} from "react";

interface GamesOptionProps {
    gamesOption: number
    setGamesOption: React.Dispatch<React.SetStateAction<number>>;
}

const GamesOption: React.FC<GamesOptionProps> = ({gamesOption, setGamesOption}) => {

    // Handle change of radio button selection for the number of games
    const handleGamesOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedGamesOption = parseInt(event.target.value);
        setGamesOption(selectedGamesOption);
    };

    return (
        <div>
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
        </div>
    );
};

export default GamesOption;