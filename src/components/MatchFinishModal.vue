<script setup lang="ts">
import Icon from './Icon.vue';

defineProps<{
    winnerName: string,
    /** true when only one non-winner player remains — hides "Continue Playing" */
    isLastPlayer: boolean,
}>();

const emit = defineEmits<{
    'continue-playing': [],
    'finish-match': [],
}>();
</script>

<template>
    <!-- wrapper (for centered positioning) -->
    <div
        :style="{
            position: 'fixed',
            inset: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(200, 200, 200, 50%)',
        }"
    >
        <!-- modal -->
        <div
            :style="{
                width: 'calc(480px - 2*16px)',
                maxWidth: 'calc(100% - 2*16px)',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 16px 0 rgba(0, 0, 0, 0.5)',
            }"
        >
            <!-- 1st half -->
            <div
                :style="{
                    height: '80px',
                    backgroundColor: '#FF9AAC',
                }"
            />

            <!-- 2nd half -->
            <div
                :style="{
                    padding: '32px 20px',
                    backgroundColor: 'black',
                    position: 'relative', // for absolute-positioned child elements
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '24px',
                }"
            >
                <!-- circle wrapper (for centered positioning) -->
                <div
                    :style="{
                        position: 'absolute',
                        top: '-50px',
                        width: '80px',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }"
                >
                    <!-- outer circle -->
                    <div
                        :style="{
                            position: 'absolute',
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            width: '80px',
                            aspectRatio: '1',
                        }"
                    />

                    <!-- inner circle -->
                    <div
                        :style="{
                            position: 'absolute',
                            backgroundColor: '#FF9AAC',
                            borderRadius: '50%',
                            width: '48px',
                            aspectRatio: '1',
                        }"
                    />

                    <!-- "crown" icon -->
                    <Icon
                        icon="lucide:crown"
                        :size="32"
                        color="white"
                        :style="{
                            position: 'absolute',
                        }"
                    />
                </div>

                <!-- "congratulations text" -->
                <div
                    :style="{
                        textTransform: 'uppercase',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }"
                >
                    Congratulations {{ winnerName }}
                    <br>
                    You Won!
                </div>

                <!-- button row (horizontal) -->
                <div
                    :style="{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '20px',
                    }"
                >
                    <!-- "continue playing" button — hidden when only one non-winner remains -->
                    <div
                        v-if="!isLastPlayer"
                        :style="{
                            padding: '8px 0px',
                            width: '132px',
                            borderRadius: '16px',
                            border: `2px solid ${'#FF9AAC'}`,
                            fontSize: '12px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                        }"
                        @click="emit('continue-playing')"
                    >
                        CONTINUE PLAYING
                    </div>

                    <!-- "or" — hidden alongside "continue playing" -->
                    <div
                        v-if="!isLastPlayer"
                        :style="{
                            fontWeight: 'bold',
                            position: 'relative',
                            bottom: '1px',
                            fontSize: '20px',
                        }"
                    >
                        or
                    </div>

                    <!-- "finish match" button -->
                    <div
                        :style="{
                            padding: '8px 0px',
                            width: '132px',
                            borderRadius: '16px',
                            backgroundColor: '#FF9AAC',
                            fontSize: '12px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                        }"
                        @click="emit('finish-match')"
                    >
                        FINISH MATCH
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
