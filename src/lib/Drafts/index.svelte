<script>
	import { waitForAll } from '$lib/utils/helper';
    import LinearProgress from '@smui/linear-progress';
    import Draft from './Draft.svelte'; 

    export let upcomingDraftData, previousDraftsData, leagueTeamManagersData, playersData, includePreviousYears;
</script>

<style>
	.loading {
		display: block;
		width: 85%;
		max-width: 500px;
		margin: 80px auto;
		text-align: center;
	}

    .draft-card {
        padding: 16px;
        margin: 16px auto;
        max-width: auto; /* Increased width */
    }

    .draft-card h4, .draft-card h6 {
        text-align: center;
        margin: 0;
        color: #bbb;
    }

    .draft-card h4 {
        margin-bottom: 16px;
        color: #bbb;
    }

    .draft-card h6 {
        margin-top: 16px;
        color: #bbb;
    }

    h4 {
        text-align: center;
        color: #bbb;
    }
</style>

{#await waitForAll(upcomingDraftData, leagueTeamManagersData, playersData) }
	<div class="loading">
		<p>Retrieving upcoming draft...</p>
		<LinearProgress indeterminate />
	</div>
{:then [upcomingDraft, leagueTeamManagers, {players}] }
    <div class="draft-card">
        <h4>Upcoming {upcomingDraft.year} Draft</h4>
        <Draft draftData={upcomingDraft} {leagueTeamManagers} year={upcomingDraft.year} {players} />
    </div>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}

{#if includePreviousYears}
	{#await waitForAll(previousDraftsData, leagueTeamManagersData, playersData) }
		<div class="loading">
			<p>Retrieving previous drafts...</p>
			<LinearProgress indeterminate />
		</div>
	{:then [previousDrafts, leagueTeamManagers, {players}] }
		<!-- Don't display anything unless there are previous drafts -->
		{#if previousDrafts.length}
			<h4>Previous Drafts</h4>
			{#each previousDrafts as previousDraft}
				<div class="draft-card">
					<h6>{previousDraft.year} Draft</h6>
					<Draft draftData={previousDraft} previous={includePreviousYears} {leagueTeamManagers} year={previousDraft.year} {players} />
				</div>
			{/each}
		{/if}
	{:catch error}
		<!-- promise was rejected -->
		<p>Something went wrong: {error.message}</p>
	{/await}
{/if }
