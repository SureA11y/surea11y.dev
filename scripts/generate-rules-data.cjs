'use strict';

/**
 * Generate src/data/rules.generated.json from the installed @surea11y/core
 * package: its compiled catalog (getChecksCatalog), its rule modules' JSDoc
 * headers (the package ships src/checks) and docs/RULE_EXAMPLES.md's
 * hand-authored example pairs. Also writes src/data/engine.generated.json
 * (version/license) from the package's package.json, so pages that display
 * those values never drift from the release the site depends on, and
 * src/data/rules.review.generated.json: each rule's "How to check" steps
 * per cantTell reason code (core's procedures registry, since core 1.15;
 * meta.review in 1.14), in every locale
 * core translates them into, read through core's own howToCheckFor so the
 * site shows the same text a report does. Reading the
 * pinned devDependency rather than a ../core checkout keeps the site's rule
 * text on a release, and lets CI check it (docs:rules:check).
 *
 * The applicability/expectation/reports JSDoc parsing (jsdocTag/reflow/readRuleMeta
 * below) mirrors core's scripts/generate-rule-catalog.js -- that logic
 * isn't exported anywhere, so keep the two in sync if it changes.
 *
 * Usage:
 *   node scripts/generate-rules-data.cjs
 *   node scripts/generate-rules-data.cjs --check
 */

const fs = require('fs');
const path = require('path');

