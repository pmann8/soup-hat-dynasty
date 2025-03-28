<script>
	import List, { Item, Graphic, Separator, Text } from '@smui/list';
	import { dynasty } from './utils/helper';

	const today = new Date();
	const resources = [
		{
		name: "FTN Fantasy",
		url: "https://www.ftnfantasy.com/nfl",
		icon: "insights",
		premium: true,
		separator: true,
		},
		{
		name: "The Fantasy Footballers",
		url: "https://www.thefantasyfootballers.com/",
		icon: "podcasts",
		premium: true,
		separator: true,
		},
		{
		name: "FantasyPros Dynasty Trade Value Chart",
		url: `https://www.fantasypros.com/${today.getFullYear()}/${today.getMonth() + 1}/fantasy-football-rankings-dynasty-trade-value-chart-${today.toLocaleString('default', { month: 'long' }).toLowerCase()}-${today.getFullYear()}-update/`,
		icon: "assessment",
		premium: false,
		separator: true,
		dynastyOnly: true,
		},
		{
		name: "DynastyProcess Trade Calculator",
		url: "https://apps.dynastyprocess.com/calculator/",
		icon: "calculate",
		premium: false,
		separator: true,
		dynastyOnly: true,
		},
		{
		name: "Dynasty League Football",
		url: "https://dynastyleaguefootball.com/",
		icon: "insights",
		premium: true,
		separator: true,
		dynastyOnly: true,
		},
		{
		name: "Reddit Dynasty Fantasy Football",
		url: "https://www.reddit.com/r/DynastyFF/",
		icon: "article",
		premium: false,
		separator: true,
		dynastyOnly: true,
		},
		{
		name: "Reddit Fantasy Football",
		url: "https://www.reddit.com/r/fantasyfootball/",
		icon: "article",
		premium: false,
		separator: true,
		redraftOnly: true,
		},
		{
		name: "Dynasty 101 Trade Calculator",
		url: "https://dynasty101.com/trade-calculator/",
		icon: "calculate",
		premium: false,
		separator: true,
		dynastyOnly: true,
		},
		{
		name: "Dynasty Nerds GM",
		url: "https://gm.dynastynerds.com/",
		icon: "insights",
		premium: true,
		separator: true,
		dynastyOnly: true,
		},
		{
		name: "Fantasy Football Trade Analyzer",
		url: `https://fantasyfootballcalculator.com/trade-analyzer`,
		icon: "calculate",
		premium: false,
		separator: true,
		redraftOnly: true,
		},
		{
		name: "Reddit FF Trade Analyzer",
		url: "https://www.reddit.com/r/TradeAnalyzerFF/",
		icon: "assessment",
		premium: false,
		separator: true,
		},
		{
		name: "Keep Trade Cut",
		url: "https://keeptradecut.com/trade-calculator",
		icon: "assessment",
		premium: false,
		separator: false,
		dynastyOnly: true,
		},
	];
</script>

<style>
    .pageBody {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center; /* Center children horizontally */
	}

	:global(.list) {
		background-color: var(--lightBlue);
		width: 90%;
		max-width: 800px;
		border: 1px solid var(--bbb);
		border-radius: 5px;
		margin: 15px 0; /* Remove auto margin and use 0 for vertical centering */
		padding: 0 !important;
	}

    :global(.linkText) {
        font-size: 1.1em;
    }

    a {
        color: #bbb;
        font-size: 1.1em;
        text-decoration: none;
    }

    h4 {
        text-align: center;
		color: #bbb;
    }

    .disclaimer {
        color: #bbb;
        text-align: center;
    }
</style>

<div class="pageBody">
    <div class="banner">
        <h4>Helpful Dynasty Resources</h4>
    </div>

    <List class="list" dense>
        {#each resources as resource}
            {#if resource.dynastyOnly && dynasty}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">{resource.name}{resource.premium ? "*" : ""}</Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {:else if resource.redraftOnly && !dynasty}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">{resource.name}{resource.premium ? "*" : ""}</Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {:else if !resource.redraftOnly && !resource.dynastyOnly}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">{resource.name}{resource.premium ? "*" : ""}</Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {/if}
        {/each}
    </List>
    <p class="disclaimer">*Some or all content is behind a paywall</p>
</div>