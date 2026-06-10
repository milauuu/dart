# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server (accessible on LAN via --host)
pnpm exec eslint . --fix   # lint and auto-fix
```

No build or test scripts are defined in `package.json`. To build: `pnpm exec vite build`.

## Architecture

A mobile-first (max-width 480px) Vue 3 SPA for tracking dart matches. No router — view switching is done by a single reactive ref.

**State management** — `App.vue` owns two pieces of global state and distributes them via `provide/inject`:

| Provided key | Type | Description |
|---|---|---|
| `matches` | `Ref<Match[]>` | All matches, persisted to localStorage via `useLocalStorage` |
| `activeMatch` | `Ref<Match \| undefined>` | Which match is being played; `undefined` → Home screen |

Child components access these with `inject()`. `App.vue` exports TypeScript type aliases (`Provide_matches`, `Provide_activeMatch`) for type-safe injection — always import these when calling `inject`.

**View routing** — `App.vue` renders `<Home>` when `activeMatch` is undefined, `<MatchView>` otherwise. Setting `activeMatch.value` switches views.

**Data model** (`src/matches.ts`):
- `Player.throws` is `string[][]` — an array of rounds, each round holding up to 3 dart notation strings.
- Dart notation: plain number `"20"`, double `"D20"`, triple `"T20"`. Parsed by `dartMap()` in `src/dartMap.ts`.

**Icon system** (`src/components/Icon.vue`) — icons are inlined SVG strings in a `const icons` object. To add an icon, extend that object with a new key and its `viewBoxSize` + `svg` string. The `SupportedIcons` type is derived from `keyof typeof icons`.

**Styling** — all styles are inline (`style` bindings or string literals). `src/assets/tailwind-base-styles.css` provides only Tailwind's preflight/CSS reset — no utility classes are used.

## ESLint conventions

Config is `@antfu/eslint-config` with overrides in `eslint.config.js`. Key rules:
- 4-space indentation (JS, JSON, Vue templates)
- Semicolons required
- Single quotes
- `vue/no-mutating-props` is off — direct prop mutation is permitted
- `vue/require-v-for-key` is off — `:key` on `v-for` is not required

## Response Format

- Always mark files with `// === FILE: <path> ===`
- Return files in hierarchical order — parents first
- No prose or explanations unless explicitly asked
- Comments only on new functions and variables
- When architectural decisions are involved, propose 3 approaches with pros and cons — wait for approval before implementing

## Tech Stack & Conventions

- Never install packages without explicit user approval; use `pnpm` when approved
- Always use Vue 3 Composition API with `<script setup>` syntax
- Always use strict TypeScript — no `any` types, explicit return types on functions
- Always use inline styles — no Tailwind utility classes, no scoped `<style>` blocks

**Architectural constraints:**
- Never move state out of `App.vue` — it is the single source of truth
- Always handle data mutations in the component where the event is triggered