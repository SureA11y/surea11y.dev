import React from "react";
import { Callout } from "./design-system/feedback/Callout.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const choiceRows = [
	{
		need: "Analyser une vraie application web",
		recommended: <a href="/getting-started/playwright/">Playwright</a>,
		reason: "Pilote un vrai navigateur via une intégration que les suites de tests modernes utilisent déjà, donc les résultats reflètent la mise en page et le rendu réels.",
	},
	{
		need: "Analyser du HTML statique",
		recommended: <a href="/getting-started/cli/">CLI</a>,
		reason: (
			<>
				Aucune intégration à écrire : une seule commande sur des fichiers, des URL, un sitemap ou
				une étape de CI ; avec <code>--browser</code>, elle analyse aussi les pages rendues par leur
				JavaScript.
			</>
		),
	},
	{
		need: "Vous utilisez déjà Cypress, Selenium, Puppeteer ou WebdriverIO",
		recommended: "Le binding correspondant",
		reason: "S’intègre directement à l’environnement de test que vous avez déjà.",
	},
	{
		need: "Tests unitaires ou de composants",
		recommended: <a href="/getting-started/test-matchers/">test-matchers</a>,
		reason: "Intégration directe avec Jest/Vitest sur jsdom.",
	},
	{
		need: "Votre propre intégration, ou un accès direct au moteur",
		recommended: <a href="/getting-started/standalone/"><code>@surea11y/core</code></a>,
		reason: "Contrôle maximal sur l’exécution et les résultats.",
	},
];

