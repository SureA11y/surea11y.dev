import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const codes = (list) =>
	list.map((c, i) => (
		<React.Fragment key={c}>
			{i > 0 && ", "}
			<code>{c}</code>
		</React.Fragment>
	));

const baselineMoves = [
	{ id: "text-missing", rules: ["img-alt-present", "embed-text-alternative-present", "object-text-alternative-present", "svg-image-text-alternative-present", "svg-text-alternative-present", "video-poster-text-alternative-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING"] },
	{ id: "area-alt", rules: ["area-alt-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING", "TEXT_ALTERNATIVE_EMPTY"] },
	{ id: "canvas", rules: ["canvas-text-alternative-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING", "ROLE_IMG_NAME_MISSING"] },
	{ id: "text-review", rules: ["area-alt-quality", "canvas-text-alternative-quality", "embed-text-alternative-quality", "input-image-alt-quality", "object-text-alternative-quality"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_REVIEW"] },
	{ id: "img-quality", rules: ["img-alt-quality", "svg-text-alternative-quality"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_REVIEW", "IMAGE_ONLY_CONTROL_CONTENT"] },
	{ id: "img-decorative", rules: ["img-alt-decorative"], from: ["EXCLUDED_ELEMENT_REVIEW"], to: ["IMAGE_ONLY_CONTROL_CONTENT"] },
	{ id: "input-image", rules: ["input-image-alt-decorative"], from: ["DEFAULT"], to: ["NAME_FROM_ELSEWHERE_REVIEW"] },
	{ id: "manual-review", rules: ["manual-review"], from: ["DEFAULT"], to: ["KEYBOARD_REVIEW"] },
	{ id: "list-children", rules: ["list-children-valid"], from: ["LIST_INVALID_CHILD"], to: ["LIST_ITEM_ROLE_OVERRIDDEN"] },
	{ id: "listitem-parent", rules: ["listitem-parent-valid"], from: ["LISTITEM_INVALID_PARENT"], to: ["LIST_ROLE_OVERRIDDEN"] },
	{ id: "prohibited-children", rules: ["aria-prohibited-children"], from: ["ARIA_PROHIBITED_CHILD_ROLELESS"], to: ["ARIA_PROHIBITED_CHILD"] },
	{ id: "duplicate-id", rules: ["duplicate-id"], from: ["DUPLICATE_ID"], to: ["DUPLICATE_ID_IN_SHADOW_TREE"] },
	{ id: "valid-lang", rules: ["valid-lang"], from: ["ELEMENT_LANG_INVALID"], to: ["DEFAULT_LANG_INVALID"] },
	{ id: "p-as-heading", rules: ["p-as-heading"], from: ["BOLD_LARGE_PARAGRAPH", "BOLD_LARGE_DIV"], to: ["HEADING_LIKE_NUMBER", "HEADING_LIKE_LINK"] },
].map((row) => ({ ...row, rules: codes(row.rules), from: codes(row.from), to: codes(row.to) }));

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
				wenn eine Regel keinen setzt oder etwas anderes als einen nicht leeren String setzt), und{" "}
				<code>html</code> ist das Outer-HTML-Snippet des
				Vorkommens. Das ist inhaltsbasiert statt positionsbasiert: Es bleibt stabil, wenn sich
				das gemeldete Element auf der Seite verschiebt (eine Umsortierung, ein unabhängiges
				Geschwisterelement kommt hinzu oder fällt weg), solange sich das Markup des gemeldeten
				Elements selbst nicht ändert. Bei einem Befund zur Seite selbst, der an{" "}
				<code>&lt;html&gt;</code> oder <code>&lt;body&gt;</code> gemeldet wird (<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a>,{" "}
				<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>, <a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>), ist der Ausschnitt
				nur das Start-Tag, sodass eine Änderung am Inhalt der Seite ihn nicht neu macht. Der
				Ausschnitt wird mit den Attributen jedes Tags nach Namen sortiert und mit sortierten
				Klassennamen verglichen, sodass ein Build, der <code>class="b a" src</code> schreibt, wo
				der vorige <code>src class="a b"</code> geschrieben hat, übereinstimmt; Baseline-Dateien,
				die vorher geschrieben wurden, stimmen weiterhin überein, da der Vergleich beim Abgleich
				erfolgt. <code>selector</code> wird zwar weiterhin in der
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
				Ein Befund in einem Frame eines Frame-übergreifenden Ergebnisses
				(<code>runa11yCoreAcrossFrames</code>) wird zusätzlich an seinem Frame unterschieden: Sein
				Eintrag speichert den <strong>Pfad</strong> des Frames, die Selektoren der Frame-Elemente,
				die zu ihm führen (<code>"frame": ["#checkout"]</code>), und passt nur auf einen Befund im
				Frame unter diesem Pfad. Dieselbe fehlerhafte Komponente in der Seite und in einem Frame
				ergibt zwei Befunde. Einträge ohne <code>frame</code> gehören zur Seite selbst, sodass eine
				Baseline aus einem Scan eines einzelnen Dokuments weiterhin auf die Seite passt.
			</p>
			<p>
				Ein kompaktes Ergebnis (<code>engineOptions.output.detail: 'findings'</code>, siehe{" "}
				<a href="/results-reports/output-schema/#top-level-result">Ausgabeschema</a>) wird als das
				vollständige Ergebnis gelesen, für das es steht, und daher genauso gemeldet.
			</p>
			<p>
				Baseline-Einträge, die in einem neuen Scan auf nichts mehr passen, werden als{" "}
				<strong>veraltet</strong> (<span lang="en">stale</span>) gemeldet: Der Verstoß wurde
				vielleicht behoben, oder das Markup des Elements hat sich geändert, oder der Scan hat es
				nicht erreicht (ein anderer Viewport, Bereich oder Regelsatz). Das ist rein informativ und
				lässt den Build nie fehlschlagen; sehen Sie sich diese Einträge an und erzeugen Sie die
				Baseline dann regelmäßig mit <code>--write-baseline</code> neu, um sie zu bereinigen.
			</p>

			<h2 id="findings-that-lean-fail">Befunde mit Tendenz zu <code>fail</code></h2>
			<p>
				Eine Baseline hält Fehlschläge fest. Ein unentschiedener Befund ist keiner, aber seit 1.14
				tendieren manche zu <code>fail</code>: Die Hinweise der Seite deuten auf einen Fehlschlag,
				ohne ihn zu beweisen (ihr <code>lean</code>, siehe{" "}
				<a href="/results-reports/output-schema/#leans">Ausgabeschema</a>). Ein Build, der an ihnen
				scheitert (<code>leanFailAs</code> im{" "}
				<a href="/results-reports/junit-report/#options">JUnit</a>- und im{" "}
				<a href="/results-reports/sarif-report/#options">SARIF</a>-Bericht), braucht einen Weg, die
				bereits vorhandenen einer Seite zu akzeptieren, so wie er ihre Fehlschläge akzeptiert.
				Fordern Sie sie beim Erstellen der Baseline an:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { buildBaselineEntries } = require('@surea11y/core/baseline');",
					"",
					"const entries = buildBaselineEntries(result, { leanFail: true });",
				]}
			/>
			<p>
				Jeder Befund, der zu <code>fail</code> tendiert und unter <code>leanFailAs</code> den Build
				scheitern lässt (<code>leaningFailures(result)</code> aus <code>@surea11y/core</code>),
				bekommt nach den Fehlschlägen einen Eintrag mit <code>"lean": "fail"</code>:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'{ "ruleId": "heading-order", "reasonCode": "HEADING_ORDER_SKIPPED_LEVEL", "selector": "html > body > main > h3", "html": "<h3>Details</h3>", "lean": "fail" }',
				]}
			/>
			<p>
				Ein solcher Eintrag passt nur auf einen Befund mit Tendenz zu <code>fail</code> und
				derselben Identität, ein gewöhnlicher Eintrag nur auf einen Fehlschlag. Unter{" "}
				<code>leanFailAs</code> scheitert JUnit nicht an einem Befund, auf den er passt (seine{" "}
				<code>&lt;skipped&gt;</code>-Meldung zählt ihn zu den bekannten wahrscheinlichen
				Fehlschlägen), und SARIF belässt ihn bei <code>warning</code>. Ohne{" "}
				<code>leanFailAs</code> ändern die Einträge nichts, und <code>matchBaseline</code> lässt
				sie aus seinen Zählungen heraus, veraltete eingeschlossen, außer mit{" "}
				<code>{"{ leanFail: true }"}</code>: Dann vergleicht es sie in <code>leanFail</code> (
				<code>{"{ total, knownCount, newCount, newOccurrences, staleCount }"}</code>).{" "}
				<code>--write-baseline</code> schreibt nur Fehlschläge.
			</p>
			<p>
				Leans kommen in Minor-Releases hinzu, ein Upgrade kann also wahrscheinliche Fehlschläge
				bringen, die die Baseline nicht enthält: Erstellen Sie sie nach einem Upgrade mit{" "}
				<code>leanFail: true</code> neu und prüfen Sie den Diff. Wie Leans ausgewählt und gemessen
				werden, steht in{" "}
				<a href={`${core}/docs/LEANS.md`}>
					<code>LEANS.md</code>
				</a>{" "}
				auf GitHub.
			</p>

			<h2 id="upgrading">Upgrade</h2>
			<p>
				Die Identität eines Befunds enthält seinen Reason-Code, und ein Minor-Release kann einem
				Befund einen neuen geben: Eine Regel, die keinen gab (<code>DEFAULT</code>), gibt jetzt
				einen, oder ein Code wird nach Ursache in zwei geteilt (siehe{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>Identität eines Befunds</a> in{" "}
				<code>API_STABILITY.md</code> auf GitHub). Der Befund ist derselbe, und eine vor dem Upgrade
				geschriebene Baseline passt weiterhin auf ihn: Jede Verschiebung steht in{" "}
				<code>src/baseline-moves.json</code> (Regel, alter Code, neue Codes), und ein Eintrag unter
				dem alten Code passt auf den Befund unter einem neuen, wenn der Rest seiner Identität, die
				Regel, das Markup und der Frame, gleich ist. <code>matchBaseline</code> und die Option{" "}
				<code>baselineEntries</code> des SARIF- und des JUnit-Berichts lesen sie alle. Ein Eintrag
				wird zuerst unter dem eigenen Code des Befunds gesucht, geht also nie an einen verschobenen
				Befund, wenn ein anderer Befund genau diese Identität hat.
			</p>
			<p>1.14 verschiebt diese, gegenüber 1.13:</p>
			<DataTable
				label="In 1.14 verschobene Reason-Codes"
				rowKey="id"
				columns={[
					{ key: "rules", label: "Regel", wrap: true, width: "45%" },
					{ key: "from", label: "Alter Code", wrap: true },
					{ key: "to", label: "Neuer Code", wrap: true },
				]}
				rows={baselineMoves}
			/>
			<p>
				Die Tabelle gilt für ein Minor-Release: Eine Verschiebung steht darin ab dem Release, mit
				dem sie kam, bis zum nächsten Minor-Release, das sie entfernt. Eine von 1.13 geschriebene
				Baseline passt also unter 1.14.x weiter und muss vor 1.15 neu erzeugt werden.
			</p>
			<p>
				Die Baseline nach einem Upgrade mit <code>--write-baseline</code> (oder{" "}
				<code>buildBaselineEntries</code>) neu zu erzeugen, schreibt jeden Befund unter seinem
				aktuellen Code und macht die Tabelle überflüssig. Es akzeptiert aber auch jeden Befund, den
				das Upgrade neu meldet; prüfen Sie also den Diff. Um die Codes zu aktualisieren, ohne etwas
				Neues zu akzeptieren, schreiben Sie die Datei mit <code>migrateBaselineEntries</code> aus{" "}
				<code>@surea11y/core/baseline</code> um:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { migrateBaselineEntries } = require('@surea11y/core/baseline');",
					"",
					"const file = JSON.parse(fs.readFileSync('baseline.json', 'utf8'));",
					"// With the scan's result, an entry for a split code takes the code its finding has now.",
					"file.entries = migrateBaselineEntries(file, result);",
					"fs.writeFileSync('baseline.json', JSON.stringify(file, null, 2) + '\\n');",
				]}
			/>
			<p>
				Die Funktion gibt eine Kopie der Einträge zurück, jeden verschobenen unter seinem neuen
				Code und alle anderen unverändert. Ohne Ergebnis schreibt sie nur die Verschiebungen um,
				die sie ohne den Befund erkennen kann: einen Code, den die Regel nicht mehr gibt und der zu
				genau einem neuen wurde (das <code>DEFAULT</code> von <code>img-alt-present</code>), keine
				Teilung.
			</p>
			<p>
				Ein Befund, dessen Ergebnis sich mit dem Upgrade geändert hat, ist etwas anderes: Eine
				Regel, die jetzt mit <code>fail</code> bewertet, wonach sie fragte, oder nach dem fragt, was
				sie mit <code>fail</code> bewertete, gibt einen Befund, den die Baseline nicht enthielt,
				oder keinen mehr, den sie enthielt, und das{" "}
				<a href={`${core}/CHANGELOG.md`}>Changelog</a> sagt, warum.
			</p>

			<h2 id="scanning-at-several-viewport-widths">Scannen bei mehreren Viewport-Breiten</h2>
			<p>
				Ein Baseline-Eintrag hält den Viewport nicht fest, und das Matching verwendet ihn nicht:
				Dasselbe Element mit demselben Mangel passt bei jeder Breite. Das passt zu einer Seite,
				deren Befunde nicht von ihrem Layout abhängen. Eine layoutabhängige Regel wie{" "}
				<a href="/rules/text-spacing-content-loss/">
					<code>text-spacing-content-loss</code>
				</a>{" "}
				oder{" "}
				<a href="/rules/target-size-minimum/">
					<code>target-size-minimum</code>
				</a>{" "}
				kann bei einer Breite fehlschlagen und bei einer anderen nicht. Führen Sie daher für eine
				Seite, die bei mehreren Breiten gescannt wird, <strong>eine Baseline pro Breite</strong>:{" "}
				<code>a11y-baseline-390.json</code>, <code>a11y-baseline-1280.json</code>.
			</p>
			<p>
				Eine einzige Baseline, die aus allen Breiten geschrieben wurde, steuert den Build trotzdem
				korrekt, denn ein Befund ist nur dann neu, wenn kein Eintrag auf ihn passt. Dann meldet aber
				jeder Lauf die Befunde der anderen Breiten als veraltet, und die Zahl der veralteten
				Einträge sagt Ihnen nicht mehr, was behoben wurde.
			</p>

			<h2 id="file-format">Dateiformat</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "TEXT_ALTERNATIVE_MISSING", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> lehnt eine Datei, die nicht{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> ist, mit einem klaren Fehler (Exit-Code 2)
				ab, statt ein älteres oder anderes Format zu erraten. <code>matchBaseline</code> und die
				Option <code>baselineEntries</code> der SARIF- und JUnit-Reporter nehmen die Datei so, wie
				sie gespeichert ist (<code>JSON.parse</code> davon), oder ihre <code>entries</code>-Liste.
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
