import React from "react";
import rules from "../data/rules.generated.json";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";

const familyRows = [
	{ id: "present", ruleId: <code>img-alt-present</code>, family: <code>img</code>, intent: <code>present</code>, type: "automatic" },
	{ id: "quality", ruleId: <code>img-alt-quality</code>, family: <code>img</code>, intent: <code>quality</code>, type: "manual" },
	{ id: "decorative", ruleId: <code>img-alt-decorative</code>, family: <code>img</code>, intent: <code>decorative</code>, type: "manual" },
];

export function RuleOrganizationContent() {
	return (
		<>
			<p>
				This describes how the {rules.length} rules in the <a href="/rules/">catalog</a> are structured —
				useful for making sense of a result, or for finding the rule you're looking for. It
				reflects what already exists in the ruleset, not an abstract design.
			</p>

			<h2>Automatic vs. manual</h2>
			<p>
				Every rule's <code>type</code> is one of two kinds, and the difference is about what the
				rule is <em>capable of deciding</em> — not which outcome it happens to report:
			</p>
			<ul>
				<li>
					<strong>automatic</strong> — decides deterministically, with no heuristics and no
					guessing. Can report <code>fail</code>. <code>cantTell</code> still shows up here, in
					these situations: a real violation exists but doesn't on its own establish that the
					mapped WCAG criterion fails (an ARIA author requirement whose exposed name/role/value
					still survives); the rule decides deterministically that a best practice is broken, claims
					no Success Criterion, and what it found need not harm anyone, since the role or element
					still reaches assistive technology as it is (<code>aria-allowed-role</code>,{" "}
					<code>landmark-role-name-present</code>, tagged best-practice); or the rule can only confirm
					a mechanism is <em>present</em>, while whether what's present is actually valid belongs
					to a sibling rule (<code>aria-required-children</code>, paired with{" "}
					<code>aria-prohibited-children</code>); or the rule cannot decide without a guess, so it
					asks instead of failing: a name that may come from a closed shadow root, from{" "}
					<code>ElementInternals</code> the engine can't read, or from content nested too deep to
					read (the <code>*-name-present</code> rules), text that may be clipped
					or overlap once spaced (<code>text-spacing-content-loss</code>), an orientation media
					block that turns an element other than the page's content (
					<code>css-orientation-lock</code>), a placeholder below its ratio whose colors can't be
					told to be the page's or the browser's, or a lone character standing in for its control's
					name below its ratio (<code>contrast-minimum</code>), or a color or size that cannot be computed (the contrast
					rules, <code>target-size-minimum</code>). A rule that throws is reported as{" "}
					<code>cantTell</code> too, as a safety net.
				</li>
				<li>
					<strong>manual</strong> — signals that a human has to decide; the rule cannot decide
					whether what it found is a problem. Reports <code>cantTell</code> or{" "}
					<code>notApplicable</code>, and <code>pass</code> only when the answer that needs no
					judgment is the one found — never <code>fail</code>.{" "}
					<a href="/rules/landmark-unique/"><code>landmark-unique</code></a> cannot decide whether
					two landmarks sharing a name are a problem (the APG allows it when their content is
					identical), so that is <code>cantTell</code>; but "every name differs" is a fact, so that
					is <code>pass</code>. A rule that asks a person to judge every target it finds, such as
					whether an image's text alternative is accurate, never reports <code>pass</code>. A manual
					rule that asks only where a heuristic finds a sign, and finds none, reports{" "}
					<code>notApplicable</code>, not <code>pass</code>: it applies only to what its heuristic
					flags, and finding nothing there doesn't show that all is well.{" "}
					<a href="/rules/image-redundant-alt/"><code>image-redundant-alt</code></a> looks for alt text that repeats the text next to the
					image; finding none says nothing about whether the alt text is right.{" "}
					<a href="/rules/form-control-label-quality/"><code>form-control-label-quality</code></a>, <a href="/rules/password-paste-enabled/"><code>password-paste-enabled</code></a>,{" "}
					<a href="/rules/scrollable-region-focusable/"><code>scrollable-region-focusable</code></a> and <a href="/rules/image-of-text/"><code>image-of-text</code></a> do the same.
				</li>
			</ul>
			<p>
				A rule tagged best-practice claims no Success Criterion, and still reports{" "}
				<code>fail</code> when what it decides is itself a barrier: an empty heading is announced
				as a heading with nothing in it (
				<a href="/rules/empty-heading/"><code>empty-heading</code></a>, as W3C's ACT rule for it
				reports it). Its <code>fail</code> says the rule's own expectation is not met, not that a
				criterion is: no WCAG rollup counts it. Where the finding may harm no one, it reports{" "}
				<code>cantTell</code> instead, as above.
			</p>
			<p>
				<strong>A manual rule reporting <code>cantTell</code> is not the same event as an automatic
				rule reporting <code>cantTell</code>, even though the value is identical</strong>: the
				automatic rule has decided and is telling you what it found; the manual rule is telling you
				the question isn't decidable from markup at all. Either way, a core rule's{" "}
				<code>cantTell</code> says how to answer it (<code>howToCheck</code>), and some say which
				way the page's evidence points (<code>lean</code>, see{" "}
				<a href="/results-reports/output-schema/#leans">Leans</a>). See <a href="/results-reports/output-schema/">Results &amp; Reports</a> for
				the full outcome/severity/confidence reference.
			</p>

			<h2>How rule IDs are structured</h2>
			<p>
				A rule id is generally <code>&lt;family&gt;-&lt;intent&gt;</code>: which elements/mechanism
				the rule targets, then what question it asks about them. The image-alternatives family
				(WCAG 1.1.1) is the clearest example:
			</p>
			<DataTable
				label="Rule ID examples"
				rowKey="id"
				columns={[
					{ key: "ruleId", label: "Rule ID", mono: true },
					{ key: "family", label: "Family", mono: true },
					{ key: "intent", label: "Intent", mono: true },
					{ key: "type", label: "Type" },
				]}
				rows={familyRows}
			/>
			<ul>
				<li><code>present</code> — verifies a required mechanism exists. Typically automatic.</li>
				<li><code>quality</code> — verifies appropriateness, correctness, or meaningfulness. Always manual.</li>
				<li><code>decorative</code> — verifies correct treatment of purely decorative content. Always manual.</li>
			</ul>
			<p>
				Intent determines whether a rule <em>can</em> be automatic: "is something present" is
				often decidable from markup alone, while "is it good" almost never is. This is also the
				logic behind the <strong>Related rules</strong> links on each rule page — rules sharing a
				family (everything before the last <code>-</code> segment of the id) are the ones grouped
				there. The ruleset spans dozens of families beyond <code>img</code> — <code>aria-*</code>,{" "}
				<code>contrast-*</code>, <code>dialog-*</code>, <code>iframe-*</code>, <code>label-*</code>,{" "}
				<code>link-*</code>, <code>list-*</code>, <code>landmark-*</code>, and more — the{" "}
				<a href="/rules/">catalog</a> is the current, generated list.
			</p>
			<p>
				Rules never mix families: each one queries one kind of element, using helpers appropriate
				to it. That's also why the ruleset has {rules.length} narrow rules rather than a dozen broad ones —
				two checks that differ in what they decide, what they target, or what WCAG facet they
				cover are kept as separate rules rather than merged, so a result never has to be
				untangled after the fact to say what specifically was found.
			</p>

			<h2>WCAG facets</h2>
			<p>
				A WCAG Success Criterion is usually bigger than any one rule can decide deterministically.
				Internally, each SC is broken into named "facets" — for 1.1.1 Non-text Content, that's
				things like whether an <code>alt</code> attribute is present, whether its text is
				meaningful, and whether decorative images are correctly marked null. A rule maps to one or
				more facets, and multiple rules commonly cover different facets of the same SC — which is
				exactly what the img-alt family above does for 1.1.1.
			</p>
			<p>
				This matters when reading a composite (WCAG-SC rollup) result: a composite{" "}
				<ResultBadge lang="en" state="pass" size="sm" /> means every automated check for that SC came back
				clean, but <strong>if a facet has no automated coverage at all, the composite is silent
				about that facet rather than asserting it's fine</strong>. See{" "}
				<a href="/conformance/wcag-mapping/">Conformance</a> for the three layers (atomic rules, facets,
				composites) and how a composite's outcome is actually computed.
			</p>
		</>
	);
}
