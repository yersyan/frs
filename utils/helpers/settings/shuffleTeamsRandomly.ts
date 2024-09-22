import {Team} from "@/utils/types/interfaces";
import shuffleArray from "@/utils/helpers/shuffleArray";

const shuffleTeamsRandomly = (teams: Team[], num: number) => {

    // Shuffle all teams randomly
    shuffleArray(teams);

    // Distribute shuffled teams into groups randomly
    const shuffledGroups: Team[][] = Array.from({ length: num }, () => []);
    teams.forEach((team, index) => {
        shuffledGroups[index % num].push(team);
    });

    return shuffledGroups
};

export default shuffleTeamsRandomly;
