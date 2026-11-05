import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "https://github.com/SureA11y/pack-en301549#readme";
const ariaPack = "https://github.com/SureA11y/pack-wai-aria";
const aria = "https://www.w3.org/TR/wai-aria-1.2/";

const ariaRequirementRows = [
	{ id: "name-required", req: <code>name-required</code>, title: <a href={`${aria}#namecalculation`}>Les rôles qui exigent un nom accessible en ont un</a> },
	{ id: "roles", req: <code>roles</code>, title: <a href={`${aria}#roles`}>Les rôles sont concrets et actuels</a> },
	{ id: "required-states", req: <code>required-states</code>, title: <a href={`${aria}#requiredState`}>Les états et propriétés requis sont présents</a> },
	{ id: "supported-attributes", req: <code>supported-attributes</code>, title: <a href={`${aria}#supportedState`}>Les états et propriétés sont pris en charge par le rôle</a> },
	{ id: "prohibited-attributes", req: <code>prohibited-attributes</code>, title: <a href={`${aria}#prohibitedattributes`}>Les états et propriétés interdits sont absents</a> },
	{ id: "attribute-values", req: <code>attribute-values</code>, title: <a href={`${aria}#propcharacteristic_value`}>Les états et propriétés ont des valeurs valides</a> },
	{ id: "owned-elements", req: <code>owned-elements</code>, title: <a href={`${aria}#mustContain`}>Les conteneurs possèdent les éléments qu’exige leur rôle, chacun avec un seul propriétaire</a> },
	{ id: "context-roles", req: <code>context-roles</code>, title: <a href={`${aria}#scope`}>Les éléments sont dans le contexte qu’exige leur rôle</a> },
];

const procedureFormRows = [
	{ id: "restates", form: <code>{"{ wcag: '1.1.1' }"}</code>, means: "Elle reprend un critère WCAG, et prend les facettes, les règles et les procédures de ce critère telles quelles, dans chaque langue où core les a." },
	{ id: "replace", form: <code>{"{ wcag: '1.4.3', replace: { <facet>: { … } } }"}</code>, means: "Elle reprend un critère mais en teste une partie à sa façon : les facettes qu’elle nomme affichent sa procédure au lieu de celle de core." },
	{ id: "own", form: <code>{"{ facets: [ … ] }"}</code>, means: "Elle est propre à la norme : les objectifs de test qu’une personne vérifie, chacun avec sa procédure." },
	{ id: "note", form: <code>{"{ note: '…' }"}</code>, means: "Elle n’a rien à évaluer, comme une clause qu’une version laisse vide : elle est listée avec sa note, pour qu’une personne qui la cherche apprenne pourquoi." },
];

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
		have: "La politique d’accessibilité d’une organisation : « WCAG 2.2 AA, plus ces règles, moins celle-là, avec ces points dans notre rapport »",
		kind: <><strong>liste de contrôle</strong> (<code>checklist</code>)</>,
		holds: "Des profils qui choisissent parmi les règles de core et les vôtres, et des agrégations qui sont les points de la liste de contrôle.",
	},
	{
		id: "standard",
		have: "Une norme qui a ses propres exigences (une norme nationale comme le RGAA, celle d’un secteur) : des exigences numérotées, chacune vérifiée par certaines règles",
		kind: <><strong>norme</strong> (<code>standard</code>)</>,
		holds: "Un tableau d’exigences, les règles qui vérifient chaque exigence, un résultat par exigence, et des profils.",
	},
	{
		id: "rules",
		have: "Quelques règles à ajouter à chaque analyse, sans profil",
		kind: "règles seules",
		holds: "Des règles, et des variantes ou des surcharges de celles de core. Partez d’une liste de contrôle et supprimez ses profils et ses agrégations.",
	},
];

