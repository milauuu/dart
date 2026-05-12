<script setup lang="ts">
import { inject } from 'vue';
import { ActiveMatch } from '../App.vue';

// inject state from parent components
const activeMatch = inject('activeMatch') as ActiveMatch;
</script>

<template>
    Match View...
</template>