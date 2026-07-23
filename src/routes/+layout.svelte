<!-- __layout.svelte -->
<script>
	import { Nav, Footer } from '$lib/components';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<style>
	main {
		position: relative;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.content {
		flex: 1 0 auto;
	}
</style>

<main>
	<Nav />
	<div class="content">
		<slot />
	</div>
	<Footer />
</main>
