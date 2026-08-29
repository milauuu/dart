# Dart

A mobile-first dart scoring app for personal use. Single-page Vue application, client-only, no backend.

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Utilities:** VueUse
- **Linting:** ESLint (antfu config)
- **Styling:** Inline styles
- **Deployment:** Docker Compose + Caddy on Hetzner

## Getting Started

No `.env` file is required — the app is client-only with no backend and no environment-variable usage.

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs `vite dev --host`, exposing the dev server on the LAN.

Build for production:

```bash
pnpm build
```

`pnpm build` runs `vite build`, emitting output to `dist/` (see `vite.config.ts`).

## Deployment

The app is deployed to `dart.fute.dev` via Docker Compose and Caddy (automatic HTTPS).

- `Dockerfile` — multi-stage build: a `node:22-alpine` stage runs `pnpm install --frozen-lockfile` and `pnpm run build`, then the `dist/` output is copied into a `caddy:2-alpine` stage that serves it.
- `Caddyfile` — serves the built app as static files from `/srv` for the `dart.fute.dev` host.
- `docker-compose.yml` — builds the image from the local `Dockerfile` and runs it, publishing ports 80/443 (TCP) and 443/udp, with a `caddy_data` volume for Caddy's TLS state.

Deployment is manual: `docker compose up` (with `--build` to pick up code changes) run directly on the Hetzner host, over SSH. No deployment script (e.g. `deploy.sh`) or CI pipeline exists in the repo.

See Notes & Conventions below for the current status of this decision.

## Architecture Decisions

### [ADR-0001: State Management via `provide`/`inject`](./adr/0001-state-management-provide-inject.md)

Shared state (`matches`, `activeMatch`) is provided once in `App.vue` and injected directly by descendants that need it, avoiding relaying state through components that don't use it themselves. Components that only need derived values (e.g. `MatchFinishModal`) receive them as props instead of injecting.

### [ADR-0002: Persistence via `useLocalStorage`](./adr/0002-persistence-via-uselocalstorage.md)

Match and player data persist via VueUse's `useLocalStorage` instead of a backend or IndexedDB — its synchronous API matches the codebase's existing synchronous, `ref`-based access pattern, requiring no restructuring.

### [ADR-0003: Navigation via Reactive Ref (No Router)](./adr/0003-navigation-via-reactive-ref-no-router.md)

Navigation between `Home` and `MatchView` is handled by a single reactive `ref<Match | undefined>` with conditional rendering, instead of `vue-router` — the app's navigation need is a two-branch, mutually-exclusive view switch, not a set of independently addressable, URL-based destinations.

## Notes & Conventions

### Framework & Language

**Vue 3 over React.** Preference decision with no project-specific blast radius — either framework would have met the app's requirements equally well.

### Tooling

**ESLint via antfu's config.** Adopted as the base ESLint configuration instead of assembling a custom rule set. A tooling convention with no effect on architecture or runtime behavior.

**No Tailwind.** Inline styles are used instead of a utility CSS framework. The styling decision itself is a separate, ongoing consideration — this entry only notes that Tailwind was not evaluated as part of it, since the two are independent choices.

### State Management

**Direct mutation of the SSOT, no Actions/Reducer pattern.** State transport (`provide`/`inject`, see ADR-0001) and mutation control are independent concerns. The value of an Actions/Reducer layer scales with team size, not codebase complexity — as a single developer, the added indirection wasn't justified. **Reevaluation trigger:** revisit if the team grows beyond one developer.

### Deployment

**Docker Compose + Caddy on Hetzner.** Adopted without evaluating alternatives. Docker's flexibility made it a safe default choice regardless of that gap — it avoids locking the deployment into assumptions that later turn out to be wrong. Not yet ADR-worthy — this becomes an ADR once a dedicated deployment/hosting session has been completed and the decision has been actively reevaluated rather than merely carried forward.

---

*ADR and README-convention status current as of the latest documentation pass. Where an ADR is marked "reconstructed based on memory," its rationale was rebuilt after the original decision context was lost and should be read with that caveat.*
