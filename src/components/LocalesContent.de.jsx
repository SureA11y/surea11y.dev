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
	untranslated: l.canonical ? "— (der kanonische Satz bzw. Fallback)" : String(l.stillEnglish),
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

const reviewDictionaryRows = [
	{
		id: "node",
		who: <><code>runDomRulesInPage</code>, <code>addHowToCheck</code>, <code>howToCheckFor</code>, <code>renderHtmlReport</code></>,
		how: <>Aus dem installierten Paket, gesucht nach der Locale in Kleinbuchstaben (<code>fr-ca</code>, dann <code>fr</code>), Englisch zuletzt.</>,
	},
	{
		id: "browser",
		who: "Code, der im Browser läuft (eine Cypress-Spec)",
		how: <><code>{"applyHowToCheck(result, { en, fr })"}</code> aus <code>@surea11y/core/how-to-check</code>, mit den Wörterbüchern, die er als <code>@surea11y/core/review/&lt;locale&gt;</code> importiert.</>,
	},
	{
		id: "bundle",
		who: <><code>a11ycore.openReport(result)</code> im Browser-Bundle</>,
		how: <>Neben dem Bundle abgerufen oder als <code>{"{ reviewDictionaries }"}</code> übergeben.</>,
	},
];

const localeReasonRows = [
	{ id: "ok", reason: <code>ok</code>, meaning: "Sie haben genau das bekommen, was Sie angefordert haben, und dieses Wörterbuch enthält jeden Schlüssel." },
	{
		id: "primary-subtag",
		reason: <code>primary-subtag</code>,
		meaning: (
			<>
				Ihr Code enthielt einen Subtag ohne eigenes Wörterbuch, deshalb wurde die Basissprache
				verwendet: Sie haben <code>de-DE</code> angefordert und <code>de</code> bekommen. Normal und
				erwartet; es gibt nichts zu beheben. Ein reiner Unterschied in der Groß-/Kleinschreibung
				fällt nicht darunter: <code>DE</code> meldet <code>ok</code>.
			</>
		),
	},
	{
		id: "dictionary-not-loaded",
		reason: <code>dictionary-not-loaded</code>,
		meaning: "Das Projekt liefert diese Sprache aus, aber diese Kopie der Engine enthält sie nicht, und es wurde auch keine übergeben. In der Praxis: das Standalone-Browser-Bundle ohne die zugehörige Locale-Datei.",
	},
	{
		id: "unknown-locale",
		reason: <code>unknown-locale</code>,
		meaning: (
			<>
				Das Projekt hat überhaupt keine solche Übersetzung, deshalb wurde Englisch verwendet.{" "}
				<code>ko</code> und <code>pt-BR</code> landen derzeit beide hier.
			</>
		),
	},
	{
		id: "partial-dictionary",
		reason: <code>partial-dictionary</code>,
		meaning: "Das Wörterbuch wurde verwendet, aber ihm fehlen einige Schlüssel, deshalb sind diese einzelnen Strings auf Englisch zurückgefallen.",
	},
];

const dictionaryLocationRows = [
	{ id: "require", how: <code>require('@surea11y/core')</code>, what: "Jede Locale, fest eingebaut. Nichts zu konfigurieren." },
	{ id: "binding", how: "Ein Binding (Playwright, Cypress, …)", what: "Jede Locale, fest eingebaut. Nichts zu konfigurieren." },
	{
		id: "browser",
		how: <code>surea11y.browser.js</code>,
		what: (
			<>
				Englisch. Laden Sie für alles andere danach <code>surea11y.i18n.&lt;locale&gt;.js</code>.
			</>
		),
	},
];

