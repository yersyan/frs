import { Match, Team } from "@/types/interfaces";

const generateRoundRobinSchedule = (teams: Team[]): Match[][] => {
    const rounds: Match[][] = [];
    const numTeams = teams.length;
    const isOdd = numTeams % 2 !== 0;

    if (isOdd) {
        teams.push({ id: -1, name: 'Bye', image: '', entity: -1, position: -1 });
    }

    const totalTeams = teams.length;
    const homeAwaySwitch = new Array(totalTeams).fill(false);

    for (let round = 0; round < totalTeams - 1; round++) {
        const roundMatches: Match[] = [];

        for (let match = 0; match < totalTeams / 2; match++) {
            const homeIndex = (round + match) % (totalTeams - 1);
            let awayIndex = (totalTeams - 1 - match + round) % (totalTeams - 1);

            if (match === 0) {
                awayIndex = totalTeams - 1;
            }

            const homeTeam = teams[homeIndex];
            const awayTeam = teams[awayIndex];

            if (homeTeam && awayTeam && homeTeam.id !== -1 && awayTeam.id !== -1) {
                const shouldSwap = homeAwaySwitch[homeIndex];

                if (shouldSwap) {
                    roundMatches.push({
                        home: awayTeam,
                        away: homeTeam,
                        simulated: false
                    });
                } else {
                    roundMatches.push({
                        home: homeTeam,
                        away: awayTeam,
                        simulated: false
                    });
                }

                homeAwaySwitch[homeIndex] = !homeAwaySwitch[homeIndex];
                homeAwaySwitch[awayIndex] = !homeAwaySwitch[awayIndex];
            }
        }

        rounds.push(roundMatches);
    }
    const secondHalfRounds = rounds.map(round =>
        round.map(({ home, away }) => ({ home: away, away: home, simulated: false }))
    );

    return [...rounds, ...secondHalfRounds]
};

export default generateRoundRobinSchedule;