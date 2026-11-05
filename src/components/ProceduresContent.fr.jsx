import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const toolRows = [
	{ id: "keyboard", tool: <code>keyboard</code>, what: "Un clavier" },
	{ id: "pointer", tool: <code>pointer</code>, what: "Une souris ou un autre dispositif de pointage" },
	{ id: "screen-reader", tool: <code>screen-reader</code>, what: "Un lecteur d’écran" },
	{ id: "zoom", tool: <code>zoom</code>, what: "Le zoom du navigateur" },
	{ id: "contrast-theme", tool: <code>contrast-theme</code>, what: "Un thème à contraste élevé (couleurs forcées)" },
	{ id: "devtools", tool: <code>devtools</code>, what: "Les outils de développement du navigateur" },
];

const functionRows = [
	{ id: "proceduresFor", fn: <code>proceduresFor(requirement, options)</code>, what: <>Une exigence : un critère WCAG (<code>'1.4.12'</code>), <code>'best-practice'</code>, ou une exigence d’un pack.</> },
	{ id: "listProcedures", fn: <code>listProcedures(options)</code>, what: "Toutes les exigences d’une norme, dans leur ordre, avec les groupes où elle les range (les principes et les règles des WCAG)." },
	{ id: "procedureChecklist", fn: <code>procedureChecklist(options)</code>, what: "Ce qu’une personne fait pour évaluer la norme, une seule fois chaque chose : un élément par procédure générale." },
	{ id: "renderProcedures", fn: <code>renderProcedures(input, options)</code>, what: "N’importe lequel des trois sous forme de page HTML autonome, ou de Markdown." },
	{ id: "relatedRequirements", fn: <code>relatedRequirements(requirement, options)</code>, what: "Entre les WCAG et la norme d’un pack : les exigences qui reprennent un critère ou s’y rattachent, et l’inverse." },
	{ id: "procedureLanguages", fn: <code>procedureLanguages(options)</code>, what: "Les langues dans lesquelles on peut lire les procédures d’une norme, complètes ou non, pour un sélecteur de langue." },
];

const listOptionRows = [
	{ id: "standard", option: <code>standard</code>, what: <><code>'wcag'</code> (par défaut), <code>'best-practice'</code>, ou la norme d’un pack, par sa clé ou son nom.</> },
	{ id: "version", option: <code>version</code>, what: <>Celle des WCAG (<code>'2.0'</code>, <code>'2.1'</code>, <code>'2.2'</code>, par défaut), ou celle de la norme du pack.</> },
	{ id: "levels", option: <code>levels</code>, what: <>WCAG uniquement : <code>'A'</code>, <code>'AA'</code>, <code>'AAA'</code> ou une liste de niveaux ; tous les niveaux par défaut.</> },
	{ id: "locale", option: <code>locale</code>, what: <>Un tag (<code>'fr-CA'</code> lit <code>fr-ca</code>, puis <code>fr</code>) ou une liste, la plus souhaitée en premier ; l’anglais pour tout texte absent d’une langue.</> },
	{ id: "tools", option: <code>tools</code>, what: <>Uniquement les facettes dont la procédure demande l’un de ces outils (<code>'screen-reader'</code>).</> },
	{ id: "automation", option: <code>automation</code>, what: <>Uniquement les facettes que les règles tranchent entièrement, en partie ou pas du tout : <code>['manual', 'partial']</code> correspond à ce qu’une analyse laisse à une personne.</> },
	{ id: "rules", option: <code>rules</code>, what: <>Uniquement les facettes que revendique l’une de ces règles (<code>'img-alt-present'</code>).</> },
	{ id: "packs", option: <code>packs</code>, what: "Les packs dont lire la norme ou les règles." },
];

