<script setup lang="ts">
import { computed, ref } from 'vue';
import { matches, Player, type MatchSettings } from '../matches.ts';

// 1. Define the fixed Match Settings for 501 Double Out
const currentSettings: MatchSettings = {
  pointsToWin: 501,
  mode: 'double-out', // Assuming your MatchSettings type uses this or similar
  // ... any other required fields from your MatchSettings type
};

// 2. Mock Player List (In a real app, fetch these from a database/store)
// Player list without avatars
const newPlayerName = ref('');
const players<Player> = ref([
  { id: 1, name: "Alex 'The Hammer'", selected: true },
  { id: 2, name: "Sarah Smith", selected: false },
  { id: 3, name: "The Machine", selected: true },
]);

// 3. Computed list of names for the startGame function
const selectedNames = computed(() => 
  players.value.filter(p => p.selected).map(p => p.name)
);

function addPlayer() {
  if (!newPlayerName.value.trim()) return;
  players.value.push({
    id: Date.now(),
    name: newPlayerName.value.trim(),
    selected: true
  });
  newPlayerName.value = '';
}

function removePlayer(id: number) {
  players.value = players.value.filter(p => p.id !== id);
}

function startGame(matchSettings: MatchSettings, names: string[]) {
    if (selectedNames.value.length === 0) return;
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

