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
const icons = {
    'lucide:trash-2': {
        viewBoxSize: 24,
        svg: `<!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
    },
    'lucide:arrow-left': {
        viewBoxSize: 24,
        svg: `<!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 19l-7-7l7-7m7 7H5"/>`,
    },
    'game-icons:dart': {
        viewBoxSize: 512,
        svg: `<!-- Icon from Game Icons by GameIcons - https://github.com/game-icons/icons/blob/master/license.txt --><path fill="currentColor" d="M134.745 22.098c-4.538-.146-9.08 1.43-14.893 7.243c-5.586 5.586-11.841 21.725-15.248 35.992c-.234.979-.444 1.907-.654 2.836l114.254 105.338c-7.18-28.538-17.555-59.985-29.848-86.75c-11.673-25.418-25.249-46.657-37.514-57.024c-6.132-5.183-11.56-7.488-16.097-7.635M92.528 82.122L82.124 92.526L243.58 267.651l24.072-24.072zm-24.357 21.826c-.929.21-1.857.42-2.836.654c-14.267 3.407-30.406 9.662-35.993 15.248c-5.813 5.813-7.39 10.355-7.244 14.893c.147 4.538 2.452 9.965 7.635 16.098c10.367 12.265 31.608 25.842 57.025 37.515c26.766 12.293 58.211 22.669 86.749 29.848L68.17 103.948zM280.899 255.79l-25.107 25.107l73.265 79.469l31.31-31.31zm92.715 85.476l-32.346 32.344l2.07 2.246c.061.058 4.419 4.224 10.585 6.28c6.208 2.069 12.71 2.88 21.902-6.313s8.38-15.694 6.31-21.902c-2.057-6.174-6.235-10.54-6.283-10.59zm20.172 41.059a46 46 0 0 1-5.233 6.226a46 46 0 0 1-6.226 5.235L489.91 489.91z"/></svg>`,
    },
    'ix:average': {
        viewBoxSize: 512,
        svg: `<!--Icon from Siemens Industrial Experience Icons by Siemens AG - https://github.com/siemens/ix-icons/blob/main/LICENSE.md --><path fill="currentColor" fill-rule="evenodd" d="m422.536 60.491l30.17 30.17l-61.36 61.36c22.15 28.79 35.32 64.846 35.32 103.979c0 94.256-76.41 170.666-170.666 170.666c-39.133 0-75.19-13.17-103.979-35.32L90.667 452.7l-30.17-30.17l61.205-61.204C98.92 332.317 85.334 295.746 85.334 256c0-94.257 76.41-170.667 170.666-170.667c39.745 0 76.317 13.586 105.325 36.367zm-61.704 122.044L182.535 360.83C203.33 375.431 228.664 384 256 384c70.693 0 128-57.308 128-128c0-27.337-8.57-52.672-23.168-73.465M256 128c-70.692 0-128 57.307-128 128c0 27.952 8.96 53.811 24.164 74.863l178.699-178.7C309.81 136.96 283.953 128 256 128"/></svg>`,
    },
    'lucide:delete': {
        viewBoxSize: 24,
        svg: `<!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm2 4l6 6m0-6l-6 6"/>`,
    },
};
export type SupportedIcons = keyof typeof icons;
</script>

<template>
    <svg
        :width="size"
        :height="size"
        :viewBox="`0 0 ${icons[icon].viewBoxSize} ${icons[icon].viewBoxSize}`"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g
            :style="{
                color,
            }"
            v-html="icons[icon].svg"
        />
    </svg>
</template>
