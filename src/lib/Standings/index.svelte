<script>
    import { leagueName, round } from '$lib/utils/helper';
    import { getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import LinearProgress from '@smui/linear-progress';
    import { onMount } from 'svelte';
    import Standing from './Standing.svelte';

    export let standingsData, leagueTeamManagersData, allTimeStandingsData;

    // Least important to most important (i.e. the most important [usually wins] goes last)
    // Edit this to match your leagues settings
    const sortOrder = ["maxFpts", "fptsAgainst", "fpts", "ties", "wins"];

    // Column order from left to right
    const columnOrder = [{name: "Wins", field: "wins"}, {name: "Ties", field: "ties"}, {name: "Loses", field: "losses"}, {name: "Points For", field: "fpts"}, {name: "Points Against", field: "fptsAgainst"}, {name: "Points Difference", field: "ptsDiff"}, {name: "Max Points For", field: "maxFpts"}, {name: "Win Streak", field: "streak"}]
    const allTimeColumnOrder = [{name: "Wins", field: "wins"}, {name: "Ties", field: "ties"}, {name: "Loses", field: "losses"}, {name: "Points For", field: "fpts"}, {name: "Points Against", field: "fptsAgainst"}, {name: "Points Difference", field: "ptsDiff"}, {name: "Max Points For", field: "maxFpts"}]
    
    let loading = true;
    let preseason = false;
    let isAllTime = false;
    let standings, year, leagueTeamManagers, allTimeStandings;
    onMount(async () => {
    const asyncStandingsData = await standingsData;        
    const asyncAllTimeStandingsData = await allTimeStandingsData;

    if(!asyncStandingsData && asyncAllTimeStandingsData) { 
        leagueTeamManagers = await leagueTeamManagersData;
        let finalStandings = Object.keys(asyncAllTimeStandingsData).map((key) => asyncAllTimeStandingsData[key]);

        for(const sortType of sortOrder) {
            if(!finalStandings[0][sortType] && finalStandings[0][sortType] != 0) {
                continue;
            }
            finalStandings = [...finalStandings].sort((a,b) => b[sortType] - a[sortType]);
        }

        allTimeStandings = finalStandings;
        isAllTime = true
        loading = false;
        preseason = true;
        return;
    }

    const {standingsInfo, yearData} = asyncStandingsData;
    leagueTeamManagers = await leagueTeamManagersData;
    year = yearData;

    let finalStandings = Object.keys(standingsInfo).map((key) => standingsInfo[key]);

    for(const sortType of sortOrder) {
        if(!finalStandings[0][sortType] && finalStandings[0][sortType] != 0) {
            continue;
        }
        finalStandings = [...finalStandings].sort((a,b) => b[sortType] - a[sortType]);
    }

    standings = finalStandings;
    allTimeStandings = asyncAllTimeStandingsData;
    loading = false;
})

    let innerWidth;
</script>

<svelte:window bind:innerWidth={innerWidth} />

<style>
    .loading {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
    }

    :global(.center) {
        text-align: center;
    }

    :global(.wrappable) {
        white-space: normal;
        line-height: 1.2em;
    }

    h1 {
        font-size: 2.2em;
        line-height: 1.3em;
        margin: 1.5em 0 2em;
    }

    .standingsTable::-webkit-scrollbar { 
        display: none; 
    }

    .standingsTable {
        max-width: 100%;
        overflow-x: scroll;
        margin: 0.5em 0 5em;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;     /* Firefox */
    }

    :global(.standingsTable .mdc-data-table) {
	    background-color: var(--lightBlue) !important;
        border: none !important;
    }    

    :global(.standingsTable .mdc-data-table__header-cell) {
	    background-color: var(--lightBlue) !important;
    }
</style>

<h1>{year ?? ''} {leagueName} {preseason ? ' All Time ' : ''} Standings</h1>

{#if loading}
    <!-- promise is pending -->
    <div class="loading">
        <p>Loading Standings...</p>
        <LinearProgress indeterminate />
    </div>
{:else if preseason}
    <div class="standingsTable">
        <DataTable table$aria-label="League Standings" >
            <Head> <!-- Team name  -->
                <Row>
                    <Cell class="center">Team</Cell>
                    {#each allTimeColumnOrder as allTimeColumn}
                        <Cell class="center wrappable">{allTimeColumn.name}</Cell>
                    {/each}
                </Row>
            </Head>
            <Body>
                <!-- 	Standing	 -->
                {#each allTimeStandings as standing}
                    <Standing {columnOrder} {allTimeColumnOrder} {standing} {leagueTeamManagers} team={getTeamFromTeamManagers(leagueTeamManagers, standing.rosterID)} {isAllTime} />
                {/each}
            </Body>
        </DataTable>
    </div>
{:else}
    <div class="standingsTable">
        <DataTable table$aria-label="League Standings" >
            <Head> <!-- Team name  -->
                <Row>
                    <Cell class="center">Team</Cell>
                    {#each columnOrder as column}
                        <Cell class="center wrappable">{column.name}</Cell>
                    {/each}
                </Row>
            </Head>
            <Body>
                <!-- 	Standing	 -->
                {#each standings as standing}
                    <Standing {columnOrder} {allTimeColumnOrder} {standing} {leagueTeamManagers} team={getTeamFromTeamManagers(leagueTeamManagers, standing.rosterID)} {isAllTime} />
                {/each}
            </Body>
        </DataTable>
    </div>
{/if}
