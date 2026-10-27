import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "https://github.com/SureA11y/pack-en301549#readme";

// The example pack each binding ships as examples/acme-policy-pack.js.
const examplePack = [
	"'use strict';",
	"",
	"// A small pack: one house rule, a checklist profile and two checklist items.",
	"// A real pack is a package of its own; `npx surea11y-pack new <folder>` writes one.",
	"",
	"const { definePack, wcagTags } = require('@surea11y/core/pack');",
	"",
	"module.exports = definePack({",
	"  name: '@acme/a11y-policy',",
	"  title: 'Acme web policy',",
	"  version: '1.0.0',",
	"  namespace: 'acme',",
	"  core: '^1.11.1',",
	"  rules: [",
	"    {",
	"      id: 'acme-no-autoplay',",
	"      meta: {",
	"        title: 'Videos do not play sound on their own',",
	"        description: 'A video that starts with sound talks over a screen reader.',",
	"        tags: ['acme'],",
	"        defaultSeverity: 'serious'",
	"      },",
	"      runInPage(ctx) {",
	"        // defaultMuted reflects the muted attribute where muted isn't set from it yet (jsdom).",
	"        const loud = [...ctx.document.querySelectorAll('video[autoplay]')].filter((v) => !(v.muted || v.defaultMuted));",
	"        return loud.length",
	"          ? {",
	"              outcome: 'fail',",
	"              occurrences: loud.map((v) =>",
	"                ctx.helpers.reportOccurrence(v, { summary: 'This video plays with sound as the page opens.', hint: 'Remove autoplay, or add muted.' })",
	"              )",
	"            }",
	"          : { outcome: 'pass', occurrences: [] };",
	"      }",
	"    }",
	"  ],",
	"  profiles: {",
	"    'acme-web-2026': { tags: wcagTags('2.2', ['A', 'AA']), rules: ['region', 'acme-no-autoplay'] }",
	"  },",
	"  rollups: [",
	"    { id: 'acme-images', title: 'Images have a text alternative', checksIds: ['img-alt-present'] },",
	"    { id: 'acme-media', title: 'Media stays quiet until asked', checksIds: ['acme-no-autoplay'] }",
	"  ]",
	"});",
];

const kindRows = [
	{
		id: "checklist",
		have: "Die Barrierefreiheitsrichtlinie einer Organisation: „WCAG 2.2 AA, dazu diese Regeln, ohne jene, mit diesen Punkten in unserem Bericht“",
		kind: <strong>Checkliste</strong>,
		holds: "Profile, die Regeln von core und eigene auswählen, und Zusammenfassungen als Punkte der Checkliste.",
	},
	{
		id: "standard",
		have: "Eine Norm mit eigenen Anforderungen (eine nationale Norm wie RGAA, die einer Branche): nummerierte Anforderungen, die jeweils von einigen Regeln geprüft werden",
		kind: <strong>Norm</strong>,
		holds: "Eine Anforderungstabelle, die Regeln, die jede Anforderung prüfen, ein Ergebnis pro Anforderung und Profile.",
	},
	{
		id: "rules",
		have: "Ein paar Regeln, die jedem Scan hinzugefügt werden sollen, ohne Profil",
		kind: "nur Regeln",
		holds: "Regeln sowie Varianten oder Überschreibungen der Regeln von core. Beginnen Sie mit einer Checkliste und löschen Sie deren Profile und Zusammenfassungen.",
	},
];

