import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const codes = (list) =>
	list.map((c, i) => (
		<React.Fragment key={c}>
			{i > 0 && ", "}
			<code>{c}</code>
		</React.Fragment>
	));

const baselineMoves = [
	{ id: "text-missing", rules: ["img-alt-present", "embed-text-alternative-present", "object-text-alternative-present", "svg-image-text-alternative-present", "svg-text-alternative-present", "video-poster-text-alternative-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING"] },
	{ id: "area-alt", rules: ["area-alt-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING", "TEXT_ALTERNATIVE_EMPTY"] },
	{ id: "canvas", rules: ["canvas-text-alternative-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING", "ROLE_IMG_NAME_MISSING"] },
	{ id: "text-review", rules: ["area-alt-quality", "canvas-text-alternative-quality", "embed-text-alternative-quality", "input-image-alt-quality", "object-text-alternative-quality"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_REVIEW"] },
	{ id: "img-quality", rules: ["img-alt-quality", "svg-text-alternative-quality"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_REVIEW", "IMAGE_ONLY_CONTROL_CONTENT"] },
	{ id: "img-decorative", rules: ["img-alt-decorative"], from: ["EXCLUDED_ELEMENT_REVIEW"], to: ["IMAGE_ONLY_CONTROL_CONTENT"] },
	{ id: "input-image", rules: ["input-image-alt-decorative"], from: ["DEFAULT"], to: ["NAME_FROM_ELSEWHERE_REVIEW"] },
	{ id: "manual-review", rules: ["manual-review"], from: ["DEFAULT"], to: ["KEYBOARD_REVIEW"] },
	{ id: "list-children", rules: ["list-children-valid"], from: ["LIST_INVALID_CHILD"], to: ["LIST_ITEM_ROLE_OVERRIDDEN"] },
	{ id: "listitem-parent", rules: ["listitem-parent-valid"], from: ["LISTITEM_INVALID_PARENT"], to: ["LIST_ROLE_OVERRIDDEN"] },
	{ id: "prohibited-children", rules: ["aria-prohibited-children"], from: ["ARIA_PROHIBITED_CHILD_ROLELESS"], to: ["ARIA_PROHIBITED_CHILD"] },
	{ id: "duplicate-id", rules: ["duplicate-id"], from: ["DUPLICATE_ID"], to: ["DUPLICATE_ID_IN_SHADOW_TREE"] },
	{ id: "valid-lang", rules: ["valid-lang"], from: ["ELEMENT_LANG_INVALID"], to: ["DEFAULT_LANG_INVALID"] },
	{ id: "p-as-heading", rules: ["p-as-heading"], from: ["BOLD_LARGE_PARAGRAPH", "BOLD_LARGE_DIV"], to: ["HEADING_LIKE_NUMBER", "HEADING_LIKE_LINK"] },
].map((row) => ({ ...row, rules: codes(row.rules), from: codes(row.from), to: codes(row.to) }));

export function BaselineContent() {
	return (
		<>
			<p>
				A strict CI gate ("fail the build on any <code>fail</code> outcome") is an adoption
				blocker for a team scanning an existing, imperfect site for the first time — they can't
				ship anything until every pre-existing violation is fixed. A baseline lets a team say
				"these N are already known — don't gate on them, but fail the moment a genuinely new one
				appears."
			</p>
			<CodeBlock
				lines={[
					"# Once: record every current fail occurrence, does not fail the build.",
					{ text: "surea11y scan ./dist/index.html --write-baseline baseline.json", command: true },
					"",
					"# Commit baseline.json to git.",
					"",
					"# From then on, in CI: only a NEW (not-yet-baselined) fail occurrence gates the build.",
					{ text: "surea11y scan ./dist/index.html --baseline baseline.json", command: true },
				]}
			/>
			<p>
				The baseline file is meant to be committed to git, so accepting more accessibility debt
				becomes an explicit, reviewable decision — a new violation shows up as a new row in the
				file's diff in a PR, not a silent change in a count.
			</p>

			<h2>When this is useful</h2>
			<ul>
				<li>
					<strong>Adopting scanning on an existing site.</strong> The motivating case above: a
					first scan on a mature site can turn up hundreds of pre-existing violations.
					Baselining them once unblocks gating immediately instead of requiring "fix everything
					first."
				</li>
				<li>
					<strong>Incremental remediation with a visible burn-down.</strong> Fix violations in
					batches, then periodically regenerate the baseline with <code>--write-baseline</code>.
					Each regeneration's git diff <em>shrinks</em> as entries disappear — the file itself
					becomes a progress tracker, and a PR that fixes a batch of issues shows exactly what
					got cleaned up.
				</li>
				<li>
					<strong>Third-party/vendor content you don't control.</strong> A page embeds a widget
					(chat bubble, ad unit, payment iframe) with known, unfixable-by-you violations.
					Baselining just those specific occurrences is more precise than excluding the whole
					subtree via <code>excludeSelectors</code> (see{" "}
					<a href="/configuration/engine-options/#rule-scoped-excludeselectors">the engine options guide</a>) — new issues introduced
					anywhere else near it, including inside your own code, still gate normally.
				</li>
				<li>
					<strong>Regression safety net during a large refactor.</strong> Mid-migration, some
					rules may legitimately fail temporarily in ways already tracked and being fixed across
					many PRs. Baselining the known-in-progress set still catches <em>unrelated</em> new
					regressions from other PRs during the same window, instead of turning the gate off
					entirely or blocking every PR on it.
				</li>
				<li>
					<strong>Staged rollout of a new or stricter rule.</strong> Turning on a rule (or a
					whole WCAG level) the codebase isn't clean against yet: baseline the existing gaps,
					enable gating immediately, and prevent any <em>new</em> violations of that rule while
					the backlog is cleaned up separately — rather than waiting to enable the rule until the
					codebase is already compliant.
				</li>
			</ul>

			<h2>How matching works</h2>
			<p>
				Nothing in an occurrence's shape is a perfect, page-position-independent identity (see{" "}
				<a href="/results-reports/output-schema/">the output schema</a>): <code>selector</code> and{" "}
				<code>structuralPath</code> are both derived from the element's position in the DOM, so
				either can shift when <em>unrelated</em> markup changes elsewhere on the page, even though
				the flagged element itself never changed.
			</p>
			<p>Instead, a baseline entry's identity is:</p>
			<CodeBlock lines={["ruleId + reasonCode + html"]} />
			<p>
				where <code>reasonCode</code> is the rule-specific code from{" "}
				<code>occurrence.data.details.reasonCode</code> (defaulting to <code>"DEFAULT"</code>{" "}
				when a rule doesn't set one, or sets anything but a non-empty string), and <code>html</code> is the occurrence's outer-HTML
				snippet. This is content-based rather than position-based: it survives the flagged
				element moving around the page (a reorder, an unrelated sibling added/removed) as long as
				the flagged element's own markup doesn't change. For a finding about the page itself,
				reported on <code>&lt;html&gt;</code> or <code>&lt;body&gt;</code> (
				<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a>,{" "}
				<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>,{" "}
				<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>), the snippet is the
				start tag alone, so editing the page's content doesn't make it new. The snippet is
				compared with each tag's attributes in name order and its class names sorted, so a build
				that writes <code>class="b a" src</code> where the last one wrote{" "}
				<code>src class="a b"</code> matches; baseline files written before this keep matching,
				since the comparison is made at match time. <code>selector</code> is still recorded
				in the baseline file, but purely for human context when reading a diff — it is never used
				for matching.
			</p>
			<p>
				<strong>Known limitation</strong>: an element whose <em>own</em> markup includes dynamic
				content (a timestamp, a live counter, a randomly-generated id) will never match itself
				across two scans, since its <code>html</code> snippet differs every time. If your pages
				hit this case, the baseline mechanism won't help for those specific rules/elements — see
				"Alternative" below.
			</p>
			<p>
				<strong>Matching counts occurrences, not just presence.</strong> If a page has 3 elements that produce
				byte-identical <code>ruleId</code>+<code>reasonCode</code>+<code>html</code> (e.g. the
				same broken component repeated 3 times) and the baseline recorded only 1 of them, a fresh
				scan reports 1 known and 2 new — not all 3 as known.
			</p>
			<p>
				A finding inside a frame of a cross-frame result (<code>runa11yCoreAcrossFrames</code>) is
				told apart by its frame too: its entry records the frame's <strong>path</strong>, the
				selectors of the frame elements leading to it (<code>"frame": ["#checkout"]</code>), and
				matches only a finding in the frame at that path. The same broken component in the page
				and in a frame is two findings. Entries without <code>frame</code> are the page's own, so
				a baseline written from a single-document scan keeps matching the page.
			</p>
			<p>
				A compact result (<code>engineOptions.output.detail: 'findings'</code>, see{" "}
				<a href="/results-reports/output-schema/#top-level-result">Output schema</a>) is read as
				the full result it stands for, so it is reported the same.
			</p>
			<p>
				Baseline entries that don't match anything in a fresh scan are reported as{" "}
				<strong>stale</strong>: the violation may have been fixed, or the element's markup
				changed, or the scan didn't reach it (another viewport, scope or set of rules). This is
				informational only and never gates the build; look at them, then regenerate the baseline
				with <code>--write-baseline</code> periodically to clean them up.
			</p>

			<h2 id="findings-that-lean-fail">Findings that lean fail</h2>
			<p>
				A baseline records failures. An undecided finding is not one, but since 1.14 some lean
				fail: the page's evidence points to a failure without proving it (their <code>lean</code>,
				see <a href="/results-reports/output-schema/#leans">Leans</a> in the output schema). A
				build that gates on them (<code>leanFailAs</code> in the{" "}
				<a href="/results-reports/junit-report/#options">JUnit</a> and{" "}
				<a href="/results-reports/sarif-report/#options">SARIF</a> reporters) needs a way to accept
				those a page already has, as it accepts its failures. Ask for them when building the
				baseline:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { buildBaselineEntries } = require('@surea11y/core/baseline');",
					"",
					"const entries = buildBaselineEntries(result, { leanFail: true });",
				]}
			/>
			<p>
				Each finding that leans fail and gates under <code>leanFailAs</code> (
				<code>leaningFailures(result)</code> from <code>@surea11y/core</code>) gets an entry marked{" "}
				<code>"lean": "fail"</code>, after the failures:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'{ "ruleId": "heading-order", "reasonCode": "HEADING_ORDER_SKIPPED_LEVEL", "selector": "html > body > main > h3", "html": "<h3>Details</h3>", "lean": "fail" }',
				]}
			/>
			<p>
				Such an entry matches only a finding that leans fail, with the same identity, and a plain
				entry only a failure. Under <code>leanFailAs</code>, JUnit doesn't gate on a finding it
				matches (its <code>&lt;skipped&gt;</code> message counts it among the known likely
				failures) and SARIF leaves it a <code>warning</code>. Without <code>leanFailAs</code> the
				entries change nothing, and <code>matchBaseline</code> leaves them out of its counts, stale
				ones included, unless given <code>{"{ leanFail: true }"}</code>, when it compares them in{" "}
				<code>leanFail</code> (<code>{"{ total, knownCount, newCount, newOccurrences, staleCount }"}</code>).{" "}
				<code>--write-baseline</code> writes failures only.
			</p>
			<p>
				Leans arrive in minor releases, so an upgrade can bring likely failures a baseline doesn't
				hold: rebuild it with <code>leanFail: true</code> after an upgrade, and review the diff. How
				leans are chosen and measured is in{" "}
				<a href={`${core}/docs/LEANS.md`}>
					<code>LEANS.md</code>
				</a>
				, on GitHub.
			</p>

			<h2 id="upgrading">Upgrading</h2>
			<p>
				A finding's identity includes its reason code, and a minor release may give a finding a new
				one: a rule that gave none (<code>DEFAULT</code>) now gives one, or one code is split in two
				by cause (see{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>finding identity</a> in{" "}
				<code>API_STABILITY.md</code>, on GitHub). The finding is the same, and a baseline written
				before the upgrade still matches it: each move is listed in{" "}
				<code>src/baseline-moves.json</code> (rule, old code, new codes), and an entry under the
				old code matches the finding under a new one when the rest of its identity, the rule, the
				markup and the frame, is the same. <code>matchBaseline</code>, and the{" "}
				<code>baselineEntries</code> option of the SARIF and JUnit reporters, all read it. An entry
				is looked up under the finding's own code first, so it never goes to a moved finding when
				another finding has that exact identity.
			</p>
			<p>
				The table covers one minor release: a move is listed from the release it shipped in until
				the next minor release, which drops it. 1.15 and 1.16 moved no finding, so the table is
				empty.
			</p>
			<p>1.14 moved these, from 1.13, and 1.15 dropped them:</p>
			<DataTable
				label="Reason codes moved in 1.14"
				rowKey="id"
				columns={[
					{ key: "rules", label: "Rule", wrap: true, width: "45%" },
					{ key: "from", label: "Old code", wrap: true },
					{ key: "to", label: "New code", wrap: true },
				]}
				rows={baselineMoves}
			/>
			<p>
				So a baseline written by 1.13 keeps matching these under 1.14.x, not under 1.15: there an
				entry under an old code is stale and its finding is new. Bring such a baseline up to date
				under 1.14.x, as below, before moving to 1.15; <code>migrateBaselineEntries</code> in 1.15
				no longer knows these moves. A baseline written by 1.14 keeps matching under 1.15 and
				1.16.
			</p>
			<p>
				Regenerating the baseline with <code>--write-baseline</code> (or{" "}
				<code>buildBaselineEntries</code>) after an upgrade writes every finding under its current
				code, and removes the need for the table. It also accepts any finding the upgrade newly
				reports, so look at its diff. To bring the codes up to date without accepting anything new,
				rewrite the file with <code>migrateBaselineEntries</code> from{" "}
				<code>@surea11y/core/baseline</code>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { migrateBaselineEntries } = require('@surea11y/core/baseline');",
					"",
					"const file = JSON.parse(fs.readFileSync('baseline.json', 'utf8'));",
					"// With the scan's result, an entry for a split code takes the code its finding has now.",
					"file.entries = migrateBaselineEntries(file, result);",
					"fs.writeFileSync('baseline.json', JSON.stringify(file, null, 2) + '\\n');",
				]}
			/>
			<p>
				It returns a copy of the entries with each moved one under its new code, and every other
				entry as it was. Without a result, it rewrites only the moves it can tell without the
				finding: a code the rule no longer gives that moved to a single new one (
				<code>img-alt-present</code>'s <code>DEFAULT</code>), not a split.
			</p>
			<p>
				A finding whose outcome changed with the upgrade is another matter: a rule that now fails
				what it asked about, or asks about what it failed, gives a finding the baseline didn't hold,
				or no longer gives one it held, and the{" "}
				<a href={`${core}/CHANGELOG.md`}>changelog</a> says why.
			</p>

			<h2 id="several-profiles">A scan of several profiles</h2>
			<p>
				A result of <a href="/configuration/engine-options/#several-profiles">several profiles</a>{" "}
				(<code>engineOptions.profile</code> as a list, core 1.15.0 and later) lists each finding
				once, with what each profile makes of it in <code>verdicts</code>. A baseline entry is the
				finding, by rule, reason code and markup, so one entry covers it under every profile, and
				a baseline written from a scan of one profile still matches the same findings in a scan of
				several.
			</p>

			<h2 id="scanning-at-several-viewport-widths">Scanning at several viewport widths</h2>
			<p>
				A baseline entry doesn't record the viewport, and matching doesn't use it: the same element
				with the same defect matches at any width. That suits a page whose findings don't depend on
				its layout. A layout-dependent rule, such as{" "}
				<a href="/rules/text-spacing-content-loss/">
					<code>text-spacing-content-loss</code>
				</a>{" "}
				or{" "}
				<a href="/rules/target-size-minimum/">
					<code>target-size-minimum</code>
				</a>
				, can fail at one width and not at another, so for a page scanned at several widths, keep{" "}
				<strong>one baseline per width</strong>: <code>a11y-baseline-390.json</code>,{" "}
				<code>a11y-baseline-1280.json</code>.
			</p>
			<p>
				A single baseline written from every width still gates correctly, since a finding is new
				only when no entry matches it. But each run then reports the other widths' findings as
				stale, so the stale count stops telling you what was fixed.
			</p>

			<h2 id="file-format">File format</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "TEXT_ALTERNATIVE_MISSING", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> rejects a file that isn't{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> with a clear exit-2 error rather than
				guessing at an older/different format, and since <code>@surea11y/cli</code> 1.6.0 one
				with an entry that isn't one too, before the scan, naming the file and the entry. <code>matchBaseline</code>, and the{" "}
				<code>baselineEntries</code> option of the SARIF and JUnit reporters, take the file as
				saved (<code>JSON.parse</code> of it) or its <code>entries</code> list.{" "}
				<code>null</code> or no baseline has no entries, so every failure is new. Since core
				1.16.0, anything else throws a <code>TypeError</code> with{" "}
				<code>code: 'INVALID_BASELINE'</code> and a message naming what is wrong: a string or an
				object with no <code>entries</code> list, an entry that isn't an object or has no{" "}
				<code>ruleId</code>, a <code>reasonCode</code>, <code>selector</code> or <code>html</code>{" "}
				that is neither a string nor <code>null</code>, or a <code>frame</code> that isn't a list
				of strings. <code>migrateBaselineEntries</code> checks it the same way. Before, such a
				value was read as an empty baseline, which made every failure new without a word.
			</p>

			<h2>Combining with <code>--json</code></h2>
			<p>
				When <code>--baseline</code> or <code>--write-baseline</code> is used together with{" "}
				<code>--json</code>, the printed object gains a <code>baseline</code> key alongside the
				normal engine result (this is CLI-output-only — it is not part of the engine's own result
				contract described in the output schema):
			</p>
			<ul>
				<li>
					<code>--write-baseline</code>:{" "}
					<code>{'{ mode: "write", path, entries: <number written> }'}</code>
				</li>
				<li>
					<code>--baseline</code>:{" "}
					<code>
						{'{ mode: "check", totalFail, knownCount, newCount, staleCount, newOccurrences: [...] }'}
					</code>
				</li>
			</ul>

			<h2>Alternative: diff two scans yourself</h2>
			<p>
				If your pages don't fit this model (heavy dynamic content inside the flagged elements
				themselves), the always-available fallback is to diff two full <code>--json</code> outputs
				yourself — see{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>
				. That gives you full control over the identity/matching logic at the cost of writing it
				yourself.
			</p>
		</>
	);
}
