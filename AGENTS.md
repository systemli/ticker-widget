# AGENTS.md

## Project Overview

Web component (StencilJS) that renders the public timeline of a [systemli/ticker](https://github.com/systemli/ticker)
instance for embedding on third-party websites. Framework-agnostic — compiles to a custom element.
Published to npm as `@systemli/ticker-widget` and consumed via the unpkg CDN.

- **Framework:** StencilJS
- **Language:** TypeScript, JSX (`h()`, `jsxFactory: h`)
- **Testing:** Jest (`.spec.ts`) + Puppeteer (`.e2e.ts`) via `stencil test`
- Node 24 (see `.nvmrc`), npm as package manager (`package-lock.json`)

## Commands

```bash
npm run build        # stencil build --docs — also regenerates the prop tables in README.md
npm start             # stencil build --dev --watch --serve, opens src/index.html
npm test             # stencil test --spec --e2e
npm run test.watch    # stencil test --spec --e2e --watchAll
npm run generate      # stencil generate — scaffold a new component
```

To run a single test file, pass its path to `stencil test`, e.g.
`npx stencil test --spec --e2e src/components/ticker-timeline/ticker-timeline.e2e.ts`.

## Architecture

- **One component:** `ticker-timeline` (`src/components/ticker-timeline/ticker-timeline.tsx`). There is no
  shared state, router, or build-time config beyond `stencil.config.ts`.
- `connectedCallback` fetches `${origin}/api/timeline?limit=${limit}` and renders the returned messages;
  `error`/`items` are `@State`, so a failed fetch or empty response swaps in the corresponding view in `render()`.
- `shadow: false` — the component renders into the light DOM, so `ticker-timeline.css` styles the host page
  directly (no `::part`/`::slotted` boundary to work around).
- `stencil.config.ts` configures multiple output targets from the same source:
  - `dist` + `dist-custom-elements` — the published package (`main`/`module`/`unpkg` in `package.json`).
  - `docs-readme` — regenerates the `## Properties` table in `src/components/ticker-timeline/README.md` from
    the `@Prop()` declarations. Don't hand-edit that table; run `npm run build` instead.
  - `www` — the local dev server (`src/index.html`, opened by `npm start`).
- `docs/` is a separate MkDocs site (`mkdocs.yml`, deployed to GitHub Pages) aimed at embedders, not
  contributors. Its `## Properties` table in `docs/index.md` is hand-maintained and should be kept in sync
  with the component's `@Prop()`s manually — `stencil build --docs` does not touch it.

## API integration

- `origin` is the ticker's own address: scheme + host, no trailing slash, and it must be registered on that
  ticker in the admin interface or the API returns "ticker not found".
- The timeline is fetched from `${origin}/api/timeline`, not a separate API host: each ticker deployment
  proxies `/api/**` to its own `/v1/**` and sets the `Origin` header to that hostname, which is how the API
  resolves which ticker to serve. See <https://systemli.github.io/ticker/installation/>.
- Attachment URLs in the response are host-relative (e.g. `/api/media/<file>`); resolve them against `origin`
  before use (`new URL(attachment.url, this.origin)`), otherwise they resolve against the embedding page.

## CI/CD

GitHub Actions workflows: `integration.yml` (test + build + Dependabot automerge), `mkdocs.yml` (deploy the
docs site), `publish.yml` (npm publish with provenance on GitHub release), `release-drafter.yml` (maintains
the draft release), `release-monthly.yml` (publishes a patch draft monthly).

Deployment, configuration and troubleshooting for the whole ticker stack are documented centrally at
<https://systemli.github.io/ticker/>.

## Commits and Pull Requests

### Commit messages

Start every commit with a [Gitmoji](https://gitmoji.dev/), followed by a space and a short
description in the imperative mood. Use the **Unicode emoji**, not the `:shortcode:` form — both
occur in the history, but new commits should use the emoji.

| Emoji | Use for |
| ----- | ------- |
| ✨ | New feature |
| 🐛 | Bug fix |
| 🩹 | Minor, non-critical fix |
| ♻️ | Refactor |
| ✅ | Add, update or pass tests |
| 🧪 | Add a deliberately failing test |
| 📝 | Documentation |
| ⬆️ | Upgrade dependencies |
| ➖ | Remove a dependency |
| 🔥 | Remove code or files |
| 👷 | CI / build system |
| 🔧 | Configuration files |
| 🚨 | Fix linter or compiler warnings |
| ⚡️ | Performance |
| 🔒️ | Security fix |
| 🗃️ | Database schema or storage changes |
| 🔊 | Logging |
| 💄 | UI and styling |
| 🌐 | Internationalization and localization |

Examples:

```
✨ Add Bluesky reply restrictions
🐛 Fix message ordering on the public timeline
♻️ Extract origin handling into a helper
✅ Cover the upload handler
⬆️ Upgrade dependencies
```

### Pull requests

PR titles follow the same Gitmoji convention as commits.

Every PR must be labeled. `release-drafter` (`.github/release-drafter.yml`) uses the label to
choose both the changelog category and the version bump:

| Label                   | Category       | Version bump |
| ----------------------- | -------------- | ------------ |
| `feature`               | 🚀 Features    | major        |
| `enhancement`           | 🚀 Features    | minor        |
| `fix`, `bugfix`, `bug`  | 🐛 Bug Fixes   | patch        |
| `chore`, `dependencies` | 🧹 Maintenance | patch        |

An unlabeled PR falls back to a patch bump. A release draft is kept up to date on every push to
`main`; drafts that are a pure patch bump are published automatically on the first of each month.
