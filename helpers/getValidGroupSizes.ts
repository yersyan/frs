const getValidGroupSizes = (teams: number): number[] => {
    const validSizes: number[] = [];

    for (let groups = 1; groups <= teams; groups++) {
        const minTeamsPerGroup = Math.floor(teams / groups);
        const maxTeamsPerGroup = Math.ceil(teams / groups);

        // Calculate the number of groups with min and max teams
        const groupsWithMinTeams = groups * maxTeamsPerGroup - teams;
        const groupsWithMaxTeams = teams - groupsWithMinTeams * minTeamsPerGroup;

        // Ensure difference between groups is not more than 1 and at least 2 teams per group
        if (
            maxTeamsPerGroup - minTeamsPerGroup <= 1 &&
            groupsWithMinTeams >= 0 &&
            groupsWithMaxTeams >= 0 &&
            minTeamsPerGroup >= 2
        ) {
            validSizes.push(groups);
        }
    }

    return validSizes.sort((a, b) => b - a); // Sort in descending order
};

export default getValidGroupSizes