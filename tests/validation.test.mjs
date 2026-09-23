import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { root, load, validate } from '../validate.mjs';

function copyFixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'public-controls-'));
  for (const name of ['schema', 'frameworks', 'crosswalks', 'examples']) cpSync(join(root, name), join(dir, name), { recursive: true });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}
test('complete initial dataset validates', () => {
  assert.deepEqual(validate(), { frameworks: 4, control_references: 14, candidate_mappings: 6, examples: 3 });
});
test('unresolved references are rejected', t => {
  const dir = copyFixture(t), file = join(dir, 'crosswalks/ai-rmf-to-800-53.yaml');
  writeFileSync(file, readFileSync(file, 'utf8').replace('nist-800-53:CM-8', 'nist-800-53:DOES-NOT-EXIST'));
  assert.throws(() => validate(dir), /Unresolved/);
});
test('equivalence claims are rejected', t => {
  const dir = copyFixture(t), file = join(dir, 'crosswalks/ai-rmf-to-800-53.yaml');
  writeFileSync(file, readFileSync(file, 'utf8').replace('relationship: related', 'relationship: equivalent'));
  assert.throws(() => validate(dir));
});
test('duplicate YAML keys are rejected', t => {
  const dir = copyFixture(t), file = join(dir, 'examples/ai-agent-governance.yaml');
  writeFileSync(file, readFileSync(file, 'utf8') + '\nsynthetic: false\n');
  assert.throws(() => load(file), /unique|duplicate/i);
});
