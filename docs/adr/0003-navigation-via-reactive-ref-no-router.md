# ADR-0003: Navigation via Reactive Ref (No Router)

**Context:** The app has two top-level views: `Home` (match setup, player list) and `MatchView` (active match). Navigation between them is the only navigation requirement in the app. At the time of this decision, the scope was detemined at these two screens.

**Options considered:**
1. `vue-router` — official, Vue-Core-team-maintained routing library. URL-based addressing, `history` API integration, route definitions as a `{ path, component }` table.
2. Reactive ref + conditional rendering — a single `ref<Match | undefined>` holding the active match (or `undefined`), toggled via `v-if`/`v-else` in `App.vue` between `Home` and `MatchView`.

**Decision:** Option 2 — a local `activeMatch` ref, with `App.vue`'s template conditionally rendering `Home` when `activeMatch` is `undefined`, and `MatchView` otherwise.

**Rationale:** The app's navigation need is a single binary state — a match is either active or it isn't — not a set of independently addressable destinations. This scope does not require URL-based addressing across multiple distinct resources, which is what `vue-router` is built to solve. A reactive ref with conditional rendering fully covers a two-branch, mutually-exclusive view switch using only Vue's core reactivity and template system — no additional dependency or routes-table/config layer is needed for this.

The routing concept (URL-based addressing, what a router fundamentally provides) was considered at decision time; the decision to not use `vue-router` was an active scope assessment against the app's actual current requirements — a personal darts counter for friends.

**Known limitation:** The active match cannot be shared via URL or bookmarked, since no address for it exists outside the running app state. Reloading the page while a match is active returns the user to `Home`, because `activeMatch` lives in memory and is lost on reload (independent of ADR-0002's `matches` persistence, which persists match data, not which screen is active). Browser back/forward also has nothing to navigate through between `Home` and `MatchView`, since the URL never changes.

**Trade-off accepted:** These limitations are the direct cost of not having URL-based state. They were accepted because none were requirements for a single-device, single-session darts counter — no user needs to bookmark or share a specific match, and losing in-progress navigation state on an accidental reload was judged acceptable risk for the app's casual, low-stakes use case. This holds for the current two-screen scope; it would need re-evaluating if the app grows additional independently-navigable screens (e.g. match history, player statistics detail, settings), at which point a routes table would likely provide real structural value rather than boilerplate, and the current approach's known limitations would compound rather than stay marginal.

**Status:** Active (reconstructed based on memory)