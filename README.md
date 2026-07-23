# Soup Hat Dynasty

Custom league site for the **Soup Hat Dynasty** Sleeper fantasy football league.

**Live site:** [soup-hat-dynasty.vercel.app](https://soup-hat-dynasty.vercel.app/)

Built on the [League Page](https://github.com/nmelhado/league-page) template (SvelteKit + Sleeper API). Current release: **3.0.0**.

## Versioning

`package.json` is the single source of truth. `src/lib/version.js` reads from it automatically.

### Automatic (preferred) — release-please

Releases are managed by [release-please](https://github.com/googleapis/release-please) on pushes to `master` or `souphat`.

1. Commit with [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` → minor (e.g. 3.0.0 → 3.1.0)
   - `fix:` → patch (e.g. 3.0.0 → 3.0.1)
   - `feat!:` / `BREAKING CHANGE:` → major (e.g. 3.0.0 → 4.0.0)
2. Push to `souphat` or `master`.
3. release-please opens/updates a **Release PR** that bumps `package.json`, updates `CHANGELOG.md`, and refreshes `.release-please-manifest.json`.
4. Merge that Release PR → GitHub Release + `vX.Y.Z` tag are created.

Config: [`release-please-config.json`](./release-please-config.json), [`.release-please-manifest.json`](./.release-please-manifest.json), workflow: [`.github/workflows/release-please.yml`](./.github/workflows/release-please.yml).

### Manual fallback

```bash
npm run release:patch   # 3.0.0 → 3.0.1
npm run release:minor   # 3.0.0 → 3.1.0
npm run release:major   # 3.0.0 → 4.0.0
git push --follow-tags
```

If you bump manually, also update `.release-please-manifest.json` so release-please stays in sync.

## Features

- Live standings, matchups, and power rankings
- Trade and waiver history
- Records, awards, and draft history
- Manager pages and league constitution
- Desktop, mobile, and PWA support

## Stack

- [Svelte](https://svelte.dev/) / [SvelteKit](https://kit.svelte.dev/)
- [Sleeper API](https://docs.sleeper.app/)
- Deployed on [Vercel](https://vercel.com/pmann8/soup-hat-dynasty)

## Configuration

Most league-specific settings live in [`src/lib/utils/leagueInfo.js`](./src/lib/utils/leagueInfo.js). Navigation is in [`src/lib/utils/tabs.js`](./src/lib/utils/tabs.js). Constitution copy is in [`src/routes/constitution/+page.svelte`](./src/routes/constitution/+page.svelte).

### League settings (`leagueInfo.js`)

| Export | Purpose |
| --- | --- |
| `leagueID` | Sleeper league ID. All standings, matchups, rosters, drafts, and transactions are fetched from this ID (and prior seasons via `previous_league_id`). [How to find it](https://support.sleeper.app/en/articles/4121798-how-do-i-find-my-league-id). |
| `leagueName` | Display name used in titles, nav, and metadata. |
| `dues` | Dollar amount used by the constitution page for dues / payout math. |
| `dynasty` | `true` for dynasty leagues; `false` for redraft / keeper. Affects dynasty-oriented UI. |
| `enableBlog` | `true` to turn on Contentful-backed blog routes. Requires the env vars below. |
| `enableEditor` | `true` to show the manager editor UI on individual manager pages. |
| `homepageText` | HTML string rendered on the home page intro (use `<p>` tags). |
| `managers` | Array of manager profile objects (see below). |

When the Sleeper league rolls to a new season, update `leagueID` to the new season’s ID so current data stays correct. Historical seasons are walked automatically through Sleeper’s previous-league chain.

### Managers

Each entry in `managers` should map to a Sleeper user. Preferred identity field is `managerID` (look it up at `https://api.sleeper.app/v1/league/<leagueID>/users`). Keep one object per manager; omit optional fields with `null` or by deleting the line.

| Field | Required | Notes |
| --- | --- | --- |
| `managerID` | Yes | Sleeper user ID. Prefer this over `roster`. |
| `name` | Yes | Display name on manager pages. |
| `photo` | Yes | Path under `/static`, e.g. `/managers/der32.jpg`. Square, ≤500×500 recommended. |
| `bio` | Yes | Short bio shown on the manager page. |
| `roster` | Deprecated | Old roster index; leave if present, but do not rely on it for new managers. |
| `tookOver` | Deprecated / optional | Year a manager took over a franchise. |
| `location` | Optional | City / region. |
| `fantasyStart` | Optional | Year they started playing fantasy. |
| `favoriteTeam` | Optional | NFL team abbrev, **lowercase** (`buf`, `nyg`, `phi`, …). |
| `mode` | Optional | `Win Now`, `Dynasty`, or `Rebuild`. Custom values need a matching PNG in `/static/`. |
| `rival` | Optional | `{ name, link, image }`. `link` is the rival’s **0-based index** in the `managers` array, or `null` to link to `/managers`. |
| `favoritePlayer` | Optional | Sleeper player ID ([players API](https://api.sleeper.app/v1/players/nfl)). |
| `valuePosition` | Optional | Position they value most (`QB`, `WR`, `RB`, `TE`, …). |
| `rookieOrVets` | Optional | `Rookies` or `Vets` (custom values need a matching PNG in `/static/`). |
| `philosophy` | Optional | Team-building philosophy blurb. |
| `tradingScale` | Optional | Integer 1–10. |
| `preferredContact` | Optional | One of: `Text`, `WhatsApp`, `Sleeper`, `Email`, `Phone`, `Discord`, `Carrier Pigeon`. |

Photos go in [`static/managers/`](./static/managers/) and must match the `photo` path exactly. There is a commented “source of truth” manager object at the bottom of `leagueInfo.js` — leave it commented so upstream field changes are easier to merge.

### Navigation (`tabs.js`)

[`src/lib/utils/tabs.js`](./src/lib/utils/tabs.js) controls the top nav / drawer. Comment or uncomment entries to hide pages (Blog and Constitution are currently commented out). The “Go to Sleeper” link uses `leagueID` from `leagueInfo.js`.

### Constitution

Edit copy in [`src/routes/constitution/+page.svelte`](./src/routes/constitution/+page.svelte). The page interpolates `dues` from league config for dues and payout amounts. Re-enable the Constitution nav item in `tabs.js` when you want it linked.

### Blog (optional)

1. Create a free [Contentful](https://contentful.com/) space.
2. Add content models `blog_post` and `blog_comment` (see [TRAINING_WHEELS.md](./TRAINING_WHEELS.md#v-add-a-blog) for field specs).
3. Create Management and Delivery API keys.
4. Set env vars locally in `.env` and in Vercel project settings:
   - `VITE_CONTENTFUL_ACCESS_TOKEN` — Content Management API token
   - `VITE_CONTENTFUL_SPACE` — Space ID
   - `VITE_CONTENTFUL_CLIENT_ACCESS_TOKEN` — Content Delivery API token
5. Set `enableBlog` to `true` in `leagueInfo.js` and uncomment the Blog tab in `tabs.js`.
6. Use each author’s Sleeper username in the Contentful `author` field when creating posts.

### Theme / branding

- App name and theme colors: [`src/app.html`](./src/app.html), [`static/manifest.json`](./static/manifest.json)
- Favicons / PWA assets: [`static/favicons/`](./static/favicons/), [`static/pwa/`](./static/pwa/)
- Hero / badge art: [`static/hero.jpg`](./static/hero.jpg), [`static/badge.png`](./static/badge.png)
- SMUI theme source: [`src/theme/`](./src/theme/) (compiled via `npm run smui-theme-dark`)

## Local development

Requires Node `>=20` and npm `>=6`.

```bash
npm install
npm run dev
```

To test on other devices on your network:

```bash
npm run dev -- --host
```

Docker:

```bash
npm run docker-run
```

## Deploy

Push to GitHub; Vercel builds and deploys automatically when linked to this repo. Add any Contentful env vars in the Vercel project settings if the blog is enabled.

### Skip builds for docs-only commits

Use Vercel’s **Ignored Build Step** so pushes that only change Markdown / meta files do not redeploy:

1. Open [Project → Settings → Build and Deployment](https://vercel.com/pmann8/soup-hat-dynasty/settings/deployment)
2. Under **Ignored Build Step**, choose **Custom** (or “Run my Bash script”)
3. Set the command to:

```bash
bash scripts/vercel-ignore-build.sh
```

Exit codes: `0` = skip build, `1` = build. The script ignores changes limited to `*.md` / `*.mdx` / `*.txt`, `.github/`, `LICENSE`, and a few editor config files. Edit [`scripts/vercel-ignore-build.sh`](./scripts/vercel-ignore-build.sh) to adjust that list.

## Credits

Forked from [nmelhado/league-page](https://github.com/nmelhado/league-page). Upstream setup docs: [TRAINING_WHEELS.md](./TRAINING_WHEELS.md).
