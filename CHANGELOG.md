# Changelog

All notable changes to **Soup Hat Dynasty** are documented here.

This site is a fork of [League Page](https://github.com/nmelhado/league-page). Version **3.x** is the Soup Hat Dynasty modernization line (branched from upstream **2.5.1**). Upstream template history is preserved below under [League Page (upstream)](#league-page-upstream).

## [3.0.0] - 2026-07-23

Soup Hat Dynasty modernization release. Major version bump marks this fork’s own release line going forward (`3.x.x`).

### Added

- Soup Hat Dynasty branding, homepage copy, and league configuration in `leagueInfo.js`
- Manager profiles for the current league roster, including Rocksteady212
- Standings columns for Points Difference and Max Points For
- Dedicated standings tab / table updates
- Draft preview on the homepage during the offseason
- Mobile nav drawer scrim and backdrop blur
- Rewrote [README.md](./README.md) and [TRAINING_WHEELS.md](./TRAINING_WHEELS.md) for this repo (config depth, local/Vercel workflow, season rollover)

### Changed

- Version line moved to **3.0.0** (independent of upstream League Page `2.x`)
- Updated `leagueID` for the current Sleeper season
- App metadata, footer, and navigation styling (Soup Hat look and feel)
- Major UI overhaul on top of the League Page template
- Power rankings chart color scheme
- Default light/dark presentation for the league theme
- Node/npm engine upgrades and dependency cleanup for Vercel

### Fixed

- League standings calculation and display errors (including week-1 PF/PA defaults)
- Playoff / losers bracket navigation and bracket line rendering
- Theme compile / display errors
- News article fetching / display issues
- Most-traded-players navigation error when leaving the page

---

## League Page (upstream)

Notable changes from the original [nmelhado/league-page](https://github.com/nmelhado/league-page) template. Full historical detail remains in the upstream [CHANGELOG](https://github.com/nmelhado/league-page/blob/master/CHANGELOG.md).

## [2.5.1] - 2025-02-11

### Fixed

- The upcoming drafts weren't showing the traded players. This happened because of a type mismatch (int vs string).

## [2.5.0] - 2025-02-08

### Added

- Adding Vercel analytics! [(issue #327)](https://github.com/nmelhado/league-page/issues/327)
    - Go to [Vercel Analytics](https://vercel.com/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fanalytics&title=Open%20Web%20Analytics) to enable

## [2.4.4] - 2025-02-05

### Fixed

- Fixed full blog post bug [(issue #341)](https://github.com/nmelhado/league-page/issues/341)

## [2.4.3] - 2025-02-01

### Fixed

- Fixed the broken buttons below the bar charts. Now clicking on them will actually change the bar chart.

## [2.4.2] - 2025-01-26

### Fixed

- Fixed bug where league info sub-menu starts opened if you open up on one of those pages

## [2.4.1] - 2025-01-26

### Fixed

- Fixed duplicated playoff stat issue. [(issue #315)](https://github.com/nmelhado/league-page/issues/315)

## [2.4.0] - 2025-01-26

### Fixed

- Updated dependencies, mainly around Svelte
    - Breaking change, so I had to also update some files to get everything working again
    - Some files are still using old Svelte syntax, will update them as I come across them

## [2.3.5] - 2024-04-27

### Fixed

- Resources page wouldn't load. [(issue #296)](https://github.com/nmelhado/league-page/issues/296)
- Sleeper now include median match in standings API, so we ended up double counting. Removed the median match logic [(issue #272)](https://github.com/nmelhado/league-page/issues/272) and [(issue #276)](https://github.com/nmelhado/league-page/issues/276)
- In playoff matches, the bye weeks had a non-valid manager ID which broke due to poor error handling [(issue #289)](https://github.com/nmelhado/league-page/issues/289)
- Vercel was weirdly trying to force node 20 despite the fact that Vercel doesn't support node 20 [(issue #294)](https://github.com/nmelhado/league-page/issues/294)
- gotoManagers wasn't working on the Records page because of a bad year value being passed in. Made gotoManagers more error tolerant and also fixed the bug

## [2.3.4] - 2023-09-13

### Fixed

- Users were unable to add comments. [(issue #268)](https://github.com/nmelhado/league-page/issues/268)

## [2.3.3] - 2023-09-08

### Fixed

- Use most recent user avatar for author and comment image

### Added

- Add positional key to rosters. [(enhancement #261)](https://github.com/nmelhado/league-page/issues/261)
- Also added team logo and removed the large team text to better use the space

## [2.3.2] - 2023-09-07

### Fixed

- Correctly display author and commenter names and images

## [2.3.1] - 2023-09-06

### Fixed

- Darkmode fix for blog post preview

## [2.3.0] - 2023-09-06

### Fixed

- Auction leagues weren't correctly displaying the bid amount. [(issue #254)](https://github.com/nmelhado/league-page/issues/254)

### Changed

- Blogs are now displayed as previews. This improves the UI by avoiding massive walls of text. I've also added dedicated full blog post pages to display the full post and comments. This gives individual blog posts their own links for improved shareability.

## [2.2.8] - 2023-08-21

### Fixed

- Fixed broken fantasypros rankings.

## [2.2.7] - 2023-08-20

### Fixed

- Fixed resources page. [(issue #248)](https://github.com/nmelhado/league-page/issues/248)

## [2.2.0] - 2023-02-19

### Added

- Rivalry page! [(enhancement #200)](https://github.com/nmelhado/league-page/issues/200)

## [2.1.0] - 2022-12-11

### Added

- Manager ID support (preferred over roster ID)

## [2.0.0] - 2022-08-07

### Changed

- Major SvelteKit upgrade and project restructure

For older upstream entries (pre-2.0), see the [League Page CHANGELOG](https://github.com/nmelhado/league-page/blob/master/CHANGELOG.md).

<!-- ### Added -->
<!-- ### Fixed -->
<!-- ### Changed -->
<!-- ### Removed -->
