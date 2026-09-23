import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { parseDocument } from 'yaml';

export const root = dirname(fileURLToPath(import.meta.url));
export function load(file) {
  const document = parseDocument(readFileSync(file, 'utf8'), { uniqueKeys: true });
  if (document.errors.length) throw new Error(document.errors.map(e => e.message).join('; '));
  return document.toJS({ maxAliasCount: 100 });
}

export function validate(directory = root) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const checks = Object.fromEntries(['catalog', 'mapping', 'example'].map(name => [name,
    ajv.compile(JSON.parse(readFileSync(join(directory, 'schema', `${name}.schema.json`), 'utf8')))
  ]));
  const requireSchema = (name, data) => {
    if (!checks[name](data)) throw new Error(ajv.errorsText(checks[name].errors));
  };
  const catalogs = readdirSync(join(directory, 'frameworks'), { withFileTypes: true }).filter(x => x.isDirectory()).map(x => load(join(directory, 'frameworks', x.name, 'catalog.yaml')));
  const readGroup = name => readdirSync(join(directory, name)).filter(n => n.endsWith('.yaml')).sort().map(n => load(join(directory, name, n)));
  const crosswalks = readGroup('crosswalks'), examples = readGroup('examples');
  if (!catalogs.length || !crosswalks.length || !examples.length) throw new Error('A dataset group is missing');
  const controls = new Set(), frameworks = new Set(), mappings = new Set(), exampleIds = new Set();
  for (const catalog of catalogs) {
    requireSchema('catalog', catalog);
    if (frameworks.has(catalog.framework)) throw new Error('Duplicate framework');
    frameworks.add(catalog.framework);
    for (const control of catalog.controls) {
      if (controls.has(control.id)) throw new Error('Duplicate control');
      if (!control.id.startsWith(catalog.framework + ':')) throw new Error('Control namespace mismatch');
      controls.add(control.id);
    }
  }
  for (const crosswalk of crosswalks) {
    requireSchema('mapping', crosswalk);
    for (const mapping of crosswalk.mappings) {
      if (mappings.has(mapping.id)) throw new Error('Duplicate mapping ID');
      mappings.add(mapping.id);
      if (!controls.has(mapping.source) || !controls.has(mapping.target)) throw new Error('Unresolved mapping reference');
    }
  }
  for (const example of examples) {
    requireSchema('example', example);
    if (exampleIds.has(example.id)) throw new Error('Duplicate example ID');
    exampleIds.add(example.id);
    if (example.control_refs.some(ref => !controls.has(ref))) throw new Error('Unresolved example reference');
  }
  return { frameworks: frameworks.size, control_references: controls.size, candidate_mappings: mappings.size, examples: examples.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(JSON.stringify(validate(), null, 2));
}
