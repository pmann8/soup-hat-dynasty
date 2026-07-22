<script>
	import { tabs } from '$lib/utils/tabs';
	import Drawer, { Content, Header, Title } from '@smui/drawer';
	import { Icon } from '@smui/tab';
	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/state';
	import { leagueName } from '$lib/utils/helper';
	import { enableBlog, managers } from '$lib/utils/leagueInfo';

	let active = $derived(page.url.pathname);
	let open = false;

	const selectTab = (tab) => {
		open = false;
		goto(tab.dest);
	};
</script>

<style>
	:global(.menuIcon) {
		font-size: 1.75em;
		color: var(--chalk);
		padding: 6px;
		cursor: pointer;
		border-radius: 2px;
		transition: color 0.2s ease, background 0.2s ease;
	}

	:global(.menuIcon:hover) {
		color: var(--copper-bright);
		background: rgba(196, 132, 60, 0.12);
	}

	:global(.nav-drawer) {
		z-index: 30;
		top: 0;
		left: 0;
		background: var(--panel) !important;
		border-right: 1px solid rgba(232, 228, 217, 0.1) !important;
	}

	:global(.nav-drawer .mdc-drawer__title) {
		color: var(--chalk) !important;
		font-family: var(--font-display) !important;
		font-weight: 800 !important;
		letter-spacing: -0.03em !important;
	}

	:global(.nav-drawer .mdc-deprecated-list-item--activated) {
		background-color: rgba(196, 132, 60, 0.16) !important;
		border-radius: 2px;
		color: var(--copper-bright) !important;
	}

	:global(.nav-drawer .mdc-deprecated-list-item__graphic) {
		border-radius: 2px;
		color: var(--mist) !important;
	}

	:global(.nav-drawer .mdc-deprecated-list) {
		padding: 0.5rem !important;
		border: none !important;
	}

	:global(.nav-drawer .nav-item) {
		color: var(--mist) !important;
	}

	:global(.nav-drawer .mdc-deprecated-list-subheader) {
		color: var(--copper) !important;
		font-family: var(--font-display) !important;
		letter-spacing: 0.12em !important;
		text-transform: uppercase !important;
		font-size: 0.7rem !important;
	}

	.nav-back {
		position: fixed;
		z-index: 25;
		inset: 0;
		background-color: rgba(12, 18, 16, 0.55);
		transition: opacity 0.3s ease;
	}
</style>

<Icon class="material-icons menuIcon" onclick={() => (open = true)} ripple={false} touch={true}>menu</Icon>

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
