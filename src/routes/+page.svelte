<script>
	import { onMount } from 'svelte';
	import LinearProgress from '@smui/linear-progress';
	import {
		getNflState,
		leagueName,
		getAwards,
		getLeagueTeamManagers,
		homepageText,
		managers,
		gotoManager,
		enableBlog,
		waitForAll,
		getUpcomingDraft,
		getPreviousDrafts,
		loadPlayers,
	} from '$lib/utils/helper';
	import { Transactions, PowerRankings, HomePost, Drafts } from '$lib/components';
	import {
		getAvatarFromTeamManagers,
		getTeamFromTeamManagers,
	} from '$lib/utils/helperFunctions/universalFunctions';

	let playersData;

	const upcomingDraftData = getUpcomingDraft();
	const previousDraftsData = getPreviousDrafts();
	const nflState = getNflState();
	const podiumsData = getAwards();
	const leagueTeamManagersData = getLeagueTeamManagers();

	onMount(async () => {
		playersData = await loadPlayers(null, true);
	});
</script>

<style>
	.hero {
		position: relative;
		min-height: min(52vh, 520px);
		display: grid;
		align-items: end;
		overflow: hidden;
		isolation: isolate;
	}

	.hero-media {
		position: absolute;
		inset: 0;
		z-index: 0;
		background: var(--ink);
	}

	.hero-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 82% 85%;
		transform: none;
		animation: heroDrift 18s ease-in-out infinite alternate;
	}

	.hero-media::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				105deg,
				rgba(12, 18, 16, 0.88) 0%,
				rgba(12, 18, 16, 0.4) 38%,
				rgba(12, 18, 16, 0.12) 62%,
				rgba(12, 18, 16, 0.28) 100%
			),
			linear-gradient(180deg, rgba(12, 18, 16, 0.2) 0%, transparent 40%, rgba(12, 18, 16, 0.7) 100%);
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		width: min(1100px, calc(100% - 2.5rem));
		margin: 0 auto;
		padding: 3.25rem 0 2.5rem;
		animation: riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.brand {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(2.4rem, 7vw, 4.75rem);
		line-height: 0.92;
		letter-spacing: -0.045em;
		color: var(--chalk);
		margin: 0 0 1rem;
		max-width: 12ch;
	}

	.brand span {
		display: block;
		color: var(--copper-bright);
	}

	.lede {
		max-width: 34rem;
		font-size: clamp(1.05rem, 2.2vw, 1.25rem);
		line-height: 1.55;
		color: var(--mist);
		margin: 0 0 2rem;
	}

	.lede :global(p) {
		margin: 0 0 0.75rem;
	}

	.lede :global(p:last-child) {
		margin-bottom: 0;
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1.75rem;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.85rem 1.35rem;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.02em;
		text-decoration: none;
		border-radius: 2px;
		transition:
			transform 0.2s ease,
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.cta:hover {
		transform: translateY(-2px);
	}

	.cta-primary {
		background: var(--copper);
		color: var(--ink);
	}

	.cta-primary:hover {
		background: var(--copper-bright);
	}

	.cta-ghost {
		background: transparent;
		color: var(--chalk);
		border: 1px solid rgba(232, 228, 217, 0.28);
	}

	.cta-ghost:hover {
		border-color: var(--copper);
		color: var(--copper-bright);
	}

	.season-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mist);
		animation: fadeIn 1.1s ease 0.35s both;
	}

	.season-chip::before {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--copper);
		box-shadow: 0 0 0 3px rgba(196, 132, 60, 0.25);
		animation: pulse 2.4s ease-in-out infinite;
	}

	.below {
		width: min(1400px, calc(100% - 1.5rem));
		margin: 0 auto;
		padding: 2.5rem 0 4rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		align-items: start;
	}

	.draft-wide {
		width: 100%;
		min-width: 0;
		overflow: hidden;
	}

	.draft-wide :global(.draft-card) {
		margin: 0;
		padding: 0;
	}

	.draft-wide :global(.draftBoard) {
		margin: 0.75em 0 0;
		overflow-x: hidden;
	}

	.secondary {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 2rem;
		align-items: start;
	}

	.section-label {
		font-family: var(--font-display);
		font-size: 0.8rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--copper);
		margin: 0 0 1rem;
	}

	.panel {
		background: rgba(26, 36, 32, 0.72);
		border: 1px solid rgba(232, 228, 217, 0.08);
		padding: 1.5rem 1.25rem 1.75rem;
	}

	.center {
		text-align: center;
		color: var(--mist);
	}

	#currentChamp {
		text-align: center;
		padding: 0.5rem 0 0.25rem;
	}

	#champ {
		position: relative;
		width: 150px;
		height: 150px;
		margin: 0.5rem auto 0.75rem;
		cursor: pointer;
		transition: transform 0.25s ease;
	}

	#champ:hover {
		transform: scale(1.04);
	}

	.first {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 80px;
		height: 80px;
		border-radius: 100%;
		border: 2px solid var(--copper);
		left: 50%;
		top: 43%;
	}

	.laurel {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 135px;
		height: auto;
		left: 50%;
		top: 50%;
		filter: sepia(0.35) saturate(1.2);
	}

	h4 {
		text-align: center;
		font-size: 1.35rem;
		margin: 0.25rem 0 0.5rem;
		font-style: normal;
		color: var(--chalk);
	}

	.label {
		display: table;
		text-align: center;
		line-height: 1.15em;
		font-size: 1.35rem;
		margin: 0.35rem auto 0.5rem;
		cursor: pointer;
		color: var(--chalk);
		font-family: var(--font-display);
		font-weight: 700;
	}

	.label:hover {
		color: var(--copper-bright);
	}

	:global(.curOwner) {
		font-size: 0.75em;
		color: var(--mist);
		font-style: italic;
	}

	.transactions {
		display: block;
		width: 100%;
	}

	:global(#home .transactions .waiverTransaction .name),
	:global(#home .transactions .tradeTransaction .name) {
		position: relative;
		color: var(--mist);
	}

	:global(#home .transactions .waiverTransaction .core) {
		display: flex;
		flex-direction: column;
		border-radius: 0 8px 8px 24px;
		border-left: 2px solid var(--copper);
		border-bottom: none;
		background-color: var(--field);
	}

	:global(#home .transactions .waiverTransaction .avatar),
	:global(#home .transactions .tradeTransaction .avatar) {
		border-radius: 50%;
		height: 40px;
		width: 40px;
		border: 2px solid var(--copper);
		background-color: var(--ink);
	}

	:global(#home .transactions .waiverTransaction .avatar) {
		position: absolute;
		left: 0;
		top: 6px;
	}

	:global(#home .transactions .waiverTransaction .ownerName) {
		display: inline-block;
		border-bottom: 2px solid var(--copper);
		margin: 0 0 0 22px;
		padding-right: 30px;
		padding-left: 30px;
	}

	:global(#home .transactions .waiverTransaction .playerName),
	:global(#home .transactions .waiverTransaction .playerInfo),
	:global(#home .transactions .waiverTransaction .date),
	:global(#home .transactions .tradeTransaction .date) {
		color: var(--mist);
	}

	:global(#home .transactions .waiverTransaction .playerName) {
		font-size: 0.8em;
		line-height: 1em;
		text-align: center;
	}

	:global(#home .transactions .waiverTransaction .playerInfo) {
		font-size: 0.6em;
		line-height: 1em;
	}

	:global(#home .transactions .waiverTransaction .date),
	:global(#home .transactions .tradeTransaction .date) {
		font-style: italic;
		font-size: 0.7em;
		text-align: center;
	}

	:global(#home .transactions .waiverTransaction .date) {
		margin-top: 0.7em;
	}

	:global(#home .transactions .tradeTransaction .date) {
		padding: 0.7em 0 1em;
		background-color: var(--field);
		border-radius: 0 0 8px 24px;
		border-left: 2px solid var(--copper);
		border-right: none;
		margin-bottom: 3em;
	}

	:global(#home .transactions .tradeTransaction tbody) {
		background-color: var(--field);
		border: none;
	}

	:global(.transactions table tbody tr:first-child td:first-child) {
		border-top-left-radius: 8px;
		border-left: 2px solid var(--copper);
		border-top: 2px solid var(--copper);
		overflow: hidden;
	}

	:global(.transactions table tbody tr:first-child td:last-child) {
		border-top-right-radius: 8px;
		border-top: 2px solid var(--copper);
		overflow: hidden;
	}

	:global(.transactions table tbody tr:not(:first-child):not(:last-child) td:first-child),
	:global(.transactions table tbody tr:last-child td:first-child) {
		border-left: 2px solid var(--copper);
		overflow: hidden;
	}

	@keyframes heroDrift {
		from {
			transform: scale(1.01) translate3d(0, 0, 0);
		}
		to {
			transform: scale(1.04) translate3d(-0.6%, -0.3%, 0);
		}
	}

	@keyframes riseIn {
		from {
			opacity: 0;
			transform: translateY(28px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 3px rgba(196, 132, 60, 0.2);
		}
		50% {
			box-shadow: 0 0 0 6px rgba(196, 132, 60, 0.08);
		}
	}

	@media (max-width: 900px) {
		.secondary {
			grid-template-columns: 1fr;
		}

		.hero {
			min-height: min(48vh, 440px);
		}

		.hero-media img {
			object-fit: cover;
			object-position: 88% 82%;
			transform: none;
		}

		.hero-content {
			padding: 2.75rem 0 2rem;
		}

		.brand {
			max-width: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-media img,
		.hero-content,
		.season-chip,
		#champ {
			animation: none;
		}
	}
</style>

<div id="home">
	<section class="hero" aria-label="Soup Hat Dynasty">
		<div class="hero-media" aria-hidden="true">
			<img src="/hero.jpg" alt="" />
		</div>
		<div class="hero-content">
			<h1 class="brand">
				{#if leagueName.includes(' ')}
					{leagueName.split(' ').slice(0, -1).join(' ')}
					<span>{leagueName.split(' ').slice(-1)[0]}</span>
				{:else}
					{leagueName}
				{/if}
			</h1>
			<div class="lede">
				{@html homepageText}
			</div>
			<div class="cta-row">
				{#await waitForAll(nflState, upcomingDraftData)}
					<a class="cta cta-primary" href="/standings">View standings</a>
					<a class="cta cta-ghost" href="/matchups">This week's matchups</a>
				{:then [nflStateData, draftData]}
					{#if nflStateData.season_type == 'pre' || nflStateData.season_type == 'off'}
						{#if draftData.draftComplete}
							<a class="cta cta-primary" href="/standings">View All-Time Standings</a>
						{:else}
							<a class="cta cta-primary" href="/drafts">View draft board</a>
						{/if}
						<a class="cta cta-ghost" href="/managers">Meet the managers</a>
					{:else}
						<a class="cta cta-primary" href="/standings">View standings</a>
						<a class="cta cta-ghost" href="/matchups">This week's matchups</a>
					{/if}
				{:catch}
					<a class="cta cta-primary" href="/standings">View standings</a>
					<a class="cta cta-ghost" href="/matchups">This week's matchups</a>
				{/await}
			</div>
			{#await nflState}
				<div class="season-chip">Loading season…</div>
			{:then nflStateData}
				<div class="season-chip">
					NFL {nflStateData.season}
					{#if nflStateData.season_type == 'pre'}
						· Preseason
					{:else if nflStateData.season_type == 'post'}
						· Postseason
					{:else}
						· {nflStateData.week > 0 ? `Week ${nflStateData.week}` : 'Preseason'}
					{/if}
				</div>
			{:catch}
				<div class="season-chip">Season status unavailable</div>
			{/await}
		</div>
	</section>

	{#await nflState}
		<div class="below">
			<div class="panel">
				<div class="center">Retrieving NFL state…</div>
				<LinearProgress indeterminate />
			</div>
		</div>
	{:then nflStateData}
		<div class="below">
			{#if enableBlog}
				<div class="panel">
					<p class="section-label">From the clubhouse</p>
					<HomePost />
				</div>
			{/if}

			<div class="panel draft-wide">
				<p class="section-label">Draft board</p>
				<Drafts
					{upcomingDraftData}
					{previousDraftsData}
					{leagueTeamManagersData}
					{playersData}
					false
				/>
			</div>

			{#if nflStateData.season_type != 'pre' && nflStateData.season_type != 'off'}
				<div class="panel">
					<p class="section-label">Power rankings</p>
					<PowerRankings />
				</div>
			{/if}

			<div class="secondary">
				<div class="panel">
					<p class="section-label">Reigning champ</p>
					<div id="currentChamp">
						{#await waitForAll(podiumsData, leagueTeamManagersData)}
							<p class="center">Retrieving awards…</p>
							<LinearProgress indeterminate />
						{:then [podiums, leagueTeamManagers]}
							{#if podiums[0]}
								<h4>{podiums[0].year} Fantasy Champ</h4>
								<div
									id="champ"
									role="button"
									tabindex="0"
									onclick={() => {
										if (managers.length)
											gotoManager({
												year: podiums[0].year,
												leagueTeamManagers,
												rosterID: parseInt(podiums[0].champion),
											});
									}}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											if (managers.length)
												gotoManager({
													year: podiums[0].year,
													leagueTeamManagers,
													rosterID: parseInt(podiums[0].champion),
												});
										}
									}}
								>
									<img
										src="{getAvatarFromTeamManagers(
											leagueTeamManagers,
											podiums[0].champion,
											podiums[0].year
										)}"
										class="first"
										alt="champion"
									/>
									<img src="./laurel.png" class="laurel" alt="" />
								</div>
								<span
									class="label"
									role="button"
									tabindex="0"
									onclick={() =>
										gotoManager({
											year: podiums[0].year,
											leagueTeamManagers,
											rosterID: parseInt(podiums[0].champion),
										})}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ')
											gotoManager({
												year: podiums[0].year,
												leagueTeamManagers,
												rosterID: parseInt(podiums[0].champion),
											});
									}}
								>
									{getTeamFromTeamManagers(
										leagueTeamManagers,
										podiums[0].champion,
										podiums[0].year
									).name}
								</span>
							{:else}
								<p class="center">No former champs yet — history starts here.</p>
							{/if}
						{:catch error}
							<p class="center">Something went wrong: {error.message}</p>
						{/await}
					</div>
				</div>

				<div class="panel transactions">
					<p class="section-label">Recent moves</p>
					<Transactions />
				</div>
			</div>
		</div>
	{:catch error}
		<div class="below">
			<div class="panel center">Something went wrong: {error.message}</div>
		</div>
	{/await}
</div>
