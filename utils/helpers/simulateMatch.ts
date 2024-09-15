import {Match, Standings} from "@/utils/types/interfaces";
import generateAndPickRandomNumber from "@/utils/helpers/generateAndPickRandomNumber";

const simulateMatch = (
    matches: Match[][],
    standings: Standings,
    roundIndex: number,
    matchIndex: number,
    score: {homeScore: number, awayScore: number},
    count: number,
    extraTimeScore: {homeETScore: number, awayETScore: number} | undefined
): { updatedMatches: Match[][], updatedStandings: Standings } => {
    const newStandings = { ...standings };
    const gamesOption = parseInt(localStorage.getItem("gamesOption") || "1");
    const {homeScore, awayScore} = score

    const calculateGoals = (ratingDifference: number, isHome: boolean) => {
        const baseGoals = Math.random() * 3; // Base goals between 0 and 3
        const ratingFactor = ratingDifference / 12; // Adjust the impact of rating difference
        const homeAdvantage = gamesOption === 2 && isHome ? Math.round(Math.random()) : 0;
        let maximum = Math.max(1, Math.round(baseGoals + ratingFactor + homeAdvantage))

        if(maximum > 21){
            maximum = 21
        }

        let maxRandom = Math.round(Math.random() * (1 + maximum))

        return !count ? generateAndPickRandomNumber(Math.round(maximum / 3), maxRandom) : Math.floor(generateAndPickRandomNumber(Math.round(maximum / 3), maxRandom) / 2)
    };

    const simulatePenalties = (teamA: { rating: number, goals: number}, teamB: { rating: number, goals: number}) => {
        const baseGoalsTeamA = Math.random() * 0.3;
        const ratingFactorTeamA = teamA.rating > 21 ? Math.random() * 0.3 : 0; // Немного случайности для команд с высоким рейтингом
        const homeAdvantage = gamesOption === 2 ? Math.random() * 0.1 : 0; // Небольшое преимущество на домашнем стадионе
        const skillTeamA = baseGoalsTeamA + ratingFactorTeamA + homeAdvantage;

        const baseGoalsTeamB = Math.random() * 0.3;
        const ratingFactorTeamB = teamB.rating > 21 ? Math.random() * 0.3 : 0; // То же самое для команды B
        const skillTeamB = baseGoalsTeamB + ratingFactorTeamB;

        teamA.goals = 0;
        teamB.goals = 0;

        for (let i = 0; i < 5; i++) {
            const penaltyA = Math.random() + skillTeamA;
            const penaltyB = Math.random() + skillTeamB;

            // Симуляция пенальти: шанс на гол (условие будет завышено для реалистичности)
            if (penaltyA >= 0.5) {
                teamA.goals++;
            }

            if (penaltyB >= 0.5) {
                teamB.goals++;
            }

            // Проверка на досрочную победу
            const remainingShotsA = 5 - (i + 1); // Сколько осталось ударов у команды A
            const remainingShotsB = 5 - (i + 1); // Сколько осталось ударов у команды B

            if (teamA.goals > teamB.goals + remainingShotsB) {
                break; // Команда A выиграла досрочно
            } else if (teamB.goals > teamA.goals + remainingShotsA) {
                break; // Команда B выиграла досрочно
            }
        }

        // Если ничья, добавляем дополнительные пенальти
        while (teamA.goals === teamB.goals) {
            const penaltyA = Math.random() + skillTeamA;
            const penaltyB = Math.random() + skillTeamB;

            if (penaltyA >= 0.5) {
                teamA.goals++;
            }

            if (penaltyB >= 0.5) {
                teamB.goals++;
            }
        }

        return { home: teamA.goals, away: teamB.goals };
    };

    const updatedMatches = matches.map((round, rIndex) =>
        round.map((match, mIndex) => {
            if (rIndex === roundIndex && mIndex === matchIndex) {
                const homeRating = match.home.position || 0;
                const awayRating = match.away.position || 0;
                const ratingDifference = match.home.position - match.away.position;

                let homeGoals = homeScore + calculateGoals(-ratingDifference, true);
                let awayGoals = awayScore + calculateGoals(ratingDifference, false);

                let home11m, away11m;

                if (extraTimeScore){
                    const {home, away} = simulatePenalties({ rating: -ratingDifference, goals: 0}, { rating: ratingDifference, goals: 0})

                    home11m = home
                    away11m = away
                    homeGoals += home
                    awayGoals += away
                }

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

                return {
                    ...match,
                    homeGoals,
                    awayGoals,
                    simulated: true,
                    score: count ? score : undefined,
                    eTScore: extraTimeScore ? extraTimeScore : undefined,
                    m11: home11m && away11m ? {home11m, away11m} : undefined
                };
            }
            return match;
        })
    );

    return { updatedMatches, updatedStandings: newStandings };
};

export default simulateMatch;