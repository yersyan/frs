import { Match, Team } from "@/types/interfaces";
import generateRoundRobinSchedule from "@/helpers/generateRoundRobinSchedule";
import shuffleArray from "@/helpers/shuffleArray";

const shuffleTeamsRandomly = (groupsMatches: Match[][][]) => {
    // Get all teams from all groups
    const allTeams: Team[] = [];
    groupsMatches.forEach(group => {
        group.forEach(round => {
            round.forEach(match => {
                if (!allTeams.some(team => team.id === match.home.id)) {
                    allTeams.push(match.home);
                }
                if (!allTeams.some(team => team.id === match.away.id)) {
                    allTeams.push(match.away);
                }
            });
        });
    });

    // Shuffle all teams randomly
    shuffleArray(allTeams);

    // Get the number of groups and the number of teams per group
    const numGroups = groupsMatches.length;

    // Step 3: Distribute shuffled teams into groups randomly
    const shuffledGroups: Team[][] = Array.from({ length: numGroups }, () => []);
    allTeams.forEach((team, index) => {
        shuffledGroups[index % numGroups].push(team);
    });

    // Step 4: Rebuild group matches with the shuffled teams
    const gamesOption = parseInt(localStorage.getItem('gamesOption') || '1');
    return shuffledGroups.map(group => generateRoundRobinSchedule(group, gamesOption));
};

export default shuffleTeamsRandomly;
