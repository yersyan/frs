import {Standings, Team} from "@/types/interfaces";

const sortTeams = (teams: Team[], standings: Standings): Team[] => {
    return teams.filter(team => team.id !== -1).sort((a, b) => {
        const pointsA = standings[a.id]?.Pts || 0;
        const pointsB = standings[b.id]?.Pts || 0;
        const goalDifferenceA = standings[a.id]?.GD || 0;
        const goalDifferenceB = standings[b.id]?.GD || 0;
        const goalsForA = standings[a.id]?.GF || 0;
        const goalsForB = standings[b.id]?.GF || 0;
        const winsA = standings[a.id]?.W || 0;
        const winsB = standings[b.id]?.W || 0;

        if (pointsB !== pointsA) {
            return pointsB - pointsA;
        } else if (goalDifferenceB !== goalDifferenceA) {
            return goalDifferenceB - goalDifferenceA;
        } else if (goalsForB !== goalsForA) {
            return goalsForB - goalsForA;
        } else {
            return winsB - winsA;
        }
    });
};

export default sortTeams;
