import React from "react";
import engine from "../data/engine.generated.json";

export function RulesIntroContent() {
	return (
		<p>
			The {engine.composites} composite WCAG Success Criterion rollups aren't listed here — they aren't
			individually configurable rules, they belong under{" "}
			<a href="/conformance/wcag-mapping/">Conformance</a> instead. See{" "}
			<a href="/rules/organization/">how rules are organized</a> for automatic vs. manual, how
			rule IDs are structured, and WCAG facets. The Questions column counts the questions a rule
			can leave to a person (<code>cantTell</code>); each comes with steps to answer it on the
			rule's page.
		</p>
	);
}
