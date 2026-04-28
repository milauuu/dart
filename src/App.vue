<script setup lang="ts">
import { ref } from 'vue';
import { Match } from './matches.ts';

const activeMatch = ref<Match | undefined>(undefined);
</script>

<template>
    <div v-if="!activeMatch">
        start view
    </div>
    <div v-else >
        match view
    </div>
</template>
