// Function to shuffle teams between groups while keeping the same index
import {Team} from "@/utils/types/interfaces";
import shuffleArray from "@/utils/helpers/shuffleArray";

const shuffleTeamsKeepPositions = (groups: Team[][]) => {

    // Step 1: Split teams into pots by their positions
    const teamPots: Team[][] = Array.from({length: groups[0].length}, () => []);
    groups.forEach(group => {
        group.forEach((team, position) => {
            teamPots[position].push(team); // Add team to the corresponding pot based on their position
        });
    });

    // Step 2: Shuffle teams within each pot
    teamPots.forEach(pot => shuffleArray(pot));

    // Step 3: Rebuild the groups from the shuffled pots
    const shuffledGroups: Team[][] = Array.from({length: groups.length}, () => []); // Create new empty groups
    teamPots.forEach(pot => {
        pot.forEach((team, groupIndex) => {
            shuffledGroups[groupIndex].push(team); // Distribute shuffled teams into the same index groups
        });
    });

    console.log(shuffledGroups)
    // Update state with new shuffled matches
    return shuffledGroups
};

export default shuffleTeamsKeepPositions
