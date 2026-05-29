import { defineCollection, z } from 'astro:content';

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    client: z.string(),
    title: z.string(),
    logo: z.string(),
    challenge: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { cases };
