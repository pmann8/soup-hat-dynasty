# Training Wheels — Soup Hat Dynasty

Step-by-step guide for editing this league site. Keep it open while you make changes.

**Live site:** [soup-hat-dynasty.vercel.app](https://soup-hat-dynasty.vercel.app/)  
**Repo:** [pmann8/soup-hat-dynasty](https://github.com/pmann8/soup-hat-dynasty)  
**Reference:** [README.md](./README.md) (full config tables)

This project is already forked from [League Page](https://github.com/nmelhado/league-page) and deployed on Vercel. You do **not** need to fork or create a new Vercel project.

---

## I. How changes get to the live site

1. Edit files in this repo (locally or on GitHub).
2. Commit and push to the branch Vercel deploys (usually `main` or `souphat`).
3. Wait for the Vercel build to finish, then refresh the live site.

For local preview before pushing:

```bash
npm install
npm run dev
```

Requires Node `>=20`. Details in the [README](./README.md#local-development).

---

## II. League settings

Open [`src/lib/utils/leagueInfo.js`](./src/lib/utils/leagueInfo.js).

### Core fields (top of the file)

| Field | What to set |
| --- | --- |
| `leagueID` | Current Sleeper league ID. [How to find it](https://support.sleeper.app/en/articles/4121798-how-do-i-find-my-league-id). |
| `leagueName` | `"Soup Hat Dynasty"` (or whatever you want shown in titles). |
| `dues` | League dues in dollars (used by the constitution page). |
| `dynasty` | Keep `true` for this dynasty league. |
| `enableBlog` | `true` only after Contentful is set up (see [§ V](#v-add-a-blog)). |
| `enableEditor` | `true` to show the manager editor UI on manager pages. |

### New season rollover

When Sleeper creates a new season league:

1. Copy the new league ID from Sleeper.
2. Update `leagueID` in `leagueInfo.js`.
3. Commit, push, and wait for deploy.

Past seasons stay available through Sleeper’s `previous_league_id` chain — you only need the **current** ID.

---

## III. Homepage text

Still in [`src/lib/utils/leagueInfo.js`](./src/lib/utils/leagueInfo.js), find `homepageText`.

- Each `<p>...</p>` becomes one paragraph on the home page.
- Add paragraphs by copying a `<p>` line; remove paragraphs by deleting a line.
- Use plain HTML only (no Markdown).

Example:

```js
export const homepageText = `
	<p>Ten managers. One absurd crest. Endless roster obsession.</p>
	<p>This is the clubhouse for Soup Hat Dynasty.</p>
`;
```

Commit, push, wait for Vercel, then refresh the live site.

---

## IV. Managers

Managers are the `managers` array in [`src/lib/utils/leagueInfo.js`](./src/lib/utils/leagueInfo.js). One object per manager.

### Finding a manager’s Sleeper ID

Open (replace with the current league ID if it changed):

`https://api.sleeper.app/v1/league/1319070237999534080/users`

Find the manager’s `user_id` and use it as `managerID` (in quotes):

```js
"managerID": "474795970639425536",
```

`roster` and `tookOver` are deprecated if you provide `managerID`. You can leave them or set `tookOver` to `null`.

### Field checklist

| Field | Notes |
| --- | --- |
| `managerID` | Required. Sleeper user ID (see above). |
| `name` | Display name. |
| `bio` | Short bio; placeholder is fine until you have real copy. |
| `photo` | Path like `"/managers/der32.jpg"` — must match a file under `static/managers/`. Square, ≤500×500 recommended. |
| `location` | Optional city / region. |
| `fantasyStart` | Optional year they started fantasy. |
| `favoriteTeam` | Lowercase NFL abbrev: `"buf"`, `"nyg"`, `"phi"`, etc. |
| `mode` | `"Win Now"`, `"Dynasty"`, or `"Rebuild"`. |
| `rival` | Nested `{ name, link, image }` — see below. |
| `favoritePlayer` | Sleeper player ID (see below). |
| `valuePosition` | `"QB"`, `"WR"`, `"RB"`, `"TE"`, etc. |
| `rookieOrVets` | `"Rookies"` or `"Vets"` (note the spelling: `rookieOrVets`). |
| `philosophy` | Team-building blurb. |
| `tradingScale` | Number `1`–`10`. |
| `preferredContact` | `"Text"`, `"WhatsApp"`, `"Sleeper"`, `"Email"`, `"Phone"`, `"Discord"`, or `"Carrier Pigeon"`. |

Leave the commented “source of truth” manager object at the **bottom** of `leagueInfo.js` alone — it helps with future upstream merges.

### Rival object

```js
"rival": {
  name: "pmann8",   // display name (or "Everyone", "Nobody", etc.)
  link: 9,          // 0-based index of that manager in the managers array
  image: "/managers/rival.jpg",
},
```

- First manager in the array → `link: 0`
- Second → `link: 1`
- Rival is everyone / nobody → `link: null`
- Rival is themselves → use their own index

### Favorite player ID

1. Open [https://api.sleeper.app/v1/players/nfl](https://api.sleeper.app/v1/players/nfl) (large JSON file).
2. Search (`Ctrl`/`⌘` + `F`) for the player name.
3. Copy their `player_id` number into `favoritePlayer` (e.g. `4984`).

### Uploading manager photos

1. Go to [`static/managers/`](./static/managers/) in the repo.
2. Upload the image (GitHub: **Add file → Upload files**, or commit locally).
3. Set `photo` to `"/managers/<exact-filename>"` — case-sensitive.

### After editing managers

Commit, push, wait for deploy, then open **League Info → Managers** on the live site.

---

## V. Add a blog

Blog support is optional and currently off (`enableBlog = false`). It uses [Contentful](https://contentful.com/).

### 1. Contentful setup

1. [Create a free Contentful account](https://www.contentful.com/sign-up/).
2. Under **Content model**, create:
   - **Blog Post** with id `blog_post`
   - **Blog Comment** with id `blog_comment`
3. Match the field specs from the upstream screenshots:
   - [Blog post model](https://storage.googleapis.com/nfl-player-data/contentModel.jpg)
   - [Blog comment model](https://storage.googleapis.com/nfl-player-data/commentModel.jpg)
4. When writing posts, set **author** to the author’s **Sleeper username**.

### 2. API keys

Copy these from Contentful:

| What | Where in Contentful |
| --- | --- |
| Space ID | Space settings |
| Content Management API token | API keys → personal / management token |
| Content Delivery API token | API keys → Content delivery / preview |

### 3. Environment variables

In [Vercel project settings → Environment Variables](https://vercel.com/pmann8/soup-hat-dynasty/settings/environment-variables) (and in a local `.env` for `npm run dev`):

| Name | Value |
| --- | --- |
| `VITE_CONTENTFUL_SPACE` | Space ID |
| `VITE_CONTENTFUL_ACCESS_TOKEN` | Management API token |
| `VITE_CONTENTFUL_CLIENT_ACCESS_TOKEN` | Delivery API token |

Redeploy after adding env vars.

### 4. Turn the blog on in code

1. In `leagueInfo.js`, set `enableBlog` to `true`.
2. In [`src/lib/utils/tabs.js`](./src/lib/utils/tabs.js), uncomment the Blog tab.
3. Commit and push.

---

## VI. Navigation, constitution, and branding

### Navigation

[`src/lib/utils/tabs.js`](./src/lib/utils/tabs.js) controls the top nav and mobile drawer.

- Comment out a tab to hide it.
- Blog and Constitution are commented out by default in this repo.
- “Go to Sleeper” uses `leagueID` automatically.

### Constitution

Edit [`src/routes/constitution/+page.svelte`](./src/routes/constitution/+page.svelte).

- Mostly HTML — same idea as homepage text.
- `{dues}` pulls from `leagueInfo.js` for dues / payout amounts.
- Uncomment the Constitution item in `tabs.js` to link it in the nav.

### Branding

| Asset | Path |
| --- | --- |
| League badge / logo | [`static/badge.png`](./static/badge.png) (ideally ~120×120 PNG) |
| Hero image | [`static/hero.jpg`](./static/hero.jpg) |
| App name / theme color | [`src/app.html`](./src/app.html), [`static/manifest.json`](./static/manifest.json) |
| Favicons / PWA | [`static/favicons/`](./static/favicons/), [`static/pwa/`](./static/pwa/) |

### Analytics

Optional: enable [Vercel Analytics](https://vercel.com/pmann8/soup-hat-dynasty/analytics). Tracking starts after the next deploy.

---

## VII. Pulling upstream League Page updates

This site is based on [nmelhado/league-page](https://github.com/nmelhado/league-page). Upstream sometimes ships bugfixes and features.

1. On GitHub, use **Sync fork** / fetch upstream if available, or merge from `nmelhado/league-page`.
2. Check the upstream [CHANGELOG](https://github.com/nmelhado/league-page/blob/master/CHANGELOG.md).
3. Resolve conflicts carefully in:
   - `src/lib/utils/leagueInfo.js` (keep Soup Hat managers / IDs / homepage text)
   - `src/lib/utils/tabs.js`
   - `src/routes/constitution/+page.svelte`
   - Branding / theme files
4. `package-lock.json` conflicts: prefer the incoming lockfile when unsure, then run `npm install` locally and commit.

---

## VIII. Troubleshooting

| Problem | What to check |
| --- | --- |
| Site shows old league data | Is `leagueID` the **current** season ID? |
| Manager missing / wrong team | Does `managerID` match that user in the Sleeper users API? |
| Broken manager photo | Does `photo` match the filename under `static/managers/` (case-sensitive)? |
| Blog 404 / empty | `enableBlog`, Contentful models, and all three `VITE_CONTENTFUL_*` env vars? |
| Nav link missing | Is the tab commented out in `tabs.js`? |
| Local build fails | Node `>=20`? Run `npm install` then `npm run dev`. |

**Bugs / feature ideas for the template itself:** open an issue on the [original League Page repo](https://github.com/nmelhado/league-page/issues).

**Soup Hat–specific changes:** open a PR or issue on [pmann8/soup-hat-dynasty](https://github.com/pmann8/soup-hat-dynasty).
