<script>
  	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import LinearProgress from '@smui/linear-progress';
    import { onMount } from 'svelte';
    import DraftRow from './DraftRow.svelte';
    import { gotoManager } from '$lib/utils/helper'
	import { getAvatarFromTeamManagers, getTeamNameFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';
    
    export let draftData, leagueTeamManagers, previous = false, year, players;

    const {draftOrder, draft, accuracy, reversalRound, draftType} = draftData;

    let progress = 0;
    let closed = false;

    onMount(loadAccuracy);

    function loadAccuracy() {
        if(!accuracy || accuracy === 1) return;
        let timer;
        progress = 0;
        closed = false;
        clearInterval(timer);
        timer = setInterval(() => {
            progress += 0.02;
            if (progress >= accuracy) {
                clearInterval(timer);
                if (progress >= 1) {
                    progress = 1;
                    closed = true;
                }
            }

        }, 100);
    }
</script>

<style>
    .accuracy {
        display: block;
        width: 80%;
        max-width: 800px;
        margin: 1em auto 1.5em;
    }

    .accuracyText {
        font-size: 0.7em;
        color: var(--mist);
    }

    .disclaimer {
        font-style: italic;
        color: var(--mist);
        opacity: 0.85;
    }

    :global(.draftBoard) {
        display: block;
        width: 100%;
        margin: 1em auto 1.5em;
        overflow-x: auto;
        border: none !important;
    }

	:global(.draftTeam) {
        font-size: 0.65em;
		text-align: center;
		padding: 4px 2px;
		background-color: var(--transactHeader);
        white-space: break-spaces;
        line-height: 1.05em;
        height: 4.25em;
        vertical-align: initial;
	}

	:global(.draftBoard table) {
        table-layout: fixed;
        width: 100%;
        min-width: 0;
	}

    :global(.draftBoard th) {
        border-right: 1px solid rgba(232, 228, 217, 0.12);
        border-bottom: 1px solid rgba(232, 228, 217, 0.12);
        height: 1.6em;
        font-size: 0.7em;
        text-align: center;
        background-color: var(--ink);
        padding: 0.2em 0.15em !important;
    }

    :global(.draftBoard th:last-of-type) {
        border-right: none;
    }

    :global(.draftBoard td) {
        border-right: 1px solid rgba(232, 228, 217, 0.12);
        border-bottom: 1px solid rgba(232, 228, 217, 0.12);
        height: 3.6em;
        font-size: 0.62em;
        padding: 0.15em !important;
    }

    :global(.draftBoard.draftBoardPrev td) {
        height: 6.5em;
    }

    :global(.draftBoard td:last-of-type) {
        border-right: none;
    }

	.avatar {
		border-radius: 50%;
        height: 22px;
        width: 22px;
        margin: 0.2em 0;
		border: 0.25px solid rgba(232, 228, 217, 0.25);
	}

    .clickable {
        cursor: pointer;
    }
	
	:global(.curDraftName) {
        color: var(--mist);
        font-size: 0.7em;
        font-style: italic;
    }
</style>

{#if accuracy && accuracy !== 1 && !closed}
    <div class="accuracy">
        <div class="accuracyText">
            Upcoming draft order accuracy: {parseInt(progress*100)}%
            <span class="disclaimer">(accuracy will improve as the regular season progresses)</span>
        </div>
        <LinearProgress {progress} {closed} />
    </div>
{/if}

<DataTable class="draftBoard{previous ? ' draftBoardPrev' : ''}">
    <Head>
        <Row>
            {#each draftOrder as draftPosition}
                {#if draftPosition}
                    <Cell class="draftTeam">
                        <img class="avatar clickable" onclick={() => gotoManager({year, leagueTeamManagers, rosterID: draftPosition})} src="{getAvatarFromTeamManagers(leagueTeamManagers, draftPosition, year)}" alt="{getTeamNameFromTeamManagers(leagueTeamManagers, draftPosition, year)} avatar"/>
                        <br />
                        <span class="clickable" onclick={() => gotoManager({year, leagueTeamManagers, rosterID: draftPosition})}>{getTeamNameFromTeamManagers(leagueTeamManagers, draftPosition, year)}{@html getTeamNameFromTeamManagers(leagueTeamManagers, draftPosition, year) != getTeamNameFromTeamManagers(leagueTeamManagers, draftPosition) ? `<br /><span class="curDraftName">(${getTeamNameFromTeamManagers(leagueTeamManagers, draftPosition)})</span>` : ''}</span>
                    </Cell>
                {/if}
            {/each}
        </Row>
    </Head>
    <Body>
        {#each draft as draftRow, row}
            <DraftRow {draftRow} row={row + 1} {previous} {reversalRound} {draftType} {players} {leagueTeamManagers} {year} />
        {/each}
    </Body>
</DataTable>