const fileRows = [
	{ id: "index", file: <code>index.js</code>, what: <>Le pack, écrit avec <code>definePack()</code> de <code>@surea11y/core/pack</code>.</> },
	{ id: "auto", file: <code>rules/automatic/&lt;ns&gt;-link-text-specific.js</code>, what: "Une règle qui tranche, à l’aide des helpers de core." },
	{ id: "variant", file: <code>rules/automatic/&lt;ns&gt;-contrast-enhanced.js</code>, what: <>Une variante de <code>contrast-minimum</code> de core à 7:1.</> },
	{ id: "manual", file: <code>rules/manual/&lt;ns&gt;-new-window-review.js</code>, what: <>Une règle manuelle qui demande une revue humaine, avec ses codes de raison et les étapes qu’une personne suit pour y répondre (<code>meta.reasonCodes</code>, <code>meta.review</code>).</> },
	{ id: "i18n", file: <code>i18n/en.json</code>, what: "Les messages." },
	{ id: "tests", file: <><code>tests/rules/*.test.js</code>, <code>tests/profiles.test.js</code></>, what: "Un test par règle, et ce qu’exécute chaque profil." },
	{ id: "examples", file: <code>docs/RULE_EXAMPLES.md</code>, what: "Des exemples des résultats de chaque règle." },
	{ id: "eslint", file: <code>eslint.config.js</code>, what: "Les règles de lint de core pour les règles." },
	{ id: "standard", file: <><code>requirements.js</code>, <code>rule-map.js</code></>, what: "Norme seulement : les exigences et les règles qui vérifient chacune d’elles." },
	{ id: "procedures", file: <><code>procedures.js</code>, <code>tests/procedures.test.js</code></>, what: "Norme seulement : comment une personne évalue chaque exigence à la main, et un test qui vérifie que chaque exigence a une procédure pour chacune de ses facettes." },
	{ id: "package", file: <code>package.json</code>, what: <><code>private</code>, avec <code>@surea11y/core</code> en dépendance peer à la version qui l’a écrit (<code>^1.15.0</code>), et eslint, jsdom et Playwright en dépendances de développement.</> },
	{ id: "readme", file: <><code>README.md</code>, <code>.gitignore</code></>, what: "Le guide du pack lui-même sur ces fichiers, et ce que git laisse de côté." },
];

const profileFieldRows = [
	{ id: "tags", field: <code>tags</code>, what: <>Les règles qui portent l’un de ces tags. <code>wcagTags(version, levels)</code> de <code>@surea11y/core/pack</code> donne les tags WCAG de core (<code>wcagTags('2.1')</code> correspond à 2.0 et 2.1, A et AA).</> },
	{ id: "rules", field: <code>rules</code>, what: <>Des règles par identifiant, de core ou du pack : une règle de bonnes pratiques qu’aucun tag WCAG ne sélectionne, ou, avec <code>tags: []</code>, les règles de core qu’exécute le profil en plus de celles du pack.</> },
	{ id: "exclude", field: <code>exclude</code>, what: <><code>{"{ rules: [...] }"}</code> écarte des règles de l’analyse ; <code>{"{ criteria: ['2.5.8'] }"}</code> dispense de ces critères : leurs agrégations disparaissent, ainsi que chaque règle dont tous les critères sont dispensés ; une règle qui vérifie aussi un critère que le profil conserve s’exécute toujours. Cela restreint ce que l’analyse vérifie : les exigences de WCAG restent les mêmes.</> },
	{ id: "severity", field: <code>severity</code>, what: <><code>{"{ ruleId: level }"}</code> : une autre gravité sous le profil. Les résultats l’affichent et gardent celle de la règle dans <code>ruleSeverity</code> ; les baselines et les identifiants de constats ne changent pas.</> },
	{ id: "wcagVersion", field: <code>wcagVersion</code>, what: <><code>'2.0'</code>, <code>'2.1'</code> ou <code>'2.2'</code> : la version de WCAG selon laquelle les analyses du profil sont jugées (<code>engine.wcagVersion</code>). Sans elle, les tags WCAG de <code>tags</code> impliquent la version, et un profil qui n’en a aucun est jugé selon 2.2. Le <code>engineOptions.wcagVersion</code> propre à une analyse l’emporte toujours. Core 1.12.0 et versions ultérieures.</> },
	{ id: "keepsParsing", field: <code>keepsParsing</code>, what: <><code>true</code> quand la norme exige le 4.1.1 Analyse syntaxique tel qu’il est écrit, comme EN 301 549 V3.2.1 : un échec à ce critère reste alors un échec avec une cible 2.0 ou 2.1. Sous un profil sans ce champ, les errata de 2023 à WCAG 2.0 et 2.1 considèrent le 4.1.1 comme satisfait pour le HTML et le XML, et <code>duplicate-id</code> pose la question à la place (en 2.2, qui a retiré le 4.1.1, il la pose quoi que dise le profil). Seul compte le champ du profil lui-même : le profil d’un pack qui prend la place d’un profil de core n’en hérite pas. <code>engineOptions.mappings</code> ne change jamais un résultat : une analyse jugée selon une norme qui conserve le 4.1.1 exécute donc son profil. Core 1.14.0 et ultérieur.</> },
	{ id: "version", field: <><code>version</code>, <code>mappedRules</code></>, what: <>Profil d’une norme seulement : la version de la norme qu’il vise, et <code>mappedRules: true</code> pour exécuter toutes les règles que la norme associe à cette version.</> },
];

export function PacksContent() {
	return (
		<>
			<p>
				Un <strong>pack</strong> apporte à <code>@surea11y/core</code> des règles, des variantes
				des règles de core, une norme ou une liste de contrôle, avec leurs profils et leurs
				messages, depuis un paquet qui lui est propre, sans fork ni build de core. Une norme
				nationale comme le RGAA peut être un pack, tout comme la politique d’accessibilité de votre
				organisation. Une analyse reçoit les packs dans <code>engineOptions.packs</code>, et les
				exécute comme elle exécute les règles et les normes propres à core : dans Node et dans un
				navigateur, depuis la CLI, les bindings et test-matchers, avec des résultats, des
				agrégations et des entrées de rapport au même format que ceux de core. Les packs
				nécessitent <code>@surea11y/core</code> 1.11.1 ou une version ultérieure. Deux packs de
				norme de la famille SureA11y sont prêts à être installés :{" "}
				<a href="#en-301-549-pack">EN 301 549</a> et <a href="#wai-aria-pack">WAI-ARIA 1.2</a>.
			</p>

			<h2 id="which-kind-of-pack">Quel type de pack</h2>
			<DataTable
				label="Types de pack"
				rowKey="id"
				columns={[
					{ key: "have", label: "Vous avez", wrap: true },
					{ key: "kind", label: "Type", width: "16%" },
					{ key: "holds", label: "Ce qu’il contient", wrap: true },
				]}
				rows={kindRows}
			/>
			<p>
				Les règles et les profils d’un pack peuvent utiliser n’importe quelle règle de core : une
				liste de contrôle ou une norme est surtout faite de règles de core, choisies et regroupées,
				plus les quelques règles que core n’a pas. Les exemples de cette page utilisent{" "}
				<code>acme-policy-pack.js</code>, le petit pack que chaque binding livre dans son dossier{" "}
				<code>examples/</code> : une règle maison, un profil de liste de contrôle (WCAG 2.2 A et
				AA, <code>region</code> et la règle maison) et deux points de liste de contrôle.{" "}
				<a href="#start-from-the-example">Son code source</a> figure plus bas.
			</p>

			<h2 id="en-301-549-pack">Le pack EN 301 549</h2>
			<p>
				<a href={pack}><code>@surea11y/pack-en301549</code></a> est un pack de norme de la
				famille SureA11y, prêt à installer : le chapitre 9 (Web) d’EN 301 549, en V3.2.1 et V4.1.1.
				Il a un profil par version, <code>en301549-v4.1.1</code> et <code>en301549-v3.2.1</code>,
				qui rapporte un résultat par clause, et <code>mappings: ['en301549']</code> pour nommer les
				clauses dans les résultats de n’importe quelle analyse, WCAG compris. Il demande{" "}
				<code>@surea11y/core</code> 1.13.0 ou ultérieur.
			</p>
			<p>
				Sa version 1.1.0, construite sur core 1.14.0, juge chaque clause comme core juge le
				critère WCAG qu’elle reprend. Aucune clause ne réussit donc encore : là où toutes ses
				règles réussissent, une clause est <code>cantTell</code>, pour qu’une personne vérifie le
				reste, comme son critère (voir{" "}
				<a href="/conformance/wcag-mapping/">Correspondance de conformité WCAG</a>). Le profil{" "}
				<code>en301549-v3.2.1</code> conserve le 4.1.1 Analyse syntaxique, si bien qu’un id dupliqué
				y fait toujours échouer la clause 9.4.1.1, et les clauses 9.1.4.5, 9.3.3.1 et 9.4.1.3 ont
				leurs premières règles (<code>image-of-text</code>, <code>invalid-field-error-message</code>,{" "}
				<code>live-region-announcements</code>). Avec core 1.13, il se comporte comme ses
				versions 1.0.
			</p>
			<p>
				Sa version 1.2.0, avec core 1.15.0 ou ultérieur, indique aussi comment une personne
				vérifie chaque clause à la main : les <a href="/conformance/procedures/">procédures</a> du
				critère WCAG qu’elle reprend, là où une règle de core l’évalue, lues comme celles de la
				clause (« ce qui ne respecte pas EN 301 549 9.1.4.3 »). Il liste les clauses dans l’ordre
				propre à la norme, sous les principes et les règles du chapitre 9, et la norme est
				traduite en français, allemand, espagnol et japonais, si bien qu’une liste ou une feuille de
				travail de ses procédures, et les titres de clause d’une analyse, sont dans ces langues de
				bout en bout. Le chapitre 9 est tout ce que couvre le pack : les autres exigences de la
				norme (les déclarations de performance fonctionnelle du chapitre 4, le chapitre 12, les
				chapitres pour ce qui n’est pas une page web) n’y ont ni règle, ni résultat, ni procédure.
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
				C’est aussi un exemple complet de norme à vous. Il n’a pas de règles : le chapitre 9 reprend
				WCAG, donc chaque clause est vérifiée par les règles de core pour son critère. Ses profils
				choisissent ces règles (<code>tags</code>, <code>mappedRules: true</code>), nomment la
				version de WCAG selon laquelle chaque version de la norme est jugée
				(<code>wcagVersion</code>) et, pour V3.2.1, conservent le 4.1.1 Analyse syntaxique (
				<code>keepsParsing</code>). Ses clauses reprennent des critères WCAG un pour un (
				<code>applicability: 'wcag'</code>), et sa table de règles est dérivée du catalogue du core installé :
				une règle que core ajoute est couverte sans changer le pack. Une norme avec des exigences
				que WCAG n’a pas suit la même forme et ajoute ses propres règles. Son code est court et
				mérite d’être lu à côté de <a href="#writing-a-pack">Écrire un pack</a>, plus bas.
			</p>
			<p>
				Core intégrait EN 301 549 jusqu’à la 1.13.0, qui la rend obsolète au profit de ce pack (voir{" "}
				<a href="/conformance/wcag-mapping/#en-301-549">la correspondance WCAG</a>). Comme tout
				profil, ceux du pack choisissent ce qui s’exécute : une déclaration de conformité demande
				toujours qu’une personne vérifie chaque clause.
			</p>

			<h2 id="wai-aria-pack">Le pack WAI-ARIA</h2>
			<p>
				<a href={ariaPack}><code>@surea11y/pack-wai-aria</code></a> est WAI-ARIA 1.2 sous forme de
				norme : un résultat par exigence d’auteur que les règles peuvent vérifier, à partir des
				règles ARIA de core jugées selon la formulation propre à WAI-ARIA. Son profil,{" "}
				<code>wai-aria-1.2</code>, exécute les règles ARIA de core et celles du pack, et rien
				d’autre. Il nécessite <code>@surea11y/core</code> 1.15.0 ou ultérieur.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// npm install @surea11y/core @surea11y/pack-wai-aria",
					"const waiAria = require('@surea11y/pack-wai-aria');",
					"",
					"runDomRulesInPage(url, null, { packs: [waiAria], profile: 'wai-aria-1.2' });",
				]}
			/>
			<p>
				<strong>Pourquoi une norme à part entière.</strong> Les règles ARIA de core sont des règles
				WCAG, et une analyse WCAG rapporte chaque violation de WAI-ARIA qu’elles trouvent, comme un
				échec WCAG ou comme une question pour une personne. Les deux peuvent diverger : un{" "}
				<code>role="grid"</code> sans nom enfreint à coup sûr l’exigence « <span lang="en">Accessible
				Name Required</span> » de WAI-ARIA, mais son échec au critère WCAG 4.1.2 dépend de ce que
				montre la page, si bien que les WCAG posent la question. Depuis core 1.15.0, une analyse
				WCAG n’échoue que là où les WCAG échouent (
				<a href="/help/faq/#results-changed-1-15">ce qui a changé</a>) ; ce pack lit les mêmes
				constats selon WAI-ARIA, où la grille échoue.
			</p>
			<DataTable
				label="Exigences de WAI-ARIA 1.2 dans le pack"
				rowKey="id"
				columns={[
					{ key: "req", label: "Exigence", width: "30%" },
					{ key: "title", label: "Titre", wrap: true },
				]}
				rows={ariaRequirementRows}
			/>
			<p>
				Chacune est un résultat, <code>{"wai-aria-1.2-<requirement>"}</code> : <code>fail</code> là
				où une règle a trouvé ce que WAI-ARIA dit qu’un auteur MUST ou MUST NOT faire, et{" "}
				<code>cantTell</code> sinon, pour un constat que WAI-ARIA se contente de déconseiller
				(SHOULD, « <span lang="en">not recommended</span> ») ou en l’absence de constat, puisque les
				règles vérifient ce que dit le balisage, pas tout ce que couvre une exigence (ce que modifie
				un script, ce que calcule un navigateur). Une exigence ne réussit jamais sur la seule foi
				des règles. En plus des règles de core, le pack en a onze à lui pour des exigences
				qu’aucune règle de core ne vérifie, faute d’impact WCAG plausible : le{" "}
				<code>aria-controls</code> d’une barre de défilement, les articles d’un flux, le contexte
				d’une légende, la fenêtre surgissante d’une liste déroulante modifiable, les éléments
				possédés d’un bouton fléché, les index de tableau, <code>aria-setsize</code>,{" "}
				<code>aria-keyshortcuts</code>, les noms de barres d’outils, les éléments de présentation,
				et <code>wai-aria-role-name-present</code>, une variante de{" "}
				<code>aria-role-name-present</code> de core qui couvre chaque rôle pour lequel WAI-ARIA
				exige un nom (application, marquee, table, tabpanel et treegrid en plus de ceux de core).
				Le texte propre du pack est en anglais.
			</p>
			<p>
				<strong>Avec les WCAG, ou une autre norme.</strong> Une analyse peut juger la page à la
				fois selon WAI-ARIA et selon les WCAG (<a href="#with-other-profiles">plus bas</a>), ou
				selon EN 301 549 et WAI-ARIA avec les deux packs :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(url, null, {",
					"  packs: [waiAria],",
					"  profile: ['wcag22-aa', 'wai-aria-1.2']",
					"});",
					"",
					"// <div role=\"group\" aria-checked=\"true\">: an attribute the role doesn't",
					"// support, a question for WCAG 4.1.2 and a failure of WAI-ARIA.",
					"const check = result.checksResults.find((c) => c.ruleId === 'aria-allowed-attr');",
					"check.verdicts;     // { 'wcag22-aa': 'cantTell', 'wai-aria-1.2': 'fail' }",
					"check.outcome;      // 'fail', the worst of them, which SARIF and JUnit gate on",
					"check.checkOutcome; // 'cantTell', the rule's own, which WCAG's criteria read",
					"",
					"result.profiles['wai-aria-1.2'].rulesResults; // this standard's results, by id",
				]}
			/>
			<p>
				Une règle qu’exécutent les deux profils est une seule vérification, avec un verdict de
				chacun. Les noms font exception : sous <code>wai-aria-1.2</code>, ils sont vérifiés par la
				variante du pack, si bien qu’un <code>role="grid"</code> sans nom donne deux vérifications,{" "}
				<code>aria-role-name-present</code> de core (<code>{"{ 'wcag22-aa': 'cantTell' }"}</code>)
				et la variante (<code>{"{ 'wai-aria-1.2': 'fail' }"}</code>).
			</p>
			<p>
				<strong>Comment une personne répond à une question.</strong> Sous{" "}
				<code>wai-aria-1.2</code>, les étapes des questions de core que pose cette norme sont dans
				les mots de WAI-ARIA et nomment ce que le constat a trouvé (« <span lang="en">When the page
				was scanned, the element it controls had role dialog</span> ») ; une analyse qui exécute
				aussi un profil WCAG garde les étapes de core, qui nomment le critère WCAG.{" "}
				<code>{"proceduresFor('name-required', { packs: [waiAria], standard: 'wai-aria' })"}</code>{" "}
				donne la liste de contrôle de chaque exigence, avec la liste complète des rôles, états et
				valeurs valides, tirée des tableaux de la Recommandation. Le fichier{" "}
				<code>docs/COVERAGE.md</code> du pack liste chaque exigence d’auteur de WAI-ARIA 1.2 qu’une
				règle peut vérifier à partir du balisage, un cas par rôle, état ou propriété, et ce que le
				profil conclut de chacun.
			</p>
			<p>
				C’est aussi l’exemple complet d’une norme qui est certaine là où les WCAG posent la
				question : <code>rule-map.js</code> liste, pour chacune des règles ARIA de core, ce que
				signifie chaque code de raison selon WAI-ARIA, avec <code>outcome: 'fail'</code> pour un
				MUST (voir{" "}
				<a href="#sending-findings-to-requirements">Envoyer des constats vers des exigences</a>).
			</p>

			<h2 id="using-a-pack">Utiliser un pack</h2>

			<h3 id="from-node">Depuis Node</h3>
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
				Le pack est préparé une fois et conservé pour la prochaine analyse avec le même objet pack :
				un crawl qui passe les mêmes packs à chaque page ne les prépare donc qu’une fois. {" "}
				<code>definePack</code> fige l’objet pack : traitez-le comme immuable, et réutilisez le
				même objet d’une analyse à l’autre. Passer un pack l’enregistre pour l’analyse ; cela ne
				sélectionne pas ses règles. Une règle de pack qui porte le tag de l’espace de noms du pack
				est optionnelle : sans l’un des profils du pack, elle ne s’exécute que si elle est
				sélectionnée par identifiant ou par ce tag (voir <a href="#names">Noms</a>). Une règle de
				pack sans ce tag est sélectionnée comme les règles de core, si bien qu’une analyse par
				défaut avec le pack l’exécute. Ajoutez{" "}
				<code>{"runOnly: { bestPractices: true }"}</code> à côté du profil pour exécuter aussi les
				bonnes pratiques.
			</p>

			<h3 id="with-a-browser-binding">Avec un binding navigateur</h3>
			<p>
				Playwright, Puppeteer, Selenium et WebdriverIO acceptent l’objet pack dans{" "}
				<code>.withPacks()</code>, et l’enregistrent dans la page, ainsi que dans chaque frame avec{" "}
				<code>.frames(true)</code>, avant l’analyse :
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
				Passez un tableau, ou appelez de nouveau <code>.withPacks()</code>, pour analyser avec
				plusieurs packs. Les bindings partagent <code>.withPacks()</code>, mais chaque builder
				prend son propre objet de pilotage (<code>{"{ page }"}</code>, <code>{"{ driver }"}</code>{" "}
				ou <code>{"{ browser }"}</code>) et demande sa propre mise en place : voir{" "}
				<a href="/getting-started/playwright/">Playwright</a>,{" "}
				<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
				<a href="/getting-started/selenium/">Selenium</a> et{" "}
				<a href="/getting-started/webdriverio/">WebdriverIO</a>.
			</p>

			<h3 id="with-cypress">Avec Cypress</h3>
			<p>
				Un pack se prépare dans Node, et un test Cypress s’exécute dans le navigateur. Dans
				Cypress, <code>.withPacks()</code> prend donc le nom de module de chaque pack (un nom de
				paquet, ou un chemin depuis la racine du projet), et le plugin du binding prépare le pack
				dans Node. Enregistrez le plugin une fois :
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
				<code>.analyze()</code> demande au plugin, via <code>cy.task</code>, le script qui
				enregistre les packs, et l’exécute dans la page, ainsi que dans chaque frame de même
				origine avec <code>.frames(true)</code>. Le plugin conserve un pack pour le reste de
				l’exécution : une modification du fichier d’un pack apparaît donc au{" "}
				<code>cypress run</code> suivant, ou après un redémarrage de <code>cypress open</code>. Un
				objet pack, tel que l’acceptent les autres bindings, lève une erreur dans{" "}
				<code>.withPacks()</code> : il ne peut pas être préparé dans le navigateur.
			</p>

			<h3 id="with-the-test-matchers">Avec test-matchers</h3>
			<p>
				<code>@surea11y/test-matchers</code> analyse dans Node : un pack est donc passé sous forme
				d’objet :
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
				Gardez les objets pack en un seul endroit (un fichier de setup ou un module), pour que
				chaque test passe les mêmes. Un pack qui ne s’est pas exécuté fait échouer l’assertion.
				Voir <a href="/getting-started/test-matchers/#packs">test-matchers</a>.
			</p>

			<h3 id="from-the-cli">Depuis la CLI</h3>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				<code>--pack</code> prend un nom de paquet, résolu depuis le projet du répertoire de
				travail, ou un chemin, et se répète pour plusieurs packs. Le pack charge{" "}
				<code>@surea11y/core/pack</code>, qui est installé à côté de la CLI quand vous installez{" "}
				<code>@surea11y/cli</code> dans le projet. Voir{" "}
				<a href="/getting-started/cli/#packs">CLI</a>.
			</p>

			<h3 id="in-a-page-of-your-own">Dans votre propre page</h3>
			<p>
				Pour une extension de navigateur ou votre propre <code>page.evaluate</code>, injectez{" "}
				<code>packScript([acmePolicy])</code> de <code>@surea11y/core/pack</code> après le bundle
				navigateur de core, ou livrez un seul fichier construit avec{" "}
				<code>buildBrowserBundle({"{ packs: [acmePolicy] }"})</code>, et nommez le pack sous la
				forme <code>name@version</code>. Voir{" "}
				<a href="/getting-started/standalone/#packs-in-a-page">Autonome</a>. Pour une page qui charge ses scripts sous forme de fichiers, préférez le fichier unique de{" "}
				<code>buildBrowserBundle</code> : le script d’un pack ne s’exécute qu’avec la version de core qui l’a écrit.
			</p>
			<p>
				Une page dotée du bundle d’un autre core ignore le pack, et <code>skippedPacks</code> nomme les
				deux versions : reconstruisez donc ce fichier à chaque version de core ou du pack.
			</p>

			<h3 id="with-other-profiles">À côté d’autres profils</h3>
			<p>
				Le profil d’un pack peut s’exécuter à côté de celui des WCAG, ou de celui d’un autre pack,
				dans une même analyse : depuis core 1.15.0, <code>profile</code> accepte une liste, et
				chaque profil juge la page comme il le ferait seul (voir{" "}
				<a href="/configuration/engine-options/#several-profiles">Options du moteur</a>) :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(url, null, {",
					"  packs: [acmePolicy, en301549],",
					"  profile: ['acme-web-2026', 'en301549-v4.1.1']",
					"});",
					"result.engine.profiles; // ['acme-web-2026', 'en301549-v4.1.1']",
					"result.profiles['acme-web-2026'].rulesResults; // the policy's items, by id",
				]}
			/>
			<p>
				Un constat dont une norme est certaine là où les WCAG posent la question (
				<code>outcome: 'fail'</code> dans sa table de règles) fait échouer l’analyse, et ses{" "}
				<code>verdicts</code> disent ce que chaque profil en conclut. Un profil dont le pack est
				ignoré est listé dans <code>engine.profilesNotRun</code>, et les autres s’exécutent quand
				même. Les bindings acceptent la liste dans <code>.options({"{ profile }"})</code>,
				test-matchers dans ses options et la CLI sous la forme d’un <code>--profile</code> répété.
			</p>

			<h2 id="what-a-scan-reports">Ce que rapporte une analyse</h2>
			<ul>
				<li>
					<code>engine.packs</code> nomme chaque pack qui s’est exécuté, sous la forme{" "}
					<code>name@version</code>, et <code>engine.profile</code> le profil qui s’est appliqué.
				</li>
				<li>
					Les règles d’un pack apparaissent dans <code>checksResults</code> comme celles de core,
					avec des identifiants qui commencent par son espace de noms (<code>acme-no-autoplay</code>).
					Une règle de pack associée à un critère WCAG compte dans l’agrégation de ce critère, sauf
					si elle porte le tag optionnel de l’espace de noms du pack : ces règles vérifient ce que
					WCAG n’exige pas, et ne comptent donc que dans les agrégations propres au pack. Leur{" "}
					<code>wcagSc</code> nomme tout de même les critères WCAG qu’elles vérifient, pour les
					rapports, et aucune autre norme (EN 301 549, qui associe chaque règle par ses critères
					WCAG) ne les revendique. Une
					surcharge compte à la place de la règle de core qu’elle remplace, là où sa propre
					correspondance la place.
				</li>
				<li>
					Les points d’une liste de contrôle, ou les exigences d’une norme, sont des agrégations
					dans <code>rulesResults</code>, avec le nom de la liste de contrôle ou de la norme comme{" "}
					<code>meta.standard</code>. Le <a href="/results-reports/html-report/">rapport HTML</a>{" "}
					les affiche dans une section à part, le{" "}
					<a href="/results-reports/sarif-report/">rapport SARIF</a> attribue à chaque règle les
					tags des points auxquels elle appartient (<code>acme-images</code>), et le{" "}
					<a href="/results-reports/junit-report/">rapport JUnit</a> les liste comme propriétés. Le
					champ <code>standards</code> du résultat nomme la liste de contrôle, si bien qu’un résultat
					enregistré s’affiche de la même façon où qu’il soit rendu.
				</li>
				<li>
					La gravité définie par un profil apparaît sur les résultats qu’elle modifie, celle de la
					règle étant conservée dans <code>ruleSeverity</code>.
				</li>
				<li>
					Dans une analyse de plusieurs profils, <code>engine.profiles</code> liste ceux qui se
					sont exécutés, <code>profiles[id]</code> contient les agrégations de chacun, et les{" "}
					<code>verdicts</code> de chaque constat disent ce que chaque profil en conclut (
					<a href="/results-reports/output-schema/#several-profiles">Schéma de sortie</a>).
				</li>
				<li>
					La section « Ce qui reste à vérifier par une personne » du rapport HTML suit la norme du
					pack, sous ses propres numéros, là où l’analyse a exécuté son profil et où la norme
					fournit des <a href="#procedures">procédures</a>.
				</li>
			</ul>

			<h2 id="when-a-pack-doesnt-run">Quand un pack ne s’exécute pas</h2>
			<p>
				Un pack dont la plage <code>core</code> exclut la version de core installée, qui n’est pas
				valide, ou qui n’est pas compatible avec core (un identifiant de règle hors de son espace de
				noms, une clé de dictionnaire que core possède déjà, une variante d’une règle qui n’existe
				pas) est ignoré : l’analyse s’exécute sans lui, affiche un avertissement et le liste dans{" "}
				<code>skippedPacks</code> sous la forme <code>{"{ name, reason }"}</code>. Avec{" "}
				<code>strictOptions</code>, elle lève une erreur, avec{" "}
				<code>code: 'INVALID_ENGINE_OPTIONS'</code>, comme toute erreur dans{" "}
				<code>engineOptions.packs</code>. Deux packs en conflit (une clé de
				dictionnaire que les deux définissent, deux normes avec une même clé) lèvent une erreur,
				puisque toute façon de choisir entre eux dépendrait de l’ordre dans lequel ils ont été
				passés. Dans une page, un pack nommé dans <code>engineOptions.packs</code> qu’aucun appel à{" "}
				<code>packScript</code> n’a enregistré, ou qui a été enregistré avec une autre version de
				core, est listé de la même façon. Une analyse peut donc se terminer sans les vérifications
				pour lesquelles vous avez ajouté le pack : un outil qui dépend d’un pack devrait consulter{" "}
				<code>skippedPacks</code> avant de considérer l’analyse comme complète.
			</p>
			<p>Chaque outil transforme un pack ignoré en un échec visible :</p>
			<ul>
				<li>
					Les bindings navigateur vérifient chaque pack quand vous appelez{" "}
					<code>.withPacks()</code>, et lèvent une erreur avant l’analyse pour un pack que core ne
					peut pas exécuter. Un pack que la page n’exécute ensuite pas est une lacune{" "}
					<code>'pack-skipped'</code> dans <code>getScanGaps(results)</code>, et{" "}
					<code>.analyze()</code> l’annonce par un avertissement : un test qui vérifie les lacunes
					échoue donc.
				</li>
				<li>test-matchers fait échouer l’assertion, en nommant le pack et la raison.</li>
				<li>
					La CLI se termine avec le code <code>2</code>, sans écrire de rapport ni de baseline, pour
					un pack qu’elle ne trouve pas ou ne peut pas charger, ou que le moteur ignore.
				</li>
			</ul>
			<p>
				Installez le pack à côté de <code>@surea11y/core</code> et du paquet qui l’exécute, pour
				que les trois partagent une seule copie de core.
			</p>

			<h2 id="writing-a-pack">Écrire un pack</h2>

			<h3 id="start-from-the-example">Partir de l’exemple</h3>
			<p>
				Un pack est un objet créé avec <code>definePack</code> de <code>@surea11y/core/pack</code>.
				Voici <code>acme-policy-pack.js</code>, l’exemple que livrent les bindings :
			</p>
			<CodeBlock lang="js" lines={examplePack} />
			<p>
				Son profil, <code>acme-web-2026</code>, exécute les règles WCAG 2.2 A et AA de core, la
				règle de bonnes pratiques <code>region</code>, qu’aucun tag WCAG ne sélectionne, et la
				règle maison. Ses deux agrégations sont les points de la liste de contrôle : chacune
				regroupe des règles, de core ou du pack, en un seul résultat.
			</p>

			<p>
				Pour une norme, le <a href="#en-301-549-pack">pack EN 301 549</a> est un exemple complet
				et publié.
			</p>

			<h3 id="create-one">En créer un avec <code>surea11y-pack new</code></h3>
			<p>Pour votre propre pack, partez d’un paquet généré :</p>
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
				Le pack fonctionne tel qu’il est généré : ses tests réussissent, ses règles passent le lint
				sans erreur, ses exemples concordent avec ses règles. <code>surea11y-pack new</code> vérifie
				le pack comme le ferait une analyse avant d’écrire quoi que ce soit, et refuse un nom, un
				espace de noms ou un titre qui le rendrait invalide (un titre <code>WCAG</code> désigne sa
				norme comme l’une de celles de core), en expliquant pourquoi. Modifiez-le ensuite pas à pas, en
				lançant <code>npm test</code> au fur et à mesure. Son README présente chaque fichier :
			</p>
			<DataTable
				label="Fichiers d’un pack généré"
				rowKey="id"
				columns={[
					{ key: "file", label: "Fichier", width: "40%", wrap: true },
					{ key: "what", label: "Ce qu’il contient", wrap: true },
				]}
				rows={fileRows}
			/>

			<h3 id="names">Noms</h3>
			<ul>
				<li>
					<strong>Le nom et la version du paquet</strong> sont un nom de paquet npm et une version
					complète (<code>1.0.0</code>). Une analyse les rapporte dans <code>engine.packs</code>.
				</li>
				<li>
					<strong>L’espace de noms</strong> (<code>namespace: 'acme'</code>) sépare les
					identifiants du pack de ceux de core et des autres packs : chaque identifiant de règle,
					d’agrégation et de profil commence par lui suivi de <code>-</code>. Il ne peut pas
					être un préfixe des identifiants de règle de core (<code>img</code>,{" "}
					<code>aria</code> ou <code>link</code> le seraient, comme dans{" "}
					<code>img-alt-present</code>), ni commencer par <code>wcag</code>, et deux packs d’une même analyse ne peuvent pas le partager. C’est
					aussi le tag qui rend optionnelles les règles propres au pack : une règle qui le porte ne
					s’exécute que sous l’un des profils du pack, par son identifiant, ou par le tag (
					<code>optInRules: ['acme']</code>). Par défaut, une analyse qui vise WCAG ne l’exécute donc
					pas. Débloquer le tag avec <code>optInRules</code> ne retire pas le profil ni les filtres
					de l’analyse : sous un profil WCAG, une règle débloquée ne s’exécute que si ses tags
					correspondent aussi à ce profil.
					Omettez le tag sur une règle qui devrait s’exécuter dans chaque analyse avec le pack : elle
					est alors sélectionnée comme les règles de core, et une analyse qui vise WCAG peut
					l’exécuter et signaler ses échecs quand ses tags correspondent.
				</li>
				<li>
					<strong><code>core</code></strong> est la plage des versions de core avec lesquelles le
					pack fonctionne (<code>'^1.11.1'</code>), lue comme npm lit les plages. Faites partir les
					nouveaux packs de 1.11.1 : le paquet 1.11.0 omettait un fichier dont les packs ont besoin
					dans Node. Une analyse avec
					une version de core hors de cette plage ignore le pack, avec la raison dans{" "}
					<code>skippedPacks</code>. <code>surea11y-pack new</code> écrit la version qui a généré
					le pack (<code>^1.15.0</code>) ; gardez une plage qui commence à 1.14 si le pack utilise ce
					qu’a ajouté la 1.14 : <code>meta.review</code>, des lignes <code>reasonCodes</code> et{" "}
					<code>findings</code>, <code>meta.contributions</code>, <code>applicability</code>,{" "}
					<code>partial</code> ou <code>keepsParsing</code> ; et une qui commence à 1.15 s’il
					utilise <code>outcome: 'fail'</code>. Ce que la 1.15 lit d’autre (les procédures, les
					groupes et les traductions d’une norme, ses propres étapes de revue), une version plus
					ancienne de core l’ignore.
				</li>
				<li>
					<strong><code>title</code></strong> est le nom que les résultats et les rapports donnent
					à une liste de contrôle, et <strong><code>description</code></strong> une phrase sur ce
					que vérifie le pack, pour les outils qui laissent leurs utilisateurs choisir des packs (
					<code>describePacks</code> la renvoie).
				</li>
			</ul>

			<h3 id="profiles">Profils</h3>
			<p>
				Un profil est une sélection nommée, exécutée avec <code>engineOptions.profile</code>. Une
				règle s’exécute sous un profil quand elle porte l’un de ses <code>tags</code> ou que son
				identifiant figure dans <code>rules</code>, et qu’elle n’est pas dans <code>exclude</code> ;
				les règles du pack qui portent le tag de son espace de noms s’exécutent sous chaque profil
				du pack.
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
				label="Champs d’un profil"
				rowKey="id"
				columns={[
					{ key: "field", label: "Champ", width: "22%" },
					{ key: "what", label: "Ce qu’il fait", wrap: true },
				]}
				rows={profileFieldRows}
			/>
			<p>
				<strong>Un profil qui n’exécute que ce que demande sa norme.</strong> Le profil d’une norme
				avec <code>{"tags: [<ns>]"}</code> et <code>mappedRules: true</code> exécute les règles
				propres au pack et les règles de core que sa table associe à une exigence, et rien d’autre :
				aucune règle ne vérifie ce que la norme ne demande pas, et les résultats ne contiennent
				aucun critère WCAG. Sans tag WCAG, en revanche, rien ne dit sur quelle version de WCAG la
				norme est fondée, et l’exécution est jugée selon 2.2. Pour une norme fondée sur 2.1, c’est
				faux : l’exécution rapporte des critères de 2.2, comme le 2.5.8, que la norme n’a pas.
				Donnez la version, et <code>keepsParsing: true</code> si la norme exige toujours le 4.1.1
				Analyse syntaxique. Le{" "}
				<code>index.js</code> généré la lit dans <code>requirements.js</code>, où chaque version de
				la norme nomme la version de WCAG sur laquelle elle est fondée (
				<code>{"{ version: '1.0', wcagVersion: '2.2' }"}</code>) :
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
				Les règles de core, avec leurs identifiants et leurs tags, figurent dans le{" "}
				<a href="/rules/">catalogue des règles</a>.
			</p>

			<h3 id="checklist-items-and-requirements">Points de liste de contrôle et exigences</h3>
			<p>
				<strong>Les points d’une liste de contrôle</strong> sont ses <code>rollups</code> :{" "}
				<code>{"{ id, title, checksIds }"}</code>, chacun regroupant des règles en un seul résultat.
				Un point échoue quand l’une de ses règles échoue, et réussit quand elles réussissent.
				Quand aucune n’échoue mais que l’une renvoie <code>cantTell</code>, le point est{" "}
				<code>cantTell</code> lui aussi : il demande une revue humaine. Un pack fournit soit des{" "}
				<code>profiles</code> et des <code>rollups</code>, une liste de contrôle, soit une norme{" "}
				(<code>standard</code>), pas les deux.
			</p>
			<p>
				<strong>Les exigences d’une norme</strong> viennent de deux tableaux qu’écrit le
				générateur, <code>requirements.js</code> (par version, le numéro, la formulation et les
				critères WCAG de chaque exigence) et <code>rule-map.js</code> (les exigences que vérifie
				chaque règle, et pourquoi). <code>ruleMappedStandard()</code> de{" "}
				<code>@surea11y/core/pack</code> en fait la norme : une agrégation par exigence, les
				exigences que nomme le résultat de chaque règle, et des vérifications des deux tableaux
				quand le pack est préparé.
			</p>

			<h3 id="sending-findings-to-requirements">Envoyer des constats vers des exigences</h3>
			<p>
				La ligne d’une règle dans <code>rule-map.js</code> peut envoyer ailleurs ses constats d’un
				code de raison, avec <code>{"reasonCodes: { [code]: { requirements, outcome } }"}</code> :{" "}
				<code>requirements</code> (par défaut, celles de la ligne) sont les exigences auxquelles ces
				constats comptent, <code>[]</code> pour aucune ; <code>outcome: 'cantTell'</code> fait
				d’un constat en échec une question à cet endroit, et <code>outcome: 'fail'</code> (core
				1.15.0 et ultérieur) fait d’une question un échec à cet endroit. L’agrégation d’une exigence
				juge alors la règle sur les constats qui comptent pour elle : une norme peut ainsi poser une
				question sur une cause là où WCAG la fait échouer, être certaine d’une cause là où WCAG pose
				la question, ou classer deux causes sous deux tests :
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
				<code>outcome: 'fail'</code> sert à une norme qui est certaine là où les WCAG posent la
				question. Un <code>role="grid"</code> sans nom est <code>cantTell</code> pour les WCAG, dont
				le critère 4.1.2 dépend de ce que montre la page, mais enfreint à coup sûr l’exigence
				« <span lang="en">Accessible Name Required</span> » de WAI-ARIA, comme le dit le{" "}
				<a href="#wai-aria-pack">pack WAI-ARIA</a> :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'aria-role-name-present': {",
					"  requirements: ['name-required'],",
					"  reasonCodes: { name_missing: { outcome: 'fail' } }",
					"}",
				]}
			/>
			<p>
				Il ne fait échouer que l’exigence de la norme : le résultat propre de la vérification, et
				chaque agrégation WCAG, restent tels qu’ils étaient. Ne listez que les codes que la norme
				énonce avec certitude ; un code non listé est jugé selon le résultat propre de la règle.
				Une norme qui écrit ses propres agrégations utilise l’acte <code>'fail'</code> dans{" "}
				<code>meta.contributions</code> de la même façon.
			</p>
			<p>
				Une ligne peut aussi envoyer des constats selon ce qu’ils consignent, avec{" "}
				<code>{"findings: [{ when, requirements, outcome }]"}</code> : <code>when</code> donne des
				valeurs que des champs du <code>data.details</code> d’un constat doivent avoir, nommés par
				leur chemin à points. Un constat suit la première entrée à laquelle il correspond, sinon son
				code de raison, sinon la ligne. Une norme peut ainsi classer les échecs d’une règle sous le
				test de leur taille de texte, bien qu’ils partagent un code de raison :
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
				Ne comparez que des champs qu’une règle garde stables : <code>reasonCode</code> sur toutes
				les règles, et les quelques autres que nomme la{" "}
				<a href={`${core}/docs/API_STABILITY.md`}>politique de stabilité de l’API</a> de core sur
				GitHub (dont le rapport, le seuil et la typographie de <code>contrast-minimum</code>). Un
				champ qui change ou disparaît ne correspond à rien, et le constat suit son code ou la ligne.
				Les codes de raison de chaque règle sont listés sous « What a finding reports » dans le{" "}
				<a href={`${core}/docs/RULE_CATALOG.md`}>catalogue des règles</a> de core sur GitHub.
			</p>
			<p>
				Deux autres champs changent la façon dont une exigence est jugée. Une norme dont les
				exigences reprennent des critères WCAG un pour un, comme le chapitre 9 d’EN 301 549, passe{" "}
				<code>applicability: 'wcag'</code> à <code>ruleMappedStandard</code> : l’agrégation d’une
				exigence n’est alors <code>notApplicable</code> ou <code>pass</code> que là où le serait
				l’agrégation WCAG de ses critères, si bien que les deux concordent dans un même rapport. Une
				exigence que les règles de core ne vérifient pas entièrement, sans reprendre un critère,
				porte <code>partial: true</code> dans le tableau des exigences : son agrégation est alors{" "}
				<code>cantTell</code> là où toutes ses règles réussissent ou ne trouvent rien, puisqu’elles
				n’en ont vérifié qu’une partie. Une norme qui écrit ses propres agrégations indique les deux
				dans le <code>meta</code> de chacune, et envoie les constats dans{" "}
				<code>meta.contributions</code> ; <code>StandardRollup</code> dans <code>pack.d.ts</code>{" "}
				en donne la forme, et le <a href={`${core}/docs/PACKS.md`}>guide des packs</a> de core sur
				GitHub le détaille. Tout cela demande core 1.14.0.
			</p>

			<h3 id="rules">Règles</h3>
			<p>
				Une règle a la forme des modules de règle de core : <code>{"{ id, meta, runInPage }"}</code>,
				plus <code>applicability</code> quand elle ne s’applique que dans certains cas, avec le même{" "}
				<code>ctx</code>. <code>runInPage(ctx)</code> s’exécute dans la page : elle n’utilise donc
				que <code>ctx</code>, jamais une variable ou un module extérieur, et se contente de lire :
				les règles d’un pack s’exécutent après celles de core, et les helpers et options qu’elles
				reçoivent sont en lecture seule. La lecture seule est une règle, pas un bac à sable : rien
				n’empêche le code d’une règle d’en faire davantage, alors ne chargez que des packs en
				lesquels vous avez confiance (voir la{" "}
				<a href={`${core}/SECURITY.md`}>politique de sécurité</a> de core sur GitHub). Trois
				raccourcis demandent peu ou pas de code :{" "}
				<strong>une variante</strong> exécute une règle de core avec d’autres réglages (
				<code>{"{ id, from: 'contrast-minimum', config: { normalTextRatio: 7 }, meta }"}</code> ;
				un seuil prend un nombre fini supérieur à 0, un choix l’une de ses valeurs listées, et{" "}
				<code>definePack</code> refuse tout le reste),{" "}
				<strong>une surcharge</strong> remplace une règle de core (listée dans{" "}
				<code>overrides</code>, et dans le <code>overriddenBuiltinIds</code> des résultats), et{" "}
				<strong>une règle de core telle quelle</strong> ne demande que son identifiant dans un
				profil ou une agrégation. L’écriture d’une règle est décrite dans le{" "}
				<a href={`${core}/docs/RULE_AUTHORING.md`}>guide d’écriture de règles</a> de core sur
				GitHub.
			</p>
			<p>
				La <a href={`${core}/docs/RULE_SETTINGS.md`}>liste des réglages des règles</a> de core sur
				GitHub donne chaque réglage que les règles de core offrent à une variante, avec sa valeur
				par défaut, les valeurs qu’il prend et ce qu’il change ; <code>getChecksCatalog()</code>{" "}
				donne la même chose dans le <code>variantSettings</code> de chaque règle. C’est ainsi que la
				version d’une exigence d’une autre norme, ou un choix que WCAG laisse à la personne qui
				évalue, s’exécute sur le code de core. Depuis core 1.14, <code>contrast-minimum</code>{" "}
				propose des choix pour le texte qui ressemble à un logo (<code>logoText</code>), une page
				dotée d’un bouton de passage à un contraste plus élevé (<code>contrastSwitch</code>) et le
				texte demi-gras (<code>semiBold</code>), et <code>valid-lang</code> propose{" "}
				<code>codes: 'iso639'</code> pour une norme, comme le RGAA, qui accepte tout code de langue
				ISO 639.
			</p>

			<h3 id="review-steps">Comment une personne vérifie un <code>cantTell</code></h3>
			<p>
				Une règle qui peut laisser un constat non tranché peut dire, par code de raison, comment une
				personne y répond, comme le font les règles de core (voir{" "}
				<a href="/results-reports/output-schema/#how-to-check">« Comment vérifier »</a> dans le
				schéma de sortie) : quelques étapes à partir de l’élément que nomme le constat, puis ce
				qu’elle constate si cela réussit et si cela échoue.
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
				<code>definePack</code> vérifie la forme : de 1 à 6 étapes et un <code>passWhen</code> et
				un <code>failWhen</code> non vides par code de raison. Une règle qui déclare ses codes de
				raison dans <code>meta.reasonCodes</code> (<code>['GENERIC_LINK_NAME']</code>) ne donne des
				étapes que pour un code qu’elle y déclare ou qu’elle nomme dans son <code>runInPage</code>,
				si bien qu’un code mal saisi est refusé : les déclarer vaut la peine pour cette
				vérification. Les étapes sont rédigées en anglais (les dictionnaires d’un pack peuvent les traduire,
				voir plus bas), et restent hors de la page : <code>runDomRulesInPage</code> avec{" "}
				<code>engineOptions.packs</code> les ajoute au résultat, et pour un résultat issu d’une page,
				c’est <code>{"addHowToCheck(result, { packs })"}</code>. Une variante a les étapes de sa
				règle de core, traduites, et n’en a donc besoin d’aucune ; une surcharge, comme une règle
				personnalisée, n’en a pas. Core 1.14.0 et ultérieur.
			</p>
			<p>
				Depuis core 1.15.0, les dictionnaires d’un pack peuvent traduire ses étapes (
				<a href="#messages">plus bas</a>), et une étape peut nommer ce que le constat a trouvé :{" "}
				<code>{"{{role|none}}"}</code> se lit comme le <code>role</code> du constat, tiré de ses{" "}
				<code>i18n.params</code> ou de ses <code>data.details</code>, et comme <code>none</code>{" "}
				quand il n’y a pas de constat, sur une page de procédures. <code>definePack</code> refuse
				un paramètre sans son texte.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"meta.review = {",
					"  PRESENTATIONAL_ATTRIBUTE_UNSUPPORTED: {",
					"    steps: ['Find the element the report names, and read its {{attributes|aria-* attributes}}.'],",
					"    passWhen: 'The element is only for layout, and {{attributes|the attribute}} can be removed.',",
					"    failWhen: 'The element stands for a control, which role {{role|none}} hides.'",
					"  }",
					"};",
				]}
			/>
			<p>
				Une règle indique quelles facettes d’un critère elle teste dans{" "}
				<code>meta.coverage.facetsBySc</code> (
				<code>{"{ '2.4.4': ['link-text-descriptive-evidence'] }"}</code>), et ses étapes rejoignent
				alors les <a href="/conformance/procedures/">procédures</a> de ce critère, comme celles de
				core. Une norme qui juge les règles de core par code de raison peut aussi donner ses propres
				étapes pour un code d’une règle de core, dans <code>standard.review</code> : un constat sur
				lequel seuls ses profils posent une question les lit à la place de celles de core, qui
				nomment les WCAG.
			</p>

			<h3 id="procedures">Comment une personne l’évalue : les procédures</h3>
			<p>
				Core indique comment une personne évalue à la main chaque critère WCAG qu’évaluent ses
				règles, facette par facette (voir{" "}
				<a href="/conformance/procedures/">Procédures de test</a>). Depuis core 1.15.0, un pack de
				norme fournit la même chose pour ses propres exigences, dans{" "}
				<code>standard.procedures</code>, par version et par exigence, chacune avec son{" "}
				<code>title</code>, sous l’une de quatre formes :
			</p>
			<DataTable
				label="Formes des procédures d’une exigence"
				rowKey="id"
				columns={[
					{ key: "form", label: "Forme", width: "38%", wrap: true },
					{ key: "means", label: "Ce qu’elle signifie", wrap: true },
				]}
				rows={procedureFormRows}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"standard: {",
					"  // ...",
					"  procedures: {",
					"    '1.0': {",
					"      '4.2': { title: 'Images have a text alternative', wcag: '1.1.1' },",
					"      '7.1': {",
					"        title: 'Every form has a text version',",
					"        facets: [{",
					"          id: 'text-version',",
					"          label: 'Each form can be had as a text document',",
					"          automation: 'manual',              // full, partial or manual (the default)",
					"          tools: ['keyboard'],               // keyboard, pointer, screen-reader, zoom, contrast-theme, devtools",
					"          steps: ['Find each form on the page.', 'Look next to it for a link to a text version.'],",
					"          passWhen: 'Every form has a text version.',",
					"          failWhen: 'A form has no text version, which fails {{requirement}}.'",
					"        }]",
					"      }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				Écrivez une procédure pour la page entière et pour quelqu’un sans formation en
				accessibilité : d’une à huit étapes courtes dans un navigateur, avec ses outils de
				développement, un clavier et, quand c’est important, un lecteur d’écran, puis ce que la
				personne constate si cela réussit et si cela échoue. <code>{"{{requirement}}"}</code> est
				remplacé par le nom de la norme et l’exigence comme laquelle la procédure est lue
				(« City Standard 7.1 »). <code>surea11y-pack new --kind standard</code> écrit{" "}
				<code>procedures.js</code> avec un exemple de chaque forme, et un test qui vérifie que
				chaque exigence de chaque version a une procédure pour chacune de ses facettes ; une norme
				qui reprend les WCAG un pour un obtient la première forme pour chaque exigence grâce à{" "}
				<code>ruleMappedStandard</code>.
			</p>
			<p>
				Une norme peut aussi donner des <code>groups</code> (ses thèmes ou ses chapitres, par
				version), <code>relatesTo</code> sur une exigence qui lui est propre (les critères WCAG
				auxquels elle se rattache sans les reprendre), et des <code>notes</code> (ce qu’il faut
				savoir avant d’utiliser les procédures d’une version). Son propre texte est écrit dans une
				langue, <code>lang</code>, l’anglais par défaut, et <code>translations</code> le donne dans
				d’autres, avec pour clé le texte traduit, si bien qu’une traduction ne survit jamais au
				texte à partir duquel elle a été faite. Une norme qui déclare ses langues est lue dans
				l’une d’elles de bout en bout, procédures de core comprises, si bien qu’une page ne mélange
				jamais deux langues ; <code>packTranslationCoverage(pack)</code> indique jusqu’où va chaque
				traduction. Le{" "}
				<a href={`${core}/docs/PACKS.md#how-a-person-assesses-it-procedures`}>guide des packs</a> de
				core, sur GitHub, décrit chaque champ et ce que vérifie <code>definePack</code>.
			</p>

			<h3 id="messages">Messages et langues</h3>
			<p>
				Chaque texte qu’affiche une règle a une clé, conservée par langue dans{" "}
				<code>i18n/&lt;locale&gt;.json</code> et listée dans les <code>dictionaries</code> du pack.
				Une analyse avec <code>engineOptions.locale: 'fr'</code> affiche les textes français ; dans
				une langue pour laquelle le pack n’a pas de dictionnaire, ils s’affichent en anglais. Les
				clés d’un pack lui sont propres et commencent par son espace de noms : un pack ne peut pas
				modifier un message de core dans une langue que core fournit.
			</p>
			<p>
				Depuis core 1.15.0, les étapes d’une règle se traduisent de la même façon, sous les clés
				qu’utilisent les étapes de core : le préfixe de la règle (son <code>titleKey</code> sans{" "}
				<code>_title</code>), <code>_review_</code>, le code de raison, puis{" "}
				<code>{"step<n>"}</code>, <code>pass</code> ou <code>fail</code> :
			</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_step1\": \"Trouvez le lien que le rapport désigne.\",",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_pass\": \"Le texte autour du lien dit où il mène.\",",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_fail\": \"Rien près du lien ne dit où il mène, ce qui enfreint le critère 2.4.4 des WCAG.\"",
					"}",
				]}
			/>
			<p>
				Le <code>howToCheck</code> d’un constat et les procédures les affichent dans cette langue,
				et en anglais chaque texte qui manque dans la langue. Pour une langue que core ne fournit
				pas (<code>pt</code>), le dictionnaire d’un pack peut aussi donner les clés de core, ce qui
				traduit dans cette langue les règles de core, et leurs procédures.
			</p>

			<h3 id="test-lint-document">Le tester, le linter et le documenter</h3>
			<ul>
				<li>
					<strong>Les tests</strong> utilisent <code>@surea11y/core/testing</code>, ce
					qu’utilisent les tests des règles de core :{" "}
					<code>runa11yCoreOnHtml(html, {"{ engineOptions }"})</code> analyse du HTML dans jsdom, et{" "}
					<code>assertRule(result, ruleId, outcome)</code> vérifie une règle. Avec des packs,
					l’analyse les exécute à la fois depuis les objets pack et tels qu’une page les reçoit, si
					bien qu’une règle qui lit une variable extérieure à sa fonction échoue à son test. jsdom
					doit être installé comme dépendance de développement.
				</li>
				<li>
					<strong>Les vérifications</strong> : <code>definePack</code> lève une erreur qui nomme
					chaque problème, si bien que les tests du pack lui-même échouent ;{" "}
					<code>checkPack(pack)</code> renvoie la même liste sans lever d’erreur, en vérifiant aussi
					la version de core installée. Tous deux exécutent les vérifications propres d’une norme
					sur ses tableaux (<code>validate</code>) contre les règles de core et celles du pack,
					comme une analyse, si bien qu’une version sans son <code>wcagVersion</code>, ou un constat
					envoyé vers une exigence absente du tableau, est refusé là plutôt que de faire ignorer le
					pack par chaque analyse. Core 1.14.0 et ultérieur.
				</li>
				<li>
					<strong>Le lint</strong> (<code>npm run lint</code>,{" "}
					<code>@surea11y/core/eslint-plugin</code>) soumet les règles du pack aux règles de lint
					auxquelles sont soumises celles de core.
				</li>
				<li>
					<strong>La documentation</strong> (<code>npm run docs</code>,{" "}
					<code>surea11y-pack docs</code>) écrit le <code>docs/RULE_CATALOG.md</code> du pack et
					exécute chaque exemple de son <code>docs/RULE_EXAMPLES.md</code> dans Chromium (
					<code>CHROMIUM_EXECUTABLE_PATH</code> désigne une autre version de Chromium) ;{" "}
					<code>--check</code> échoue quand l’un ou l’autre n’est plus à jour, pour la CI du pack.
				</li>
			</ul>

			<h3 id="publish">Le publier</h3>
			<p>
				Le paquet généré est <code>private</code>. Choisissez sa licence, définissez{" "}
				<code>license</code> et retirez <code>private</code> dans <code>package.json</code>, puis
				lancez <code>npm publish</code>. Gardez <code>@surea11y/core</code> comme dépendance peer,
				avec la plage indiquée dans <code>core</code>. Le semver couvre ce sur quoi s’appuie un
				pack : un pack écrit pour core 1.11 continue de fonctionner avec les versions 1.x
				ultérieures. Pour vos propres utilisateurs, l’identifiant d’une règle et ses codes de raison
				sont ce que contiennent leurs baselines : ne renommez ou ne supprimez l’un d’eux que dans
				une version majeure du pack.
			</p>
			<p>
				Le guide complet, d’un dossier vide à un pack publié, est le{" "}
				<a href={`${core}/docs/PACKS.md`}>
					<code>PACKS.md</code>
				</a>{" "}
				de core sur GitHub, et chaque champ figure dans la référence des packs de{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md#packs--rules-and-standards-from-outside-core`}>
					<code>ENGINE_OPTIONS.md</code>
				</a>
				.
			</p>
		</>
	);
}
