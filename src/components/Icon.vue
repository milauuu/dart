<script setup lang="ts">
// props
withDefaults(defineProps<{
    icon: SupportedIcons,
    size?: number,
    color?: string,
}>(), {
    size: 16,
    color: 'currentColor',
});

// icons
// (viewBox="0 0 24 24")
// (defaults: fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2")
const icons = {
    'lucide:trash-2': `<path d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
    'lucide:arrow-left': `<path d="m12 19l-7-7l7-7m7 7H5"/>`,
};
export type SupportedIcons = keyof typeof icons;
</script>

<template>
    <svg
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE -->
        <g
            fill="none"
            :stroke="color"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            v-html="icons[icon]"
        />
    </svg>
</template>
