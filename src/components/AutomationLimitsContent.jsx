import React from "react";
import engine from "../data/engine.generated.json";
import rules from "../data/rules.generated.json";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";

const rule = (id) => <a href={`/rules/${id}/`}><code>{id}</code></a>;

const gapRows = [
	{
		id: "link-text",
		group: "names",
		case: (
			<>
				A link reads “Read more” or “Click here”
			</>
		),
		why: "The link has a name, so a presence check is satisfied. Whether the name says where it leads is a judgment.",
		engine: (
			<>
				Recognizes known generic phrases in English, French, German, Spanish and Japanese and asks, as a{" "}
				<code>cantTell</code>: {rule("link-name-quality")}, {rule("link-name-quality-link-only")} and{" "}
				{rule("identical-links-same-purpose")}.
			</>
		),
	},
	{
		id: "alt-text",
		group: "names",
		case: (
			<>
				An image has <code>alt="image"</code>, or a file name
			</>
		),
		why: "An alt attribute is there. Only a person looking at the image knows if it describes it.",
		engine: (
			<>
				{rule("img-alt-quality")} asks about it, and leans fail when the text is a file name or a
				placeholder word. Whether ordinary alt text describes the image never gets a lean. A
				decorative <code>alt=""</code> is asked about too ({rule("img-alt-decorative")}).
			</>
		),
	},
	{
		id: "skip-link",
		group: "structure",
		case: "A page has landmarks but no way to skip the header",
		why: "Landmarks are one way to meet the criterion, so the page can pass it while keyboard users still tab through the header on every page.",
		engine: (
			<>
				{rule("bypass-blocks-present")} accepts a main landmark, a skip link or a heading, as WCAG's
				techniques do, so it won't call that page a failure. If the page has a skip link,{" "}
				{rule("skip-link")} checks that its target exists and can be used. Whether keyboard users
				also need one is a question for a person.
			</>
		),
	},
	{
		id: "stateful-label",
		group: "behavior",
		case: "A toggle always reads “Switch to dark mode”, even in dark mode",
		why: "Each state, taken alone, is a valid name. The mistake is in the change between them, and a scan reads one state.",
		engine: "Not decided by any scan. Scan each state that matters, then check by hand that the name follows the state.",
	},
	{
		id: "errors",
		group: "forms",
		case: "A form says “Invalid input”, far from the field",
		why: "An error exists. Whether it helps someone fix the field, and whether they hear it, is for a person.",
		engine: (
			<>
				For a field marked <code>aria-invalid</code>, {rule("invalid-field-error-message")} passes
				when a message is tied to it, and asks when none is, or it is hidden, empty or missing.{" "}
				{rule("live-region-announcements")} asks whether a status message can be announced. An error
				that only appears after a submit isn't on the page a scan reads: scan that state too.
			</>
		),
	},
	{
		id: "contrast",
		group: "visual",
		case: "Text over a gradient, an image, or a semi-transparent layer",
		why: "A tool that reads CSS sees a color, not what is painted under the text.",
		engine: (
			<>
				In a real browser, the contrast rules measure against what is painted. Where the background
				can't be worked out (an image, a gradient, a filter, a blend mode, a text shadow or outline),{" "}
				{rule("contrast-computable")} reports <code>cantTell</code> and names the blocker, not a
				guessed ratio. A page that supports light and dark is measured in the scheme the scan sees,
				and in the other where its colors can't change.
			</>
		),
	},
	{
		id: "keyboard",
		group: "behavior",
		case: "A dialog doesn't move focus, trap it, or give it back",
		why: "A scan of a loaded page doesn't open the dialog or press a key.",
		engine: (
			<>
				It checks what the markup and the page's scripts show: that a widget can be reached with Tab (
				{rule("widget-keyboard-focusable")}), that a click handler has a keyboard equivalent (
				{rule("click-handler-keyboard-operable")}), that a script doesn't remove focus (
				{rule("focus-not-removed-by-script")}). What happens when a key is pressed, and keyboard
				traps, are not checked at all, and no <code>cantTell</code> stands in for them. Test with a
				keyboard.
			</>
		),
	},
	{
		id: "label-source",
		group: "forms",
		case: (
			<>
				A field's only label is its placeholder, a <code>title</code> or an <code>aria-label</code>
			</>
		),
		why: "The field has an accessible name, so a presence check passes. The name may vanish when the user types, or have no text on screen to match.",
		engine: (
			<>
				{rule("form-control-programmatic-label-quality")} asks when the name comes only from a
				placeholder, a title, an <code>aria-label</code> or hidden text, and prefers a visible label.{" "}
				{rule("label-in-name")} fails a control whose name leaves out its visible text.
			</>
		),
	},
	{
		id: "label-text",
		group: "forms",
		case: "Two fields both labelled “Name”, or a label that is a placeholder word",
		why: "Each field has a label. Whether the labels tell the fields apart, and describe them, is a judgment.",
		engine: (
			<>
				{rule("form-control-label-quality")} asks about placeholder labels, labels shared by fields
				that nothing visible tells apart, and a visible label that is only part of the real one.
			</>
		),
	},
	{
		id: "landmarks",
		group: "structure",
		case: "Two navigation landmarks with no names, or a header that is a div",
		why: "Landmarks exist and are valid. A scan can't tell that a user moving by landmark hears “navigation” twice, or that an old page's header and footer aren't landmarks at all.",
		engine: (
			<>
				{rule("landmark-unique")} asks when same-role landmarks share a name or have none; it never
				fails, because repeated pagination can be right. {rule("page-zones-landmark")} asks when a
				block named like a header, navigation, search or footer isn't exposed as one.
			</>
		),
	},
	{
		id: "decorative",
		group: "names",
		case: (
			<>
				An <code>alt=""</code> or <code>aria-hidden</code> that is right here, and a tool that
				“fixes” it
			</>
		),
		why: "Both are correct in the right place, and wrong in another. Nothing in the markup says which this is.",
		engine: (
			<>
				{rule("img-alt-decorative")} asks to confirm that an element left out of the accessibility
				tree is purely decorative. A person, not a script, decides, and a code comment saying why
				helps the next one.
			</>
		),
	},
	{
		id: "expanded",
		group: "behavior",
		case: "A button says it is expanded while its panel is closed",
		why: "The attribute is valid. The page at rest shows one state, and what the button does when pressed isn't run.",
		engine: (
			<>
				{rule("aria-expanded-state-mismatch")} asks when <code>aria-expanded</code> disagrees with
				whether the controlled content is shown. Pressing Enter or Space, and what follows, is for a
				person.
			</>
		),
	},
	{
		id: "focus-style",
		group: "visual",
		case: "Focus or hover styles that vanish, or fail contrast, only in that state",
		why: "A scan reads the page at rest. A hover or focus style isn't drawn until a pointer or a key puts it there.",
		engine: (
			<>
				{rule("css-focus-indicator-suppressed")} asks when a rule removes the outline and no focus
				rule draws a replacement. The contrast of a state itself is measured only if you put the
				page in it and scan.
			</>
		),
	},
];

