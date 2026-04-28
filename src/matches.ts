import { ref, reactive, computed} from "vue";

export interface GameSettings {
    pointsToWin: number,
    mode: 'double-out' | 'single-out',
}

export interface Player {
    name: string,
    score: number,  //score left to shoot
    dartsThisLeg: number,
    totalPointsScored: number,  //not displayed, needed for average
    legsWon: number,  //score-tracker for multiple legs
}

export type Match = {
    players: Player[],
    currentPlayerIndex: number,
    totalLegs: number,
    currentLeg: number,
    startingPlayerIndex: number,
    lastModified: Date,
}

export const matches = reactive<Match[]>([]);
