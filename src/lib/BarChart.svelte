<script>
    import Button, { Group, Label } from '@smui/button';
	import Bar from './Bar.svelte';

    export let graphs, leagueTeamManagers, curGraph = 0;

    const colors = [
        "#446a88",
        // "#32788f",
        "#1d808d",
        "#198886",
        // "#2b8673",
        "#448864",
        "#578844",
        "#7d8844",
        "#887c44",
        "#886844",
        "#885444",
        "#884444",
    ];

    // note that due to changig to horizontal, yMin and yMax are now used as xMin and xMax
    $: xMin = graphs[curGraph].secondStats.length > 0 ? graphs[curGraph].xMin/3 : graphs[curGraph].xMin;
    $: xMax = graphs[curGraph].xMax;
    $: stats = graphs[curGraph].stats;
    $: secondStats = graphs[curGraph].secondStats;
    $: managerIDs = graphs[curGraph].managerIDs;
    $: rosterIDs = graphs[curGraph].rosterIDs;
    $: labels = graphs[curGraph].labels;
    $: header = graphs[curGraph].header;
    $: year = graphs[curGraph].year;
</script>

<style>
    .chartWrapper {
		background-color: var(--lightBlue);
        padding: 1em 0 0.5em;
        margin: 0 auto;
        max-width: 950px;
        border-radius: 5px;
    }

    .barChart {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
    }

    h6 {
        font-weight: 400;
        width: 100%;
        text-align: center;
        margin: 0 0 1em;
    }

    .buttonHolderG {
        text-align: center;
        margin: 1em 0 2em;
    }

    :global(.buttonHolderG .selectionButtons) {
        margin: 0.2em;
    }

    /* Start button resizing */
    @media (max-width: 1000px) {
        .chartWrapper {
            max-width: 95%;
        }
    }
    @media (max-width: 850px) {
        .chartWrapper {
            max-width: 100%;
        }
    }

    @media (max-width: 525px) {
        :global(.buttonHolderG .selectionButtons) {
            font-size: 0.6em;
            height: 32px;
        }
    }

    @media (max-width: 505px) {
        :global(.buttonHolderG .selectionButtons) {
            height: 26px;
        }
    }

    @media (max-width: 405px) {
        :global(.buttonHolderG .selectionButtons) {
            font-size: 0.5em;
            padding: 0 6px;
        }
    }

    @media (max-width: 260px) {
        :global(.buttonHolderG .selectionButtons) {
            font-size: 0.4em;
            padding: 0 2px;
            height: 24px;
            min-width: 40px;
        }
    }

    /* End button resizing */
</style>

<h6>{header}</h6>
<div class="chartWrapper">
    <div class="barChart" >
        {#each managerIDs as managerID, ix}
            <Bar {leagueTeamManagers} {managerID} rosterID={rosterIDs[ix]} {xMin} {xMax} stat={stats[ix]} secondStat={secondStats[ix]} {year} label={labels.stat} color={colors[ix % colors.length]} />
        {/each}
    </div>
</div>

{#if graphs.length > 1}
    <div class="buttonHolderG">
        <div class="buttons">
            {#each graphs as graph, ix}
                {#if ix < 4}
                    <Button class="selectionButtons" onclick={() => curGraph = ix} variant="{curGraph == ix ? "raised" : "outlined"}">
                        <Label>{graph.short}</Label>
                    </Button>
                {/if}
            {/each}
        </div>
        <br />
        <div class="buttons">
            {#each graphs as graph, ix}
                {#if ix > 3}
                    <Button class="selectionButtons" onclick={() => curGraph = ix} variant="{curGraph == ix ? "raised" : "outlined"}">
                        <Label>{graph.short}</Label>
                    </Button>
                {/if}
            {/each}
        </div>
    </div>
{/if}