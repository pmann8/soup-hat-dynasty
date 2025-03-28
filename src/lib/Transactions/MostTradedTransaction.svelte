<script>
    import Transactions from './Transactions.svelte';
    import DataTable, { Head, Body, Row, Cell, Label } from '@smui/data-table';

	export let playersTraded2, players;

    const getAvatar = (pos, player) => {
		if(pos == 'DEF') {
			return `background-image: url(https://sleepercdn.com/images/team_logos/nfl/${player.toLowerCase()}.png)`;
		}
		return `background-image: url(https://sleepercdn.com/content/nfl/players/thumb/${player}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`;
	}
    
    let entries = Object.entries(playersTraded2);
    let sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 20);
</script>

<style>
    .mostTraded {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-direction: column;
        margin-bottom: 1em;
    }

    .tradeSlot {
        display: inline-block;
        vertical-align: middle;
        height: 40px;
        width: 40px;
        background-position: center;
        border: 2px solid;
        border-radius: 100%;
        position: relative;
        background-color: var(--eee);
    }

    .playerAvatar {
        background-repeat: no-repeat;
        background-size: auto 50px;
    }    

    :global(.mostTraded .mdc-data-table) {
	    background-color: var(--lightBlue) !important;
        border: none !important;
    }    

    :global(.mostTraded .mdc-data-table__header-cell) {
	    background-color: var(--lightBlue) !important;
    }

    :global(.mostTraded .mdc-data-table__cell) {
        border-left: none !important;
        border-top: none !important;
    }
</style>

<div class="mostTraded">
    <DataTable class="dataTable" table$aria-label="Player Trade Count" style="max-width: 100%;">
        <Head>
            <Row>
                <Cell columnID="player" style="width 50%; text-align: center;">Player</Cell>
                <Cell columnID="tradeCount" style="width 100%; text-align: center;">Trade Count</Cell>
            </Row>
        </Head>
        <Body>
            {#each sorted as [player, count]}
                <Row>
                    <Cell style="width 100%; text-align: left;">
                        <div class="tradeSlot playerAvatar" style="border-color: var(--{players[player].pos}); {getAvatar(players[player].pos, player)}"></div>
                        {`${players[player].fn} ${players[player].ln}`}
                        </Cell>
                    <Cell style="width 100%; text-align: center;">{count}</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
</div>