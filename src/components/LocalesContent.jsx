import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import localeData from "../data/locales.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const localeCoverageRows = localeData.locales.map((l) => ({
	id: l.id,
	locale: <code>{l.id}</code>,
	name: l.name,
	file: <code>{l.file}</code>,
	keys: String(l.keys),
	untranslated: l.canonical ? "— (the canonical/fallback set)" : String(l.stillEnglish),
}));

// Sample output for getLocaleCoverage(), built from the same generated data
// as the table above so the numbers can't drift apart.
const coverageSampleLines = [
	"const { getLocaleCoverage } = require('@surea11y/core');",
	"",
	"getLocaleCoverage();",
	"// {",
	"//   sourceLocale: 'en',",
	`//   totalKeys: ${localeData.totalKeys},`,
	"//   locales: [",
	...localeData.locales
		.filter((l) => !l.canonical)
		.slice(0, 2)
		.map(
			(l) =>
				`//     { locale: '${l.id}', total: ${l.keys}, translated: ${l.keys - l.stillEnglish}, missing: ${l.missing}, orphaned: [], percent: ${Math.round(((l.keys - l.stillEnglish) / l.keys) * 1000) / 10} },`,
		),
	"//     ...",
	"//   ]",
	"// }",
];

const localeReasonRows = [
	{ id: "ok", reason: <code>ok</code>, meaning: "You got exactly what you asked for, and that dictionary carries every key." },
	{
		id: "primary-subtag",
		reason: <code>primary-subtag</code>,
		meaning: (
			<>
				Your code carried a subtag with no dictionary of its own, so its base language was used
				— you asked for <code>de-DE</code> and got <code>de</code>. Normal and expected; nothing
				to fix. A difference in case alone is not this: <code>DE</code> reports <code>ok</code>.
			</>
		),
	},
	{
		id: "dictionary-not-loaded",
		reason: <code>dictionary-not-loaded</code>,
		meaning: "The project ships that language, but this copy of the engine doesn't carry it and none was supplied. In practice: the standalone browser bundle without its locale side file.",
	},
	{
		id: "unknown-locale",
		reason: <code>unknown-locale</code>,
		meaning: (
			<>
				The project has no such translation at all, so English was used. <code>ko</code> and{" "}
				<code>pt-BR</code> both land here today.
			</>
		),
	},
	{
		id: "partial-dictionary",
		reason: <code>partial-dictionary</code>,
		meaning: "The dictionary was used but is missing some keys, so those individual strings fell back to English.",
	},
];

const dictionaryLocationRows = [
	{ id: "require", how: <code>require('@surea11y/core')</code>, what: "Every locale, built in. Nothing to configure." },
	{ id: "binding", how: "A binding (Playwright, Cypress, …)", what: "Every locale, built in. Nothing to configure." },
	{
		id: "browser",
		how: <code>surea11y.browser.js</code>,
		what: (
			<>
				English. Load <code>surea11y.i18n.&lt;locale&gt;.js</code> after it for anything else.
			</>
		),
	},
];

