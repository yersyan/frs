import { Team } from "@/utils/types/interfaces";

// Function to distribute teams into groups based on their positions
const distributeTeamsByPosition = (teams: Team[], groupCount: number, sort = true): Team[][] => {
    const totalTeams = teams.length;

    if (totalTeams < groupCount * 2) {
        throw new Error("Invalid group count or not enough teams to form valid groups.");
    }

    // Sort teams by their position (ascending order)
    let sortedTeams = teams;
    if (sort) {
        sortedTeams = [...teams].sort((a, b) => a.position - b.position);
    }

    // Initialize the groups array
    const groups: Team[][] = Array.from({ length: groupCount }, () => []);

    // Distribute teams into groups in a "snake" pattern
    let direction = 1; // 1 for forward, -1 for backward
    let groupIndex = 0;

    for (let i = 0; i < totalTeams; i++) {
        groups[groupIndex].push(sortedTeams[i]);

        // Move to the next group
        groupIndex += direction;

        // If we reach the last group or the first group, reverse direction
        if (groupIndex === groupCount || groupIndex === -1) {
            direction *= -1; // Change direction
            groupIndex += direction; // Adjust index after changing direction
        }
    }

    return groups;
};

export default distributeTeamsByPosition;

