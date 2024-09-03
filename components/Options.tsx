"use client"

import React, {useEffect, useState} from 'react';

const Options = () => {
    const [gamesOption, setGamesOption] = useState<number>(1);  // State to track number of games (1 or 2)
    const go = parseInt(localStorage.getItem("gamesOption") || "1");
    // Handle change of radio button selection
    const handleGamesOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedGamesOption = parseInt(event.target.value);
        setGamesOption(selectedGamesOption);
        localStorage.setItem('gamesOption', selectedGamesOption.toString());  // Store the number of games in localStorage
    };

    useEffect(() => {
        if(go){
            setGamesOption(Number(go))
        }
    }, [])

    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Number of Games Between Teams:</label>
            <div className="flex items-center space-x-4">
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

export default Options;