<script setup lang="ts">
import type { Provide_activeMatch, Provide_matches } from '../App.vue';
import type { Match, MatchSettings } from '../matches.ts';
import { useLocalStorage } from '@vueuse/core';
import { computed, inject, nextTick, ref } from 'vue';
import { formatDate, useFocus } from '../util.ts';
import Icon from './Icon.vue';

// template references
const playerNameElements = ref<Array<Element | null>>([]);
const isPlayerNameFocused = useFocus(playerNameElements);

// inject state from parent components
const activeMatch = inject('activeMatch') as Provide_activeMatch;
const matches = inject('matches') as Provide_matches;

// derived state
const ongoingMatches = computed(() =>
    matches.value.filter((match) => match.status === 'ongoing'),
);

// 1. Define the fixed Match Settings for 501 Double Out
const currentSettings: MatchSettings = {
    pointsToWin: 501,
    mode: 'double-out', // Assuming your MatchSettings type uses this or similar
    // ... any other required fields from your MatchSettings type
};

// player list state (synced with localStorage)
const playersList = useLocalStorage('playersList', [
    // TODO: remove mock data
    { name: 'Alex', selected: true },
    { name: 'Sarah Smith', selected: false },
    { name: 'The Machine', selected: true },
]);

// 3. Computed list of names for the startGame function
const selectedNames = computed(() =>
    playersList.value.filter((player) => player.selected).map((player) => player.name),
);

async function addPlayerToList() {
    playersList.value.push({
        name: '',
        selected: true,
    });
    // wait for app re-render (which renders the new input element)
    await nextTick();
    // auto-focus the <input> element corresponding to the added player
    (playerNameElements.value[playersList.value.length - 1] as HTMLElement).focus();
}

function removeMatch(match: Match) {
    const index = matches.value.indexOf(match);
    matches.value.splice(index, 1);
}

function removePlayer(index: number) {
    playersList.value.splice(index, 1);
}

function startGame() {
    if (selectedNames.value.length === 0) return;
    matches.value.push({
        matchSettings: currentSettings,
        players: selectedNames.value.map((name) => ({
            name,
            throws: [[]],
        })),
        currentPlayerIndex: 0,
        status: 'ongoing',
        lastModified: Date.now(),
    });
    activeMatch.value = matches.value.at(-1);
}
</script>

<template>
    <!-- app shell (vertical flex) -->
    <div
        :style="{
            backgroundColor: '#09090b',
            color: '#f4f4f5',
            height: '100vh',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '480px',
            margin: '0 auto',
        }"
    >
        <header
            style="
            text-align: center;
            flex: 0 0 auto;;
        "
        >
            <h1
                style="
                font-weight: 900;
                font-style: italic;
                font-size: 36px;
                margin: 0;
                letter-spacing: -1px;
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
            gap: 16px;
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
                    font-size: 12px;
                    font-weight: 800;
                    color: #71717a;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                "
                >
                    Points
                </label>
                <div
                    style="
                    background: rgba(16, 185, 129, 0.05);
                    border: 2px solid #EB4574;
                    border-radius: 18px;
                    padding: 20px;
                    font-size: 24px;
                    font-weight: 900;
                    text-align: center;
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
                    font-size: 12px;
                    font-weight: 800;
                    color: #71717a;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                "
                >
                    Check-Out
                </label>
                <div
                    style="
                    background: rgba(16, 185, 129, 0.05);
                    border: 2px solid #EB4574;
                    border-radius: 20px;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: 900;
                    white-space: nowrap;
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
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
            min-height: 0;
            max-height: fit-content;
            display: flex;
            flex-direction: column;
            gap: 16px;
        "
        >
            <!-- heading -->
            <h2
                style="
                font-size: 12px;
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
                gap: 12px;
                overflow-y: auto;
            "
                class="custom-scrollbars"
            >
                <!-- match entry (horizontal flex) -->
                <div
                    v-for="match in ongoingMatches"
                    :style="{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '2px solid #FFCAD3',
                        padding: '8px 20px',
                        borderRadius: '18px',
                        gap: '8px',
                        cursor: 'pointer',
                    }"
                    @click="() => { activeMatch = match; }"
                >
                    <!-- left col: (vertical flex) -->
                    <div
                        style="
                        flex-shrink: 1;
                        min-width: 0;
                    "
                    >
                        <!-- 1st line: player names -->
                        <div
                            :style="{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
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
                            {{ formatDate(match.lastModified) }}
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
                        @click="(event) => {
                            removeMatch(match);
                            // stop propagation of this event to parent elements
                            event.stopPropagation();
                        }"
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
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
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
                margin-bottom: 16px;
            "
            >
                <h2
                    style="
                    font-size: 12px;
                    font-weight: 800;
                    color: #71717a;
                    margin: 0;
                "
                >
                    ROSTER
                </h2>

                <!-- Add Player Button -->
                <button
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
                    @click="addPlayerToList"
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

            <!-- player list qith scroll bar -->
            <div
                style="
                flex-shrink: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                overflow-y: auto;
            "
                class="custom-scrollbars"
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
                        :style="{
                            flexShrink: '0',
                            width: '26px',
                            height: '26px',
                            borderRadius: '18px',
                            border: '2px solid',
                            borderColor: player.selected ? '#FFCAD3' : '#71717a',
                            backgroundColor: player.selected ? '#FFCAD3' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'black',
                            fontWeight: '900',
                            fontSize: '14px',
                        }"
                        @click="player.selected = !player.selected"
                    >
                        {{ player.selected ? '✓' : '' }}
                    </div>

                    <!-- player name -->
                    <input
                        :ref="(el) => { playerNameElements[playerIndex] = el as Element | null; }"
                        v-model="player.name"
                        type="text"
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
                        @blur="() => {
                            if (player.name.length === 0) {
                                removePlayer(playerIndex);
                            }
                        }"
                    >

                    <button
                        style="
                        background: transparent;
                        border: none; color: #71717a;
                        cursor: pointer;
                        padding: 8px;
                    "
                        @click="removePlayer(playerIndex)"
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
                :disabled="selectedNames.length === 0"
                :style="{
                    width: '100%',
                    backgroundColor: '#EB4574',
                    color: 'black',
                    border: 'none',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    cursor: selectedNames.length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
                    opacity: selectedNames.length === 0 ? 0.3 : 1,
                    filter: selectedNames.length === 0 ? 'grayscale(1)' : 'none',
                }"
                @click="startGame"
            >
                START MATCH
            </button>
        </footer>
    </div>
</template>

<style scoped>
/* reserved symmetric whitespace in layout */
.custom-scrollbars {
    scrollbar-gutter: stable;
    margin-right: calc(-4px - 2*6px);
}
/* width of the entire scrollbar */
.custom-scrollbars::-webkit-scrollbar {
    width: calc(4px + 2*6px);
    /* height: 4px; */
}
/* track color */
.custom-scrollbars::-webkit-scrollbar-track {
    background: transparent;
}
/* thumb */
.custom-scrollbars::-webkit-scrollbar-thumb {
    /* thumb color */
    background: #FFCAD3;
    /* thumb rounding */
    border-radius: 10px;
    /* create spacing around the thumb */
    border: 6px solid transparent;
    background-clip: padding-box;
}
</style>
