<script setup lang="ts">
import { matches, type MatchSettings } from '../matches.ts';

function startGame(matchSettings: MatchSettings, names: string[]) {
    const today = new Date();
    matches.push({
        matchSettings,
        players: names.map(name => ({
            name,
            score: matchSettings.pointsToWin,
            dartsThisLeg: 0,
            totalPointsScored: 0,
        })),
        currentPlayerIndex: 0,
        startingPlayerIndex: 0,
        lastModified: today,
    });
}
</script>

<template>
    <button>
        Start Game
    </button>

    <button @click="">
        501
    </button>

    <button>
        
    </button>

</template>

