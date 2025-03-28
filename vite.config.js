import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		open: true, // This will open the browser automatically
        host: true // This will make the server accessible from any IP
	}
};

export default config;