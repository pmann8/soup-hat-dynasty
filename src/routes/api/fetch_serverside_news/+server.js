import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { waitForAll } from '$lib/utils/helperFunctions/multiPromise';
import { dynasty } from '$lib/utils/helper';
import { json } from '@sveltejs/kit';

const FF_BALLERS = 'https://thefantasyfootballers.libsyn.com/fantasyfootball';
const DYNASTY_LEAGUE = 'https://dynastyleaguefootball.com/feed/';
const DYNASTY_NERDS = 'https://www.dynastynerds.com/feed/';
const REDDIT_DYNASTY = 'https://www.reddit.com/r/DynastyFF/new.json';
const REDDIT_FANTASY = 'https://www.reddit.com/r/fantasyfootball/new.json';

export async function GET() {
	const articles = [getXMLArticles(FF_BALLERS, processFF)];

	if (dynasty) {
		articles.push(getXMLArticles(DYNASTY_LEAGUE, processDynastyLeague));
		articles.push(getXMLArticles(DYNASTY_NERDS, processDynastyNerds));
		articles.push(getRedditArticles(REDDIT_DYNASTY));
	} else {
		articles.push(getRedditArticles(REDDIT_FANTASY));
	}

	const responses = await waitForAll(...articles).catch((err) => {
		console.error(err);
		return [];
	});

	let finalArticles = [];

	for (const response of responses ?? []) {
		if (Array.isArray(response)) {
			finalArticles = [...finalArticles, ...response];
		}
	}

	return json(finalArticles);
}

const getXMLArticles = async (url, callback) => {
	const res = await fetch(url, {
		headers: { 'User-Agent': 'soup-hat-dynasty/1.0' },
	}).catch((err) => {
		console.error(err);
		return null;
	});
	if (!res?.ok) return [];

	const text = await res.text().catch((err) => {
		console.error(err);
		return null;
	});
	if (!text) return [];

	let xmlData;
	if (XMLValidator.validate(text) === true) {
		const parser = new XMLParser();
		xmlData = parser.parse(text);
	}

	const items = xmlData?.rss?.channel?.item;
	if (!items) return [];

	return callback(Array.isArray(items) ? items : [items]);
};

const getRedditArticles = async (url) => {
	const res = await fetch(url, {
		headers: { 'User-Agent': 'soup-hat-dynasty/1.0' },
	}).catch((err) => {
		console.error(err);
		return null;
	});
	if (!res?.ok) return [];

	const data = await res.json().catch((err) => {
		console.error(err);
		return null;
	});
	if (!data?.data?.children) return [];

	return processReddit(data.data);
};

const processReddit = (rawArticles) => {
	const bannedAuthors = ['AutoModerator', 'FFBot', 'Brookskbrothers', 'FTAKJ'];
	const bannedIcons = ['', 'self', 'thumbnail', 'default'];
	let finalArticles = [];
	const children = rawArticles.children;

	for (const rawArticle of children) {
		const data = rawArticle.data;
		if (bannedAuthors.includes(data.author)) continue;

		const ts = data.created_utc * 1000;
		const d = new Date(ts);
		const icon = !bannedIcons.includes(data.thumbnail)
			? data.thumbnail
			: `newsIcons/${data.subreddit}.png`;
		const date = stringDate(d);
		let article = `<a href="${data.url}" class="body-link">${data.url}</a>`;
		if (data.selftext_html) {
			article = decodeHTML(data.selftext_html);
		}

		finalArticles.push({
			title: data.title,
			article,
			link: `https://www.reddit.com${data.permalink}`,
			author: `${data.subreddit_name_prefixed} - u/${data.author}`,
			ts,
			date,
			icon,
		});
	}

	return finalArticles;
};

const htmlEntities = {
	nbsp: ' ',
	cent: '¢',
	pound: '£',
	yen: '¥',
	euro: '€',
	copy: '©',
	reg: '®',
	lt: '<',
	gt: '>',
	quot: '"',
	amp: '&',
	apos: "'",
};

function decodeHTML(str) {
	return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
		let match;

		if (entityCode in htmlEntities) {
			return htmlEntities[entityCode];
		} else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
			return String.fromCharCode(parseInt(match[1], 16));
		} else if ((match = entityCode.match(/^#(\d+)$/))) {
			return String.fromCharCode(~~match[1]);
		}
		return entity;
	});
}

const processFF = (articles) => {
	let finalArticles = [];
	for (const article of articles.slice(0, 5)) {
		const ts = Date.parse(article.pubDate);
		const d = new Date(ts);
		const date = stringDate(d);
		finalArticles.push({
			title: article.title,
			article: article.description,
			link: article.link,
			author: `Fantasy Footballers`,
			ts,
			date,
			icon: 'newsIcons/ffballers.jpeg',
		});
	}
	return finalArticles;
};

const processDynastyLeague = (articles) => {
	let finalArticles = [];
	for (const article of articles) {
		const ts = Date.parse(article.pubDate);
		const d = new Date(ts);
		const date = stringDate(d);
		finalArticles.push({
			title: article.title,
			article: article.description,
			link: article.link,
			author: `Dynasty League Football`,
			ts,
			date,
			icon: 'newsIcons/dynastyLeague.png',
		});
	}
	return finalArticles;
};

const processDynastyNerds = (articles) => {
	let finalArticles = [];
	for (const article of articles) {
		const ts = Date.parse(article.pubDate);
		const d = new Date(ts);
		const date = stringDate(d);
		finalArticles.push({
			title: article.title,
			article: article.description,
			link: article.link,
			author: `Dynasty Nerds`,
			ts,
			date,
			icon: 'newsIcons/dynastyNerds.jpeg',
		});
	}
	return finalArticles;
};

const stringDate = (d) => {
	return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${(d.getMinutes() < 10 ? '0' : '') + d.getMinutes()}`;
};
