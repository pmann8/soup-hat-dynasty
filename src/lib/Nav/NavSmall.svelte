<script>
	import { tabs } from '$lib/utils/tabs';
	import Drawer, { Content, Header, Title } from '@smui/drawer';
	import { Icon } from '@smui/tab';
	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/state';
	import { leagueName } from '$lib/utils/helper';
	import { enableBlog, managers } from '$lib/utils/leagueInfo';

	let active = page.url.pathname;
	let open = false;

	const selectTab = (tab) => {
		open = false;
		goto(tab.dest);
	};
</script>

<style>
	:global(.menuIcon) {
		position: absolute;
		top: 15px;
		left: 15px;
		font-size: 2em;
		color: #bbb;
		padding: 6px;
		cursor: pointer;
	}

	:global(.menuIcon:hover) {
		color: var(--darkBlue);
	}

	:global(.nav-drawer) {
		z-index: 9;
		top: 0;
		left: 0;
	}
	
	:global(.nav-drawer .mdc-drawer__title) {
		color: #bbb !important;
	}

	:global(.nav-drawer .mdc-deprecated-list-item--activated) {
        background-color: rgba(2, 6, 23, 0.25); /* Change active tab background color */
		border-radius: 5px;
		color: #bbb !important;
	}

	:global(.nav-drawer .mdc-deprecated-list-item__graphic) {
		border-radius: 5px;
		color: #bbb !important;
	}

	:global(.nav-drawer .mdc-tab:hover) {
        background-color: rgba(187, 187, 187, 0.25);
		border-radius: 5px;
	}

	:global(.nav-drawer .mdc-tab__icon) {
		color: #bbb !important; /* Change active tab icon color to orange */
	}

	:global(.nav-drawer .mdc-tab__text-label) {
		color: #bbb !important; /* Change active tab text color to orange */
	}

    :global(.nav-drawer .mdc-deprecated-list) {
        padding: 0;
		border: none !important;
    }

	:global(.nav-drawer .nav-item) {
		color: #bbb !important;
	}

	:global(.nav-drawer .mdc-tab:hover) {
        background-color: rgba(187, 187, 187, 0.25);
		border-radius: 5px;
	}

/* 	.nav-back {
		position: fixed;
		z-index: 8;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(31, 41, 55, 0.32);
		transition: all 0.7s;
	} */
</style>

<Icon class="material-icons menuIcon" onclick={() => open = true} ripple={false} touch={true}>menu</Icon>

<div class="nav-back" role="button" tabindex="0" style="pointer-events: {open ? 'visible' : 'none'}; opacity: {open ? 1 : 0};" onclick={() => open = false} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') open = false; }}></div>

<Drawer variant="modal" class="nav-drawer" fixed={true} bind:open>
	<Header>
		<Title>{leagueName}</Title>
	</Header>
	<Content>
		<List>
			{#each tabs as tab}
				{#if !tab.nest && (tab.label != 'Blog' || (tab.label == 'Blog' && enableBlog))}
					<Item href="javascript:void(0)" onSMUIAction={() => selectTab(tab)} ontouchstart={() => preloadData(tab.dest)} onmouseover={() => preloadData(tab.dest)} activated={active == tab.dest}>
						<Graphic class="material-icons{active == tab.dest ? '' : ' nav-item'}" aria-hidden="true">{tab.icon}</Graphic>
						<Text class="{active == tab.dest ? '' : 'nav-item'}">{tab.label}</Text>
					</Item>
				{/if}
			{/each}
			{#each tabs as tab}
				{#if tab.nest}
					<Separator />
					<Subheader>{tab.label}</Subheader>
					{#each tab.children as subTab}
						{#if subTab.label == 'Managers'}
							{#if managers.length}
								<Item href="javascript:void(0)" onSMUIAction={() => selectTab(subTab)} activated={active == subTab.dest} ontouchstart={() => preloadData(subTab.dest)} onmouseover={() => preloadData(subTab.dest)}>
									<Graphic class="material-icons{active == subTab.dest ? '' : ' nav-item'}" aria-hidden="true">{subTab.icon}</Graphic>
									<Text class="{active == subTab.dest ? '' : 'nav-item'}">{subTab.label}</Text>
								</Item>
							{/if}
						{:else}
							<Item href="javascript:void(0)" onSMUIAction={() => selectTab(subTab)} activated={active == subTab.dest} ontouchstart={() => {if(subTab.label != 'Go to Sleeper') preloadData(subTab.dest)}} onmouseover={() => {if(subTab.label != 'Go to Sleeper') preloadData(subTab.dest)}}>
								<Graphic class="material-icons{active == subTab.dest ? '' : ' nav-item'}" aria-hidden="true">{subTab.icon}</Graphic>
								<Text class="{active == subTab.dest ? '' : 'nav-item'}">{subTab.label}</Text>
							</Item>
						{/if}
					{/each}
				{/if}
			{/each}
		</List>
	</Content>
</Drawer>
