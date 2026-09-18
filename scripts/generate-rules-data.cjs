'use strict';

/**
 * Generate src/data/rules.generated.json from ../core's compiled catalog
 * (getChecksCatalog) plus its rule-module JSDoc headers and
 * ../core/docs/RULE_EXAMPLES.md's hand-authored example pairs. Also writes
 * src/data/engine.generated.json (version/license) from ../core/package.json,
 * so pages that display those values never drift from the actual package.
 *
 * The applicability/expectation JSDoc parsing (jsdocTag/reflow/readRuleMeta
 * below) mirrors ../core/scripts/generate-rule-catalog.js -- that logic
 * isn't exported anywhere, so keep the two in sync if it changes.
 *
 * Usage:
 *   node scripts/generate-rules-data.cjs
 *   node scripts/generate-rules-data.cjs --check
 */

const fs = require('fs');
const path = require('path');

const CORE_DIR = path.join(__dirname, '..', '..', 'core');
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'rules.generated.json');
const ENGINE_OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'engine.generated.json');

function parseArgs(argv) {
  const out = {};
  for (const a of argv) if (a.startsWith('--')) out[a.slice(2)] = true;
  return out;
}

function levelFromTags(tags) {
  const t = Array.isArray(tags) ? tags : [];
  if (t.includes('wcag2aaa') || t.includes('wcag21aaa') || t.includes('wcag22aaa')) return 'AAA';
  if (t.includes('wcag2aa') || t.includes('wcag21aa') || t.includes('wcag22aa')) return 'AA';
  if (t.includes('wcag2a') || t.includes('wcag21a') || t.includes('wcag22a')) return 'A';
  return '';
}

