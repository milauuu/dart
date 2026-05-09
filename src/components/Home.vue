<script setup lang="ts">
import { computed, nextTick, reactive, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { type Match, Player, type MatchSettings } from '../matches.ts';
import { useFocus } from '../util.ts';
import Icon from './Icon.vue';
import { useLocalStorage } from '@vueuse/core';

// template references
const playerNameElements = ref<Array<Element | null>>([]);
const isPlayerNameFocused = useFocus(playerNameElements);

// Global state for all matches (ongoing and finished) (synced with localStorage)
const matches = useLocalStorage<Match[]>('matches', [], {
    mergeDefaults(oldMatches, _defaultValue) {
        // migrate old data
        for (const match of oldMatches) {
            if (typeof(match.lastModified) === 'string') {
                match.lastModified = new Date(match.lastModified).getTime();
            }
        }
        return oldMatches;
    },
});
const ongoingMatches = computed(() =>
    matches.value.filter(match => match.status === 'ongoing')
);

// 1. Define the fixed Match Settings for 501 Double Out
const currentSettings: MatchSettings = {
  pointsToWin: 501,
  mode: 'double-out', // Assuming your MatchSettings type uses this or similar
  // ... any other required fields from your MatchSettings type
};

// 2. Mock Player List (In a real app, fetch these from a database/store)
// Player list without avatars
const playersList = useLocalStorage('playersList', [
  { name: "Alex 'The Hammer' asdfasdfasdfdsaf fasf asdf asf asdf asdf a", selected: true },
  { name: "Sarah Smith", selected: false },
  { name: "The Machine", selected: true },
]);

// 3. Computed list of names for the startGame function
const selectedNames = computed(() => 
  playersList.value.filter(player => player.selected).map(player => player.name)
);

async function addPlayerToList() {
  playersList.value.push({
    name: '',
    selected: true
  });
  // wait for app re-render (which renders the new input element)
  await nextTick();
  // auto-focus the <input> element corresponding to the added player
  (playerNameElements.value[playersList.value.length - 1] as HTMLElement).focus();
}

function removePlayer(index: number) {
    playersList.value.splice(index, 1);
}

function startGame() {
    if (selectedNames.value.length === 0) return;
    matches.value.push({
        matchID: Date.now(),
        matchSettings: currentSettings,
        players: selectedNames.value.map(name => ({
            name,
            score: currentSettings.pointsToWin,
            dartsThisLeg: 0,
            totalPointsScored: 0,
        })),
        currentPlayerIndex: 0,
        startingPlayerIndex: 0,
        status: 'ongoing',
        lastModified: Date.now(),
    });
}
</script>

<template>
<!-- app shell (vertical flex) -->
<div 
    :style="{
        backgroundColor: '#09090b',
        color: '#f4f4f5',
        height: '100vh',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '480px',
        margin: '0 auto',
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

        <!-- line -->
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

    <!-- section: match settings -->
    <section
        style="
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 1rem;
        "
    >
        <!-- "points" setting -->
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

        <!-- "finish" setting -->
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
    
    <!-- section: "resumeMatches" (vertical flex) -->
    <section
        style="
            flex-basis: auto;
            flex-shrink: 1;
            min-height: 0;
            display: flex; 
            flex-direction: column;
            gap: 16px;
        "
    >
        <!-- heading -->
        <h2 
            style="
                font-size: 0.8rem; 
                font-weight: 800; 
                color: #71717a; 
                margin: 0;
            "
        >
                ACTIVE MATCHES
        </h2>

        <!-- ongoingMatches (vertical flex) (with scrollbars) -->
        <div
            style="
                flex-shrink: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                overflow-y: auto;
            "
        >
            <!-- match entry (horizontal flex) -->
            <div
                v-for="match in ongoingMatches"
                :key="match.matchID"
                :style="{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '2px solid #FFCAD3', 
                    padding: '8px 20px',
                    borderRadius: '18px',
                    gap: '8px',
                }"
            >
                <!-- left col: (vertical flex) -->
                <div>
                    <!-- 1st line: player names -->
                    <div
                        :style="{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }"
                    >
                        {{ match.players.map(player => player.name).join(', ') }}
                    </div>

                    <!-- 2nd line: date modified -->
                    <div
                        :style="{
                            color: '#C5C5C5',
                            fontSize: '14px',
                        }"
                    >
                        {{ (() => {
                                const date = new Date(match.lastModified)
                                const weekday = (new Intl.DateTimeFormat(undefined, { weekday: 'long' })).format(date);
                                const month = (new Intl.DateTimeFormat(undefined, { month: 'long' })).format(date);
                            return `${date.getDate()}. ${month} ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()} Uhr `;
                        })() }}
                    </div>
                </div>

                <!-- right col: "trash" button -->
                <button 
                    style="
                        margin-left: auto;
                        background: transparent;
                        border: none; color: #71717a;
                        cursor: pointer;
                        padding: 8px;
                    "
                >
                    <Icon
                        icon="lucide:trash-2"
                        :size="20"
                    />
                </button>
            </div>
        </div>
    </section>

    <!-- section: "roster" (vertical flex) -->
    <section 
        style="
            flex-basis: auto;
            flex-shrink: 1;
            min-height: 0;
            display: flex; 
            flex-direction: column;
        "
    >
        <!-- header line for roster -->
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

            <!--Add Player Button-->
            <button 
                @click="addPlayerToList" 
                style="
                    align-self: flex-end;
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

        <!-- player list -->
        <div 
            style="
                flex-shrink: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                overflow-y: auto;
            "
        >
            <!-- player entry -->
            <div
                v-for="(player, playerIndex) in playersList"
                :key="playerIndex"
                :style="{
                    display: 'flex',
                    alignItems: 'center',
                    background: player.selected ? 'rgba(16,185,129,0.02)' : '#18181b',
                    padding: '1rem 1.25rem',
                    borderRadius: '18px',
                    border: '2px solid',
                    borderColor: player.selected ? '#FFCAD3' : '#726E6E',
                    transition: 'all 0.2s',
                    gap: '10px',
                }"
            >
                <!-- checkbox -->
                <div 
                    @click="player.selected = !player.selected" 
                    :style="{
                        flexShrink: '0',
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

                <!-- player name -->
                <input
                    type="text"
                    :ref="(el) => { playerNameElements[playerIndex] = el as Element | null; }"
                    v-model="player.name"
                    :style="{
                        flexShrink: '1', // document.querySelector
                        flexGrow: '1',
                        minWidth: '0',
                        overflow: 'hidden', /* X */
                        textOverflow: 'ellipsis', /* X */
                        fontWeight: '700',
                        fontSize: '16px',
                        borderRadius: '2px',
                        outline: isPlayerNameFocused[playerIndex] ? '1px solid rgb(255, 202, 211)' : 'none',
                        backgroundColor: isPlayerNameFocused[playerIndex] ? 'rgba(255, 202, 211, 0.1)' : undefined,
                        padding: '4px 8px',
                    }"
                >
                
                <button 
                    @click="removePlayer(playerIndex)" 
                    style="
                        background: transparent; 
                        border: none; color: #71717a; 
                        cursor: pointer; 
                        padding: 8px;
                    "
                >
                    <Icon
                        icon="lucide:trash-2"
                        :size="20"
                    />
                </button>
            </div>
        </div>
    </section>

    <footer>
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