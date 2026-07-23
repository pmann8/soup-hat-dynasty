<script>
	import NavSmall from './NavSmall.svelte';
	import NavLarge from './NavLarge.svelte';
	import { page } from '$app/state';
	import { leagueName } from '$lib/utils/helper';

	if (typeof window !== 'undefined') {
		let themeLink = document.head.querySelector('#theme');
		if (!themeLink) {
			themeLink = document.createElement('link');
			themeLink.rel = 'stylesheet';
			themeLink.id = 'theme';
			themeLink.href = '/smui.css';
			document.head.appendChild(themeLink);
		}
	}

	const path = $derived(page.url.pathname);
	const pageTitle = $derived(
		!path[1] ? 'Home' : path[1].charAt(0).toUpperCase() + path.slice(2)
	);
</script>

<svelte:head>
	<title>{pageTitle} | {leagueName}</title>
</svelte:head>

<style>
	nav {
		position: sticky;
		top: 0;
		z-index: 20;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1rem;
		padding: 0.65rem 1.25rem;
		background: transparent;
		border-bottom: 1px solid rgba(232, 228, 217, 0.08);
		overflow: visible;
	}

	/* Keep blur on a pseudo so position:fixed drawer/menu aren't trapped */
	nav::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: rgba(12, 18, 16, 0.82);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		pointer-events: none;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: var(--chalk);
		min-width: 0;
	}

	.brand:hover .brand-name {
		color: var(--copper-bright);
	}

	#logo {
		width: 42px;
		height: 42px;
		object-fit: cover;
		border-radius: 50%;
		border: 1px solid rgba(196, 132, 60, 0.45);
		background: var(--panel);
		flex-shrink: 0;
	}

	.brand-copy {
		display: flex;
		flex-direction: column;
		line-height: 1.05;
		min-width: 0;
	}

	.brand-name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.05rem;
		letter-spacing: -0.03em;
		transition: color 0.2s ease;
		white-space: nowrap;
	}

	.brand-tag {
		font-size: 0.65rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--mist);
		font-weight: 500;
	}

	.large {
		display: flex;
		justify-content: center;
		min-width: 0;
		overflow: visible;
	}

	.small {
		display: none;
		justify-content: flex-end;
	}

	@media (max-width: 950px) {
		nav {
			grid-template-columns: 1fr auto;
			padding: 0.75rem 1rem;
		}

		.large {
			display: none;
		}

		.small {
			display: flex;
		}

		.brand-tag {
			display: none;
		}
	}
</style>

<nav>
	<a class="brand" href="/">
		<img id="logo" alt="{leagueName} crest" src="/badge.png" />
		<span class="brand-copy">
			<span class="brand-name">{leagueName}</span>
			<span class="brand-tag">Dynasty League</span>
		</span>
	</a>

	<div class="large">
		<NavLarge />
	</div>

	<div class="small">
		<NavSmall />
	</div>
</nav>
