import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="runonly-threw">
					„<code>runOnly</code> hat einen Fehler geworfen: <span lang="en">no rule or tag named …</span>,
					oder <span lang="en">either rule ids or tags</span>“
				</h2>
				<p>
					Seit 1.10.0 wird ein <code>runOnly</code>, das als nacktes Array oder als String übergeben
					wird, als Regel-IDs oder als Tags gelesen, so wie axe-core es liest (siehe{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>). In zwei
					Fällen wirft es einen Fehler:
				</p>
				<ul>
					<li>
						<strong>Ein Wert, der weder eine Regel noch einen Tag benennt</strong>, meist ein
						Tippfehler: <code>runOnly: ['img-alt-presnt']</code>. Prüfen Sie die ID gegen{" "}
						<code>getChecksCatalog()</code>.
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
						Selektor auf nichts gepasst hat, und <code>unmatchedSelectors</code> nennt ihn. Prüfen
						Sie ihn auf Tippfehler, oder ob das Element beim Scan schon auf der Seite ist (etwa
						Inhalt, den ein Skript erst nach dem Laden rendert).
					</li>
					<li>
						<strong>
							Der Scan hat mit <code>code: 'INVALID_CONTEXT_SELECTOR'</code> einen Fehler geworfen
						</strong>
						: Der Selektor in der Meldung und in der Eigenschaft <code>selector</code> des Fehlers
						ist kein gültiges CSS, zum Beispiel <code>'#main['</code> oder ein{" "}
						<code>&gt;&gt;&gt;</code>-Kombinator.
					</li>
				</ul>
				<p>Vor 1.10.0 wurde in beiden Fällen stattdessen die ganze Seite gescannt.</p>
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
				<h2>
					„Ich sehe nur <code>fail</code>-/<code>cantTell</code>-Vorkommen — wo ist die Liste der
					Elemente, die bestanden haben?“
				</h2>
				<p>
					<strong>Diese Engine listet absichtlich nie die Elemente auf, die eine Regel <em>bestanden</em> haben —
					nur die gemeldeten.</strong> Ein Gesamtergebnis <code>outcome: 'pass'</code> einer Regel bedeutet
					„anwendbare Ziele waren vorhanden, und keines wurde gemeldet“, aber{" "}
					<code>occurrences</code> ist in beiden Fällen <code>[]</code>. Wenn Sie wissen müssen,
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
					<strong>Ein <code>pass</code> bedeutet, dass jede <em>automatisierbare</em> Prüfung ohne Befund blieb.</strong> Ein
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
					nicht bestanden.</strong> Die meisten Teams protokollieren <code>cantTell</code>-Befunde,
					ohne die CI daran scheitern zu lassen, denn wenn ein Build an etwas scheitert, das die
					Engine ausdrücklich nicht bestimmen konnte, gewöhnen sich die Leute schnell daran, das
					Gate zu ignorieren. Siehe <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>,
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
					aufrufen (jsdom, Content-Script einer Browser-Erweiterung).{" "}
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
