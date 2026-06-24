/**
 * Crawl a deployed Griffin Portfolio site for broken internal links and assets.
 *
 * Usage:
 *   node scripts/crawl-site.mjs
 *   node scripts/crawl-site.mjs https://funkatron.github.io/griffin-portfolio
 */
const startArg = process.argv[2] ?? 'https://funkatron.github.io/griffin-portfolio';
const startUrl = new URL(startArg.endsWith('/') ? startArg : `${startArg}/`);
const ORIGIN = startUrl.origin;
const BASE = startUrl.pathname.replace(/\/$/, '');

const visitedPages = new Set();
const checkedAssets = new Map();
const broken = [];
const queue = [startUrl.href];

function normalizePageUrl(href, pageUrl) {
	try {
		const u = new URL(href, pageUrl);
		if (u.origin !== ORIGIN) return null;
		const path = u.pathname.replace(/\/$/, '') || '/';
		const baseNorm = BASE || '';
		if (baseNorm && path !== baseNorm && !path.startsWith(`${baseNorm}/`)) return null;
		return u.origin + u.pathname + (u.pathname.endsWith('/') ? '' : '/');
	} catch {
		return null;
	}
}

function resolveAsset(href, pageUrl) {
	try {
		const u = new URL(href, pageUrl);
		if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
		return u.href;
	} catch {
		return null;
	}
}

function isAssetPath(pathname) {
	return /\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff2?|mp4|webm|json|xml|txt)$/i.test(pathname);
}

async function checkUrl(url, kind, from) {
	if (checkedAssets.has(url)) return checkedAssets.get(url);
	try {
		const r = await fetch(url, { redirect: 'follow' });
		const ok = r.status >= 200 && r.status < 400;
		checkedAssets.set(url, r.status);
		if (!ok) broken.push({ url, status: r.status, kind, from });
		return r.status;
	} catch (error) {
		checkedAssets.set(url, 0);
		broken.push({ url, status: 'ERR', kind, from, error: String(error?.message ?? error) });
		return 0;
	}
}

function extractFromHtml(html, pageUrl) {
	const links = new Set();
	const assets = new Set();

	for (const m of html.matchAll(/\shref=["']([^"']+)["']/gi)) {
		const raw = m[1].trim();
		if (!raw || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:'))
			continue;
		const page = normalizePageUrl(raw, pageUrl);
		if (page) links.add(page);
		else {
			const asset = resolveAsset(raw, pageUrl);
			if (asset?.startsWith(ORIGIN)) assets.add(asset);
		}
	}

	for (const m of html.matchAll(/\ssrc=["']([^"']+)["']/gi)) {
		const asset = resolveAsset(m[1].trim(), pageUrl);
		if (asset) assets.add(asset);
	}

	for (const m of html.matchAll(/\ssrcset=["']([^"']+)["']/gi)) {
		for (const part of m[1].split(',')) {
			const asset = resolveAsset(part.trim().split(/\s+/)[0], pageUrl);
			if (asset) assets.add(asset);
		}
	}

	for (const m of html.matchAll(/(?:content|href)=["']([^"']+)["']/gi)) {
		const val = m[1].trim();
		if (val.startsWith('http') || val.startsWith('/')) {
			const asset = resolveAsset(val, pageUrl);
			if (asset?.startsWith(ORIGIN) && isAssetPath(new URL(asset).pathname)) assets.add(asset);
		}
	}

	return { links, assets };
}

while (queue.length) {
	const pageUrl = queue.shift();
	const key = pageUrl.replace(/\/$/, '') || pageUrl;
	if (visitedPages.has(key)) continue;
	visitedPages.add(key);

	let html;
	try {
		const r = await fetch(pageUrl, { redirect: 'follow' });
		if (!r.ok) {
			broken.push({ url: pageUrl, status: r.status, kind: 'page', from: 'crawl' });
			continue;
		}
		html = await r.text();
	} catch (error) {
		broken.push({ url: pageUrl, status: 'ERR', kind: 'page', from: 'crawl', error: String(error?.message ?? error) });
		continue;
	}

	const { links, assets } = extractFromHtml(html, pageUrl);
	for (const link of links) {
		const lk = link.replace(/\/$/, '') || link;
		if (!visitedPages.has(lk) && !queue.includes(link)) queue.push(link);
	}
	for (const asset of assets) await checkUrl(asset, 'asset', pageUrl);
}

console.log(`Crawled ${visitedPages.size} pages, ${checkedAssets.size} assets`);
if (broken.length) {
	console.error(`Broken: ${broken.length}`);
	for (const b of broken) console.error(`[${b.status}] ${b.kind}: ${b.url}\n       from: ${b.from}`);
	process.exit(1);
}
console.log('All pages and assets OK.');
