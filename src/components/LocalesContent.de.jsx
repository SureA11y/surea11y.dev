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
				rowKey="id"
				columns={[
					{ key: "locale", label: "Locale", width: "18%" },
					{ key: "file", label: "Datei", width: "24%" },
					{ key: "keys", label: "Schlüssel", width: "12%" },
					{ key: "untranslated", label: "Mit Englisch identische Werte", wrap: true },
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
				Die letzte Spalte zählt Werte, die Zeichen für Zeichen dem englischen Text entsprechen. Das
				findet einen Schlüssel, den noch niemand übersetzt hat, zählt aber auch ein Wort, das in
				beiden Sprachen schlicht gleich ist, etwa französisch <em lang="fr">Orientation</em> oder{" "}
				<em lang="fr">Interruptions</em> und spanisch <em lang="es">Selector</em>: Genau das zeigen
				die Werte über null oben.
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
				rowKey="id"
				columns={[
					{ key: "how", label: "Wie Sie sie laden", width: "36%" },
					{ key: "what", label: "Was Sie bekommen", wrap: true },
				]}
				rows={dictionaryLocationRows}
			/>
			<p>
				Das Bundle ist aufgeteilt, weil es über das Netzwerk an jede Seite geht, die es nutzt, und
				keine Seite alle Sprachen braucht. Englisch inline und den Rest optional zu halten,
				hat den Download um etwa 280 KB verkleinert und verhindert, dass er mit jeder neuen
				Sprache wächst. Sonst ändert sich nichts: Das Node-Paket und die Bindings sind nicht
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
				kommt hinzu. Alle Listen überall zu prüfen, würde Wörter melden, die in einer Sprache
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
					lösen <code>summary</code>/<code>hint</code> eines Vorkommens auf. Siehe{" "}
					<a href="/results-reports/output-schema/">das Ausgabeschema</a>.
				</li>
			</ul>
			<p>
				Beide stehen im Ergebnis neben dem bereits aufgelösten Text, sodass Sie ein gespeichertes
				Ergebnis in einer anderen Locale neu darstellen können, ohne erneut zu scannen.
			</p>
		</>
	);
}
