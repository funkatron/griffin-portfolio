/**
 * Sync MDX content from scripts/content-catalog.mjs.
 *
 * Usage:
 *   node scripts/sync-content.mjs              # MDX + series only (uses existing public/works)
 *   node scripts/sync-content.mjs --from-sources  # also copy sources/{key}.* → public/works/{key}.jpg
 */
import { access, copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { astronautDreams, otherWorks, allAssetKeys } from './content-catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const worksDir = path.join(root, 'public', 'works');
const imagesDir = path.join(root, 'public', 'images');
const sourcesDir = path.join(root, 'sources');
const piecesDir = path.join(root, 'src', 'content', 'pieces');
const fromSources = process.argv.includes('--from-sources');

function pieceMdx(entry, heroPath, series, order) {
	const out = [
		'---',
		`title: "${entry.title}"`,
		`series: ${series}`,
		`year: 2024`,
		`featured: true`,
		`hero: "${heroPath}"`,
		`alt: "${entry.alt}"`,
		`description: "${entry.alt}"`,
	];

	if (series === 'astronaut-dreams' && order != null) {
		out.push(`order: ${order}`);
	}

	out.push('tools: ["Blender", "Cycles"]');

	if (entry.process?.length) {
		out.push('process:');
		for (const key of entry.process) {
			out.push(`  - "/works/${key}.jpg"`);
		}
	}

	out.push('---', '');
	return out.join('\n');
}

async function fileExists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function importFromSources() {
	let files;
	try {
		files = await readdir(sourcesDir);
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
			console.warn('sources/ not found — skip import (use public/works/ already in repo).');
			return;
		}
		throw error;
	}

	const imported = [];
	for (const key of allAssetKeys) {
		const match = files.find((file) => path.parse(file).name === key);
		if (!match) continue;
		await copyFile(path.join(sourcesDir, match), path.join(worksDir, `${key}.jpg`));
		imported.push(key);
	}

	if (imported.length === 0) {
		console.warn('sources/ exists but no files matched catalog keys.');
	} else {
		console.log(`Imported ${imported.length} file(s) from sources/ → public/works/`);
	}

	if (await fileExists(path.join(sourcesDir, 'generative_growth.png')) ||
		await fileExists(path.join(sourcesDir, 'generative_growth.jpg'))) {
		const splashSrc = (await fileExists(path.join(sourcesDir, 'generative_growth.jpg')))
			? path.join(sourcesDir, 'generative_growth.jpg')
			: path.join(sourcesDir, 'generative_growth.png');
		await copyFile(splashSrc, path.join(imagesDir, 'splash.jpg'));
		console.log('Updated public/images/splash.jpg from sources/generative_growth.*');
	} else if (await fileExists(path.join(worksDir, 'generative_growth.jpg'))) {
		await copyFile(path.join(worksDir, 'generative_growth.jpg'), path.join(imagesDir, 'splash.jpg'));
		console.log('Updated splash from public/works/generative_growth.jpg');
	}
}

await mkdir(worksDir, { recursive: true });
await mkdir(imagesDir, { recursive: true });
await mkdir(piecesDir, { recursive: true });

if (fromSources) {
	await importFromSources();
}

const missing = [];
for (const key of allAssetKeys) {
	if (!(await fileExists(path.join(worksDir, `${key}.jpg`)))) {
		missing.push(key);
	}
}
if (missing.length > 0) {
	console.warn(`Missing public/works images: ${missing.join(', ')}`);
}

for (const [index, entry] of astronautDreams.entries()) {
	const content = pieceMdx(entry, `/works/${entry.key}.jpg`, 'astronaut-dreams', index + 1);
	await writeFile(path.join(piecesDir, `${entry.id}.mdx`), content, 'utf8');
}

for (const entry of otherWorks) {
	const content = pieceMdx(entry, `/works/${entry.key}.jpg`, 'other');
	await writeFile(path.join(piecesDir, `${entry.id}.mdx`), content, 'utf8');
}

await writeFile(
	path.join(root, 'src', 'content', 'series', 'astronaut-dreams.mdx'),
	`---
title: "Astronaut Dreams"
statement: "Twelve digital stills tracing solitude, machinery, and wonder — astronauts adrift between architecture, weather, and void. A numbered exhibition of purely digital works."
colophon: "Rendered in Blender / Cycles. Digital works only. 12 pieces, 2024."
pieceSlugs:
${astronautDreams.map((p) => `  - ${p.id}`).join('\n')}
ogImage: "/works/anotherastronaught.jpg"
yearStart: 2024
yearEnd: 2024
processPieceSlug: astronaut-dreams-05
---

Astronaut Dreams is a closed-loop exhibition: twelve scenes, one sequence, digital-only presentation.
`,
	'utf8',
);

console.log('Synced series + 14 piece MDX files from content-catalog.mjs');
