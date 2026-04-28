import { ref, reactive,computed } from "vue";

// declaring Player interface
interface Player {
    name: string,
    score: number,  //score left to shoot
    dartsThisLeg: number,
    totalPointsScored: number,  //not displayed, needed for median
    legsWon: number,  //score-tracker for multiple legs
}

// declare the current state of the game
const state = reactive({
    phase: 'setup' as 'setup' | 'game' | 'winner',
    players: [] as Player[],
    currentPlayerIndex: 0,
    totalLegs: 1,
    currentLeg: 1,
    startingPlayerIndex: 0,
});

