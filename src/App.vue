<script setup lang="ts">
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

export type Session = {
    players: Player[],
    currentPlayerIndex: number,
    totalLegs: number,
    currentLeg: number,
    startingPlayerIndex: number,
    lastModified: Date,
}

const sessions = reactive<Session[]>([]);
</script>

<template>
    <div>
        Hello world!
    </div>
</template>
