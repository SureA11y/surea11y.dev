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
				<code>"1.11.1"</code> : c’est elle qu’il faut citer dans un rapport de bug, et elle permet
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
				<code>{"{ rules, criteria }"}</code>, les règles qu’il nomme et les critères WCAG qu’il
				écarte. Leurs règles et agrégations WCAG ne se sont pas exécutées, ce qui restreint
				l’analyse sans changer ce que WCAG exige. Aucun profil intégré
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
		id: "engine.packs",
		field: <code>engine.packs</code>,
		meaning: (
			<>
				Présent seulement quand l’analyse s’est exécutée avec <code>engineOptions.packs</code> :
				chaque pack qui s’est exécuté, sous la forme <code>name@version</code>, trié par nom. Voir{" "}
				<a href="/configuration/packs/">Packs</a>.
			</>
		),
	},
	{
		id: "engine.outputDetail",
		field: <code>engine.outputDetail</code>,
		meaning: (
			<>
				Présent seulement quand <code>engineOptions.output.detail</code> vaut{" "}
				<code>'findings'</code>, sous la forme <code>"findings"</code> : chaque résultat de
				vérification <code>pass</code> ou <code>notApplicable</code> qui ne liste aucune occurrence
				est compact, <code>{"{ ruleId, outcome, type }"}</code> plus sa <code>margin</code> ou son{" "}
				<code>error</code> s’il en a, sans le titre, la description et le <code>meta</code>, qui
				appartiennent au catalogue et sont les mêmes sur chaque page. Les résultats{" "}
				<code>fail</code> et <code>cantTell</code>, les agrégations et <code>engine</code> restent
				complets : aucun verdict ne change. Les reporters (SARIF, JUnit, le rapport HTML, EARL, les
				fonctions de baseline) lisent un résultat compact comme le résultat complet, en le
				complétant à partir du catalogue de core. Un résultat que ce catalogue ne pourrait pas
				compléter reste complet : chaque résultat de vérification d’une analyse avec{" "}
				<code>packs</code>, celui d’une règle personnalisée, et celui dont les{" "}
				<code>messages</code> de l’analyse ont modifié le titre ou la description. Le résultat
				d’une page vide passe d’environ 236 Ko à 80 Ko.
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
	{ id: "url", field: <code>url</code>, meaning: <>L’argument <code>pageUrl</code> que vous avez passé, ou <code>document.location.href</code> si vous avez passé <code>null</code> ou l’avez omis (ou avez passé autre chose qu’une chaîne, ce qui journalise aussi un <code>console.warn</code>), ou <code>null</code> si ni l’un ni l’autre n’est disponible.</> },
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
		id: "standards",
		field: <code>standards</code>,
		meaning: (
			<>
				Présent seulement quand le résultat nomme une norme autre que WCAG dans une entrée de{" "}
				<code>meta.normativeMappings</code> ou dans le <code>meta.standard</code> d’une agrégation :
				un <code>{"{ key, standard, titleLang?, note? }"}</code> par norme enregistrée qu’il nomme,
				y compris celle d’un pack, dans l’ordre du registre. <code>key</code> est la clé de la norme
				(<code>"en301549"</code>), <code>standard</code> le nom que portent ses entrées (
				<code>"EN 301 549"</code>), <code>titleLang</code> la langue dans laquelle sont rédigés les
				titres de ses propres agrégations quand ce n’est pas celle de l’analyse, et{" "}
				<code>note</code> le texte affiché au-dessus de ses propres agrégations dans le rapport
				HTML, dans la langue de l’analyse. Les reporters le lisent à la place du registre, si bien
				qu’un résultat enregistré s’affiche de la même façon où qu’il soit rendu, que cette
				installation connaisse la norme ou non. Une norme que seule une règle personnalisée nomme
				n’est pas listée.
			</>
		),
	},
	{
		id: "skippedPacks",
		field: <code>skippedPacks</code>,
		meaning: (
			<>
				Présent seulement quand un pack de <code>engineOptions.packs</code> ne s’est pas exécuté :
				chacun sous la forme <code>{"{ name, reason }"}</code>, <code>name</code> valant{" "}
				<code>null</code> quand le pack n’en avait pas. Dans une page (
				<code>runa11yCoreInPage</code>), <code>name</code> est le <code>name@version</code> fourni,
				et la raison indique pourquoi la page ne l’a pas exécuté : aucun appel à{" "}
				<code>packScript</code> n’a enregistré exactement l’ensemble nommé, ou le script a été
				préparé avec une autre version de core. Chacun est aussi journalisé avec{" "}
				<code>console.warn</code>.
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
						règle composite ; ou une règle valide que la sélection de l’exécution ne retient pas (sous
						un profil ou une cible WCAG, une règle portant le tag <code>best-practice</code> ou sans
						tag WCAG), dont la <code>reason</code> indique comment la sélectionner. Toujours un tableau ; vide lorsque toutes les règles personnalisées ont été
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
				<code>helpers.buildSelector</code> dans <code>RULE_AUTHORING.md</code>). Un id, un test id,
				un <code>name</code> ou un <code>aria-label</code> ne sert de point d’ancrage que lorsqu’aucun
				autre élément du document ne le porte, éléments masqués, exclus et hors périmètre compris,
				puisque <code>querySelector</code> le résout sur tout le document ; sinon, le sélecteur est
				un chemin. Son unicité n’est pas garantie pour toutes les structures DOM : un élément situé
				dans une shadow root est nommé dans son propre arbre (<code>structuralPath</code> le situe),
				et le chemin d’un élément très profond est raccourci par le haut. Sur 255 pages de test et
				pages réelles, 15 des 39 857 sélecteurs ne désignaient pas exactement leur élément, tous
				de ces types. L’exception est une règle
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
				du résultat lui-même est le niveau de l’occurrence. Le résultat concorde toujours avec les
				niveaux : toute occurrence de niveau <code>fail</code> le rend <code>fail</code>, et un{" "}
				<code>fail</code> dont toutes les occurrences sont de niveau <code>cantTell</code> devient{" "}
				<code>cantTell</code>, si bien que SARIF, JUnit, EARL et les baselines donnent une seule
				réponse. Le moteur tranche pour une règle personnalisée ou de pack qui les renvoie en
				désaccord ; sous la politique par défaut, une règle manuelle n’est jamais <code>fail</code>.
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
	{ id: "fail", outcome: <code>fail</code>, meaning: "La règle signale que l’exigence qu’elle vérifie n’est pas satisfaite. Lisez sa correspondance, sa confiance et ses occurrences pour interpréter le constat.", manual: "Non, sous la politique par défaut (converti en cantTell)" },
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
					"    version: string,       // the @surea11y/core release that produced the result",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2",',
					'    profile?: string,      // "wcag22-aa", "en301549-v4.1.1", "en301549-v3.2.1", "section508", or a registered standard\'s own',
					'    mappings?: string[],   // e.g. ["en301549"] or ["en301549:V3.2.1"]',
					"    profileExcludes?: { rules: string[], criteria: string[] },",
					"    optInRules?: string[],",
					'    outputDetail?: "findings",',
					"    packs?: string[],      // name@version",
					"    environment: {",
					"      layout: boolean,",
					"      viewport?: { width: number, height: number },  // CSS px",
					"      devicePixelRatio?: number,",
					'      colorScheme?: "light" | "dark",',
					'      fonts?: "loaded" | "loading",',
					'      images?: "loaded" | "loading",',
					"      animationsSettled?: number",
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
					"  standards?: Array<{ key: string, standard: string, titleLang?: string, note?: string }>,",
					"  overriddenBuiltinIds: string[],",
					"  skippedCustomRules: Array<{ id: string | null, reason: string }>,",
					"  skippedPacks?: Array<{ name: string | null, reason: string }>",
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
					"    | { url: string | null, selector: string | null, title: string | null,",
					"        topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, selector: string | null, title: string | null, error: string }",
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
					<code>&lt;frame&gt;</code> enfant direct dans le périmètre analysé (shadow roots ouvertes
					comprises, ainsi que le périmètre lui-même quand c’est un frame), sauf un frame que la page
					n’affiche pas et un frame qu’exclut <code>excludeSelectors</code>, qui sont écartés avec
					tout leur document. Chaque entrée nomme son élément frame : <code>selector</code> est un
					sélecteur CSS de l’<code>&lt;iframe&gt;</code>/<code>&lt;frame&gt;</code> dans le document
					parent, et <code>title</code> est l’attribut <code>title</code> de l’élément, ou{" "}
					<code>null</code>, si bien que des frames qui chargent le même document se distinguent.{" "}
					<code>url</code> est le document qu’affiche le frame ou, pour un frame qui n’a pas encore
					navigué, son <code>src</code>. Un enfant
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
						<strong>Les générateurs de rapports prennent l’arbre tel quel.</strong>{" "}
						<code>renderHtmlReport</code>, <code>renderSarifReport</code>,{" "}
						<code>renderJunitReport</code>, <code>buildBaselineEntries</code>,{" "}
						<code>matchBaseline</code> et <code>renderEarlReport</code> en rapportent chaque frame :
						chaque frame qui a répondu, avec ses propres constats, localisés dans son propre
						document, et chaque frame qui n’a pas répondu comme non analysé, pour que le trou dans
						la couverture ne se lise pas comme une réussite. Un frame est nommé par son{" "}
						<strong>chemin</strong>, les <code>selector</code> des éléments frame qui y mènent
						depuis la page, du plus extérieur au plus intérieur (
						<code>#checkout → iframe:nth-of-type(2)</code>). Ils lèvent une <code>TypeError</code>{" "}
						pour tout ce qui n’est ni un résultat d’analyse ni un résultat multi-frames (un tableau,{" "}
						<code>null</code> ou <code>undefined</code> issu d’une analyse qui a échoué), au lieu de
						le présenter comme une analyse qui n’a rien trouvé.
					</li>
					<li>
						<strong>Ils acceptent aussi l’analyse de frames d’un binding.</strong> Le{" "}
						<code>.frames(true)</code> des bindings navigateur renvoie{" "}
						<code>{"{ topFrame, frames }"}</code>, chaque frame étant un résultat simple (ou{" "}
						<code>{"{ url, error }"}</code>) plutôt qu’une entrée imbriquée ; les générateurs de
						rapports, <code>getMargins</code> et <code>flattenCrossFrameResult</code> lisent chacun de
						ces frames comme analysé, nommé par le chemin <code>['iframe']</code>, puisqu’il ne porte
						pas de <code>selector</code>.
					</li>
					<li>
						<code>flattenCrossFrameResult(result)</code>, de <code>@surea11y/core</code>, liste les
						frames tels que les lisent les générateurs de rapports :{" "}
						<code>{"[{ frame: { path, title, url }, result }]"}</code>, ou <code>error</code> à la
						place de <code>result</code> pour un frame qui n’a pas répondu, la page d’abord et chaque
						frame avant les frames qu’il contient. Le <code>path</code> de la page est{" "}
						<code>[]</code>. Un résultat d’analyse simple donne une seule entrée.
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
					'  ruleSeverity?: "minor" | "moderate" | "serious" | "critical", // the rule\'s own, when a profile gave it another',
					'  policyOutcome?: "pass" | "fail" | "cantTell" | "notApplicable", // what the rule found, when the policy made it cantTell',
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
					"    helpUrl: string,       // where to read how to fix it; \"\" when there is none",
					"    tags: string[],        // the rule's tags, its own and the engine's",
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string,",
					"      conformanceLevel?: string, wcagSc?: string[], url?: string, understandingUrl?: string }>,",
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
					"  error?: string           // present when the rule did not complete, or the engine noted a change — see below",
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
					<strong>Sous la politique par défaut <code>a11y</code>, les règles{" "}
					<code>type: "manual"</code> renvoient <code>cantTell</code> plutôt que{" "}
					<code>fail</code>.</strong>{" "}
					Si la logique propre d’une règle manuelle aurait conclu à <code>fail</code>, le moteur
					le convertit en <code>cantTell</code> et ajoute une note explicative à{" "}
					<code>error</code>. Ce comportement est imposé de façon centralisée (
					<code>policy.coerceManualFailToCantTell</code>, activé par défaut sous le contrat de
					politique <code>a11y</code> ; voir{" "}
					<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>), et ce n’est pas à chaque
					règle d’y penser. Sous cette politique, <code>fail</code> est réservé aux constats déterministes{" "}
					<code>type: "automatic"</code> uniquement.
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong> est ce qui relie un résultat de
					vérification à un critère de succès WCAG. Une liste vide signifie que la règle n’a
					aucune correspondance formelle dans ce résultat. Elle ne dit pas si la règle est
					automatique ou manuelle : c’est <code>type</code> qui l’indique (
					<code>aria-allowed-role</code>, par exemple, est automatique et n’a aucune
					correspondance WCAG). Voir{" "}
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
						<code>{"[{ ruleId, ...margin }]"}</code>, triées par <code>ruleId</code> ; pour un
						résultat multi-frames, celles de chaque frame, celles d’un frame enfant avec{" "}
						<code>frame</code>, le chemin qui y mène.
					</li>
				<li>
					<strong><code>error</code></strong> : présent quand la règle ne s’est pas terminée, ou
					quand le moteur a modifié ou ignoré une partie de ce que la règle a renvoyé. Une règle qui
					a levé une exception (ou renvoyé quelque chose qui n’est pas un résultat) apparaît
					toujours sous la forme <code>outcome: "cantTell"</code> avec <code>occurrences: []</code>{" "}
					et <code>error</code> contenant le message de l’exception : <code>cantTell</code> sans
					occurrence et avec une <code>error</code> permet donc de reconnaître une règle qui ne
					s’est pas terminée ; le moteur ne laisse jamais une règle défaillante faire planter toute
					l’analyse. Sinon, <code>error</code> contient les notes du moteur, jointes par{" "}
					<code>|</code> après toute <code>error</code> que la règle a elle-même renvoyée : la
					conversion des échecs manuels décrite ci-dessus, un <code>outcome</code> ou une{" "}
					<code>severity</code> hors de son ensemble, un <code>type</code> différent de celui de son
					meta, des occurrences qui ne sont pas des objets (écartées), un <code>policyOutcome</code>{" "}
					ou un <code>ruleSeverity</code> renvoyé par la règle (non retenu : le moteur définit les
					deux), un <code>uncertainty.code</code> hors de l’ensemble fermé, et un <code>fail</code>{" "}
					ramené à <code>cantTell</code> parce que le parcours des ancêtres, limité à 200 étapes,
					s’est arrêté avant chacun des éléments signalés. Ces résultats gardent leurs
					occurrences : la règle s’est terminée.
				</li>
				<li>
					<strong><code>policyOutcome</code></strong> : présent quand les{" "}
					<code>allowedOutcomes</code> de la politique n’autorisent pas le résultat trouvé par la
					règle. Le résultat est alors <code>cantTell</code>, avec ici le résultat propre de la
					règle et sans <code>error</code>, pour que les générateurs de rapports ne le lisent pas
					comme une règle qui ne s’est pas terminée.
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
				Un <code>fail</code> en a toujours au moins une : le <code>fail</code> d’une règle
				personnalisée qui ne nomme aucun élément en reçoit une sur l’élément du document (
				<code>selector: "html"</code>, code de raison <code>FAIL_WITHOUT_OCCURRENCE</code>).
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
				donc le moteur le retire. Une incertitude dont le <code>code</code> ne fait pas partie des
				codes ci-dessous est également écartée, et l’<code>error</code> de la règle nomme ce code.
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
					"      checksIds: string[],      // every atomic ruleId it rolls up, custom rules mapped to its criteria included",
					"      customChecksIds?: string[], // the custom rules among them; absent when none",
					"      contributors: Array<{ testId: string, outcome: string, severity?: string | null, custom?: true }>,",
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
			<p>
				Les règles d’une agrégation WCAG sont sa propre liste plus chaque règle de{" "}
				<code>engineOptions.customRules</code> qui s’est exécutée et qui est associée à l’un de ses
				critères (par <code>meta.wcagSc</code> ou une entrée WCAG dans{" "}
				<code>meta.normativeMappings</code>), marquée <code>custom: true</code> parmi les
				contributrices et listée dans <code>customChecksIds</code>, pour qu’un lecteur voie quand une
				règle personnalisée a déterminé le résultat. Les agrégations propres à une norme gardent
				leurs listes.
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
				Dans les règles intégrées à core, <code>fail</code> est volontairement le résultat le plus
				étroit et le plus exigeant : il est réservé aux violations normatives déterministes ;{" "}
				<strong>la recherche de couverture ne doit jamais le diluer</strong>.
			</p>

			<h2>Valeurs de sévérité et de confiance</h2>
			<ul>
				<li>
					<code>severity</code> : <code>minor</code> &lt; <code>moderate</code> &lt;{" "}
					<code>serious</code> &lt; <code>critical</code> ; l’évaluation par l’auteur de la
					règle de l’impact sur les utilisateurs, indépendante de <code>confidence</code>. Un profil
					peut donner une autre gravité à une règle (le <code>severity</code> d’un profil dans une
					norme ou dans la liste de contrôle d’un pack) : sous ce profil, le résultat affiche celle du
					profil, garde celle de la règle dans <code>ruleSeverity</code> (présent seulement dans ce
					cas), et les agrégations prennent celle du profil.
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
				<code>video-poster-text-alternative-present</code>, <code>target-size-minimum</code> et{" "}
				<code>text-spacing-content-loss</code>.{" "}
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
					'          "hint": "Give the button visible text, or name it with aria-label, so screen reader users know what it does.",',
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
					'          "summary": "This <img> has no alt attribute.",',
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
