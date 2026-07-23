<script>
	import { tabs } from '$lib/utils/tabs';
	import Tab, { Icon, Label } from '@smui/tab';
	import List, { Item, Graphic, Text, Separator } from '@smui/list';
	import TabBar from '@smui/tab-bar';
	import { page } from '$app/state';
	import { afterNavigate, goto, preloadData } from '$app/navigation';
	import { enableBlog, managers } from '$lib/utils/leagueInfo';

	const nestTab = tabs.find((tab) => tab.nest);
	const tabChildren = (nestTab?.children ?? []).filter(
		(subTab) => subTab.label != 'Managers' || managers.length > 0
	);

	const findActiveTab = (pathname) =>
		tabs.find(
			(tab) =>
				tab.dest == pathname ||
				(tab.nest && tab.children.some((subTab) => subTab.dest == pathname))
		) ?? tabs[0];

	let active = $state(findActiveTab(page.url.pathname));
	let display = $state(false);
	let triggerEl = $state();
	let menuTop = $state(0);
	let menuLeft = $state(0);

	afterNavigate(() => {
		active = findActiveTab(page.url.pathname);
		display = false;
	});

	const placeMenu = () => {
		const rect = triggerEl?.getBoundingClientRect();
		if (!rect) return;
		menuTop = rect.bottom + 4;
		menuLeft = rect.left;
	};

	const toggleMenu = (event) => {
		event?.stopPropagation?.();
		event?.preventDefault?.();
		if (display) {
			display = false;
			active = findActiveTab(page.url.pathname);
			return;
		}
		placeMenu();
		display = true;
		if (nestTab) active = nestTab;
	};

	const closeMenu = () => {
		display = false;
		active = findActiveTab(page.url.pathname);
	};

	const subGoto = (dest) => {
		display = false;
		if (dest.startsWith('http')) {
			window.open(dest, '_blank');
		} else {
			goto(dest);
		}
	};
</script>

<svelte:window
	onresize={() => {
		if (display) placeMenu();
	}}
	onscroll={() => {
		if (display) placeMenu();
	}}
/>

<style>
	:global(.parent .navBar) {
		display: inline-flex;
		position: relative;
		justify-content: center;
		overflow: visible !important;
	}

	:global(.navBar .mdc-tab-scroller),
	:global(.navBar .mdc-tab-scroller__scroll-area),
	:global(.navBar .mdc-tab-scroller__scroll-content) {
		overflow: visible !important;
	}

	:global(.navBar .material-icons) {
		font-size: 1.15em;
		height: 20px;
		width: 18px;
	}

	:global(.navBar .mdc-tab) {
		height: 44px !important;
		padding: 0 0.65rem !important;
	}

	:global(.navBar .mdc-tab--active) {
		background-color: rgba(196, 132, 60, 0.16) !important;
		border-radius: 2px;
	}

	:global(.navBar .mdc-tab:hover) {
		background-color: rgba(232, 228, 217, 0.08);
		border-radius: 2px;
	}

	:global(.navBar .mdc-tab__content) {
		flex-direction: row !important;
		align-items: center !important;
		gap: 0.35rem;
	}

	:global(.navBar .mdc-tab__icon) {
		color: var(--mist) !important;
		margin: 0 !important;
	}

	:global(.navBar .mdc-tab--active .mdc-tab__icon),
	:global(.navBar .mdc-tab--active .mdc-tab__text-label) {
		color: var(--copper-bright) !important;
	}

	:global(.navBar .mdc-tab__text-label) {
		color: var(--mist) !important;
		font-family: var(--font-body) !important;
		font-weight: 600 !important;
		font-size: 0.82rem !important;
		letter-spacing: 0.02em !important;
		text-transform: none !important;
	}

	:global(.navBar .mdc-tab-indicator .mdc-tab-indicator__content--underline) {
		border-color: var(--copper) !important;
	}

	.parent {
		position: relative;
		z-index: 6;
	}

	.nest-wrap {
		display: inline-flex;
		align-items: stretch;
	}

	.nest-hit {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		min-width: 5rem;
		height: 44px;
		padding: 0 0.65rem;
		border: none;
		background: transparent;
		color: var(--mist);
		cursor: pointer;
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.82rem;
		letter-spacing: 0.02em;
		border-radius: 2px;
		line-height: 1;
	}

	.nest-hit:hover {
		background: rgba(232, 228, 217, 0.08);
	}

	.nest-hit.open {
		background: rgba(196, 132, 60, 0.16);
		color: var(--copper-bright);
	}

	.nest-icon {
		font-size: 1.1em;
		line-height: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		margin: 0;
		padding: 0;
		transform: translateY(0px);
	}

	.nest-label {
		line-height: 1;
		display: inline-block;
		transform: translateY(0);
	}

	.overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: transparent;
	}

	.subMenu {
		position: fixed;
		z-index: 50;
		min-width: 12rem;
		background-color: var(--panel);
		border: 1px solid rgba(232, 228, 217, 0.14);
		border-radius: 2px;
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
	}

	:global(.subMenu .mdc-deprecated-list) {
		padding: 0;
		border: none !important;
		background: transparent !important;
	}

	:global(.subMenu .mdc-deprecated-list-item) {
		color: var(--chalk) !important;
	}

	:global(.subMenu .mdc-deprecated-list-item:hover) {
		background: rgba(196, 132, 60, 0.12) !important;
	}

	:global(.subMenu .subText) {
		font-size: 0.85em;
		font-family: var(--font-body);
	}

	:global(.navBar .dontDisplay) {
		display: none;
	}
</style>

{#if display}
	<div class="overlay" role="presentation" onmousedown={closeMenu}></div>
	<div
		class="subMenu"
		style="top: {menuTop}px; left: {menuLeft}px;"
		onmousedown={(e) => e.stopPropagation()}
	>
		<List>
			{#each tabChildren as subTab, ix}
				<Item
					onSMUIAction={() => subGoto(subTab.dest)}
					ontouchstart={() => {
						if (subTab.label != 'Go to Sleeper') preloadData(subTab.dest);
					}}
					onmouseover={() => {
						if (subTab.label != 'Go to Sleeper') preloadData(subTab.dest);
					}}
				>
					<Graphic class="material-icons">{subTab.icon}</Graphic>
					<Text class="subText">{subTab.label}</Text>
				</Item>
				{#if ix != tabChildren.length - 1}
					<Separator />
				{/if}
			{/each}
		</List>
	</div>
{/if}

<div class="parent">
	<TabBar class="navBar" {tabs} key={(tab) => tab.key} bind:active>
		{#snippet tab(tab)}
			{#if tab.nest}
				<div class="nest-wrap">
					<button
						type="button"
						class="nest-hit"
						class:open={display}
						bind:this={triggerEl}
						aria-expanded={display}
						aria-haspopup="true"
						onclick={toggleMenu}
					>
						<span class="material-icons nest-icon" aria-hidden="true">{tab.icon}</span>
						<span class="nest-label">{tab.label}</span>
					</button>
				</div>
			{:else}
				<Tab
					class="{tab.label == 'Blog' && !enableBlog ? 'dontDisplay' : ''}"
					{tab}
					onTouchstart={() => preloadData(tab.dest)}
					onMouseover={() => preloadData(tab.dest)}
					href={tab.dest}
					minWidth
				>
					<Icon class="material-icons">{tab.icon}</Icon>
					<Label class="label mdc-tab__text-label">{tab.label}</Label>
				</Tab>
			{/if}
		{/snippet}
	</TabBar>
</div>
