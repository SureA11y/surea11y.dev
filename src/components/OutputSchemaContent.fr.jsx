import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const topLevelRows = [
	{ id: "engine.tag", field: <code>engine.tag</code>, meaning: <>Le tag d’identité propre au moteur, actuellement <code>"a11ycore"</code>. Chaque règle (intégrée ou personnalisée) le porte dans <code>meta.tags</code> ; les <code>ruleId</code> des règles, eux, sont nus (sans préfixe).</> },
	{
		id: "engine.version",
		field: <code>engine.version</code>,
		meaning: (
			<>
				La version de <code>@surea11y/core</code> qui a produit le résultat, par exemple{" "}
				<code>"1.10.0"</code> : c’est elle qu’il faut citer dans un rapport de bug, et elle permet
				de distinguer des résultats de deux versions. Un résultat peut changer d’une version à
				l’autre sans que sa forme change, donc ce n’est pas <code>schemaVersion</code>. Les
				générateurs <a href="/results-reports/sarif-report/">SARIF</a> et{" "}
				<a href="/results-reports/earl-report/">EARL</a> l’utilisent comme version de l’outil
				lorsque vous n’en indiquez aucune.
			</>
		),
	},
	{
		id: "engine.schemaVersion",
		field: <code>engine.schemaVersion</code>,
		meaning: (
			<>
				La version du schéma de résultat (<code>"1.0.0"</code>). Elle change si la forme décrite
				ici évolue un jour de façon incompatible : fixez-vous dessus si vous analysez la sortie
				par programme. Voir{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> pour la liste
				complète des champs stables et instables et la politique d’incrément de version.
			</>
		),
	},
	{
		id: "engine.locale",
		field: <code>engine.locale</code>,
		meaning: (
			<>
				Le dictionnaire que l’exécution a réellement utilisé. <code>requested</code> est votre{" "}
				<code>engineOptions.locale</code> après suppression des espaces (<code>"en"</code> si vous
				n’avez rien passé ou autre chose qu’une chaîne) ; <code>resolved</code> est la locale dont
				le dictionnaire a été utilisé ; <code>reason</code> explique la correspondance entre les
				deux. Comme le repli vers une autre langue se fait en douceur et chaîne par chaîne,{" "}
				<strong>demander une langue que le build n’embarque pas produit du texte en anglais, et
				non une erreur</strong> : ce champ vous permet de le savoir sans lire les chaînes.
				Indiqué une fois par résultat : une exécution utilise un seul dictionnaire du début à la
				fin.
			</>
		),
	},
	{
		id: "engine.locale.reason",
		field: <code>engine.locale.reason</code>,
		meaning: (
			<>
				<code>"ok"</code> : vous avez obtenu le dictionnaire demandé, et il contient toutes les
				clés. <code>"primary-subtag"</code> : votre code comportait une sous-étiquette sans
				dictionnaire propre, donc sa langue de base a été utilisée : <code>"de-DE"</code> se
				résout en <code>"de"</code>. <code>"dictionary-not-loaded"</code> : le projet fournit
				cette langue, mais ce build ne l’embarque pas et aucune n’a été fournie (le bundle
				navigateur autonome, sans son fichier de langue séparé). <code>"unknown-locale"</code> :
				le projet n’a aucune traduction de ce type. <code>"partial-dictionary"</code> : le
				dictionnaire a été utilisé, mais il lui manque des clés présentes en anglais, si bien que
				ces chaînes se sont rabattues sur l’anglais. Considérez cet ensemble comme ouvert : de
				futures versions pourront le compléter.
			</>
		),
	},
	{
		id: "engine.wcagVersion",
		field: <code>engine.wcagVersion</code>,
		meaning: (
			<>
				La version de WCAG par rapport à laquelle cette exécution a testé la conformité : votre{" "}
				<code>engineOptions.wcagVersion</code>, ou ce qu’impliquaient vos tags d’origine de
				version, ou la valeur par défaut <code>"2.2"</code>. Elle n’a aujourd’hui qu’un effet :{" "}
				<strong>une règle associée uniquement au critère 4.1.1 Analyse syntaxique ne peut pas
				renvoyer <code>fail</code> avec une cible 2.2</strong> (voir{" "}
				<code>checksResults[i].wcagVersionScope</code> ci-dessous). Indiquée une fois par
				résultat : une exécution a une seule cible du début à la fin.
			</>
		),
	},
	{
		id: "engine.profile",
		field: <code>engine.profile</code>,
		meaning: (
			<>
				Présent seulement quand un <code>engineOptions.profile</code> a sélectionné les règles de
				cette exécution ; nomme le profil, en minuscules. Absent quand aucun n’a été demandé, et
				aussi quand un profil a été demandé mais ne s’est pas appliqué (nom inconnu, ou un include
				dans <code>runOnly</code> ou <code>engineOptions</code> a choisi les règles à sa place) : sa
				présence est donc ce qui confirme qu’une exécution a vraiment visé ce profil. Voir{" "}
				<a href="/configuration/engine-options/#conformance-profiles">Profils de conformité</a>.
			</>
		),
	},
	{
		id: "engine.profileExcludes",
		field: <code>engine.profileExcludes</code>,
		meaning: (
			<>
				Présent seulement quand le profil appliqué écarte des règles :{" "}
				<code>{"{ rules, criteria }"}</code>, les règles qu’il nomme et les critères WCAG dont il
				dispense. Leurs règles et agrégations WCAG ne se sont pas exécutées. Aucun profil intégré
				n’écarte quoi que ce soit.
			</>
		),
	},
	{
		id: "engine.optInRules",
		field: <code>engine.optInRules</code>,
		meaning: (
			<>
				Présent seulement quand <code>engineOptions.optInRules</code> a exécuté au moins une règle
				optionnelle que le reste de la sélection n’aurait pas exécutée. Liste leurs tags. Sa
				présence signifie que le résultat inclut des règles pour des exigences au-delà de la norme
				visée : un échec peut donc ne pas être un échec WCAG. Voir{" "}
				<a href="/configuration/engine-options/#running-every-rule-optinrules">Exécuter toutes les règles</a>.
			</>
		),
	},
	{
		id: "engine.mappings",
		field: <code>engine.mappings</code>,
		meaning: (
			<>
				Présent seulement quand l’exécution nomme une norme autre que WCAG dans{" "}
				<code>meta.normativeMappings</code>, via <code>engineOptions.mappings</code> ou le profil
				d’une norme. Les liste sous forme canonique : <code>"en301549"</code> pour toutes les
				versions, <code>"en301549:V3.2.1"</code> pour une seule. Son absence signifie que chaque
				résultat ne nomme que WCAG. Voir{" "}
				<a href="/configuration/engine-options/#other-standards-mappings">Autres normes</a>.
			</>
		),
	},
	{
		id: "engine.environment",
		field: <code>engine.environment</code>,
		meaning: (
			<>
				Les conditions dans lesquelles la page a été rendue, lues sur la page au début de
				l’analyse, avant l’exécution de toute règle. Les règles qui mesurent la mise en page,
				comme{" "}
				<a href="/rules/text-spacing-content-loss/">
					<code>text-spacing-content-loss</code>
				</a>
				, peuvent donner un autre résultat pour le même balisage à une autre largeur de viewport
				ou pendant que des polices web sont encore en cours de chargement : c’est donc ce dont
				vous avez besoin pour reproduire une exécution. <code>layout</code> indique si la page
				avait une mise en page : <code>false</code> dans jsdom et les autres émulateurs de DOM, et
				c’est alors le seul champ. Dans un navigateur, <code>viewport</code> vaut{" "}
				<code>innerWidth</code>/<code>innerHeight</code> en pixels CSS,{" "}
				<code>devicePixelRatio</code> celui de la page (le zoom du navigateur s’y reflète aussi),{" "}
				<code>colorScheme</code> ce à quoi correspond <code>prefers-color-scheme</code>, et{" "}
				<code>fonts</code> vaut <code>"loading"</code> tant qu’une des polices de la page est
				encore en cours de chargement, <code>"loaded"</code> sinon. Un champ que la page ne peut
				pas fournir est omis. Lire ces valeurs n’ajoute aucun non-déterminisme : comme le DOM, ce
				sont des entrées. Pour des résultats comparables d’une exécution à l’autre, attendez{" "}
				<code>document.fonts.ready</code> avant d’analyser. <code>images</code> vaut{" "}
				<code>"loading"</code> tant qu’une image est encore en cours de chargement,{" "}
				<code>"loaded"</code> sinon : une image qui arrive plus tard peut déplacer ce que les règles
				de mise en page ont mesuré, donc pour des résultats comparables, analysez après l’événement{" "}
				<code>load</code> de la page. Une image avec <code>loading="lazy"</code> est ignorée,
				puisqu’elle attend que le lecteur fasse défiler la page. <code>animationsSettled</code> est
				le nombre d’animations et de transitions en cours que l’analyse a figées : pour l’analyse,
				une animation finie (un fondu d’apparition) est lue à sa fin et une animation qui se répète
				indéfiniment (un texte défilant, un indicateur de chargement) à son début, et chacune est
				remise exactement où elle était ensuite, si bien qu’une page analysée pendant un fondu
				d’apparition donne le même résultat qu’une page analysée après. Le navigateur n’affiche
				jamais l’état figé, puisque l’analyse est une seule tâche synchrone. Chaque frame d’un{" "}
				<a href="#cross-frame-result">résultat multi-frames</a> porte le sien.
			</>
		),
	},
	{ id: "url", field: <code>url</code>, meaning: <>L’argument <code>pageUrl</code> que vous avez passé, ou <code>document.location.href</code> si vous avez passé <code>null</code> ou l’avez omis, ou <code>null</code> si ni l’un ni l’autre n’est disponible.</> },
	{ id: "title", field: <code>title</code>, meaning: <><code>document.title</code> au moment de l’analyse, ou <code>null</code>.</> },
	{
		id: "timestamp",
		field: <code>timestamp</code>,
		meaning: (
			<>
				<strong>Non généré automatiquement.</strong> Défini uniquement si vous passez{" "}
				<code>engineOptions.timestamp</code> sous forme de chaîne non vide : le moteur n’a pas
				d’horloge intégrée (déterministe par conception). Si vous voulez un horodatage d’analyse
				dans le résultat, fournissez-le vous-même.
			</>
		),
	},
	{
		id: "perfStats",
		field: <code>perfStats</code>,
		meaning: <><code>null</code> sauf si <code>engineOptions.perfStats: true</code>. Temps et compteurs internes ; forme non couverte par ce document, à considérer comme réservée au débogage.</>,
	},
	{
		id: "contextSelector",
		field: <code>contextSelector</code>,
		meaning: (
			<>
				L’argument <code>contextSelector</code> que vous avez passé (sans espaces superflus) : une
				chaîne, un tableau de chaînes (analyse multizone, voir{" "}
				<a href="/configuration/engine-options/">Options du moteur</a>), ou <code>null</code> s’il
				est absent ou vide.
				</>
				),
				},
				{
				id: "contextMatch",
				field: <code>contextMatch</code>,
				meaning: (
					<>
						La façon dont le <code>contextSelector</code> a été résolu, ou <code>null</code> s’il n’y
						en avait pas. <code>elementCount</code> est le nombre d’éléments distincts trouvés, les
						racines de l’analyse. <code>unmatchedSelectors</code> liste chaque sélecteur, tel que vous
						l’avez donné, qui ne correspondait à aucun élément ; une chaîne séparée par des virgules
						compte ici pour un seul sélecteur, comme elle compte pour un seul appel à{" "}
						<code>querySelectorAll</code>.{" "}
						<strong>Un <code>elementCount</code> de 0 signifie que rien n’a été analysé</strong> : la
						page n’a pas cette zone, chaque entrée de <code>checksResults</code> et de{" "}
						<code>rulesResults</code> vaut <code>notApplicable</code>, et le résultat ne dit rien de la
						page. Présentez-le comme une zone introuvable, pas comme une analyse sans constat. Un
						sélecteur que le navigateur ne sait pas analyser n’atteint jamais un résultat : l’analyse
						lève une erreur avec <code>code: 'INVALID_CONTEXT_SELECTOR'</code> (voir{" "}
						<a href="/configuration/engine-options/">Options du moteur</a>).
					</>
				),
				},
	{
		id: "checksResults",
		field: <code>checksResults</code>,
		meaning: (
			<>
				Une entrée par <strong>règle atomique</strong> exécutée (toute règle non écartée par{" "}
				<code>runOnly</code>, voir <a href="/configuration/engine-options/">Options du moteur</a>).{" "}
				<strong>Chaque règle chargée produit une entrée, même celles dont le résultat est{" "}
				<code>notApplicable</code></strong> : ce n’est pas une liste limitée aux violations.
			</>
		),
	},
	{
		id: "rulesResults",
		field: <code>rulesResults</code>,
		meaning: (
			<>
				Une entrée par <strong>règle composite (agrégation)</strong>{" "}
				exécutée ; voir <a href="#composite-result">Un résultat composite</a> et{" "}
				<a href="/conformance/wcag-mapping/">Conformité</a>. En principe une par critère de succès
				WCAG ; une exécution sous le profil d’une norme dotée de ses propres agrégations reçoit aussi
				celles-ci (avec <code>meta.standard</code>). Tableau vide si aucun composite ne
				correspond au filtre <code>runOnly</code>/tags en cours.
			</>
		),
	},
	{
		id: "overriddenBuiltinIds",
		field: <code>overriddenBuiltinIds</code>,
		meaning: (
			<>
				Les ids de règle pour lesquels une entrée de <code>engineOptions.customRules</code>{" "}
				partageait son <code>id</code> avec une règle intégrée, si bien que l’implémentation
				personnalisée a remplacé la règle intégrée pour cette analyse (voir{" "}
				<a href="/configuration/engine-options/">Options du moteur</a>). Toujours un tableau ;
				vide en l’absence de collision. Également journalisé via <code>console.warn</code> au
				moment de l’analyse, puisqu’une règle personnalisée homonyme a autant de chances d’être
				une collision accidentelle qu’un remplacement délibéré.
				</>
				),
				},
				{
				id: "skippedCustomRules",
				field: <code>skippedCustomRules</code>,
				meaning: (
					<>
						Les entrées de <code>engineOptions.customRules</code> qui n’ont pas été exécutées, chacune
						sous la forme <code>{"{ id, reason }"}</code> (<code>id</code> vaut <code>null</code>{" "}
						lorsque l’entrée n’en avait pas) : pas d’id, un <code>runInPage</code> qui n’est pas une
						fonction ou ne peut pas être reconstruit à partir de son code source, un <code>meta</code>{" "}
						qui échoue à la validation, un id qu’une autre règle personnalisée porte déjà, ou l’id d’une
						règle composite. Toujours un tableau ; vide lorsque toutes les règles personnalisées ont été
						exécutées. Chacune est aussi journalisée avec <code>console.warn</code>. Une règle listée
						ici ne figure dans aucun résultat, ce qui permet de distinguer une analyse qui l’a écartée
						d’une analyse où elle a donné <code>pass</code>.
					</>
				),
				},
				];

const occurrenceRows = [
	{
		id: "selector",
		field: <code>selector</code>,
		meaning: (
			<>
				Un sélecteur CSS construit au mieux pour retrouver l’élément signalé (voir{" "}
				<code>helpers.buildSelector</code> dans <code>RULE_AUTHORING.md</code>). Son unicité
				n’est pas garantie face à des structures DOM hostiles, mais le moteur vérifie activement
				qu’il résout bien vers l’élément signalé avant de l’utiliser. L’exception est une règle
				dont le constat <em>est</em> un élément absent : <code>page-title-present</code> signale{" "}
				<code>head &gt; title</code> avec un <code>html</code> valant{" "}
				<code>&lt;title&gt;(missing)&lt;/title&gt;</code>, dont aucun n’existe sur la page. Ce
				sont deux constantes, donc l’empreinte qu’elles alimentent reste stable, mais{" "}
				<strong>ne considérez pas <code>selector</code> comme résolvable ni <code>html</code>{" "}
				comme du vrai balisage sans vérifier que la règle a signalé quelque chose qui
				existe</strong>. Pour un élément situé dans un arbre shadow, <code>selector</code> se résout
				dans sa shadow root, et <code>shadowHostSelectors</code> indique comment y parvenir.
				</>
				),
				},
				{
				id: "shadowHostSelectors",
				field: <code>shadowHostSelectors</code>,
				meaning: (
					<>
						Présent uniquement pour un élément situé dans un arbre shadow : les sélecteurs des shadow
						hosts qui y mènent, du plus externe au plus interne, chacun résolu dans l’arbre qui le
						contient, de sorte que{" "}
						<code>document.querySelector(s[0]).shadowRoot.querySelector(s[1])…shadowRoot.querySelector(selector)</code>{" "}
						trouve l’élément. Deux composants au contenu identique donnent le même{" "}
						<code>selector</code> et se distinguent ici. Comme <code>selector</code>, il ne fait pas
						partie de l’identité d’un constat.
					</>
				),
				},
	{
		id: "html",
		field: <code>html</code>,
		meaning: (
			<>
				Un extrait outer-HTML de l’élément signalé, coupé à 2 000 caractères : utile pour montrer
				l’élément et, pour un élément situé dans un arbre shadow, à lire avec{" "}
				<code>shadowHostSelectors</code>. Pour <code>&lt;html&gt;</code>,{" "}
				<code>&lt;head&gt;</code> et <code>&lt;body&gt;</code>, qui contiennent toute la page,
				c’est la seule balise ouvrante (<code>&lt;html class="x"&gt;</code>), si bien qu’un constat
				portant sur la page garde son identité quand le reste du contenu change.
			</>
		),
	},
	{
		id: "structuralPath",
		field: <code>structuralPath</code>,
		meaning: (
			<>
				Le chemin d’indices de frères de l’élément signalé, depuis <code>documentElement</code>{" "}
				jusqu’à lui (par ex. <code>[1, 0, 2]</code>) ; <code>[]</code> si l’élément <em>est</em>{" "}
				<code>documentElement</code>, <code>null</code> s’il n’a pas pu être déterminé, ce qui
				inclut tout élément situé dans un arbre shadow (utilisez alors{" "}
				<code>shadowHostSelectors</code> et <code>selector</code>). Un
				mécanisme d’identification d’élément plus robuste que <code>selector</code> seul : il
				résiste à des changements du DOM qui casseraient une chaîne de sélecteur (le renommage
				d’un id ou d’une classe, par exemple), au{" "}
				<strong>prix de ne pas pouvoir servir de vrai sélecteur CSS</strong>.
			</>
		),
	},
	{ id: "summary", field: <code>summary</code>, meaning: <>Lisible par un humain, déjà localisé (« <span lang="en">This button has no accessible name.</span> »).</> },
	{ id: "hint", field: <code>hint</code>, meaning: "Conseil de correction lisible par un humain, déjà localisé." },
	{
		id: "i18n",
		field: <code>i18n</code>,
		meaning: (
			<>
				Les clés de traduction brutes derrière <code>summary</code>/<code>hint</code>, si vous
				voulez les afficher vous-même dans une autre langue sans relancer l’analyse.{" "}
				<code>null</code> si l’occurrence n’a pas utilisé d’i18n à base de clés.
			</>
		),
	},
	{
		id: "data.visibilityFilter",
		field: <code>data.visibilityFilter</code>,
		meaning: (
			<>
				Présent sur la plupart des occurrences : pourquoi le moteur a jugé cet élément éligible
				(ou non) selon le modèle d’éligibilité utilisé par la règle. <code>eligible</code> en est
				le résultat (absent sur les constats de niveau page de{" "}
				<code>bypass-blocks-present</code>, <code>html-lang-attr-present</code> et{" "}
				<code>page-title-present</code>) ; <code>targetSet</code> indique quel modèle l’a produit (<code>'dom'</code> :
				visibilité DOM/CSS brute, pour la plupart des règles ; <code>'acc'</code> : éligibilité
				selon l’arbre d’accessibilité). <code>accEligible</code> reprend <code>eligible</code>{" "}
				uniquement lorsque <code>targetSet</code> vaut <code>'acc'</code>, sinon{" "}
				<code>null</code>. <code>reasons</code> est une liste de codes d’exclusion lisibles par
				une machine lorsque <code>eligible: false</code>.
			</>
		),
	},
	{
		id: "data.details",
		field: <code>data.details</code>,
		meaning: (
			<>
				Données structurées propres à la règle (métriques calculées, références résolues),{" "}
				<strong>non normatives</strong> : utiles pour construire une interface plus riche ou pour
				déboguer, mais elles ne changent jamais le sens de <code>outcome</code>/
				<code>severity</code>. Leur forme varie selon la règle ; considérez-les comme un contexte
				supplémentaire fourni au mieux, pas comme un contrat stable. La seule exception est{" "}
				<code>data.details.reasonCode</code>, qui <strong>est</strong> stable : il identifie{" "}
				<em>lequel</em> des constats d’une règle il s’agit, et forme avec <code>ruleId</code> et{" "}
				<code>html</code> l’empreinte sur laquelle reposent les baselines et SARIF. Voir{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>
					<code>API_STABILITY.md</code>
				</a>
				. La page de chaque règle liste les champs que portent ses constats, sous « Ce que
				rapporte un constat ».
			</>
		),
	},
	{
		id: "occurrenceOutcome",
		field: <code>occurrenceOutcome</code>,
		meaning: (
			<>
				Le niveau auquel appartient cette occurrence, pour une règle qui a réparti ses constats
				entre un niveau <code>fail</code> certain et un niveau <code>cantTell</code> à revoir.
				Une règle qui ne signale qu’un seul niveau l’omet ; dans ce cas, l’<code>outcome</code>{" "}
				du résultat lui-même est le niveau de l’occurrence.
			</>
		),
	},
	{ id: "uncertainty", field: <code>uncertainty</code>, meaning: <>Pourquoi ce constat n’a pas pu être tranché ; voir <a href="#uncertainty-codes">Codes d’incertitude</a> ci-dessous.</> },
];

const uncertaintyRows = [
	{ id: "not-computable", code: <code>not-computable</code>, meaning: "Les éléments dont la règle avait besoin n’ont pas pu être lus dans cet environnement.", shape: "Une feuille de style d’une autre origine, une couleur d’arrière-plan qui ne se résout en aucune valeur, un src qui ne se résout pas." },
	{ id: "runtime-dependent", code: <code>runtime-dependent</code>, meaning: "Le balisage ne permet pas de trancher, car c’est un script qui décide à l’exécution.", shape: "Un aria-controls qui désigne un élément que le widget construit à son ouverture." },
	{ id: "spec-only", code: <code>spec-only</code>, meaning: "Une vraie violation de la spécification, mais le nom, le rôle et la valeur exposés n’en souffrent pas : aucun critère de succès n’est donc établi comme non satisfait.", shape: "Un attribut ARIA dont la spécification fournit une valeur par défaut en cas d’absence." },
	{ id: "equivalence-unknown", code: <code>equivalence-unknown</code>, meaning: "Deux éléments servent peut-être le même objectif, peut-être pas, et ni le balisage ni le contenu ne permettent de trancher.", shape: "Deux frames qui partagent un nom accessible mais intègrent des ressources différentes." },
	{ id: "judgement-required", code: <code>judgement-required</code>, meaning: "La question relève par nature d’une décision humaine.", shape: "Savoir si une cible trop petite est essentielle ; toute règle type: \"manual\"." },
	{ id: "out-of-scope", code: <code>out-of-scope</code>, meaning: "Le constat est réel, mais sort du cadre de la norme visée par cette exécution.", shape: "Une règle associée uniquement à un critère que la version WCAG cible a retiré." },
];

const outcomeRows = [
	{ id: "fail", outcome: <code>fail</code>, meaning: "Violation normative déterministe : la procédure de décision ne devine rien.", manual: "Non (converti en cantTell)" },
	{ id: "pass", outcome: <code>pass</code>, meaning: "La ou les cibles applicables de la règle existent et aucune n’a été signalée.", manual: "Oui" },
	{ id: "cantTell", outcome: <code>cantTell</code>, meaning: "Nécessite un jugement humain : soit c’est réellement ambigu, soit c’est le constat indicatif d’une règle manuelle.", manual: "Oui" },
	{ id: "notApplicable", outcome: <code>notApplicable</code>, meaning: "La règle n’a trouvé aucun élément auquel elle s’applique sur cette page ou dans ce périmètre.", manual: "Oui" },
];

export function OutputSchemaContent() {
	return (
		<>
			<p>
				Voici la forme exacte de l’objet renvoyé par <code>runDomRulesInPage(...)</code> /{" "}
				<code>runa11yCoreInPage(...)</code> (voir{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> pour savoir
				lequel appeler). Chaque exemple de cette page est une sortie réelle du moteur actuel (
				<code>schemaVersion: "1.0.0"</code>), pas un exemple écrit à la main.{" "}
				<code>runa11yCoreAcrossFrames</code> renvoie une forme différente, récursive, qui
				enveloppe celle-ci ; voir <a href="#cross-frame-result">Résultat multi-frames</a>{" "}
				ci-dessous.
			</p>

			<h2 id="top-level-result">Résultat de premier niveau</h2>
			<CodeBlock
				lines={[
					"{",
					"  engine: {",
					"    tag: string,",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2",',
					'    profile?: string,      // "wcag22-aa", "en301549-v4.1.1", "en301549-v3.2.1", "section508", or a registered standard\'s own',
					'    mappings?: string[],   // e.g. ["en301549"] or ["en301549:V3.2.1"]',
					"    environment: {",
					"      layout: boolean,",
					"      viewport?: { width: number, height: number },  // CSS px",
					"      devicePixelRatio?: number,",
					'      colorScheme?: "light" | "dark",',
					'      fonts?: "loaded" | "loading"',
					"    }",
					"  },",
					"  url: string | null,",
					"  title: string | null,",
					"  timestamp: string | null,",
					"  perfStats: object | null,",
					"  contextSelector: string | string[] | null,",
					"  contextMatch: { elementCount: number, unmatchedSelectors: string[] } | null,",
					"  checksResults: CheckResult[],",
					"  rulesResults: CompositeResult[],",
					"  overriddenBuiltinIds: string[],",
					"  skippedCustomRules: Array<{ id: string | null, reason: string }>",
					"}",
				]}
			/>
			<DataTable
				label="Champs du résultat de premier niveau"
				rowKey="id"
				columns={[
					{ key: "field", label: "Champ", width: "22%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={topLevelRows}
			/>

			<h2 id="cross-frame-result">Résultat multi-frames (<code>runa11yCoreAcrossFrames</code>)</h2>
			<p>
				<code>runa11yCoreAcrossFrames</code> (voir{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				) renvoie une forme différente, récursive, au lieu d’un simple résultat de premier
				niveau :
			</p>
			<CodeBlock
				lines={[
					"{",
					"  topFrame: <the normal top-level result shape above>,",
					"  frames: Array<",
					"    | { url: string | null, topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, error: string }",
					"  >",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>topFrame</code> a exactement la forme du{" "}
					<a href="#top-level-result">résultat de premier niveau</a>, pour le frame dans lequel
					la fonction a été appelée.
				</li>
				<li>
					<code>frames</code> contient une entrée par <code>&lt;iframe&gt;</code>/
					<code>&lt;frame&gt;</code> enfant direct dans le périmètre analysé. Un enfant
					joignable (qui a appelé <code>a11yCoreEnableFrameResponder()</code>) fournit son propre{" "}
					<code>{"{ url, topFrame, frames }"}</code> complet, y compris <em>ses propres</em>{" "}
					<code>frames</code> imbriqués, récursivement, puisqu’un petit-enfant plus profond n’est
					joignable que par l’intermédiaire de son parent immédiat. Un enfant injoignable (le cas
					courant pour la plupart des contenus tiers intégrés : pas de responder coopératif, ou
					délai dépassé) fournit à la place <code>{"{ url, error }"}</code>, sans interrompre le
					reste de l’analyse.
				</li>
				<li>
					Il s’agit d’un <strong>arbre, pas d’une liste à plat</strong> : une différence
					délibérée avec le <code>.frames(true)</code> du binding{" "}
					<code>@surea11y/playwright</code>, qui <em>peut</em> aplatir parce que le{" "}
					<code>page.frames()</code> de Playwright fournit déjà tous les frames quelle que soit
					leur profondeur d’imbrication ; un relais <code>postMessage</code> n’a pas cette vue
					globale, donc l’imbrication est exprimée par la structure.
					</li>
					<li>
						<strong>Les générateurs de rapports prennent un seul résultat de premier niveau, pas cet
						arbre.</strong> <code>renderHtmlReport</code>, <code>renderSarifReport</code>,{" "}
						<code>renderJunitReport</code>, <code>buildBaselineEntries</code> et{" "}
						<code>matchBaseline</code> lèvent une <code>TypeError</code> lorsqu’on leur passe autre
						chose qu’un objet doté d’un tableau <code>checksResults</code> (un résultat multi-frames,
						un tableau, <code>null</code> ou <code>undefined</code> issu d’une analyse qui a échoué),
						au lieu de le présenter comme une analyse qui n’a rien trouvé. Passez{" "}
						<code>topFrame</code>, et le <code>topFrame</code> de chaque frame, dans des appels
						séparés. <code>renderEarlReport</code> prend l’arbre tel quel : chaque frame qui a répondu
						devient un sujet à part entière, identifié par son URL.
					</li>
					</ul>

			<h2>Un résultat de vérification (<code>checksResults[i]</code>)</h2>
			<CodeBlock
				lines={[
					"{",
					"  ruleId: string,",
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					'  outcomeNormalized: "pass" | "fail" | "cantTell" | "inapplicable",',
					'  severity: "minor" | "moderate" | "serious" | "critical",',
					'  confidence: "high" | "medium" | "low",',
					'  type: "automatic" | "manual",',
					"  occurrences: Occurrence[],",
					"  title: string,",
					"  description: string,",
					"  i18n: { titleKey: string, descriptionKey: string } | null,",
					"  meta: {",
					"    ruleId: string,",
					"    ruleInterfaceVersion: string,",
					"    ruleVersion: string,",
					"    normative: boolean,",
					"    atomic: boolean,",
					"    deprecated: boolean,",
					"    deprecation: object | null,",
					'    category: "perceivable" | "operable" | "understandable" | "robust" | null,',
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string, conformanceLevel?: string, wcagSc?: string[] }>,",
					"    standard: string | null,",
					"    applicability: string,",
					"    expectation: string,",
					"    references: string[],",
					"    requirements: object | null,",
					"    mappings: object | null",
					"  },",
					"  engineOptions: object,   // the resolved engineOptions this rule actually ran under",
					"  schemaVersion: string,",
					"  rollupIds: string[],     // the rulesResults entries that group this rule in this run; [] if none",
					"  data?: object,           // page-level data a rule reports whatever its outcome; see below",
					"  margin?: {               // the closest a measurement came to its threshold while meeting it; see below",
					'    measure: string,       // "contrast-ratio" | "overflow-px" | "target-size-px" | ... (open set)',
					'    unit: "px" | "ratio",  // open set',
					'    limit: "min" | "max",',
					"    threshold: number,",
					"    value: number,",
					"    headroom: number,      // >= 0",
					"    measuredCount: number,",
					"    selector?: string,",
					"    shadowHostSelectors?: string[],  // as on an occurrence",
					"    structuralPath?: number[],",
					"    context?: object       // rule-specific; not a stable contract",
					"  },",
					"  wcagVersionScope?: {     // present only when the target WCAG version changed this outcome",
					'    target: "2.0" | "2.1" | "2.2",',
					"    removedSc: string[],",
					'    coercedFrom: "fail"',
					"  },",
					"  error?: string           // present only if the rule threw — see below",
					"}",
				]}
			/>
			<p>Remarques :</p>
			<ul>
				<li>
					<strong><code>outcome</code> et <code>outcomeNormalized</code></strong> : identiques,
					sauf que <code>notApplicable</code> devient <code>"inapplicable"</code> dans{" "}
					<code>outcomeNormalized</code>. Les deux sont fournis pour que vous puissiez vous
					aligner soit sur votre propre vocabulaire, soit sur celui du moteur.
				</li>
				<li>
					<strong>Les règles <code>type: "manual"</code> ne peuvent jamais renvoyer{" "}
					<code>outcome: "fail"</code>.</strong>{" "}
					Si la logique propre d’une règle manuelle aurait conclu à <code>fail</code>, le moteur
					le convertit en <code>cantTell</code> et ajoute une note explicative à{" "}
					<code>error</code>. Ce comportement est imposé de façon centralisée (
					<code>policy.coerceManualFailToCantTell</code>, activé par défaut sous le contrat de
					politique <code>a11y</code> ; voir{" "}
					<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>), et ce n’est pas à chaque
					règle d’y penser. <code>fail</code> est réservé aux constats déterministes{" "}
					<code>type: "automatic"</code> uniquement.
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong> est ce qui relie un résultat de
					vérification à un critère de succès WCAG : <code>[]</code> pour les règles sans
					correspondance WCAG formelle (ce moteur les appelle des règles indicatives{" "}
					<code>type: "manual"</code>). Voir{" "}
					<a href="/conformance/wcag-mapping/">Conformité</a> pour la façon dont elles sont
					agrégées. <strong>La liste n’est pas réservée à WCAG.</strong> Quand l’analyse demande
					une autre norme (<code>engineOptions.mappings</code>, ou le profil d’une norme), chaque
					critère WCAG est suivi de l’exigence correspondante de cette norme, comme la clause d’EN
					301 549 qui le reprend (
					<code>{'{ standard: "EN 301 549", version: "V3.2.1" | "V4.1.1", requirement: "9.1.1.1", title, wcagSc: ["1.1.1"] }'}</code>
					, une entrée par version qui inclut le critère) ; une règle peut aussi citer les documents
					Understanding de WCAG (<code>type: "Understanding"</code>). Filtrez sur{" "}
					<code>standard</code> (et sur l’absence de <code>type</code>) avant de lire{" "}
					<code>requirement</code> comme un critère de succès. L’entrée WCAG d’un composite vient
					toujours en premier. Voir <a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>.
				</li>
				<li>
					<strong><code>rollupIds</code></strong> liste les composites de{" "}
					<code>rulesResults</code> qui regroupent cette règle dans cette exécution. Une liste vide
					signifie que les résultats de la règle n’apparaissent dans aucune agrégation : qui ne lit
					que <code>rulesResults</code> ne les voit jamais ; <code>heading-order</code>, par
					exemple, n’appartient à aucune agrégation WCAG.
				</li>
				<li>
					<strong><code>wcagVersionScope</code></strong> : présent uniquement lorsque la version
					WCAG cible de l’exécution a transformé le <code>fail</code> de cette règle en{" "}
					<code>cantTell</code>. Aujourd’hui, cela concerne une règle associée au critère 4.1.1
					Analyse syntaxique (<code>duplicate-id</code>) sous la cible 2.2 par défaut, puisque 2.2
					a retiré ce critère. <code>removedSc</code> liste les critères qui ont cessé d’exister,{" "}
					<code>target</code> est la version qui les a retirés, et <code>coercedFrom</code> est le
					résultat que la règle a elle-même renvoyé. Les occurrences sont celles de la règle,
					inchangées : rien n’a été supprimé, seul le verdict de conformité l’a été. Absent de
					tous les autres résultats, et <strong>jamais</strong> signalé via <code>error</code> :
					rien ne s’est mal passé. Voir{" "}
					<a href="/configuration/engine-options/#filtering-by-wcag-version">Filtrer par version de WCAG</a>.
				</li>
				<li>
					<strong><code>data</code></strong> : présent seulement sur une règle qui rapporte quelque
					chose sur la page entière, quel que soit son résultat. Aucune règle du cœur ne le fait
					aujourd’hui. Comme <code>data.details</code> sur une occurrence, ce n’est pas un contrat
					stable.
					</li>
					<li id="margin">
						<strong><code>margin</code></strong> : présent seulement sur une règle qui en déclare une
						dans le catalogue (<code>getChecksCatalog()[i].margin</code>,{" "}
						<code>{"{ measure, unit, limit }"}</code>), lorsqu’au moins un élément a atteint le seuil
						de la règle. Il désigne l’élément qui s’est le plus approché du seuil tout en le
						respectant, si bien qu’un <code>pass</code> à 4,52:1 pour un seuil de 4,5:1, ou à 0,4 px
						de tronquer le texte, se distingue d’un <code>pass</code> confortable. Il accompagne le
						résultat et n’est pas un constat : il n’ajoute, ne retire ni ne modifie jamais une
						occurrence, et les baselines, SARIF, JUnit et EARL l’ignorent. Il figure aussi sur les
						résultats <code>fail</code> et <code>cantTell</code> lorsque certains éléments ont
						satisfait la règle. <code>limit</code> vaut <code>min</code> quand la valeur doit atteindre
						le seuil (contraste, taille) et <code>max</code> quand elle doit rester en dessous
						(débordement) ; <code>headroom</code> est la marge restante, en <code>unit</code>, soit{" "}
						<code>value - threshold</code> pour <code>min</code> et <code>threshold - value</code> pour{" "}
						<code>max</code>, jamais négative. <code>threshold</code> est le seuil appliqué à cet
						élément, qui peut varier d’un élément à l’autre (3:1 pour du texte de grande taille). Les
						pixels sont donnés à une décimale : les pixels CSS et des seuils comme la moitié d’une
						police de 15px sont fractionnaires, et un affichage les arrondit pour les personnes. Un
						rapport de contraste n’est pas arrondi, puisque les WCAG n’arrondissent pas le contraste.
						En cas d’égalité, c’est le premier élément dans l’ordre du document qui l’emporte, si bien
						qu’une page donne toujours la même marge. <code>measure</code> et <code>unit</code> sont des
						ensembles ouverts qui peuvent s’enrichir dans une version mineure ; <code>context</code> est
						propre à la règle et, comme <code>data.details</code>, ce n’est pas un contrat stable.{" "}
						<code>getMargins(result)</code> renvoie toutes les marges d’un résultat sous la forme{" "}
						<code>{"[{ ruleId, ...margin }]"}</code>, triées par <code>ruleId</code>.
					</li>
				<li>
					<strong><code>error</code></strong> : présent dans trois cas seulement. L’implémentation
					de la règle a levé une exception non interceptée, la conversion des échecs
					manuels décrite ci-dessus s’est appliquée, ou bien chaque occurrence d’un résultat{" "}
					<code>fail</code> a vu son parcours des ancêtres atteindre une limite de profondeur
					interne (le moteur n’a donc pas pu confirmer que le contenu signalé est réellement
					exposé) et le résultat entier a été converti en <code>cantTell</code> de la même façon.
					Une règle qui lève une exception apparaît toujours sous la forme{" "}
					<code>outcome: "cantTell"</code> avec <code>occurrences: []</code> et <code>error</code>{" "}
					contenant le message de l’exception : le moteur ne laisse jamais une règle défaillante
					faire planter toute l’analyse.
				</li>
				<li>
					<strong><code>engineOptions</code></strong> sur chaque résultat est l’objet d’options{" "}
					<em>résolu</em> (après application des valeurs par défaut de locale et de contraste),
					et non littéralement ce que vous avez passé. Utile pour vérifier ce qu’une règle donnée
					a réellement reçu, en particulier la <code>locale</code> résolue et{" "}
					<code>contrast.mode</code>/<code>contrast.rootCanvasFallback</code>. Il omet{" "}
					<code>messages</code>, les dictionnaires avec lesquels l’exécution a traduit (un fichier de
					locale séparé dans le bundle pour navigateur, ou vos propres chaînes) : ce sont des données,
					pas un réglage, et une copie sur chaque résultat faisait peser une analyse des dizaines de
					mégaoctets. <code>engine.locale</code> indique quel dictionnaire a été utilisé. Deux autres
					options sont reprises telles que les règles les ont vues, pour que le résultat reste de
					simples données que <code>JSON.stringify</code> et <code>structuredClone</code>{" "}
					(<code>postMessage</code>) peuvent transporter : <code>probes</code> sous la forme de la
					copie plafonnée que lisent les règles, et <code>customRules</code> sous la forme{" "}
					<code>{"[{ id }]"}</code>, une entrée par règle personnalisée dotée d’un id, sans ses
					fonctions.
					</li>
			</ul>

			<h2 id="occurrence">Une occurrence (<code>occurrences[i]</code>)</h2>
			<p>
				Normalement présente uniquement lorsque <code>outcome</code> vaut <code>fail</code> ou{" "}
				<code>cantTell</code> : un résultat <code>pass</code> a <code>occurrences: []</code>,
				puisque ce moteur n’énumère pas les éléments qu’il a validés, seulement ceux qu’il a
				signalés. Les règles de contraste font exception : leur <code>pass</code> porte une
				occurrence qui décrit l’analyse (la quantité de texte éligible et calculable), avec un{" "}
				<code>selector</code> vide, pour qu’un <code>pass</code> sans aucun texte se distingue d’un{" "}
				<code>pass</code> sur une page pleine de texte.
				</p>
			<p>
				<code>notApplicable</code> est la seule exception. Une règle qui n’avait rien à juger
				peut joindre une occurrence unique expliquant pourquoi, et c’est exactement ce que font
				les règles de contraste lorsqu’aucun texte n’avait d’arrière-plan calculable : la
				différence entre « vérifié, rien à signaler » et « impossible à vérifier » est une
				différence que ce moteur signale au lieu de la masquer. Une telle occurrence décrit
				l’analyse, pas un élément, donc son <code>selector</code> est vide.{" "}
				<strong>Ne lisez pas <code>occurrences.length</code> comme un nombre de violations sans
				vérifier d’abord <code>outcome</code>.</strong>
			</p>
			<CodeBlock
				lines={[
					"{",
					"  selector: string,",
					"  html: string,",
					"  structuralPath: number[] | null,",
					"  shadowHostSelectors?: string[],",
					"  summary: string,",
					"  hint: string,",
					"  i18n: { summaryKey: string, hintKey: string, params: object } | null,",
					'  occurrenceOutcome?: "fail" | "cantTell",   // present when the rule graded its findings into tiers',
					"  uncertainty?: {          // present only on a cantTell-tier occurrence",
					'    code: "not-computable" | "runtime-dependent" | "spec-only"',
					'        | "equivalence-unknown" | "judgement-required" | "out-of-scope",',
					"    needed?: string,       // what would settle the question",
					"    evidence?: object      // what the rule did establish, rule-specific",
					"  },",
					"  data?: {               // absent on manual-review's page-level finding",
					"    visibilityFilter?: { eligible?: boolean, targetSet: string, accEligible: boolean | null, reasons: string[] },",
					"    details?: object   // rule-specific, non-normative — see below",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="Champs d’une occurrence"
				rowKey="id"
				columns={[
					{ key: "field", label: "Champ", width: "22%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={occurrenceRows}
			/>

			<h3 id="uncertainty-codes">Codes d’incertitude</h3>
			<p>
				Un <code>cantTell</code> indique que le moteur n’a pas tranché. <code>uncertainty</code>{" "}
				indique <strong>pourquoi</strong>, à partir d’un vocabulaire fermé, pour qu’un
				consommateur puisse agir selon la raison plutôt que d’analyser une chaîne de résumé. Il
				n’est présent que sur une occurrence de niveau <code>cantTell</code> : une occurrence de
				niveau <code>fail</code> affirmerait que la règle a à la fois tranché et pas tranché,
				donc le moteur le retire.
			</p>
			<DataTable
				label="Codes d’incertitude"
				rowKey="id"
				columns={[
					{ key: "code", label: "code", width: "20%" },
					{ key: "meaning", label: "Signification", wrap: true, width: "40%" },
					{ key: "shape", label: "Cas typique", wrap: true },
				]}
				rows={uncertaintyRows}
			/>
			<p>
				<code>needed</code> indique, en une phrase, ce qui permettrait de trancher : ce que la
				personne qui relit doit aller vérifier. <code>evidence</code> contient ce que la règle{" "}
				<em>a</em> établi, pour que cette personne parte du travail du moteur au lieu de le
				refaire ; sa forme est propre à la règle et, comme <code>data.details</code>, ne
				constitue pas un contrat stable. Le <code>code</code>, lui, en est un : de nouveaux codes
				peuvent être ajoutés dans une version mineure, mais un code existant ne change pas de
				sens. Prévoyez donc un traitement pour les codes que vous connaissez et{" "}
				<strong>traitez un code inconnu comme « à revoir » plutôt que comme une erreur</strong>.
			</p>
			<p>
				Toute règle automatique susceptible de renvoyer <code>cantTell</code> le fournit, et un
				test y veille pour qu’une nouvelle règle ne puisse pas arriver sans lui. Le code{" "}
				<code>out-of-scope</code> est ajouté par le moteur et non par une règle, sur les mêmes
				occurrences que celles qui produisent un <code>wcagVersionScope</code> au niveau du
				résultat. Les règles manuelles ne le portent pas : <code>judgement-required</code> est
				précisément ce que signifie déjà <code>type: "manual"</code>, donc le répéter pour
				chaque occurrence n’apporterait rien que le résultat ne dise déjà.
			</p>

			<h2 id="composite-result">Un résultat composite (<code>rulesResults[i]</code>)</h2>
			<p>
				Les composites agrègent plusieurs règles atomiques en un seul critère de succès WCAG (par
				ex. <code>wcag-1.1.1-non-text-content</code> agrège 21 règles atomiques). Sous le profil d’une norme dotée de ses propres agrégations,
				il y a aussi celles-ci, avec la formulation de la norme comme <code>title</code> et son nom
				comme <code>meta.standard</code>. Leur forme
				reprend l’enveloppe d’un résultat de vérification, avec un <code>data.details</code>{" "}
				propre aux composites :
			</p>
			<CodeBlock
				lines={[
					"{",
					'  ruleId: string,              // e.g. "wcag-1.1.1-non-text-content"',
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					"  severity, confidence, type, title, description, meta, engineOptions, schemaVersion,  // as on a check result, except that",
					"                                // meta.normativeMappings names the criterion in a shorter form:",
					"                                // { standard, requirement, level }",
					"  occurrences: [],              // always empty — composites are rollups, not element-level findings",
					"  data: {",
					"    details: {",
					'      reasonCode: string,       // e.g. "composite.rollup.fail.anyFail"',
					"      standard?: string,        // a standard's own rollup only, with version and criterion",
					"      version?: string,",
					"      criterion?: string,",
					"      checksIds: string[],      // every atomic ruleId this composite rolls up",
					"      contributors: Array<{ testId: string, outcome: string, severity: string | null }>,",
					"      metrics: { failCount, cantTellCount, notApplicableCount, passCount, missingCount }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				Ordre de priorité de l’agrégation (déterministe, dans cet ordre) :{" "}
				<strong>au moins une règle contributrice en <code>fail</code> → composite{" "}
				<code>fail</code></strong> ; sinon{" "}
				<strong>au moins un <code>cantTell</code> (ou une règle contributrice qui ne s’est pas
				exécutée du tout, <code>missingCount &gt; 0</code>) → composite{" "}
				<code>cantTell</code></strong> ; sinon{" "}
				<strong>toutes les contributrices en <code>notApplicable</code> → composite{" "}
				<code>notApplicable</code></strong> ; sinon <strong><code>pass</code></strong>. Voir{" "}
				<a href="/conformance/wcag-mapping/">Conformité</a> pour ce que cela implique pour une
				déclaration de conformité globale.
			</p>

			<h2>Valeurs de résultat</h2>
			<DataTable
				label="Valeurs de résultat"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Résultat", width: "16%" },
					{ key: "meaning", label: "Signification", wrap: true },
					{ key: "manual", label: 'Possible avec type: "manual" ?', width: "22%" },
				]}
				rows={outcomeRows}
			/>
			<p>
				<code>fail</code> est volontairement le résultat le plus étroit et le plus exigeant de ce
				moteur : il est réservé aux violations normatives déterministes ;{" "}
				<strong>la recherche de couverture ne doit jamais le diluer</strong>.
			</p>

			<h2>Valeurs de sévérité et de confiance</h2>
			<ul>
				<li>
					<code>severity</code> : <code>minor</code> &lt; <code>moderate</code> &lt;{" "}
					<code>serious</code> &lt; <code>critical</code> ; l’évaluation par l’auteur de la
					règle de l’impact sur les utilisateurs, indépendante de <code>confidence</code>.
				</li>
				<li>
					<code>confidence</code> : <code>low</code> &lt; <code>medium</code> &lt;{" "}
					<code>high</code> ; le degré de certitude du moteur quant à l’exactitude d’un verdict{" "}
					<code>fail</code>/<code>cantTell</code>. Ce sont deux métadonnées informatives servant à
					prioriser ; aucune ne change le sens de <code>outcome</code>.
				</li>
			</ul>
			<p>
				<strong>Un <code>fail</code> n’est pas toujours <code>confidence: "high"</code>, et ce
				n’est pas une contradiction.</strong> Le résultat décrit la procédure de décision (elle a
				tranché la question sans deviner), tandis que <code>confidence</code> décrit le modèle
				par rapport auquel cette décision a été prise. Quelques règles automatiques décident de
				façon déterministe par rapport à quelque chose qui est lui-même une approximation (les
				tables de rôles WAI-ARIA maintenues à la main, les correspondances de rôles natifs, un
				arbre d’accessibilité déduit du balisage statique) et renvoient <code>medium</code> :{" "}
				<code>aria-required-children</code>, <code>aria-prohibited-children</code>,{" "}
				<code>aria-required-parent</code>, <code>aria-allowed-attr</code>,{" "}
				<code>form-control-programmatic-label-present</code>,{" "}
				<code>identical-iframes-same-purpose</code>,{" "}
				<code>svg-image-text-alternative-present</code>,{" "}
				<code>video-poster-text-alternative-present</code> et <code>target-size-minimum</code>.{" "}
				<code>confidence</code> figure sur chaque résultat, donc un consommateur qui ne veut que
				les échecs les plus certains peut filtrer directement dessus ;{" "}
				<code>policy.allowedConfidence</code> ne le fera pas pour vous, puisqu’une valeur non
				autorisée est remplacée par le <code>defaultConfidence</code> propre à la règle au lieu
				de changer le résultat (voir{" "}
				<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>).
			</p>

			<h2>Exemple commenté</h2>
			<p>
				Analyse de <code>&lt;img src="logo.png"&gt;</code> (sans <code>alt</code>) et de{" "}
				<code>&lt;button&gt;&lt;/button&gt;</code> (sans nom accessible), limitée à ces deux
				règles via <code>runOnly: {"{ includeRuleIds: [...] }"}</code> (voir{" "}
				<a href="/configuration/engine-options/">Options du moteur</a> ; depuis la 1.10.0, un
				simple tableau d’ids de règles fait la même chose) :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(",
					"  'https://example.test/',",
					"  null,",
					"  {},",
					"  { includeRuleIds: ['img-alt-present', 'button-name-present'] }",
					");",
				]}
			/>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "engine": {',
					'    "tag": "a11ycore",',
					'    "schemaVersion": "1.0.0",',
					'    "locale": { "requested": "en", "resolved": "en", "reason": "ok" }',
					"  },",
					'  "url": "https://example.test/",',
					'  "title": "Example",',
					'  "timestamp": null,',
					'  "perfStats": null,',
					'  "contextSelector": null,',
					'  "contextMatch": null,',
					'  "checksResults": [',
					"    {",
					'      "ruleId": "button-name-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > button",',
					'          "html": "<button></button>",',
					'          "structuralPath": [1, 1],',
					'          "summary": "This button has no accessible name.",',
					'          "hint": "Provide visible button text or a programmatic accessible-name mechanism (for example aria-label) so assistive technologies can identify the button.",',
					'          "data": {',
					'            "visibilityFilter": { "eligible": true, "reasons": [], "targetSet": "acc", "accEligible": true },',
					'            "details": { "reasonCode": "name_missing" }',
					"          }",
					"        }",
					"      ]",
					"    },",
					"    {",
					'      "ruleId": "img-alt-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > img",',
					'          "html": "<img src=\\"logo.png\\">",',
					'          "structuralPath": [1, 0],',
					'          "summary": "Missing alt attribute on <img>.",',
					'          "hint": "Add an alt attribute (use alt=\\"\\" only for decorative images)."',
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [],',
					'  "overriddenBuiltinIds": [],',
					'  "skippedCustomRules": []',
					"}",
				]}
			/>
			<p>
				(Version abrégée pour la lisibilité : le résultat réel inclut aussi{" "}
				<code>title</code>/<code>description</code>/<code>i18n</code>/<code>meta</code>/
				<code>engineOptions</code>/<code>schemaVersion</code> sur chaque entrée, conformément à
				la forme complète ci-dessus. <code>rulesResults</code> est vide ici parce que{" "}
				<code>runOnly.includeRuleIds</code> a limité l’analyse à deux règles atomiques et qu’aucun
				ID de composite n’était inclus.)
			</p>
		</>
	);
}
