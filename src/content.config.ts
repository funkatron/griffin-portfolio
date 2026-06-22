import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const imageRef = z.string().min(1);

const pieces = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pieces' }),
	schema: z.object({
		title: z.string(),
		series: z.enum(['astronaut-dreams', 'other']),
		year: z.number().int(),
		featured: z.boolean().default(false),
		hero: imageRef,
		gallery: z.array(imageRef).optional(),
		process: z.array(imageRef).max(6).optional(),
		video: z
			.object({
				src: z.string(),
				poster: z.string(),
			})
			.optional(),
		tools: z.array(z.string()).optional(),
		alt: z.string(),
		description: z.string().optional(),
		order: z.number().int().optional(),
	}),
});

const series = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/series' }),
	schema: z.object({
		title: z.string(),
		statement: z.string(),
		colophon: z.string(),
		pieceSlugs: z.array(z.string()).length(12),
		ogImage: imageRef,
		yearStart: z.number().int(),
		yearEnd: z.number().int(),
		processPieceSlug: z.string(),
	}),
});

export const collections = { pieces, series };
