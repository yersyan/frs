import { Match, Standings } from "@/types/interfaces";
import generateAndPickRandomNumber from "@/helpers/generateAndPickRandomNumber";

const simulateMatch = (
    matches: Match[][],
    standings: Standings,
    roundIndex: number,
    matchIndex: number
): { updatedMatches: Match[][], updatedStandings: Standings } => {
    const newStandings = { ...standings };
    const gamesOption = parseInt(localStorage.getItem("gamesOption") || "1");

    const calculateGoals = (ratingDifference: number, isHome: boolean) => {
        const baseGoals = Math.random() * 3; // Base goals between 0 and 3
        const ratingFactor = ratingDifference / 12; // Adjust the impact of rating difference
        const homeAdvantage = gamesOption === 2 && isHome ? Math.round(Math.random()) : 0;
        let maximum = Math.max(1, Math.round(baseGoals + ratingFactor + homeAdvantage))
        if(maximum > 21){
            maximum = 21
        }
        console.log(maximum)
        let maxRandom = Math.round(Math.random() * (1 + maximum))

        return generateAndPickRandomNumber(Math.round(maximum / 3), maxRandom)
    };

    const updatedMatches = matches.map((round, rIndex) =>
        round.map((match, mIndex) => {
            if (rIndex === roundIndex && mIndex === matchIndex) {
                const homeRating = match.home.position || 0;
                const awayRating = match.away.position || 0;
                const ratingDifference = match.home.position - match.away.position;

                const homeGoals = calculateGoals(-ratingDifference, true);
                const awayGoals = calculateGoals(ratingDifference, false);

                if (!newStandings[match.home.id]) {
                    newStandings[match.home.id] = { GP: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, rating: homeRating };
                }
                if (!newStandings[match.away.id]) {
                    newStandings[match.away.id] = { GP: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0, rating: awayRating };
                }

                newStandings[match.home.id].GP += 1;
                newStandings[match.away.id].GP += 1;
                newStandings[match.home.id].GF += homeGoals;
                newStandings[match.away.id].GF += awayGoals;
                newStandings[match.home.id].GA += awayGoals;
                newStandings[match.away.id].GA += homeGoals;
                newStandings[match.home.id].GD += homeGoals - awayGoals;
                newStandings[match.away.id].GD += awayGoals - homeGoals;

                if (homeGoals > awayGoals) {
                    newStandings[match.home.id].W += 1;
                    newStandings[match.away.id].L += 1;
                    newStandings[match.home.id].Pts += 3;
                } else if (homeGoals < awayGoals) {
                    newStandings[match.away.id].W += 1;
                    newStandings[match.home.id].L += 1;
                    newStandings[match.away.id].Pts += 3;
                } else {
                    newStandings[match.home.id].D += 1;
                    newStandings[match.away.id].D += 1;
                    newStandings[match.home.id].Pts += 1;
                    newStandings[match.away.id].Pts += 1;
                }

                return { ...match, homeGoals, awayGoals, simulated: true };
            }
            return match;
        })
    );

    return { updatedMatches, updatedStandings: newStandings };
};

export default simulateMatch;