import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const playgrounds = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/playgrounds" }),
  schema: ({ image }) =>
    z.object({
      // Shared by every product
      title: z.string(),
      status: z.enum(["available", "coming-soon"]),
      order: z.number(),
      // `summary` = the home Featured-card copy (longer). `cardSummary` = the
      // catalog-grid copy (shorter); the source trims it on the catalog page.
      // ProductCard falls back to `summary` when `cardSummary` is absent
      // (coming-soon products only appear on catalog and need just one copy).
      summary: z.string(),
      cardSummary: z.string().optional(),
      badge: z.object({ text: z.string(), color: z.string() }).optional(),

      // Available products (have a photo + detail page)
      image: image().optional(),
      seoDescription: z.string().optional(),
      eyebrow: z.object({ text: z.string(), color: z.string() }).optional(),
      heroIntro: z.string().optional(),
      feature: z
        .object({
          heading: z.string(),
          body: z.string(),
          points: z.array(z.string()),
        })
        .optional(),
      stats: z
        .array(z.object({ value: z.string(), label: z.string(), color: z.string() }))
        .optional(),
      gallery: z.array(image()).optional(),
      ctaHeading: z.string().optional(),
      ctaBody: z.string().optional(),

      // Coming-soon products (colored placeholder panel + icon)
      placeholder: z
        .object({
          color: z.string(),
          icon: z.enum(["clock", "cloud", "face", "cube"]),
        })
        .optional(),
    }),
});

export const collections = { playgrounds };