export function LocalesContent() {
	return (
		<>
			<p>
				Every rule's title/description, and every occurrence's summary/hint, is localized via a
				key-based dictionary lookup — not hard-coded per language.
			</p>

			<h2>Current locale coverage</h2>
			<DataTable
				label="Locale coverage"
				rowKey="id"
				columns={[
					{ key: "locale", label: "Locale", width: "18%" },
					{ key: "file", label: "File", width: "24%" },
					{ key: "keys", label: "Keys", width: "12%" },
					{ key: "untranslated", label: "Untranslated", wrap: true },
				]}
				rows={localeCoverageRows.map((r) => ({
					...r,
					locale: (
						<>
							{r.locale} ({r.name})
						</>
					),
				}))}
			/>
			<p>
				"Untranslated" counts values that match the English text character for character, apart
				from words that are rightly the same in a language — French <em>Orientation</em>,{" "}
				<em>Interruptions</em> and <em>Occurrences</em>, German <em>Frame</em>, <em>Frames</em>{" "}
				and <em>Element</em>, Spanish <em>Selector</em>. Those are listed as such, each with the English text it was checked
				against, and counted as translated. If the English changes, the entry no longer applies
				and the string counts as untranslated until someone checks it again. The count cannot see
				an English word left inside an otherwise translated sentence; that is found by reading the
				text, and none remain in the locales above.
			</p>

			<h3 id="reading-coverage-from-the-package">Reading coverage from the package</h3>
			<p>
				The same numbers are available at run time, from the dictionaries the installed package
				ships, so a tool or a docs site can show them without a checkout of the repository:
			</p>
			<CodeBlock lang="js" lines={coverageSampleLines} />
			<p>
				Per locale, <code>total</code> is the number of English keys it is measured against,{" "}
				<code>translated</code> how many of its values differ from English or are listed as
				rightly the same, <code>missing</code> how many keys it lacks (they show in English), and{" "}
				<code>orphaned</code> the keys it has that English does not.{" "}
				<code>total - translated</code> is the "Untranslated" column above, missing keys included.
				Keys a profile leaves out of a locale by choice are not counted. The repository's own
				coverage report and this function share one implementation, so they always agree; the
				report counts core's dictionaries and each profile's separately, this function the merged
				dictionary a scan uses. It is a supported export (
				<a href={`${core}/docs/API_STABILITY.md#extension-points`}>
					<code>API_STABILITY.md</code>, extension points
				</a>
				).
			</p>
			<p>
				Locale files are plain JSON: a flat map of key to translated string, in the same key
				order as <code>en.json</code>. Nothing else lives in them, so contributing a language
				means editing text and never touching code.
			</p>
			<p>
				Every locale carries every key <code>en.json</code> has. Keeping it that way is the job
				of <code>npm run i18n:sync</code>: run it after any change to <code>en.json</code> and it
				rewrites every non-English locale file to match — adding keys that are new, dropping keys{" "}
				<code>en.json</code> no longer has, and leaving existing translations alone. A key it
				adds is seeded with the English text, which counts as untranslated until someone replaces
				it.
			</p>

			<h2>Selecting a locale</h2>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { locale: 'fr' }, null);"]} />
			<p>Default is <code>'en'</code> if omitted. Any string is accepted; <strong>an unrecognized locale is never an error</strong>.</p>

			<h2>How a locale is chosen</h2>
			<p>
				Two things happen, in this order. Getting them mixed up is the usual source of confusion,
				so they are described separately.
			</p>
			<h3>Step 1 — pick a dictionary (once per scan)</h3>
			<ol>
				<li>
					Use the dictionary matching your code. <code>de</code> finds <code>de.json</code>.
					Case doesn't matter — <code>pt-br</code>, <code>pt-BR</code> and <code>PT-BR</code> all
					find <code>pt-BR.json</code>.
				</li>
				<li>
					Otherwise, drop everything after the first <code>-</code> and try that.{" "}
					<code>de-DE</code> finds <code>de.json</code>; so does <code>de-AT</code>.
				</li>
				<li>Otherwise, use English.</li>
			</ol>
			<p>
				So you only need a <code>de-DE.json</code> if German in Austria and Germany should
				actually read differently. Ship <code>de.json</code> and every German variant is covered.
			</p>
			<h3>Step 2 — resolve each string (per string)</h3>
			<p>Within the chosen dictionary, every string is looked up on its own:</p>
			<ol>
				<li>Take the key's value from the chosen dictionary.</li>
				<li>If that key is missing, take the English one.</li>
				<li>
					If English is missing it too — which shouldn't happen for a built-in key, but can for a
					hand-rolled one — use the literal text the rule itself carries.
				</li>
			</ol>
			<p>
				<strong>The result is never a blank, an <code>undefined</code>, or a thrown error.</strong>{" "}
				A half-finished translation renders in your language where it exists and in English
				everywhere else.
			</p>

			<h2>Knowing which locale you actually got</h2>
			<p>
				Graceful fallback has one drawback:{" "}
				<strong>ask for a language the build doesn't carry and you get fluent English back, with
				nothing in the strings to say so</strong>. Every result therefore reports the resolution
				once, at the top:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"engine": {',
					'  "tag": "a11ycore",',
					'  "schemaVersion": "1.0.0",',
					'  "locale": { "requested": "ko", "resolved": "en", "reason": "unknown-locale" }',
					"}",
				]}
			/>
			<p>
				<code>requested</code> is what you asked for (after trimming; <code>en</code> if you
				passed nothing or a non-string), <code>resolved</code> is the dictionary that was used,
				and <code>reason</code> is one of:
			</p>
			<DataTable
				label="locale.reason values"
				rowKey="id"
				columns={[
					{ key: "reason", label: "reason", width: "26%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={localeReasonRows}
			/>
			<p>
				Treat the list as open — a later release can add a value, so match on the ones you care
				about and let the rest fall through a default.
			</p>
			<p>
				If you need a particular language, <code>requested !== resolved</code> is the condition to
				check in CI. Note it is also true for the harmless <code>primary-subtag</code> case, so
				gate on <code>reason === 'unknown-locale' || reason === 'dictionary-not-loaded'</code> if
				a base-language match is good enough for you. See{" "}
				<a href="/results-reports/output-schema/">the output schema</a> for the field's place in the result, and{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> for what is
				guaranteed about it.
			</p>

			<h2>Where the dictionaries live</h2>
			<p>Which languages are available depends on how you load the engine.</p>
			<DataTable
				label="Where the dictionaries come from"
				rowKey="id"
				columns={[
					{ key: "how", label: "How you load it", width: "36%" },
					{ key: "what", label: "What you get", wrap: true },
				]}
				rows={dictionaryLocationRows}
			/>
			<p>
				The bundle is split because it travels over the network to every page that uses it, and
				no page needs every language. Keeping English inline and the rest optional took about
				280 KB off the download and stops it growing as languages are added. Nothing else
				changes: the Node package and the bindings are unaffected.
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y.browser.js"></script>',
					'<script src="surea11y.i18n.ja.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'ja' }, null);",
					"</script>",
				]}
			/>
			<p>
				Ask for a language whose file you didn't load and you get English, with{" "}
				<code>engine.locale.reason</code> set to <code>dictionary-not-loaded</code> — different
				from <code>unknown-locale</code>, which means the project has no such translation at all.
			</p>
			<p>
				In Node, the same side file is a module: <code>require('@surea11y/core/i18n/de')</code>{" "}
				returns <code>{"{ locale, messages }"}</code> (<code>locale</code> is <code>'de'</code>,{" "}
				<code>messages</code> the flat key-to-text map), without needing the bundle.
			</p>
			<p>
				A <a href="/configuration/packs/">pack</a>'s messages are in its own dictionaries, which
				the pack lists per locale; a locale the pack has no dictionary for shows its messages in
				English.
			</p>

			<h3>Supplying a dictionary yourself</h3>
			<p>
				<code>engineOptions.messages</code> accepts <code>{"{ [locale]: { key: value } }"}</code>{" "}
				and takes precedence over anything built in or loaded from a side file. Useful for
				overriding a handful of strings, or for a language you maintain privately:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  locale: 'de',",
					"  messages: { de: { img_altPresent_title: 'Eigener Text' } }",
					"}, null);",
				]}
			/>
			<p>Keys you don't supply fall back normally, so a partial override is fine.</p>

			<h2 id="language-specific-matching">Language-specific matching</h2>
			<p>
				Five rules judge text by known phrases, so they carry word lists as well as messages:{" "}
				<code>link-name-quality</code> ("click here", 「こちら」), <code>heading-quality</code>{" "}
				("Untitled", 「見出し」), <code>form-control-label-quality</code> ("Label", 「入力欄」),{" "}
				<code>page-title-patterns</code> ("Home", 「トップページ」) and{" "}
				<code>media-alternative-transcript-evidence</code> ("transcript", 「文字起こし」). Each list
				covers <code>en</code>, <code>de</code>, <code>es</code>, <code>fr</code> and <code>ja</code>.
				The <code>skip-link</code> rule recognises skip-link wording in the same five languages.
			</p>
			<p>
				English is always checked. The list for the element's own language, taken from the nearest{" "}
				<code>lang</code> attribute (the <code>&lt;html&gt;</code> element's for a page title), is
				added on top. Checking every list everywhere would flag words that are generic in one
				language and a real name in another, such as "Suite" or "Plus" on an English page.
				Transcript words are the exception: they are distinctive in every language and a page can
				link a transcript in another language, so all of them are always checked. Text is
				NFKC-normalized first, so full-width forms such as 「見出し２」 match.
			</p>
			<p>
				<code>page-title-patterns</code> also counts each Chinese, Japanese or Korean character as
				two when deciding whether a title is too short, since 「お問い合わせ」 is a complete title in
				six characters.
			</p>

			<h2>Where keys are used</h2>
			<p>Several key namespaces, all resolved the same way:</p>
			<ul>
				<li>
					<strong>Rule-level</strong>: <code>meta.i18n.titleKey</code> / <code>meta.i18n.descriptionKey</code>{" "}
					— resolve a rule's <code>title</code>/<code>description</code> on every{" "}
					<code>checksResults[]</code> entry.
				</li>
				<li>
					<strong>HTML report</strong>: the <code>report_*</code> keys label the page{" "}
					<code>@surea11y/core/report</code> renders — headings, table columns, outcome and severity
					names, the headline, the pager. The report reads them in the locale the scan resolved to,
					so a dictionary translates the report too.
				</li>
				<li>
					<strong>Composite-level</strong>: each <code>rulesResults[]</code> rollup's{" "}
					<code>title</code>/<code>description</code>, using each language's published name for the
					Success Criterion.
				</li>
				<li>
					<strong>Occurrence-level</strong>: <code>i18n.summaryKey</code> / <code>i18n.hintKey</code>,
					with <code>i18n.params</code> for <code>{"{{placeholder}}"}</code> interpolation —
					resolve an occurrence's <code>summary</code>/<code>hint</code>. See{" "}
					<a href="/results-reports/output-schema/">the output schema</a>.
				</li>
			</ul>
			<p>
				The rule, composite and occurrence keys are included in the result alongside the
				already-resolved text, so you can re-render
				in a different locale from a saved result without re-scanning.
			</p>
		</>
	);
}
