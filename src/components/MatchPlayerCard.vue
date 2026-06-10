<script setup lang="ts">
import type { Provide_activeMatch } from '../App.vue';
import type { Player } from '../matches';
import { computed, inject, watch } from 'vue';
import { dartMap } from '../dartMap';
import Icon from './Icon.vue';

// props
const props = defineProps<{
    playerIndex: number,
}>();

// emits
const emit = defineEmits<{
    win: [winnerName: string],
}>();

// inject parent state
const activeMatch = inject('activeMatch') as Provide_activeMatch;

// derived state
const score = computed(() => {
    let playerPoints = 0;
    for (const round of props.player.throws) {
        for (const dart of round) {
            playerPoints += dartMap(dart);
        }
    }
    return activeMatch.value!.matchSettings.pointsToWin - playerPoints;
});
const player = computed(() => activeMatch.value!.players[props.playerIndex]);

const totalDarts = computed(() =>
    props.player.throws.flat(Infinity).length,
);
const average = computed(() => {
    if (props.player.throws.at(0)!.length === 0) {
        return '0';
    }
    return ((activeMatch.value!.matchSettings.pointsToWin - score.value) / totalDarts.value).toFixed(2);
});

watch(score, (newScore) => {
    // only proceed if the score has reached exactly zero
    if (newScore !== 0) return;

    // the dart that caused the score to change
    const lastDart = props.player.throws.at(-1)?.at(-1);
    if (!lastDart) return;

    const { mode } = activeMatch.value!.matchSettings;

    // double-out: must finish on a dart prefixed with "D"
    // single-out: must finish on a plain number (no letter prefix)
    const isValidFinish = mode === 'double-out'
        ? lastDart.startsWith('D')
        : !lastDart.startsWith('D') && !lastDart.startsWith('T');

    if (isValidFinish) {
        emit('win', props.player.name);
    }
});
</script>

<template>
    <div
        :style="{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '12px 20px 12px 36px',
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
                flexBasis: '0',
                flexGrow: '1',
                minWidth: '0',
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
                {{ score }}
            </div>

            <!-- player name -->
            <div
                :style="{
                    fontWeight: '500',
                    color: 'GRAY',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }"
            >
                {{ player.name }}
            </div>
        </div>

        <!-- 2nd col -->
        <div
            :style="{
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
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
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: '600',
                    }"
                >
                    {{ player.throws.at(-1)?.[dartIndex] }}
                </div>
            </div>
            <!-- Sum of dartpoints -->
            <div
                :style="{
                    fontWeight: '500',
                    color: 'GRAY',
                }"
            >
                {{ player.throws.at(-1)?.reduce((acc, dartPoint) => acc + dartMap(dartPoint), 0) ?? '' }}
            </div>
        </div>

        <!-- 3rd col -->
        <div
            :style="{
                flexBasis: '0',
                flexGrow: '1',
                marginLeft: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
            }"
        >
            <!-- right-aligned content of 3rd col -->
            <div
                :style="{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }"
            >
                <!-- line 1: darts thrown -->
                <div
                    :style="{
                        fontWeight: '500',
                        color: 'GRAY',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }"
                >
                    <Icon
                        icon="game-icons:dart"
                        :size="20"
                        color="gray"
                        :style="{
                            position: 'relative',
                            top: '1px',
                        }"
                    />
                    <div>
                        {{ totalDarts }}
                    </div>
                </div>

                <!-- line 2: average points -->
                <div
                    :style="{
                        fontWeight: '500',
                        color: 'GRAY',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }"
                >
                    <Icon
                        icon="ix:average"
                        :size="20"
                        color="gray"
                    />
                    <div
                        :style="{
                            width: '35px',
                            overflow: 'visible',
                        }"
                    >
                        {{ average }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
