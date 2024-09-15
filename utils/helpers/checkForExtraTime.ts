import {Match, Standings} from "@/utils/types/interfaces";

const checkForExtraTime = (matches: Match[][][], teamStandings: { [key: number]: Standings }, groupIndex: number) => {
    const groupMatches = matches[groupIndex];

    // console.log(teamStandings)
    // Check if the group has exactly 2 teams
    if (Object.keys(teamStandings[groupIndex]).length === 2) {
        // Check if all matches in the group are completed
        const allMatchesPlayed = groupMatches.every((roundMatches) =>
            roundMatches.every((match) => match.simulated) // Assuming 'simulated' is a boolean flag on each match
        );

        if (allMatchesPlayed) {
            const teams = Object.keys(teamStandings[groupIndex]);
            const team1Stats = teamStandings[groupIndex][parseInt(teams[0])];
            const team2Stats = teamStandings[groupIndex][parseInt(teams[1])];

            // Check if the goal difference is equal for both teams
            return team1Stats.GD === team2Stats.GD
        }
    }
};

export default checkForExtraTime