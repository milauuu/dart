export interface Round {
    darts: string[],
    busted: boolean,
}

export interface MatchSettings {
    pointsToWin: number,
    mode: 'double-out' | 'single-out',
}

export interface Player {
    name: string,
    throws: Round[],
}

export interface Match {
    matchSettings: MatchSettings,
    players: Player[],
    currentPlayerIndex: number,
    status: 'ongoing' | 'finished',
    lastModified: number,
}