const renderOptionRows = [
	{ id: "format", option: <code>format</code>, what: <><code>'html'</code> (par défaut) ou <code>'markdown'</code>.</> },
	{ id: "locale", option: <code>locale</code>, what: "La langue des mots propres à la page ; par défaut, celle dans laquelle les procédures ont été lues." },
	{ id: "title", option: <code>title</code>, what: <>Le titre et l’intitulé de la page ; par défaut, un titre qui nomme la norme (« WCAG 2.2 : liste de vérification manuelle »).</> },
	{ id: "variants", option: <code>variants</code>, what: <><code>true</code> ajoute, sous chaque facette d’une liste, les étapes qu’indique pour elle le constat non tranché d’une analyse, dans un bloc repliable fermé.</> },
	{ id: "record", option: <code>record</code>, what: <><code>false</code> retire d’une page de liste de contrôle ses résultats et son script.</> },
	{ id: "before", option: <code>before</code>, what: <><code>false</code> retire « Avant de commencer », les habitudes qui rendent un résultat fiable.</> },
	{ id: "fragment", option: <code>fragment</code>, what: <><code>true</code> donne le contenu seul, sans document, style ni script, à insérer dans une page à vous.</> },
	{ id: "packs", option: <code>packs</code>, what: "Les packs avec lesquels les procédures ont été lues." },
];

