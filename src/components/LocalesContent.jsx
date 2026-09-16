import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const localeCoverageRows = [
	{ id: "en", locale: <code>en</code>, name: "English", file: <code>src/i18n/en.json</code>, keys: "692", untranslated: "— (the canonical/fallback set)" },
	{ id: "fr", locale: <code>fr</code>, name: "French", file: <code>src/i18n/fr.json</code>, keys: "692", untranslated: "7" },
	{ id: "de", locale: <code>de</code>, name: "German", file: <code>src/i18n/de.json</code>, keys: "692", untranslated: "6" },
	{ id: "es", locale: <code>es</code>, name: "Spanish", file: <code>src/i18n/es.json</code>, keys: "692", untranslated: "6" },
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
				The project has no such translation at all, so English was used. <code>ja</code> and{" "}
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
				rowKey="id"
				columns={[
					{ key: "locale", label: "Locale", width: "18%" },
					{ key: "file", label: "File", width: "24%" },
					{ key: "keys", label: "Keys", width: "12%" },
					{ key: "untranslated", label: "Values still in English", wrap: true },
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
			<p>Default is <code>'en'</code> if omitted. Any string is accepted; an unrecognized locale is never an error.</p>

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
				The result is never a blank, an <code>undefined</code>, or a thrown error. A
				half-finished translation renders in your language where it exists and in English
				everywhere else.
			</p>

			<h2>Knowing which locale you actually got</h2>
			<p>
				Graceful fallback has one drawback: ask for a language the build doesn't carry and you get
				fluent English back, with nothing in the strings to say so. Every result therefore reports
				the resolution once, at the top:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"engine": {',
					'  "tag": "a11ycore",',
					'  "schemaVersion": "1.0.0",',
					'  "locale": { "requested": "ja", "resolved": "en", "reason": "unknown-locale" }',
					"}",
				]}
			/>
			<p>
				<code>requested</code> is what you asked for (after trimming; <code>en</code> if you
				passed nothing or a non-string), <code>resolved</code> is the dictionary that was used,
				and <code>reason</code> is one of:
			</p>
			<DataTable
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
				rowKey="id"
				columns={[
					{ key: "how", label: "How you load it", width: "36%" },
					{ key: "what", label: "What you get", wrap: true },
				]}
				rows={dictionaryLocationRows}
			/>
			<p>
				The bundle is split because it travels over the network to every page that uses it, and
				no page needs all four languages. Keeping English inline and the rest optional took about
				280 KB off the download and stops it growing as languages are added. Nothing else
				changes: the Node package and the bindings are unaffected.
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y.browser.js"></script>',
					'<script src="surea11y.i18n.de.js"></script>',
				]}
			/>
			<p>
				Ask for a language whose file you didn't load and you get English, with{" "}
				<code>engine.locale.reason</code> set to <code>dictionary-not-loaded</code> — different
				from <code>unknown-locale</code>, which means the project has no such translation at all.
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

			<h2>Where keys are used</h2>
			<p>Two independent key namespaces, both resolved the same way:</p>
			<ul>
				<li>
					<strong>Rule-level</strong>: <code>meta.i18n.titleKey</code> / <code>meta.i18n.descriptionKey</code>{" "}
					— resolve a rule's <code>title</code>/<code>description</code> on every{" "}
					<code>checksResults[]</code> entry.
				</li>
				<li>
					<strong>Occurrence-level</strong>: <code>i18n.summaryKey</code> / <code>i18n.hintKey</code>,
					with <code>i18n.params</code> for <code>{"{{placeholder}}"}</code> interpolation —
					resolve an occurrence's <code>summary</code>/<code>hint</code>. See{" "}
					<a href="/results-reports/output-schema/">the output schema</a>.
				</li>
			</ul>
			<p>
				Both are included in the result alongside the already-resolved text, so you can re-render
				in a different locale from a saved result without re-scanning.
			</p>
		</>
	);
}
