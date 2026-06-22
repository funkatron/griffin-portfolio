/**
 * Validate content catalog ↔ MDX ↔ public assets (exit 1 on failure).
 */
import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { astronautDreams, otherWorks } from './content-catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const piecesDir = path.join(root, 'src', 'content', 'pieces');
const worksDir = path.join(root, 'public', 'works');
const seriesPath = path.join(root, 'src', 'content', 'series', 'astronaut-dreams.mdx');

const errors = [];

async function exists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

function parsePieceSlugs(seriesMarkdown) {
	const match = seriesMarkdown.match(/^pieceSlugs:\n((?:  - .+\n)+)/m);
	if (!match) return [];
	return [...match[1].matchAll(/  - (.+)/g)].map((m) => m[1].trim());
}

const pieceFiles = (await readdir(piecesDir)).filter((f) => f.endsWith('.mdx'));
const pieceIds = new Set(pieceFiles.map((f) => f.replace(/\.mdx$/, '')));

for (const entry of [...astronautDreams, ...otherWorks]) {
	if (!pieceIds.has(entry.id)) {
		errors.push(`Missing MDX: src/content/pieces/${entry.id}.mdx`);
	}
	const heroFile = path.join(worksDir, `${entry.key}.jpg`);
	if (!(await exists(heroFile))) {
		errors.push(`Missing hero file: public/works/${entry.key}.jpg (for ${entry.id})`);
	}
}

const seriesMarkdown = await readFile(seriesPath, 'utf8');
const slugs = parsePieceSlugs(seriesMarkdown);

if (slugs.length !== 12) {
	errors.push(`astronaut-dreams pieceSlugs must have 12 entries (found ${slugs.length})`);
}

for (const slug of slugs) {
	if (!pieceIds.has(slug)) {
		errors.push(`Series references missing piece: ${slug}`);
	}
}

const expectedOrder = astronautDreams.map((p) => p.id);
if (JSON.stringify(slugs) !== JSON.stringify(expectedOrder)) {
	errors.push('Series pieceSlugs order does not match content-catalog.mjs');
}

if (errors.length > 0) {
	console.error('Content validation failed:\n');
	for (const error of errors) {
		console.error(`  - ${error}`);
	}
	process.exit(1);
}

console.log(`Content validation passed (${pieceIds.size} pieces, series OK).`);
