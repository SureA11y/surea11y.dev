import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Ajouter des vérifications d’accessibilité aux tests Playwright", install: <code>@surea11y/playwright</code> },
	{ id: "puppeteer", want: "…Puppeteer", install: <code>@surea11y/puppeteer</code> },
	{ id: "selenium", want: "…Selenium", install: <code>@surea11y/selenium</code> },
	{ id: "cypress", want: "…Cypress", install: <code>@surea11y/cypress</code> },
	{ id: "webdriverio", want: "…WebdriverIO", install: <code>@surea11y/webdriverio</code> },
	{ id: "cli", want: "Analyser du HTML statique depuis un terminal ou un pipeline de CI", install: <code>@surea11y/cli</code> },
	{ id: "test-matchers", want: "Vérifier l’accessibilité dans des tests unitaires ou de composants Jest/Vitest", install: <code>@surea11y/test-matchers</code> },
	{ id: "core", want: "Exécuter le moteur sur un DOM dont je dispose déjà", install: <code>@surea11y/core</code> },
];

export function OverviewLead() {
	return (
		<>
			<p>
				<a href="https://github.com/SureA11y/core">@surea11y/core</a> est un <strong>moteur de tests d’accessibilité</strong> que vous exécutez dans votre
				propre suite de tests, dans votre pipeline de CI ou en ligne de commande.
			</p>
			<p>
				Ce qui le distingue, c’est ce qu’il fait des cas que les tests automatisés ne peuvent pas
				trancher. Il implémente le format ouvert du W3C,{" "}
				<a href="https://www.w3.org/TR/act-rules-format/">
					<span lang="en">Accessibility Conformance Testing (ACT) Rules Format</span>
				</a>
				, et il est vérifié sur le corpus de tests publié par ACT plutôt que jugé uniquement à
				l’aune de ses propres tests. Il rapporte ce qu’il trouve, ce qu’il ne trouve pas et, chose
				rare, ce dont il n’est pas certain, de sorte que ses résultats sont vérifiables plutôt que
				rassurants.
			</p>
			<p>
				<em><span lang="en">Sure</span></em>, c’est la certitude sur ce que l’on sait, et l’honnêteté sur ce que l’on ne
				sait pas. Il vous dit ce qu’il ne peut pas vous dire.
			</p>
		</>
	);
}