const gapGroups = [
	{ key: "names", title: "Names and text alternatives", label: "Names and alternatives a presence check passes" },
	{ key: "structure", title: "Page structure and landmarks", label: "Structure a presence check passes" },
	{ key: "forms", title: "Forms", label: "Forms a presence check passes" },
	{ key: "visual", title: "Contrast and visual states", label: "Visual cases a scan at rest passes" },
	{ key: "behavior", title: "Behavior and keyboard", label: "Behavior a scan of a loaded page passes" },
];

// Why no rule looks at a criterion. Ids from engine.generated.json; any id not
// listed here (a core update adds a rule, or drops one) falls under "Other",
// so a changed list shows up instead of disappearing.
const unseenGroups = [
	{
		key: "watch",
		title: "A person has to watch, listen or measure",
		ids: ["1.2.3", "1.2.4", "1.2.5", "2.3.1"],
	},
	{
		key: "interact",
		title: "It happens only when someone acts: a key, a gesture, a focus or an input",
		ids: ["1.4.13", "2.1.2", "2.1.4", "2.5.1", "2.5.2", "2.5.4", "2.5.7", "3.2.1", "3.2.2"],
	},
	{
		key: "pages",
		title: "It compares pages, and a scan reads one",
		ids: ["2.4.5", "3.2.3", "3.2.4", "3.2.6"],
	},
	{
		key: "understand",
		title: "It depends on understanding the content or the task",
		ids: ["1.3.2", "1.3.3", "3.3.3", "3.3.4", "3.3.7"],
	},
];

