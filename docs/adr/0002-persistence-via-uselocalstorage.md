# ADR-0002: Persistence via useLocalStorage

**Context:** `App.vue` persists `matches` and `Home.vue` persists `playersList` across sessions. `matches` is a nested array — each match holds multiple players, each player multiple rounds (`throws: Round[]`, each with a `darts: string[]` array and a `busted` flag). The app runs single-user, single-device — there is no requirement for multi-device sync or shared access across users. Estimated data volume: ~700 matches/year. No server/backend exists in the app's current scope.

**Options considered:**
1. `useLocalStorage` (VueUse) — synchronous key-value storage, browser-native, client-only.
2. IndexedDB — asynchronous, transactional, structured client-side database.
3. Server-side backend with a database — persists data outside the client; ruled out by the scope constraint in Context (no multi-device/multi-user requirement).

**Decision:** Option 1 — `useLocalStorage`, with `matches` and `playersList` each bound to their own storage key via separate `useLocalStorage` calls in `App.vue` and `Home.vue` respectively. `deep` and `writeDefaults` are left at VueUse's defaults (`true`) in both calls.

**Rationale:** A backend was ruled out on scope — no multi-device or multi-user requirement exists to justify server infrastructure, an API layer, or auth. Within the remaining client-side options, `useLocalStorage` is the simplest mechanism sufficient for this scope: at the current data volume and access pattern, there is no need for querying, indexing, or granular per-record writes. Its synchronous API also matches the codebase's existing synchronous `ref`-based access pattern, requiring no restructuring.

**Known limitation:** `useLocalStorage` re-serializes and writes the entire `matches` array on every change (deep watch triggers on any nested mutation, down to a single dart throw) — a consequence of `localStorage`'s key-value API having no partial-update mechanism, not a VueUse-specific inefficiency (verified against source: github.com/vueuse/vueuse, packages/core/useStorage). At current volume (~700 matches/year, roughly single-digit MB/year) this is inefficient but has no measurable performance impact. The capacity ceiling (~5-10 MB, browser-dependent) is not actively guarded: `useLocalStorage` catches `QuotaExceededError` internally and only logs it via `console.error`, with no user-facing warning. In-memory state stays correct, but persistence fails silently — data is lost on reload without any prior indication.

**Trade-off accepted:** IndexedDB would avoid both limitations above — it writes only the changed record instead of re-serializing the entire array, and its capacity ceiling sits far beyond what's reachable here. `useLocalStorage` is chosen over IndexedDB anyway, trading that headroom for a simpler, synchronous API that requires no restructuring of existing access patterns. This holds at current volume; it would need re-evaluating if match volume grows an order of magnitude, or if a query/filtering feature is ever needed — at that point IndexedDB's advantages stop being unused capacity and start being missing functionality.

**Status:** Active (reconstructed based on memory)