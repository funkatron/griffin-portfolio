import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'placeholders');

const palettes = [
	['#0b0b0b', '#f5f5f0'],
	['#1a1a2e', '#e94560'],
	['#16213e', '#0f3460'],
	['#2d132c', '#ee4540'],
	['#1b262c', '#3282b8'],
	['#222831', '#00adb5'],
	['#393e46', '#f38181'],
	['#2c3333', '#c84b31'],
	['#3d0000', '#ff9494'],
	['#1c0a00', '#ff7b00'],
	['#0a0a0a', '#d4d4d4'],
	['#101010', '#fafafa'],
];

function svg(label, bg, fg, aspect = '3/2') {
	const [w, h] = aspect === '3/2' ? [1200, 800] : [1200, 630];
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="48" font-weight="700" letter-spacing="0.2em">${label}</text>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" opacity="0.5" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" letter-spacing="0.35em">PLACEHOLDER</text>
</svg>`;
}

const specs = [];

for (let i = 1; i <= 12; i += 1) {
	const id = String(i).padStart(2, '0');
	const [bg, fg] = palettes[(i - 1) % palettes.length];
	specs.push({ name: `ad-${id}.svg`, label: `AD ${id}`, bg, fg });
	specs.push({ name: `ad-${id}-process.svg`, label: `PROC ${id}`, bg: fg, fg: bg });
}

for (let i = 1; i <= 15; i += 1) {
	const id = String(i).padStart(2, '0');
	const [bg, fg] = palettes[(i + 3) % palettes.length];
	specs.push({ name: `other-${id}.svg`, label: `OT ${id}`, bg, fg });
}

specs.push({ name: 'og-astronaut-dreams.svg', label: 'ASTRONAUT DREAMS', bg: '#0b0b0b', fg: '#f5f5f0', aspect: 'og' });
specs.push({ name: 'og-home.svg', label: 'GRIFFIN', bg: '#101010', fg: '#fafafa', aspect: 'og' });

await mkdir(outDir, { recursive: true });

for (const spec of specs) {
	const content = svg(spec.label, spec.bg, spec.fg, spec.aspect ?? '3/2');
	await writeFile(path.join(outDir, spec.name), content, 'utf8');
}

console.log(`Wrote ${specs.length} placeholders to ${outDir}`);
