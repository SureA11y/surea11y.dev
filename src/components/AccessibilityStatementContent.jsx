import React from "react";

const core = "https://github.com/SureA11y/core";

export function AccessibilityStatementContent() {
	return (
		<>
			<p>
				This statement covers <strong>surea11y.dev</strong>, the site you're reading right now —
				not the accessibility findings a scan of your own site returns, which are covered by{" "}
				<a href="/conformance/wcag-mapping/">Conformance</a> instead.
			</p>

			<h2>Conformance target</h2>
			<p>
				This site aims to conform to{" "}
				<a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2</a> at Level AA. It follows the same
				brand rules that govern every SureA11y product surface: colour is never the only cue
				(status and active-state indicators always pair colour with a second signal — an
				underline, a glyph, a word), every interactive control has a visible focus outline and a
				minimum 44px target, and every icon that isn't purely decorative carries a text
				alternative.
			</p>

			<h2>How this site is tested</h2>
			<p>
				This site is built by the same team that builds <code>@surea11y/core</code>, so it would
				be a strange place to skip testing with our own engine. Every change is scanned with{" "}
				<code>@surea11y/core</code> itself, in a real browser (Chromium, through{" "}
				<code>@surea11y/playwright</code>), against WCAG 2.2 AA at 375 and 1280 px wide, and
				nothing is deployed while that scan reports a <code>fail</code>. Every real finding gets
				fixed, not explained away. That scan has honest limits of its own (see{" "}
				<a href="/help/known-limitations/">Known limitations</a>): it sees one state of each page,
				at those two widths, and what it can't decide it reports as <code>cantTell</code> for a
				person to check.
			</p>
			<p>
				<strong>Automated scanning is only ever a floor, not a ceiling</strong>, so it isn't the only check this
				site gets. Changes are also subject to manual accessibility testing — keyboard-only
				navigation, a screen reader pass, and a check of the things no automated
				tool can judge at all (whether a heading actually describes what follows it, whether focus
				order matches visual order, whether content that only appears after an interaction is
				still reachable) — the same "automated tools can't tell you everything" position this
				whole project is built on.
			</p>

			<h2>Known gaps</h2>
			<ul>
				<li>
					The "On this page" table of contents doesn't highlight your current scroll position —
					that would need client-side JavaScript, and this site ships none, by design. The links
					themselves work normally with a keyboard or screen reader; only the "you are here"
					highlighting while scrolling is absent.
				</li>
				<li>
					Code samples are intentionally rendered on a dark background even though the rest of the
					site is light — the same "a terminal is a terminal" exception documented in this site's
					own design system. If that specific contrast combination is hard to read for you, every
					code sample's text is still fully selectable and copyable as plain text.
				</li>
			</ul>

			<h2>Reporting a problem</h2>
			<p>
				If something on this site is hard to use with a keyboard, a screen reader, or any other
				assistive technology, please{" "}
				<a href={`${core}/issues`}>open an issue on GitHub</a>. Include the page URL, what you were
				trying to do, and what happened instead — the same detail you'd want from anyone reporting
				a bug against the engine itself.
			</p>
		</>
	);
}
