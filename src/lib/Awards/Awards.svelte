<script>
	import { gotoManager } from '$lib/utils/helper';
	import {
		getAvatarFromTeamManagers,
		getNestedTeamNamesFromTeamManagers,
	} from '$lib/utils/helperFunctions/universalFunctions';
	export let podium, leagueTeamManagers;

	const { year, champion, second, third, divisions, toilet } = podium;
</script>

<style>
	.awards {
		display: block;
		position: relative;
		width: 100%;
		z-index: 1;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid rgba(232, 228, 217, 0.08);
		margin-bottom: 1.25rem;
	}

	.awards:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	h3 {
		margin: 0 0 0.75rem;
		text-align: center;
		color: var(--chalk);
		font-family: var(--font-display);
		font-weight: 800;
		letter-spacing: -0.02em;
		font-size: 1.35rem;
	}

	.banner {
		display: block;
		width: 55%;
		max-width: 360px;
		margin: 0 auto 0.5rem;
	}

	#podium {
		width: min(100%, 560px);
		aspect-ratio: 600 / 500;
		height: auto;
		position: relative;
		margin: 0 auto 1rem;
		overflow: visible;
	}

	.podiumImage {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: auto;
		z-index: 1;
		pointer-events: none;
	}

	.place {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		width: 30%;
		z-index: 2;
		transform: translate(-50%, 0);
		overflow: visible;
	}

	.place.first {
		left: 50%;
		bottom: 54%;
		width: 34%;
		z-index: 3;
	}

	.place.second {
		left: 21%;
		bottom: 42%;
	}

	.place.third {
		left: 79%;
		bottom: 38%;
	}

	.avatar-wrap {
		position: relative;
		width: 68%;
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		flex-shrink: 0;
		overflow: visible;
	}

	.place.first .avatar-wrap {
		/* Wrap sized to the wreath; avatar sits smaller in the center */
		width: 100%;
	}

	.champ {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 100%;
		border: 1px solid var(--copper);
		background-color: var(--panel);
		display: block;
		position: relative;
		z-index: 1;
	}

	.place.first .champ {
		width: 65%;
		height: 65%;
		grid-area: 1 / 1;
	}

	.laurel {
		grid-area: 1 / 1;
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
		z-index: 2;
	}

	.label {
		white-space: normal;
		line-height: 1.15;
		text-align: center;
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0.3rem 0.45rem;
		background-color: var(--panel);
		border: 1px solid rgba(196, 132, 60, 0.35);
		border-radius: 2px;
		color: var(--chalk);
		font-size: 0.78rem;
		font-family: var(--font-body);
		width: max-content;
		max-width: 9.5rem;
		overflow: visible;
		z-index: 4;
	}

	.divisions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem 1.5rem;
		margin: 0.25rem 0 0.5rem;
	}

	.division {
		text-align: center;
		min-width: 7.5rem;
	}

	.division h6 {
		margin: 0 0 0.4rem;
		color: var(--copper);
		font-family: var(--font-display);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 700;
	}

	.leaderBlock {
		position: relative;
		width: 72px;
		height: 108px;
		margin: 0 auto 0.35rem;
	}

	.divisionLeader {
		position: absolute;
		width: 64px;
		height: 64px;
		transform: translate(-50%, 0%);
		top: 0;
		left: 50%;
		border-radius: 100%;
		border: 1px solid var(--copper);
		background-color: var(--panel);
		object-fit: cover;
		z-index: 3;
	}

	.medal {
		position: absolute;
		width: 36px;
		height: auto;
		transform: translate(-50%, 0%);
		bottom: 0;
		left: 50%;
		z-index: 2;
	}

	.genLabel {
		white-space: nowrap;
		line-height: 1.15;
		min-height: 0;
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		margin: 0 auto;
		padding: 0.35rem 0.5rem;
		background-color: var(--panel);
		border: 1px solid rgba(196, 132, 60, 0.35);
		border-radius: 2px;
		color: var(--chalk);
		font-size: 0.85rem;
		font-family: var(--font-body);
	}

	.toiletParent {
		width: 100%;
		text-align: center;
		padding: 0.75rem 0 0.25rem;
		margin-top: 0.75rem;
		border-top: 1px solid rgba(232, 228, 217, 0.08);
	}

	.toilet-banner {
		display: block;
		width: 45%;
		max-width: 280px;
		margin: 0 auto 0.35rem;
	}

	.toiletBowl {
		position: relative;
		width: 180px;
		height: 160px;
		margin: 0.25rem auto 0.35rem;
	}

	.toiletWinner {
		position: absolute;
		width: 56px;
		height: 56px;
		transform: translate(-50%, 0%);
		top: 16px;
		left: 55%;
		border-radius: 100%;
		border: 1px solid var(--copper);
		object-fit: cover;
		z-index: 3;
		background: var(--panel);
	}

	.toilet {
		position: absolute;
		width: 100%;
		height: auto;
		transform: translate(-50%, 0%);
		bottom: 0;
		left: 50%;
		z-index: 1;
		pointer-events: none;
	}

	.clickable {
		cursor: pointer;
	}

	:global(.curOwner) {
		font-size: 0.75em;
		color: var(--mist);
		font-style: italic;
	}

	@media (max-width: 610px) {
		.banner {
			width: 70%;
		}

		.place.first {
			bottom: 52%;
		}

		.place.second {
			bottom: 40%;
		}

		.place.third {
			bottom: 36%;
		}

		.label,
		.genLabel {
			font-size: 0.72rem;
			padding: 0.28rem 0.4rem;
			max-width: 8rem;
		}
	}

	@media (max-width: 480px) {
		.label,
		.genLabel {
			font-size: 0.65rem;
			padding: 0.22rem 0.32rem;
			max-width: 7rem;
		}

		.place {
			width: 32%;
		}

		.place.first {
			bottom: 50%;
		}

		.place.second {
			bottom: 38%;
		}

		.place.third {
			bottom: 34%;
		}

		.toiletBowl {
			width: 150px;
			height: 135px;
		}

		.toiletWinner {
			width: 48px;
			height: 48px;
		}
	}
