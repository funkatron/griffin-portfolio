import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const piecesDir = path.join(__dirname, '..', 'src', 'content', 'pieces');
const seriesDir = path.join(__dirname, '..', 'src', 'content', 'series');

const adTitles = [
	'Floating Habitat',
	'Visor Reflection',
	'Orbital Garden',
	'Dust Wake',
	'Sleep Chamber',
	'Signal Bloom',
	'Thin Atmosphere',
	'Drift Corridor',
	'Soft Landing',
	'Star Pool',
	'Quiet Thruster',
	'Last Window',
];

const otherTitles = [
	'Chrome Monolith',
	'Basalt Figure',
	'Liquid Crown',
	'Wire Saint',
	'Null Cathedral',
	'Thermal Ghost',
	'Glass Orchard',
	'Concrete Halo',
	'Obsidian Veil',
	'Polar Bloom',
	'Static Relic',
	'Mineral Choir',
	'Void Pedestal',
	'Carbon Lily',
	'Rift Portrait',
];

function pieceMdx({ slug, title, series, year, featured, hero, order, description, process }) {
	const lines = [
		'---',
		`title: "${title}"`,
		`series: ${series}`,
		`year: ${year}`,
		`featured: ${featured}`,
		`hero: "${hero}"`,
		`alt: "${title} — 3D render placeholder"`,
	];

	if (order != null) lines.push(`order: ${order}`);
	if (description) lines.push(`description: "${description}"`);
	lines.push('tools: ["Blender", "Cycles"]');
	if (process?.length) {
		lines.push('process:');
		for (const p of process) lines.push(`  - "${p}"`);
	}
	lines.push('---', '');

	return lines.join('\n');
}

await mkdir(piecesDir, { recursive: true });
await mkdir(seriesDir, { recursive: true });

const adSlugs = [];

for (let i = 1; i <= 12; i += 1) {
	const id = String(i).padStart(2, '0');
	const slug = `astronaut-dreams-${id}`;
	adSlugs.push(slug);
	const process =
		i === 1
			? [
					'/placeholders/ad-01-process.svg',
					'/placeholders/ad-02-process.svg',
					'/placeholders/ad-03-process.svg',
					'/placeholders/ad-04-process.svg',
					'/placeholders/ad-05-process.svg',
					'/placeholders/ad-06-process.svg',
				]
			: undefined;

	const content = pieceMdx({
		slug,
		title: adTitles[i - 1],
		series: 'astronaut-dreams',
		year: 2024,
		featured: true,
		hero: `/placeholders/ad-${id}.svg`,
		order: i,
		description: `Part of Astronaut Dreams. Placeholder still ${id} of 12.`,
		process,
	});

	await writeFile(path.join(piecesDir, `${slug}.mdx`), content, 'utf8');
}

for (let i = 1; i <= 15; i += 1) {
	const id = String(i).padStart(2, '0');
	const slug = `other-${id}`;
	const content = pieceMdx({
		slug,
		title: otherTitles[i - 1],
		series: 'other',
		year: i <= 8 ? 2024 : 2023,
		featured: true,
		hero: `/placeholders/other-${id}.svg`,
		description: `Personal work. Placeholder still ${id}.`,
	});

	await writeFile(path.join(piecesDir, `${slug}.mdx`), content, 'utf8');
}

const seriesMdx = `---
title: "Astronaut Dreams"
statement: "Twelve digital stills tracing solitude, machinery, and wonder in near-space. A community-facing exhibition presented as a numbered sequence — purely digital works."
colophon: "Rendered in Blender / Cycles. Digital works only. 12 pieces, 2024."
pieceSlugs:
${adSlugs.map((s) => `  - ${s}`).join('\n')}
ogImage: "/placeholders/og-astronaut-dreams.svg"
yearStart: 2024
yearEnd: 2024
processPieceSlug: astronaut-dreams-01
---

Astronaut Dreams is a closed-loop exhibition: twelve scenes, one sequence, no physical editions.
`;

await writeFile(path.join(seriesDir, 'astronaut-dreams.mdx'), seriesMdx, 'utf8');
console.log('Seeded 27 pieces and 1 series file.');
