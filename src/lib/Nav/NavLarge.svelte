<script>
	import { tabs } from '$lib/utils/tabs';
	import Tab, { Icon, Label } from '@smui/tab';
	import List, { Item, Graphic, Text, Separator } from '@smui/list';
	import TabBar from '@smui/tab-bar';
    import { page } from '$app/state';
	import { goto, preloadData } from '$app/navigation';
	import { enableBlog, managers } from '$lib/utils/leagueInfo';

	let active = $state(tabs.find(tab => tab.dest == page.url.pathname || (tab.nest && tab.children.find(subTab => subTab.dest == page.url.pathname))));

	let display = $state(false);
	let el = $state();
	let width = $state();
	let height= $state();
	let left = $state();
	let top = $state();

	$effect(() => {
		top = el?.getBoundingClientRect() ? el?.getBoundingClientRect().top  : 0;
		const bottom = el?.getBoundingClientRect() ? el?.getBoundingClientRect().bottom  : 0;

		height = bottom - top + 1;

		left = el?.getBoundingClientRect() ? el?.getBoundingClientRect().left  : 0;
		const right = el?.getBoundingClientRect() ? el?.getBoundingClientRect().right  : 0;

		width = right - left;
	});

	let innerWidth = $state();

	const open = () => {
		display = !display;
	}

	const subGoto = (dest) => {
		open(false);
		if (dest.startsWith('http')) {
			window.open(dest, '_blank');
		} else {
			goto(dest);
		}
	}

	let tabChildren = $state([]);

	for(const tab of tabs) {
		if(tab.nest) {
			tabChildren = tab.children;
		}
	}

</script>

<svelte:window bind:innerWidth={innerWidth} />

<style>
    :global(.parent .navBar) {
        display: inline-flex;
        position: relative;
        justify-content: center;
    }

    :global(.navBar .material-icons) {
        font-size: 1.8em;
        height: 25px;
        width: 22px;
    }

    :global(.navBar .mdc-tab--active) {
        background-color: var(--darkBlue) !important; /* Change active tab background color */
		border-radius: 5px;
	}

	:global(.navBar .mdc-tab:hover) {
        background-color: rgba(187, 187, 187, 0.25);
		border-radius: 5px;
	}

	:global(.navBar .mdc-tab__icon) {
		color: #bbb !important; /* Change active tab icon color to orange */
	}

	:global(.navBar .mdc-tab__text-label) {
		color: #bbb !important; /* Change active tab text color to orange */
	}

    .parent {
        position: relative;
    }

    .subMenu {
		overflow-y: hidden;
		display: block;
		position: absolute;
		z-index: 5;
		background-color: var(--darkBlue);
		transition: all 0.4s;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}

    .overlay {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        height: 100vh;
        z-index: 4;
    }

    :global(.navBar .mdc-deprecated-list) {
        padding: 0;
		border: none !important;
    }

    :global(.navBar .subText) {
        font-size: 0.8em;
    }

    :global(.navBar .dontDisplay) {
        display: none;
    }
</style>

<div tabindex="0" role="button" class="overlay" style="display: {display ? "block" : "none"};" onclick={() => open(true)}></div>

<div class="parent">
	<TabBar class="navBar" {tabs} key={(tab) => tab.key} bind:active>
		{#snippet tab(tab)}
			{#if tab.nest}
				<div bind:this={el}>
					<Tab
						{tab}
						minWidth
						onclick={() => open()}
					>
						<Icon class="material-icons">{tab.icon}</Icon>
						<Label class="label mdc-tab__text-label">{tab.label}</Label>
					</Tab>
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
	<div class="subMenu" style="max-height: {display ? 49 * tabChildren.length - 1 - (managers.length ? 0 : 48) : 0}px; width: {width}px; top: {height}px; left: {left}px; box-shadow: 0 0 {display ? "3px" : "0"} 0 #1f2937; border-top: {display ? "0px" : "0"} solid #1f2937;">		
		<List>
			{#each tabChildren as subTab, ix}
				{#if subTab.label == 'Managers'}
					<Item class="{managers.length ? '' : 'dontDisplay'}" onSMUIAction={() => subGoto(subTab.dest)} ontouchstart={() => preloadData(subTab.dest)} onmouseover={() => preloadData(subTab.dest)}>
						<Graphic class="material-icons">{subTab.icon}</Graphic>
						<Text class="subText">{subTab.label}</Text>
					</Item>
					{#if ix != tabChildren.length - 1}
						<Separator />
					{/if}
				{:else}
					<Item onSMUIAction={() => subGoto(subTab.dest)} ontouchstart={() => {if(subTab.label != 'Go to Sleeper') preloadData(subTab.dest)}} onmouseover={() => {if(subTab.label != 'Go to Sleeper') preloadData(subTab.dest)}}>
						<Graphic class="material-icons">{subTab.icon}</Graphic>
						<Text class="subText">{subTab.label}</Text>
					</Item>
					{#if ix != tabChildren.length - 1}
						<Separator />
					{/if}
				{/if}
			{/each}
		</List>
	</div>
</div>
