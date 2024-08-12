export interface Entity {
    id: number;
    name: string;
}

export interface Team {
    id: number;
    name: string;
    image: string;
    entity: number
}

export interface Match {
    home: Team;
    away: Team;
    homeGoals?: number;
    awayGoals?: number;
    simulated?: boolean;
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