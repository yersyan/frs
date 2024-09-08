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

export interface Match {
    home: Team;
    away: Team;
    homeGoals?: number;
    awayGoals?: number;
    simulated?: boolean;
    score?: {homeScore: number, awayScore: number};
    ETScore?: {homeETScore: number, awayETScore: number},
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