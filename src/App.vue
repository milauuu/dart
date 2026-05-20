<script setup lang="ts">
import type { Match } from './matches.ts';
import { useLocalStorage } from '@vueuse/core';
import { provide, ref } from 'vue';
import Home from './components/Home.vue';
import MatchView from './components/MatchView.vue';

// global state for all matches (ongoing and finished) (synced with localStorage)
const matches = useLocalStorage<Match[]>('matches', [], {
    mergeDefaults(oldMatches, _defaultValue) {
        // migrate old data
        for (const match of oldMatches) {
            if (typeof (match.lastModified) === 'string') {
                match.lastModified = new Date(match.lastModified).getTime();
            }
        }
        return oldMatches;
    },
});

// local state
const activeMatch = ref<Match | undefined>(undefined);

// provide data to child components
provide('matches', matches);
export type Provide_matches = typeof matches;
provide('activeMatch', activeMatch);
export type Provide_activeMatch = typeof activeMatch;
</script>

<template>
    <Home v-if="!activeMatch" />
    <MatchView v-else />
</template>

<style>
:root {
    user-select: none;
}
</style>
