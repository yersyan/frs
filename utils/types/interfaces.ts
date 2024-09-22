export interface Page {
    name: string
    link: string
    color: string
}

export interface Entity {
    id: number;
    name: string;
}

export interface NationalTeam {
    id: number;
    name: string;
    image: string;
    entity: number | string
}

export interface Team extends NationalTeam {
    position: number
}

export interface Options {
    teams: Team[];
    groups: Team[][];
    selectedGroups: number;
    teamsAdvance: number;
    additionalAdvance: number,
    gamesOption: number,
}

export interface Match {
    home: Team;
    away: Team;
    homeGoals?: number;
    awayGoals?: number;
    simulated?: boolean;
    score?: {homeScore: number, awayScore: number};
    eTScore?: {homeETScore: number, awayETScore: number},
    m11?: {home11m: number, away11m: number}
}

export interface Standings {
    [key: number]: {
        GP: number;
        W: number;
        D: number;
        L: number;
        GF: number;
        GA: number;
        GD: number;
        Pts: number;
        rating: number
    };
}