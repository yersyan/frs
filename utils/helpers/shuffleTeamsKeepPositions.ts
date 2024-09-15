// Function to shuffle teams between groups while keeping the same index
import {Match, Standings, Team} from "@/utils/types/interfaces";
import generateRoundRobinSchedule from "@/utils/helpers/generateRoundRobinSchedule";
import shuffleArray from "@/utils/helpers/shuffleArray";
import createStandings from "@/utils/helpers/createStandings";

const shuffleTeamsKeepPositions = (groupsMatches: Match[][][]): { newGroupsMatches: Match[][][], newStandings: { [key: number]: Standings } } => {
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

    const standings = createStandings(shuffledGroups)

    // Step 4: Rebuild group matches with the shuffled teams
    const gamesOption = parseInt(localStorage.getItem('gamesOption') || '1');

    // Update state with new shuffled matches
    return {
        newGroupsMatches: shuffledGroups.map(group => generateRoundRobinSchedule(group, gamesOption)),
        newStandings: standings
    }
};

export default shuffleTeamsKeepPositions
