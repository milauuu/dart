<script setup lang="ts">
import { inject, type Ref, useTemplateRef } from 'vue';
import { type Player, type Match } from '../matches.ts';
import Icon from './Icon.vue';
import { useElementHover } from '@vueuse/core';
import { type Provide_activeMatch } from '../App.vue';
import { range } from '../util.ts';

// inject state from parent components
const activeMatch = inject('activeMatch') as Provide_activeMatch;

// template refs
const backButton = useTemplateRef('backButton');
const backButtonHovered = useElementHover(backButton);

// getters
function score(player: Player) {
    let playerPoints = 0;
    for (const round of player.throws) {
        for (const dart of round) {
            playerPoints += dart;
        }
    }
    return activeMatch.value!.matchSettings.pointsToWin - playerPoints;
}

// keyboard
const keyboardKeys = [
    ...range(1, 20),
    25,
]

// event handlers
function addDart(...darts: number[]) {
    
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
            <div
                v-for="(player, playerIndex) in activeMatch!.players"
                :style="{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    padding: '12px 32px',
                    backgroundColor: '#323232',
                }"
            >
                <!-- color strip -->
                <div
                    v-if="playerIndex === activeMatch!.currentPlayerIndex" 
                    :style="{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        height: '100%',
                        width: '12px',
                        backgroundColor: '#FF9AAC',
                    }"
                />

                <!-- 1st col -->
                <div
                    :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }"
                >
                    <!-- score -->
                    <div
                        :style="{
                            fontSize: '32px',
                            fontWeight: 'bold',
                        }"
                    >
                        {{ score(player) }}
                    </div>

                    <!-- player name -->
                    <!-- TODO: TEXT OVERFLOW ELLIPSIS -->
                    <div
                        :style="{
                            fontWeight: '500',
                        }"
                    >
                        {{player.name}}
                    </div>
                </div>

                <!-- 2nd col -->
                <div
                    :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }"
                >
                    <!-- dart points -->
                    <div
                        :style="{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '8px',
                        }"
                    >
                        <!-- dart point -->
                        <div
                            v-for="dartIndex in [0, 1, 2]"
                            :style="{
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'black',
                            }"
                        >
                            {{ player.throws.at(-1)?.[dartIndex] ?? '' }}
                        </div>
                    </div>
                </div>
            </div>
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
                }"
            >
                <!-- regular button -->
                <div
                    v-for="dart in range(1, 20)"
                    :dart="dart"
                >
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
