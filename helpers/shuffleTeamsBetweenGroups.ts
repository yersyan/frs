// Function to shuffle teams between groups while keeping the same index
import {Match, Team} from "@/types/interfaces";
import generateRoundRobinSchedule from "@/helpers/generateRoundRobinSchedule";

const shuffleTeamsBetweenGroups = (groupsMatches: Match[][][]) => {
    // Get the current group structure from groupsMatches
    const groups = groupsMatches.map(group => {
        const teams: Team[] = [];
        group.forEach(round => {
            round.forEach(match => {
                if (!teams.some(team => team.id === match.home.id)) {
                    teams.push(match.home);
                }
                if (!teams.some(team => team.id === match.away.id)) {
                    teams.push(match.away);
                }
            });
        });
        return teams; // Return all unique teams in the group
    });

    // Step 1: Split teams into pots by their positions
    const teamPots: Team[][] = Array.from({ length: groups[0].length }, () => []);
    groups.forEach(group => {
        group.forEach((team, position) => {
            teamPots[position].push(team); // Add team to the corresponding pot based on their position
        });
    });

    // Step 2: Shuffle teams within each pot
    const shuffleArray = (array: Team[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    teamPots.forEach(pot => shuffleArray(pot));

    // Step 3: Rebuild the groups from the shuffled pots
    const shuffledGroups: Team[][] = Array.from({ length: groups.length }, () => []); // Create new empty groups
    teamPots.forEach(pot => {
        pot.forEach((team, groupIndex) => {
            shuffledGroups[groupIndex].push(team); // Distribute shuffled teams into the same index groups
        });
    });

    // Step 4: Rebuild group matches with the shuffled teams
    const gamesOption = parseInt(localStorage.getItem('gamesOption') || '1');
    // Update state with new shuffled matches
    return shuffledGroups.map(group => generateRoundRobinSchedule(group, gamesOption))
};

export default shuffleTeamsBetweenGroups
