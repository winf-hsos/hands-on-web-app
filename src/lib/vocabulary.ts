// knowledge/vocabulary.yaml, read once at build time.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

export type Lang = 'de' | 'en';
export type Label = Record<Lang, string>;

export interface Vocabulary {
  types: Record<string, Label & { icon?: string }>;
  relations: Record<string, Label & { inverse?: Label; symmetric?: boolean }>;
  levels: Record<string, Label>;
  topics: Record<string, Label & { color?: string }>;
  modules: Record<string, Label>;
}

export const vocabulary = yaml.load(
  readFileSync(join(process.cwd(), 'knowledge', 'vocabulary.yaml'), 'utf8'),
) as Vocabulary;