const fileRows = [
	{ id: "index", file: <code>index.js</code>, what: <>Das Pack, geschrieben mit <code>definePack()</code> aus <code>@surea11y/core/pack</code>.</> },
	{ id: "auto", file: <code>rules/automatic/&lt;ns&gt;-link-text-specific.js</code>, what: "Eine Regel, die entscheidet, mit den Helfern von core." },
	{ id: "variant", file: <code>rules/automatic/&lt;ns&gt;-contrast-enhanced.js</code>, what: <>Eine Variante von <code>contrast-minimum</code> aus core bei 7:1.</> },
	{ id: "manual", file: <code>rules/manual/&lt;ns&gt;-new-window-review.js</code>, what: <>Eine manuelle Regel, die eine manuelle Prüfung verlangt, mit ihren Reason-Codes und den Schritten, mit denen eine Person sie beantwortet (<code>meta.reasonCodes</code>, <code>meta.review</code>).</> },
	{ id: "i18n", file: <code>i18n/en.json</code>, what: "Die Meldungen." },
	{ id: "tests", file: <><code>tests/rules/*.test.js</code>, <code>tests/profiles.test.js</code></>, what: "Ein Test pro Regel und dafür, was jedes Profil ausführt." },
	{ id: "examples", file: <code>docs/RULE_EXAMPLES.md</code>, what: "Beispiele für die Ergebnisse jeder Regel." },
	{ id: "eslint", file: <code>eslint.config.js</code>, what: "Die Lint-Regeln von core für Regeln." },
	{ id: "standard", file: <><code>requirements.js</code>, <code>rule-map.js</code></>, what: "Nur bei einer Norm: die Anforderungen und die Regeln, die jede prüfen." },
	{ id: "package", file: <code>package.json</code>, what: <><code>private</code>, mit <code>@surea11y/core</code> als Peer-Dependency in der Version, die es geschrieben hat (<code>^1.14.0</code>), und eslint, jsdom und Playwright als Entwicklungsabhängigkeiten.</> },
	{ id: "readme", file: <><code>README.md</code>, <code>.gitignore</code></>, what: "Die eigene Anleitung des Packs zu diesen Dateien, und was git auslässt." },
];

const profileFieldRows = [
	{ id: "tags", field: <code>tags</code>, what: <>Regeln, die eines dieser Tags tragen. <code>wcagTags(version, levels)</code> aus <code>@surea11y/core/pack</code> liefert die WCAG-Tags von core (<code>wcagTags('2.1')</code> sind 2.0 und 2.1, A und AA).</> },
	{ id: "rules", field: <code>rules</code>, what: <>Regeln nach ID, aus core oder dem Pack: eine Best-Practice-Regel, die kein WCAG-Tag auswählt, oder, mit <code>tags: []</code>, die Regeln von core, die das Profil neben den eigenen des Packs ausführt.</> },
	{ id: "exclude", field: <code>exclude</code>, what: <><code>{"{ rules: [...] }"}</code> lässt Regeln aus dem Scan weg; <code>{"{ criteria: ['2.5.8'] }"}</code> erlässt diese Kriterien: Ihre Zusammenfassungen entfallen, ebenso jede Regel, deren Kriterien alle erlassen sind; eine Regel, die auch ein Kriterium prüft, das das Profil behält, läuft weiter. Das schränkt ein, was der Scan prüft: Die Anforderungen der WCAG bleiben, wie sie sind.</> },
	{ id: "severity", field: <code>severity</code>, what: <><code>{"{ ruleId: level }"}</code>: ein anderer Schweregrad unter dem Profil. Ergebnisse zeigen ihn und behalten den ursprünglichen Schweregrad der Regel als <code>ruleSeverity</code>; Baselines und Befund-IDs ändern sich nicht.</> },
	{ id: "wcagVersion", field: <code>wcagVersion</code>, what: <><code>'2.0'</code>, <code>'2.1'</code> oder <code>'2.2'</code>: die WCAG-Version, nach der die Scans des Profils beurteilt werden (<code>engine.wcagVersion</code>). Ohne das Feld ergibt sich die Version aus den WCAG-Tags in <code>tags</code>, und ein Profil ohne solche Tags wird nach 2.2 beurteilt. Eine eigene <code>engineOptions.wcagVersion</code> des Scans hat weiterhin Vorrang. Ab core 1.12.0.</> },
	{ id: "keepsParsing", field: <code>keepsParsing</code>, what: <><code>true</code>, wenn die Norm 4.1.1 „Syntaxanalyse“ im Wortlaut verlangt, wie EN 301 549 V3.2.1: Ein Fehlschlag dort bleibt dann bei einem 2.0- oder 2.1-Ziel ein Fehlschlag. Unter einem Profil ohne dieses Feld werten die Errata von 2023 zu WCAG 2.0 und 2.1 das Kriterium 4.1.1 für HTML und XML als erfüllt, und <code>duplicate-id</code> fragt stattdessen nach (unter 2.2, das 4.1.1 entfernt hat, fragt es nach, gleich was das Profil sagt). Nur das eigene Feld des Profils zählt: Das Profil eines Packs, das an die Stelle eines Profils von core tritt, erbt es nicht. <code>engineOptions.mappings</code> ändert nie ein Ergebnis; ein Scan, der nach einer Norm beurteilt wird, die 4.1.1 beibehält, führt daher deren Profil aus. Ab core 1.14.0.</> },
	{ id: "version", field: <><code>version</code>, <code>mappedRules</code></>, what: <>Nur beim Profil einer Norm: die Version der Norm, auf die es zielt, und <code>mappedRules: true</code>, um jede Regel auszuführen, die die Norm für diese Version zuordnet.</> },
];

export function PacksContent() {
	return (
		<>
			<p>
				Ein <strong>Pack</strong> bringt Regeln, Varianten der Regeln von core, eine Norm oder eine
				Checkliste sowie deren Profile und Meldungen aus einem eigenen Paket zu{" "}
				<code>@surea11y/core</code>, ohne einen Fork oder einen Build von core. Eine nationale Norm
				wie RGAA kann ein Pack sein, ebenso die Barrierefreiheitsrichtlinie Ihrer Organisation. Ein
				Scan nimmt Packs in <code>engineOptions.packs</code> entgegen und führt sie so aus wie die
				eigenen Regeln und Normen von core: in Node und im Browser, aus der CLI, den Bindings und
				den Test-Matchern, mit Ergebnissen, Zusammenfassungen und Berichtseinträgen im selben Format
				wie die von core. Packs erfordern <code>@surea11y/core</code> 1.11.1 oder neuer.
			</p>

			<h2 id="which-kind-of-pack">Welche Art von Pack</h2>
			<DataTable
				label="Arten von Packs"
				rowKey="id"
				columns={[
					{ key: "have", label: "Sie haben", wrap: true },
					{ key: "kind", label: "Art", width: "16%" },
					{ key: "holds", label: "Was es enthält", wrap: true },
				]}
				rows={kindRows}
			/>
			<p>
				Die Regeln und Profile eines Packs können jede Regel von core verwenden: Eine Checkliste oder
				eine Norm besteht größtenteils aus Regeln von core, ausgewählt und gruppiert, plus den
				wenigen Regeln, die core nicht hat. Die Beispiele auf dieser Seite verwenden{" "}
				<code>acme-policy-pack.js</code>, das kleine Pack, das jedes Binding in seinem Ordner{" "}
				<code>examples/</code> mitliefert: eine hauseigene Regel, ein Checklistenprofil (WCAG 2.2 A
				und AA, <code>region</code> und die hauseigene Regel) und zwei Checklistenpunkte.{" "}
				<a href="#start-from-the-example">Sein Quelltext</a> steht weiter unten.
			</p>

			<h2 id="en-301-549-pack">Das EN-301-549-Pack</h2>
			<p>
				<a href={pack}><code>@surea11y/pack-en301549</code></a> ist ein Normen-Pack der
				SureA11y-Familie, fertig zur Installation: Kapitel 9 (Web) der EN 301 549, in V3.2.1 und
				V4.1.1. Es hat ein Profil pro Version, <code>en301549-v4.1.1</code> und{" "}
				<code>en301549-v3.2.1</code>, das ein Ergebnis pro Klausel meldet, und{" "}
				<code>mappings: ['en301549']</code>, um die Klauseln in den Ergebnissen jedes Scans zu
				nennen, auch eines WCAG-Scans. Es braucht <code>@surea11y/core</code> 1.13.0 oder neuer.
			</p>
			<p>
				Seine Version 1.1.0, gebaut auf core 1.14.0, beurteilt jede Klausel so, wie core das
				WCAG-Kriterium beurteilt, das sie wiedergibt. Daher besteht noch keine Klausel: Wo alle
				ihre Regeln bestehen, ist eine Klausel <code>cantTell</code>, damit eine Person den Rest
				prüft, wie ihr Kriterium (siehe{" "}
				<a href="/conformance/wcag-mapping/">WCAG-Konformitätszuordnung</a>). Das Profil{" "}
				<code>en301549-v3.2.1</code> behält 4.1.1 „Syntaxanalyse“ bei, sodass eine doppelte id dort
				9.4.1.1 weiterhin fehlschlagen lässt, und 9.1.4.5, 9.3.3.1 und 9.4.1.3 haben ihre ersten
				Regeln (<code>image-of-text</code>, <code>invalid-field-error-message</code>,{" "}
				<code>live-region-announcements</code>). Mit core 1.13 verhält es sich wie seine
				Versionen 1.0.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// npm install @surea11y/core @surea11y/pack-en301549",
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"runDomRulesInPage(url, null, { packs: [en301549], profile: 'en301549-v4.1.1' });",
					"runDomRulesInPage(url, null, { packs: [en301549], profile: 'wcag22-aa', mappings: ['en301549:V4.1.1'] });",
				]}
			/>
			<p>
				Es ist auch ein vollständiges Beispiel für eine eigene Norm. Es hat keine Regeln: Kapitel 9
				gibt die WCAG wieder, also prüfen die Regeln von core für das jeweilige Kriterium jede
				Klausel. Seine Profile wählen diese Regeln (<code>tags</code>,{" "}
				<code>mappedRules: true</code>), nennen die WCAG-Version, nach der jede Version der Norm
				beurteilt wird (<code>wcagVersion</code>), und behalten für V3.2.1 4.1.1 „Syntaxanalyse“ bei
				(<code>keepsParsing</code>). Seine Klauseln geben WCAG-Kriterien eins zu eins wieder (
				<code>applicability: 'wcag'</code>), und seine Regelzuordnung wird aus dem Katalog des
				installierten core abgeleitet: Eine Regel, die core hinzufügt, ist ohne Änderung am Pack
				abgedeckt. Eine Norm mit Anforderungen, die die WCAG nicht hat, folgt derselben Form und
				bringt eigene Regeln mit. Der Quelltext ist kurz und lohnt sich neben{" "}
				<a href="#writing-a-pack">Ein Pack schreiben</a> weiter unten.
			</p>
			<p>
				Core hatte EN 301 549 bis 1.13.0 eingebaut; diese Version kündigt das zugunsten dieses Packs
				ab (siehe <a href="/conformance/wcag-mapping/#en-301-549">WCAG-Konformitätszuordnung</a>).
				Wie jedes Profil wählen die des Packs, was läuft: Eine Konformitätserklärung braucht
				weiterhin eine Person, die jede Klausel prüft.
			</p>

			<h2 id="using-a-pack">Ein Pack verwenden</h2>

			<h3 id="from-node">Aus Node</h3>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' }, null);",
					"result.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
				]}
			/>
			<p>
				Das Pack wird einmal vorbereitet und für den nächsten Scan mit demselben Pack-Objekt
				behalten, sodass ein Crawl, der jeder Seite dieselben Packs übergibt, sie nur einmal
				vorbereitet. <code>definePack</code> friert das Pack-Objekt ein: Behandeln Sie es als
				unveränderlich, und verwenden Sie zwischen Scans dasselbe Objekt wieder. Ein übergebenes
				Pack wird für den Scan registriert; seine Regeln wählt das nicht aus. Eine Regel des Packs,
				die das Namensraum-Tag des Packs trägt, ist eine Opt-in-Regel: Ohne eines der Profile des
				Packs läuft sie nur, wenn sie über ihre ID oder über dieses Tag ausgewählt wird (siehe{" "}
				<a href="#names">Namen</a>). Eine Regel des Packs ohne das Tag wird ausgewählt wie die
				Regeln von core, sodass ein Standard-Scan mit dem Pack sie ausführt. Ergänzen Sie{" "}
				<code>{"runOnly: { bestPractices: true }"}</code> neben dem Profil, um auch die Best
				Practices auszuführen.
			</p>

			<h3 id="with-a-browser-binding">Mit einem Browser-Binding</h3>
			<p>
				Playwright, Puppeteer, Selenium und WebdriverIO nehmen das Pack-Objekt in{" "}
				<code>.withPacks()</code> entgegen und registrieren es vor dem Scan in der Seite, mit{" "}
				<code>.frames(true)</code> auch in jedem Frame:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { A11yCoreBuilder, getScanGaps } = require('@surea11y/playwright');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const results = await new A11yCoreBuilder({ page })",
					"  .withPacks(acmePolicy)",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze();",
					"",
					"results.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"",
					"// A checklist's items, each one result, beside core's WCAG rollups:",
					"results.rulesResults.filter((r) => r.meta && r.meta.standard === 'Acme web policy');",
				]}
			/>
			<p>
				Übergeben Sie ein Array oder rufen Sie <code>.withPacks()</code> erneut auf, um mit mehreren
				Packs zu scannen. Die Bindings teilen sich <code>.withPacks()</code>, aber jeder Builder
				nimmt sein eigenes Treiberobjekt (<code>{"{ page }"}</code>, <code>{"{ driver }"}</code>{" "}
				oder <code>{"{ browser }"}</code>) und braucht seine eigene Einrichtung. Siehe{" "}
				<a href="/getting-started/playwright/">Playwright</a>,{" "}
				<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
				<a href="/getting-started/selenium/">Selenium</a> und{" "}
				<a href="/getting-started/webdriverio/">WebdriverIO</a>.
			</p>

			<h3 id="with-cypress">Mit Cypress</h3>
			<p>
				Ein Pack wird in Node vorbereitet, und eine Cypress-Spec läuft im Browser. Daher nimmt{" "}
				<code>.withPacks()</code> in Cypress den Modulnamen jedes Packs entgegen (einen Paketnamen
				oder einen Pfad ab dem Projektverzeichnis), und das Plugin des Bindings bereitet das Pack in
				Node vor. Registrieren Sie das Plugin einmal:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// cypress.config.js",
					"const { defineConfig } = require('cypress');",
					"const surea11y = require('@surea11y/cypress/plugin');",
					"",
					"module.exports = defineConfig({",
					"  e2e: {",
					"    setupNodeEvents(on, config) {",
					"      surea11y(on, config);",
					"    }",
					"  }",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"new A11yCoreBuilder()",
					"  .withPacks('./examples/acme-policy-pack.js') // or a package name, '@acme/a11y-policy'",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze()",
					"  .then((results) => {",
					"    expect(results.engine.packs).to.deep.equal(['@acme/a11y-policy@1.0.0']);",
					"  });",
				]}
			/>
			<p>
				<code>.analyze()</code> fragt das Plugin über <code>cy.task</code> nach dem Script, das die
				Packs registriert, und führt es in der Seite aus, mit <code>.frames(true)</code> auch in
				jedem Frame desselben Ursprungs. Das Plugin behält ein Pack für den Rest des Laufs, daher
				zeigt sich eine Änderung an der Datei eines Packs beim nächsten <code>cypress run</code>{" "}
				oder nach einem Neustart von <code>cypress open</code>. Ein Pack-Objekt, wie es die anderen
				Bindings annehmen, wirft bei <code>.withPacks()</code> einen Fehler: Es lässt sich nicht im
				Browser vorbereiten.
			</p>

			<h3 id="with-the-test-matchers">Mit den Test-Matchern</h3>
			<p>
				<code>@surea11y/test-matchers</code> scannt in Node, daher wird ein Pack als das Objekt
				selbst übergeben:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const acmePolicy = require('./acme-policy-pack');",
					"const policy = { packs: [acmePolicy], profile: 'acme-web-2026' };",
					"",
					"test(\"a page that breaks the pack's house rule fails the assertion\", () => {",
					"  document.body.innerHTML = '<main><h1>Welcome</h1><video autoplay src=\"intro.mp4\"></video></main>';",
					"  expect(document).not.toHaveNoA11yViolations(policy);",
					"});",
				]}
			/>
			<p>
				Halten Sie die Pack-Objekte an einer Stelle (einer Setup-Datei oder einem Modul), sodass
				jeder Test dieselben übergibt. Ein Pack, das nicht gelaufen ist, lässt die Assertion
				scheitern. Siehe <a href="/getting-started/test-matchers/#packs">test-matchers</a>.
			</p>

			<h3 id="from-the-cli">Aus der CLI</h3>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				<code>--pack</code> nimmt einen Paketnamen, aufgelöst aus dem Projekt des
				Arbeitsverzeichnisses, oder einen Pfad entgegen und lässt sich für mehrere Packs
				wiederholen. Das Pack lädt <code>@surea11y/core/pack</code>, das neben der CLI installiert
				wird, wenn Sie <code>@surea11y/cli</code> im Projekt installieren. Siehe{" "}
				<a href="/getting-started/cli/#packs">CLI</a>.
			</p>

			<h3 id="in-a-page-of-your-own">In einer eigenen Seite</h3>
			<p>
				Für eine Browser-Erweiterung oder ein eigenes <code>page.evaluate</code> fügen Sie{" "}
				<code>packScript([acmePolicy])</code> aus <code>@surea11y/core/pack</code> nach dem
				Browser-Bundle von core ein oder liefern eine einzige Datei aus, die mit{" "}
				<code>buildBrowserBundle({"{ packs: [acmePolicy] }"})</code> gebaut wurde, und nennen das
				Pack als <code>name@version</code>. Siehe{" "}
				<a href="/getting-started/standalone/#packs-in-a-page">Standalone</a>.
			</p>
			<p>
				Das Skript läuft nur mit dem core, der es geschrieben hat: Eine Seite mit dem Bundle eines
				anderen core überspringt das Pack, und <code>skippedPacks</code> nennt die beiden Versionen.
				Für eine Seite ohne Driver, die ihre Skripte als Dateien lädt (ein{" "}
				<code>&lt;script&gt;</code>-Tag, eine Erweiterung), eignet sich am besten eine einzige Datei
				aus <code>buildBrowserBundle</code>, neu erzeugt für jede Version von core oder des Packs.
			</p>

			<h2 id="what-a-scan-reports">Was ein Scan meldet</h2>
			<ul>
				<li>
					<code>engine.packs</code> nennt jedes Pack, das gelaufen ist, als{" "}
					<code>name@version</code>, und <code>engine.profile</code> das Profil, das angewendet
					wurde.
				</li>
				<li>
					Die Regeln eines Packs erscheinen in <code>checksResults</code> wie die von core, mit IDs,
					die mit seinem Namensraum beginnen (<code>acme-no-autoplay</code>). Eine Regel eines Packs,
					die einem WCAG-Kriterium zugeordnet ist, zählt für die Zusammenfassung dieses Kriteriums,
					es sei denn, sie trägt das Opt-in-Namensraum-Tag des Packs: Solche Regeln prüfen, was die
					WCAG nicht verlangen, und zählen daher nur in den eigenen Zusammenfassungen des Packs. Ihr{" "}
					<code>wcagSc</code> nennt trotzdem die WCAG-Kriterien, die sie prüfen, für die Berichte, und
					keine andere Norm (EN 301 549, die jede Regel über ihre WCAG-Kriterien zuordnet)
					beansprucht sie. Eine
					Überschreibung zählt anstelle der Regel von core, die sie ersetzt, dort, wohin ihre eigene
					Zuordnung sie stellt.
				</li>
				<li>
					Die Punkte einer Checkliste oder die Anforderungen einer Norm sind Zusammenfassungen in{" "}
					<code>rulesResults</code>, mit dem Namen der Checkliste oder Norm als{" "}
					<code>meta.standard</code>. Der <a href="/results-reports/html-report/">HTML-Bericht</a>{" "}
					zeigt sie in einem eigenen Abschnitt, <a href="/results-reports/sarif-report/">SARIF</a>{" "}
					taggt jede Regel mit den Punkten, zu denen sie gehört (<code>acme-images</code>), und{" "}
					<a href="/results-reports/junit-report/">JUnit</a> führt sie als Eigenschaften auf.{" "}
					<code>standards</code> des Ergebnisses nennt die Checkliste, sodass ein gespeichertes
					Ergebnis überall gleich dargestellt wird.
				</li>
				<li>
					Ändert ein Profil über sein Feld <code>severity</code> den Schweregrad einer Regel, zeigen
					die betroffenen Ergebnisse den neuen Schweregrad, und der ursprüngliche Schweregrad der
					Regel bleibt als <code>ruleSeverity</code> erhalten.
				</li>
			</ul>

			<h2 id="when-a-pack-doesnt-run">Wenn ein Pack nicht läuft</h2>
			<p>
				Ein Pack, dessen <code>core</code>-Bereich das installierte core ausschließt, das nicht
				gültig ist oder das nicht zu core passt (eine Regel-ID außerhalb seines Namensraums, ein
				Wörterbuchschlüssel, den core hat, eine Variante einer Regel, die es nicht gibt), wird
				übersprungen: Der Scan läuft ohne es, warnt und listet es in <code>skippedPacks</code> als{" "}
				<code>{"{ name, reason }"}</code>. Unter <code>strictOptions</code> wirft er einen Fehler
				mit <code>code: 'INVALID_ENGINE_OPTIONS'</code>, wie jeder Fehler in{" "}
				<code>engineOptions.packs</code>.
				Zwei Packs, die miteinander kollidieren (ein Wörterbuchschlüssel, den beide definieren, zwei
				Normen mit einem Schlüssel), werfen einen Fehler, da jede Art, zwischen ihnen zu wählen, von
				der Reihenfolge abhinge, in der sie übergeben wurden. In einer Seite wird ein in{" "}
				<code>engineOptions.packs</code> genanntes Pack, das kein Aufruf von <code>packScript</code>{" "}
				registriert hat oder das mit einer anderen core-Version registriert wurde, genauso
				aufgeführt. Ein Scan kann also ohne die Prüfungen enden, für die Sie das Pack hinzugefügt
				haben: Ein Tool, das von einem Pack abhängt, sollte <code>skippedPacks</code> prüfen, bevor
				es den Scan als vollständig behandelt.
			</p>
			<p>Jedes Tool macht aus einem übersprungenen Pack einen sichtbaren Fehlschlag:</p>
			<ul>
				<li>
					Die Browser-Bindings prüfen jedes Pack beim Aufruf von <code>.withPacks()</code> und werfen
					vor dem Scan einen Fehler bei einem Pack, das core nicht ausführen kann. Ein Pack, das die
					Seite dann nicht ausführt, ist eine Lücke <code>'pack-skipped'</code> in{" "}
					<code>getScanGaps(results)</code>, und <code>.analyze()</code> warnt davor, sodass ein
					Test, der die Lücken prüft, fehlschlägt.
				</li>
				<li>Die Test-Matcher lassen die Assertion scheitern und nennen das Pack und den Grund.</li>
				<li>
					Die CLI endet mit Exit-Code <code>2</code>, ohne einen Bericht oder eine Baseline zu
					schreiben, bei einem Pack, das sie nicht finden oder laden kann, oder einem, das die Engine
					überspringt.
				</li>
			</ul>
			<p>
				Installieren Sie das Pack neben <code>@surea11y/core</code> und dem Paket, das es
				ausführt, damit alle drei dieselbe Kopie von core nutzen.
			</p>

			<h2 id="writing-a-pack">Ein Pack schreiben</h2>

			<h3 id="start-from-the-example">Vom Beispiel ausgehen</h3>
			<p>
				Ein Pack ist ein Objekt, das mit <code>definePack</code> aus{" "}
				<code>@surea11y/core/pack</code> erstellt wird. Das ist <code>acme-policy-pack.js</code>,
				das Beispiel, das die Bindings mitliefern:
			</p>
			<CodeBlock lang="js" lines={examplePack} />
			<p>
				Sein Profil, <code>acme-web-2026</code>, führt die Regeln für WCAG 2.2 A und AA aus core
				aus, die Best-Practice-Regel <code>region</code>, die kein WCAG-Tag auswählt, und die
				hauseigene Regel. Seine zwei Zusammenfassungen sind die Punkte der Checkliste: Jede
				gruppiert Regeln, aus core oder dem Pack, zu einem Ergebnis.
			</p>

			<p>
				Für eine Norm ist das <a href="#en-301-549-pack">EN-301-549-Pack</a> ein vollständiges,
				veröffentlichtes Beispiel.
			</p>

			<h3 id="create-one">Eines mit <code>surea11y-pack new</code> erstellen</h3>
			<p>Für ein eigenes Pack gehen Sie von einem erzeugten Paket aus:</p>
			<CodeBlock
				lines={[
					{ text: "npx -p @surea11y/core surea11y-pack new acme-a11y --name @acme/a11y-pack", command: true },
					"# or, for a standard:",
					{ text: "npx -p @surea11y/core surea11y-pack new city-standard --name @city/a11y-standard --kind standard --title \"City Standard\"", command: true },
					"",
					{ text: "cd acme-a11y", command: true },
					{ text: "npm install", command: true },
					{ text: "npx playwright install chromium   # once, for npm run docs", command: true },
					{ text: "npm test && npm run lint && npm run docs", command: true },
				]}
			/>
			<p>
				Das Pack funktioniert direkt nach dem Erzeugen: Seine Tests bestehen, seine Regeln bestehen
				den Lint ohne Befunde, seine Beispiele stimmen mit seinen Regeln überein.{" "}
				<code>surea11y-pack new</code> prüft das Pack vor dem Schreiben so, wie ein Scan es täte,
				und lehnt einen Namen, Namensraum oder Titel ab, der es ungültig machen würde (ein Titel{" "}
				<code>WCAG</code> gibt seine Norm als eine von core aus), mit Begründung. Ändern Sie es von
				dort aus Schritt für Schritt und führen Sie dabei <code>npm test</code> aus. Seine README
				geht jede Datei durch:
			</p>
			<DataTable
				label="Dateien eines erzeugten Packs"
				rowKey="id"
				columns={[
					{ key: "file", label: "Datei", width: "40%", wrap: true },
					{ key: "what", label: "Was sie enthält", wrap: true },
				]}
				rows={fileRows}
			/>

			<h3 id="names">Namen</h3>
			<ul>
				<li>
					<strong>Paketname und Version</strong> sind ein npm-Paketname und eine vollständige
					Version (<code>1.0.0</code>). Ein Scan meldet sie in <code>engine.packs</code>.
				</li>
				<li>
					<strong>Der Namensraum</strong> (<code>namespace: 'acme'</code>) hält die IDs des Packs
					von denen von core und anderer Packs getrennt: Jede Regel-, Zusammenfassungs- und
					Profil-ID beginnt mit ihm und <code>-</code>. Er darf kein Präfix von Regel-IDs aus core
					sein (<code>img</code>, <code>aria</code> oder <code>link</code> wären es, wie in{" "}
					<code>img-alt-present</code>) und nicht mit <code>wcag</code> beginnen, und zwei Packs in
					einem Scan können ihn nicht teilen. Er ist außerdem das Tag, das die eigenen Regeln des
					Packs zu Opt-in-Regeln macht: Eine Regel mit diesem Tag läuft nur unter einem der Profile
					des Packs, über ihre ID oder über das Tag (<code>optInRules: ['acme']</code>).
					Standardmäßig führt ein Scan, der auf WCAG zielt, sie also nicht aus. Das Freischalten des
					Tags mit <code>optInRules</code> entfernt weder das Profil noch die Filter des Scans: Unter
					einem WCAG-Profil läuft eine freigeschaltete Regel nur, wenn ihre Tags auch zu diesem
					Profil passen. Lassen Sie das Tag bei einer Regel weg, die in
					jedem Scan mit dem Pack laufen soll: Sie wird dann ausgewählt wie die Regeln von core, und
					ein Scan, der auf WCAG zielt, kann sie ausführen und ihre Fehlschläge melden, wenn ihre Tags
					passen.
				</li>
				<li>
					<strong><code>core</code></strong> ist der Bereich der core-Versionen, mit denen das Pack
					funktioniert (<code>'^1.11.1'</code>), gelesen so, wie npm Bereiche liest. Beginnen Sie
					neue Packs mit 1.11.1: Dem Paket 1.11.0 fehlte eine Datei, die Packs in Node brauchen. Ein
					Scan mit
					einem core außerhalb davon überspringt das Pack, mit dem Grund in{" "}
					<code>skippedPacks</code>. <code>surea11y-pack new</code> schreibt die Version, die das
					Pack erzeugt hat (<code>^1.14.0</code>); behalten Sie einen Bereich, der bei 1.14 beginnt,
					wenn das Pack nutzt, was 1.14 hinzugefügt hat: <code>meta.review</code>, Zeilen mit{" "}
					<code>reasonCodes</code> und <code>findings</code>, <code>meta.contributions</code>,{" "}
					<code>applicability</code>, <code>partial</code> oder <code>keepsParsing</code>.
				</li>
				<li>
					<strong><code>title</code></strong> ist der Name, unter dem Ergebnisse und Berichte eine
					Checkliste führen, und <strong><code>description</code></strong> ein Satz dazu, was das
					Pack prüft, für Tools, in denen Nutzende Packs auswählen können (<code>describePacks</code>{" "}
					gibt ihn zurück).
				</li>
			</ul>

			<h3 id="profiles">Profile</h3>
			<p>
				Ein Profil ist eine benannte Auswahl, ausgeführt mit <code>engineOptions.profile</code>. Eine
				Regel läuft darunter, wenn sie eines seiner <code>tags</code> trägt oder ihre ID in{" "}
				<code>rules</code> steht und sie nicht in <code>exclude</code> steht; die Regeln des Packs,
				die das Tag seines Namensraums tragen, laufen unter jedem Profil des Packs.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"profiles: {",
					"  'acme-policy': {",
					"    tags: wcagTags('2.2', ['A', 'AA']),               // core's WCAG 2.2 A and AA rules",
					"    rules: ['region', 'heading-order'],               // and these, by id",
					"    exclude: { rules: ['contrast-minimum'] },         // but not this one",
					"    severity: { 'img-alt-present': 'critical' }       // and this one is critical here",
					"  },",
					"  'acme-quick': {",
					"    tags: [],",
					"    rules: ['img-alt-present', 'link-name-present', 'page-title-present']",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="Felder eines Profils"
				rowKey="id"
				columns={[
					{ key: "field", label: "Feld", width: "22%" },
					{ key: "what", label: "Was es bewirkt", wrap: true },
				]}
				rows={profileFieldRows}
			/>
			<p>
				<strong>Ein Profil, das nur ausführt, was seine Norm verlangt.</strong> Das Profil einer
				Norm mit <code>{"tags: [<ns>]"}</code> und <code>mappedRules: true</code> führt die eigenen
				Regeln des Packs und die Regeln von core aus, die seine Zuordnung mit einer Anforderung
				verknüpft, und sonst nichts: Keine Regel prüft, was die Norm nicht verlangt, und die
				Ergebnisse enthalten keine WCAG-Kriterien. Ohne WCAG-Tag sagt allerdings nichts, auf
				welcher WCAG-Version die Norm aufbaut, und der Lauf wird nach 2.2 beurteilt. Für eine Norm,
				die auf 2.1 aufbaut, ist das falsch: Der Lauf meldet Kriterien von 2.2, etwa 2.5.8, die die
				Norm nicht hat. Geben Sie die Version an, und <code>keepsParsing: true</code>, wenn die Norm
				4.1.1 „Syntaxanalyse“ weiterhin verlangt. Die
				erzeugte <code>index.js</code> liest sie aus <code>requirements.js</code>, wo jede Version
				der Norm die WCAG-Version nennt, auf der sie aufbaut (
				<code>{"{ version: '1.0', wcagVersion: '2.2' }"}</code>):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'city-1.0': {",
					"  version: '1.0',",
					"  tags: ['city'],                      // the pack's own rules",
					"  mappedRules: true,                   // and the core rules its map links to a requirement",
					"  wcagVersion: wcagVersionOf('1.0')    // judged by the WCAG version requirements.js gives for 1.0",
					"}",
				]}
			/>
			<p>
				Die Regeln von core mit ihren IDs und Tags stehen unter <a href="/rules/">Regeln</a>.
			</p>

			<h3 id="checklist-items-and-requirements">Checklistenpunkte und Anforderungen</h3>
			<p>
				<strong>Die Punkte einer Checkliste</strong> sind ihre <code>rollups</code>:{" "}
				<code>{"{ id, title, checksIds }"}</code>, die jeweils Regeln zu einem Ergebnis gruppieren.
				Ein Punkt ergibt <code>fail</code>, wenn eine seiner Regeln <code>fail</code> ergibt, und{" "}
				<code>pass</code>, wenn alle bestehen. Ergibt keine Regel <code>fail</code>, aber eine{" "}
				<code>cantTell</code>, ist auch der Punkt <code>cantTell</code>: Er erfordert eine manuelle
				Prüfung. Ein Pack gibt
				entweder <code>profiles</code> und <code>rollups</code> an, eine Checkliste, oder einen{" "}
				<code>standard</code>, nicht beides.
			</p>
			<p>
				<strong>Die Anforderungen einer Norm</strong> stammen aus zwei Tabellen, die der Generator
				schreibt: <code>requirements.js</code> (pro Version Nummer, Wortlaut und WCAG-Kriterien jeder
				Anforderung) und <code>rule-map.js</code> (welche Anforderungen jede Regel prüft und warum).{" "}
				<code>ruleMappedStandard()</code> aus <code>@surea11y/core/pack</code> macht daraus die
				Norm: eine Zusammenfassung pro Anforderung, die Anforderungen, die das Ergebnis jeder Regel
				nennt, und Prüfungen beider Tabellen beim Vorbereiten des Packs.
			</p>

			<h3 id="sending-findings-to-requirements">Befunde Anforderungen zuweisen</h3>
			<p>
				Die Zeile einer Regel in <code>rule-map.js</code> kann ihre Befunde eines Reason-Codes
				anderswohin schicken, mit <code>{"reasonCodes: { [code]: { requirements, outcome } }"}</code>:{" "}
				<code>requirements</code> (standardmäßig die der Zeile) sind die Anforderungen, für die
				diese Befunde zählen, <code>[]</code> für keine, und <code>outcome: 'cantTell'</code> macht
				einen fehlschlagenden dort zu einer Frage. Die Zusammenfassung einer Anforderung beurteilt
				die Regel dann nach den Befunden, die für sie zählen; so kann eine Norm zu einer Ursache
				nachfragen, wo WCAG sie fehlschlagen lässt, oder zwei Ursachen zwei Tests zuordnen:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'list-children-valid': {",
					"  requirements: ['9.3.1'],",
					"  reasonCodes: { LIST_ITEM_ROLE_OVERRIDDEN: { requirements: ['9.3.1', '9.3.2'], outcome: 'cantTell' } }",
					"}",
				]}
			/>
			<p>
				Eine Zeile kann Befunde auch danach zuweisen, was sie festhalten, mit{" "}
				<code>{"findings: [{ when, requirements, outcome }]"}</code>: <code>when</code> gibt Werte
				an, die Felder im <code>data.details</code> eines Befunds haben müssen, benannt über ihren
				Pfad mit Punkten. Ein Befund richtet sich nach dem ersten Eintrag, auf den er passt, sonst
				nach seinem Reason-Code, sonst nach der Zeile. So kann eine Norm die Fehlschläge einer Regel
				dem Test für ihre Textgröße zuordnen, obwohl sie einen Reason-Code teilen:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'contrast-minimum': {",
					"  requirements: ['3.1', '3.2'],",
					"  findings: [",
					"    { when: { 'typography.isLargeText': false }, requirements: ['3.1'] },",
					"    { when: { 'typography.isLargeText': true }, requirements: ['3.2'] }",
					"  ]",
					"}",
				]}
			/>
			<p>
				Vergleichen Sie nur Felder, die eine Regel stabil hält: <code>reasonCode</code> bei jeder
				Regel und die wenigen weiteren, die die{" "}
				<a href={`${core}/docs/API_STABILITY.md`}>API-Stabilitätsrichtlinie</a> von core auf GitHub
				nennt (darunter Kontrastverhältnis, Schwelle und Typografie von{" "}
				<code>contrast-minimum</code>). Ein Feld, das sich ändert oder wegfällt, passt auf nichts,
				und der Befund richtet sich nach seinem Code oder der Zeile. Die Reason-Codes jeder Regel
				stehen unter „What a finding reports“ im{" "}
				<a href={`${core}/docs/RULE_CATALOG.md`}>Regelkatalog</a> von core auf GitHub.
			</p>
			<p>
				Zwei weitere Felder ändern, wie eine Anforderung beurteilt wird. Eine Norm, deren
				Anforderungen WCAG-Kriterien eins zu eins wiedergeben, wie Kapitel 9 der EN 301 549, übergibt{" "}
				<code>applicability: 'wcag'</code> an <code>ruleMappedStandard</code>: Die Zusammenfassung
				einer Anforderung ist dann nur dort <code>notApplicable</code> oder <code>pass</code>, wo es
				die WCAG-Zusammenfassung ihrer Kriterien wäre, sodass beide in einem Bericht übereinstimmen.
				Eine Anforderung, die die Regeln von core nicht vollständig prüfen, ohne ein Kriterium
				wiederzugeben, trägt <code>partial: true</code> in der Anforderungstabelle: Ihre
				Zusammenfassung ist dann <code>cantTell</code>, wo alle ihre Regeln bestehen oder nichts
				finden, da sie nur einen Teil geprüft haben. Eine Norm, die ihre eigenen Zusammenfassungen
				schreibt, gibt beides im <code>meta</code> jeder Zusammenfassung an und weist Befunde in{" "}
				<code>meta.contributions</code> zu; <code>StandardRollup</code> in <code>pack.d.ts</code>{" "}
				gibt die Form vor, und die <a href={`${core}/docs/PACKS.md`}>Pack-Anleitung</a> von core auf
				GitHub führt Schritt für Schritt durch. All das braucht core 1.14.0.
			</p>

			<h3 id="rules">Regeln</h3>
			<p>
				Eine Regel hat die Form der Regelmodule von core: <code>{"{ id, meta, runInPage }"}</code>,
				und <code>applicability</code>, wenn sie nur manchmal anwendbar ist, mit demselben{" "}
				<code>ctx</code>. <code>runInPage(ctx)</code> läuft in der Seite, verwendet also nur{" "}
				<code>ctx</code>, nie eine Variable oder ein Modul von außerhalb, und liest nur: Die Regeln
				eines Packs laufen nach denen von core, und die Helfer und Optionen, die sie erhalten, sind
				schreibgeschützt. Schreibschutz ist eine Regel, keine Sandbox: Nichts hindert den Code
				einer Regel daran, mehr zu tun, laden Sie also nur Packs, denen Sie vertrauen (siehe die{" "}
				<a href={`${core}/SECURITY.md`}>Sicherheitsrichtlinie</a> von core auf GitHub). Drei
				Abkürzungen brauchen wenig oder keinen Code:{" "}
				<strong>eine Variante</strong> führt eine Regel von core mit anderen Einstellungen aus (
				<code>{"{ id, from: 'contrast-minimum', config: { normalTextRatio: 7 }, meta }"}</code>;
				ein Schwellenwert nimmt eine endliche Zahl über 0, eine Auswahl einen ihrer aufgeführten
				Werte, und <code>definePack</code> lehnt alles andere ab),{" "}
				<strong>eine Überschreibung</strong> ersetzt eine Regel von core (aufgeführt in{" "}
				<code>overrides</code> und in <code>overriddenBuiltinIds</code> der Ergebnisse), und{" "}
				<strong>eine Regel von core, wie sie ist</strong>, braucht nur ihre ID in einem Profil oder
				einer Zusammenfassung. Wie man eine Regel schreibt, steht in der{" "}
				<a href={`${core}/docs/RULE_AUTHORING.md`}>Anleitung zum Schreiben von Regeln</a> von core
				auf GitHub.
			</p>
			<p>
				Die <a href={`${core}/docs/RULE_SETTINGS.md`}>Liste der Regeleinstellungen</a> von core auf
				GitHub nennt jede Einstellung, die die Regeln von core einer Variante bieten, mit ihrem
				Standardwert, den Werten, die sie annimmt, und dem, was sie ändert;{" "}
				<code>getChecksCatalog()</code> gibt dasselbe als <code>variantSettings</code> jeder Regel
				aus. So läuft die Fassung einer Anforderung aus einer anderen Norm, oder eine Wahl, die WCAG
				der prüfenden Person überlässt, auf dem Code von core. Seit core 1.14 bietet{" "}
				<code>contrast-minimum</code> Auswahlmöglichkeiten für Text, der wie ein Logo aussieht (
				<code>logoText</code>), für eine Seite mit einem Schalter zu höherem Kontrast (
				<code>contrastSwitch</code>) und für halbfetten Text (<code>semiBold</code>), und{" "}
				<code>valid-lang</code> bietet <code>codes: 'iso639'</code> für eine Norm wie RGAA, die
				jeden Sprachcode nach ISO 639 akzeptiert.
			</p>

			<h3 id="review-steps">Wie eine Person ein <code>cantTell</code> prüft</h3>
			<p>
				Eine Regel, die einen Befund offen lassen kann, kann pro Reason-Code angeben, wie eine
				Person ihn beantwortet, wie es die Regeln von core tun (siehe{" "}
				<a href="/results-reports/output-schema/#how-to-check">„So prüfen Sie es“</a> im
				Ausgabeschema): einige Schritte, ausgehend von dem Element, das der Befund nennt, und dann,
				was sie sieht, wenn er besteht und wenn er fehlschlägt.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"meta.review = {",
					"  GENERIC_LINK_NAME: {",
					"    steps: ['Find the link the report names.', 'Read the text around it.'],",
					"    passWhen: 'The text around the link says where it goes.',",
					"    failWhen: 'Nothing near the link says where it goes, which fails WCAG 2.4.4.'",
					"  }",
					"};",
				]}
			/>
			<p>
				<code>definePack</code> prüft die Form: 1 bis 6 Schritte und ein nicht leeres{" "}
				<code>passWhen</code> und <code>failWhen</code> pro Reason-Code. Eine Regel, die ihre
				Reason-Codes in <code>meta.reasonCodes</code> angibt (<code>['GENERIC_LINK_NAME']</code>),
				gibt nur für einen Code Schritte an, den sie dort angibt oder in ihrem{" "}
				<code>runInPage</code> nennt, sodass ein vertippter Code abgelehnt wird: Sie anzugeben lohnt
				sich für diese Prüfung. Die Schritte sind englisch, gleich in welcher Locale der Scan läuft,
				und bleiben außerhalb der Seite: <code>runDomRulesInPage</code> mit{" "}
				<code>engineOptions.packs</code> fügt sie dem Ergebnis hinzu, und bei einem Ergebnis aus
				einer Seite tut es <code>{"addHowToCheck(result, { packs })"}</code>. Eine Variante hat die
				Schritte ihrer Regel von core, übersetzt, und braucht daher keine; eine Überschreibung hat,
				wie eine eigene Regel, keine. Ab core 1.14.0.
			</p>

			<h3 id="messages">Meldungen und Sprachen</h3>
			<p>
				Jeder Text, den eine Regel zeigt, hat einen Schlüssel, pro Locale in{" "}
				<code>i18n/&lt;locale&gt;.json</code> abgelegt und in den <code>dictionaries</code> des
				Packs aufgeführt. Ein Scan mit <code>engineOptions.locale: 'fr'</code> zeigt die
				französischen; eine Locale, für die das Pack kein Wörterbuch hat, zeigt Englisch. Die
				Schlüssel eines Packs sind seine eigenen und beginnen mit seinem Namensraum: Ein Pack kann
				keine Meldung von core in einer Locale ändern, die core mitliefert.
			</p>

			<h3 id="test-lint-document">Testen, linten und dokumentieren</h3>
			<ul>
				<li>
					<strong>Tests</strong> verwenden <code>@surea11y/core/testing</code>, das, was die eigenen
					Regeltests von core verwenden: <code>runa11yCoreOnHtml(html, {"{ engineOptions }"})</code>{" "}
					scannt HTML in jsdom, und <code>assertRule(result, ruleId, outcome)</code> prüft eine
					Regel. Mit Packs führt der Scan sie sowohl aus den Pack-Objekten aus als auch so, wie eine
					Seite sie hat, sodass eine Regel, die eine Variable von außerhalb ihrer Funktion liest, an
					ihrem Test scheitert. Dafür ist jsdom als Dev-Dependency nötig.
				</li>
				<li>
					<strong>Prüfungen</strong>: <code>definePack</code> wirft einen Fehler, der jedes Problem
					nennt, sodass die eigenen Tests des Packs fehlschlagen; <code>checkPack(pack)</code> gibt
					dieselbe Liste zurück, ohne zu werfen, und prüft dabei auch die installierte Version von
					core. Beide führen die eigenen Prüfungen einer Norm für ihre Tabellen (
					<code>validate</code>) gegen die Regeln von core und des Packs aus, wie es ein Scan tut,
					sodass eine Version ohne ihr <code>wcagVersion</code> oder ein Befund, der einer in der
					Tabelle fehlenden Anforderung zugewiesen ist, schon dort abgelehnt wird, statt dass jeder
					Scan das Pack überspringt. Ab core 1.14.0.
				</li>
				<li>
					<strong>Lint</strong> (<code>npm run lint</code>, <code>@surea11y/core/eslint-plugin</code>)
					misst die Regeln des Packs an denselben Lint-Regeln wie die von core.
				</li>
				<li>
					<strong>Docs</strong> (<code>npm run docs</code>, <code>surea11y-pack docs</code>)
					schreiben <code>docs/RULE_CATALOG.md</code> des Packs und führen jedes Beispiel aus seinem{" "}
					<code>docs/RULE_EXAMPLES.md</code> in Chromium aus (<code>CHROMIUM_EXECUTABLE_PATH</code>{" "}
					nennt einen anderen Chromium-Build); <code>--check</code> schlägt fehl,
					wenn eines davon veraltet ist, für die CI des Packs.
				</li>
			</ul>

			<h3 id="publish">Veröffentlichen</h3>
			<p>
				Das erzeugte Paket ist <code>private</code>. Wählen Sie seine Lizenz, setzen Sie{" "}
				<code>license</code> und entfernen Sie <code>private</code> in <code>package.json</code>, und
				führen Sie <code>npm publish</code> aus. Behalten Sie <code>@surea11y/core</code> als Peer
				Dependency, mit dem Bereich aus <code>core</code>. Semver deckt ab, worauf ein Pack aufbaut:
				Ein für core 1.11 geschriebenes Pack funktioniert mit späteren 1.x-Versionen weiter. Für Ihre
				eigenen Nutzenden sind die ID einer Regel und ihre Reason-Codes das, was deren Baselines
				enthalten: Benennen Sie eine davon nur in einer Major-Version des Packs um oder entfernen Sie
				sie nur dann.
			</p>
			<p>
				Die vollständige Anleitung, von einem leeren Ordner bis zu einem veröffentlichten Pack, ist{" "}
				<a href={`${core}/docs/PACKS.md`}>
					<code>PACKS.md</code>
				</a>{" "}
				von core auf GitHub, und jedes Feld steht in der Pack-Referenz von{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md#packs--rules-and-standards-from-outside-core`}>
					<code>ENGINE_OPTIONS.md</code>
				</a>
				.
			</p>
		</>
	);
}
