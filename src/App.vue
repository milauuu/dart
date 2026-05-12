<script setup lang="ts">
import { ref, provide, type InjectionKey, type Ref } from 'vue';
import { type Match } from './matches.ts';
import Home from './components/Home.vue';
import MatchView from './components/MatchView.vue';

const activeMatch = ref<Match | undefined>(undefined);
export type ActiveMatch = typeof activeMatch;
provide('activeMatch', activeMatch);
</script>

<template>
    <Home v-if="!activeMatch" />
    <MatchView
        v-else
    />
</template>
