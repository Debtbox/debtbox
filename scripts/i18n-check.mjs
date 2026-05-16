#!/usr/bin/env node
/**
 * Finds t('...') keys used in staged/changed source files and reports
 * which are missing from any locale JSON.
 *
 * Usage:
 *   pnpm i18n:check              # checks keys in git-changed files
 *   pnpm i18n:check --all        # checks all source files
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const LOCALES_DIR = join(ROOT, 'public/locales');
const SRC_DIR = join(ROOT, 'src');

const checkAll = process.argv.includes('--all');

// --- collect source files to scan ---
let files;
if (checkAll) {
  files = execSync(`find ${SRC_DIR} -type f \\( -name "*.ts" -o -name "*.tsx" \\)`)
    .toString().trim().split('\n').filter(Boolean);
} else {
  const changed = execSync('git diff --name-only HEAD && git diff --name-only --cached HEAD')
    .toString().trim().split('\n').filter(Boolean);
  files = changed
    .filter(f => /\.(ts|tsx)$/.test(f))
    .map(f => resolve(ROOT, f))
    .filter(f => { try { readFileSync(f); return true; } catch { return false; } });
}

if (!files.length) {
  console.log('No changed source files to check.');
  process.exit(0);
}

// --- extract t('key') / t("key") calls ---
const KEY_RE = /\bt\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
const usedKeys = new Set();
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  for (const [, key] of src.matchAll(KEY_RE)) usedKeys.add(key);
}

// --- load all locales ---
const localeFiles = readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
const locales = {};
for (const lf of localeFiles) {
  locales[lf] = JSON.parse(readFileSync(join(LOCALES_DIR, lf), 'utf8'));
}

// --- report ---
let missing = 0;
for (const key of [...usedKeys].sort()) {
  const missingIn = localeFiles.filter(lf => !(key in locales[lf]));
  if (missingIn.length) {
    console.log(`\x1b[33m⚠ Missing key:\x1b[0m ${key}`);
    for (const lf of missingIn) console.log(`    \x1b[31m✗\x1b[0m ${lf}`);
    missing++;
  }
}

if (missing === 0) {
  console.log(`\x1b[32m✓ All ${usedKeys.size} translation keys found in every locale.\x1b[0m`);
} else {
  console.log(`\n\x1b[31m${missing} key(s) missing from one or more locales.\x1b[0m`);
  process.exit(1);
}
