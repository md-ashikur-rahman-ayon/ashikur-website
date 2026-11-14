import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notebook = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/notebook' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional().default(''),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().default(''),
    summary: z.string().default(''),
    readingTime: z.number().default(4),
    mediumUrl: z.string().nullish(),
    drawing: z.string().default('none'),
    caption: z.string().default(''),
  }),
});

export const collections = { notebook };
