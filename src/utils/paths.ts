/** Prefix an app path with Astro's configured base (for subpath deploys). */
export function pathWithBase(path: string): string {
	const base = import.meta.env.BASE_URL;
	const normalized = path.startsWith('/') ? path : `/${path}`;
	if (!base || base === '/') return normalized;
	const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${baseTrimmed}${normalized}`;
}