const CORE_DIR = path.dirname(require.resolve('@surea11y/core/package.json'));
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'rules.generated.json');
const ENGINE_OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'engine.generated.json');
const REVIEW_OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'rules.review.generated.json');

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
    // A variant (core 1.17) has no runInPage of its own: it names the core
    // rule it runs in `from`, with other settings in `config`.
    if (!mod || typeof mod.id !== 'string') continue;
    if (typeof mod.runInPage !== 'function' && typeof mod.from !== 'string') continue;

    const source = fs.readFileSync(file, 'utf8');
    meta.set(mod.id, {
      applicability: jsdocTag(source, 'applicability'),
      expectation: jsdocTag(source, 'expectation'),
      reports: jsdocTag(source, 'reports'),
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

// An outcome heading can say where the outcome holds ("**Passed (in a
// browser)**"); the page shows it as a translated label, keyed here.
const EXAMPLE_CONTEXT = {
  'in a browser': 'browser'
};

// One rule (manual-review) genuinely has only one outcome -- it has no
// notApplicable branch, so there's no pair to show. A rule with a tiered
// outcome adds a third, Flagged (cantTell), example, and one with several
// distinct review cases (form-control-programmatic-label-quality) can have four. An outcome heading may carry a trailing annotation on the
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

      let outcome = heading[1].trim();
      let context = null;
      const qualified = /^(.+?) \(([^)]+)\)$/.exec(outcome);
      if (!OUTCOME_STATE[outcome] && qualified && OUTCOME_STATE[qualified[1]]) {
        context = EXAMPLE_CONTEXT[qualified[2]];
        if (!context) {
          throw new Error(`generate-rules-data: unrecognized example context "${qualified[2]}" for rule "${ruleId}"`);
        }
        outcome = qualified[1];
      }
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
        ...(context ? { context } : {}),
        html: htmlLines.join('\n'),
        explanation: explanationLines.join(' ').trim()
      });
    }

    if (pairs.length < 1 || pairs.length > 4) {
      throw new Error(`generate-rules-data: expected 1 to 4 examples for "${ruleId}", found ${pairs.length}`);
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

// Core's Japanese review text spaces Japanese from Latin text and uses ASCII
// parentheses; the site's Japanese leaves the spaces out (text-autospace
// draws the gap) and uses full-width parentheses (check:typography). Only
// whitespace and parenthesis width change; a call such as `blur()` stays.
const JA_CHARS = '\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}ー々〆、。「」『』（）！？：；・…';
const JA_SPACE = new RegExp(`(?<=[${JA_CHARS}])[ \\u00a0]+|[ \\u00a0]+(?=[${JA_CHARS}])`, 'gu');
function unspaceJa(text) {
  return text
    .replace(/(?<![A-Za-z])\(|\((?!\))/g, '（')
    .replace(/(?<!\()\)/g, '）')
    .replace(JA_SPACE, '');
}
const UNSPACED_LOCALES = new Set(['ja']);

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
        margin: r.margin || null,
        applicability: m.applicability,
        expectation: m.expectation,
        reports: m.reports,
        sourcePath: m.sourcePath,
        relatedRuleIds: related.get(r.ruleId) || [],
        examples: ex
      };
    })
    .sort((a, b) => a.ruleId.localeCompare(b.ruleId));

  const json = JSON.stringify(rules, null, 2) + '\n';

  // The locales core ships review dictionaries for (src/i18n/review/<code>.json).
  const reviewLocales = fs
    .readdirSync(path.join(CORE_DIR, 'src', 'i18n', 'review'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -'.json'.length))
    .sort();
  // howToCheckFor is on the package entry point, not src/core.js.
  const { howToCheckFor } = require(CORE_DIR);
  // A rule's reason codes with steps, in order. Until core 1.15 they were its
  // meta.review keys; since then the steps live with core's procedures, whose
  // registry lists each rule's codes (in meta order) as variants under the
  // facets they test.
  const { PROCEDURES } = require(path.join(CORE_DIR, 'src', 'procedures', 'registry.js'));
  const codesByRule = new Map();
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (node.variants) {
      for (const [ruleId, codes] of Object.entries(node.variants)) {
        if (!codesByRule.has(ruleId)) codesByRule.set(ruleId, []);
        const list = codesByRule.get(ruleId);
        for (const code of codes) if (!list.includes(code)) list.push(code);
      }
    }
    for (const [k, v] of Object.entries(node)) if (k !== 'variants') walk(v);
  };
  walk(PROCEDURES);
  const review = {};
  for (const r of rules) {
    const codes = codesByRule.get(r.ruleId) || [];
    if (!codes.length) continue;
    review[r.ruleId] = codes.map((code) => {
      const text = {};
      for (const locale of reviewLocales) {
        const h = howToCheckFor(r.ruleId, code, locale);
        if (!h) throw new Error(`generate-rules-data: no howToCheck for ${r.ruleId} ${code} (${locale})`);
        const fix = UNSPACED_LOCALES.has(locale) ? unspaceJa : (x) => x;
        text[locale] = { steps: h.steps.map(fix), passWhen: fix(h.passWhen), failWhen: fix(h.failWhen) };
      }
      return { code, text };
    });
  }
  const reviewJson = JSON.stringify(review, null, 2) + '\n';

  const corePkg = require(path.join(CORE_DIR, 'package.json'));
  // The composite WCAG rollups aren't in getChecksCatalog(); pages quote
  // their count, and RULE_CATALOG.md's heading anchor carries it.
  const engine = { version: corePkg.version, license: corePkg.license, composites: core.getRulesCatalog().length };
  const engineJson = JSON.stringify(engine, null, 2) + '\n';

  if (args.check) {
    const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : null;
    const engineCurrent = fs.existsSync(ENGINE_OUT_PATH) ? fs.readFileSync(ENGINE_OUT_PATH, 'utf8') : null;
    let stale = false;
    if (current !== json) {
      console.error(`[generate-rules-data] ${OUT_PATH} is stale. Run: npm run docs:rules`);
      stale = true;
    }
    const reviewCurrent = fs.existsSync(REVIEW_OUT_PATH) ? fs.readFileSync(REVIEW_OUT_PATH, 'utf8') : null;
    if (reviewCurrent !== reviewJson) {
      console.error(`[generate-rules-data] ${REVIEW_OUT_PATH} is stale. Run: npm run docs:rules`);
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
  fs.writeFileSync(REVIEW_OUT_PATH, reviewJson);
  console.log(`[generate-rules-data] wrote ${OUT_PATH} (${rules.length} rules)`);
  console.log(`[generate-rules-data] wrote ${REVIEW_OUT_PATH} (${Object.keys(review).length} rules)`);
  console.log(`[generate-rules-data] wrote ${ENGINE_OUT_PATH} (v${engine.version}, ${engine.license})`);
}

main();
