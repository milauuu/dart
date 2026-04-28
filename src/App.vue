<script setup lang="ts">
import { ref } from 'vue';
import { Match } from './matches.ts';
import Home from './components/Home.vue';
</script>

<script lang="ts">
export const activeMatch = ref<Match | undefined>(undefined);
</script>

<template>
    <Home v-if="!activeMatch" />
    <div v-else >
        match view
    </div>
</template>
