import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2>„Ich habe <code>runOnly: ['some-rule-id']</code> übergeben, aber trotzdem liefen alle Regeln“</h2>
				<p>
					<strong><code>runOnly</code> muss ein Objekt sein, kein nacktes Array.</strong>{" "}
					<code>runOnly: ['img-alt-present']</code> wird stillschweigend ignoriert (die Engine
					fällt auf „alles ausführen“ zurück), weil diese Form keines der Felder enthält, die die
					Engine tatsächlich prüft (<code>includeRuleIds</code>, <code>tags</code> usw.). Zu einem
					nackten Array greift man schnell, deshalb lohnt es sich, das zuerst zu prüfen.
				</p>
				<p>Lösung:</p>
				<CodeBlock lang="js" lines={["runOnly: { includeRuleIds: ['img-alt-present'] }"]} />
				<p>
					Die vollständige Form finden Sie in <a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>.
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
						irreführendes <code>fail</code> für Inhalte erzeugen, auf die kein Nutzer trifft.
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
				<h2>„Bedeutet ein sauberer Scan (überall <code>pass</code>), dass die Seite WCAG-konform ist?“</h2>
				<p>
					Nein — siehe <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>Ein <code>pass</code> bedeutet, dass jede <em>automatisierbare</em> Prüfung sauber war.</strong> Ein
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
					<strong>Fehlende Schlüssel fallen pro String auf Englisch zurück (nie ein leeres oder kaputtes
					Ergebnis), sodass eine unvollständige Locale sauber degradiert, statt ganz zu
					scheitern.</strong> Siehe <a href="/configuration/locales/"><code>I18N.md</code></a> für
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
