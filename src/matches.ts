import { ref, reactive, computed} from "vue";

export interface MatchSettings {
    pointsToWin: number,
    mode: 'double-out' | 'single-out',
}

export interface Player {
    name: string,
    score: number,  //score left to shoot
    dartsThisLeg: number,
    totalPointsScored: number,  //not displayed, needed for average
}

export type Match = {
    matchSettings: MatchSettings,
    players: Player[],
    currentPlayerIndex: number,
    startingPlayerIndex: number,
    lastModified: Date,
}

export const matches = reactive<Match[]>([]);
