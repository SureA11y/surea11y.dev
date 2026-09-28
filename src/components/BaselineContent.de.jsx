import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function BaselineContent() {
	return (
		<>
			<p>
				Ein striktes CI-Gate („Build bei jedem <code>fail</code>-Ergebnis abbrechen“) blockiert
				die Einführung, wenn ein Team eine bestehende, unvollkommene Website zum ersten Mal
				scannt — es kann nichts ausliefern, bis jeder bereits vorhandene Verstoß behoben ist. Mit
				einer Baseline kann ein Team sagen: „Diese N sind bereits bekannt — daran soll das Gate nicht
				scheitern, wohl aber sofort, sobald ein tatsächlich neuer auftaucht.“
			</p>
			<CodeBlock
				lines={[
					"# Once: record every current fail occurrence, does not fail the build.",
					{ text: "surea11y scan ./dist/index.html --write-baseline baseline.json", command: true },
					"",
					"# Commit baseline.json to git.",
					"",
					"# From then on, in CI: only a NEW (not-yet-baselined) fail occurrence gates the build.",
					{ text: "surea11y scan ./dist/index.html --baseline baseline.json", command: true },
				]}
			/>
			<p>
				Die Baseline-Datei ist dafür gedacht, in git committet zu werden. Weitere bekannte
				Barrieren hinzunehmen, statt sie zu beheben, wird so zu einer expliziten, überprüfbaren
				Entscheidung — ein
				neuer Verstoß erscheint als neue Zeile im Diff der Datei in einem PR, nicht als stille
				Änderung einer Zahl.
			</p>

			<h2>Wann das nützlich ist</h2>
			<ul>
				<li>
					<strong>Scans auf einer bestehenden Website einführen.</strong> Der oben beschriebene
					Ausgangsfall: Ein erster Scan einer gewachsenen Website kann Hunderte bereits
					vorhandener Verstöße zutage fördern. Werden sie einmal in die Baseline aufgenommen, ist
					Gating sofort möglich, statt „erst alles beheben“ zu verlangen.
				</li>
				<li>
					<strong>Schrittweise Behebung mit sichtbarem Burn-down.</strong> Beheben Sie Verstöße
					in Etappen und erzeugen Sie die Baseline regelmäßig mit{" "}
					<code>--write-baseline</code> neu. Der git-Diff jeder Neuerzeugung <em>schrumpft</em>,
					weil Einträge verschwinden — die Datei selbst wird zum Fortschrittsprotokoll, und ein
					PR, der eine Reihe von Problemen behebt, zeigt genau, was bereinigt wurde.
				</li>
				<li>
					<strong>Inhalte von Drittanbietern, die Sie nicht kontrollieren.</strong> Eine Seite
					bettet ein Widget ein (Chat-Bubble, Werbefläche, Zahlungs-iframe) mit bekannten
					Verstößen, die Sie nicht beheben können. Genau diese Vorkommen in die Baseline
					aufzunehmen ist präziser, als den ganzen Teilbaum per <code>excludeSelectors</code>{" "}
					auszuschließen (siehe{" "}
					<a href="/configuration/engine-options/#rule-scoped-excludeselectors">den Leitfaden zu den Engine-Optionen</a>) — neue Probleme,
					die irgendwo sonst in der Nähe entstehen, auch in Ihrem eigenen Code, lösen das Gate
					weiterhin ganz normal aus.
				</li>
				<li>
					<strong>Sicherheitsnetz gegen Regressionen während eines großen Refactorings.</strong>{" "}
					Mitten in einer Migration können einige Regeln vorübergehend und berechtigterweise
					fehlschlagen, auf eine Weise, die bereits erfasst ist und über viele PRs hinweg behoben
					wird. Wenn diese bekannte, in Arbeit befindliche Menge in der Baseline steht, werden{" "}
					<em>davon unabhängige</em> neue Regressionen aus anderen PRs im selben Zeitraum
					trotzdem erkannt, statt das Gate ganz abzuschalten oder jeden PR daran scheitern zu
					lassen.
				</li>
				<li>
					<strong>Schrittweise Einführung einer neuen oder strengeren Regel.</strong> Sie
					aktivieren eine Regel (oder eine ganze WCAG-Stufe), die die Codebasis noch nicht
					erfüllt: Nehmen Sie die bestehenden Lücken in die Baseline auf, aktivieren Sie das
					Gating sofort und verhindern Sie jeden <em>neuen</em> Verstoß gegen diese Regel,
					während der Rückstand separat abgearbeitet wird — statt mit dem Aktivieren der Regel zu
					warten, bis die Codebasis bereits konform ist.
				</li>
			</ul>

			<h2>Wie das Matching funktioniert</h2>
			<p>
				Nichts an der Form eines Vorkommens ist eine perfekte, von der Position auf der Seite
				unabhängige Identität (siehe{" "}
				<a href="/results-reports/output-schema/">das Ausgabeschema</a>): <code>selector</code> und{" "}
				<code>structuralPath</code> werden beide aus der Position des Elements im DOM abgeleitet
				und können sich deshalb verschieben, wenn sich <em>unabhängiges</em> Markup an anderer
				Stelle der Seite ändert, obwohl sich das gemeldete Element selbst nie geändert hat.
			</p>
			<p>Stattdessen ist die Identität eines Baseline-Eintrags:</p>
			<CodeBlock lines={["ruleId + reasonCode + html"]} />
			<p>
				Dabei ist <code>reasonCode</code> der regelspezifische Code aus{" "}
				<code>occurrence.data.details.reasonCode</code> (standardmäßig <code>"DEFAULT"</code>,{" "}
				wenn eine Regel keinen setzt), und <code>html</code> ist das Outer-HTML-Snippet des
				Vorkommens. Das ist inhaltsbasiert statt positionsbasiert: Es bleibt stabil, wenn sich
				das gemeldete Element auf der Seite verschiebt (eine Umsortierung, ein unabhängiges
				Geschwisterelement kommt hinzu oder fällt weg), solange sich das Markup des gemeldeten
				Elements selbst nicht ändert. <code>selector</code> wird zwar weiterhin in der
				Baseline-Datei gespeichert, aber nur als Kontext für Menschen beim Lesen eines Diffs — für
				das Matching wird er nie verwendet.
			</p>
			<p>
				<strong>Bekannte Einschränkung</strong>: Ein Element, dessen <em>eigenes</em> Markup
				dynamischen Inhalt enthält (einen Zeitstempel, einen Live-Zähler, eine zufällig erzeugte
				id), stimmt zwischen zwei Scans nie mit sich selbst überein, da sich sein{" "}
				<code>html</code>-Snippet jedes Mal unterscheidet. Wenn Ihre Seiten diesen Fall
				betreffen, hilft der Baseline-Mechanismus für diese Regeln und Elemente nicht — siehe
				„Alternative“ unten.
			</p>
			<p>
				<strong>Das Matching zählt Vorkommen, nicht nur deren Vorhandensein.</strong> Wenn eine Seite 3 Elemente
				enthält, die byte-identische <code>ruleId</code>+<code>reasonCode</code>+<code>html</code>{" "}
				erzeugen (z. B. dieselbe fehlerhafte Komponente dreimal wiederholt), und die Baseline nur
				1 davon erfasst hat, meldet ein neuer Scan 1 bekanntes und 2 neue Vorkommen — nicht alle
				3 als bekannt.
			</p>
			<p>
				Baseline-Einträge, die in einem neuen Scan auf nichts mehr passen, werden als{" "}
				<strong>veraltet</strong> (<span lang="en">stale</span>) gemeldet (der Verstoß wurde vermutlich behoben) — das
				ist rein informativ und lässt den Build nie fehlschlagen; erzeugen Sie die Baseline
				regelmäßig mit <code>--write-baseline</code> neu, um diese Einträge zu bereinigen.
			</p>

			<h2>Dateiformat</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "DEFAULT", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> lehnt eine Datei, die nicht{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> ist, mit einem klaren Fehler (Exit-Code 2)
				ab, statt ein älteres oder anderes Format zu erraten.
			</p>

			<h2>Kombination mit <code>--json</code></h2>
			<p>
				Wenn <code>--baseline</code> oder <code>--write-baseline</code> zusammen mit{" "}
				<code>--json</code> verwendet wird, erhält das ausgegebene Objekt neben dem normalen
				Engine-Ergebnis einen Schlüssel <code>baseline</code> (das betrifft nur die CLI-Ausgabe —
				es ist nicht Teil des im Ausgabeschema beschriebenen Ergebnisvertrags der Engine):
			</p>
			<ul>
				<li>
					<code>--write-baseline</code>:{" "}
					<code>{'{ mode: "write", path, entries: <number written> }'}</code>
				</li>
				<li>
					<code>--baseline</code>:{" "}
					<code>
						{'{ mode: "check", totalFail, knownCount, newCount, staleCount, newOccurrences: [...] }'}
					</code>
				</li>
			</ul>

			<h2>Alternative: zwei Scans selbst vergleichen</h2>
			<p>
				Wenn Ihre Seiten nicht in dieses Modell passen (viel dynamischer Inhalt innerhalb der
				gemeldeten Elemente selbst), bleibt als Ausweg immer, zwei vollständige{" "}
				<code>--json</code>-Ausgaben selbst zu vergleichen — siehe{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>
				. Damit haben Sie die volle Kontrolle über die Identitäts- und Matching-Logik, müssen sie
				aber selbst schreiben.
			</p>
		</>
	);
}
