import { ref, reactive,computed } from "vue";

// declaring Player interface
interface Player {
    name: string,
    score: number,  //score left to shoot
    dartsThisLeg: number,
    totalPointsScored: number,  //not displayed, needed for median
    legsWon: number,  //score-tracker for multiple legs
}