function UnseenCriteria() {
	const all = engine.procedures.criteriaWithoutRules;
	const known = new Set(unseenGroups.flatMap((g) => g.ids));
	const groups = [
		...unseenGroups,
		{ key: "other", title: "Other", ids: all.filter((c) => !known.has(c.id)).map((c) => c.id) },
	];
	return groups
		.map((g) => ({ ...g, items: all.filter((c) => g.ids.includes(c.id)) }))
		.filter((g) => g.items.length)
		.map((g) => (
			<React.Fragment key={g.key}>
				<h3>{g.title}</h3>
				<ul>
					{g.items.map((c) => (
						<li key={c.id}>
							{c.id} {c.title} <span>(level {c.level})</span>
						</li>
					))}
				</ul>
			</React.Fragment>
		));
}

export function AutomationLimitsContent() {
	return (
		<>
			<p>
				Automated testing is worth having, and it is not an accessibility audit. Most of what is
				written about that gap says that tools miss things. The harder problem is that a green
				scan doesn't tell you <em>what</em> it missed, so a team can't see how much of the work is
				left. This page is about three ways a scan falls short, what a tool can do so the gap is
				stated and not silent, and how to plan the part that stays with people.
			</p>

			<h2>Three ways a green scan misleads</h2>
			<p>
				A rule reads the page: markup, attributes, computed styles and, in a real browser, layout.
				It does presence checks (does the image have an <code>alt</code>?), format checks (is the
				role allowed here?) and measurements (is the ratio below 4.5:1?). They are fast, repeatable
				and exact, which is why they belong in CI. A scan still falls short in three different ways,
				and each needs a different answer.
			</p>
			<ol>
				<li>
					<strong>It checks that something is there, not that it is right.</strong> An alt text,
					a label, an error message. Whether it is the correct one is a judgment, and the answer
					is a question put to a person.
				</li>
				<li>
					<strong>It reads one state, not behavior.</strong> A page at rest doesn't open the
					dialog, press Escape, hover, or submit the form. The answer is to put the page in each
					state and scan it, and to test the rest with a keyboard and a screen reader.
				</li>
				<li>
					<strong>It never looks at the thing at all.</strong> Some requirements have no rule: they
					concern a video's audio description, a gesture, or whether navigation is consistent from
					one page to the next. The answer is a manual check, and the risk is that nothing on a
					green scan says the check is still owed.
				</li>
			</ol>
			<p>
				The third is the one that costs most, because it is silent. A tool that reports "no
				problems" for a criterion it never examined has told you something false by omission.
			</p>

			<h2>What no rule looks at</h2>
			<p>
				This is a list, not an estimate. Of the {engine.procedures.criteria} WCAG 2.2 success
				criteria at levels A and AA, {engine.procedures.criteriaWithoutRules.length} have no rule in
				core {engine.version} at all. Most need something a scan of one loaded page doesn't have, and a
				few, such as keyboard-trap detection, are scoped in core but not built. Each belongs to one
				of four kinds.
			</p>
			<UnseenCriteria />
			<p>
				For these, a scan's silence means nothing, and a result that is clean for the page means
				nothing about them. Core lists them as work for a person (see{" "}
				<a href="/conformance/procedures/">Test procedures</a>), so the list doesn't have to live in
				someone's head.
			</p>

			<h2>How much does automation catch?</h2>
			<p>
				You will find figures: that automation finds about a third of WCAG problems, or around half
				of the issues in a sample of audited pages. They disagree because they count different
				things. A success criterion that a tool fully tests is not the same as an issue found on a
				real page, and neither is the same as a person's experience of the page. Treat any single
				percentage with care.
			</p>
			<p>
				There is one number that doesn't depend on a sample, because it comes from the engine's own
				accounting. For each criterion it covers, core breaks what the criterion asks into{" "}
				<em>facets</em>, and marks each by how far its rules decide it. For the same{" "}
				{engine.procedures.criteria} criteria:
			</p>
			<ul>
				<li><strong>{engine.procedures.facets.full}</strong> facets are decided in full by rules.</li>
				<li><strong>{engine.procedures.facets.partial}</strong> are decided in part: rules check some of it, and a person the rest.</li>
				<li><strong>{engine.procedures.facets.manual}</strong> are not decided by any rule.</li>
			</ul>
			<p>
				That is {engine.procedures.facets.partial + engine.procedures.facets.manual} of{" "}
				{engine.procedures.facets.full + engine.procedures.facets.partial + engine.procedures.facets.manual}{" "}
				facets that leave something to a person, and no criterion has all of its facets decided in
				full. It is a count of what is checkable, not of how many problems a real page has, and it
				moves when core adds rules. Of core's {rules.length} rules,{" "}
				{rules.filter((r) => r.type === "automatic").length} are automatic and{" "}
				{rules.filter((r) => r.type === "manual").length} are manual: they ask a question, and never
				fail on their own.
			</p>

			<h2>Checked, and still misleading</h2>
			<p>
				The first two ways above, in the cases that come up most. A rule did run on each of these and
				found nothing wrong. For each one, the last column says what <code>@surea11y/core</code>{" "}
				does about it, including where it does nothing.
			</p>
			{gapGroups.map((g) => (
				<React.Fragment key={g.key}>
					<h3>{g.title}</h3>
					<DataTable
						label={g.label}
						rowKey="id"
						columns={[
							{ key: "case", label: "The page", width: "24%", wrap: true },
							{ key: "why", label: "Why a scan passes it", width: "34%", wrap: true },
							{ key: "engine", label: "What the engine does", wrap: true },
						]}
						rows={gapRows.filter((row) => row.group === g.key)}
						minWidth="54rem"
					/>
				</React.Fragment>
			))}

			<h2>What a scan can reach, with the right setup</h2>
			<p>
				The limits above are not all fixed. Some depend on how the scan runs, and core goes further
				than a read of the markup when you let it.
			</p>
			<ul>
				<li>
					<strong>In a real browser, it measures layout.</strong> Target size, text spacing,
					horizontal scroll at 320 CSS pixels wide, and contrast against what is painted all need
					layout. jsdom has none, so those rules measure less there. Use a{" "}
					<a href="/getting-started/">browser binding</a> for them.
				</li>
				<li>
					<strong>It can watch what scripts do.</strong> The listener hook sees click handlers a
					page attaches, so a clickable <code>div</code> is judged for keyboard access. The
					live-region hook sees live regions inserted already filled, which many screen readers
					don't announce. See{" "}
					<a href="/getting-started/standalone/#listener-and-live-region-hooks">the hooks</a>.
				</li>
				<li>
					<strong>It reads web components.</strong> A custom element's role set through{" "}
					<code>ElementInternals</code> is recognized, when the internals hook is installed.
				</li>
				<li>
					<strong>It scans the state you put the page in.</strong> Open the menu, submit the form,
					switch to dark mode, then scan. The engine reads one state per scan, so each state that
					matters is one more scan.
				</li>
			</ul>

			<h2>What the engine does with the gap</h2>
			<p>
				Many tools handle what they can't decide in one of two ways: they stay silent, so the page
				looks fine, or they guess, so the report is noisy. surea11y does neither. When a rule can't
				decide, it reports <code>cantTell</code>, which means “a person has to decide this”, and
				then it helps with the deciding.
			</p>
			<ul>
				<li>
					<strong>It says what to check.</strong> A <code>cantTell</code> finding carries{" "}
					<a href="/results-reports/output-schema/#how-to-check">“How to check”</a> steps, written for
					that question.
				</li>
				<li>
					<strong>It says which way the evidence points.</strong> Where the page gives a reason, the
					finding <a href="/results-reports/output-schema/#leans">leans</a> toward <code>pass</code>{" "}
					or <code>fail</code>, so you can review the likely failures first. A lean orders the
					questions; it never answers them.
				</li>
				<li>
					<strong>It never claims a criterion it only partly checked.</strong> When every rule for a
					criterion comes back clean but no rule tests all of what the criterion asks, the criterion
					reads <code>cantTell</code>, partly checked, not <code>pass</code>. See{" "}
					<a href="/conformance/wcag-mapping/">WCAG conformance mapping</a>.
				</li>
				<li>
					<strong>It is tested against its own claims.</strong> The engine is run against W3C's ACT
					test corpus and fails none of the cases ACT marks as passed or inapplicable. When it can't
					decide a case, it says <code>cantTell</code>. See{" "}
					<a href="/#checked-against-the-act-corpus">how it is checked</a>.
				</li>
			</ul>
			<Callout tone="unknown" title="A clean scan is not a conformance claim">
				<p>
					Zero failures means the checks the engine ran found nothing. It doesn't mean the page
					conforms to WCAG. The open <code>cantTell</code> results, and what no rule checks, are
					still to do.
				</p>
			</Callout>

			<h2>What stays with a person</h2>
			<p>
				Some of an assessment will always be done by people, with a keyboard, a screen reader, the
				browser's zoom, and judgment.
			</p>
			<ul>
				<li>Whether alternative text, link text, labels, headings and error messages mean what they should.</li>
				<li>Keyboard operation: tab order, traps, focus in and out of dialogs, menus and custom widgets.</li>
				<li>What a screen reader announces, and in what order, when the page changes.</li>
				<li>Whether content or function is lost at 400% zoom, with text spacing changed, or in forced colors.</li>
				<li>Whether the page is understandable: plain language, consistent patterns, helpful instructions.</li>
				<li>Anything that exists only after an interaction, until a test brings the page to that state.</li>
			</ul>
			<p>
				The engine doesn't replace this work. It narrows it. Core ships test procedures for every
				criterion its rules cover, with the steps, the tools and what passes and fails, in five
				languages, and can list just what a scan leaves to a person (<code>procedureChecklist</code>{" "}
				with <code>automation: ['manual', 'partial']</code>), so a manual check and a scan read the
				same text. See <a href="/conformance/procedures/">Test procedures</a>.
			</p>

			<h2>A process that uses both</h2>
			<ol>
				<li>
					<strong>Scan on every change.</strong> Run the engine in your tests and in CI, on the
					states that matter, not just on a loaded page.{" "}
					<a href="/getting-started/">Getting started</a> has a package for your test framework.
				</li>
				<li>
					<strong>Gate on what is new.</strong> Record the known problems in a{" "}
					<a href="/conformance/baseline/">baseline</a>, so the build fails on a regression and not
					on the backlog.
				</li>
				<li>
					<strong>Review the questions.</strong> Work through the <code>cantTell</code> findings,
					likely failures first, using their steps. A <a href="/results-reports/html-report/">report</a>{" "}
					groups them for this.
				</li>
				<li>
					<strong>Test by hand what no rule covers.</strong> Keyboard and screen reader testing,
					with the procedures as the checklist.
				</li>
				<li>
					<strong>Audit at the points that matter.</strong> Before a launch, after a redesign, and
					when a conformance statement is needed.
				</li>
			</ol>
			<p>
				Steps 1 and 2 are cheap and constant. Steps 3 to 5 are where a person's time goes, and the
				engine's job is to make sure that time is spent on real questions.
			</p>

			<h2>When you need more than the tool</h2>
			<p>
				If you want the manual half done for you, or checked by someone who does it for a living, I
				can help. I created and maintain surea11y and work professionally in digital accessibility:
				audits against WCAG and EN 301 549, reviews of how a team tests and what it reports,
				setting up automated testing in a pipeline, and training for the people who build and test
				the product.
			</p>
			<p>
				To talk about your situation, reach me on{" "}
				<a href="https://www.linkedin.com/in/jorgerumoroso/">LinkedIn</a>. A short message saying
				what you build and what you need is enough.
			</p>
		</>
	);
}
