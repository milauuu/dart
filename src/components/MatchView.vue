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
    </div>
</template>
