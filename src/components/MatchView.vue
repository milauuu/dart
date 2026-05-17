<script setup lang="ts">
import { inject, type Ref, useTemplateRef } from 'vue';
import { type Player, type Match } from '../matches.ts';
import Icon from './Icon.vue';
import { useElementHover } from '@vueuse/core';
import { type Provide_activeMatch } from '../App.vue';
import { range } from '../util.ts';
import MatchPlayerCard from './MatchPlayerCard.vue';

// inject state from parent components
const activeMatch = inject('activeMatch') as Provide_activeMatch;

// modifier status
let modifier = '' as ''|'double'| 'triple';

// template refs
const backButton = useTemplateRef('backButton');
const backButtonHovered = useElementHover(backButton);

// Modifier Function
function checkMod(dartPoint: string) {
    if (modifier === 'double') {
        dartPoint= 'D'+dartPoint;
    }
    if (modifier === 'triple') {
        dartPoint = 'T'+dartPoint;
    }
    modifier = '';
    return dartPoint
}


// event handlers
function addDartPoint(dartPoint: number) {
    const playerIndex = activeMatch.value!.currentPlayerIndex;
    const throws = activeMatch.value!.players[playerIndex].throws;
    // initialize with empty list for the first player in the first round
    if (throws.length === 0) {
        throws.push([dartPoint]);
    }
    // add dartPoint
    else {
        throws.at(-1)!.push(dartPoint);
    }
    // jump to next player (if applicable)
    if (throws.at(-1)!.length === 3) {
        activeMatch.value!.currentPlayerIndex++;
        activeMatch.value!.currentPlayerIndex %= activeMatch.value!.players.length;
        const playerIndex = activeMatch.value!.currentPlayerIndex;
        const throws = activeMatch.value!.players[playerIndex].throws;
        throws.push([]);
    }
}
</script>

<template>
    <!-- app shell (vertical flex) -->
    <div
        :style="{
            backgroundColor: 'black',
            color: '#f4f4f5',
            height: '100vh',
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
                :player="player"
                :playerIndex="playerIndex"
            />
        </div>

        <!-- keyboard -->
        <div
            :style="{
                flex: '0 0 auto',
            }"
        >
            <!-- top row -->
            <!-- TODO: -->

            <!-- main field -->
            <div
                :style="{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    padding: '0px 24px 24px 24px'
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
                    @click="modifier = 'double'"
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
                    @click="modifier = 'triple'"
                >
                    <div>
                        TRIPLE
                    </div>
                </div>
                <div   
                    :style="{
                        backgroundColor: '#E53935',
                        gridColumn: 'span 2',
                        display: 'flex',
                        fontWeight: '600',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }"
                >
                    <Icon
                        icon="lucide:delete"
                        :size="20"
                        color="white"
                    />
                </div>
            </div>
        </div>
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