export function ProceduresContent() {
	return (
		<>
			<p>
				Une analyse tranche ce que les règles peuvent trancher. Le reste d’une évaluation revient à
				une personne : les questions qu’une analyse laisse ouvertes (<code>cantTell</code>), et les
				parties d’un critère qu’aucune règle ne teste. Depuis <code>@surea11y/core</code> 1.15.0,
				core indique aussi comment faire cette partie : une <strong>procédure de test</strong> pour
				chaque facette de chaque critère WCAG qu’évaluent ses règles, et des bonnes pratiques, avec
				les étapes, les outils nécessaires, et ce qui réussit et ce qui échoue, en anglais,
				français, allemand, espagnol et japonais. C’est le même texte que celui d’où vient le{" "}
				<a href="/results-reports/output-schema/#how-to-check">« Comment vérifier »</a> d’un
				constat : les vérifications manuelles d’une équipe et ses analyses disent donc la même chose.
			</p>
			<p>
				Utilisez-les sans aucune analyse, pour un audit manuel ; à côté d’une analyse, pour ce
				qu’elle laisse à une personne ; ou pour expliquer un critère dont les règles n’ont rien
				trouvé mais ne couvrent pas tout. Comme les étapes d’un constat, les procédures sont une
				aide, pas une partie de l’identité d’un constat : leur formulation peut s’améliorer dans
				n’importe quelle version.
			</p>

			<h2 id="see-them">Les voir</h2>
			<p>
				Ces deux pages sont la sortie de core lui-même pour WCAG 2.2 niveaux A et AA, régénérée à
				chaque version que suit ce site, et s’ouvrent depuis le disque sans rien charger d’ailleurs :
			</p>
			<ul>
				<li>
					<a href="/procedures/wcag-22-aa.html">La référence</a> : comment évaluer chaque critère,
					facette par facette, sous les principes et les règles des WCAG.
				</li>
				<li>
					<a href="/procedures/wcag-22-aa-checklist.html">La liste de travail</a> : chaque
					vérification une seule fois, avec un résultat (<em>Non vérifié</em>, <em>Conforme</em>,{" "}
					<em>Non conforme</em>, <em>Non applicable</em>) et des remarques à noter, conservés dans
					votre navigateur et téléchargeables en JSON ou en CSV.
				</li>
			</ul>
			<p>
				Les deux pages sont soumises aux propres règles de core, dans jsdom et dans Chromium, en
				mode clair et sombre, avec le profil WCAG 2.2 AA : un lien d’évitement, un niveau de titre à
				la fois, des régions nommées, de vraies listes et de vrais fieldsets, un focus visible, rien
				qui ne repose sur la seule couleur, un thème à couleurs forcées respecté, la largeur d’un
				téléphone, et une mise en page imprimable.
			</p>

			<h2 id="what-a-procedure-is">Ce qu’est une procédure</h2>
			<p>
				Un critère a des <strong>facettes</strong>, les objectifs de test qu’une personne vérifie
				pour l’évaluer. Une facette qu’une règle tranche est <code>full</code>, une dont les règles
				tranchent une partie est <code>partial</code>, et une que seule une personne peut juger est{" "}
				<code>manual</code>. Une facette a une <strong>procédure générale</strong> : les étapes
				qu’une personne suit sur une page entière, dans un navigateur avec ses outils de
				développement, un clavier et, quand c’est important, un lecteur d’écran ; puis ce qu’elle
				constate si cela réussit et si cela échoue, en nommant le critère non respecté ; et les{" "}
				<strong>outils</strong> nécessaires en plus d’un navigateur :
			</p>
			<DataTable
				label="Outils dont une procédure peut avoir besoin"
				rowKey="id"
				columns={[
					{ key: "tool", label: "Outil", width: "30%" },
					{ key: "what", label: "Ce que c’est", wrap: true },
				]}
				rows={toolRows}
			/>
			<ul>
				<li>
					Une <strong>facette de technologie</strong> est un test qu’une règle fait sur un type
					d’élément (un <code>&lt;img&gt;</code> a un attribut <code>alt</code>). Elle n’a pas de
					procédure propre : <code>coveredBy</code> nomme la facette plus large dont la procédure
					l’évalue, pour qu’une liste de contrôle indique ce que fait une personne, une seule fois.
				</li>
				<li>
					Une <strong>variante</strong> est la question plus étroite qu’une règle pose sur un
					élément : les étapes que son constat non tranché affiche dans <code>howToCheck</code>. Un
					constat affiche toujours sa variante, jamais le texte général, et les deux ne se
					contredisent jamais. Chaque code de raison qu’une règle de core peut rapporter en{" "}
					<code>cantTell</code> se trouve sous exactement une facette.
				</li>
				<li>
					Ce qu’aucun critère n’exige est tenu à part, sous <code>best-practice</code>, pour que les
					procédures d’un critère ne présentent jamais un conseil comme un échec.
				</li>
			</ul>

			<h2 id="which-criteria-have-procedures">Quels critères ont des procédures</h2>
			<p>
				Chaque critère qu’une règle de core évalue, entièrement, en partie ou en{" "}
				<code>cantTell</code>, a une procédure pour chaque facette, y compris les facettes qu’aucune
				règle ne vérifie, puisqu’une personne en a besoin pour terminer ce que l’analyse a
				commencé : 36 des 87 critères des WCAG 2.2 aux niveaux A, AA et AAA et 4.1.1 (retiré en 2.2),
				avec 170 facettes, 56 procédures propres et 114 facettes de technologie couvertes par l’une
				d’elles. Un tel critère est <code>complete</code>. Les 51 autres critères, qu’aucune règle
				n’évalue (1.2.3 Audiodescription ou version de remplacement pour un média temporel, par
				exemple), sont listés avec leurs facettes et sans procédure : comment les évaluer à la main
				sort du champ de core. Les bonnes pratiques en ont une pour chacune de leurs 13 facettes :
				landmarks, contenu dans les landmarks, titres, balisage des tableaux, rôles ARIA, ordre du
				focus, touches d’accès rapide, liens d’évitement, noms et libellés, zoom, noms répétés,
				nouvelles fenêtres et téléchargements, et réduction des animations.
			</p>

			<h2 id="reading-them">Les lire</h2>
			<DataTable
				label="Fonctions des procédures"
				rowKey="id"
				columns={[
					{ key: "fn", label: "Fonction", width: "38%", wrap: true },
					{ key: "what", label: "Ce qu’elle donne", wrap: true },
				]}
				rows={functionRows}
			/>
			<p>
				Dans Node, elles viennent de <code>@surea11y/core</code>, qui lit les dictionnaires sur le
				disque. Du code qui s’exécute dans un navigateur importe les mêmes depuis{" "}
				<code>@surea11y/core/procedures</code>, avec un suffixe <code>From</code> (
				<code>proceduresFrom</code>, <code>listProceduresFrom</code>,{" "}
				<code>procedureChecklistFrom</code>, <code>renderProceduresFrom</code>,{" "}
				<code>procedureLanguagesFrom</code>), et passe les dictionnaires qu’il importe depuis{" "}
				<code>{"@surea11y/core/procedures/<locale>"}</code> : il n’a besoin d’aucun système de
				fichiers et n’atteint aucune des règles.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { proceduresFor } = require('@surea11y/core');",
					"",
					"proceduresFor('1.4.12', { locale: 'fr' });",
					"// { standard: 'wcag', id: '1.4.12', title: 'Espacement du texte', level: 'AA', complete: true,",
					"//   rules: ['avoid-inline-spacing', 'text-spacing-content-loss'], facets: [ … ] }",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"import { proceduresFrom } from '@surea11y/core/procedures';",
					"import en from '@surea11y/core/procedures/en';",
					"import fr from '@surea11y/core/procedures/fr';",
					"",
					"proceduresFrom({ en, fr }, '1.4.12', { locale: 'fr' });",
				]}
			/>
			<p>
				Chaque facette porte son <code>label</code>, son <code>automation</code>, les{" "}
				<code>rules</code> qui la revendiquent, ses <code>tools</code>, sa <code>procedure</code> (
				<code>{"{ steps, passWhen, failWhen }"}</code>, ou <code>null</code> pour une facette de
				technologie, avec <code>coveredBy</code>) et ses <code>variants</code>, chacune exactement
				le <code>howToCheck</code> du constat de cette règle pour ce code. Un texte dans une autre
				langue que celle lue (le titre propre d’une version antérieure des WCAG, comme
				« <span lang="en">Parsing</span> » de la 2.1 pour 4.1.1, ou un texte absent d’une langue)
				indique laquelle, pour qu’un outil puisse le marquer avec <code>lang</code>, comme le
				demande le critère WCAG 3.1.2. Le fichier{" "}
				<a href={`${core}/docs/PROCEDURES.md#the-shape`}><code>PROCEDURES.md</code></a> de core sur
				GitHub décrit la structure complète.
			</p>

			<h2 id="listing-them">Les lister</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures } = require('@surea11y/core');",
					"",
					"listProcedures();                                         // WCAG 2.2, every level",
					"listProcedures({ version: '2.1', levels: ['A', 'AA'] });  // WCAG 2.1 A and AA",
					"listProcedures({ standard: 'best-practice' });",
					"listProcedures({ levels: ['A', 'AA'], automation: ['manual', 'partial'] }); // what a scan leaves",
				]}
			/>
			<DataTable
				label="Options de listProcedures et procedureChecklist"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "what", label: "Effet", wrap: true },
				]}
				rows={listOptionRows}
			/>
			<p>
				Les critères des WCAG sont ceux que contient la version, à ses niveaux : les versions 2.0
				et 2.1 listent 4.1.1 comme critère de niveau A intitulé « Analyse syntaxique », la 2.2 non.
				Avec plusieurs filtres, une facette doit correspondre à chacun ; le <code>complete</code>{" "}
				d’une exigence reste le sien.
			</p>

			<h2 id="a-checklist">Une liste de contrôle</h2>
			<p>
				<code>procedureChecklist</code> prend les mêmes options et donne ce qu’une personne fait
				pour évaluer la norme, une seule fois chaque chose : un élément par procédure générale,
				avec dans <code>covers</code> les facettes de technologie qu’il évalue aussi, et dans{" "}
				<code>rules</code> les règles qui l’appuient.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { procedureChecklist } = require('@surea11y/core');",
					"",
					"procedureChecklist({ levels: ['A', 'AA'] }).items[0];",
					"// {",
					"//   key: '1.1.1/text-alternative-mechanism',",
					"//   label: 'Non-text content that conveys something has a text alternative',",
					"//   automation: 'partial',",
					"//   wcag: '1.1.1',",
					"//   requirements: ['1.1.1'],",
					"//   covers: ['img-alt-attr-present', 'role-img-text-alternative-present', …],",
					"//   rules: ['img-alt-present', …],",
					"//   tools: [{ id: 'devtools', label: \"The browser's developer tools\" }],",
					"//   procedure: { steps: ['…'], passWhen: '…', failWhen: '… which fails WCAG 1.1.1.' }",
					"// }",
				]}
			/>

			<h2 id="rendering-them">Pages et listes de travail</h2>
			<p>
				<code>renderProcedures</code> transforme ce que donnent <code>listProcedures</code>,{" "}
				<code>procedureChecklist</code> ou <code>proceduresFor</code> en un document qu’une personne
				lit ou parcourt pas à pas : une page HTML autonome, qui s’ouvre depuis le disque sans
				serveur, réseau, police ni script venus d’ailleurs, ou du Markdown. Les mêmes données et
				options donnent toujours la même page.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures, procedureChecklist, renderProcedures } = require('@surea11y/core');",
					"const fs = require('node:fs');",
					"",
					"// A reference: how to assess every WCAG 2.2 A and AA criterion.",
					"fs.writeFileSync('wcag-22-aa.html', renderProcedures(listProcedures({ levels: ['A', 'AA'] })));",
					"",
					"// A worksheet: each check once, with a result and notes to record.",
					"fs.writeFileSync('wcag-22-aa-checklist.html', renderProcedures(procedureChecklist({ levels: ['A', 'AA'] })));",
					"",
					"// The same in Markdown, for a repository or a wiki.",
					"fs.writeFileSync('wcag-22-aa.md', renderProcedures(listProcedures({ levels: ['A', 'AA'] }), { format: 'markdown' }));",
				]}
			/>
			<DataTable
				label="Options de renderProcedures"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "what", label: "Effet", wrap: true },
				]}
				rows={renderOptionRows}
			/>
			<p>
				<strong>La page d’une liste</strong> est une référence pour la norme : son titre et sa
				portée, ce que signifient ses résultats (les bonnes pratiques ne comptent pour aucune
				conformité, le niveau AAA est indicatif), « Avant de commencer », une table des matières, et
				chaque exigence avec ses facettes : ce que chacune vérifie, quelle part en tranchent les
				règles, les outils, les étapes, ce qui réussit et ce qui échoue, et les règles qui la testent.
			</p>
			<p>
				<strong>La page d’une liste de contrôle</strong> est une liste de travail. Sous chaque
				élément, une personne note un résultat et des remarques ; la page compte les résultats
				dans un message d’état qu’annonce un lecteur d’écran, les conserve dans le navigateur (
				<code>localStorage</code>, avec pour clé la norme, la version et le titre), et les télécharge
				en JSON, avec le résultat de chaque exigence agrégé à partir de ses éléments, ou en CSV,
				qu’un tableur ouvre avec ses accents. Une exigence échoue quand l’un de ses éléments
				échoue, est <code>open</code> quand l’un n’est pas encore vérifié, est{" "}
				<code>notApplicable</code> quand aucun ne s’applique, et réussit sinon.
			</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "title": "WCAG 2.2: manual checklist",',
					'  "standard": "wcag",',
					'  "version": "2.2",',
					'  "items": [',
					"    {",
					'      "key": "1.1.1/text-alternative-mechanism",',
					'      "requirements": ["1.1.1"],',
					'      "outcome": "fail",',
					'      "notes": "The logo has no alt."',
					"    }",
					"  ],",
					'  "requirements": [{ "id": "1.1.1", "outcome": "fail" }]',
					"}",
				]}
			/>
			<p>
				Les mots propres à une page existent dans chaque langue que fournit core, tout comme les
				procédures, les libellés des facettes et les principes, règles et critères des WCAG, avec
				les noms que leur donne la traduction publiée des WCAG dans chaque langue. Ce qui est dans
				une autre langue que celle de la page est marqué comme tel, pour qu’un lecteur d’écran lise
				chaque partie dans sa langue. <code>fragment: true</code> donne le contenu seul, dans une{" "}
				<code>{'<div class="surea11y-procedures">'}</code> avec ses titres à partir de{" "}
				<code>h1</code>, pour un site de documentation qui apporte ses propres styles.
			</p>

			<h2 id="from-the-cli">Depuis la CLI</h2>
			<p>
				<a href="/getting-started/cli/#manual-checks"><code>@surea11y/cli</code></a> 1.5.0 écrit les
				mêmes pages sans code : <code>surea11y procedures</code> sans analyse, et{" "}
				<code>--manual-checks</code> à côté d’une analyse, pour les vérifications qu’elle laisse à
				une personne.
			</p>
			<CodeBlock
				lines={[
					"# How to assess every WCAG 2.2 A and AA criterion, or a worksheet for a manual audit",
					{ text: "surea11y procedures --wcag-level AA -o wcag-22-aa.html", command: true },
					{ text: 'surea11y procedures --wcag-level AA --checklist --title "Audit: example.com" -o audit.html', command: true },
					"",
					"# The checks a scan leaves to a person, as a worksheet next to its report",
					{ text: "surea11y scan https://example.com/ --wcag 2.2 --html report.html --manual-checks manual-checks.html", command: true },
				]}
			/>

			<h2 id="in-the-html-report">Dans le rapport HTML</h2>
			<p>
				Le <a href="/results-reports/html-report/">rapport HTML</a> a une section « Ce qui reste à
				vérifier par une personne » : chaque exigence de la norme analysée qui a une vérification
				qu’aucune règle ne tranche entièrement, avec à côté son résultat dans l’analyse et, repliées
				en dessous, ces vérifications avec leurs étapes. Une exigence dont toutes les règles
				réussissent n’est satisfaite que si ses vérifications réussissent aussi, et le rapport le
				dit. <code>{"renderHtmlReport(result, { manualChecks: false })"}</code> retire la section.
			</p>

			<h2 id="uses">Usages</h2>
			<p>
				<strong>Un audit manuel, sans analyse.</strong> Une personne chargée de l’audit parcourt la
				liste de travail de la norme visée, note chaque résultat et chaque remarque, et
				télécharge le JSON pour le rapport :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const checklist = procedureChecklist({ version: '2.2', levels: ['A', 'AA'] });",
					"fs.writeFileSync('audit-worksheet.html', renderProcedures(checklist, { title: 'Accessibility audit: example.com' }));",
				]}
			/>
			<p>
				<strong>Une pièce jointe d’une exécution de tests.</strong> Un test Playwright qui analyse
				une page peut joindre les vérifications que ses règles ne tranchent pas, pour qu’elles
				figurent à côté de l’analyse dans le rapport de tests :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('home page', async ({ page }, testInfo) => {",
					"  // ... scan the page ...",
					"  const left = procedureChecklist({ levels: ['A', 'AA'], automation: ['manual', 'partial'] });",
					"  await testInfo.attach('manual-checks.html', {",
					"    body: renderProcedures(left, { record: false }),",
					"    contentType: 'text/html'",
					"  });",
					"});",
				]}
			/>
			<p>
				<strong>Une séance avec une personne qui utilise un lecteur d’écran.</strong> Uniquement ce
				qui demande un lecteur d’écran, pour une séance avec quelqu’un qui en utilise un tous les
				jours :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const sr = listProcedures({ levels: ['A', 'AA'], tools: 'screen-reader' });",
					"fs.writeFileSync('screen-reader-session.html', renderProcedures(sr, { title: 'Screen reader session' }));",
				]}
			/>
			<p>
				<strong>Documentation.</strong> Un fichier Markdown par norme dans un site de documentation
				ou un dépôt, régénéré à chaque mise à jour de core, pour qu’une équipe lise les mêmes
				procédures que celles qu’utilisent ses outils. <strong>Un critère, là où il le faut :</strong>{" "}
				un outil qui affiche un constat peut montrer comment évaluer tout son critère, avec{" "}
				<code>{"renderProcedures(proceduresFor('1.4.12', { locale: 'de' }), { fragment: true })"}</code>.
			</p>

			<h2 id="a-packs-standard">La norme d’un pack</h2>
			<p>
				La norme d’un <a href="/configuration/packs/#procedures">pack</a> peut indiquer comment une
				personne évalue ses propres exigences, et chaque fonction ci-dessus la lit quand on lui
				donne les packs : avec ses propres numéros et groupes, dans sa propre langue quand elle en
				déclare une. Une exigence qui reprend un critère WCAG prend les procédures de ce critère,
				lues comme celles de l’exigence (« ce qui ne respecte pas EN 301 549 9.1.4.3 »).
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"proceduresFor('9.1.4.3', { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' });",
					"relatedRequirements('1.4.3', { packs: [en301549] });",
					"// [{ standard: 'EN 301 549', id: '9.1.4.3', version: 'V4.1.1', relation: 'restates', … }]",
					"",
					"const options = { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' };",
					"fs.writeFileSync('en-301-549.html', renderProcedures(procedureChecklist(options), { packs: [en301549] }));",
				]}
			/>
			<p>
				Le <a href="/configuration/packs/#en-301-549-pack">pack EN 301 549</a> 1.2.0 fournit des
				procédures pour chaque clause du chapitre 9 dont une règle de core évalue le critère, en
				cinq langues, et le <a href="/configuration/packs/#wai-aria-pack">pack WAI-ARIA</a> fournit
				une liste de contrôle pour chacune de ses exigences, avec la liste complète des rôles, états
				et valeurs valides. Un pack qui ne fournit pas de procédures ne change rien : celles des
				WCAG sont les mêmes avec lui que sans lui.
			</p>
		</>
	);
}
