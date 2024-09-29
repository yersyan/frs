import React from "react";

interface ThirdPlaceOptionProps {
    hasThirdPlaceMatch: boolean;
    setHasThirdPlaceMatch: (value: boolean) => void;
}

const ThirdPlaceMatchOption: React.FC<ThirdPlaceOptionProps> = ({ hasThirdPlaceMatch, setHasThirdPlaceMatch }) => {
    return (
        <div className="mb-4">
            <label className="text-md font-bold mb-2">Матч за третье место:</label>
            <div className="mt-2">
                <input
                    type="checkbox"
                    checked={hasThirdPlaceMatch}
                    onChange={(e) => setHasThirdPlaceMatch(e.target.checked)}
                />{" "}
                <span>Yes</span>
            </div>
        </div>
    );
};

export default ThirdPlaceMatchOption;