export function GettingStartedContent() {
	return (
		<>
			<h2>Installation</h2>
			<p>
				Il n’y a pas de commande d’installation unique : surea11y est un moteur central accompagné
				d’une famille de bindings publiés séparément, donc le ou les paquets à installer dépendent
				de la façon dont vous exécutez déjà vos tests ou vos scripts. Choisissez votre stack :
			</p>
			<Callout tone="note" title="Vous ne savez pas par où commencer ?">
				<p>
					Utilisez <a href="/getting-started/playwright/">Playwright</a> pour analyser une vraie
					application web, ou la <a href="/getting-started/cli/">CLI</a> pour vérifier du HTML
					statique depuis un terminal ou un pipeline de CI.
				</p>
			</Callout>
			<DataTable
				label="Quelle option choisir"
				rowKey="need"
				columns={[
					{ key: "need", label: "Besoin", wrap: true },
					{ key: "recommended", label: "Option recommandée" },
					{ key: "reason", label: "Raison", wrap: true },
				]}
				rows={choiceRows}
			/>

			<h2>Un exemple en 5 minutes</h2>
			<p>
				La CLI est le moyen le plus rapide de voir un vrai résultat : pas de navigateur à configurer,
				pas de framework de test. Analysez une page minimale :
			</p>
			<CodeBlock lang="html" lines={[
				"<html lang=\"en\">",
				"  <body>",
				"    <main>",
				"      <h1>Welcome</h1>",
				"      <p style=\"color: #999999; background-color: #ffffff;\">This text has low contrast.</p>",
				"      <a href=\"/details\">Click here</a>",
				"    </main>",
				"  </body>",
				"</html>",
			]} />
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
				]}
			/>
			<CodeBlock
				lines={[
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.14.1",
					"  pass: 14   fail: 3   cantTell: 2   notApplicable: 126",
					"",
					"  occurrences by tier: fail: 3   cantTell: 2",
					"  needs review: likely fail: 0   likely pass: 0   needs a person: 2",
					"",
					"FAIL (3 rule(s)):",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 7:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 7:1.",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 4.5:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 4.5:1.",
					"",
					"  page-title-present  (serious, 1 fail occurrence(s))",
					"    - head > title",
					"      This page has no <title> element.",
					"      hint: Add a <title> that says what the page is about or what it is for.",
					"",
					"cantTell — needs human review (2 rule(s)): link-name-quality,",
					"manual-review",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.4.3 Contrast: minimum; 1.4.6 Contrast: enhanced; 2.4.2 Page",
					"             titled",
					"  cantTell   1.1.1 Non-text content: text alternatives; 1.2.1 Audio-only",
					"             and video-only (prerecorded): transcript; 1.2.2 Captions",
					"             (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of",
					"             Color; 1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images",
					"             of Text; 1.4.12 Text Spacing; 2.1.1 Keyboard; 2.1.3 Keyboard",
					"             (No Exception); 2.2.1 Timing Adjustable; 2.2.2 Pause, Stop,",
					"             Hide; 2.2.4 Interruptions; 2.4.1 Bypass Blocks; 2.4.3 Focus",
					"             order; 2.4.4 Link Purpose (In Context); 2.4.6 Headings and",
					"             Labels; 2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only);",
					"             2.5.8 Target size: minimum; 3.1.1 Language of page; 3.1.2",
					"             Language of Parts; 3.2.5 Change on Request; 3.3.1 Error",
					"             Identification; 3.3.2 Labels or Instructions; 3.3.8",
					"             Accessible Authentication (Minimum); 4.1.2 Name, role, value:",
					"             accessible name; 4.1.2 Name, role, value: ARIA validity;",
					"             4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in",
					"  it, not that the page conforms.",
				]}
			/>
			<p>
				Deux problèmes dont le moteur est certain, qui donnent donc <code>fail</code> : le texte à
				faible contraste, en échec aux seuils AA et AAA, et l’absence de{" "}
				<code>&lt;title&gt;</code>. Puis une liste <code>cantTell</code> à examiner par une personne
				(« <span lang="en">Click here</span> » est-il un bon nom de lien, y a-t-il ici quelque
				chose qui demande un examen manuel) ; la ligne <code>needs review</code> indique qu’aucune
				des deux questions ne penche d’un côté, si bien que toutes deux demandent une personne.
				Parmi les 126 résultats <code>notApplicable</code> figure <code>target-size-minimum</code> :
				cette règle ne peut pas s’exécuter sans une vraie mise en page CSS, dont une analyse de
				HTML statique ne dispose pas (<code>--browser</code> la lui donne).
			</p>
			<p>
				Le dernier bloc présente le même résultat par critère WCAG 2.2 : 1.4.3, 1.4.6 et 2.4.2
				donnent <code>fail</code> ; tous les autres critères vérifiés par l’analyse sont{" "}
				<code>cantTell</code>, laissés à une personne ; et les 2 sans rien à juger sont seulement
				comptés. Aucun n’apparaît en <code>pass</code> : depuis <code>@surea11y/core</code> 1.14,
				un critère ne réussit que si ses règles vérifient tout ce qu’il demande, et aucun ne le
				fait encore, si bien que, lorsqu’elles réussissent toutes, le reste revient à une personne.
				Voir <a href="/results-reports/output-schema/">Résultats et rapports</a> pour la
				signification de chaque champ d’un résultat complet.
			</p>
			<ul>
				<li>
					<strong>Tests de bout en bout, qui pilotent un navigateur réel ou headless :</strong>{" "}
					<a href="/getting-started/cypress/">Cypress</a>,{" "}
					<a href="/getting-started/playwright/">Playwright</a>,{" "}
					<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
					<a href="/getting-started/selenium/">Selenium</a> ou{" "}
					<a href="/getting-started/webdriverio/">WebdriverIO</a>.
				</li>
				<li>
					<strong>Tests unitaires et de composants, sur jsdom :</strong>{" "}
					<a href="/getting-started/test-matchers/">test-matchers</a>, pour Jest ou Vitest.
				</li>
				<li>
					<strong>Des pages depuis un terminal ou un pipeline de CI, en HTML statique ou dans un navigateur :</strong> la{" "}
					<a href="/getting-started/cli/">CLI</a>.
				</li>
				<li>
					<strong>Sans framework de test ni étape de build :</strong>{" "}
					<a href="/getting-started/standalone/">autonome</a>, en installant directement{" "}
					<code>@surea11y/core</code> ou en intégrant le bundle navigateur.
				</li>
			</ul>

			<h2>Utilisation</h2>
			<p>
				Quelle que soit la façon dont vous lancez une analyse (jsdom, un vrai navigateur, n’importe
				quel binding, la CLI), elle renvoie la même structure de résultat native :{" "}
				<code>checksResults</code> (une entrée par règle, y compris chaque{" "}
				<code>pass</code>/<code>notApplicable</code>, et non une liste « violations uniquement »)
				et <code>rulesResults</code> (les agrégations par critère de succès WCAG). Ce{" "}
				<strong>n’est pas</strong> la structure{" "}
				<code>violations</code>/<code>passes</code>/<code>incomplete</code>/<code>inapplicable</code>{" "}
				utilisée par d’autres outils de test d’accessibilité répandus : les noms de méthodes de
				chaque binding reprennent les conventions courantes du domaine pour faciliter la migration,
				mais le schéma de résultat, plus riche, est conservé tel quel. Voir{" "}
				<a href="/results-reports/output-schema/">Résultats et rapports</a> pour le schéma complet.
			</p>
		</>
	);
}
