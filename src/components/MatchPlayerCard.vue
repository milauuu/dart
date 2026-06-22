<script setup lang="ts">
import type { Provide_activeMatch } from '../App.vue';
import { computed, inject, watch } from 'vue';
import { dartMap } from '../dartMap';
import { computeScore } from '../util';
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
const player = computed(() => activeMatch.value!.players[props.playerIndex]);

const score = computed(() =>
    computeScore(player.value.throws, activeMatch.value!.matchSettings.pointsToWin),
);

const totalDarts = computed(() =>
    player.value.throws.reduce((total, round) => total + round.darts.length, 0),
);

const average = computed(() => {
    if (totalDarts.value === 0) {
        return '0';
    }
    return ((activeMatch.value!.matchSettings.pointsToWin - score.value) / totalDarts.value).toFixed(2);
});

// pads busted rounds with '-' for display; data only stores real darts
const lastRoundState = computed(() => {
    const lastRound = player.value.throws.at(-1)!;
    const displayDarts = lastRound.busted
        ? [...lastRound.darts, ...Array.from({ length: 3 - lastRound.darts.length }).fill('-') as string[]]
        : lastRound.darts;
    return {
        darts: displayDarts,
        busted: lastRound.busted,
    };
});

const roundSumDisplay = computed(() => {
    if (score.value === 0) return 'WON';
    if (lastRoundState.value.busted) return 'BUST';
    if (lastRoundState.value.darts.length === 0) return 0;
    return lastRoundState.value.darts.reduce((total, dart) => total + dartMap(dart), 0);
});

watch(score, (newScore) => {
    // only proceed if the score has reached exactly zero
    if (newScore !== 0) return;

    // the dart that caused the score to change
    const lastDart = player.value.throws.at(-1)?.darts.at(-1);
    if (!lastDart) return;

    const { mode } = activeMatch.value!.matchSettings;

    // double-out: must finish on a dart prefixed with "D"
    // single-out: must finish on a plain number (no letter prefix)
    const isValidFinish = mode === 'double-out'
        ? lastDart.startsWith('D')
        : !lastDart.startsWith('D') && !lastDart.startsWith('T');

    if (isValidFinish) {
        emit('win', player.value.name);
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
            opacity: score === 0 ? 0.4 : 1,
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
                <!-- dart point; turns red when the round was a bust -->
                <div
                    v-for="dartIndex in [0, 1, 2]"
                    :style="{
                        width: '32px',
                        height: '32px',
                        backgroundColor: lastRoundState.busted ? '#FF9AAC' : 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: '600',
                    }"
                >
                    {{ lastRoundState.darts[dartIndex] }}
                </div>
            </div>
            <!-- Sum of dartpoints; hidden for busted or empty rounds -->
            <div
                :style="{
                    fontWeight: '500',
                    color: 'GRAY',
                }"
            >
                {{ roundSumDisplay }}
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
