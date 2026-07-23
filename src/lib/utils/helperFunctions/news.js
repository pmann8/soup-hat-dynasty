import { waitForAll } from './multiPromise';
import { get } from 'svelte/store';
import { news } from '$lib/stores';

const SERVER_API = '/api/fetch_serverside_news';

export const getNews = async (servFetch, bypass = false) => {
	if (get(news)[0] && !bypass) {
		return { articles: get(news), fresh: false };
	}

	const smartFetch = servFetch ?? fetch;
	const serverRes = await smartFetch(SERVER_API, { compress: true }).catch((err) => {
		console.error(err);
		return null;
	});

	let articles = [];
	if (serverRes?.ok) {
		articles = await serverRes.json().catch((err) => {
			console.error(err);
			return [];
		});
	}

	if (!Array.isArray(articles)) articles = [];

	articles = [...articles].sort((a, b) => (a.ts < b.ts ? 1 : -1));
	news.update(() => articles);

	return { articles, fresh: true };
};

export const stringDate = (d) => {
	return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${d.getHours() % 12}:${(d.getMinutes() < 10 ? '0' : '') + d.getMinutes()}${d.getHours() / 12 >= 1 ? 'PM' : 'AM'}`;
};
