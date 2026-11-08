import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-16">„Meine Ergebnisse haben sich nach dem Update auf core 1.16 geändert“</h2>
				<p>
					1.16 bringt jsdom näher an den Browser und formuliert seine Meldungen für jede Norm. Die
					Änderungen, die sich am ehesten in einer Pipeline zeigen:
				</p>
				<ul>
					<li>
						<strong>Unter jsdom ist nur ein mit <code>showModal()</code> geöffneter Dialog
						modal</strong>, wie im Browser. Die Seite hinter einem{" "}
						<code>&lt;dialog open aria-modal="true"&gt;</code> wird jetzt beurteilt, ein jsdom-Test,
						der so ein Modal nachbildet, sieht also Befunde dahinter;{" "}
						<code>engineOptions.assumeModal: true</code> behält das alte Verhalten bei (siehe{" "}
						<a href="/help/known-limitations/">Bekannte Einschränkungen</a>; mit test-matchers
						1.6.0 geben Sie es auch <code>installLiveRegionHook()</code> mit, siehe{" "}
						<a href="/getting-started/test-matchers/#modal-dialogs-in-jsdom">test-matchers</a>).
						Nichts hinter einem
						modalen Dialog erhält den Fokus, und von mehreren mit <code>showModal()</code>{" "}
						geöffneten wird nur der oberste beurteilt.
					</li>
					<li>
						<strong>jsdom verbirgt, was ein Browser verbirgt.</strong> Regeln innerhalb von{" "}
						<code>@layer</code>, <code>@supports</code> und <code>@container</code> verbergen
						Elemente, sodass <code>hidden</code> und <code>sr-only</code> von Tailwind v4
						funktionieren; <code>clip: rect(0 0 0 0)</code> zählt als abgeschnitten; das{" "}
						<code>&lt;area&gt;</code> einer Image-Map ist auf der Seite. Befunde zu Inhalten, die von
						Anfang an verborgen waren, fallen weg.
					</li>
					<li>
						<strong>Meldungen und Schritte beschreiben die Prüfung</strong>, statt das
						WCAG-Kriterium zu nennen, in jeder Locale, sodass sich ein Bericht für eine andere Norm
						richtig liest. Zuordnungen und <code>failWhen</code> sind unverändert; ein Test, der
						Meldungstexte vergleicht, muss angepasst werden.
					</li>
					<li>
						<strong>Tief verschachtelte Seiten werden beurteilt.</strong> Ein Element 200 oder mehr
						Ebenen tief wird mit allem darüber beurteilt, bis zu 10.000 Ebenen, wo ein Fehlschlag in
						dieser Tiefe früher zu einer in <code>error</code> vermerkten Frage wurde; dort können
						also Fehlschläge erscheinen. Jenseits von 10.000 ist es eine Frage, gemeldet in{" "}
						<a href="/results-reports/output-schema/">
							<code>ancestorWalkLimit</code>
						</a>
						.
					</li>
					<li>
						<strong>Seiten, die <code>Array.from</code> ersetzen</strong> (Prototype.js, MooTools),
						werden gescannt, wo der Scan mit <code>PAGE_BUILTINS_BROKEN</code> abbrach (siehe{" "}
						<a href="#page-builtins-broken">den Eintrag weiter unten</a>).
					</li>
					<li>
						<strong>Manche Selektoren sind anders.</strong> Steuerzeichen werden maskiert, ein Wert
						über 256 Zeichen weicht dem Pfad des Elements, und{" "}
						<a href="/rules/page-title-present/"><code>page-title-present</code></a> und{" "}
						<a href="/rules/page-title-patterns/"><code>page-title-patterns</code></a> zeigen auf
						das title-Element selbst, oder auf <code>&lt;head&gt;</code>, wenn es keines gibt. Die
						Identität eines Befunds enthält seinen Selektor nicht, Baselines passen also weiterhin.
						Die Kontrastregeln sind <code>notApplicable</code> ohne Vorkommen, wenn sich kein
						Kontrast berechnen ließ.
					</li>
					<li>
						<strong>Fehler werden gemeldet, statt als nichts gelesen zu werden.</strong> Ein leerer{" "}
						<code>contextSelector</code> scannt weiterhin die ganze Seite, warnt aber; etwas, das
						keine Baseline ist, wirft <code>INVALID_BASELINE</code>, statt jeden Fehlschlag neu zu
						machen; und unter <code>strictOptions</code> wirft ein unbekannter Profilname. Das Profil{" "}
						<code>section508</code> ist veraltet: Verwenden Sie <code>wcag20-aa</code>, das dieselben
						Regeln ausführt.
					</li>
					<li>
						<strong>Schnellere Scans</strong>, mit denselben Befunden: einige Prozent in Chromium auf
						gewöhnlichen Seiten, 10 bis 25 % unter jsdom, und viel mehr, wo es am schlechtesten war
						(Tausende gleicher Links oder Felder, lange Tabellen, viele Stilregeln).
					</li>
				</ul>
				<p>
					Neu, und ohne Änderung, solange Sie es nicht nutzen: die Profile für WCAG 2.0 und 2.1 (
					<a href="/configuration/engine-options/#conformance-profiles">Engine-Optionen</a>), und,
					experimentell bis 1.18.0, Normen als Daten, Tests unter Anforderungen, auf anderen
					aufbauende Normen und die Gesetze, nach denen eine Norm bewertet wird (
					<a href="/configuration/packs/#experimental">Packs</a>). Die vollständige Liste steht im{" "}
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
				<p>
					Wenn <code>broken</code> nur <code>Array.from</code> ist, hat die Seite es ersetzt (Prototype
					und MooTools tun das), und eine Regel eines Packs oder eine eigene Regel im Scan verwendet
					es: Die eigenen Regeln von core tun das seit 1.16 nicht mehr. Schreiben Sie diese Regel mit
					Spread (<code>[...x]</code>, <code>[...x].map(f)</code>), oder lassen Sie sie aus der
					Auswahl weg. Das <a href="/configuration/packs/#wai-aria-pack">WAI-ARIA-Pack</a> tat das
					bis zu seinem Release 1.0.2: Aktualisieren Sie es.
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
				<p>
					Ein Scan mehrerer Profile zugleich (<code>profile: ['wcag22-aa', 'wai-aria-1.2']</code>)
					scannt die Seite einmal pro Profil und dauert daher etwa so lange wie entsprechend viele
					Scans.
				</p>
			</article>

			<article>
				<h2 id="profile-not-run">
					„Ein Profil ist nicht gelaufen“, oder <code>engine.profilesNotRun</code> ist nicht leer
				</h2>
				<p>
					In einem Scan mehrerer Profile steht ein Profil, das nicht laufen konnte, mit seinem Grund
					in <code>engine.profilesNotRun</code>, und die anderen laufen trotzdem:{" "}
					<code>unknown-profile</code> (kein solches Profil: Das Profil eines Packs braucht sein Pack
					in <code>packs</code>), <code>pack-skipped</code> (sein Pack ist nicht gelaufen, siehe{" "}
					<a href="#pack-did-not-run">den Eintrag weiter unten</a>) oder{" "}
					<code>overridden-by-selection</code> (ein <code>runOnly</code>-Include oder Regel-IDs oder
					Tags in <code>engineOptions</code> haben stattdessen die Regeln gewählt, für jedes
					Profil). Ein solcher Scan hat weniger beurteilt, als von ihm verlangt war; daher melden
					SARIF und JUnit einen Fehler, außer mit <code>allowProfilesNotRun: true</code>, die CLI
					endet mit Exit-Code <code>2</code>, außer mit <code>--allow-profiles-not-run</code>, die
					Bindings melden eine Lücke <code>'profile-not-run'</code>, und die Test-Matcher lassen die
					Assertion scheitern. Siehe{" "}
					<a href="/configuration/engine-options/#several-profiles">Engine-Optionen</a>.
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
				<h2 id="framed-page-rules">
					„Die Regeln zu Titel, Sprache und Landmarks sind in einem Frame <code>notApplicable</code>“
				</h2>
				<p>
					Seit 1.15 ist ein in einem Frame angezeigtes Dokument keine eigene Seite:{" "}
					<code>page-title-present</code>, <code>page-title-patterns</code>,{" "}
					<code>html-lang-attr-present</code>, <code>meta-viewport-zoom-enabled</code>,{" "}
					<code>meta-viewport-large</code>, <code>region</code>,{" "}
					<code>bypass-blocks-present</code>, <code>landmark-one-main</code> und{" "}
					<code>page-has-heading-one</code> sind darin <code>notApplicable</code>. Die Seite um den
					Frame ist das, was den Titel, die Sprache und die Landmarks hat, die Menschen nutzen, und
					ein Browser ignoriert das Viewport-<code>&lt;meta&gt;</code> eines Dokuments in einem
					Frame. Ein Test-Runner, der die getestete Seite in einem eigenen Frame anzeigt, setzt{" "}
					<code>engineOptions.topLevelDocument: true</code>;{" "}
					<a href="/getting-started/cypress/">@surea11y/cypress</a> 1.6.0 erledigt das für Sie.
					Siehe <a href="/configuration/engine-options/">Engine-Optionen</a>.
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
					bewusst nicht erschöpfende Liste. Was bleibt, prüft eine Person, und die{" "}
					<a href="/conformance/procedures/">Prüfverfahren</a> von core sagen, wie, Kriterium für
					Kriterium.
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
					auf diese Befunde, nicht aber unter 1.15, das diese Verschiebungen entfernt hat: Dort ist
					ein Eintrag unter einem alten Code veraltet, und sein Befund ist neu. Schreiben Sie die
					Codes der Datei unter 1.14.x mit <code>migrateBaselineEntries</code> aus{" "}
					<code>@surea11y/core/baseline</code> um und machen Sie dann das Update, oder erzeugen Sie
					sie unter 1.15 neu und prüfen Sie den Diff. 1.15 und 1.16 haben keinen Code verschoben,
					eine von 1.14 geschriebene Baseline passt also weiter; ein Befund, dessen Ergebnis sich mit dem
					Update geändert hat, ist trotzdem neu oder fällt weg, und das Changelog sagt, warum. Siehe <a href="/conformance/baseline/#upgrading">Baseline / Allowlist</a>.
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

			<article>
				<h2 id="results-changed-1-15">„Meine Ergebnisse haben sich nach dem Update auf core 1.15 geändert“</h2>
				<p>
					1.15 lässt ein WCAG-Kriterium nur dort fehlschlagen, wo WCAG es fehlschlagen lässt, und
					liest Frames so, wie der Browser sie zeigt. Die Änderungen, die sich am ehesten in einer
					Pipeline zeigen:
				</p>
				<ul>
					<li>
						<strong>Weniger Fehlschläge bei ARIA- und HTML-Struktur.</strong> Acht ARIA-Regeln und
						die HTML-Strukturregeln lassen ein Kriterium nicht mehr fehlschlagen, wo nur WAI-ARIA
						oder das HTML-Inhaltsmodell verletzt ist: Diese Befunde sind <code>cantTell</code>, mit
						der Unsicherheit <code>spec-only</code> und Schritten zur Prüfung. Betroffen sind{" "}
						<a href="/rules/aria-role-name-present/"><code>aria-role-name-present</code></a> (grid,
						tree, radiogroup, meter, progressbar),{" "}
						<a href="/rules/dialog-name-present/"><code>dialog-name-present</code></a>,{" "}
						<a href="/rules/tooltip-name-present/"><code>tooltip-name-present</code></a>,{" "}
						<a href="/rules/aria-allowed-attr/"><code>aria-allowed-attr</code></a>,{" "}
						<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a> (außer
						beim Zustand, Wert oder Fokus eines Bedienelements),{" "}
						<a href="/rules/aria-prohibited-attr/"><code>aria-prohibited-attr</code></a>,{" "}
						<a href="/rules/aria-roles-valid/"><code>aria-roles-valid</code></a> (außer an einem
						fokussierbaren Element), <a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a>{" "}
						(ein Vorfahre; es ist jetzt nur noch 1.3.1 zugeordnet),{" "}
						<a href="/rules/list-children-valid/"><code>list-children-valid</code></a> und{" "}
						<a href="/rules/listitem-parent-valid/"><code>listitem-parent-valid</code></a> (außer
						wo die Seite das fehlerhafte Element zeichnet),{" "}
						<a href="/rules/definition-list-children-valid/"><code>definition-list-children-valid</code></a>,{" "}
						<a href="/rules/dlitem-parent-valid/"><code>dlitem-parent-valid</code></a> und{" "}
						<a href="/rules/nested-interactive-controls-absent/"><code>nested-interactive-controls-absent</code></a>{" "}
						(außer innerhalb eines Bedienelements mit präsentationalen Kindern). Jeder Befund behält
						seinen Reason-Code, Baselines passen also weiterhin, aber ein Gate oder eine
						Zusammenfassung, an der nur diese scheiterten, besteht jetzt oder ist{" "}
						<code>cantTell</code>. Um dieselben Befunde nach WAI-ARIA zu beurteilen, wo sie
						scheitern, fügen Sie das <a href="/configuration/packs/#wai-aria-pack">WAI-ARIA-Pack</a>{" "}
						hinzu.
					</li>
					<li>
						<strong>Ein Dokument in einem Frame ist keine eigene Seite.</strong> In einem Frame sind{" "}
						<code>page-title-present</code>, <code>html-lang-attr-present</code> sowie die Regeln zu
						Viewport, Umgehung von Blöcken und Landmarks <code>notApplicable</code> (siehe{" "}
						<a href="#framed-page-rules">den Eintrag weiter oben</a>). Ein Frame unter{" "}
						<code>aria-hidden</code> oder <code>inert</code> wird als solcher gelesen, und einer
						hinter einem offenen modalen Dialog wird weggelassen.
					</li>
					<li>
						<strong>Rollen folgen WAI-ARIA genauer.</strong> <code>role="text"</code> nennt keine
						gültige Rolle; ein Bild mit einer präsentationalen Rolle und einem globalen
						ARIA-Attribut behält seine Rolle und lässt{" "}
						<a href="/rules/img-alt-present/"><code>img-alt-present</code></a> ohne{" "}
						<code>alt</code> fehlschlagen; die vier globalen Attribute, die WAI-ARIA 1.2 abkündigt,
						geben einem präsentationalen Element seine Rolle nicht mehr zurück.
					</li>
					<li>
						<strong>Eine übersprungene Überschriftenebene ist ein Best-Practice-Problem</strong>,
						kein Fehlschlag von 1.3.1, in den überarbeiteten{" "}
						<a href="/conformance/procedures/">Prüfverfahren</a>, die auch die Schritte „So prüfen
						Sie es“ von sechs neuen Fragen liefern.
					</li>
					<li>
						<strong>Eine Baseline aus 1.13 muss zuerst aktualisiert werden.</strong> 1.15 hat keinen
						Reason-Code verschoben und die Verschiebungen von 1.13 zu 1.14 entfernt (siehe{" "}
						<a href="#baseline-after-upgrade">den Eintrag weiter oben</a>).
					</li>
				</ul>
				<p>
					Neu, und ohne Änderung, solange Sie es nicht nutzen: Scans mehrerer Profile zugleich (
					<a href="/configuration/engine-options/#several-profiles">Engine-Optionen</a>), die Profile{" "}
					<code>wcag22-a</code> und <code>wcag22-aaa</code>, Prüfverfahren für die Bewertung von
					Hand und „Was ein Mensch noch prüfen muss“ im HTML-Bericht. Die vollständige Liste steht im{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>{" "}
					von core.
				</p>
			</article>
		</>
	);
}
