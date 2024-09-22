import { Team } from "@/utils/types/interfaces";

// Function to distribute teams into groups based on their positions
const distributeTeamsByPosition = (teams: Team[], groupCount: number): Team[][] => {
    const totalTeams = teams.length;
    console.log(groupCount)
    if (groupCount < 1 || totalTeams < groupCount * 2) {
        throw new Error("Invalid group count or not enough teams to form valid groups.");
    }

    // Sort teams by their position (ascending order)
    const sortedTeams = [...teams].sort((a, b) => a.position - b.position);

    // Initialize the groups array
    const groups: Team[][] = Array.from({ length: groupCount }, () => []);

    // Distribute teams into groups by alternating positions
    for (let i = 0; i < totalTeams; i++) {
        // Determine the index of the group for the current team
        const groupIndex = i % groupCount;
        groups[groupIndex].push(sortedTeams[i]);
    }

    return groups;
};

export default distributeTeamsByPosition;
