import { getCollection, type CollectionEntry } from 'astro:content';

export type Piece = CollectionEntry<'pieces'>;

export async function getAllPieces(): Promise<Piece[]> {
	return (await getCollection('pieces')).sort((a, b) => {
		const orderA = a.data.order ?? 999;
		const orderB = b.data.order ?? 999;
		if (orderA !== orderB) return orderA - orderB;
		return b.data.year - a.data.year;
	});
}

export async function getFeaturedPieces(): Promise<Piece[]> {
	return (await getAllPieces()).filter((piece) => piece.data.featured);
}

export async function getPieceBySlug(slug: string): Promise<Piece | undefined> {
	return (await getAllPieces()).find((piece) => piece.id === slug);
}

export async function getPiecesBySeries(
	series: Piece['data']['series'],
): Promise<Piece[]> {
	return (await getAllPieces()).filter((piece) => piece.data.series === series);
}

export function filterPieces(
	pieces: Piece[],
	options: { series?: string | null; year?: string | null },
): Piece[] {
	return pieces.filter((piece) => {
		if (options.series && options.series !== 'all' && piece.data.series !== options.series) {
			return false;
		}
		if (options.year && options.year !== 'all' && String(piece.data.year) !== options.year) {
			return false;
		}
		return true;
	});
}

export function getSeriesNeighbors(
	pieces: Piece[],
	currentSlug: string,
): { prev: Piece | null; next: Piece | null } {
	const index = pieces.findIndex((piece) => piece.id === currentSlug);
	if (index === -1) return { prev: null, next: null };
	return {
		prev: index > 0 ? pieces[index - 1] : null,
		next: index < pieces.length - 1 ? pieces[index + 1] : null,
	};
}

export function getUniqueYears(pieces: Piece[]): number[] {
	return [...new Set(pieces.map((piece) => piece.data.year))].sort((a, b) => b - a);
}
