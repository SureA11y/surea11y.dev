import React from "react";

export function TroubleshootingContent() {
	return (
		<>
			<p>
				Two kinds of question land here, and it's worth knowing which one you have before you
				start digging: "why did the engine do that" has an answer below, and "what will it never
				do" is answered just as directly — stated upfront, not left for you to discover the hard
				way in production.
			</p>

			<h2>FAQ</h2>
			<p>
				The questions that come up most, answered plainly: why <code>runOnly</code> silently ran
				every rule instead of the one you asked for, why a custom rule keeps returning{" "}
				<code>cantTell</code> with no obvious cause, why a geometry-dependent rule reports{" "}
				<code>notApplicable</code> under jsdom, and what a clean scan actually does and doesn't
				mean. Fifteen minutes here saves most of the debugging most people end up doing anyway. See{" "}
				<a href="/troubleshooting/faq/">FAQ</a>.
			</p>

			<h2>Known limitations</h2>
			<p>
				Every boundary of this engine's static-DOM-scan architecture, named explicitly rather than
				discovered by surprise: what it structurally cannot do at all, what depends on the
				environment you run it in, and what it deliberately declines to guess at because a wrong
				guess would be worse than an honest <code>cantTell</code>. Knowing these up front is what
				lets you trust the rest of the results. See{" "}
				<a href="/troubleshooting/known-limitations/">Known limitations</a>.
			</p>
		</>
	);
}
