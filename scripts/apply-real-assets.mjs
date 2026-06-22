import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const assetsDir = path.join(
	root,
	'..',
	'..',
	'.cursor',
	'projects',
	'Users-coj-src-griffin-portfolio',
	'assets',
);

// Fallback if relative path differs — also check workspace assets path
const assetSources = {
	anotherastronaught:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/anotherastronaught-dfd2c266-e45a-48c6-b292-824fe735a782.png',
	spaceman:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/spaceman-b799a98a-2e6b-4e9a-8bb1-dd2d8acfe0b1.png',
	cloud_space_man:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/cloud_space_man-005826f5-fc82-4df3-aa30-216d746035a5.png',
	non_dustty:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/non_dustty-3f982e7f-9214-4a41-ba23-2fa82454fdf6.png',
	astroroom2:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/astroroom2-dfef5556-30d2-4d7a-b152-8e54c8e5d6ac.png',
	red_halo:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/IMG_9943-66257b6e-ef62-4ddf-b7e4-23a0070bcce5.png',
	untitled:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/untitled-32f20646-0212-4685-ac75-5533a233674d.png',
	spacemanincave:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/spacemanincave-b4df487b-71ae-420d-8e07-f87a90cc1066.png',
	spacemaninwater:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/spacemaninwater-f3db55d8-0a5c-42eb-b149-c271973bf67f.png',
	eevee_next_cave:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/eevee_next_cave-64f0e237-74d2-4484-a92e-e445e1fad790.png',
	smallman:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/smallman-8fca8063-223b-4a45-8af6-5820f4e1248a.png',
	moodycity:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/moodycity-64488a0c-b7ea-474e-a3ed-d7de5cc333e4.png',
	religionpart2:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/religionpart2-2aaf1f0c-250c-423c-ba32-6208e144c335.png',
	generative_growth:
		'/Users/coj/.cursor/projects/Users-coj-src-griffin-portfolio/assets/generative_growth-160f1cfe-1cec-49e0-9ecb-b3dc082d4660.png',
};

const worksDir = path.join(root, 'public', 'works');
const imagesDir = path.join(root, 'public', 'images');

const astronautDreams = [
	{
		slug: 'astronaut-dreams-01',
		key: 'anotherastronaught',
		title: 'Cliffside Watch',
		alt: 'Astronaut on a grassy cliff overlooking calm water toward the horizon',
	},
	{
		slug: 'astronaut-dreams-02',
		key: 'spaceman',
		title: 'Earth in Visor',
		alt: 'Black and white astronaut helmet with Earth reflected in the visor',
	},
	{
		slug: 'astronaut-dreams-03',
		key: 'cloud_space_man',
		title: 'Cloud Harbor',
		alt: 'Astronaut helmet floating in the ocean beneath a massive cloud',
	},
	{
		slug: 'astronaut-dreams-04',
		key: 'non_dustty',
		title: 'Dust Wake',
		alt: 'Astronaut standing on rolling desert dunes with a trailing tether',
	},
	{
		slug: 'astronaut-dreams-05',
		key: 'astroroom2',
		title: 'Abandoned Chamber',
		alt: 'Astronaut helmet on the floor of a dark industrial room lit by a sunbeam',
		process: ['astroroom2', 'spaceman', 'anotherastronaught', 'non_dustty', 'cloud_space_man', 'smallman'],
	},
	{
		slug: 'astronaut-dreams-06',
		key: 'red_halo',
		title: 'Red Halo',
		alt: 'Small astronaut before a towering shrouded figure and a glowing red ring',
	},
	{
		slug: 'astronaut-dreams-07',
		key: 'untitled',
		title: 'Golden Horizon',
		alt: 'Lone figure on reflective water at sunset beneath a vast golden sky',
	},
	{
		slug: 'astronaut-dreams-08',
		key: 'spacemanincave',
		title: 'Cave Threshold',
		alt: 'Astronaut framed in a rocky cave opening overlooking water and clouds',
	},
	{
		slug: 'astronaut-dreams-09',
		key: 'spacemaninwater',
		title: 'Open Water',
		alt: 'Astronaut standing waist-deep in choppy ocean water facing the viewer',
	},
	{
		slug: 'astronaut-dreams-10',
		key: 'eevee_next_cave',
		title: 'Gothic Portal',
		alt: 'Astronaut approaching a gothic stone arch carved into a sunlit cliff',
	},
	{
		slug: 'astronaut-dreams-11',
		key: 'smallman',
		title: 'Violet Architecture',
		alt: 'Tiny figure before a massive translucent purple sculptural structure',
	},
	{
		slug: 'astronaut-dreams-12',
		key: 'moodycity',
		title: 'Submerged Tower',
		alt: 'Astronaut wading toward a lit doorway at the base of a colossal tower in dark water',
	},
];

const otherWorks = [
	{
		slug: 'other-01',
		key: 'generative_growth',
		title: 'Generative Growth',
		alt: 'Translucent crystalline floral forms in pink, white, and violet',
	},
	{
		slug: 'other-02',
		key: 'religionpart2',
		title: 'Sacred Geometry',
		alt: 'Figure in a suit beneath a glowing halo surrounded by enormous hands in orange fog',
	},
];

function pieceMdx(entry, heroPath, series) {
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

	if (series === 'astronaut-dreams' && entry.order != null) {
		out.push(`order: ${entry.order}`);
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

await mkdir(worksDir, { recursive: true });
await mkdir(imagesDir, { recursive: true });

for (const [key, src] of Object.entries(assetSources)) {
	const dest = path.join(worksDir, `${key}.jpg`);
	await copyFile(src, dest);
	console.log(`Copied ${key}.jpg`);
}

await copyFile(assetSources.generative_growth, path.join(imagesDir, 'splash.jpg'));
console.log('Copied splash.jpg');

const piecesDir = path.join(root, 'src', 'content', 'pieces');

for (const [index, entry] of astronautDreams.entries()) {
	entry.order = index + 1;
	const heroPath = `/works/${entry.key}.jpg`;
	const content = pieceMdx(entry, heroPath, 'astronaut-dreams');
	await writeFile(path.join(piecesDir, `${entry.slug}.mdx`), content, 'utf8');
}

for (const entry of otherWorks) {
	const heroPath = `/works/${entry.key}.jpg`;
	const content = pieceMdx(entry, heroPath, 'other');
	await writeFile(path.join(piecesDir, `${entry.slug}.mdx`), content, 'utf8');
}

const seriesPath = path.join(root, 'src', 'content', 'series', 'astronaut-dreams.mdx');
await writeFile(
	seriesPath,
	`---
title: "Astronaut Dreams"
statement: "Twelve digital stills tracing solitude, machinery, and wonder — astronauts adrift between architecture, weather, and void. A numbered exhibition of purely digital works."
colophon: "Rendered in Blender / Cycles. Digital works only. 12 pieces, 2024."
pieceSlugs:
${astronautDreams.map((p) => `  - ${p.slug}`).join('\n')}
ogImage: "/works/anotherastronaught.jpg"
yearStart: 2024
yearEnd: 2024
processPieceSlug: astronaut-dreams-05
---

Astronaut Dreams is a closed-loop exhibition: twelve scenes, one sequence, digital-only presentation.
`,
	'utf8',
);

console.log('Updated astronaut-dreams series and 14 piece MDX files.');
