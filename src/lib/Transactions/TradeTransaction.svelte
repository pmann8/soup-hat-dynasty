<script>
	import { gotoManager } from '$lib/utils/helper';
	import { getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';
	import TransactionMove from './TransactionMove.svelte';

	export let transaction, players, leagueTeamManagers;
</script>

<style>
    .tradeTransaction {
        display: flex;
        position: relative;
        flex-direction: column;
        margin-bottom: 1em;
    }
    
    .name {
        position: relative;
        color: #bbb;
    }

    .avatar {
        border-radius: 50%;
        height: 40px;
        width: 40px;
        border: 2px solid var(--darkBlue);
        background-color: var(--darkBlue);
    }

    .ownerName {
        display: inline-block;
        font-weight: normal;
        line-height: 1em;
        margin: 0.2em;
    }

    .currentOwner {
        font-style: italic;
        color: #bbb;
        font-size: 0.7em;
    }

    .clickable {
        cursor: pointer;
    }

    .date {
        color: #bbb;
        font-style: italic;
        font-size: 0.7em;
        text-align: center;
        padding: 0.7em 0 1em;
        background-color: var(--lightBlue);
        border-radius: 0 0 10px 40px;
        border-left: 2px solid var(--darkBlue);
        margin-bottom: 3em;
    }

    :global(.tradeTransaction table) {
        width: 100%;
        border-collapse: separate; /* Change to separate to allow border-radius */
        border-spacing: 0;
        table-layout: fixed;
        height: 1px;
    }

    :global(.tradeTransaction tbody) {
        background-color: var(--lightBlue);
        border-top: 2px solid var(--darkBlue);
        border-left: 2px solid var(--darkBlue);
    }

    :global(.tradeTransaction table tbody tr:first-child td:first-child) {
        border-top-left-radius: 10px;
        border-left: 2px solid var(--darkBlue);
        border-top: 2px solid var(--darkBlue);
        overflow: hidden; /* Ensure content respects the border-radius */
    }

    :global(.tradeTransaction table tbody tr:first-child td:last-child) {
        border-top-right-radius: 10px;
        border-top: 2px solid var(--darkBlue);
        overflow: hidden; /* Ensure content respects the border-radius */
    }

    :global(.tradeTransaction table tbody tr:not(:first-child):not(:last-child) td:first-child) {
        border-left: 2px solid var(--darkBlue);
        overflow: hidden; /* Ensure content respects the border-radius */
    }

    :global(.tradeTransaction table tbody tr:last-child td:first-child) {
        border-left: 2px solid var(--darkBlue);
        overflow: hidden; /* Ensure content respects the border-radius */
    }

    .holder {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
    }

    @media (max-width: 420px) {
        .ownerName {
            font-size: 0.8em;
        }
    }
</style>

<div class="tradeTransaction">
    <table>
        <thead>
            <tr>
                {#each transaction.rosters as owner}
                    <th class="name clickable" style="width: {1 / transaction.rosters.length * 100}%;" onclick={() => gotoManager({year: transaction.season, leagueTeamManagers, rosterID: owner})}>
                        <div class="holder">
                            <img class="avatar" src="{getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).avatar}" alt="{getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name} avatar"/>
                            <span class="ownerName">
                                {getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name}
                                {#if getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name != getTeamFromTeamManagers(leagueTeamManagers, owner).name}
                                    <br />
                                    <span class="currentOwner">({getTeamFromTeamManagers(leagueTeamManagers, owner).name})</span>
                                {/if}
                            </span>
                        </div>
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each transaction.moves as move}
                <TransactionMove {players} {move} type={transaction.type} {leagueTeamManagers} season={transaction.season} />
            {/each}
        </tbody>
    </table>
    <span class="date">
        {transaction.date}
    </span>
</div>
