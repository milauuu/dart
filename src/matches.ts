export interface MatchSettings {
    pointsToWin: number,
    mode: 'double-out' | 'single-out',
}

export interface Player {
    name: string,
    throws: string[][], // points scored
}

export type Match = {
    matchSettings: MatchSettings,
    players: Player[],
    currentPlayerIndex: number,
    status: 'ongoing' | 'finished',
    lastModified: number,
}
 