<script setup lang="ts">
const props = defineProps<{
    dart: number, // dart score to display
}>();
</script>

<template>
    <div>
        {{ dart }}
    </div>
</template>
