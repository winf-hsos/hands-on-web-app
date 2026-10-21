// Content collections over the knowledge base. Every folder holds one lead
// file (with `type` or `kind`) and optionally a translation; both are entries
// here, with ids of the form "<folder>/<lang>". src/lib/knowledge.ts joins
// them and checks everything that spans more than one file.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { vocabulary } from './lib/vocabulary';

const lang = z.enum(['de', 'en']);
const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are kebab case');
const code = z.number().int().min(1000).max(9999);
const date = z.coerce.date();
const keyOf = (record: Record<string, unknown>) =>
  z.enum(Object.keys(record) as [string, ...string[]]);

// "<folder>/de.md" -> "<folder>/de"
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const translation = z.strictObject({
  title: z.string(),
  summary: z.string(),
  translation_of: lang,
  based_on: date,
});

const step = z.union([id, z.object({ item: id, optional: z.boolean().default(false) })]);

const relations = z
  .object(
    Object.fromEntries(Object.keys(vocabulary.relations).map((r) => [r, z.array(id).optional()])),
  )
  .strict();

const itemLead = z
  .object({
    type: keyOf(vocabulary.types),
    code,
    title: z.string(),
    summary: z.string(),
    level: z.number().int().min(1).max(4),
    duration: z.number().int().positive(),
    topics: z.array(keyOf(vocabulary.topics)).min(1),
    modules: z.array(keyOf(vocabulary.modules)).default([]),
    optional: z.boolean().default(false),
    relations: relations.default({}),
    access: z.enum(['public', 'code']).default('public'),
    status: z.enum(['draft', 'published']),
    updated: date,
    // type-specific
    url: z.url().optional(),
    license: z.string().optional(),
    authors: z.array(z.string()).optional(),
    year: z.number().int().optional(),
    doi: z.string().optional(),
    publisher: z.string().optional(),
    venue: z.string().optional(),
    when: z.string().optional(),
  })
  .strict();

const pathLead = z
  .object({
    kind: z.literal('path'),
    code,
    title: z.string(),
    summary: z.string(),
    goal: z.string(),
    audience: z.string(),
    level: z.number().int().min(1).max(4),
    requires: z.array(id).default([]),
    steps: z.array(step).min(1),
    status: z.enum(['draft', 'published']),
    updated: date,
  })
  .strict();

const label = z.object({ de: z.string(), en: z.string() });

const courseLead = z
  .object({
    kind: z.literal('course'),
    code,
    access_code: z.string().regex(/^[A-Z0-9-]{4,16}$/, 'access codes are upper case letters, digits and hyphens'),
    module: keyOf(vocabulary.modules),
    semester: z.string(),
    title: z.string(),
    summary: z.string(),
    units: z
      .array(z.object({ title: label, available_from: date.optional(), items: z.array(step).min(1) }))
      .min(1),
    status: z.enum(['draft', 'published']),
    updated: date,
  })
  .strict();

const pageLead = z
  .object({
    kind: z.literal('page'),
    title: z.string(),
    summary: z.string(),
    featured_path: id.optional(),
    samples: z.array(id).default([]),
    updated: date,
  })
  .strict();

// A file is checked either as lead or as translation, decided by
// `translation_of`. A plain union would report "did not match union"
// instead of naming the missing field.
function leadOrTranslation<L extends z.ZodType, T extends z.ZodType>(lead: L, tr: T) {
  return z.looseObject({}).transform((data, ctx): z.output<L> | z.output<T> => {
    const result = ('translation_of' in data ? tr : lead).safeParse(data);
    if (result.success) return result.data as z.output<L> | z.output<T>;
    for (const issue of result.error.issues) {
      ctx.addIssue({ code: 'custom', path: issue.path, message: issue.message });
    }
    return z.NEVER;
  });
}

const loader = (folder: string) => glob({ pattern: '*/{de,en}.md', base: `./knowledge/${folder}`, generateId });

export const collections = {
  content: defineCollection({ loader: loader('content'), schema: leadOrTranslation(itemLead, translation) }),
  paths: defineCollection({
    loader: loader('paths'),
    schema: leadOrTranslation(pathLead, translation.extend({ goal: z.string(), audience: z.string() })),
  }),
  courses: defineCollection({ loader: loader('courses'), schema: leadOrTranslation(courseLead, translation) }),
  pages: defineCollection({ loader: loader('pages'), schema: leadOrTranslation(pageLead, translation) }),
};
