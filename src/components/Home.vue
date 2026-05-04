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
const newPlayer = ref('');
const playersList = ref([
  { name: "Alex 'The Hammer'", selected: true },
  { name: "Sarah Smith", selected: false },
  { name: "The Machine", selected: true },
]);

// 3. Computed list of names for the startGame function
const selectedNames = computed(() => 
  playersList.value.filter(player => player.selected).map(player => player.name)
);

function addPlayerToList() {
  if (!newPlayer) return;
  playersList.value.push({
    name: newPlayer.value,
    selected: true
  });
  newPlayer.value = '';
}

function removePlayer(index: number) {
  playersList.value = playersList.value.filter(player => playersList.value.indexOf(player) !== index);
}

function startGame(matchSettings: MatchSettings, selectedNames: string[]) {
    if (selectedNames.length === 0) return;
    const today = new Date();
    matches.push({
        matchSettings,
        players: selectedNames.map(name => ({
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
<div 
    :style="{
        backgroundColor: '#09090b',
        color: '#f4f4f5',
        minHeight: '100vh',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        maxWidth: '480px',
        margin: '0 auto',
        boxSizing: 'border-box'
    }"
>

    <header 
        style="text-align: center;"
    >
        <h1 
            style="
                font-weight: 900; 
                font-style: italic; 
                font-size: 2.25rem; 
                margin: 0; 
                letter-spacing: -0.05em;
            "
        >
            <span 
                style="color: #FFCAD3;"
            >
                JAY
            </span> 
            DARTS
        </h1>
        <div 
            style="
                height: 4px; 
                width: 32px; 
                background: #FFCAD3; 
                margin: 0.5rem auto; 
                border-radius: 4px; 
                box-shadow: 0 0 12px #FFCAD3;
            "
        />
    </header>

    <section 
        style="
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 1rem;
        "
    >
        <div 
            style="
                display: flex; 
                flex-direction: column;
            "
        >
            <label 
                style="
                    font-size: 0.7rem; 
                    font-weight: 800; 
                    color: #71717a; 
                    text-transform: uppercase; 
                    margin-bottom: 0.5rem; 
                    padding-left: 0.5rem;
                "
            >
                Points
            </label>
            <div 
                style="
                    background: rgba(16, 185, 129, 0.05); 
                    border: 2px solid #EB4574; 
                    border-radius: 20px; 
                    padding: 1.5rem 0; 
                    text-align: center; 
                    font-size: 1.75rem; 
                    font-weight: 900; 
                    color: white;
                "
            >
                501
            </div>
        </div>
        <div 
            style="
                display: flex; 
                flex-direction: column;
            "
        >
            <label 
                style="
                    font-size: 0.7rem; 
                    font-weight: 800; 
                    color: #71717a; 
                    text-transform: uppercase; 
                    margin-bottom: 0.5rem; 
                    padding-left: 0.5rem;
                "
            >
                Finish
            </label>
            <div 
                style="
                    background: rgba(16, 185, 129, 0.05); 
                    border: 2px solid #EB4574; 
                    border-radius: 20px; 
                    padding: 1.5rem 0; 
                    text-align: center; 
                    font-size: 1.75rem; 
                    font-weight: 900; 
                    color: white;
                "
            >
                DOUBLE OUT
            </div>
        </div>
    </section>

    <section 
        style="
            flex: 1; 
            display: flex; 
            flex-direction: column;
        "
    >
        <div 
            style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 1rem;
            "
        >
            <h2 
                style="
                    font-size: 0.8rem; 
                    font-weight: 800; 
                    color: #71717a; 
                    margin: 0;
                "
            >
                ROSTER
            </h2>
            <span 
                style="
                    font-size: 0.7rem; 
                    font-weight: 900; 
                    color: #FFCAD3;
                "
            >
                {{ selectedNames.length }} ACTIVE
            </span>
        </div>

        <div 
            style="
                display: flex; 
                gap: 0.5rem; 
                margin-bottom: 1.5rem; 
                background: #18181b; 
                padding: 0.5rem; 
                border-radius: 16px; 
                border: 1px solid #27272a;
            "
            >
            <input 
                v-model="newPlayer" 
                type="text" 
                placeholder="Enter player name..." 
                @keyup.enter="addPlayerToList"
                style="
                    flex: 1; 
                    background: transparent; 
                    border: none; 
                    color: white; 
                    padding: 0.5rem 1rem; 
                    font-size: 1rem; 
                    outline: none;
                "
            />
            <button 
                @click="addPlayerToList" 
                style="
                    background: #EB4574; 
                    color: black; 
                    border: none; 
                    font-weight: 900; 
                    padding: 0.5rem 1.25rem; 
                    border-radius: 12px; 
                    cursor: pointer;
                "
            >
                Add Player
            </button>
        </div>

        <div 
            style="
                display: flex; 
                flex-direction: column; 
                gap: 0.75rem; 
                overflow-y: auto;
            "
        >
            <div 
                v-for="(player,playerIndex) in playersList" 
                :style="{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: player.selected ? 'rgba(16,185,129,0.02)' : '#18181b',
                    padding: '1rem 1.25rem',
                    borderRadius: '18px',
                    border: '2px solid',
                    borderColor: player.selected ? '#FFCAD3' : '#726E6E',
                    transition: 'all 0.2s'
                }"
            >
                <div 
                    style="
                    display: flex; 
                    align-items: center; 
                    gap: 1.25rem;
                    "
                >
                    <div 
                        @click="player.selected = !player.selected" 
                        :style="{
                            width: '26px',
                            height: '26px',
                            borderRadius: '20%',
                            border: '2px solid',
                            borderColor: player.selected ? '#FFCAD3' : '#71717a',
                            backgroundColor: player.selected ? '#FFCAD3' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'black',
                            fontWeight: '900',
                            fontSize: '14px'
                        }"
                    >
                        {{ player.selected ? '✓' : '' }}
                    </div>
                    <span 
                        style="
                        font-weight: 700; 
                        font-size: 1.1rem;
                        "
                    >
                        {{ player.name }}
                    </span>
                </div>
                
                <button 
                    @click="removePlayer(playerIndex)" 
                    style="
                        background: transparent; 
                        border: none; color: #71717a; 
                        cursor: pointer; 
                        padding: 8px;
                    "
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24"
                    ><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE -->
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        </div>
    </section>

    <footer style="padding-top: 1rem;">
        <button 
            @click="startGame"
            :disabled="selectedNames.length === 0"
            :style="{
                width: '100%',
                backgroundColor: '#EB4574',
                color: 'black',
                border: 'none',
                padding: '1.5rem',
                borderRadius: '24px',
                fontSize: '1.5rem',
                fontWeight: '900',
                cursor: selectedNames.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
                opacity: selectedNames.length === 0 ? 0.3 : 1,
                filter: selectedNames.length === 0 ? 'grayscale(1)' : 'none'
            }"
        >
            START MATCH
        </button>
    </footer>
</div>
</template>