import {Standings, Team} from "@/types/interfaces";

const createStandings = (groups: Team[][]): { [key: number]: Standings } => {
    const initialStandings: { [key: number]: Standings } = {};
    groups.forEach((group, index) => {
        initialStandings[index] = group.reduce((acc, team) => ({
            ...acc,
            [team.id]: {GP: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0}
        }), {}) as Standings;
    });

    return initialStandings
}

export default createStandings