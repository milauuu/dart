<script setup lang="ts">
import type { Provide_activeMatch } from '../App.vue';
import { useElementHover } from '@vueuse/core';
import { computed, inject, ref, useTemplateRef } from 'vue';
import { mathMod, range } from '../util.ts';
import Icon from './Icon.vue';
import MatchFinishModal from './MatchFinishModal.vue';
import MatchPlayerCard from './MatchPlayerCard.vue';

// inject state from parent components
const activeMatch = inject('activeMatch') as Provide_activeMatch;

// modifier status
let modifier = '' as '' | 'double' | 'triple';

// "finish modal" state
const finishModalOpen = ref(false);
const winnerName = ref('');

// called by MatchPlayerCard when a player's score hits zero with a valid finish
function handleWin(name: string) {
    winnerName.value = name;
    finishModalOpen.value = true;
}

// template refs
const backButton = useTemplateRef('backButton');
const backButtonHovered = useElementHover(backButton);

// globally accessible computed
const currentThrows = computed(() => {
    return activeMatch.value!.players[activeMatch.value!.currentPlayerIndex].throws;
});

const isFirstThrow = computed (() => {
    return activeMatch.value!.players[0].throws[0].length === 0;
});

function nextPlayer() {
    activeMatch.value!.currentPlayerIndex++;
    activeMatch.value!.currentPlayerIndex %= activeMatch.value!.players.length;
};

function previousPlayer() {
    activeMatch.value!.currentPlayerIndex--;
    activeMatch.value!.currentPlayerIndex = mathMod(activeMatch.value!.currentPlayerIndex, activeMatch.value!.players.length);
};

// event handlers
function buildDartString(dartPoint: number, mod: '' | 'double' | 'triple'): string {
    if (mod === 'double') return `D${dartPoint}`;
    if (mod === 'triple') return `T${dartPoint}`;
    return `${dartPoint}`;
}

// returns true if the resulting score is invalid for the current game mode
function checkBust(newScore: number, mode: 'single-out' | 'double-out', lastDart: string): boolean {
    if (mode === 'single-out') return newScore < 0;
    return newScore < 0 || newScore === 1 || (newScore === 0 && !lastDart.startsWith('D'));
}

function endRound() {
    nextPlayer();
    currentThrows.value.push({ darts: [], busted: false });
}
function addDartPoint(dartPoint: number) {
    const dartString = buildDartString(dartPoint, modifier.value);
    modifier.value = '';

    const currentRound = currentThrows.value.at(-1)!;
    currentRound.darts.push(dartString);

    const { pointsToWin, mode } = activeMatch.value!.matchSettings;
    // score the player had at the start of this round (busted rounds excluded)
    const scoreBeforeRound = computeScore(currentThrows.value.slice(0, -1), pointsToWin);
    const newScore = scoreBeforeRound - currentRound.darts.reduce((roundTotal, dart) => roundTotal + dartMap(dart), 0);

    if (checkBust(newScore, mode, dartString)) {
        currentRound.busted = true;
        endRound();
        return;
    }

    if (currentRound.darts.length === 3) endRound();
}

function deleteThrow() {
    if (currentThrows.value.at(-1)!.length === 0) {
        currentThrows.value.pop();
        previousPlayer();
    }
    currentThrows.value.at(-1)!.pop();
}
</script>

<template>
    <!-- app shell (vertical flex) -->
    <div
        :style="{
            backgroundColor: 'black',
            color: '#f4f4f5',
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '480px',
            margin: '0 auto',
        }"
    >
        <!-- header -->
        <header
            :style="{
                flex: '0 0 auto',
                backgroundColor: '#323232',
                padding: '16px',
            }"
        >
            <!-- "back" button -->
            <button
                ref="backButton"
                :style="{
                    cursor: 'pointer',
                    padding: '8px',
                    backgroundColor: backButtonHovered ? 'rgba(255,255,255,0.1)' : undefined,
                    borderRadius: '4px',
                }"
                @click="() => { activeMatch = undefined; }"
            >
                <Icon
                    icon="lucide:arrow-left"
                    :size="20"
                    color="#FF9AAC"
                />
            </button>
        </header>

        <!-- score section (vertical flex) -->
        <div
            :style="{
                flex: '1 1 auto',
                display: 'flex',
                minHeight: '0',
                flexDirection: 'column',
                gap: '16px',
                padding: '32px 24px',
                overflowY: 'auto',
            }"
            class="custom-scrollbars"
        >
            <!-- player entry (horizontal flexbox) -->
            <MatchPlayerCard
                v-for="(player, playerIndex) in activeMatch!.players"
                :player-index="playerIndex"
                @win="handleWin"
            />
        </div>

        <!-- keyboard -->
        <div
            :style="{
                flex: '0 0 auto',
            }"
        >
            <!-- top row -->
            <!-- main field -->
            <div
                :style="{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    padding: '0px 24px 24px 24px',
                }"
            >
                <!-- regular buttons -->
                <div
                    v-for="dartPoint in [...range(1, 20), 25, 0]"
                    :style="{
                        backgroundColor: '#636366',
                        aspectRatio: '1',
                        display: 'flex',
                        fontWeight: '600',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }"
                    @click="addDartPoint(dartPoint)"
                >
                    <div>
                        {{ dartPoint }}
                    </div>
                </div>
                <!-- special buttons -->
                <!-- Double Button -->
                <div
                    :style="{
                        backgroundColor: '#FF9AAC',
                        gridColumn: 'span 2',
                        display: 'flex',
                        fontWeight: '600',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }"
                    @click="() => { modifier = 'double'; }"
                >
                    <div>
                        DOUBLE
                    </div>
                </div>
                <!-- triple Button -->
                <div
                    :style="{
                        backgroundColor: '#EB4574',
                        gridColumn: 'span 2',
                        display: 'flex',
                        fontWeight: '600',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }"
                    @click="() => { modifier = 'triple'; }"
                >
                    <div>
                        TRIPLE
                    </div>
                </div>
                <div
                    :inert="isFirstThrow"
                    :style="{
                        backgroundColor: '#E53935',
                        gridColumn: 'span 2',
                        display: 'flex',
                        fontWeight: '600',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
                        opacity: isFirstThrow ? 0.3 : 1,
                        filter: isFirstThrow ? 'grayscale(1)' : 'none',
                    }"
                    @click="deleteThrow()"
                >
                    <Icon
                        icon="lucide:delete"
                        :size="20"
                        color="white"
                    />
                </div>
            </div>
        </div>

        <!-- "finish modal" -->
        <MatchFinishModal
            v-if="finishModalOpen"
            :winner-name="winnerName"
        />
    </div>
</template>

<style scoped>
/* reserved symmetric whitespace in layout */
.custom-scrollbars {
    scrollbar-gutter: stable both-edges;
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
