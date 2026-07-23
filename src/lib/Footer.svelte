<script>
	import { goto } from '$app/navigation';
	import { managers, leagueName } from '$lib/utils/helper';
	import { tabs } from '$lib/utils/tabs';
	import { onMount } from 'svelte';

	let el, footerHeight;

	let innerWidth;

	const resize = (e, delay) => {
		const bottom = el?.getBoundingClientRect().bottom;
		const top = el?.getBoundingClientRect().top;
		if (delay) {
			setTimeout(() => {
				resize(e, false);
			}, 100);
		} else {
			footerHeight = bottom - top;
		}
	};

	onMount(() => {
		resize(el?.getBoundingClientRect(), true);
	});

	let managersOutOfDate = false;
	if (managers) {
		for (const manager of managers) {
			if (manager.roster && !manager.managerID) {
				managersOutOfDate = true;
				resize(el?.getBoundingClientRect(), true);
				break;
			}
		}
	}

	const year = new Date().getFullYear();

	$: resize(el?.getBoundingClientRect(), false, innerWidth);
</script>

<svelte:window bind:innerWidth={innerWidth} />

<style>
	footer {
		background: linear-gradient(180deg, transparent, rgba(12, 18, 16, 0.9)), var(--field);
		width: 100%;
		display: block;
		position: absolute;
		bottom: 0;
		z-index: 1;
		border-top: 1px solid rgba(232, 228, 217, 0.08);
		padding: 2.5rem 1.25rem 3.5rem;
		text-align: center;
		color: var(--mist);
	}

	.footer-brand {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.15rem;
		letter-spacing: -0.03em;
		color: var(--chalk);
		margin: 0 0 1.25rem;
	}

	.footer-brand span {
		color: var(--copper);
	}

	#navigation {
		margin: 0 0 1.75rem;
	}

	#navigation ul {
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.15rem 0.35rem;
	}

	#navigation ul li {
		list-style-type: none;
	}

	.navLink {
		display: inline-block;
		cursor: pointer;
		padding: 0.4rem 0.7rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--mist);
		transition: color 0.2s ease;
	}

	.navLink:hover {
		color: var(--copper-bright);
	}

	.updateNotice {
		color: var(--chalk);
		font-style: italic;
		font-size: 0.8em;
		margin: 0 auto 1rem;
		max-width: 36rem;
	}

	.meta {
		font-size: 0.8rem;
		line-height: 1.7;
	}

	a {
		color: var(--copper-bright);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>

<div class="footerSpacer" style="height: {footerHeight}px;"></div>

<footer bind:this={el}>
	{#if managersOutOfDate}
		<p class="updateNotice">
			Your managers page needs an update,
			<a href="https://github.com/pmann8/soup-hat-dynasty/blob/souphat/TRAINING_WHEELS.md#iv-managers"
				>please follow the instructions</a
			>
			to get the most up-to-date experience.
		</p>
	{/if}
	<p class="footer-brand">{leagueName.split(' ')[0]} <span>{leagueName.split(' ').slice(1).join(' ')}</span></p>
	<div id="navigation">
		<ul>
			{#each tabs as tab}
				{#if !tab.nest}
					<li>
						<div class="navLink" onclick={() => goto(tab.dest)}>{tab.label}</div>
					</li>
				{:else}
					{#each tab.children as child}
						{#if child.label != 'Managers' || managers.length > 0}
							<li>
								<div class="navLink" onclick={() => goto(child.dest)}>{child.label}</div>
							</li>
						{/if}
					{/each}
				{/if}
			{/each}
		</ul>
	</div>
	<div class="meta">
		<span class="copyright"
			>&copy; 2021 - {year} <a href="https://github.com/pmann8/soup-hat-dynasty">Soup Hat Dynasty</a></span
		>
		<br />
		<span class="creator">Built by <a href="http://www.nmelhado.com/">Nicholas Melhado</a></span>
		<br />
		<span class="maintained">Maintained by Patrick Mann</span>
	</div>
</footer>
