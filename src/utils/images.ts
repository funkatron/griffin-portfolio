export type ImageVariant = 'thumb' | 'hero' | 'og';

export function imageSizes(variant: ImageVariant): { width: number; height?: number } {
	switch (variant) {
		case 'thumb':
			return { width: 800 };
		case 'hero':
			return { width: 2400 };
		case 'og':
			return { width: 1200, height: 630 };
	}
}

export function isSvg(path: string): boolean {
	return path.endsWith('.svg');
}
