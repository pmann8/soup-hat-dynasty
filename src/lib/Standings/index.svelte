<script>
    import { leagueName, round } from '$lib/utils/helper';
    import { getTeamFromTeamManagers, getRosterIDFromManagerID, getTeamFromTeamManagersAndManagerID } from '$lib/utils/helperFunctions/universalFunctions';
    import { getLeagueRecords, getLeagueTransactions } from '$lib/utils/helper';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import LinearProgress from '@smui/linear-progress';
    import { onMount } from 'svelte';
    import Standing from './Standing.svelte';

    export let standingsData, leagueTeamManagersData;

    // Least important to most important (i.e. the most important [usually wins] goes last)
    // Edit this to match your leagues settings
    const sortOrder = ["maxFpts", "fptsAgainst", "fpts", "ties", "wins"];

    // Column order from left to right
    let columnOrder = [{name: "Wins", field: "wins"}, {name: "Ties", field: "ties"}, {name: "Loses", field: "losses"}, {name: "Points For", field: "fpts"}, {name: "Points Against", field: "fptsAgainst"}, {name: "Points Difference", field: "ptsDiff"}, {name: "Max Points For", field: "maxFpts"}, {name: "Win Streak", field: "streak"}]
    
    let loading = true;
    let preseason = false;
    let isAllTime = false;
    let standings, year, leagueTeamManagers;
    let leagueData, totals;
    onMount(async () => {
        const asyncStandingsData = await standingsData;              
        leagueTeamManagers = await leagueTeamManagersData;
        const leagueRecords = await getLeagueRecords(false);
        const leagueTransactions = await getLeagueTransactions(false);

        leagueData = {
            ...leagueRecords,
            leagueTransactions
        };

        if(!asyncStandingsData) {  
            isAllTime = true;
            columnOrder = [{name: "Win %", field: "winPercentage"}, {name: "Wins", field: "wins"}, {name: "Ties", field: "ties"}, {name: "Loses", field: "losses"}, {name: "Points For", field: "fpts"}, {name: "Points Against", field: "fptsAgainst"}, {name: "Points Difference", field: "ptsDiff"}, {name: "Points Per Game", field: "ppg"}, {name: "Potential Points", field: "potentialPoints"}, {name: "Lineup IQ", field: "lineupIQ"}, {name: "Trades", field: "trades"}, {name: "Waivers", field: "waivers"}]
            loading = false;
            preseason = true;
            return;
        }

        const {standingsInfo, yearData} = asyncStandingsData;
        year = yearData;

        let finalStandings = Object.keys(standingsInfo).map((key) => standingsInfo[key]);

        for(const sortType of sortOrder) {
            if(!finalStandings[0][sortType] && finalStandings[0][sortType] != 0) {
                continue;
            }
            finalStandings = [...finalStandings].sort((a,b) => b[sortType] - a[sortType]);
        }

        standings = finalStandings;
        loading = false;
    })

    function aggregateAllTimeStandings(records) {
        const allTimeStandings = {};
        const leagueManagerRecords = records.regularSeasonData.leagueManagerRecords;

        Object.entries(leagueManagerRecords).forEach(([teamId, record]) => {
            if (!allTimeStandings[teamId]) {
                allTimeStandings[teamId] = {
                    managerID: teamId,
                    winPercentage: 0,
                    wins: 0,
                    ties: 0,
                    losses: 0,
                    fpts: 0,
                    fptsAgainst: 0,
                    ptsDiff: 0,
                    ppg: 0,
                    potentialPoints: 0,
                    lineupIQ: 0,
                    trades: 0,
                    waivers: 0
                };
            }

            allTimeStandings[teamId].winPercentage = round((record.wins + (record.ties * 0.5)) / (record.wins + record.ties + record.losses) * 100) + '%';
            allTimeStandings[teamId].wins += record.wins;
            allTimeStandings[teamId].ties += record.ties;
            allTimeStandings[teamId].losses += record.losses;
            allTimeStandings[teamId].fpts += round(record.fptsFor);
            allTimeStandings[teamId].fptsAgainst += round(record.fptsAgainst);
            allTimeStandings[teamId].ptsDiff += round(record.fptsFor - record.fptsAgainst);
            allTimeStandings[teamId].ppg = round(record.fptsFor / (record.wins + record.ties + record.losses));
            allTimeStandings[teamId].potentialPoints = round(record.potentialPoints);
            allTimeStandings[teamId].lineupIQ = round((record.fptsFor / record.potentialPoints) * 100) + '%';
        });
        
        const leagueTransactionsTotals = records.leagueTransactions.totals.allTime;

        Object.entries(leagueTransactionsTotals).forEach(([teamId, record]) => {
            allTimeStandings[teamId].trades = record.trade;
            allTimeStandings[teamId].waivers = record.waiver;
        });

        return Object.values(allTimeStandings).sort((a, b) => b.wins - a.wins);
    }

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
        text-align: center;
    }

    :global(.standingsTable .mdc-data-table__cell) {
        text-align: center;
    }
</style>

<h1>{year ?? ''} {leagueName} Standings</h1>

{#if loading}
    <!-- promise is pending -->
    <div class="loading">
        <p>Loading Standings...</p>
        <LinearProgress indeterminate />
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
                {#if isAllTime}
                    {#each aggregateAllTimeStandings(leagueData) as standing}
                        <Standing {columnOrder} {standing} {leagueTeamManagers} team={getTeamFromTeamManagersAndManagerID(leagueTeamManagers, standing.managerID)} {isAllTime} />
                    {/each}
                {:else}
                    {#each standings as standing}
                        <Standing {columnOrder} {standing} {leagueTeamManagers} team={getTeamFromTeamManagers(leagueTeamManagers, standing.rosterID)} {isAllTime} />
                    {/each}
                {/if}
            </Body>
        </DataTable>
    </div>
{/if}

