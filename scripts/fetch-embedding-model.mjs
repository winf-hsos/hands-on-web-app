// Fetches the small text embedding model the meaning-map demonstrator runs in
// the browser (client/meaning-map.js) into vendor/models/, so that the site
// serves it itself and the learner's browser never asks Hugging Face
// (docs/architecture.md, "Embeddings"). Like `npm run fetch-r-packages`, this
// runs once after a fresh checkout; the folder is not in git. The build
// copies it under /assets/vendor/models/.
//
// The model is all-MiniLM-L6-v2 (sentence-transformers, Apache 2.0) in the
// ONNX conversion by Xenova, quantised to 8 bits: about 23 MB, 384 numbers
// per text, English only. It was chosen on 2026-11-05 against bge-small,
// gte-small and two multilingual models because it ranked the sentences of
// the experiment best and spreads its similarities widely, which makes them
// easy to read; the multilingual ones are five times as large.
// Usage: npm run fetch-embedding-model
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const MODEL = 'Xenova/all-MiniLM-L6-v2';
const REVISION = '751bff37182d3f1213fa05d7196b954e230abad9';
const FILES = ['config.json', 'tokenizer.json', 'tokenizer_config.json', 'onnx/model_quantized.onnx'];
const TARGET = join(import.meta.dirname, '..', 'vendor/models', MODEL);

for (const file of FILES) {
  const target = join(TARGET, file);
  if (existsSync(target)) continue;
  const response = await fetch(`https://huggingface.co/${MODEL}/resolve/${REVISION}/${file}`);
  if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, Buffer.from(await response.arrayBuffer()));
  console.log(`${file} fetched`);
}
console.log(`${MODEL} is in vendor/models/`);
