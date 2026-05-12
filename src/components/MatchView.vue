<script setup lang="ts">
import { inject, useTemplateRef } from 'vue';
import { Provide_activeMatch } from '../App.vue';
import Icon from './Icon.vue';
import { useElementHover } from '@vueuse/core';

// inject state from parent components
const activeMatch = inject('activeMatch') as Provide_activeMatch;

// template refs
const backButton = useTemplateRef('backButton');
const backButtonHovered = useElementHover(backButton);
</script>

<template>
    <!-- app shell (vertical flex) -->
    <div
        :style="{
            backgroundColor: '#09090b',
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

        <!-- score section -->
        <div
            :style="{
                flex: '1 1 auto',
                minHeight: '0',
                padding: '32px 24px',
                overflowY: 'auto',
            }"
            class="custom-scrollbars"
        >
        </div>

        <!-- keyboard -->
        <div
            :style="{
                flex: '0 0 auto',
            }"
        >

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
