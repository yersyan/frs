export interface Entity {
    id: number;
    name: string;
}

export interface NationalTeam {
    id: number;
    name: string;
    image: string;
    entity: number
}

export interface Club {
    competition: any
    member: {
        associationId: number
        associationLogoUrl: string
        bigLogoUrl: string
        countryCode: string
        countryName: string
        displayName: string
        displayNameShort: string
        displayOfficialName: string
        displayTeamCode: string
        id: string
        internationalName: string
        isPlaceHolder: boolean
        logoUrl: string
        mediumLogoUrl: string
        teamCode: string
        typeIsNational: boolean
        typeTeam: string
    }
    overallRanking: {
        baseSeasonYear: number
        factorBonusForTitleHeld: number
        nationalAssociationPoints: number
        numberOfMatches: number,
        position: number
        targetSeasonYear: number
        totalPoints: number
        totalValue: number
        trend: string
    }
    seasonRankings: any
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