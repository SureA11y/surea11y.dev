import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

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
				when a rule doesn't set one), and <code>html</code> is the occurrence's outer-HTML
				snippet. This is content-based rather than position-based: it survives the flagged
				element moving around the page (a reorder, an unrelated sibling added/removed) as long as
				the flagged element's own markup doesn't change. <code>selector</code> is still recorded
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
				Baseline entries that don't match anything in a fresh scan are reported as{" "}
				<strong>stale</strong> (the violation was presumably fixed) — this is informational only
				and never gates the build; regenerate the baseline with <code>--write-baseline</code>{" "}
				periodically to clean these up.
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

			<h2>File format</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "DEFAULT", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> rejects a file that isn't{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> with a clear exit-2 error rather than
				guessing at an older/different format.
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