function jsdocTag(source, tag) {
  const start = new RegExp(`^[ \\t]*\\*[ \\t]*@${tag}\\b[ \\t]*(.*)$`, 'm').exec(source);
  if (!start) return '';

  const lines = [start[1]];
  for (const line of source
    .slice(start.index + start[0].length)
    .split('\n')
    .slice(1)) {
    if (/^[ \t]*\*[ \t]*@\w/.test(line) || /\*\//.test(line)) break;
    lines.push(line.replace(/^[ \t]*\*[ \t]?/, ''));
  }
  return reflow(lines);
}

function reflow(lines) {
  const body = lines.filter((l) => l.trim());
  if (!body.length) return '';

  const indentOf = (l) => l.match(/^ */)[0].length;
  const isBullet = (l) => /^ *- /.test(l);
  const bullets = body.filter(isBullet);
  const bulletBase = bullets.length ? Math.min(...bullets.map(indentOf)) : 0;

  const items = [];
  let openItem = -1;
  for (const line of body) {
    const indent = indentOf(line);
    const text = line.trim();
    if (isBullet(line)) {
      items.push({ text: ' '.repeat(Math.max(0, indent - bulletBase)) + text, bullet: true });
      openItem = indent;
    } else if (openItem >= 0 && indent > openItem) {
      items[items.length - 1].text += ' ' + text;
    } else if (openItem >= 0) {
      items.push({ text, bullet: false });
      openItem = -1;
    } else if (items.length) {
      items[items.length - 1].text += ' ' + text;
    } else {
      items.push({ text, bullet: false });
    }
  }

  const out = [];
  for (let i = 0; i < items.length; i++) {
    if (i && (!items[i].bullet || !items[i - 1].bullet)) out.push('');
    out.push(items[i].text);
  }
  return out.join('\n');
}

function listRuleFiles(dirAbs) {
  if (!fs.existsSync(dirAbs)) return [];
  const out = [];
  for (const ent of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    const full = path.join(dirAbs, ent.name);
    if (ent.isDirectory()) out.push(...listRuleFiles(full));
    else if (ent.isFile() && ent.name.endsWith('.js') && !ent.name.endsWith('.test.js')) out.push(full);
  }
  return out;
}

// Records each rule's real source path alongside its JSDoc prose -- more
// reliable for the "View source" link than guessing automatic/manual from
// the id, since manual-review.js lives outside both subdirectories.
function readRuleMeta(checksDirAbs) {
  const meta = new Map();
  for (const file of listRuleFiles(checksDirAbs)) {
    let mod;
    try {
      mod = require(file);
    } catch {
      continue;
    }
    if (!mod || typeof mod.id !== 'string' || typeof mod.runInPage !== 'function') continue;

    const source = fs.readFileSync(file, 'utf8');
    meta.set(mod.id, {
      applicability: jsdocTag(source, 'applicability'),
      expectation: jsdocTag(source, 'expectation'),
      sourcePath: path.relative(CORE_DIR, file).split(path.sep).join('/')
    });
  }
  return meta;
}

const OUTCOME_STATE = {
  Passed: 'pass',
  Failed: 'fail',
  'Flagged (cantTell)': 'unknown',
  'Not applicable': 'na'
};

// One rule (manual-review) genuinely has only one outcome -- it has no
// notApplicable branch, so there's no pair to show. Every other rule has
// exactly two. An outcome heading may carry a trailing annotation on the
// same line (duplicate-id's "**Failed** (with `engineOptions...`)"); only
// the bracketed word itself is the outcome.
function parseExamples(md) {
  const sections = md.split(/^## /m).slice(1);
  const examples = new Map();

  for (const section of sections) {
    const lines = section.split('\n');
    const ruleId = lines[0].trim();
    const pairs = [];
    let i = 1;

    while (i < lines.length) {
      const heading = /^\*\*([^*]+)\*\*/.exec(lines[i]);
      if (!heading) {
        i++;
        continue;
      }

      const outcome = heading[1].trim();
      const state = OUTCOME_STATE[outcome];
      if (!state) {
        throw new Error(`generate-rules-data: unrecognized outcome "${outcome}" for rule "${ruleId}"`);
      }

      i++;
      if (lines[i] !== '```html') {
        throw new Error(`generate-rules-data: expected an html code fence after "${outcome}" for rule "${ruleId}"`);
      }
      i++;

      const htmlLines = [];
      while (lines[i] !== '```') {
        if (i >= lines.length) throw new Error(`generate-rules-data: unterminated code fence for rule "${ruleId}"`);
        htmlLines.push(lines[i]);
        i++;
      }
      i++;

      const explanationLines = [];
      while (i < lines.length && lines[i].trim() !== '' && !/^\*\*[^*]+\*\*/.test(lines[i])) {
        explanationLines.push(lines[i]);
        i++;
      }

      pairs.push({
        outcome,
        state,
        html: htmlLines.join('\n'),
        explanation: explanationLines.join(' ').trim()
      });
    }

    if (pairs.length !== 1 && pairs.length !== 2) {
      throw new Error(`generate-rules-data: expected 1 or 2 example pairs for "${ruleId}", found ${pairs.length}`);
    }
    examples.set(ruleId, pairs);
  }

  return examples;
}

// img-alt-present / img-alt-quality / img-alt-decorative share the "img-alt"
// stem once their intent suffix is stripped -- group any rule id that way,
// only when the shared stem is at least two tokens (avoids one-token
// buckets like "aria" or "landmark" swallowing unrelated rules) and the
// group has more than one member.
function computeRelated(ruleIds) {
  const groups = new Map();
  for (const id of ruleIds) {
    const tokens = id.split('-');
    if (tokens.length < 3) continue;
    const stem = tokens.slice(0, -1).join('-');
    if (!groups.has(stem)) groups.set(stem, []);
    groups.get(stem).push(id);
  }

  const related = new Map(ruleIds.map((id) => [id, []]));
  for (const members of groups.values()) {
    if (members.length < 2) continue;
    for (const id of members) {
      related.set(
        id,
        members.filter((m) => m !== id).sort()
      );
    }
  }
  return related;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const core = require(path.join(CORE_DIR, 'src', 'core.js'));
  const catalog = core.getChecksCatalog();

  const meta = readRuleMeta(path.join(CORE_DIR, 'src', 'checks'));
  const examplesMd = fs.readFileSync(path.join(CORE_DIR, 'docs', 'RULE_EXAMPLES.md'), 'utf8');
  const examples = parseExamples(examplesMd);

  const ruleIds = catalog.map((r) => r.ruleId).sort();
  const related = computeRelated(ruleIds);

  const rules = catalog
    .map((r) => {
      const m = meta.get(r.ruleId);
      if (!m) throw new Error(`generate-rules-data: no source file found for rule "${r.ruleId}"`);
      const ex = examples.get(r.ruleId);
      if (!ex) throw new Error(`generate-rules-data: no RULE_EXAMPLES.md section for rule "${r.ruleId}"`);

      return {
        ruleId: r.ruleId,
        title: r.title,
        description: r.description || '',
        type: r.type,
        wcagSc: Array.isArray(r.wcagSc) ? r.wcagSc.slice() : [],
        level: levelFromTags(r.tags),
        category: r.category || '',
        confidence: r.defaultConfidence,
        severity: r.defaultSeverity,
        deprecated: !!r.deprecated,
        deprecation: r.deprecation || null,
        applicability: m.applicability,
        expectation: m.expectation,
        sourcePath: m.sourcePath,
        relatedRuleIds: related.get(r.ruleId) || [],
        examples: ex
      };
    })
    .sort((a, b) => a.ruleId.localeCompare(b.ruleId));

  const json = JSON.stringify(rules, null, 2) + '\n';

  const corePkg = require(path.join(CORE_DIR, 'package.json'));
  const engine = { version: corePkg.version, license: corePkg.license };
  const engineJson = JSON.stringify(engine, null, 2) + '\n';

  if (args.check) {
    const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : null;
    const engineCurrent = fs.existsSync(ENGINE_OUT_PATH) ? fs.readFileSync(ENGINE_OUT_PATH, 'utf8') : null;
    let stale = false;
    if (current !== json) {
      console.error(`[generate-rules-data] ${OUT_PATH} is stale. Run: npm run docs:rules`);
      stale = true;
    }
    if (engineCurrent !== engineJson) {
      console.error(`[generate-rules-data] ${ENGINE_OUT_PATH} is stale. Run: npm run docs:rules`);
      stale = true;
    }
    if (stale) process.exit(1);
    console.log('[generate-rules-data] rules data is up to date.');
    return;
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, json);
  fs.writeFileSync(ENGINE_OUT_PATH, engineJson);
  console.log(`[generate-rules-data] wrote ${OUT_PATH} (${rules.length} rules)`);
  console.log(`[generate-rules-data] wrote ${ENGINE_OUT_PATH} (v${engine.version}, ${engine.license})`);
}

main();
