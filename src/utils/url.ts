/** Build an absolute URL for meta tags and JSON-LD from a site origin + public path. */
export function absoluteUrl(pathOrUrl: string, site: URL): string {
	if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
		return pathOrUrl;
	}

	const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
	const basePath = site.pathname.replace(/\/$/, '');
	const combined = `${basePath}${normalized}`.replace(/\/{2,}/g, '/');
	return `${site.origin}${combined}`;
}

export function siteOrigin(site: URL | undefined): URL {
	return site ?? new URL('http://localhost:4321');
}