export function LocalesContent() {
	return (
		<>
			<p>
				Titel und Beschreibung jeder Regel sowie Zusammenfassung und Hinweis jedes Vorkommens
				werden über ein schlüsselbasiertes Wörterbuch lokalisiert, nicht pro Sprache fest
				einprogrammiert.
			</p>

			<h2>Aktuelle Abdeckung der Locales</h2>
			<DataTable
				label="Abdeckung der Locales"
				rowKey="id"
				columns={[
					{ key: "locale", label: "Locale", width: "18%" },
					{ key: "file", label: "Datei", width: "24%" },
					{ key: "keys", label: "Schlüssel", width: "12%" },
					{ key: "untranslated", label: "Unübersetzt", wrap: true },
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
				„Unübersetzt“ zählt Werte, die Zeichen für Zeichen dem englischen Text entsprechen,
				außer Wörtern, die in einer Sprache zu Recht gleich sind: französisch{" "}
				<em lang="fr">Orientation</em>, <em lang="fr">Interruptions</em> und{" "}
				<em lang="fr">Occurrences</em>, deutsch <em>Frame</em>, <em>Frames</em> und{" "}
				<em>Element</em>, spanisch{" "}
				<em lang="es">Selector</em>. Diese sind als solche aufgeführt, jeweils mit dem englischen
				Text, gegen den sie geprüft wurden, und zählen als übersetzt. Ändert sich das Englische,
				gilt der Eintrag nicht mehr, und der String zählt als unübersetzt, bis ihn jemand erneut
				prüft. Ein englisches Wort in einem sonst übersetzten Satz sieht die Zählung nicht; das
				findet man beim Lesen des Textes, und in den Locales oben ist keines mehr übrig. Ebenso
				wenig misst sie, ob eine Übersetzung korrekt ist oder die in einer Sprache üblichen
				Begriffe der Barrierefreiheit verwendet; das kann nur jemand beurteilen, der die Sprache
				liest.
			</p>

			<h3 id="reading-coverage-from-the-package">Abdeckung aus dem Paket lesen</h3>
			<p>
				Dieselben Zahlen sind zur Laufzeit verfügbar, aus den Wörterbüchern, die das installierte
				Paket mitbringt. Ein Tool oder eine Dokumentationsseite kann sie also anzeigen, ohne das
				Repository auszuchecken:
			</p>
			<CodeBlock lang="js" lines={coverageSampleLines} />
			<p>
				Pro Locale ist <code>total</code> die Zahl der englischen Schlüssel, an der sie gemessen
				wird, <code>translated</code>, wie viele ihrer Werte sich vom Englischen unterscheiden oder
				als zu Recht gleich aufgeführt sind, <code>missing</code>, wie viele Schlüssel ihr fehlen
				(sie erscheinen auf Englisch), und <code>orphaned</code> die Schlüssel, die sie hat, das
				Englische aber nicht. <code>total - translated</code> ist die Spalte „Unübersetzt“ oben,
				fehlende Schlüssel eingeschlossen. Schlüssel, die ein Profil bewusst aus einer Locale
				weglässt, werden nicht gezählt. Der Abdeckungsbericht des Repositorys und diese Funktion
				teilen sich eine Implementierung und stimmen daher immer überein; der Bericht zählt die
				Wörterbücher von core und die jedes Profils getrennt, diese Funktion das
				zusammengeführte Wörterbuch, das ein Scan verwendet. Sie ist ein unterstützter Export (
				<a href={`${core}/docs/API_STABILITY.md#extension-points`}>
					<code>API_STABILITY.md</code>, Erweiterungspunkte
				</a>
				).
			</p>
			<p>
				Locale-Dateien sind einfaches JSON: eine flache Zuordnung von Schlüssel zu übersetztem
				String, in derselben Schlüsselreihenfolge wie <code>en.json</code>. Sonst steht nichts
				darin, eine Sprache beizutragen heißt also, Text zu bearbeiten, ohne Code anzufassen.
			</p>
			<p>
				Jede Locale enthält jeden Schlüssel, den <code>en.json</code> hat. Dafür sorgt{" "}
				<code>npm run i18n:sync</code>: Nach jeder Änderung an <code>en.json</code> ausgeführt,
				schreibt es jede nicht-englische Locale-Datei passend um. Es ergänzt neue Schlüssel,
				entfernt Schlüssel, die <code>en.json</code> nicht mehr hat, und lässt vorhandene
				Übersetzungen unverändert. Ein neu ergänzter Schlüssel wird mit dem englischen Text
				vorbelegt und gilt als unübersetzt, bis ihn jemand ersetzt.
			</p>

			<h2>Eine Locale auswählen</h2>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { locale: 'fr' }, null);"]} />
			<p>Ohne Angabe ist der Standard <code>'en'</code>. Jeder String wird akzeptiert; <strong>eine unbekannte Locale ist nie ein Fehler</strong>.</p>

			<h2>Wie eine Locale gewählt wird</h2>
			<p>
				Es passieren zwei Dinge, in dieser Reihenfolge. Die meisten Missverständnisse entstehen,
				wenn man sie verwechselt, darum werden sie getrennt beschrieben.
			</p>
			<h3>Schritt 1: ein Wörterbuch wählen (einmal pro Scan)</h3>
			<ol>
				<li>
					Das Wörterbuch verwenden, das zu Ihrem Code passt. <code>de</code> findet{" "}
					<code>de.json</code>. Groß-/Kleinschreibung spielt keine Rolle: <code>pt-br</code>,{" "}
					<code>pt-BR</code> und <code>PT-BR</code> finden alle <code>pt-BR.json</code>.
				</li>
				<li>
					Andernfalls alles nach dem ersten <code>-</code> abschneiden und das versuchen.{" "}
					<code>de-DE</code> findet <code>de.json</code>, ebenso <code>de-AT</code>.
				</li>
				<li>Andernfalls Englisch verwenden.</li>
			</ol>
			<p>
				Eine <code>de-DE.json</code> brauchen Sie also nur, wenn sich Deutsch in Österreich und
				Deutschland tatsächlich unterschiedlich lesen soll. Liefern Sie <code>de.json</code> aus,
				ist jede deutsche Variante abgedeckt.
			</p>
			<h3>Schritt 2: jeden String auflösen (pro String)</h3>
			<p>Innerhalb des gewählten Wörterbuchs wird jeder String einzeln nachgeschlagen:</p>
			<ol>
				<li>Den Wert des Schlüssels aus dem gewählten Wörterbuch nehmen.</li>
				<li>Fehlt dieser Schlüssel, den englischen nehmen.</li>
				<li>
					Fehlt er auch im Englischen (was bei einem eingebauten Schlüssel nicht vorkommen sollte,
					bei einem selbst angelegten aber schon), den wörtlichen Text verwenden, den die Regel
					selbst mitbringt.
				</li>
			</ol>
			<p>
				<strong>Das Ergebnis ist nie leer, nie <code>undefined</code> und nie ein geworfener Fehler.</strong>{" "}
				Eine halb fertige Übersetzung erscheint in Ihrer Sprache, wo es sie gibt, und überall
				sonst auf Englisch.
			</p>

			<h2>Erkennen, welche Locale Sie tatsächlich bekommen haben</h2>
			<p>
				Der sanfte Fallback hat einen Nachteil:{" "}
				<strong>Fordern Sie eine Sprache an, die der Build nicht enthält, bekommen Sie
				einwandfreies Englisch zurück, ohne dass die Strings darauf hinweisen</strong>. Jedes
				Ergebnis meldet die Auflösung deshalb einmal, ganz oben:
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
				<code>requested</code> ist das, was Sie angefordert haben (nach dem Trimmen;{" "}
				<code>en</code>, wenn Sie nichts oder keinen String übergeben haben),{" "}
				<code>resolved</code> ist das verwendete Wörterbuch, und <code>reason</code> ist einer
				dieser Werte:
			</p>
			<DataTable
				label="Werte von locale.reason"
				rowKey="id"
				columns={[
					{ key: "reason", label: "reason", width: "26%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={localeReasonRows}
			/>
			<p>
				Behandeln Sie die Liste als offen: Ein späteres Release kann einen Wert hinzufügen. Prüfen
				Sie also auf die Werte, die Sie interessieren, und lassen Sie den Rest in einen
				Standardfall laufen.
			</p>
			<p>
				Wenn Sie eine bestimmte Sprache brauchen, ist <code>requested !== resolved</code> die
				Bedingung, die Sie in der CI prüfen. Beachten Sie, dass sie auch im harmlosen Fall{" "}
				<code>primary-subtag</code> zutrifft; prüfen Sie also auf{" "}
				<code>reason === 'unknown-locale' || reason === 'dictionary-not-loaded'</code>, wenn
				Ihnen ein Treffer auf die Basissprache genügt. Siehe{" "}
				<a href="/results-reports/output-schema/">das Ausgabeschema</a> für die Stelle des Felds im Ergebnis und{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> dafür, was
				dazu garantiert ist.
			</p>

			<h2>Wo die Wörterbücher liegen</h2>
			<p>Welche Sprachen verfügbar sind, hängt davon ab, wie Sie die Engine laden.</p>
			<DataTable
				label="Herkunft der Wörterbücher"
				rowKey="id"
				columns={[
					{ key: "how", label: "Wie Sie sie laden", width: "36%" },
					{ key: "what", label: "Was Sie bekommen", wrap: true },
				]}
				rows={dictionaryLocationRows}
			/>
			<p>
				Das Bundle ist aufgeteilt, weil es über das Netzwerk an jede Seite geht, die es nutzt, und
				keine Seite alle Sprachen braucht. Englisch inline und den Rest optional zu halten, hält
				die anderen Sprachen aus dem Download heraus und verhindert, dass er mit jeder neuen
				Sprache wächst. Jede Zusatzdatei, <code>surea11y.i18n.&lt;locale&gt;.js</code>, ist etwa so
				groß wie der englische Text, den sie ersetzt (derzeit 200 bis 250 KB), und eine Seite lädt
				nur die, die sie nutzt. Sonst ändert sich nichts: Das Node-Paket und die Bindings sind nicht
				betroffen.
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
				Fordern Sie eine Sprache an, deren Datei Sie nicht geladen haben, bekommen Sie Englisch,
				mit <code>engine.locale.reason</code> auf <code>dictionary-not-loaded</code>. Das
				unterscheidet sich von <code>unknown-locale</code>, was bedeutet, dass das Projekt
				überhaupt keine solche Übersetzung hat.
			</p>
			<p>
				In Node ist dieselbe Zusatzdatei ein Modul: <code>require('@surea11y/core/i18n/de')</code>{" "}
				gibt <code>{"{ locale, messages }"}</code> zurück (<code>locale</code> ist <code>'de'</code>,{" "}
				<code>messages</code> die flache Zuordnung von Schlüssel zu Text), ohne dass das Bundle
				nötig ist.
			</p>
			<p>
				Die Meldungen eines <a href="/configuration/packs/">Packs</a> stehen in dessen eigenen
				Wörterbüchern, die das Pack pro Locale auflistet; in einer Locale, für die das Pack kein
				Wörterbuch hat, erscheinen seine Meldungen auf Englisch.
			</p>

			<h3 id="review-dictionaries">Die Prüf-Wörterbücher</h3>
			<p>
				Die Schritte, die einer Person sagen, wie sie einen offenen Befund beantwortet (
				<code>howToCheck</code>, siehe <a href="/results-reports/output-schema/#how-to-check">das
				Ausgabeschema</a>), stehen in eigenen Wörterbüchern, in denselben fünf Locales. Sie sind
				von den Wörterbüchern der Engine getrennt, damit die Schritte nie ins Bundle oder in eine
				Seite gelangen: Sie werden nach dem Scan hinzugefügt, in Node oder durch Code, der sie
				importiert. Ab core 1.14.0.
			</p>
			<DataTable
				label="Wer die Prüf-Wörterbücher liest"
				rowKey="id"
				columns={[
					{ key: "who", label: "Wer sie liest", width: "40%", wrap: true },
					{ key: "how", label: "Wie", wrap: true },
				]}
				rows={reviewDictionaryRows}
			/>
			<p>
				Ein Schritt, der einer Locale fehlt, erscheint auf Englisch, wie eine Meldung. Die{" "}
				<a href="/configuration/packs/#review-steps">eigenen Schritte einer Pack-Regel</a> sind
				englisch, außer die Wörterbücher ihres Packs übersetzen sie (ab core 1.15.0).{" "}
				<code>getLocaleCoverage()</code> zählt diese Wörterbücher nicht. Die
				Schritte tragen keine Schlüssel; um sie in einer anderen Locale zu zeigen, fügen Sie sie
				erneut hinzu:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { addHowToCheck } = require('@surea11y/core');",
					"",
					"const inFrench = addHowToCheck(result, { locale: 'fr' });",
				]}
			/>

			<h3 id="procedure-dictionaries">Die Wörterbücher der Prüfverfahren</h3>
			<p>
				Seit core 1.15.0 werden die Prüfschritte mit den{" "}
				<a href="/conformance/procedures/">Prüfverfahren</a> von core geschrieben, also damit, wie
				eine Person jedes Kriterium von Hand bewertet, und die Prüf-Wörterbücher werden aus ihnen
				erzeugt. Die Wörterbücher der Prüfverfahren, <code>{"@surea11y/core/procedures/<locale>"}</code>,
				enthalten die allgemeinen Prüfverfahren, die Namen der Werkzeuge, die Wörter einer daraus
				erzeugten Seite und die Namen der Prinzipien, Richtlinien und Kriterien von WCAG und jeder
				Facette, jeweils in der veröffentlichten Übersetzung von WCAG in dieser Sprache. Alle fünf
				Locales haben jeden Text, sodass eine Seite mit Prüfverfahren durchgehend in einer Sprache
				ist; <code>procedureLanguages()</code> sagt das für jede Locale und für den Standard eines
				Packs, der in weniger Sprachen lesbar sein kann.
			</p>

			<h3>Ein eigenes Wörterbuch übergeben</h3>
			<p>
				<code>engineOptions.messages</code> akzeptiert <code>{"{ [locale]: { key: value } }"}</code>{" "}
				und hat Vorrang vor allem, was eingebaut ist oder aus einer separaten Datei geladen wird.
				Nützlich, um eine Handvoll Strings zu überschreiben, oder für eine Sprache, die Sie
				intern pflegen:
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
			<p>Schlüssel, die Sie nicht übergeben, fallen normal zurück; eine teilweise Überschreibung ist also kein Problem.</p>

			<h2 id="language-specific-matching">Sprachspezifischer Abgleich</h2>
			<p>
				Fünf Regeln beurteilen Text anhand bekannter Formulierungen und bringen daher neben
				Meldungen auch Wortlisten mit: <code>link-name-quality</code> („<span lang="en">click here</span>“,
				„<span lang="ja">こちら</span>“), <code>heading-quality</code> („<span lang="en">Untitled</span>“,
				„<span lang="ja">見出し</span>“), <code>form-control-label-quality</code>{" "}
				(„<span lang="en">Label</span>“, „<span lang="ja">入力欄</span>“),{" "}
				<code>page-title-patterns</code> („<span lang="en">Home</span>“,
				„<span lang="ja">トップページ</span>“) und <code>media-alternative-transcript-evidence</code>{" "}
				(„<span lang="en">transcript</span>“, „<span lang="ja">文字起こし</span>“). Jede Liste deckt{" "}
				<code>en</code>, <code>de</code>, <code>es</code>, <code>fr</code> und <code>ja</code> ab.
				Die Regel <code>skip-link</code> erkennt Skip-Link-Formulierungen in denselben fünf
				Sprachen.
			</p>
			<p>
				Englisch wird immer geprüft. Die Liste der eigenen Sprache des Elements, aus dem nächsten{" "}
				<code>lang</code>-Attribut (bei einem Seitentitel dem des <code>&lt;html&gt;</code>-Elements),
				kommt hinzu. <code>link-name-quality</code> prüft die Listen aller Sprachen, wo im Baum
				über dem Link nirgends ein <code>lang</code> angegeben ist, da der Link in jeder davon sein
				kann. Alle Listen überall zu prüfen, würde Wörter melden, die in einer Sprache
				generisch und in einer anderen ein echter Name sind, etwa „<span lang="fr">Suite</span>“ oder
				„Plus“ auf einer englischen Seite. Transkript-Wörter sind die Ausnahme: Sie sind in jeder
				Sprache eindeutig, und eine Seite kann ein Transkript in einer anderen Sprache verlinken,
				daher werden sie immer alle geprüft. Text wird zuerst nach NFKC normalisiert, sodass auch
				Formen voller Breite wie „<span lang="ja">見出し２</span>“ erkannt werden.
			</p>
			<p>
				<code>page-title-patterns</code> zählt außerdem jedes chinesische, japanische oder
				koreanische Zeichen doppelt, wenn es entscheidet, ob ein Titel zu kurz ist, da
				„<span lang="ja">お問い合わせ</span>“ mit sechs Zeichen ein vollständiger Titel ist.
			</p>

			<h2>Wo Schlüssel verwendet werden</h2>
			<p>Mehrere Schlüssel-Namensräume, alle auf dieselbe Weise aufgelöst:</p>
			<ul>
				<li>
					<strong>Regelebene</strong>: <code>meta.i18n.titleKey</code> / <code>meta.i18n.descriptionKey</code>{" "}
					lösen <code>title</code>/<code>description</code> einer Regel in jedem Eintrag von{" "}
					<code>checksResults[]</code> auf.
				</li>
				<li>
					<strong>HTML-Bericht</strong>: Die <code>report_*</code>-Schlüssel beschriften die Seite,
					die <code>@surea11y/core/report</code> erzeugt — Überschriften, Tabellenspalten, Namen von
					Ergebnissen und Schweregraden, die Kopfzeile, die Seitennavigation. Der Bericht liest sie
					in der Locale, auf die der Scan aufgelöst wurde; ein Wörterbuch übersetzt also auch den
					Bericht.
				</li>
				<li>
					<strong>Auf Ebene der zusammengesetzten Regeln</strong>: <code>title</code>/
					<code>description</code> jeder Zusammenfassung in <code>rulesResults[]</code>, mit dem
					veröffentlichten Namen des Erfolgskriteriums in jeder Sprache.
				</li>
				<li>
					<strong>Vorkommensebene</strong>: <code>i18n.summaryKey</code> / <code>i18n.hintKey</code>,
					mit <code>i18n.params</code> für die Interpolation von <code>{"{{placeholder}}"}</code>,
					lösen <code>summary</code>/<code>hint</code> eines Vorkommens auf.{" "}
					<code>i18n.whyKey</code> / <code>i18n.cautionKey</code> einer Tendenz lösen deren{" "}
					<code>why</code> und <code>caution</code> auf dieselbe Weise auf. Siehe{" "}
					<a href="/results-reports/output-schema/">das Ausgabeschema</a>.
				</li>
				<li>
					<strong>Prüfung</strong>: <code>{"<prefix>_review_<CODE>_step<n>"}</code>,{" "}
					<code>_pass</code> und <code>_fail</code>, in{" "}
					<a href="#review-dictionaries">den Prüf-Wörterbüchern</a>: das{" "}
					<code>howToCheck</code> eines offenen Vorkommens.
				</li>
				<li>
					<strong>Prüfverfahren</strong>: <code>{"wcag_<criterion>_<facet>_step<n>"}</code>,{" "}
					<code>_pass</code> und <code>_fail</code>, <code>{"tool_<id>"}</code> und{" "}
					<code>render_*</code>, in <a href="#procedure-dictionaries">den Wörterbüchern der
					Prüfverfahren</a>.
				</li>
			</ul>
			<p>
				Die Schlüssel von Regel, Composite und Vorkommen stehen im Ergebnis neben dem bereits aufgelösten Text, sodass Sie ein gespeichertes
				Ergebnis in einer anderen Locale neu darstellen können, ohne erneut zu scannen.
			</p>

			<h2 id="help-with-translations">Bei Übersetzungen helfen</h2>
			<p>
				Jede Sprache, die noch nicht in der Tabelle oben steht, ist willkommen, für die Meldungen
				der Engine wie für diese Website, und ebenso jede Hilfe, die nicht gleich eine ganze
				Sprache übersetzt. Übersetzen erfordert keinen Code: Die Meldungen der Engine sind Dateien
				mit Texten, und jede Seite dieser Website hat eine Datei pro Sprache.
			</p>
			<ul>
				<li>
					<strong>Melden Sie einen falschen oder unklaren Text</strong> in einer Sprache, die Sie
					lesen: eine Meldung der Engine mit einem{" "}
					<a href="https://github.com/SureA11y/core/issues/new?template=translation.md">Übersetzungs-Issue zur Engine</a>, eine Seite dieser Website mit{" "}
					<a href="https://github.com/SureA11y/surea11y.dev/issues/new?template=translation.md">einem Issue zur Website</a>.
				</li>
				<li>
					<strong>Prüfen Sie eine Sprache</strong>, wenn sie Ihre Muttersprache ist und Sie im
					Bereich Barrierefreiheit arbeiten: Tragen Sie sich in die{" "}
					<a href={`${core}/docs/I18N.md#translation-reviewers`}>Liste der Übersetzungsprüfenden</a> ein. Sie werden angefragt, wenn
					eine Übersetzung der Engine oder dieser Website eine Prüfung braucht.
				</li>
				<li>
					<strong>Übersetzen Sie</strong>:{" "}
					<a href={`${core}/docs/I18N.md#adding-your-language`}>
						<span lang="en">Adding your language</span>
					</a>{" "}
					(auf Englisch) beschreibt die Schritte für die Meldungen der Engine,{" "}
					<a href="https://github.com/SureA11y/surea11y.dev#adding-a-language">die README der Website</a> die für ihre Seiten.
				</li>
			</ul>
			<p>
				Eine neue Sprache, in der Engine oder auf dieser Website, wird aufgenommen, sobald eine
				Person sie geprüft hat, deren Muttersprache sie ist und die im Bereich Barrierefreiheit
				arbeitet. Prüfende sind ebenso willkommen wie Übersetzende.
			</p>
		</>
	);
}
