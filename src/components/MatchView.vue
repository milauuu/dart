<script setup lang="ts">
import { inject } from 'vue';
import { Provide_activeMatch } from '../App.vue';
import Icon from './Icon.vue';

// inject state from parent components
const activeMatch = inject('activeMatch') as Provide_activeMatch;
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
            // gap: '20px',
        }"
    >
        <header
            :style="{
                flex: '0 0 auto',
                backgroundColor: '#323232',
                padding: '16px',
            }"
        >
            <!--"back" button -->
            <button
                :style="{
                    cursor: 'pointer',
                    padding: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                }"
                @click="() => {
                }"
            >
                <Icon
                    icon="lucide:trash-2"
                    :size="20"
                    :color="'#FF9AAC'"
                />
            </button>
        </header>
    </div>
</template>
