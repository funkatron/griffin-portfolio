/**
 * Batch-resize source renders into web-optimized assets.
 *
 * Usage:
 *   1. Place originals in ./sources/ (png, jpg, tiff, webp)
 *   2. node scripts/prepare-images.mjs
 *   3. Update piece frontmatter hero/gallery paths to /works/<slug>/hero.webp etc.
 *
 * Requires: npm install sharp (devDependency) when real assets are ready.
 */
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sourcesDir = path.join(root, 'sources');
const outRoot = path.join(root, 'public', 'works');

const WIDTHS = {
	thumb: 800,
	hero: 2400,
	og: 1200,
};

const SUPPORTED = new Set(['.png', '.jpg', '.jpeg', '.tif', '.tiff', '.webp']);

async function loadSharp() {
	try {
		return (await import('sharp')).default;
	} catch {
		console.error(
			'sharp is not installed. Run: npm install --save-dev sharp\nThen re-run this script.',
		);
		process.exit(1);
	}
}

async function processFile(sharp, filePath, baseName) {
	const outDir = path.join(outRoot, baseName);
	await mkdir(outDir, { recursive: true });

	const image = sharp(filePath);

	for (const [variant, width] of Object.entries(WIDTHS)) {
		const outPath = path.join(outDir, `${variant}.webp`);
		const pipeline = image.clone().resize({ width, withoutEnlargement: true });
		if (variant === 'og') {
			await pipeline
				.resize(1200, 630, { fit: 'cover', position: 'centre' })
				.webp({ quality: 82 })
				.toFile(outPath);
		} else {
			await pipeline.webp({ quality: variant === 'thumb' ? 78 : 85 }).toFile(outPath);
		}
		console.log(`  wrote ${path.relative(root, outPath)}`);
	}
}

async function main() {
	const sharp = await loadSharp();
	let entries;

	try {
		entries = await readdir(sourcesDir, { withFileTypes: true });
	} catch {
		console.error(`No sources directory at ${sourcesDir}. Create it and add image files.`);
		process.exit(1);
	}

	const files = entries.filter((entry) => entry.isFile());
	if (files.length === 0) {
		console.error(`No files in ${sourcesDir}.`);
		process.exit(1);
	}

	await mkdir(outRoot, { recursive: true });

	for (const file of files) {
		const ext = path.extname(file.name).toLowerCase();
		if (!SUPPORTED.has(ext)) continue;
		const baseName = path.basename(file.name, ext);
		console.log(`Processing ${file.name}…`);
		await processFile(sharp, path.join(sourcesDir, file.name), baseName);
	}

	console.log('Done. Update src/content/pieces/*.mdx hero paths to /works/<baseName>/hero.webp');
}

main();
