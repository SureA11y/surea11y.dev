import React from "react";

export function ConformanceContent() {
	return (
		<>
			<p>
				<strong>A clean scan is not, on its own, a WCAG conformance claim</strong> — and pretending
				otherwise is exactly the kind of overreach this engine refuses to make. This section covers how
				individual rule results actually roll up to a Success Criterion verdict, what that verdict
				honestly does and doesn't cover, and how to gate a real CI pipeline on known, already-reviewed
				violations instead of blocking every build until everything is fixed at once.
			</p>

			<h2>WCAG conformance mapping</h2>
			<p>
				See exactly how atomic rules, coverage facets, and composite WCAG-SC rollup rules fit
				together, so a composite <code>pass</code> means something specific rather than a vague
				"looks fine." Target a conformance level (A, AA, or AAA) across any WCAG version with one
				tag set, and get a straight answer to the question that actually matters: what can this
				kind of automated result tell you, and where does it stop. See{" "}
				<a href="/conformance/wcag-mapping/">WCAG conformance mapping</a>.
			</p>

			<h2>Baseline / allowlist</h2>
			<p>
				Don't let a first scan of an imperfect, existing site block every future build — record
				what's already known once, and gate CI only on violations that are genuinely new. It's the
				difference between "we can't ship anything until this is perfect" and "we can catch
				regressions starting today," and it's what actually gets a team to turn the gate on. See{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>.
			</p>
		</>
	);
}
