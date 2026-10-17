import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-12">„Meine CI-Ergebnisse haben sich nach dem Update auf core 1.12 geändert“</h2>
				<p>
					Was die Engine findet, ist größtenteils gleich geblieben; wo es landet, und einige Regeln,
					haben sich geändert. Die Änderungen, die sich am ehesten in einer Pipeline zeigen:
				</p>
				<ul>
					<li>
						<strong>Eine leere Überschrift ergibt <code>fail</code>.</strong>{" "}
						<a href="/rules/empty-heading/"><code>empty-heading</code></a> lässt eine Überschrift
						ohne zugänglichen Namen scheitern, wo es bisher nachfragte. Es ist eine Best Practice,
						läuft also in einem Scan ohne Auswahl oder mit ergänzten Best Practices, nicht unter
						einem WCAG-Ziel, Tags oder einem Profil. Beheben Sie die Überschrift, oder scannen Sie
						ein WCAG-Ziel.
					</li>
					<li>
						<strong>
							<a href="/rules/label-in-name/"><code>label-in-name</code></a> zählt Text mit, der
							nur mit <code>aria-hidden</code> verborgen ist
						</strong>
						, da er weiterhin gezeichnet wird:{" "}
						<code>{'Download <span aria-hidden="true">gizmo</span> specification'}</code> mit dem
						Namen „<span lang="en">Download specification</span>“ verletzt jetzt 2.5.3.
					</li>
					<li>
						<strong>Scans, die Prüfungen nennen, melden ihre Kriterien.</strong> Regel-IDs, ein
						Tag, das keine WCAG-Stufe nennt, oder die Best Practices füllen{" "}
						<code>rulesResults</code> jetzt mit den Kriterien, zu denen diese Regeln gehören, wo es
						leer war; ein Kriterium, dessen andere Regeln nicht ausgewählt wurden, ist{" "}
						<code>cantTell</code>, teilweise geprüft. Setzen Sie{" "}
						<code>engineOptions.wcagLevel</code> (<code>.wcagLevel()</code> in den Bindings,{" "}
						<code>--wcag-level</code> in der CLI), um sie auf eine Stufe zu begrenzen. Siehe{" "}
						<a href="/conformance/wcag-mapping/">WCAG-Konformitätszuordnung</a>.
					</li>
					<li>
						<strong>Fünf Regeln zählen zu weiteren Kriterien</strong>, so wie die ACT-Regeln des
						W3C sie zuordnen: <code>input-image-alt-present</code> kommt zu 4.1.2,{" "}
						<code>aria-roles-valid</code> zu 1.3.1, <code>link-name-present</code> und{" "}
						<code>link-name-quality</code> zu 2.4.9 (AAA) und{" "}
						<code>meta-refresh-timing-absent</code> zu 2.2.4 und 3.2.5 (AAA). Die Befunde ändern
						sich nicht, aber die zusammengesetzten Regeln für 1.3.1 und 4.1.2 können jetzt{" "}
						<code>fail</code> ergeben, wo sie bestanden.
					</li>
					<li>
						<strong>JUnit-Suite-Namen sind in jeder Locale gleich</strong> (
						<code>WCAG 4.1.2</code>), und der Titel wandert in die Eigenschaft <code>title</code>{" "}
						der Suite. Ein Dashboard, das Tests nach Suite-Namen verfolgt, zeigt sie einmal als
						neu. Siehe <a href="/results-reports/junit-report/">JUnit-Bericht</a>.
					</li>
					<li>
						<strong>Kontrast wird so gemessen, wie die Seite gezeichnet wird.</strong> Im Browser
						werden Text auf einer Seite ohne Hintergrund, generierter Text (<code>::before</code>,{" "}
						<code>::after</code>, <code>::marker</code>) und ein geschlossenes{" "}
						<code>&lt;select&gt;</code> gemessen, wo sie bisher ausgelassen oder{" "}
						<code>cantTell</code> waren; es können also neue Kontrastverstöße auftauchen. Zu einem
						einzelnen Zeichen, das für den Namen seines Bedienelements steht, etwa „X“ in einem
						Button mit dem Namen „<span lang="en">Close</span>“, wird unter dem Verhältnis
						nachgefragt, statt es scheitern zu lassen.
					</li>
					<li>
						<strong>Unbenannte Web Components sind Fragen.</strong> Ein definiertes Custom Element
						ohne lesbaren Namen ist <code>cantTell</code>, wo es bisher scheiterte; siehe{" "}
						<a href="#web-component-canttell">den Eintrag zu Web Components</a>.
					</li>
				</ul>
				<p>
					Die vollständige Liste steht in{" "}
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
					endet mit Exit-Code <code>2</code>. Installieren Sie das Pack neben dem Paket, das es
					ausführt, damit npm ein einziges <code>@surea11y/core</code> für beide auflöst. Siehe{" "}
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
				<h2>„Bedeutet ein Scan ohne Befunde (überall <code>pass</code>), dass die Seite WCAG-konform ist?“</h2>
				<p>
					Nein — siehe <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>
						Ein <code>pass</code> bedeutet, dass die gelaufenen Prüfungen in dem Teil der Seite,
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
					halten. Siehe <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>,
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
					den Mechanismus und die aktuelle Abdeckung. Die Gleichheit der Schlüssel wird
					erzwungen, nicht erhofft: <code>npm run i18n:sync</code> überträgt jeden neuen oder
					umbenannten <code>en.json</code>-Schlüssel in alle anderen Locale-Dateien, und der
					Build schlägt fehl, wenn eine davon nicht auf dem gleichen Stand ist. Ein so
					hinzugefügter Schlüssel enthält den englischen Text, bis ihn jemand übersetzt — eine
					Locale kann also bei den Formulierungen hinterherhinken, aber nie bei den Schlüsseln.
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
		</>
	);
}
