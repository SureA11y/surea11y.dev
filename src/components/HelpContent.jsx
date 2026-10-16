import React from "react";

export function HelpContent() {
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
				The questions that come up most, answered plainly: why a selection of tags and rule ids
				can run no rule and still look clean, why a web component comes back{" "}
				<code>cantTell</code>, what changes in your results after upgrading to core 1.12, why a
				geometry-dependent rule reports <code>notApplicable</code> under jsdom, and what a clean
				scan actually does and doesn't mean. Fifteen minutes here saves most of the debugging most people end up doing anyway. See{" "}
				<a href="/help/faq/">FAQ</a>.
			</p>

			<h2>Known limitations</h2>
			<p>
				Every boundary of this engine, named explicitly rather than discovered by surprise: what
				one scan of one page state can't see, what depends on where you run it (jsdom, a browser,
				the page's own scripts), and what it deliberately declines to guess at because a wrong
				guess would be worse than an honest <code>cantTell</code>, each with what to do about it. Knowing these up front is what
				lets you trust the rest of the results. See{" "}
				<a href="/help/known-limitations/">Known limitations</a>.
			</p>
		</>
	);
}