export function OverviewContent() {
	return (
		<>
			<h2>Pas un produit unique</h2>
			<p>
				surea11y est une famille de paquets qui partagent un même moteur, et non un outil unique
				avec une seule commande d’installation. Installez celui qui correspond à votre façon de
				tester actuelle ; chacun installe <code>@surea11y/core</code> pour vous :
			</p>
			<DataTable
				label="Quel paquet installer"
				rowKey="id"
				columns={[
					{ key: "want", label: "Je veux…", wrap: true },
					{ key: "install", label: "Installer", width: "26%" },
				]}
				rows={packageRows}
			/>
			<p>
				Voir <a href="/getting-started/">Premiers pas</a> pour l’installation et l’utilisation de
				chaque binding.
			</p>

			<h2>En quoi ses résultats diffèrent</h2>
			<p>
				Chaque règle prend une décision déterministe, à partir d’un vocabulaire fixe de quatre
				résultats, et non selon la structure <code>violations</code>/<code>passes</code>/<code>incomplete</code>/
				<code>inapplicable</code> qu’utilisent d’autres outils de test d’accessibilité répandus :
			</p>
			<ul className="outcome-list">
				<li>
					<ResultBadge lang="en" state="fail" /> (<code>fail</code>) : une violation démontrable à partir du
					DOM. Réservé aux cas objectifs et normatifs.
				</li>
				<li>
					<ResultBadge lang="en" state="pass" /> (<code>pass</code>) : la condition précise de cette règle est
					remplie.{" "}
					<strong>Cela ne signifie pas que la page est accessible.</strong>
				</li>
				<li>
					<ResultBadge lang="en" state="unknown" /> (<code>cantTell</code>) : une personne doit trancher, et le
					résultat indique ce qui était ambigu.
				</li>
				<li>
					<ResultBadge lang="en" state="na" /> (<code>notApplicable</code>) : la condition préalable de la
					règle n’est pas présente.
				</li>
			</ul>
			<p>
				<code>cantTell</code> est la raison d’être du projet. Un moteur qui écarte discrètement ce
				qu’il ne peut pas déterminer <strong>produit un rapport plus court et une fausse impression
				de couverture</strong>. Voir{" "}
				<a href="/results-reports/output-schema/">Résultats et rapports</a> pour la structure
				complète du résultat, et <a href="/conformance/wcag-mapping/">Conformité</a> pour la façon
				dont les résultats individuels s’agrègent en un verdict WCAG, y compris la façon dont une
				version WCAG cible (2.0/2.1/2.2) est déterminée et appliquée.
			</p>

			<h3 id="checked-against-the-act-corpus">Vérifié sur le corpus ACT</h3>
			<p>
				Le moteur comprend {rules.length} règles. Cinquante-neuf d’entre elles ont un équivalent
				dans les <a href="https://act-rules.github.io/"><span lang="en">W3C ACT Rules</span></a> et sont exécutées sur les
				cas de test publiés par ACT : 821 exemples répartis sur ces 59 règles. Le moteur ne renvoie{" "}
				<code>fail</code> sur aucun des exemples qu’ACT marque comme réussis ou inapplicables ; il ne produit donc
				aucun faux positif sur ce corpus. Trente exemples qu’ACT marque en échec ne sont pas
				signalés, pour la plupart des questions de jugement, comme savoir si un titre décrit le
				contenu qui le suit ; voir{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a> pour
				chacun d’eux, avec le raisonnement.
			</p>
			<p>
				Le <a href="https://surea11y.github.io/act-report/act-report.jsonld">
					rapport d’implémentation EARL
				</a>{" "}
				consigne le résultat de chacun de ces cas, réussites et résultats inapplicables compris :
				une règle restée muette parce que rien ne s’appliquait se distingue ainsi d’une règle qui
				n’est pas implémentée du tout. Voir <a href="/results-reports/earl-report/">Rapport EARL</a>{" "}
				pour le format.
			</p>

			<h2>Principes clés</h2>
			<ul>
				<li><strong>Exécution déterministe.</strong> Une même entrée produit toujours la même sortie.</li>
				<li><strong>Prudent par conception.</strong> <code>fail</code> est réservé aux violations objectives et normatives, ce qui limite les fausses alertes.</li>
				<li><strong>Traçabilité vers les normes.</strong> Les règles sont associées au critère de succès WCAG applicable chaque fois que c’est pertinent.</li>
				<li><strong>Sortie stable et lisible par machine.</strong> Les identifiants de règle restent les mêmes quelle que soit la langue.</li>
				<li><strong>Indépendant du framework.</strong> S’exécute dans jsdom ou dans n’importe quel framework d’automatisation de navigateur.</li>
				<li><strong>Extensible.</strong> Ajoutez des règles personnalisées, enregistrez des politiques et filtrez les analyses par ID de règle, tag ou version WCAG.</li>
				<li><strong>Rapports localisés.</strong> Les messages lisibles par un humain peuvent être traduits sans toucher aux données lisibles par machine ; <code>en</code>, <code>fr</code>, <code>de</code>, <code>es</code> et <code>ja</code> sont fournis aujourd’hui.</li>
			</ul>

			<h2>Philosophie</h2>
			<blockquote>
				Automatiser ce qui peut être déterminé objectivement. Ne jamais prétendre automatiser ce qui ne peut pas l’être.
			</blockquote>
			<p>
				Certaines exigences des WCAG peuvent être vérifiées avec une certitude totale. D’autres
				demandent un jugement humain, une connaissance du contexte ou une évaluation de
				l’utilisabilité. Un score unique ou un verdict réussi/échoué gomme cette différence ;
				surea11y la rapporte. C’est pour cela que <code>cantTell</code> et{" "}
				<code>notApplicable</code> existent en tant que résultats, et cela détermine chaque règle
				du moteur.
			</p>

			<h3>Ce que surea11y ne détectera pas</h3>
			<p>Être explicite sur les limites de l’automatisation fait partie de la même philosophie. Par exemple, surea11y ne pourra pas :</p>
			<ul>
				<li>confirmer qu’un texte alternatif a du <em>sens</em>, seulement qu’il est présent (un attribut alt valant <code>"image123.png"</code> passe la vérification objective) ;</li>
				<li>juger si un choix de contraste de couleurs est esthétiquement approprié, seulement s’il atteint le rapport de contraste applicable ;</li>
				<li>déterminer si un message d’erreur <em>explique</em> réellement le problème, car cela dépend d’une logique de validation qu’une analyse statique ne voit pas ;</li>
				<li>détecter un piège au clavier ou un contenu rogné à un zoom de 400 %, car les deux exigent de simuler une véritable interaction utilisateur dans le temps, et pas seulement de lire le DOM à un instant donné.</li>
			</ul>
			<p>
				Ce sont les cas où le moteur renvoie <code>cantTell</code>, et où le jugement d’une
				personne chargée de la revue reste nécessaire. Voir{" "}
				<a href="/help/known-limitations/">Limites connues</a> pour la liste complète.
			</p>
		</>
	);
}

export function OverviewAbout() {
	return (
		<section className="stewardship" aria-labelledby="about-the-project">
			<h2 id="about-the-project" className="stewardship-label">À propos du projet</h2>
			<p className="stewardship-lead">
				surea11y est un projet <span className="stewardship-nowrap">open source</span> indépendant, développé de manière ouverte.
			</p>
			<p className="stewardship-body">
				<code>@surea11y/core</code> et tous les paquets d’intégration sont publiés sur{" "}
				<a href="https://www.npmjs.com/org/surea11y">npm</a>. Les tickets, les discussions et les
				modifications se font publiquement sur <a href="https://github.com/SureA11y">GitHub</a>, et
				les contributions sont bienvenues. Voir{" "}
				<a href="https://github.com/SureA11y/core/blob/main/CONTRIBUTING.md">
					<code>CONTRIBUTING.md</code>
				</a>{" "}
				pour les règles de contribution.
			</p>
			<div className="stewardship-byline">
				<p className="stewardship-credit">
					<span className="stewardship-credit-label">Créé et actuellement maintenu par</span>{" "}
					<span className="stewardship-name">Jorge Rumoroso</span>
				</p>
				<p className="stewardship-role">
					Spécialiste de l’accessibilité numérique, avec une expérience professionnelle de l’audit
					d’accessibilité, des normes et de la gouvernance.
				</p>
				<p className="stewardship-link">
					<a href="https://www.linkedin.com/in/jorgerumoroso/">Profil LinkedIn</a>
				</p>
			</div>
		</section>
	);
}
