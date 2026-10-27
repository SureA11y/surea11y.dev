import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-14">„Meine Ergebnisse haben sich nach dem Update auf core 1.14 geändert“</h2>
				<p>
					1.14 meldet mehr <code>cantTell</code> und behauptet weniger, mit Absicht. Die Änderungen,
					die sich am ehesten in einer Pipeline zeigen:
				</p>
				<ul>
					<li>
						<strong>Keine zusammengesetzte WCAG-Regel ergibt <code>pass</code>.</strong> Ein
						Kriterium gilt nur als erfüllt, wenn seine Regeln alles prüfen, was es verlangt, und
						noch keines ist als vollständig geprüft aufgeführt. Ein Kriterium, dessen Regeln alle{" "}
						<code>pass</code> ergeben, ist daher <code>cantTell</code> (
						<code>composite.rollup.cantTell.partialCheck</code>). Eines, dessen Regeln nichts
						gefunden haben, ist nur bei 2.4.3, 2.4.4, 2.4.7, 2.4.9, 2.5.3 und 4.1.1{" "}
						<code>notApplicable</code>, sonst <code>cantTell</code> (
						<code>composite.rollup.cantTell.partialCoverage</code>). Eine Regel mit{" "}
						<code>fail</code> lässt ihr Kriterium weiterhin fehlschlagen. Ein Dashboard oder Gate,
						das erfüllte Kriterien zählt, sieht keines; siehe{" "}
						<a href="#why-criterion-canttell">den Eintrag weiter unten</a> und{" "}
						<a href="/conformance/wcag-mapping/#when-a-criterion-passes">WCAG-Konformitätszuordnung</a>.
					</li>
					<li>
						<strong>Zwei Regeln fragen mehr.</strong>{" "}
						<a href="/rules/page-title-patterns/"><code>page-title-patterns</code></a> fragt nach
						jedem Seitentitel, nicht nur nach generischen oder aus Vorlagen stammenden, denn ob ein
						Titel seine Seite beschreibt, entscheidet eine Person (G88).{" "}
						<a href="/rules/duplicate-id/"><code>duplicate-id</code></a> fragt auch unter WCAG 2.0
						und 2.1 nach 4.1.1, da die Errata von 2023 es als erfüllt werten, außer ein Profil gibt{" "}
						<code>keepsParsing: true</code> an, wie <code>en301549-v3.2.1</code>.
					</li>
					<li>
						<strong>Elf neue Regeln</strong>, darunter die ersten für 3.3.1 (
						<a href="/rules/invalid-field-error-message/"><code>invalid-field-error-message</code></a>),
						4.1.3 (<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>)
						und 1.4.5 (<a href="/rules/image-of-text/"><code>image-of-text</code></a>). Die meisten
						fragen;{" "}
						<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>,{" "}
						<a href="/rules/focus-not-removed-by-script/"><code>focus-not-removed-by-script</code></a>{" "}
						und <a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a> können{" "}
						<code>fail</code> ergeben, ebenso{" "}
						<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a>, das jetzt
						die Bedingungen zwischen Attributen prüft (etwa <code>aria-valuemin</code> über{" "}
						<code>aria-valuemax</code>). Siehe <a href="/rules/">den Regelkatalog</a>.
					</li>
					<li>
						<strong>Manche Fehlschläge werden zu Fragen, und neue Fehlschläge kommen
						hinzu.</strong> <code>td-has-header</code> fragt einmal nach einer großen Tabelle ohne
						Kopfzelle, statt jede Zelle fehlschlagen zu lassen, und{" "}
						<code>form-control-single-label</code> fragt nach einem Feld mit zwei Labels. Kontrast
						wird an mehr von dem gemessen, was die Seite zeichnet (Text auf der Leinwand der Seite in
						jedem Farbschema, <code>::first-line</code>, <code>font-size-adjust</code>, ein
						Platzhalter, dessen Farben die Seite gewählt hat), es können also neue
						Kontrast-Fehlschläge erscheinen.
					</li>
					<li>
						<strong>Manche Befunde haben einen neuen Reason-Code.</strong> Siebzehn Regeln, die
						keinen gaben, geben jetzt einen, und einige Codes sind nach Ursache geteilt. Eine von
						1.13 geschriebene Baseline passt bis 1.15 weiter auf sie; schreiben Sie sie mit{" "}
						<code>migrateBaselineEntries</code> um (siehe{" "}
						<a href="#baseline-after-upgrade">den Eintrag weiter unten</a>). Eine
						Code-Scanning-Warnung zu einem solchen Befund wird geschlossen und erscheint neu.
					</li>
					<li>
						<strong>Jedes <code>cantTell</code> sagt, wie es zu beantworten ist.</strong> Der Befund
						einer Core-Regel trägt Schritte in <code>howToCheck</code>, und manche tragen ein{" "}
						<code>lean</code>: wohin die Hinweise der Seite deuten. Das Ergebnis bleibt{" "}
						<code>cantTell</code>, und nichts scheitert an einem <code>lean</code>, außer Sie
						verlangen es (<code>leanFailAs</code>). Der{" "}
						<a href="/results-reports/html-report/">HTML-Bericht</a> gruppiert diese Befunde in
						wahrscheinlich nicht erfüllt, wahrscheinlich erfüllt und solche, die eine Person prüfen
						muss. Siehe <a href="/results-reports/output-schema/#leans">Ausgabeschema</a>.
					</li>
					<li>
						<strong>1.14.1 meldet beim Textabstand weniger Fehlschläge.</strong>{" "}
						<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>{" "}
						lässt keinen Text mehr fehlschlagen, den die Seite nicht verliert. Zu einer Seite,
						deren Scrollen mit <code>{"body { position: fixed }"}</code> gesperrt ist, wie bei
						vielen hinter einem Consent-Banner, und zu einer fixierten Box, die höher als der
						Viewport ist, wird als <code>VIEWPORT_SCROLL_LOCKED</code> nachgefragt; zu Text, den
						eine Box abschneidet, die das Skript der Seite an ihn anpasst, etwa das schwebende
						Label eines Angular-Material-Felds, als <code>TEXT_CLIPPED_SCRIPT_SIZED</code>. Ein
						Baseline-Eintrag oder eine Code-Scanning-Warnung dazu wird geschlossen wie bei einem
						behobenen Fehler. Die Schritte von 36 Fragen fragen außerdem, ob ein anderer Weg auf
						der Seite dasselbe leistet, bevor sie zu einem Fehlschlag führen.
					</li>
				</ul>
				<p>
					Die vollständige Liste steht im{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>{" "}
					von core.
				</p>
			</article>

			<article>
				<h2 id="runonly-threw">
					„<code>runOnly</code> hat einen Fehler geworfen: <span lang="en">no rule or tag named …</span>,
					oder <span lang="en">either rule ids or tags</span>“
				</h2>
				<p>
					Seit 1.10.0 wird ein <code>runOnly</code>, das als nacktes Array oder als String übergeben
					wird, als Regel-IDs oder als Tags gelesen (siehe{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>). In zwei
					Fällen wirft es einen Fehler:
				</p>
				<ul>
					<li>
						<strong>Ein Wert, der weder eine Regel noch einen Tag benennt</strong>, meist ein
						Tippfehler: <code>runOnly: ['img-alt-presnt']</code>. Prüfen Sie die ID gegen{" "}
						<code>getChecksCatalog()</code>. An der Groß- und Kleinschreibung liegt es nicht:
						Regel-IDs und Tags werden unabhängig davon erkannt, <code>IMG-ALT-PRESENT</code> wählt
						also <code>img-alt-present</code> aus.
					</li>
					<li>
						<strong>Regel-IDs und Tags in einem Array</strong>:{" "}
						<code>runOnly: ['img-alt-present', 'wcag2a']</code>. Verwenden Sie die Objektform, um
						sie zu kombinieren:
					</li>
				</ul>
				<CodeBlock
					lang="js"
					lines={[
						"runOnly: {",
						"  includeRuleIds: ['img-alt-present'],",
						"  tags: ['wcag2a'],",
						"  includeMode: 'or',",
						"}",
					]}
				/>
				<p>Vor 1.10.0 wurde ein nacktes Array ignoriert, und alle Regeln liefen.</p>
				<p>
					Die Objektform, <code>{"{ includeRuleIds }"}</code>, <code>{"{ tags }"}</code> oder{" "}
					<code>{"{ type: 'tag', values }"}</code>, sowie <code>engineOptions.rules.include</code> /{" "}
					<code>.tags.include</code> werfen ebenfalls einen Fehler, mit{" "}
					<code>code: 'INVALID_RUN_ONLY'</code>, wenn kein Wert in der Liste eine Regel oder einen
					Tag benennt (<code>runOnly.tags: no tag named "wcag2.2aa".</code>). Früher liefen dann gar
					keine Regeln, was sich wie ein Scan ohne Befunde liest. Ein einzelner unbekannter Wert
					neben bekannten, oder in einer Ausschlussliste, erzeugt nur ein{" "}
					<code>console.warn</code>.
				</p>
			</article>

			<article>
				<h2 id="tags-and-rules-run-nothing">
					„Ich habe Tags und Regel-IDs ausgewählt, und der Scan hat keine Regel ausgeführt, sieht aber
					ohne Befunde aus“
				</h2>
				<p>
					Unter dem Standard <code>includeMode: 'and'</code> führt eine Auswahl aus Tags und
					Regel-IDs nur die Regeln aus, die zu beidem passen.{" "}
					<code>.withTags('wcag2a').withRules('region')</code> führt nichts aus, da{" "}
					<code>region</code> eine Best Practice ohne den Tag <code>wcag2a</code> ist, und ein Scan
					ohne Regeln hat keine Verstöße. Die Engine warnt in der Konsole der Seite, die ein
					Testlauf nicht zeigt, und wirft <code>INVALID_RUN_ONLY</code> nur unter{" "}
					<code>strictOptions</code>. Um beides auszuführen, fordern Sie es an:{" "}
					<code>.includeMode('or')</code> in den Bindings, <code>includeMode: 'or'</code> in{" "}
					<code>runOnly</code> (oben) oder <code>--include-mode or</code> in der{" "}
					<a href="/getting-started/cli/">CLI</a>. Ab Version 1.3.0 beendet sich die CLI mit{" "}
					<code>2</code> und diesem Hinweis, wenn die beiden keine gemeinsame Regel haben.
				</p>
				<p>
					Um eine Auswahl, die nichts trifft, vor dem Lauf zu erkennen, prüfen Sie{" "}
					<code>plannedChecks()</code> des Builders, die Regeln, die der Scan ausführen wird,
					ermittelt ohne Seite (in Cypress ein Chainable):
				</p>
				<CodeBlock
					lang="js"
					lines={[
						"const builder = new A11yCoreBuilder({ page })",
						"  .withTags('wcag2a')",
						"  .withRules('region')",
						"  .includeMode('or'); // the wcag2a rules, plus region",
						"",
						"if (builder.plannedChecks().length === 0) {",
						"  throw new Error('This selection runs no rule.');",
						"}",
					]}
				/>
				<p>
					Wie sich die Teile einer Auswahl kombinieren, steht in{" "}
					<a href="/configuration/engine-options/#via-runonly-4th-argument">Engine-Optionen</a>.
				</p>
			</article>

			<article>
				<h2 id="untested-wcag-tag">
					„<code>runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a")</code>“
				</h2>
				<p>
					Die neun WCAG-Tags für Version und Stufe, <code>wcag2a</code> bis <code>wcag22aaa</code>,
					sind immer bekannt, aber drei davon tragen keine Regel: <code>wcag21aaa</code>,{" "}
					<code>wcag22a</code> und <code>wcag22aaa</code>, deren Kriterien keine automatische
					Prüfung haben. Wird eines davon neben anderen Tags genannt, protokolliert{" "}
					<code>console.info</code> diese Zeile: Der Rest der Liste läuft, und diese Kriterien
					brauchen eine manuelle Prüfung. Übergeben Sie <code>engineOptions.logUntestedWcag: false</code>,
					um die Zeile wegzulassen, oder wählen Sie stattdessen nach Ziel aus, was kein Tag nennt:{" "}
					<code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code> (siehe{" "}
					<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">
						Auswahl nach WCAG-Ziel
					</a>
					). Eine Liste nur aus solchen Tags würde nichts ausführen, daher wirft sie{" "}
					<code>INVALID_RUN_ONLY</code> mit derselben Erklärung.
				</p>
			</article>

			<article>
				<h2 id="invalid-wcag-target">
					„<code>runOnly.wcag.version must be …</code>“ oder „
					<code>runOnly.bestPractices must be true or false …</code>“
				</h2>
				<p>
					<code>runOnly.wcag</code> nimmt <code>{"{ version, level }"}</code> an, mit{" "}
					<code>version</code> als <code>'2.0'</code>, <code>'2.1'</code> oder <code>'2.2'</code>{" "}
					(ein String: <code>2.2</code> als Zahl wird abgelehnt) und <code>level</code> als{" "}
					<code>'A'</code>, <code>'AA'</code> oder <code>'AAA'</code>;{" "}
					<code>runOnly.bestPractices</code> nimmt <code>true</code> oder <code>false</code> an.
					Alles andere wirft <code>INVALID_RUN_ONLY</code> mit dem Feld und dem Wert, statt eine
					Auswahl auszuführen, die Sie nicht gemeint haben.
				</p>
			</article>

			<article>
				<h2 id="invalid-engine-options">
					„<code>engineOptions: unknown option "lcoale" (did you mean "locale"?)</code>“, oder ein
					Scan hat <code>INVALID_ENGINE_OPTIONS</code> geworfen
				</h2>
				<p>
					Zu einem Optionsschlüssel, der ein oder zwei Buchstaben von einem bekannten entfernt ist,
					unabhängig von Groß- und Kleinschreibung, gibt es eine Warnung, und er wird ignoriert: Der
					Scan läuft, als wäre er nicht da, korrigieren Sie also die Schreibweise. Andere
					unbekannte Schlüssel bleiben stumm, da eine eigene Regel eigene Einstellungen aus{" "}
					<code>ctx.engineOptions</code> lesen kann. Mit <code>engineOptions.strictOptions: true</code>{" "}
					wirft der Scan stattdessen einen Fehler mit <code>code: 'INVALID_ENGINE_OPTIONS'</code>,
					bei jedem Schlüssel, den die Engine nicht liest (verschachtelte eingeschlossen), und bei
					einem Wert vom falschen Typ oder außerhalb seiner Menge, und nennt jeweils den nächsten
					bekannten Schlüssel; <code>problems</code> des Fehlers listet sie auf. Siehe{" "}
					<a href="/configuration/engine-options/#catching-mistakes-in-the-options-strictoptions">
						Fehler in den Optionen abfangen
					</a>
					.
				</p>
			</article>

			<article>
				<h2 id="custom-rule-rollup">
					„Meine eigene Regel schlägt fehl, die WCAG-Zusammenfassung aber nicht“
				</h2>
				<p>
					Eine eigene Regel zählt für die WCAG-Zusammenfassung (<code>rulesResults</code>) jedes
					Kriteriums, dem sie zugeordnet ist: Geben Sie ihr <code>meta.wcagSc: ['1.1.1']</code> oder
					einen WCAG-Eintrag in <code>meta.normativeMappings</code>. Ohne beides steht sie in keiner
					Zusammenfassung. Eine eigene Regel, die nicht gelaufen ist (aufgeführt in{" "}
					<code>skippedCustomRules</code>), zählt ebenfalls nicht. Eine Überschreibung einer
					eingebauten Regel zählt nur dort, wo ihre eigene Zuordnung es sagt; eine, die keine
					angibt, verlässt also die Zusammenfassungen, für die ihre eingebaute Regel gezählt hat,
					und eine Warnung (
					<code>customRules: "…" overrides a built-in rule but maps to none of the criteria of …</code>
					) nennt sie; geben Sie ihr die Kriterien der eingebauten Regel, damit sie dort bleibt.
				</p>
			</article>

			<article>
				<h2 id="contextselector-matched-nothing">
					„Mein eingegrenzter Scan meldet alles als <code>notApplicable</code>“ oder „
					<code>contextSelector</code> hat einen Fehler geworfen:{" "}
					<span lang="en">… is not a valid CSS selector</span>“
				</h2>
				<p>
					Seit 1.10.0 scannt ein <code>contextSelector</code>, der auf kein Element passt, nichts,
					und einer, den der Browser nicht parsen kann, wirft einen Fehler (siehe{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>).
				</p>
				<ul>
					<li>
						<strong>Alles ist <code>notApplicable</code></strong>: Sehen Sie sich{" "}
						<code>result.contextMatch</code> an. <code>elementCount: 0</code> bedeutet, dass der
						Selektor auf nichts gepasst hat, also nichts gescannt wurde: Das ist kein Ergebnis ohne
						Befunde. <code>unmatchedSelectors</code> nennt den Selektor. Prüfen Sie ihn auf Tippfehler, oder ob das Element beim Scan schon auf der Seite ist (etwa
						Inhalt, den ein Skript erst nach dem Laden rendert).
					</li>
					<li>
						<strong>
							Der Scan hat mit <code>code: 'INVALID_CONTEXT_SELECTOR'</code> einen Fehler geworfen
						</strong>
						: Der Selektor in der Meldung und in der Eigenschaft <code>selector</code> des Fehlers
						ist kein gültiges CSS, zum Beispiel <code>'#main['</code> oder ein{" "}
						<code>&gt;&gt;&gt;</code>-Kombinator. Oder der Bereich ist gar kein Selektor, etwa ein
						Element oder ein Objekt <code>{"{ include, exclude }"}</code>, und die Meldung sagt,
						was übergeben wurde: Übergeben Sie einen Selektor, der auf das Element passt, und
						Ausschlüsse in <code>engineOptions.excludeSelectors</code>.
					</li>
				</ul>
				<p>
					In jedem dieser Fälle wurde früher stattdessen die ganze Seite gescannt: bei einem
					Selektor, der auf nichts passte oder sich nicht parsen ließ, bis 1.10.0, und bei einem
					Bereich, der kein Selektor ist, auch noch in 1.10.0.
				</p>
			</article>

			<article>
				<h2 id="page-builtins-broken">„Ein Scan hat <code>PAGE_BUILTINS_BROKEN</code> geworfen“</h2>
				<p>
					Die eigenen Skripte der Seite haben ein JavaScript-Built-in verändert, auf das sich die
					Engine verlässt (<code>Array.prototype.filter</code>, <code>Map</code>,{" "}
					<code>JSON.stringify</code> und weitere), daher könnte ein Scan der Seite ein Ergebnis
					liefern, das sich gut liest und falsch ist. Die Meldung des Fehlers und seine Liste{" "}
					<code>broken</code> nennen jedes davon. Scannen Sie die Seite, bevor ihre Skripte sie
					verändern (fügen Sie das Bundle früher ein, oder scannen Sie einen Build ohne das Skript,
					das es tut). Siehe <a href="/help/known-limitations/">Bekannte Einschränkungen</a>.
				</p>
			</article>

			<article>
				<h2 id="scan-never-returns">„Mein Scan kehrt nie zurück“</h2>
				<p>
					Etwas in der Seite blockiert den Scan: ein Getter oder ein Skript, das nie zurückkehrt,
					oder eine Schleife in einer Regel eines Packs oder einer eigenen Regel. Nichts innerhalb der
					Seite kann einen Scan anhalten, sobald er begonnen hat; setzen Sie das Zeitlimit also dort,
					wo Sie ihn starten, und geben Sie den Tab auf, wenn es überschritten ist.{" "}
					<a href="/getting-started/standalone/#a-time-limit-on-a-scan">Standalone</a> zeigt, wie das
					mit Playwright und Puppeteer geht; in jsdom führen Sie den Scan in einem Worker-Thread oder
					einem Kindprozess aus.
				</p>
			</article>

			<article>
				<h2 id="scan-time">„Ein Scan dauert nach einem Update länger“</h2>
				<p>
					Den Großteil eines Scans machen Style- und Layout-Berechnungen im Browser aus; seine Dauer
					hängt deshalb ebenso von der Seite, dem Rechner und dem Browser ab wie von der Engine. Ein
					Release kann sie trotzdem ändern: Eine Regel, die jetzt mehr von der Seite prüft, kostet
					mehr, und das <a href={`${core}/CHANGELOG.md`}><code>CHANGELOG.md</code></a> von core sagt,
					wann ein Release ändert, was eine Regel kostet. <a href={`${core}/docs/PERFORMANCE.md`}><code>PERFORMANCE.md</code></a>{" "}
					auf GitHub hält fest, wie lange ein Scan von Release zu Release dauert, als Verhältnis zu
					einem früheren Release auf denselben Seiten, und wie das gemessen wird. Eine Regel, die
					langsamer ist und mehr findet, zahlt womöglich für das, was sie jetzt findet; eine, die bei
					gleichen Ergebnissen langsamer ist, ist eine Regression, die es wert ist, <a href="https://github.com/SureA11y/core/issues">gemeldet</a>{" "}
					zu werden.
				</p>
			</article>

			<article>
				<h2 id="pack-did-not-run">„Ein Pack ist nicht gelaufen“, oder <code>skippedPacks</code> ist nicht leer</h2>
				<p>
					Ein Pack, dessen <code>core</code>-Bereich das installierte core ausschließt, das nicht
					gültig ist oder das nicht zu core passt (eine Regel-ID außerhalb seines Namensraums, ein
					Wörterbuchschlüssel, den core hat), wird übersprungen: Der Scan läuft ohne es, warnt und
					listet es mit dem Grund in <code>result.skippedPacks</code>; unter{" "}
					<code>strictOptions</code> wirft er einen Fehler. In einer Seite wird ein in{" "}
					<code>engineOptions.packs</code> genanntes Pack, das kein Aufruf von{" "}
					<code>packScript</code> registriert hat oder das mit einer anderen core-Version registriert
					wurde, genauso aufgeführt. Die Bindings melden es als Lücke{" "}
					<code>'pack-skipped'</code>, die Test-Matcher lassen die Assertion scheitern, und die CLI
					endet mit Exit-Code <code>2</code>. Installieren Sie das Pack neben <code>@surea11y/core</code> und dem
					Paket, das es ausführt, damit alle drei dieselbe Kopie von core nutzen. Siehe{" "}
					<a href="/configuration/packs/#when-a-pack-doesnt-run">Packs</a>.
				</p>
			</article>

			<article>
				<h2>„Meine eigene Regel liefert immer <code>cantTell</code> ohne erkennbaren Grund“</h2>
				<p>
					Prüfen Sie zuerst das Feld <code>error</code> des Ergebnisses — steht dort{" "}
					<code>"&lt;something&gt; is not defined"</code>, verweist Ihr <code>runInPage</code> auf
					eine Variable außerhalb des Funktionskörpers (eine <code>const</code> auf Modulebene,
					einen importierten Helfer, alles, was nicht über <code>ctx.*</code> erreicht wird). Das
					ist eine echte, häufige Falle: <code>runInPage</code> wird zu Quelltext serialisiert und
					später im Seitenkontext erneut ausgewertet, daher <strong>fängt der Build das nie ab —
					erst das Ausführen der Regel zeigt es</strong>, und der Fehler sieht aus wie ein normales
					(wenn auch wenig aussagekräftiges) Ergebnis, nicht wie ein Absturz. Siehe{" "}
					<a href={`${core}/docs/RULE_AUTHORING.md`}><code>RULE_AUTHORING.md</code></a>{" "}
					§1.1 für die vollständige Erklärung und die Lösung (den Wert in <code>runInPage</code>{" "}
					verschieben oder über <code>ctx.rule</code>/<code>ctx.helpers</code> durchreichen).
				</p>
			</article>

			<article>
				<h2>
					„Eine geometrieabhängige Regel (z. B. <code>target-size-minimum</code>) meldet immer{" "}
					<code>notApplicable</code>“
				</h2>
				<p>
					Reines jsdom (ohne echten Browser) implementiert kein CSS-Layout —{" "}
					<code>getBoundingClientRect()</code> liefert immer eine Geometrie von null. <strong>Regeln, die echtes
					Layout brauchen, melden unter jsdom <code>notApplicable</code>, statt zu raten.</strong> Führen Sie
					den Scan stattdessen in einem echten Browser aus (Puppeteer/Playwright — siehe{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> <span lang="en">Pattern 2</span>), um
					von diesen Regeln echte Befunde zu erhalten. Siehe{" "}
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>.
				</p>
			</article>

			<article>
				<h2 id="web-component-canttell">
					„Eine Web Component ergibt <code>cantTell</code> (<code>name_internals</code>)“
				</h2>
				<p>
					Ein Custom Element, das sich über ein in einem privaten Feld (<code>#internals</code>)
					gehaltenes <code>ElementInternals</code> benennt, seine Zustände setzt oder sich eine
					Rolle gibt, wird vom Browser bereitgestellt, aber kein Skript der Seite kann das
					zurücklesen. Seit 1.12 liest die Engine Internals, die in einer Eigenschaft liegen (
					<code>_internals</code>, <code>internals</code>, …), und fragt bei jedem anderen
					definierten Custom Element ohne lesbaren Namen oder erforderlichen Zustand nach (
					<code>name_internals</code>, <code>state_internals</code>), statt es scheitern zu lassen.
				</p>
				<p>
					Damit der Scan solche Elemente beurteilen kann, installieren Sie den Internals-Hook, bevor
					die Skripte der Seite laufen: <code>installInternalsHook()</code> in jedem Binding (an der
					Seite oder dem Kontext in <a href="/getting-started/playwright/">Playwright</a>, an der
					Seite in <a href="/getting-started/puppeteer/">Puppeteer</a>, am Driver in{" "}
					<a href="/getting-started/selenium/">Selenium</a>, am Browser in{" "}
					<a href="/getting-started/webdriverio/">WebdriverIO</a>, in der Support-Datei oder in{" "}
					<code>onBeforeLoad</code> in <a href="/getting-started/cypress/">Cypress</a>) und in der
					Setup-Datei von <a href="/getting-started/test-matchers/">test-matchers</a>, oder{" "}
					<code>internalsHookScript()</code> aus core für eine eigene Seite.{" "}
					<code>engine.environment.internalsHook</code> im Ergebnis sagt, ob er gelaufen ist (
					<code>'early'</code> oder <code>'late'</code>). Der Hook lässt jedes Skript der Seite die
					Internals jeder Komponente lesen und ist daher für Test- und Audit-Läufe gedacht. Siehe{" "}
					<a href="/help/known-limitations/">Bekannte Einschränkungen</a>.
				</p>
			</article>

			<article>
				<h2>
					„Ich sehe nur <code>fail</code>-/<code>cantTell</code>-Vorkommen — wo ist die Liste der
					Elemente, die bestanden haben?“
				</h2>
				<p>
					<strong>Diese Engine listet absichtlich nie die Elemente auf, die eine Regel <em>bestanden</em> haben —
					nur die gemeldeten.</strong> Ein Gesamtergebnis <code>outcome: 'pass'</code> einer Regel bedeutet
					„anwendbare Ziele waren vorhanden, und keines wurde gemeldet“, und{" "}
					<code>occurrences</code> ist <code>[]</code>. Die Ausnahme sind die Kontrastregeln: Ihr{" "}
					<code>pass</code> trägt ein Vorkommen mit leerem <code>selector</code>, das den Scan
					beschreibt (wie viel Text in Frage kam und berechenbar war), kein Element. Wenn Sie wissen müssen,
					welche Elemente konkret geprüft und für in Ordnung befunden wurden: Das wird derzeit
					nicht bereitgestellt — siehe{" "}
					<a href="/results-reports/output-schema/"><code>OUTPUT_SCHEMA.md</code></a>.
				</p>
			</article>

			<article>
				<h2>
					„Eine Regel, die eigentlich anschlagen sollte, liefert <code>notApplicable</code> bzw.
					findet nichts auf einer Seite, von der ich weiß, dass sie das Problem hat“
				</h2>
				<p>Zwei häufige Ursachen, nach Wahrscheinlichkeit geordnet:</p>
				<ol>
					<li>
						<strong>Das Element ist aus dem Accessibility Tree ausgeschlossen</strong> —{" "}
						<code>aria-hidden="true"</code>, <code>display: none</code>,{" "}
						<code>visibility: hidden</code>, <code>hidden</code> oder ein <code>inert</code>-Vorfahre.
						Die meisten Regeln überspringen Inhalte, die für assistive Technologien ohnehin
						unsichtbar sind, denn ein verborgenes Element zu prüfen wäre sinnlos und könnte ein
						irreführendes <code>fail</code> für Inhalte erzeugen, auf die niemand trifft.
						Einige Regeln setzen diese Einschränkung ausdrücklich aus, wo sie keinen Sinn ergäbe
						(z. B. <code>no-autoplay-audio</code> — verborgenes Audio spielt trotzdem Ton ab) —
						prüfen Sie den Kopfkommentar der jeweiligen Regeldatei (
						<code>@applicability</code>) in <code>src/checks/</code>.
					</li>
					<li>
						<strong><code>excludeSelectors</code></strong> — wenn Sie das konfiguriert haben (direkt
						oder geerbt aus einer gemeinsamen Konfiguration), stellen Sie sicher, dass das
						betreffende Element nicht davon erfasst wird. Denken Sie daran, dass sich das auch
						über <code>engineOptions.rules[ruleId].excludeSelectors</code> auf eine einzelne Regel
						beschränken lässt (siehe{" "}
						<a href="/configuration/engine-options/#rule-scoped-excludeselectors"><code>ENGINE_OPTIONS.md</code></a>) — wenn eine Regel, die
						anschlagen sollte, nur für ein Element immer wieder <code>notApplicable</code>/
						<code>pass</code> liefert, prüfen Sie, ob gerade für diese Regel eine eigene
						Ausschlussliste konfiguriert ist, nicht nur die globale.
					</li>
				</ol>
			</article>

			<article>
				<h2 id="why-criterion-canttell">
					„Alle Prüfungen ergeben <code>pass</code>, warum ist dann jedes WCAG-Kriterium{" "}
					<code>cantTell</code>?“
				</h2>
				<p>
					Seit 1.14 ergibt eine zusammengesetzte WCAG-Regel in <code>rulesResults</code> nur dann{" "}
					<code>pass</code>, wenn die Regeln des Kriteriums alles prüfen, was es verlangt, und noch
					ist kein Kriterium so aufgeführt (<code>COMPLETE_CHECK</code> in{" "}
					<code>src/coverage/complete-applicability.js</code>). Ergeben alle Regeln eines Kriteriums{" "}
					<code>pass</code>, ist seine zusammengesetzte Regel <code>cantTell</code> mit dem{" "}
					<code>reasonCode</code> <code>composite.rollup.cantTell.partialCheck</code>: Die Teile, die
					die Regeln prüfen, sind erfüllt, den Rest prüft eine Person.{" "}
					<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a> stellt
					fest, dass <code>{'<html lang="fr">'}</code> eine Sprache nennt, nicht, dass die Seite auf
					Französisch ist. Ebenso ist ein Kriterium, dessen Regeln alle nichts gefunden haben, nur
					dann <code>notApplicable</code>, wenn sie jeden Fall finden, für den es gilt, sonst{" "}
					<code>cantTell</code> mit <code>composite.rollup.cantTell.partialCoverage</code>. Eine Regel
					mit <code>fail</code> lässt ihr Kriterium weiterhin fehlschlagen. Zeigen Sie diese als
					„Prüfungen bestanden, Prüfung durch eine Person nötig“ und „nichts zu prüfen gefunden“,
					nie als erfüllt; siehe{" "}
					<a href="/conformance/wcag-mapping/#when-a-criterion-passes">WCAG-Konformitätszuordnung</a>.
				</p>
			</article>

			<article>
				<h2>„Bedeutet ein Scan ohne Fehlschläge, dass die Seite WCAG-konform ist?“</h2>
				<p>
					Nein — siehe <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>
						Das <code>pass</code> einer Regel bedeutet, dass die gelaufenen Prüfungen in dem Teil der Seite,
						den sie gescannt haben, ohne Befund blieben.
					</strong>{" "}
					Ein Scan, der auf einen Teil der Seite begrenzt ist, auf einige Regeln beschränkt ist
					oder unter jsdom läuft, prüft weniger, als er könnte. Ein
					nennenswerter Teil der WCAG erfordert menschliches Urteil (zutreffende Alternativtexte,
					verständliche Fehlermeldungen) oder dynamische Tests, die die Architektur dieser Engine
					überhaupt nicht leisten kann (Tastaturfallen, Reflow beim Zoomen) — siehe{" "}
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a> für die explizite,
					bewusst nicht erschöpfende Liste.
				</p>
			</article>

			<article>
				<h2>„Sollte ich <code>cantTell</code> als Fehler behandeln?“</h2>
				<p>
					<strong>Behandeln Sie es als „ein Mensch muss draufschauen“ — es ist bewusst weder bestanden noch
					nicht bestanden.</strong> Häufig werden <code>cantTell</code>-Befunde protokolliert, ohne
					die CI daran scheitern zu lassen, denn wenn ein Build an etwas scheitert, das die Engine
					ausdrücklich nicht bestimmen konnte, gewöhnen sich die Beteiligten schnell daran, das
					Gate zu ignorieren. Ein Team, das jeden Befund vor einem Merge geprüft haben will, kann
					stattdessen daran scheitern lassen; so oder so sollten Sie sie von Verstößen getrennt
					halten. Dazwischen kann ein Build nur an den Befunden scheitern, die zu <code>fail</code>{" "}
					tendieren, wo die Hinweise der Seite auf einen Fehlschlag deuten:{" "}
					<code>leanFailAs</code> im <a href="/results-reports/junit-report/#options">JUnit</a>- und
					im <a href="/results-reports/sarif-report/#options">SARIF</a>-Bericht oder{" "}
					<code>leaningFailures(result)</code> (siehe{" "}
					<a href="/results-reports/output-schema/#leans">Ausgabeschema</a>). Jeder{" "}
					<code>cantTell</code>-Befund einer Core-Regel sagt in <code>howToCheck</code>, wie er zu
					beantworten ist. Siehe <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>,
					wenn Sie dieses Verhalten anpassen möchten (z. B. über einen eigenen Policy-Vertrag),
					und{" "}
					<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
						<code>INTEGRATION.md</code>
					</a>{" "}
					für ein konkretes Beispiel für CI-Gating.
				</p>
			</article>

			<article>
				<h2>„Was passiert, wenn eine Locale nur teilweise übersetzt ist?“</h2>
				<p>
					<strong>Fehlende Schlüssel fallen einzeln auf den englischen Text zurück (nie ein leeres oder
					kaputtes Ergebnis): Wo in einer unvollständigen Locale eine Übersetzung fehlt, erscheint
					die englische Meldung, statt dass die Ausgabe ganz fehlschlägt.</strong> Siehe <a href="/configuration/locales/"><code>I18N.md</code></a> für
					den Mechanismus und die aktuelle Abdeckung. Die Gleichheit der Schlüssel wird im
					eigenen Build von core erzwungen, nicht erhofft: Jeder neue oder umbenannte englische
					Schlüssel wird in alle anderen Locale-Dateien übertragen und enthält den englischen
					Text, bis ihn jemand übersetzt — eine Locale kann also bei den Formulierungen
					hinterherhinken, aber nie bei den Schlüsseln.
				</p>
			</article>

			<article>
				<h2>
					„<code>runDomRulesInPage</code> oder <code>runa11yCoreInPage</code> — welche brauche ich?“
				</h2>
				<p>
					<code>runDomRulesInPage</code>, wenn Sie die Funktion direkt im selben Node-Prozess
					aufrufen (jsdom).{" "}
					<code>runa11yCoreInPage</code>, wenn Sie die <em>Funktion selbst</em> an einen anderen
					JS-Realm übergeben — fast immer <code>page.evaluate</code> in Puppeteer/Playwright, das
					die Funktion zu Quelltext serialisiert und im Browser-Tab erneut ausführt (der keinen
					Zugriff auf den Modul-Scope Ihres Node-Prozesses hat). Siehe{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>{" "}
					für beide Muster vollständig ausgearbeitet.
				</p>
			</article>

			<article>
				<h2 id="baseline-after-upgrade">
					„Nach dem Update meldet meine Baseline bekannte Befunde als neu und ihre Einträge als
					veraltet“
				</h2>
				<p>
					Die Identität eines Befunds enthält seinen Reason-Code, und 1.14 hat siebzehn Regeln, die
					keinen hatten, Codes gegeben und einige Codes nach Ursache geteilt. Eine von 1.13
					geschriebene Baseline passt unter 1.14.x über <code>src/baseline-moves.json</code> weiter
					auf diese Befunde; ein Befund, dessen Ergebnis sich mit dem Update geändert hat, ist
					trotzdem neu oder fällt weg, und das Changelog sagt, warum. Schreiben Sie die Codes der
					Datei vor 1.15 mit <code>migrateBaselineEntries</code> aus{" "}
					<code>@surea11y/core/baseline</code> um, oder erzeugen Sie sie neu und prüfen Sie den
					Diff. Siehe <a href="/conformance/baseline/#upgrading">Baseline / Allowlist</a>.
				</p>
			</article>

			<article>
				<h2 id="stylesheets-not-readable">
					„<code>css-orientation-lock</code> fragt mit <code>STYLESHEETS_NOT_READABLE</code>“
				</h2>
				<p>
					Das Skript einer Seite kann ein Stylesheet nicht lesen, das ein anderer Ursprung
					ausliefert (ein CDN, ein Schriftendienst), also können die Regeln, die CSS lesen, nicht
					wissen, was es enthält. Geben Sie dem Scan seinen Text in{" "}
					<code>engineOptions.styleSheetTexts</code>: <code>preloadStyleSheets()</code> oder{" "}
					<code>runa11yCoreInPageAsync</code> im Browser-Bundle lädt die, die der Server freigibt,
					und ein Werkzeug, das den Browser steuert, kann die übrigen von außerhalb der Seite laden.
					Siehe „Style sheets from another origin“ in{" "}
					<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
						<code>INTEGRATION.md</code>
					</a>
					, der Integrationsanleitung auf GitHub.
				</p>
			</article>
		</>
	);
}