</style>

<div class="awards">
	<h3>{year} Awards</h3>

	<img src="./banner.png" class="banner" alt="The Champion's Cup" />

	<div id="podium">
		<img src="./podium.png" class="podiumImage" alt="podium" />

		<div class="place second">
			<div class="avatar-wrap">
				<img
					src="{getAvatarFromTeamManagers(leagueTeamManagers, second, year)}"
					class="champ clickable"
					onclick={() => gotoManager({ year, leagueTeamManagers, rosterID: second })}
					alt="2nd"
				/>
			</div>
			<span
				class="label clickable"
				onclick={() => gotoManager({ year, leagueTeamManagers, rosterID: second })}
				>{@html getNestedTeamNamesFromTeamManagers(leagueTeamManagers, year, second)}</span
			>
		</div>

		<div class="place third">
			<div class="avatar-wrap">
				<img
					src="{getAvatarFromTeamManagers(leagueTeamManagers, third, year)}"
					class="champ clickable"
					onclick={() => gotoManager({ year, leagueTeamManagers, rosterID: third })}
					alt="3rd"
				/>
			</div>
			<span
				class="label clickable"
				onclick={() => gotoManager({ year, leagueTeamManagers, rosterID: third })}
				>{@html getNestedTeamNamesFromTeamManagers(leagueTeamManagers, year, third)}</span
			>
		</div>

		<div class="place first">
			<div class="avatar-wrap">
				<img
					src="{getAvatarFromTeamManagers(leagueTeamManagers, champion, year)}"
					class="champ clickable"
					onclick={() => gotoManager({ year, leagueTeamManagers, rosterID: champion })}
					alt="champion"
				/>
				<img src="./laurel.png" class="laurel" alt="" />
			</div>
			<span
				class="label clickable"
				onclick={() => gotoManager({ year, leagueTeamManagers, rosterID: champion })}
				>{@html getNestedTeamNamesFromTeamManagers(leagueTeamManagers, year, champion)}</span
			>
		</div>
	</div>

	{#if divisions?.some((d) => d.rosterID)}
		<div class="divisions">
			{#each divisions as division}
				{#if division.rosterID}
					<div class="division">
						{#if division.name}
							<h6>{division.name} Division</h6>
						{:else}
							<h6>Regular Season Champion</h6>
						{/if}
						<div class="leaderBlock">
							<img
								src="{getAvatarFromTeamManagers(leagueTeamManagers, division.rosterID, year)}"
								class="divisionLeader clickable"
								onclick={() =>
									gotoManager({ year, leagueTeamManagers, rosterID: division.rosterID })}
								alt="{division.name} champion"
							/>
							<img src="./medal.png" class="medal" alt="" />
						</div>
						<span
							class="genLabel clickable"
							onclick={() =>
								gotoManager({ year, leagueTeamManagers, rosterID: division.rosterID })}
							>{@html getNestedTeamNamesFromTeamManagers(
								leagueTeamManagers,
								year,
								division.rosterID
							)}</span
						>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	{#if toilet}
		<div class="toiletParent">
			<img src="./toilet-banner.png" class="toilet-banner" alt="The Toilet Bowl" />

			<div class="toiletBowl">
				<img
					src="{getAvatarFromTeamManagers(leagueTeamManagers, toilet, year)}"
					class="toiletWinner clickable"
					onclick={() => gotoManager({ year, leagueTeamManagers, rosterID: toilet })}
					alt="toilet bowl winner"
				/>
				<img src="./toilet-bowl-2.png" class="toilet" alt="" />
			</div>
			<span
				class="genLabel clickable"
				onclick={() => gotoManager({ year, leagueTeamManagers, rosterID: toilet })}
				>{@html getNestedTeamNamesFromTeamManagers(leagueTeamManagers, year, toilet)}</span
			>
		</div>
	{/if}
</div>
