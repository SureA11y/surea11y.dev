import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const optionRows = [
	{
		id: "strictOptions",
		option: <code>strictOptions</code>,
		meaning: (
			<>
				Par défaut <code>false</code>. <code>true</code> vérifie chaque option avant l’analyse, et
				lève <code>INVALID_ENGINE_OPTIONS</code> pour une clé que le moteur ne lit pas ou une
				valeur de mauvais type ou hors de son ensemble ; voir{" "}
				<a href="#catching-mistakes-in-the-options-strictoptions">« Repérer les erreurs dans les options »</a>{" "}
				ci-dessous.
			</>
		),
	},
	{
		id: "locale",
		option: <code>locale</code>,
		meaning: (
			<>
				N’importe quelle chaîne. Un code avec une sous-étiquette se rabat d’abord sur sa langue de
				base, donc <code>de-DE</code> utilise <code>de</code> ; à défaut, l’anglais. Chaque chaîne
				se rabat ensuite de la même façon (langue choisie → <code>en</code> → texte anglais
				littéral de la règle), si bien qu’une langue partiellement traduite ne produit jamais de
				texte manquant. Rien de tout cela ne se voit dans les chaînes elles-mêmes, donc le
				résultat indique ce qui s’est réellement passé dans <code>engine.locale</code> :
				consultez-le si vous devez savoir si vous avez obtenu la langue demandée. Voir{" "}
				<a href="/configuration/locales/">Langues</a>.
			</>
		),
	},
	{
		id: "wcagVersion",
		option: <code>wcagVersion</code>,
		meaning: (
			<>
				<code>'2.0'</code>, <code>'2.1'</code> ou <code>'2.2'</code> : la version de WCAG par
				rapport à laquelle l’exécution teste la conformité. Par défaut, celle que nomme le profil
				de pack appliqué (son <code>wcagVersion</code>), sinon celle qu’impliquent vos tags
				d’origine de version, et <code>'2.2'</code> s’ils n’impliquent rien.{" "}
				<strong>
					Elle ne change actuellement qu’une chose, le critère 4.1.1 Analyse syntaxique, retiré
					en 2.2
				</strong> : avec une cible 2.2, une règle portant le tag <code>wcag22-removed</code> s’exécute
				toujours et signale toujours ses occurrences, mais ne peut pas renvoyer{" "}
				<code>fail</code> (voir{" "}
				<a href="#filtering-by-wcag-version">« Filtrer par version de WCAG »</a> plus haut).
				Toute autre valeur, quel que soit son type (le nombre <code>2.1</code>, <code>'3.0'</code>),
				est ignorée avec un <code>console.warn</code> qui nomme la version visée à la place par
				l’exécution.
			</>
		),
	},
	{
		id: "wcagLevel",
		option: <code>wcagLevel</code>,
		meaning: (
			<>
				Facultatif : <code>'A'</code>, <code>'AA'</code> ou <code>'AAA'</code>, quelle que soit la
				casse. Le niveau WCAG des critères que rapporte une exécution. Les agrégations WCAG
				au-dessus de ce niveau sont omises de <code>rulesResults</code> tandis que leurs règles
				s’exécutent toujours ; l’option ne change jamais ce qui s’exécute. Elle l’emporte sur le
				niveau qu’implique la sélection ; une agrégation nommée par son id est rapportée telle que
				nommée. Renvoyé dans <code>engine.wcagLevel</code>, qui, sans l’option, contient le niveau
				qu’implique la sélection, s’il y en a un. Toute autre valeur est ignorée avec un{" "}
				<code>console.warn</code>, et lève une erreur avec <code>strictOptions</code>. Voir{" "}
				<a href="#giving-the-level-of-a-scan-that-names-checks-wcaglevel">
					« Donner le niveau d’une analyse qui nomme des vérifications »
				</a>{" "}
				plus haut.
			</>
		),
	},
	{
		id: "profile",
		option: <code>profile</code>,
		meaning: (
			<>
				Cible de conformité nommée, facultative : <code>'wcag22-aa'</code>,{" "}
				<code>'en301549-v4.1.1'</code>, <code>'en301549-v3.2.1'</code>, <code>'section508'</code>{" "}
				ou celle d’un pack.
				Sélectionne les règles d’après le jeu de tags correspondant quand rien d’autre n’en inclut,
				et la cible WCAG découle de ces tags. Renvoyée dans <code>engine.profile</code> quand elle a
				pris effet ; sinon ignorée avec un avertissement dans la console. Voir{" "}
				<a href="#conformance-profiles">« Profils de conformité »</a> ci-dessus.
			</>
		),
	},
	{
		id: "mappings",
		option: <code>mappings</code>,
		meaning: (
			<>
				Normes facultatives autres que WCAG dont <code>meta.normativeMappings</code> nomme les
				exigences : <code>'en301549'</code>, <code>'en301549:V3.2.1'</code> ou{" "}
				<code>'en301549:V4.1.1'</code>, ou la clé de la norme d’un pack, sous forme de tableau ou
				de chaîne séparée par des virgules.
				Aucune par défaut : les résultats ne nomment alors que WCAG ; un profil EN 301 549 ajoute sa
				propre version. Renvoyé dans <code>engine.mappings</code> quand une norme s’applique. Voir{" "}
				<a href="#other-standards-mappings">« Autres normes »</a> ci-dessus.
			</>
		),
	},
	{
		id: "logUntestedWcag",
		option: <code>logUntestedWcag</code>,
		meaning: (
			<>
				Par défaut <code>true</code>. <code>false</code> omet la note <code>console.info</code>{" "}
				pour un tag de version et de niveau WCAG qu’aucune règle ne porte (<code>wcag22a</code>),
				dans une liste d’inclusion à côté d’autres tags ; voir{" "}
				<a href="#via-runonly-4th-argument">« Avec runOnly »</a> ci-dessus.
			</>
		),
	},
	{
		id: "optInRules",
		option: <code>optInRules</code>,
		meaning: (
			<>
				Facultatif : <code>'all'</code>, ou une liste de tags de règles optionnelles, sous forme de
				tableau ou de chaîne séparée par des virgules. Débloque ces règles hors du profil de leur
				norme ; le reste de la sélection décide toujours de ce qui s’exécute. Renvoyé dans{" "}
				<code>engine.optInRules</code> quand il a exécuté une règle que la sélection n’aurait pas
				exécutée autrement ; les tags inconnus sont ignorés avec un avertissement dans la console.
				Voir <a href="#running-every-rule-optinrules">« Exécuter toutes les règles »</a> ci-dessus.
			</>
		),
	},
	{
		id: "messages",
		option: <code>messages</code>,
		meaning: (
			<>
				<code>{"{ [locale]: { key: text } }"}</code> facultatif. Consulté avant les tables propres
				au moteur, il peut donc remplacer des chaînes individuelles ou fournir une langue que le
				build n’embarque pas. Les clés omises se rabattent normalement, donc un remplacement
				partiel ne pose aucun problème. C’est ainsi que le bundle navigateur autonome reçoit un
				fichier de langue séparé, et c’est le seul moyen de faire entrer un dictionnaire dans le
				contexte d’une page, puisque le runner in-page est sérialisé et ne peut pas lire de
				fichiers. Contrairement aux autres options, elle n’est pas renvoyée dans
				l’<code>engineOptions</code> de chaque résultat ; <code>engine.locale</code> indique le
				dictionnaire utilisé. Voir <a href="/configuration/locales/">Langues</a>.
			</>
		),
	},
	{
		id: "includeHiddenElements",
		option: <code>includeHiddenElements</code>,
		meaning: (
			<>
				Par défaut <code>false</code> : les requêtes des helpers excluent les éléments masqués
				par des mécanismes structurels/CSS comme <code>display:none</code>, <code>[hidden]</code>,
				un <code>&lt;details&gt;</code> fermé (tout sauf son premier <code>&lt;summary&gt;</code>,
				à toute profondeur), le contenu en <code>content-visibility:hidden</code> et en{" "}
				<code>hidden="until-found"</code>, le contenu d’un sous-arbre <code>[inert]</code> (que les
				règles portant sur l’apparence du contenu, comme le contraste et l’espacement du texte,
				jugent toujours, puisqu’il est dessiné), et les éléments hôtes masqués servant uniquement au
				rendu (leurs descendants sont exclus aussi). <code>runa11yCoreAcrossFrames</code>{" "}
				n’analyse pas un frame masqué de cette façon. Passez-la à <code>true</code> pour inclure
				ces sous-arbres masqués/repliés dans l’évaluation (comportement historique/balisage
				statique). Elle élargit ce que renvoient les requêtes partagées ; la plupart des règles ne
				jugent toutefois que ce qui figure dans l’arbre d’accessibilité, puisqu’un élément masqué
				n’a ni nom ni rôle à vérifier, et pour elles cela ne change rien. Elle compte pour les
				règles qui portent sur le balisage lui-même, comme une référence d’ID cassée.
			</>
		),
	},
	{
		id: "includeShadowDom",
		option: <code>includeShadowDom</code>,
		meaning: (
			<>
				Par défaut <code>true</code> : les règles qui utilisent <code>helpers.queryAllSmart</code>{" "}
				descendent dans les shadow roots ouvertes. Passez <code>false</code> pour n’analyser que
				le light DOM.{" "}
				<strong>Les shadow roots fermées ne sont jamais accessibles, dans un cas comme dans
				l’autre</strong> : aucune API DOM ne les expose. Un élément dont le nom pourrait provenir
				d’un élément personnalisé sans contenu lisible par le moteur (un bouton, un lien, un
				élément de menu, une option, un onglet, un élément d’arbre, un summary ou une infobulle)
				fait l’objet d’une question (<code>cantTell</code>, <code>name_closedContent</code>), et
				non d’un échec.
			</>
		),
	},
	{
		id: "fragment",
		option: <code>fragment</code>,
		meaning: (
			<>
				Par défaut <code>false</code>. Quelques règles vérifient la présence d’une propriété qui
				existe une fois par page réelle (<code>page-title-present</code>,{" "}
				<code>html-lang-attr-present</code>, <code>html-xml-lang-mismatch</code>,{" "}
				<code>aria-hidden-body</code>, <code>css-orientation-lock</code>,{" "}
				<code>meta-refresh-no-exceptions</code>, <code>meta-refresh-timing-absent</code>,{" "}
				<code>meta-viewport-zoom-enabled</code>, <code>meta-viewport-large</code>,{" "}
				<code>page-title-patterns</code>, <code>region</code>,{" "}
				<code>bypass-blocks-present</code>, <code>landmark-one-main</code>,{" "}
				<code>page-has-heading-one</code>) et renvoient à juste titre <code>notApplicable</code>{" "}
				pour ces propriétés dès que <code>contextSelector</code> a restreint l’exécution à moins
				que le document entier (<code>document.documentElement</code> ne figure plus parmi les
				racines résolues), puisqu’on n’a jamais attendu d’un sous-arbre ciblé qu’il porte son
				propre <code>&lt;title&gt;</code>/<code>&lt;html lang&gt;</code>/etc. Passez{" "}
				<code>fragment: true</code> pour le cas que le ciblage seul ne peut pas détecter : une
				cible d’analyse qui est le document fourni <em>tout entier</em>, mais qui n’a jamais été
				censée représenter une vraie page (par exemple un extrait de composant brut parsé
				isolément). Cela impose le même filtrage <code>notApplicable</code> même sans ciblage.
			</>
		),
	},
	{
		id: "excludeSelectors",
		option: <code>excludeSelectors</code>,
		meaning: (
			<>
				Les éléments qui correspondent à l’un de ces sélecteurs (ainsi que leurs descendants, y
				compris le contenu de leurs shadow roots et les documents des frames qu’ils contiennent)
				sont entièrement ignorés, pour <strong>toutes</strong> les règles. Utile pour les bannières
				de cookies, les contenus tiers intégrés ou les widgets connus pour être bruyants que vous ne
				maîtrisez pas. Pour exclure un élément d’une seule règle, utilisez plutôt{" "}
				<code>rules[ruleId].excludeSelectors</code> ci-dessous. Un tableau de sélecteurs, ou une
				chaîne contenant une liste de sélecteurs : <code>'#cookie-banner, img:not(.a, .b)'</code>{" "}
				équivaut à <code>['#cookie-banner', 'img:not(.a, .b)']</code>, puisque la chaîne n’est
				coupée qu’aux virgules qui séparent les sélecteurs. Chaque sélecteur s’applique
				séparément : un sélecteur qui n’est pas du CSS valide n’exclut rien, avec un{" "}
				<code>console.warn</code>, et les autres s’appliquent toujours.
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				Transmis tel quel au champ <code>timestamp</code> de premier niveau du résultat ; le
				moteur n’en génère pas lui-même (déterministe par conception). Une valeur qui n’est pas une
				chaîne (une <code>Date</code>, un nombre) est ignorée avec un <code>console.warn</code> ;
				passez <code>new Date().toISOString()</code>.
			</>
		),
	},
	{
		id: "contrast-mode",
		option: <code>contrast.mode</code>,
		meaning: (
			<>
				<code>strictConformance</code> (par défaut) : les règles de contraste restent muettes (
				<code>notApplicable</code>/ignorées) chaque fois que l’arrière-plan réellement rendu ne
				peut pas être calculé avec certitude, pour éviter les faux <code>fail</code>.{" "}
				<code>auditorAssist</code> : sacrifie une partie de cette marge de sécurité pour obtenir
				davantage de constats ; conçu pour un auditeur humain qui revérifiera les cas signalés,
				pas pour un contrôle en CI sans supervision.
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				La couleur d’arrière-plan supposée pour la page lorsqu’elle n’est pas calculable du tout.
				Ne compte qu’en mode <code>auditorAssist</code>. Dans un navigateur, une page sans
				arrière-plan opaque propre est mesurée sur le canevas que le navigateur peint derrière
				elle, dans les deux modes : blanc, ou le canevas sombre pour une page qui demande un schéma
				de couleurs sombre (<code>color-scheme: dark</code> sur la racine, ou sa forme{" "}
				<code>&lt;meta&gt;</code>). La valeur de repli s’applique là où le canevas n’est pas lu :
				sous jsdom, et dans un frame, dont le canevas peut laisser transparaître la page parente
				(un frame qui demande un schéma sombre est mesuré sur le canevas sombre). Ce doit être une couleur opaque : toute autre valeur est mesurée comme du blanc, avec
				un avertissement.
			</>
		),
	},
	{
		id: "visibilityMode",
		option: <code>visibilityMode</code>,
		meaning: (
			<>
				Détermine le degré d’exigence des trois règles de contraste (<code>contrast-minimum</code>,{" "}
				<code>contrast-enhanced</code>, <code>contrast-computable</code>) pour décider qu’un nœud
				texte est réellement éligible à la vérification.{" "}
				<strong>Aucune autre règle ne la lit.</strong> Non définie (par défaut), elle vaut{" "}
				<code>'styleAndGeometry'</code> là où la page a une mise en page, c’est-à-dire dans toute
				analyse en navigateur, et <code>'styleOnly'</code> là où elle n’en a pas (jsdom) : un
				lecteur ne voit que le texte dessiné à un endroit visible, ce que seule la mise en page
				permet de savoir. <code>'styleOnly'</code> : l’éligibilité repose uniquement sur le CSS (<code>display</code>,{" "}
				<code>visibility</code>, <code>opacity</code>, masquage par un ancêtre, etc.).{" "}
				<code>'styleAndGeometry'</code> : ajoute par-dessus de vraies vérifications de mise en
				page (<code>getClientRects()</code>/<code>getBoundingClientRect()</code>) ; le texte sans
				client rects, ou de largeur/hauteur nulle, est lui aussi exclu, de même que le texte situé
				entièrement au-dessus ou à gauche de la page, qu’aucun défilement n’atteint (la technique{" "}
				<code>left: -9999px</code>), et le texte qu’un ancêtre en <code>overflow: hidden</code>{" "}
				ou <code>clip</code> coupe entièrement (<code>height: 0; overflow: hidden</code>, une
				diapositive de carrousel hors de vue). Une boîte qui défile (<code>auto</code>,{" "}
				<code>scroll</code>) n’exclut pas son texte, puisqu’un lecteur peut l’atteindre. Les
				options d’un <code>&lt;select&gt;</code> sont jugées d’après la place de leur{" "}
				<code>&lt;select&gt;</code> dans la page. Dans les deux modes, le texte de taille de police 0 ou de couleur entièrement transparente est
				exclu, puisque rien n’est dessiné ; le texte transparent qui laisse voir un arrière-plan à
				travers ses glyphes (<code>background-clip: text</code>) ne l’est pas, et fait l’objet
				d’une question. Définissez <code>'styleOnly'</code> dans un navigateur pour vérifier le
				texte à partir des seuls styles calculés, comme le faisaient les versions précédentes ;
				sous jsdom seul (<code>runDomRulesInPage</code>), il n’y a pas de vrai
				moteur de mise en page, donc <code>'styleAndGeometry'</code> ajoute surtout des
				vérifications de taille nulle via <code>getBoundingClientRect()</code>, pas une vraie
				détection du rognage ou du débordement (voir les{" "}
				<a href="/help/known-limitations/">limites connues</a>).
			</>
		),
	},
	{
		id: "policyContract",
		option: <code>policyContract</code> ,
		meaning: (
			<>
				Voir <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> : détermine quelles
				valeurs de résultat/confiance sont autorisées et si les <code>fail</code> que
				produiraient les règles manuelles sont convertis en <code>cantTell</code>.
			</>
		),
	},
	{
		id: "output",
		option: (
			<>
				<code>output.includeSelector</code> / <code>.includeHtml</code>
			</>
		),
		meaning: (
			<>
				Désactive le remplissage automatique de <code>selector</code>/<code>html</code> par le
				moteur. Depuis que toutes les règles ont été migrées pour signaler leur élément plutôt
				que construire leurs occurrences à la main (1.5.0), ce remplissage est le chemin que
				suivent presque toutes les règles : définir{" "}
				<code>includeSelector: false</code> / <code>includeHtml: false</code> retire les
				sélecteurs et les extraits HTML de presque toutes. Quelques-unes
				assemblent encore ces champs elles-mêmes dans <code>runInPage</code> et ne sont pas
				concernées, parmi lesquelles <code>contrast-minimum</code>/<code>contrast-enhanced</code>{" "}
				(dont les constats portent sur des segments de texte, pas sur des éléments),{" "}
				<code>page-title-present</code> et <code>identical-links-same-purpose</code>.{" "}
				<strong>Cela réduit donc nettement la sortie, mais ne garantit toujours pas l’absence{" "}
				<em>totale</em> de sélecteurs ou de HTML dans le résultat.</strong>
			</>
		),
	},
	{
		id: "output-detail",
		option: <code>output.detail</code>,
		meaning: (
			<>
				<code>'full'</code> (par défaut) ou <code>'findings'</code> : un résultat plus léger, qui
				ne garde complets que les résultats de vérification qui signalent quelque chose (
				<code>fail</code>, <code>cantTell</code>, et tout résultat qui liste des occurrences) ;
				chaque autre <code>pass</code> et <code>notApplicable</code> garde son <code>ruleId</code>,
				son <code>outcome</code> et son <code>type</code>, ainsi que sa <code>margin</code> ou son{" "}
				<code>error</code> s’il en a. Les agrégations et les verdicts ne changent pas, et les
				reporters le lisent comme un résultat complet. Une règle que le catalogue de core ne
				pourrait pas compléter reste complète : chaque règle d’une analyse avec{" "}
				<code>packs</code>, une règle personnalisée, et une règle que les <code>messages</code> de
				l’analyse reformulent. Voir{" "}
				<a href="/results-reports/output-schema/#top-level-result"><code>engine.outputDetail</code></a> ;
				en TypeScript, un tel résultat est un <code>CompactScanResult</code>.
			</>
		),
	},
	{
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				Transmis à cette règle sous la forme <code>ctx.config</code> et, pour{" "}
				<code>excludeSelectors</code> en particulier, lu par le moteur lui-même avant même que la
				règle s’exécute. Voir{" "}
				<a href="#rule-scoped-excludeselectors">« excludeSelectors par règle »</a> ci-dessous.
				Toute autre clé est simplement transmise : <strong>aucune règle livrée n’en tire quoi que
				ce soit d’autre.</strong> Les paramètres déclarés par une règle, comme les seuils de{" "}
				<code>contrast-minimum</code>, sont ceux de sa norme : une valeur fournie par l’appelant
				est donc ignorée, et un résultat qui nomme WCAG 1.4.3 est toujours décidé à 4,5:1. Une
				norme qui a d’autres seuils a sa propre règle, une variante, qu’un{" "}
				<a href="/configuration/packs/">pack</a> peut apporter. Une clé est reconnue comme l’est un
				identifiant de règle, quelle que soit la casse ou avec l’ancien préfixe{" "}
				<code>a11ycore-</code> ; une clé qui ne nomme aucune règle de l’analyse déclenche un
				avertissement avec l’identifiant le plus proche.
			</>
		),
	},
	{
		id: "packs",
		option: <code>packs</code>,
		meaning: (
			<>
				Packs facultatifs issus de <code>@surea11y/core/pack</code> : des règles, des variantes
				des règles de core, une norme ou une liste de contrôle et des messages venus de l’extérieur
				de core, qui rejoignent l’analyse. Une liste : les objets pack pour{" "}
				<code>runDomRulesInPage</code> et les fonctions de catalogue dans Node, et pour{" "}
				<code>runa11yCoreInPage</code> le <code>name@version</code> des packs qu’un{" "}
				<code>packScript</code> a enregistrés dans la page. Toute autre valeur n’exécute aucun pack,
				avec un avertissement, et lève une erreur avec <code>strictOptions</code>, avec{" "}
				<code>code: 'INVALID_ENGINE_OPTIONS'</code>. Renvoyé dans <code>engine.packs</code>. Voir <a href="/configuration/packs/">Packs</a>.
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				Un objet de preuves facultatif, sérialisable en JSON, que fournit votre application hôte,
				pour ce que l’analyse d’une seule page ne peut pas voir, comme les autres pages du site. Le
				moteur le plafonne avant que les règles ne le lisent (<code>ctx.inputs.probes</code>) : six
				niveaux de profondeur, 200 éléments par tableau, 50 clés par objet, 2 000 caractères par
				chaîne. <code>page-title-patterns</code> lit <code>crawl.pageTitles</code> (
				<code>{"{ pages: [{ url, title }] }"}</code>) pour repérer les titres génériques et issus
				de gabarits sur tout un site. Les règles d’un pack peuvent lire leurs propres probes, que
				le pack documente.
			</>
		),
	},
	{
		id: "perfStats",
		option: (
			<>
				<code>perfStats</code> / <code>profileRules</code>
			</>
		),
		meaning: (
			<>
				Réservé au débogage. <code>perfStats: true</code> renvoie des compteurs internes dans le
				champ <code>perfStats</code> du résultat ; <code>profileRules: true</code> y ajoute{" "}
				<strong>en plus</strong> une ventilation des temps par règle. <code>profileRules</code>{" "}
				seul ne fait rien : c’est <code>perfStats</code> qui crée l’objet dans lequel figure
				cette ventilation.{" "}
				<strong>Sa forme ne fait pas partie du contrat de sortie stable : ne construisez rien
				dessus.</strong> Notez aussi que <code>profileRules</code> est la seule option qui rend
				la sortie non déterministe : les compteurs sont stables d’une exécution identique à
				l’autre, les temps mesurés ne le sont pas. Laissez-la désactivée si vous comparez des
				résultats entre exécutions. Avec <code>profileRules</code>, les caches partagés (styles
				calculés et éligibilité dans l’arbre d’accessibilité) sont remplis avant la première règle
				et chronométrés à part dans <code>perfStats.warmUpMs</code>, pour que leur coût ne soit pas
				imputé à la première règle qui parcourt la page.
			</>
		),
	},
	{
		id: "frameWaitTime",
		option: (
			<>
				<code>pingWaitTime</code> / <code>frameWaitTime</code>
			</>
		),
		meaning: (
			<>
				Lues uniquement par <code>runa11yCoreAcrossFrames</code> (voir{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				) : combien de temps attendre qu’un frame enfant réponde à un ping (par défaut{" "}
				<code>500</code> ms) et à une requête d’exécution complète (par défaut{" "}
				<code>60000</code> ms) avant de le considérer comme injoignable. Ignorées par{" "}
				<code>runDomRulesInPage</code>/<code>runa11yCoreInPage</code>.
			</>
		),
	},
];

export function EngineOptionsContent() {
	return (
		<>
			<p>
				Tous les runners (<code>runDomRulesInPage</code>, <code>runa11yCoreInPage</code>) prennent
				les mêmes quatre arguments : <code>(pageUrl, contextSelector, engineOptions, runOnly)</code>.
				Cette page documente <code>engineOptions</code> et <code>runOnly</code> dans leur
				intégralité. Pour vérifier une page au regard d’une version et d’un niveau WCAG, commencez
				par <a href="#selecting-by-wcag-target-runonlywcag"><code>runOnly.wcag</code></a>.
			</p>

			<h2 id="selecting-which-rules-run">Choisir les règles à exécuter</h2>
			<p>
				Nommez ce au regard de quoi vous testez, et le moteur choisit les règles. Sans sélection,
				ce sont les règles par défaut qui s’exécutent : toutes les règles sauf les règles optionnelles d’une norme ou d’un pack, qui ne s’exécutent qu’une fois débloquées (voir <a href="#opt-in-rules">Règles optionnelles</a>).
			</p>
			<DataTable
				label="Choisir ce qui s’exécute"
				rowKey="id"
				columns={[
					{ key: "run", label: "Pour exécuter", wrap: true },
					{ key: "pass", label: "Passez", wrap: true },
				]}
				rows={[
					{ id: "all", run: "Les règles par défaut : toutes les règles sauf les règles optionnelles non débloquées", pass: <>rien : <code>runOnly</code> <code>null</code></> },
					{
						id: "wcag",
						run: "Une cible de conformité WCAG : les règles des critères d’une version à un niveau et en dessous",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code>,
					},
					{
						id: "wcag-bp",
						run: "La même chose, plus les règles de bonnes pratiques, qui ne testent aucun critère WCAG",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' }, bestPractices: true }"}</code>,
					},
					{ id: "bp", run: "Les règles de bonnes pratiques seulement", pass: <code>{"runOnly: { bestPractices: true }"}</code> },
					{
						id: "profile",
						run: "Une norme fondée sur WCAG (EN 301 549, Section 508)",
						pass: <code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,
					},
					{
						id: "profile-bp",
						run: "La même chose, plus les règles de bonnes pratiques",
						pass: (
							<>
								<code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,{" "}
								<code>{"runOnly: { bestPractices: true }"}</code>
							</>
						),
					},
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 AA, with the best practices:",
					"runDomRulesInPage(url, null, {}, {",
					"  wcag: { version: '2.2', level: 'AA' },",
					"  bestPractices: true",
					"});",
				]}
			/>
			<p>
				Chaque règle teste des critères WCAG ou relève des bonnes pratiques :{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AAA' }, bestPractices: true }"}</code> exécute
				donc toutes les règles sauf celles de 4.1.1 Analyse syntaxique, que WCAG 2.2 a retiré. Pour
				une sélection plus fine, comme un seul critère, une liste de règles ou une exclusion, voir{" "}
				<a href="#advanced-selection-tags-and-rule-ids">« Sélection avancée : tags et identifiants de règle »</a> ;
				ces champs se combinent avec ceux ci-dessus. Une analyse qui nomme des règles rapporte
				aussi les critères qu’elles vérifient (
				<a href="#which-criteria-a-scan-reports">« Les critères que rapporte une analyse »</a>).
			</p>

			<h3 id="selecting-by-wcag-target-runonlywcag">Sélectionner par cible WCAG (<code>runOnly.wcag</code>)</h3>
			<p>
				<code>runOnly.wcag</code> nomme une version et un niveau de conformité WCAG, et
				sélectionne les règles des critères de cette cible :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
				]}
			/>
			<ul>
				<li>
					<code>version</code> vaut <code>'2.0'</code>, <code>'2.1'</code> ou <code>'2.2'</code> ;{" "}
					<code>level</code> vaut <code>'A'</code>, <code>'AA'</code> ou <code>'AAA'</code> (quelle
					que soit la casse).
				</li>
				<li>
					Une règle est sélectionnée quand l’un des critères qu’elle nomme fait partie de la cible :
					en vigueur dans cette version (introduit dans celle-ci ou avant, et pas retiré dans
					celle-ci ou avant), au niveau de la cible ou en dessous, selon le niveau qu’a le critère{" "}
					<strong>dans cette version</strong>. Les niveaux viennent de <code>WCAG_CRITERIA</code>{" "}
					dans <code>@surea11y/core/wcag</code>, qui a un niveau par version.
				</li>
				<li>
					Ainsi, 4.1.1 Analyse syntaxique, que 2.2 a retiré, fait partie des cibles{" "}
					<code>{"{ version: '2.1' }"}</code> et non des cibles <code>{"{ version: '2.2' }"}</code> :{" "}
					<code>duplicate-id</code> s’exécute pour la première et pas pour la seconde, là où les
					tags de version l’exécuteraient.
				</li>
				<li>
					Une règle qui ne nomme aucun critère (une règle de bonnes pratiques) ne fait partie
					d’aucune cible. Ajoutez celles-ci avec <code>bestPractices: true</code> (section
					suivante), ou des règles isolées avec <code>tags</code> ou <code>includeRuleIds</code> :
					à côté de <code>wcag</code>, tous sélectionnent des règles <strong>en plus</strong>,
					l’union des règles de la cible et de ce que les autres sélectionnent.{" "}
					<code>excludeTags</code>, <code>excludeRuleIds</code> et <code>excludeTestIds</code>{" "}
					s’appliquent ensuite, comme toujours.
				</li>
				<li>
					La version de la cible est la cible WCAG de l’exécution (<code>engine.wcagVersion</code>),
					sauf si <code>engineOptions.wcagVersion</code> est défini ; son niveau détermine les
					agrégations WCAG rapportées, comme le fait un tag de niveau, sauf si{" "}
					<code>engineOptions.wcagLevel</code> est défini (
					<a href="#giving-the-level-of-a-scan-that-names-checks-wcaglevel">
						« Donner le niveau d’une analyse qui nomme des vérifications »
					</a>
					).
				</li>
				<li>
					Une cible inclut des règles : elle les sélectionne donc à la place de{" "}
					<code>engineOptions.profile</code>, comme le font les <code>tags</code>.{" "}
					<code>getProfileWcagTarget(profile)</code> donne la cible à laquelle revient un profil
					(voir <a href="#conformance-profiles">« Profils de conformité »</a>), et{" "}
					<code>getChecksForRunOnly(runOnly, engineOptions)</code> liste les règles qu’exécute un{" "}
					<code>runOnly</code> avec <code>wcag</code>, et{" "}
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> les agrégations qu’il rapporte.
				</li>
				<li>
					Toute autre valeur lève <code>INVALID_RUN_ONLY</code>, en nommant ce qui ne va pas :{" "}
					<code>runOnly.wcag.version must be "2.0", "2.1" or "2.2", not "3.0".</code>
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.1 AA, plus the best-practice rules, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, tags: ['best-practice'], excludeRuleIds: ['region'] }",
				]}
			/>

			<h3 id="adding-the-best-practices-runonlybestpractices">Ajouter les bonnes pratiques (<code>runOnly.bestPractices</code>)</h3>
			<p>
				<code>bestPractices: true</code> sélectionne les règles de bonnes pratiques : les règles qui
				ne nomment aucun critère WCAG, comme <code>region</code>, <code>landmark-one-main</code>,{" "}
				<code>heading-order</code>, <code>page-has-heading-one</code>, <code>skip-link</code>,{" "}
				<code>tabindex</code> et <code>image-redundant-alt</code>. Ce sont les règles portant le tag{" "}
				<code>best-practice</code> : cela revient donc à ajouter ce tag. Un constat de l’une d’elles
				relève des bonnes pratiques, pas d’un échec WCAG : aucune agrégation WCAG ne le compte. La
				plupart renvoient <code>cantTell</code> ; celle dont le constat est en lui-même un obstacle
				renvoie <code>fail</code>, comme <code>empty-heading</code> pour un titre sans nom.
			</p>
			<ul>
				<li>
					À côté de <code>wcag</code>, de <code>tags</code> ou d’identifiants de règle, elle ajoute
					ces règles à ce qu’ils sélectionnent ; les exclusions s’appliquent ensuite, si bien que{" "}
					<code>excludeRuleIds: ['region']</code> écarte toujours <code>region</code>.
				</li>
				<li>Seule, elle ne sélectionne que les règles de bonnes pratiques.</li>
				<li>
					<code>false</code>, ou son omission, n’ajoute rien. Seul,{" "}
					<code>{"{ bestPractices: false }"}</code> est une sélection vide : les règles par défaut
					s’exécutent donc, comme avec <code>{"{}"}</code>.
				</li>
				<li>
					Toute autre valeur lève <code>INVALID_RUN_ONLY</code> :{" "}
					<code>runOnly.bestPractices must be true or false, not "yes".</code>
				</li>
				<li>
					À côté d’<code>engineOptions.profile</code>, elle ajoute les règles de bonnes pratiques à
					celles du profil, et le profil s’applique toujours : ses règles, ses agrégations, ses
					correspondances et <code>engine.profile</code>, comme sans elle.{" "}
					<code>{"{ bestPractices: true }"}</code> avec <code>profile: 'en301549-v4.1.1'</code>{" "}
					exécute cette norme et les bonnes pratiques. Les règles de bonnes pratiques ne comptent
					dans aucune des agrégations du profil, puisqu’elles ne testent aucun critère WCAG.
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.1 AA and the best practices, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, bestPractices: true, excludeRuleIds: ['region'] }",
				]}
			/>

			<h3 id="conformance-profiles">Profils de conformité</h3>
			<p>
				<code>engineOptions.profile</code> nomme une cible de conformité au lieu d’en détailler le
				jeu de tags :
			</p>
			<DataTable
				label="Profils de conformité"
				rowKey="profile"
				columns={[
					{ key: "profile", label: "Profil", width: "20%" },
					{ key: "tags", label: "Exécute les règles taguées", wrap: true },
					{ key: "target", label: "Cible WCAG", width: "12%" },
					{ key: "wcagTarget", label: "getProfileWcagTarget", wrap: true },
					{ key: "why", label: "Pourquoi", wrap: true },
				]}
				rows={[
					{
						profile: <code>wcag22-aa</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>,{" "}
								<code>wcag22a</code>, <code>wcag22aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "WCAG 2.2 niveaux A et AA",
					},
					{
						profile: <code>en301549-v4.1.1</code>,
						tags: (
							<>
								comme <code>wcag22-aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "Le chapitre 9 d’EN 301 549 V4.1.1 reprend WCAG 2.2 A et AA",
					},
					{
						profile: <code>en301549-v3.2.1</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>
							</>
						),
						target: "2.1",
						wcagTarget: <code>{"{ version: '2.1', level: 'AA' }"}</code>,
						why: "Le chapitre 9 d’EN 301 549 V3.2.1 reprend WCAG 2.1 A et AA, y compris 4.1.1 Analyse syntaxique",
					},
					{
						profile: <code>section508</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>
							</>
						),
						target: "2.0",
						wcagTarget: <code>{"{ version: '2.0', level: 'AA' }"}</code>,
						why: "Les normes révisées de la Section 508 intègrent WCAG 2.0 A et AA",
					},
				]}
			/>
			<p>
				<code>getProfileWcagTarget(profile)</code> donne la cible <code>runOnly.wcag</code> à
				laquelle revient le jeu de tags d’un profil, ou <code>null</code> pour un nom qui n’est pas
				un profil. Un profil sélectionne toujours par ses tags, comme dans le tableau : sous{" "}
				<code>wcag22-aa</code>, <code>duplicate-id</code> (4.1.1) s’exécute et ne peut pas donner{" "}
				<code>fail</code>, alors que <code>{"{ wcag: getProfileWcagTarget('wcag22-aa') }"}</code>{" "}
				l’écarte.
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { profile: 'en301549-v3.2.1' }, null);"]} />
			<p>
				La norme ou la liste de contrôle d’un <a href="/configuration/packs/">pack</a> ajoute ses
				propres profils à cette liste.
			</p>
			<p>
				La cible WCAG se déduit des tags comme pour un jeu écrit à la main (voir{" "}
				<a href="#filtering-by-wcag-version">« Filtrer par version de WCAG »</a> ci-dessous) : sous{" "}
				<code>en301549-v3.2.1</code>, un id dupliqué peut encore donner <code>fail</code>, et sous{" "}
				<code>en301549-v4.1.1</code>, non. Le profil d’un pack peut plutôt nommer sa version, avec{" "}
				<code>wcagVersion</code> (<a href="/configuration/packs/#profiles">Packs</a>) : un profil qui
				n’exécute que les règles associées à sa norme n’a aucun tag WCAG pour en impliquer une. Les
				noms ne tiennent pas compte de la casse. Une exécution
				qui a utilisé un profil le renvoie dans <code>engine.profile</code>.
			</p>
			<p>
				Priorité : tout ce qui <em>inclut</em> des règles les sélectionne à la place du profil — un{" "}
				<code>runOnly</code> avec <code>wcag</code>, <code>tags</code>, <code>includeRuleIds</code> ou{" "}
				<code>includeTestIds</code>, ou un <code>include</code> dans{" "}
				<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>. Les exclusions
				s’appliquent toujours par-dessus le profil, qu’elles viennent de <code>runOnly</code> (
				<code>excludeTags</code>, <code>excludeRuleIds</code>, <code>excludeTestIds</code> : le{" "}
				<code>disableTags()</code> d’un binding restreint donc le profil au lieu de le remplacer) ou,
				en l’absence de filtre <code>runOnly</code>, d’<code>engineOptions</code> (
				<code>tags.exclude</code>, <code>rules.exclude</code>, <code>tests.exclude</code>), et un{" "}
				<code>engineOptions.wcagVersion</code> explicite l’emporte toujours sur la version
				qu’implique ou que nomme le profil. Un profil sans effet (nom inconnu, ou profil supplanté comme
				ci-dessus) n’est pas une erreur : l’exécution se poursuit comme si aucun n’avait été donné,
				émet un <code>console.warn</code> qui en donne la raison, et ne porte pas{" "}
				<code>engine.profile</code>. <code>runOnly.bestPractices: true</code> n’est pas une
				inclusion de ce type : elle ajoute les règles de bonnes pratiques à celles du profil, et le
				profil s’applique (
				<a href="#adding-the-best-practices-runonlybestpractices">« Ajouter les bonnes pratiques »</a>).
			</p>
			<p>
				Le profil d’une norme peut aussi écarter des règles, quand sa norme dispense d’un critère
				WCAG ou remplace une vérification WCAG par la sienne : les règles qu’il nomme, les règles
				dont il dispense de tous les critères et les agrégations WCAG des critères dispensés ne
				s’exécutent pas, et le catalogue des règles les écarte aussi. Une règle qui vérifie aussi un
				critère que le profil conserve s’exécute toujours (<code>link-name-present</code>, qui
				vérifie 2.4.4 et 4.1.2, sous un profil qui dispense de 2.4.4), et{" "}
				<code>engine.profileExcludes</code> nomme ce qui a été écarté. Aucun profil intégré n’écarte
				quoi que ce soit aujourd’hui.
			</p>
			<p>
				<strong>Un profil ne fait que choisir les règles qui s’exécutent.</strong> Il ne dit rien sur
				le fait que les réussir satisfait la norme dont il porte le nom : la plupart des critères de
				succès exigent un jugement humain qu’aucune règle automatisée ne couvre (voir{" "}
				<a href="/conformance/wcag-mapping/#what-this-engine-cannot-tell-you">
					ce que ce moteur ne peut pas vous dire
				</a>
				).
			</p>
			<p>
				Un profil EN 301 549 active aussi les clauses d’EN 301 549 de la version qu’il vise, comme si{" "}
				<code>mappings: ['en301549:V4.1.1']</code> (ou <code>V3.2.1</code>) avait été passé ; voir{" "}
				<a href="#other-standards-mappings">« Autres normes »</a> ci-dessous. Le profil de toute
				norme active sa propre version de la même façon. Un profil avec <code>mappedRules</code>{" "}
				exécute aussi, quels que soient leurs tags, les règles auxquelles sa norme est associée :
				celles qui n’ont pas de correspondance WCAG, comme <code>heading-order</code> et{" "}
				<code>skip-link</code>, n’ont aucun tag WCAG par lequel être sélectionnées. Une norme dotée
				d’exigences propres, ou la liste de contrôle d’une organisation, arrive dans le moteur sous
				forme de <a href="/configuration/packs/">pack</a>, avec ses propres noms de profil, règles
				et agrégations. Le moteur n’en fournit lui-même aucune.
			</p>

			<h3 id="opt-in-rules">Règles optionnelles</h3>
			<p>
				Certaines règles vérifient des exigences propres à une norme, que WCAG n’impose pas : une
				norme nationale peut exiger un doctype, ou interdire des attributs de présentation comme{" "}
				<code>bgcolor</code>. Un <code>fail</code> d’une telle règle est un échec au regard de cette
				norme, pas de WCAG : ces règles sont donc <strong>désactivées par défaut</strong>. Chacune
				porte le tag de règle de sa norme et ne s’exécute que lorsque la sélection la demande :
			</p>
			<ul>
				<li>par le profil de la norme, qui liste le tag,</li>
				<li>
					par ce tag (<code>{"tags: { include: '<tag>' }"}</code>, seul ou avec d’autres),
				</li>
				<li>
					par son id (<code>{"rules: { include: '<rule id>' }"}</code>, ou{" "}
					<code>runOnly.includeRuleIds</code>),
				</li>
				<li>
					par l’id d’une agrégation propre à sa norme qui la regroupe (
					<code>{"rules: { include: '<rollup id>' }"}</code> exécute les règles de cette agrégation,
					optionnelles ou non), ou
				</li>
				<li>
					en la débloquant avec <code>engineOptions.optInRules</code>, ci-dessous.
				</li>
			</ul>
			<p>
				Rien d’autre ne la sélectionne : ni une exécution par défaut, ni un jeu de tags WCAG, ni un
				profil WCAG ou EN 301 549, ni un id d’agrégation WCAG. Les exclusions s’y appliquent comme à
				toute règle. Sélectionner le tag seul exécute les règles propres à cette norme, pas les
				règles WCAG auxquelles elle est aussi rattachée : cela répond à « qu’exige la norme au-delà
				de WCAG » et ne constitue pas un audit au regard de celle-ci. Pour un audit, utilisez le
				profil de la norme : sous le tag seul, ses propres agrégations renvoient{" "}
				<code>cantTell</code> pour toute exigence dont les règles ne se sont pas exécutées. Une
				règle ajoutée via <code>customRules</code> qui porte le tag suit le même verrou. Aucune des
				normes intégrées au moteur n’a de règles optionnelles aujourd’hui ; le tag d’espace de noms
				d’un pack fonctionne de cette façon.
			</p>

			<h3 id="running-every-rule-optinrules">Exécuter toutes les règles (<code>optInRules</code>)</h3>
			<p>
				Pour exécuter toutes les règles du moteur, quelle que soit la norme à laquelle elles
				appartiennent, omettez le profil et débloquez les règles optionnelles :
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { optInRules: 'all' }, null);"]} />
			<p>
				<code>'all'</code> débloque les règles optionnelles de toutes les normes ; une liste de tags
				ne débloque que celles-ci. L’option lève le verrou, rien de plus : le reste de la sélection
				décide toujours des règles exécutées. Sans filtre ni profil, comme ci-dessus, l’exécution
				couvre donc toutes les règles et les agrégations de toutes les normes ; sous{" "}
				<code>profile: 'wcag22-aa'</code>, elle n’exécute toujours que les règles WCAG, puisque les
				règles optionnelles ne portent aucun tag WCAG. Les exclusions s’appliquent comme d’habitude.
				Un tag qui n’est pas un tag de règle optionnelle est ignoré avec un{" "}
				<code>console.warn</code>. Seule cette option du moteur débloque : <code>runOnly</code>{" "}
				n’a pas de clé <code>optInTags</code>, si bien qu’une telle clé y est une clé inconnue, qui
				lève <code>INVALID_RUN_ONLY</code> si elle est seule et est ignorée avec un avertissement à
				côté de clés que <code>runOnly</code> lit, le message renvoyant à{" "}
				<code>engineOptions.optInRules</code>.
			</p>
			<p>
				C’est fait pour voir tout ce que le moteur peut signaler, pendant le développement ou en
				explorant un site. <strong>Ce n’est pas une cible de conformité</strong> : une telle
				exécution fait échouer une page pour des choses que WCAG permet et que seule une autre norme
				interdit. Le résultat le dit : <code>engine.optInRules</code> liste les tags dont les règles
				se sont exécutées, et le rapport HTML, SARIF et JUnit l’affichent à côté du profil. Elle
				n’ajoute aux résultats les numéros d’aucune autre norme ; passez <code>mappings</code> pour
				cela, par exemple <code>{"{ optInRules: 'all', mappings: ['<key>'] }"}</code>.
			</p>

			<h3 id="other-standards-mappings">Autres normes (<code>mappings</code>)</h3>
			<p>
				Le <code>meta.normativeMappings</code> de chaque résultat nomme les critères de succès WCAG
				qu’il teste. <code>engineOptions.mappings</code> y ajoute l’exigence d’une autre norme qui
				correspond à chacun. Par défaut, il n’en ajoute aucune : une clause d’une norme au regard de
				laquelle vous n’auditez pas n’est que du bruit dans chaque tag SARIF, propriété JUnit et
				rapport.
			</p>
			<DataTable
				label="Valeurs de mappings"
				rowKey="value"
				columns={[
					{ key: "value", label: "Valeur", width: "34%" },
					{ key: "adds", label: "Ajoute", wrap: true },
				]}
				rows={[
					{
						value: <code>'en301549'</code>,
						adds: "La clause du chapitre 9 d’EN 301 549 pour chaque critère, dans toutes les versions qui la contiennent (V3.2.1 et V4.1.1)",
					},
					{
						value: (
							<>
								<code>'en301549:V3.2.1'</code>, <code>'en301549:V4.1.1'</code>
							</>
						),
						adds: "La même chose, pour cette version seulement",
					},
				]}
			/>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { mappings: ['en301549:V3.2.1'] }, null);"]} />
			<p>
				L’option accepte un tableau ou une chaîne séparée par des virgules, noms et versions sans
				tenir compte de la casse. Sous <code>profile: 'en301549-v4.1.1'</code>, les clauses V4.1.1
				sont présentes sans les demander, et <code>mappings</code> peut en ajouter d’autres. Un nom
				ou une version pour lesquels le moteur n’a pas de table est ignoré avec un{" "}
				<code>console.warn</code>. Une exécution qui porte une autre norme indique laquelle dans{" "}
				<code>engine.mappings</code>, sous forme canonique (<code>["en301549:V3.2.1"]</code>, ou{" "}
				<code>["en301549"]</code> pour toutes les versions).
			</p>
			<p>
				Elle ne change que ce que nomme un résultat, jamais les règles exécutées ni leurs
				résultats. Le catalogue des règles suit la même option :{" "}
				<code>getChecksCatalog(engineOptions)</code>,{" "}
				<code>getCheckDefById(ruleId, engineOptions)</code>,{" "}
				<code>getChecksForRunOnly(runOnly, engineOptions)</code>,{" "}
				<code>getRulesCatalog(engineOptions)</code>,{" "}
				<code>getRulesForRunOnly(runOnly, engineOptions)</code> et{" "}
				<code>getCompositeRuleById(id, engineOptions)</code> nomment les normes que nommerait une
				analyse avec ces options, y compris un profil quand il s’appliquerait : une entrée du
				catalogue et un résultat concordent donc toujours. Sans options, ils ne nomment que WCAG.
				Une règle ajoutée via <code>customRules</code> garde exactement les correspondances qu’elle
				déclare. Ce que sont les clauses et ce qui distingue les deux versions est expliqué dans{" "}
				<a href="/conformance/wcag-mapping/#en-301-549">la correspondance WCAG</a>.
			</p>

			<h2 id="advanced-selection-tags-and-rule-ids">Sélection avancée : tags et identifiants de règle</h2>
			<p>
				Les champs ci-dessous sélectionnent selon les tags que portent les règles et selon les
				identifiants de règle. Servez-vous-en pour ce qu’une cible WCAG et{" "}
				<code>bestPractices</code> ne disent pas : un seul critère (<code>tags: ['wcag1412']</code>),
				une liste de règles, une exclusion, ou un jeu de tags repris d’un autre outil. Ils se
				combinent avec <code>wcag</code> et <code>bestPractices</code> : ce qu’ils incluent s’ajoute
				à ce que ceux-ci sélectionnent, et ce qu’ils excluent est retiré ensuite.
			</p>
			<p>
				Il existe <strong>deux façons indépendantes</strong> de les fournir : le 4ᵉ argument (
				<code>runOnly</code>), ou{" "}
				<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>/
				<code>.includeMode</code>. Si <code>runOnly</code> contient un filtre quel qu’il soit, il
				l’emporte d’office ; sinon, le moteur se rabat sur <code>engineOptions</code>.{" "}
				<strong>Ne les combinez pas en comptant sur l’application des deux : choisissez-en
				une.</strong> <code>engineOptions.rules</code>, <code>.tags</code> et <code>.tests</code>{" "}
				acceptent <code>{"{ include, exclude }"}</code> ; une liste ou une chaîne seule est la liste
				d’inclusion.
			</p>

			<h3 id="via-runonly-4th-argument">Avec <code>runOnly</code> (4ᵉ argument)</h3>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {}, {",
					"  includeRuleIds: ['img-alt-present', 'button-name-present'],",
					"  excludeRuleIds: ['region'],",
					"  tags: ['wcag412'],",
					"  excludeTags: ['best-practice'],",
					"  includeMode: 'and'   // 'and' (default) | 'or' — see below",
					"});",
				]}
			/>
			<p>
				Un tableau ou une chaîne bruts servent de raccourci :{" "}
				<code>runOnly: ['img-alt-present', 'button-name-present']</code> exécute ces règles (un
				id composite entraîne ses règles), et <code>runOnly: ['wcag2a', 'wcag2aa']</code>{" "}
				équivaut à <code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>. Un tableau ne peut pas
				mélanger ids de règle et tags, et chaque valeur doit nommer une règle (intégrée,
				composite ou l’une des <code>engineOptions.customRules</code>) ou un tag : toute autre
				valeur lève une exception, pour qu’une faute de frappe ne puisse pas exécuter en silence
				toutes les règles ou aucune. Utilisez la forme objet pour combiner ids et tags ou pour
				exclure. Avant la 1.10.0, un tableau brut était ignoré et toutes les règles
				s’exécutaient.
			</p>
			<DataTable
				label="Champs de runOnly"
				rowKey="field"
				columns={[
					{ key: "field", label: "Champ", width: "22%" },
					{ key: "type", label: "Type", width: "16%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={[
					{
						field: <code>wcag</code>,
						type: <code>{"{ version, level }"}</code>,
						meaning: "Une cible de conformité WCAG : les règles des critères de cette version à ce niveau et en dessous. Voir Sélectionner par cible WCAG, plus haut.",
					},
					{
						field: <code>bestPractices</code>,
						type: <code>boolean</code>,
						meaning: "true ajoute les règles de bonnes pratiques. Voir Ajouter les bonnes pratiques, plus haut.",
					},
					{ field: <code>includeRuleIds</code>, type: <code>string[]</code>, meaning: "N’exécute que ces IDs de règle (plus, pour un ID composite, ses règles atomiques enfants)." },
					{ field: <code>excludeRuleIds</code>, type: <code>string[]</code>, meaning: "N’exécute jamais celles-ci ; appliqué après l’inclusion." },
					{
						field: (
							<>
								<code>includeTestIds</code> / <code>excludeTestIds</code>
							</>
						),
						type: <code>string[]</code>,
						meaning: "Même correspondance que ci-dessus. Conservé comme champ distinct parce qu’en interne les règles s’appellent « tests » (l’unité exécutable atomique) ; fonctionnellement identique à includeRuleIds/excludeRuleIds aujourd’hui.",
					},
					{ field: <code>tags</code>, type: <code>string[]</code>, meaning: "N’exécute que les règles portant au moins un de ces tags (par ex. wcag412, wcag2aa, best-practice)." },
					{ field: <code>excludeTags</code>, type: <code>string[]</code>, meaning: "N’exécute jamais les règles portant l’un de ces tags ; appliqué après l’inclusion." },
					{
						field: <code>includeMode</code>,
						type: (
							<>
								<code>'and'</code> | <code>'or'</code>
							</>
						),
						meaning: "Lorsqu’une inclusion par ID et une inclusion par tag sont toutes deux fournies : 'and' (par défaut) exige qu’une règle satisfasse les deux ; 'or' exécute une règle si elle satisfait l’une ou l’autre. Sans objet si vous n’utilisez qu’une seule dimension.",
					},
				]}
			/>
			<p>
				Chacun de ces champs accepte un tableau ou une chaîne séparée par des virgules, comme la
				forme <code>engineOptions</code> ci-dessous :{" "}
				<code>includeRuleIds: 'img-alt-present, button-name-present'</code> et{" "}
				<code>includeRuleIds: ['img-alt-present', 'button-name-present']</code> sont équivalents.
			</p>
			<p>
				Les noms sont vérifiés, ici et dans <code>engineOptions.rules</code>/<code>.tags</code>{" "}
				ci-dessous. Une liste d’inclusion (<code>includeRuleIds</code>,{" "}
				<code>includeTestIds</code>, <code>tags</code>, l’ancien <code>values</code>,{" "}
				<code>rules.include</code>, <code>tags.include</code>) dont aucune valeur ne nomme une
				règle ou un tag (un tag que porte une règle ou une agrégation, si bien que le tag d’une
				norme est reconnu même si seules ses agrégations le portent) lève une exception, avec{" "}
				<code>code: 'INVALID_RUN_ONLY'</code> et un message qui nomme le champ et les valeurs,
				puisqu’elle ne sélectionnerait rien et qu’une exécution sans aucune règle se lit comme une
				analyse sans constat. Une sélection dont tous les noms existent mais dont les parties
				s’annulent (une règle à la fois incluse et exclue, des règles et des tags sans aucune règle
				en commun avec <code>includeMode: 'and'</code>) n’exécute elle aussi aucune règle :
				l’analyse émet un avertissement qui nomme les parties, et lève{" "}
				<code>INVALID_RUN_ONLY</code> avec <code>strictOptions</code>. <code>includeMode</code>{" "}
				vaut <code>'and'</code> ou <code>'or'</code> ; toute autre valeur est lue comme{" "}
				<code>'and'</code>, avec un avertissement, et lève une erreur avec{" "}
				<code>strictOptions</code> ; dans un binding de navigateur,{" "}
				<code>.includeMode('or')</code> le définit. Une valeur qui ne nomme rien à côté d’autres qui nomment
				quelque chose, ou dans une liste d’exclusion, est ignorée avec un{" "}
				<code>console.warn</code>. Avant la 1.10.0, toutes ces valeurs étaient ignorées sans
				avertissement.
			</p>
			<p>
				Les neuf tags de version et de niveau WCAG, de <code>wcag2a</code> à{" "}
				<code>wcag22aaa</code>, sont toujours reconnus, qu’une règle en porte un ou non. Certains
				n’en portent aucune aujourd’hui (<code>wcag21aaa</code>, <code>wcag22a</code>,{" "}
				<code>wcag22aaa</code>) : leurs critères n’ont aucune règle automatisée, ce qui n’est pas
				une faute de frappe. Dans une liste d’inclusion à côté d’autres valeurs, un tel tag est
				signalé par un <code>console.info</code>, sans avertissement :
			</p>
			<CodeBlock
				lines={['[surea11y] runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a"); its criteria need manual review.']}
			/>
			<p>
				<code>engineOptions.logUntestedWcag: false</code> omet cette ligne. Quand toutes les
				valeurs d’une liste d’inclusion sont de tels tags, rien ne s’exécuterait : la liste lève
				donc toujours <code>INVALID_RUN_ONLY</code>, en indiquant pourquoi. À côté d’une cible{" "}
				<code>runOnly.wcag</code> ou de <code>bestPractices: true</code>, qui sélectionnent leurs
				propres règles, le tag est seulement signalé. Dans une liste d’exclusion, il est laissé tel
				quel.
			</p>
			<p>
				Les IDs de règle sont nus (sans préfixe de moteur), par exemple{" "}
				<code>'img-alt-present'</code>. Pour la rétrocompatibilité, la correspondance accepte
				aussi une ancienne forme du même id préfixée par <code>a11ycore-</code>{" "}
				(<code>'a11ycore-img-alt-present'</code>). Les ids sont reconnus quelle que soit la casse,
				comme les tags : <code>'IMG-ALT-PRESENT'</code> sélectionne <code>img-alt-present</code>,
				dans toute liste qui nomme des règles (<code>runOnly</code> sous chacune de ses formes,{" "}
				<code>engineOptions.rules</code> et <code>engineOptions.tests</code>, inclusion et
				exclusion). Aucune paire de règles n’a d’ids qui ne diffèrent que par la casse : cela ne
				peut donc pas sélectionner la mauvaise.
			</p>
			<p>
				La <strong>forme <code>{"{ type, values }"}</code></strong> est également acceptée comme
				valeur complète de <code>runOnly</code> :{" "}
				<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code> équivaut à{" "}
				<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>, et{" "}
				<code>{"{ type: 'rule', values: ['img-alt-present'] }"}</code> à{" "}
				<code>{"{ includeRuleIds: ['img-alt-present'] }"}</code> (<code>'tags'</code> et{" "}
				<code>'rules'</code> fonctionnent aussi). <code>values</code> peut être une chaîne séparée
				par des virgules, ses noms sont vérifiés comme tout identifiant de règle ou tag, et les
				autres clés qui l’accompagnent (<code>excludeTags</code>, <code>excludeRuleIds</code>...)
				s’appliquent toujours. Un <code>Set</code> de noms est lu comme la liste qu’il contient. Une
				clé que la forme objet ne lit pas, à côté de clés qu’elle lit, est ignorée avec un
				avertissement. Tout autre <code>type</code> lève{" "}
				<code>INVALID_RUN_ONLY</code>, de même qu’un <code>runOnly</code> qui est un nombre ou
				un booléen, ou un objet dont le moteur ne lit aucune clé (
				<code>{"{ includeRuleId: [...] }"}</code>) : chacun de ces cas exécutait auparavant
				toutes les règles. Un tableau, une chaîne ou un objet vides signifient toujours la
				sélection par défaut.
			</p>

			<h3 id="which-criteria-a-scan-reports">Les critères que rapporte une analyse</h3>
			<p>
				Une analyse rapporte l’agrégation d’un critère (<code>rulesResults</code>) quand la
				sélection la sélectionne : une cible WCAG ou un tag de version/niveau, un profil, l’id de
				l’agrégation elle-même, ou aucune sélection. Elle rapporte aussi l’agrégation de chaque
				critère que vérifie une règle que la sélection <strong>a nommée pour elle-même</strong>,
				quand cette règle s’est exécutée :
			</p>
			<ul>
				<li>
					par son id (<code>includeRuleIds</code>, <code>includeTestIds</code>,{" "}
					<code>rules.include</code>, ou la liste de règles propre à un profil),
				</li>
				<li>
					par un tag qui n’est pas un tag WCAG (celui d’une règle personnalisée, d’un pack ou d’une
					norme ; les tags de WCAG sont les tags de version/niveau, les tags de critère comme{" "}
					<code>wcag244</code>, et <code>wcag22-removed</code>, si bien qu’un tag personnalisé comme{" "}
					<code>wcagteam</code> n’en est pas un),
				</li>
				<li>
					par <code>optInRules</code>, ou
				</li>
				<li>
					en tant que règle de bonnes pratiques (<code>bestPractices</code>).
				</li>
			</ul>
			<p>
				Une règle que le profil d’une norme exécute seulement parce que sa norme y est associée (
				<code>mappedRules</code>) est nommée pour cette norme, pas pour elle-même : elle ajoute les
				exigences de la norme et aucun de ses critères WCAG. Un profil qui n’exécute que ce que
				demande sa norme ne rapporte donc que cette norme (
				<a href="/configuration/packs/#profiles">Packs</a>) ; une règle que nomme sa liste{" "}
				<code>rules</code> ajoute aussi ses critères WCAG. Avant la 1.12.0, une analyse qui
				nommait des règles plutôt que des critères avait un <code>rulesResults</code> vide.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// The unnamed link fails link-name-present, and with it 2.4.4 and 4.1.2:",
					"runDomRulesInPage(url, null, {}, { includeRuleIds: ['link-name-present'] });",
					"// rulesResults: wcag-2.4.4-link-purpose-in-context: fail, wcag-4.1.2-name: fail",
				]}
			/>
			<ul>
				<li>
					<strong>Le verdict est celui de l’agrégation.</strong> Une règle en échec fait échouer le
					critère. Une règle réussie ne le fait pas réussir quand l’analyse a laissé de côté les
					autres règles du critère : il est <code>cantTell</code>, avec le <code>reasonCode</code>{" "}
					<code>composite.rollup.cantTell.notSelectedChild</code>, et chaque règle que l’analyse
					n’a pas sélectionnée figure parmi les contributrices comme <code>missing</code> avec{" "}
					<code>notSelected: true</code>. Le rapport HTML affiche « Vérifié en partie : 1 contrôle sur 2
					n’a pas été sélectionné pour cette analyse » sous lui. Voir{" "}
					<a href="/results-reports/output-schema/#partly-checked">le schéma de sortie</a>.
				</li>
				<li>
					<strong>Un tag de critère nomme son propre critère.</strong>{" "}
					<code>tags: ['wcag244']</code> rapporte 2.4.4, et pas les autres critères que vérifient
					ses règles (4.1.2 pour <code>link-name-present</code>). Une règle amenée par l’id d’une
					agrégation, une cible WCAG, un tag de version ou de niveau, ou un profil WCAG n’ajoute
					aucun critère : c’est la sélection qui nomme alors les critères. Une analyse qui
					sélectionne ses critères rapporte donc ce qu’elle rapportait avant.
				</li>
				<li>
					<strong>La version et le niveau WCAG de l’exécution s’appliquent.</strong> Un critère
					n’est ajouté que s’il est en vigueur dans <code>engine.wcagVersion</code> (
					<code>duplicate-id</code> seul n’ajoute pas 4.1.1 en 2.2, mais l’ajoute avec{" "}
					<code>wcagVersion: '2.1'</code>), et au niveau de l’exécution ou en dessous, comme le
					ferait une cible : <code>engineOptions.wcagLevel</code> s’il est donné (section
					suivante), sinon le niveau que donne la sélection (<code>runOnly.wcag.level</code>, ou
					les tags de version/niveau à côté des ids de règle). Sans l’un ni l’autre, tous les
					niveaux sont rapportés.
				</li>
				<li>
					<strong>Les exclusions s’appliquent.</strong> Une agrégation que la sélection exclut (
					<code>{"excludeRuleIds: ['wcag-4.1.2-name']"}</code>, ou un tag) n’est pas ajoutée. Une
					règle que l’appelant a exclue compte comme non sélectionnée. Une règle qu’un profil
					écarte restreint le critère : elle est <code>missing</code> sans{" "}
					<code>notSelected</code>, et un critère dont le profil dispense n’est jamais ajouté.
				</li>
				<li>
					<strong>Les agrégations propres d’une norme</strong> (une par exigence) sont ajoutées de
					la même façon, mais seulement tant que la norme est en jeu : le profil appliqué la vise,
					ou la sélection nomme son tag, ou <code>optInRules</code> la débloque. Une analyse WCAG
					n’affiche jamais les exigences d’une norme que personne n’a demandée. Un profil qui ne
					s’est pas appliqué, et <code>mappings</code> seul, ne mettent pas une norme en jeu. Sous
					son profil, seule la version du profil est ajoutée ; débloquée sans profil, chaque
					version l’est, comme les rapporte une analyse sélectionnée par son tag. Cela vaut pour
					une norme ou une liste de contrôle venue d’un pack comme pour une norme intégrée : un
					profil de liste de contrôle qui nomme ses règles (<code>tags: []</code>,{" "}
					<code>{"rules: [...]"}</code>) obtient leurs critères WCAG et ses propres éléments.
				</li>
				<li>
					<strong>La liste avant l’analyse.</strong>{" "}
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> liste les agrégations que
					rapporte une analyse avec cette sélection et ces options, y compris celles ajoutées,
					sous forme d’entrées de <code>getRulesCatalog</code>. Elle les calcule avec l’étape
					d’agrégation de l’analyse elle-même : les deux concordent donc ;{" "}
					<code>getChecksForRunOnly</code> liste les règles.{" "}
					<code>getRulesCatalog(engineOptions)</code> liste toutes les agrégations que les options
					rendent disponibles, quelle que soit la sélection. Un outil peut ainsi enregistrer ce
					qu’une analyse vérifie avant de la lancer ; les builders des bindings de navigateur
					donnent les mêmes listes avec <code>plannedChecks()</code> et{" "}
					<code>plannedCriteria()</code>.
				</li>
			</ul>

			<h3 id="giving-the-level-of-a-scan-that-names-checks-wcaglevel">
				Donner le niveau d’une analyse qui nomme des vérifications (<code>wcagLevel</code>)
			</h3>
			<p>
				Une analyse prévue pour WCAG 2.2 AA qui n’exécute que certaines vérifications les nomme,
				et donne la version dans <code>engineOptions.wcagVersion</code>. Cela ne dit aucun niveau :
				les critères de ces vérifications sont donc rapportés à tous les niveaux.{" "}
				<code>contrast-computable</code> vérifie 1.4.3 (AA) et 1.4.6 (AAA), et les deux sont
				rapportés. <code>engineOptions.wcagLevel</code> donne le niveau :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only the contrast checks of a WCAG 2.2 AA scan: 1.4.3 is reported, 1.4.6 is not.",
					"runDomRulesInPage(url, null,",
					"  { wcagVersion: '2.2', wcagLevel: 'AA' },",
					"  { includeRuleIds: ['contrast-computable'] });",
				]}
			/>
			<ul>
				<li>
					<strong>Valeurs.</strong> <code>'A'</code>, <code>'AA'</code> ou <code>'AAA'</code>,
					quelle que soit la casse. Toute autre valeur est ignorée avec un{" "}
					<code>console.warn</code> (
					<code>engineOptions.wcagLevel: ignoring "AA+"; use "A", "AA" or "AAA". ...</code>), et
					lève <code>INVALID_ENGINE_OPTIONS</code> avec <code>strictOptions</code>. L’exécution
					renvoie un niveau valide dans <code>engine.wcagLevel</code>, écrit <code>'A'</code>,{" "}
					<code>'AA'</code> ou <code>'AAA'</code> ; sans l’option, <code>engine.wcagLevel</code>{" "}
					est le niveau qu’implique la sélection, et il est absent quand elle n’en implique aucun.
				</li>
				<li>
					<strong>Elle décide de ce qui est rapporté, jamais de ce qui s’exécute.</strong> La
					sélection décide de ce qui s’exécute, comme sans elle. Une vérification au-dessus du
					niveau que la sélection nomme s’exécute toujours et rapporte son propre résultat ; seuls
					ses critères au-dessus du niveau sont omis de <code>rulesResults</code>.
				</li>
				<li>
					<strong>Elle s’applique à toutes les agrégations WCAG, pas seulement aux critères
					ajoutés pour des vérifications nommées.</strong> <code>wcagLevel: 'AA'</code> sur une
					analyse complète, un profil ou une sélection par tags omet les critères AAA de{" "}
					<code>rulesResults</code>, tandis que leurs vérifications s’exécutent toujours et
					rapportent dans <code>checksResults</code>. C’est la différence avec{" "}
					<code>wcagVersion</code>, qui ne retire jamais une agrégation que la sélection
					sélectionne : une analyse 2.2 rapporte toujours 4.1.1, ses règles étant ramenées à{" "}
					<code>cantTell</code>. Une analyse sans l’option rapporte ce qu’elle rapportait avant.
				</li>
				<li>
					<strong>Elle l’emporte sur le niveau qu’implique la sélection</strong> (
					<code>runOnly.wcag.level</code>, ou le niveau le plus élevé que nomment ses tags de
					version/niveau), comme un <code>wcagVersion</code> explicite l’emporte sur la version
					qu’ils impliquent. Un conflit entre les deux ne donne lieu à aucun avertissement, pas
					plus qu’un conflit entre <code>wcagVersion</code> et la version d’une cible ;{" "}
					<code>engine.wcagLevel</code> indique le niveau qui a filtré les critères.
				</li>
				<li>
					<strong>Une agrégation nommée par son id est rapportée telle que nommée.</strong>{" "}
					<code>{"includeRuleIds: ['wcag-1.4.6-contrast-enhanced']"}</code> avec{" "}
					<code>wcagLevel: 'AA'</code> rapporte 1.4.6 : l’option dit quels critères rapporter, pas
					d’écarter celui que l’appelant a demandé. Un niveau qu’impliquent les propres tags de la
					sélection filtre toujours une agrégation nommée, comme sans l’option.
				</li>
				<li>
					<strong>Les agrégations propres d’une norme</strong> n’ont pas de niveau WCAG et ne sont
					pas filtrées par elle. Le profil d’un pack ne peut pas donner de niveau (ses tags en
					impliquent un) ; son appelant peut passer <code>wcagLevel</code>.
				</li>
				<li>
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> en tient compte : elle liste
					donc ce que rapporte l’analyse, et avertit d’une valeur invalide comme le fait
					l’analyse, ou lève une erreur avec <code>strictOptions</code>.
				</li>
			</ul>
			<p>
				Sans l’option, des tags de version/niveau à côté des ids de règle donnent aussi un niveau,
				puisque l’<code>includeMode: 'and'</code> par défaut garde les règles nommées qui portent
				l’un d’eux :{" "}
				<code>{"{ includeRuleIds: ['contrast-computable'], tags: wcagTags('2.2') }"}</code>{" "}
				exécute <code>contrast-computable</code> et ne rapporte que 1.4.3. Mais les tags décident
				aussi de ce qui s’exécute : une règle nommée sans tag WCAG (une règle de bonnes pratiques
				comme <code>region</code>, une règle personnalisée sans tags WCAG), ou une règle qui ne
				vérifie que des critères AAA, est écartée de l’exécution, et un tag de version/niveau
				qu’aucune règle ne porte (<code>wcag22a</code>) est signalé par un{" "}
				<code>console.info</code>. <code>wcagLevel</code> donne le niveau sans changer ce qui
				s’exécute. Dans un binding de navigateur, le <code>.wcagLevel('AA')</code> du builder le
				définit.
			</p>

			<h3 id="filtering-by-wcag-version">Filtrer par version de WCAG (2.0, 2.1, 2.2)</h3>
			<p>
				Chaque règle et chaque composite porte exactement un tag de niveau indiquant sa version
				WCAG d’origine : <code>wcag2a</code>/<code>wcag2aa</code>/<code>wcag2aaa</code> pour un
				critère de succès du socle WCAG 2.0, <code>wcag21a</code>/<code>wcag21aa</code>/
				<code>wcag21aaa</code> pour un critère introduit par WCAG 2.1 (par ex. <code>1.3.5</code>{" "}
				Identifier la finalité des champs), <code>wcag22a</code>/<code>wcag22aa</code>/
				<code>wcag22aaa</code> pour un critère introduit par WCAG 2.2 (par ex. <code>2.5.8</code>{" "}
				Taille de la cible (minimum)). Une règle reçoit <strong>uniquement</strong> le tag de la
				version d’origine réelle de son critère : un critère introduit en 2.1 ne porte jamais aussi{" "}
				<code>wcag2aa</code>, puisqu’il n’existe pas pour une cible de conformité WCAG 2.0.
			</p>
			<p>
				<code>runOnly.wcag</code> sélectionne une cible de conformité en un seul champ (
				<a href="#selecting-by-wcag-target-runonlywcag">plus haut</a>), et écarte 4.1.1 sous 2.2.
				Avec des tags, comme les versions sont cumulatives (2.1 = 2.0 + nouveautés ; 2.2 = 2.0 +
				2.1 + nouveautés), vous choisissez une cible de conformité par version WCAG en combinant des
				ensembles de tags. La correspondance en OU du moteur sur <code>tags</code> (une seule
				correspondance suffit à inclure la règle) fait le reste :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 AA only (excludes every 2.1/2.2-introduced SC, even at level AA):",
					"{ tags: ['wcag2a', 'wcag2aa'] }",
					"",
					"// WCAG 2.1 AA conformance (2.0 baseline + everything 2.1 added, both at A and AA):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }",
					"",
					"// WCAG 2.2 AA conformance (2.0 baseline + 2.1 additions + 2.2 additions):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'] }",
					"",
					"// Just the SCs 2.2 introduced, nothing else:",
					"{ tags: ['wcag22a', 'wcag22aa', 'wcag22aaa'] }",
				]}
			/>
			<p>
				<strong>Un critère va dans l’autre sens.</strong> WCAG 2.2 a retiré le critère 4.1.1
				Analyse syntaxique, le seul critère jamais supprimé plutôt qu’ajouté. Une règle qui lui
				est associée porte son tag d’origine 2.0 (<code>wcag2a</code>) comme toute autre règle du
				socle, plus <code>wcag22-removed</code>, et les ensembles de tags par version ci-dessus
				l’incluent donc sous une cible 2.2, où elle n’a pas sa place.
			</p>
			<p>
				Vous n’avez rien à faire pour autant. Le moteur résout une{" "}
				<strong>version WCAG cible</strong> pour chaque exécution et, lorsque cette cible est 2.2,
				une règle <code>wcag22-removed</code> ne peut pas renvoyer <code>fail</code> : elle
				s’exécute toujours et signale toujours chaque occurrence trouvée, mais son résultat est
				converti en <code>cantTell</code> et le résultat porte un champ{" "}
				<code>wcagVersionScope</code> qui en explique la raison (voir{" "}
				<a href="/results-reports/output-schema/">le schéma de sortie</a>). Rien n’est supprimé
				en silence, et une exécution 2.2 n’est pas bloquée par un critère que 2.2 ne contient pas.
			</p>
			<p>La version cible est résolue dans cet ordre :</p>
			<ol>
				<li>
					<code>engineOptions.wcagVersion</code> (<code>'2.0'</code>, <code>'2.1'</code> ou{" "}
					<code>'2.2'</code>), si vous l’avez défini.
				</li>
				<li>
					Le <code>wcagVersion</code> du profil de pack qu’applique l’exécution, s’il en nomme un :
					une norme fondée sur WCAG 2.1 dont le profil n’exécute que les règles qui lui sont
					associées ne sélectionne aucun tag WCAG, et dit donc la version elle-même. Il l’emporte
					sur la version qu’impliquent les propres tags du profil. Un profil sans effet (supplanté
					par une sélection de votre part) n’apporte aucune version.
				</li>
				<li>La version d’une cible <code>runOnly.wcag</code>.</li>
				<li>
					Les tags d’origine de version de votre propre filtre : un ensemble qui s’arrête à{" "}
					<code>wcag21a</code>/<code>wcag21aa</code> se lit comme une cible 2.1, un ensemble qui
					contient un tag <code>wcag22*</code> comme une cible 2.2, un ensemble ne contenant que
					des tags <code>wcag2*</code> comme une cible 2.0. Seuls ces neuf tags comptent : un tag
					de critère (<code>wcag411</code>) ou <code>best-practice</code> ne dit rien d’une
					version.
				</li>
				<li>
					Sinon <code>'2.2'</code>, la cible par défaut de ce moteur.
				</li>
			</ol>
			<CodeBlock
				lang="js"
				lines={[
					"// Nothing to declare: a plain run already targets 2.2, so a duplicate id",
					"// comes back cantTell rather than fail.",
					"runDomRulesInPage(url, null, {}, null);",
					"",
					"// Conformance-testing against 2.1, where SC 4.1.1 still exists:",
					"runDomRulesInPage(url, null, { wcagVersion: '2.1' }, null);",
					"",
					"// Same thing, implied by the tag set — no extra option needed:",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });",
				]}
			/>
			<p>
				La cible résolue est renvoyée dans chaque résultat sous <code>engine.wcagVersion</code>,
				ce qui vous permet de vérifier celle qu’une exécution a réellement utilisée.
			</p>
			<p>
				Si vous préférez ne pas voir du tout la règle sous 2.2, excluez-la purement et
				simplement ; le tag existe toujours précisément pour cela :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 AA conformance, with the removed criterion left out entirely:",
					"{",
					"  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'],",
					"  excludeTags: ['wcag22-removed']",
					"}",
				]}
			/>
			<p>
				<code>duplicate-id</code> est aujourd’hui la seule règle qui porte ce tag. Si vous la
				laissez, elle signale toujours un vrai problème (un id dupliqué casse{" "}
				<code>&lt;label for&gt;</code>, les liens d’ancre et <code>getElementById</code>, quoi
				qu’en dise la norme) ; ce n’est simplement pas un échec de conformité 2.2.
			</p>

			<h3>Avec <code>engineOptions</code> (sans <code>runOnly</code>)</h3>
			<p>
				Le même filtrage, exprimé sous forme de chaînes séparées par des virgules (ou de
				tableaux) imbriquées dans <code>engineOptions</code> :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  rules: { include: 'img-alt-present, button-name-present', exclude: 'region' },",
					"  tags: { include: 'wcag412', exclude: 'best-practice' },",
					"  includeMode: 'and'",
					"}, null);",
				]}
			/>
			<p>
				<code>rules.include</code>/<code>.exclude</code>, <code>tags.include</code>/
				<code>.exclude</code>, <code>tests.include</code>/<code>.exclude</code> (alias de{" "}
				<code>rules</code>) et <code>includeMode</code> au premier niveau reprennent exactement
				les champs <code>runOnly</code> ci-dessus. Les chaînes séparées par des virgules sont
				automatiquement nettoyées de leurs espaces, dédupliquées et débarrassées des éléments
				vides. Une liste ou une chaîne seule, comme <code>rules: ['img-alt-present']</code>, est lue
				comme la liste d’inclusion.
			</p>

			<h2><code>engineOptions</code> : les autres options</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  strictOptions: false,            // default false — true throws on an unknown option or a value of the wrong type",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  wcagLevel: 'AA',                 // optional — the level of the criteria reported",
					"  profile: 'en301549-v4.1.1',      // optional — a named conformance target",
					"  mappings: ['en301549'],          // optional — standards besides WCAG to name on each result",
					"  optInRules: 'all',               // optional — also run rules other standards add beyond WCAG",
					"  messages: { de: { /* key: text */ } },  // optional caller-supplied dictionaries; win over built-in ones",
					"  includeHiddenElements: false,    // default false — set true to evaluate hidden/collapsed subtrees too",
					"  includeShadowDom: true,          // default true — opt OUT with false to skip open shadow roots",
					"  fragment: false,                 // default false — set true when the scan target isn't a real page",
					"  excludeSelectors: ['#cookie-banner', '.third-party-widget'],  // array or comma-separated string",
					"  timestamp: '2026-07-20T12:00:00Z',  // optional — engine has no built-in clock",
					"  perfStats: false,                // default false — internal timing counters, debug-only shape",
					"  profileRules: false,             // default false — per-rule timings; needs perfStats",
					"",
					"  contrast: {",
					"    mode: 'strictConformance',     // 'strictConformance' (default) | 'auditorAssist'",
					"    rootCanvasFallback: '#ffffff'  // background assumed when the true root background isn't computable",
					"  },",
					"  visibilityMode: undefined,       // 'styleOnly' | 'styleAndGeometry'; unset: geometry with a layout, else styles",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true,",
					"    detail: 'full'                 // 'findings': pass/notApplicable results keep only rule, outcome, type",
					"  },",
					"",
					"  rules: {",
					"    'some-rule-id': {",
					"      excludeSelectors: ['.some-noisy-widget']  // narrows candidates for THIS rule only",
					"    }",
					"  },",
					"",
					"  probes: { /* optional host-supplied evidence */ },",
					"",
					"  customRules: [ /* runtime-registered rules, see below */ ],",
					"  packs: [ /* rules and standards from outside core, see Packs */ ],",
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]}
			/>
			<DataTable
				label="Autres options engineOptions"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={optionRows}
			/>

			<h3 id="catching-mistakes-in-the-options-strictoptions">Repérer les erreurs dans les options (<code>strictOptions</code>)</h3>
			<p>
				Une option que le moteur ne lit pas est transmise telle quelle : une règle personnalisée
				peut lire ses propres réglages dans <code>ctx.engineOptions</code>, et une option retirée
				dans une version ultérieure ne casse pas une analyse. Par défaut, une option mal
				orthographiée est donc ignorée, et l’analyse s’exécute comme si elle n’était pas là. Deux
				choses le signalent :
			</p>
			<ul>
				<li>
					<strong>Toujours</strong>, une clé à une ou deux lettres près d’une clé connue (quelle que
					soit la casse) déclenche un avertissement, clés imbriquées comprises : <code>lcoale</code>{" "}
					donne{" "}
					<code>[surea11y] engineOptions: unknown option "lcoale" (did you mean "locale"?); ignored.</code>
				</li>
				<li>
					<strong>Toujours</strong>, une valeur de mauvais type déclenche un avertissement et est
					lue comme non fournie, de même qu’un <code>engineOptions</code> qui n’est pas un objet. Les
					options booléennes (<code>includeShadowDom</code>, <code>includeHiddenElements</code>,{" "}
					<code>fragment</code>, <code>perfStats</code>, <code>profileRules</code>,{" "}
					<code>output.includeHtml</code>, <code>output.includeSelector</code>) acceptent{" "}
					<code>true</code> ou <code>false</code>, ou <code>'true'</code>, <code>'false'</code>,{" "}
					<code>'1'</code>, <code>'0'</code>, <code>1</code> et <code>0</code> tels qu’une ligne de
					commande les écrit : <code>perfStats: 'false'</code> est désactivé.
				</li>
				<li>
					<strong>Avec <code>strictOptions: true</code></strong> (ou <code>'true'</code>,{" "}
					<code>'1'</code> ou <code>1</code>), chaque option est vérifiée avant l’analyse, et toute
					erreur lève une exception avec <code>code: 'INVALID_ENGINE_OPTIONS'</code>, qui nomme
					chacune, <code>problems</code> les listant sous la forme{" "}
					<code>{"{ path, kind, message, suggestion }"}</code> : une clé inconnue (
					<code>kind: 'unknown'</code>), dans <code>engineOptions</code> ou dans l’un de ses objets,
					et une valeur de mauvais type ou hors de son ensemble (<code>kind: 'invalid'</code>), comme{" "}
					<code>includeHiddenElements: 'yes'</code> ou <code>contrast.mode: 'strict'</code>.
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, { strictOptions: true, lcoale: 'de' }, null);",
					"// Error: engineOptions: unknown option \"lcoale\" (did you mean \"locale\"?). (strictOptions)",
				]}
			/>
			<p>
				Les fonctions de catalogue qui acceptent des <code>engineOptions</code> (
				<code>getChecksCatalog</code>, <code>getRulesCatalog</code>, <code>getCheckDefById</code>,{" "}
				<code>getCompositeRuleById</code>, <code>getChecksForRunOnly</code>,{" "}
				<code>getRulesForRunOnly</code>, <code>getTestsForRunOnly</code>) les vérifient de la même
				façon, dans les mêmes termes :{" "}
				<code>{"getRulesForRunOnly(runOnly, { wcagLevel: 'AA+' })"}</code> émet un avertissement,
				lit le niveau comme non donné, et liste ce que rapporte une analyse avec ces options ; avec{" "}
				<code>strictOptions: true</code>, elle lève <code>INVALID_ENGINE_OPTIONS</code>, comme
				l’analyse.
			</p>
			<p>
				Non vérifiés : les réglages propres à une règle (<code>rules[ruleId]</code>), les clés de{" "}
				<code>messages</code>, et <code>probes</code>, que le moteur transmet sans les lire ; ainsi
				que les règles personnalisées, qui ont leurs propres vérifications (
				<code>skippedCustomRules</code>). En TypeScript, <code>StrictEngineOptions</code> est le même
				ensemble d’options sans la signature d’index qui laisse compiler n’importe quelle clé : une
				option mal orthographiée y est donc aussi une erreur.
			</p>

			<h3 id="rule-scoped-excludeselectors"><code>excludeSelectors</code> par règle</h3>
			<p>
				Le <code>excludeSelectors</code> de premier niveau s’applique à <em>toutes</em> les
				règles : impossible, avec lui seul, d’exclure un élément d’une seule règle tout en
				continuant à lui appliquer toutes les autres. <code>rules[ruleId].excludeSelectors</code>{" "}
				comble ce manque : il restreint les candidats pour <strong>cette seule règle</strong>, en
				plus de la liste globale (jamais à sa place).
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  excludeSelectors: ['#cookie-banner'],   // applies to every rule, as always",
					"  rules: {",
					"    'aria-required-children': {",
					"      excludeSelectors: ['mat-select', 'mat-stepper', 'mat-horizontal-stepper', 'mat-vertical-stepper']",
					"    },",
					"    'aria-allowed-attr': {",
					"      excludeSelectors: ['mat-progress-spinner']",
					"    }",
					"  }",
					"};",
				]}
			/>
			<p>
				Pourquoi en avoir besoin : le <code>&lt;mat-select&gt;</code> d’<span lang="en">Angular Material</span> construit
				sa structure ARIA interne d’une manière qui déclenche un faux positif sur{" "}
				<code>aria-required-children</code> en particulier, alors que le composant est correct par
				ailleurs. Avec le seul <code>excludeSelectors</code> global, l’unique moyen de faire taire
				ce faux positif est <code>excludeSelectors: ['mat-select']</code>, ce qui masque aussi{" "}
				<code>mat-select</code> à <em>toutes les autres règles</em>, dont{" "}
				<code>contrast-minimum</code> et <code>aria-allowed-attr</code>, et supprime en silence
				une couverture réelle avec laquelle ces vérifications n’avaient aucun problème. L’exemple
				ci-dessus laisse <code>mat-select</code> entièrement visible pour toutes les règles sauf
				celle qui se trompe à son sujet.
			</p>
			<p>
				Les exclusions effectives d’une règle donnée sont l’<strong>union</strong> de la liste
				globale et de la liste propre à cette règle : un élément qui correspond à l’une ou à
				l’autre est retiré des candidats de cette règle. Une règle dont tous les éléments qui
				auraient échoué sont exclus de cette façon renvoie <code>outcome: 'pass'</code> ou{" "}
				<code>'notApplicable'</code> (selon sa propre convention en l’absence de candidats), avec{" "}
				<code>occurrences: []</code>, et jamais <code>outcome: 'fail'</code> avec un tableau{" "}
				<code>occurrences</code> vide, puisque le <code>fail</code> d’une règle intégrée nomme
				toujours ce qui a échoué. (Une règle qui lève une exception est un autre cas : elle
				renvoie <code>cantTell</code> avec <code>error</code> renseigné, voir{" "}
				<a href="/results-reports/output-schema/">le schéma de sortie</a>.)
			</p>
			<p>
				Accepte les mêmes formes que l’option globale : un tableau (
				<code>['mat-select', 'mat-stepper']</code>) ou une chaîne séparée par des virgules (
				<code>'mat-select, mat-stepper'</code>).
			</p>
			<p>
				Si vous utilisez un package de binding (<code>@surea11y/binding-base</code> et ses
				wrappers Playwright/Puppeteer), vérifiez dans le README de ce binding si sa méthode de
				builder <code>.exclude()</code> dispose déjà d’une forme par règle : il s’agit d’une forme
				d’<code>engineOptions</code> documentée ici au niveau du moteur, et tous les bindings ne
				l’ont pas encore reprise.
			</p>

			<h2>Recettes : combiner les options pour des scénarios réels</h2>
			<p>
				<strong>Contrôle en CI : WCAG 2.2 AA uniquement, en ignorant un widget tiers que vous ne
				maîtrisez pas</strong>
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
						"  excludeSelectors: ['#cookie-banner', '.intercom-launcher']",
						"}, { wcag: { version: '2.2', level: 'AA' } });",
					]}
				/>
			<p>
				Ajoutez <code>bestPractices: true</code> à côté de <code>wcag</code> pour exécuter aussi les
				règles de bonnes pratiques, qu’un contrôle WCAG rapporte en général sans échouer à cause
				d’elles. Certaines peuvent renvoyer <code>fail</code> (<code>empty-heading</code>) : un
				contrôle qui échoue sur tout <code>fail</code> échoue donc aussi sur celles-là.
			</p>
			<p>
				<strong>Auditeur humain qui fait une passe approfondie sur le contraste dans un vrai
				navigateur</strong> : sacrifiez une partie de la protection contre les faux positifs pour
				obtenir davantage de constats. Dans un vrai navigateur, les règles de contraste vérifient
				déjà la mise en page, et pas seulement les styles calculés : seul le mode de contraste est
				à définir. Exemple avec{" "}
				<code>page.evaluate</code> de Puppeteer (qui accepte plusieurs arguments) ; si vous êtes
				sur Playwright, regroupez d’abord les quatre arguments positionnels dans un seul objet
				(voir <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>) :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' }",
					"}, null);",
				]}
			/>
			<p>
				<strong>Nouvelle analyse ciblée d’une zone après une modification de l’interface, sans le
				shadow DOM</strong> : utile dans un test au niveau composant où seul le widget que vous
				venez de modifier vous intéresse :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, '#checkout-form', {",
					"  includeShadowDom: false",
					"}, { includeRuleIds: ['form-control-programmatic-label-present', 'button-name-present'] });",
				]}
			/>
			<p>
				<strong>Sortie pour les tests de snapshot</strong> : fixez un <code>timestamp</code>{" "}
				pour que l’horodatage propre au résultat ne change pas d’une exécution à l’autre, et
				laissez <code>perfStats</code> et <code>profileRules</code> désactivés : leurs temps
				varient, et leur forme ne fait pas partie de la sortie stable. Un snapshot exige aussi
				le même DOM, les mêmes options et les mêmes conditions de rendu (navigateur, viewport,
				polices) à chaque exécution ; le timestamp seul ne rend pas deux résultats identiques.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z'",
					"}, null);",
				]}
			/>
			<p>
				<strong>Une règle personnalisée propre à votre organisation, à côté des règles
				intégrées</strong>, pour ce seul appel :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  customRules: [{",
					"    id: 'org-no-inline-onclick',",
					"    meta: { title: 'No inline onclick handlers', defaultSeverity: 'moderate' },",
					"    runInPage(ctx) {",
					"      // queryAllSmart applies excludeSelectors, the scope's shadow roots and",
					"      // the hidden-content filter; queryAll is the plain light-DOM query.",
						"      // ctx.helpers.dom reads the DOM so the page's markup can't redirect it.",
						"      const dom = ctx.helpers.dom;",
						"      const els = ctx.helpers.queryAllSmart('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: dom.outerHTML(el),",
					"        summary: 'Inline onclick handler found.',",
					"        hint: 'Move event handling into an external script.'",
					"      }));",
					"",
					"      return { ruleId: ctx.rule.ruleId, outcome: occurrences.length ? 'fail' : 'pass', severity: 'moderate', occurrences };",
					"    }",
					"  }]",
					"}, null);",
				]}
			/>

			<h2><code>customRules</code> : règles enregistrées à l’exécution</h2>
			<p>
				Toutes les règles livrées sont intégrées à <code>src/core.js</code> au moment du build.{" "}
				<code>engineOptions.customRules</code> est la porte de sortie à l’exécution : un tableau
				de descripteurs de règles enregistrés pour ce seul appel. Rien n’est ajouté au catalogue
				statique et rien ne persiste d’un appel à l’autre. Les fonctions de catalogue acceptent les
				mêmes <code>engineOptions</code> et listent ce que contient une analyse faite avec elles :{" "}
				<code>getChecksCatalog(engineOptions)</code> liste les règles personnalisées valides, chaque
				surcharge à la place de sa règle intégrée, <code>getCheckDefById(id, engineOptions)</code>{" "}
				les trouve, <code>getChecksForRunOnly(runOnly, engineOptions)</code> les sélectionne
				comme le fait l’analyse, et <code>getRulesForRunOnly(runOnly, engineOptions)</code> liste
				les agrégations qu’elles ajoutent. C’est voulu, pas une limitation à
				contourner : surea11y reçoit déjà des <code>engineOptions</code> neuves à chaque appel,
				sans configuration globale mutable (contrairement à d’autres moteurs, qui exigent une
				étape <code>configure()</code>/<code>reset()</code> sur un runtime partagé), et les
				règles personnalisées suivent ce même modèle par appel.
			</p>
			<p>
				Appeler directement la bibliothèque n’est qu’une des possibilités ; la CLI expose aussi
				cette fonction via <code>--custom-rules &lt;path&gt;</code> (un fichier local, chargé une
				fois par analyse). Voir{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#custom-rules">
					la documentation de la CLI
				</a>
				.
			</p>
			<p>
				Une règle personnalisée, comme celle d’un pack, s’exécute après les règles intégrées, et
				les <code>ctx.helpers</code>, <code>ctx.engineOptions</code> et{" "}
				<code>ctx.inputs.probes</code> qu’elle reçoit sont en lecture seule : y définir ou y
				supprimer quoi que ce soit lève une exception (la règle est signalée comme{" "}
				<code>cantTell</code> avec cette erreur), si bien qu’elle ne peut pas modifier ce que voient
				les autres règles. Elle ne doit pas modifier la page : une règle qui le fait est nommée dans
				un <code>console.warn</code>. Les résultats gardent l’ordre du catalogue. Quoi qu’elle lève
				ou renvoie, l’analyse renvoie un résultat, et le résultat de la règle est converti en
				données simples, si bien que le résultat de l’analyse peut être écrit en JSON et cloné.
			</p>
			<p>
				Un descripteur a <em>la même forme que l’export d’un module de règle interne</em> : si
				vous savez déjà écrire un fichier de règle pour ce moteur, vous connaissez déjà cette
				API :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"{",
					"  id: 'my-org-custom-rule',          // required",
					"  meta: { title, description, tags, defaultSeverity, defaultConfidence, /* same fields as a rule module's meta */ },",
					"  runInPage(ctx) { /* same ctx shape and same return contract as any built-in rule */ },",
					"  applicability(ctx) { return true; }, // optional, same contract as a built-in rule's applicability",
					"  data: { /* optional, JSON-serializable */ }",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>runInPage</code>/<code>applicability</code> peut être une{" "}
					<strong>vraie fonction</strong> ou une <strong>chaîne contenant le source d’une
					fonction</strong> (c’est-à-dire <code>fn.toString()</code>). Passez une vraie fonction
					lorsque <code>engineOptions</code> ne quitte jamais le realm JS courant (usage simple
					sous Node/jsdom). Passez une chaîne dans le cas contraire, par exemple lors d’un appel
					Playwright <code>page.evaluate(runa11yCoreInPage, {"{ engineOptions }"})</code>, où{" "}
					<code>engineOptions</code> franchit une frontière JSON/structured clone qui ne peut pas
					transporter une référence <code>Function</code> vivante, mais peut transporter une
					chaîne. Le moteur reconstruit une chaîne via <code>new Function</code>, le même
					mécanisme que le build utilise pour intégrer le source de chaque règle intégrée dans le
					runner in-page. Le source de n’importe quelle fonction convient : une fonction
					fléchée, une déclaration <code>function</code> ou une méthode écrite en syntaxe abrégée
					comme dans l’exemple ci-dessus (<code>{"runInPage(ctx) {…}"}</code>, <code>async</code>{" "}
					aussi), dont le <code>toString()</code> n’est pas une expression à lui seul. La
					reconstruction exige que <code>eval</code> soit autorisé : une page dont la Content
					Security Policy interdit <code>'unsafe-eval'</code> ignore une règle fournie sous forme
					de chaîne, et la raison indiquée dans <code>skippedCustomRules</code> désigne cette
					politique ; passez-y une vraie fonction.
				</li>
				<li>
					<code>meta</code> bénéficie des mêmes valeurs par défaut et de la même validation
					qu’une règle intégrée au build : omettez tout ce dont vous n’avez pas besoin ;{" "}
					<code>defaultSeverity</code> vaut par défaut <code>moderate</code>,{" "}
					<code>defaultConfidence</code> <code>medium</code>, <code>type</code>{" "}
					<code>automatic</code>, etc. Une valeur hors de son ensemble (<code>minor</code>/
					<code>moderate</code>/<code>serious</code>/<code>critical</code> ; <code>high</code>/
					<code>medium</code>/<code>low</code> ; <code>automatic</code>/<code>manual</code>,
					sans tenir compte de la casse) est un <code>meta</code> qui échoue à la validation, et
					la règle est ignorée. Une <code>severity</code> renvoyée par une règle hors de
					l’ensemble est remplacée par sa valeur par défaut, avec une note dans{" "}
					<code>error</code>.
				</li>
				<li>
					Une règle personnalisée dont l’<code>id</code> entre en collision avec celui d’une règle
					intégrée <strong>la remplace pour cette analyse</strong>, au lieu que les deux
					s’exécutent. Comme une règle personnalisée homonyme a autant de chances d’être une
					collision accidentelle qu’un remplacement délibéré, chaque collision est signalée de
					deux façons : un <code>console.warn</code> qui nomme le ou les ids, et un tableau{" "}
					<code>overriddenBuiltinIds</code> au premier niveau du résultat (vide en l’absence de
					collision). Voir <a href="/results-reports/output-schema/">le schéma de sortie</a>. Les
					ids sont reconnus quelle que soit la casse : une règle personnalisée{" "}
					<code>IMG-ALT-PRESENT</code> remplace <code>img-alt-present</code> et prend son id, et un
					second avertissement nomme les deux graphies.
				</li>
				<li>
					Une règle personnalisée qui s’est exécutée compte dans l’agrégation WCAG (
					<code>rulesResults</code>) de chaque critère auquel elle est associée, par{" "}
					<code>meta.wcagSc</code> ou par une entrée WCAG dans <code>meta.normativeMappings</code>,
					comme une règle intégrée : si elle échoue, l’agrégation échoue. L’agrégation la marque{" "}
					<code>custom: true</code> parmi ses contributrices et la liste dans{" "}
					<code>data.details.customChecksIds</code>. Une règle personnalisée que la sélection nomme
					pour elle-même (par son id ou l’un de ses tags) et qui s’est exécutée rapporte les
					agrégations de ses critères même quand la sélection n’en nomme aucun (
					<a href="#which-criteria-a-scan-reports">« Les critères que rapporte une analyse »</a>).
					Une surcharge compte là où sa propre
					correspondance l’indique : à la place de sa règle intégrée quand elle est associée à ce
					critère, et dans aucune agrégation quand elle n’est associée à aucun, avec un
					avertissement qui nomme les agrégations qu’elle a quittées.
				</li>
				<li>
					Une règle personnalisée est sélectionnée comme une règle intégrée, par son id et par ses{" "}
					<code>meta.tags</code>. Un <code>runOnly</code> qui nomme une règle personnalisée que
					l’analyse a ignorée lève <code>INVALID_RUN_ONLY</code>, avec la raison pour laquelle elle a
					été ignorée. <code>customRules</code> est une liste : une règle fournie seule n’est pas
					exécutée, et elle est listée dans <code>skippedCustomRules</code>. Sous un profil ou une
					cible WCAG, une règle portant le tag <code>best-practice</code>, ou sans tag WCAG, ne fait
					pas partie de l’exécution : elle est listée dans <code>skippedCustomRules</code>, avec un{" "}
					<code>console.warn</code>, et s’exécute quand vous lui donnez les tags des critères
					qu’elle vérifie (<code>'wcag111'</code>) ou ajoutez{" "}
					<code>runOnly.bestPractices: true</code>. Une règle personnalisée que la sélection exclut (
					<code>{"excludeRuleIds: ['org-b']"}</code>, <code>rules.exclude</code>...) y est listée
					aussi, avec la raison <code>excluded by the selection.</code> et{" "}
					<code>excluded: true</code>, sans avertissement. Une surcharge s’exécute partout où sa
					règle intégrée l’aurait fait.
				</li>
				<li>
					Une règle personnalisée peut signaler une marge comme une règle intégrée : déclarez{" "}
					<code>meta.margin</code> (<code>{"{ measure, unit, limit }"}</code>) et renvoyez{" "}
					<code>marginCandidates</code> (voir{" "}
					<a href={`${core}/docs/RULE_AUTHORING.md#metamargin`}>
						<code>RULE_AUTHORING.md</code>, <code>meta.margin</code>
					</a>
					, le guide d’écriture de règles sur GitHub). Un <code>meta.margin</code> mal formé est
					ignoré, et cette règle ne signale alors aucune marge ; l’analyse continue.
				</li>
				<li>
					Un descripteur invalide (<code>id</code> absent ou qui n’est pas une chaîne,{" "}
					<code>runInPage</code> qui n’est ni une fonction ni une chaîne source reconstructible,{" "}
					<code>applicability</code> qui ne peut pas être converti en fonction,{" "}
					<code>meta</code> qui échoue à la validation, comme <code>deprecated: true</code> sans{" "}
					<code>deprecation</code>, id déjà porté par une autre règle personnalisée de la liste,
					ou id d’une règle composite) est ignoré avec un <code>console.warn</code> qui nomme la
					règle et la raison, et listé dans le <code>skippedCustomRules</code> du résultat ; le
					reste de l’analyse, y compris toutes les règles
					intégrées, s’exécute normalement. Ce n’est pas une lacune de validation à corriger :
					une règle personnalisée est du code arbitraire fourni par l’appelant, donc « écarter
					cette seule entrée, ne pas interrompre l’analyse » est le comportement par défaut le
					plus sûr, à l’image d’une règle <em>intégrée</em> qui lève une exception et qui est
					cantonnée à un <code>cantTell</code> pour cette règle au lieu de faire planter
					l’exécution.
				</li>
				<li>
					Les règles s’exécutent de façon synchrone. Un <code>runInPage</code> ou un{" "}
					<code>applicability</code> qui renvoie une Promise (une fonction <code>async</code>)
					est signalé comme <code>cantTell</code> avec une <code>error</code> qui l’indique, tout
					comme un <code>runInPage</code> qui renvoie autre chose qu’un objet résultat. Un{" "}
					<code>outcome</code> hors de <code>pass</code>, <code>fail</code>,{" "}
					<code>cantTell</code> et <code>notApplicable</code> (comme <code>'failed'</code>)
					devient <code>cantTell</code>, et <code>error</code> nomme la valeur renvoyée. Le{" "}
					<code>type</code> d’une règle vient de son <code>meta</code> : un <code>type</code> dans
					ce qu’elle renvoie est ignoré, avec une note dans <code>error</code>.
				</li>
				<li>
					Les résultats apparaissent dans <code>checksResults</code> exactement comme ceux de
					n’importe quelle autre règle, y compris le remplissage automatique de{" "}
					<code>selector</code>/<code>html</code>/<code>structuralPath</code> pour les occurrences{" "}
					<code>fail</code>/<code>cantTell</code> qui ne joignent que{" "}
					<code>{"{ __node }"}</code> (voir{" "}
					<a href="/results-reports/output-schema/">le schéma de sortie</a>).
				</li>
				<li>
					Un <code>fail</code> nomme ce qui a échoué. Le <code>fail</code> d’une règle
					personnalisée sans occurrence (un échec de la page entière) est signalé avec une
					occurrence sur l’élément du document (<code>selector: 'html'</code>, code de raison{" "}
					<code>FAIL_WITHOUT_OCCURRENCE</code>), pour que JUnit, SARIF, les baselines et le rapport
					HTML l’affichent comme l’échec qu’il est.
				</li>
			</ul>

			<h2 id="packs">Packs : règles et normes venues de l’extérieur de core</h2>
			<p>
				Un pack apporte des règles, des variantes des règles de core, une norme ou une liste de
				contrôle, ainsi que les messages qu’ils utilisent, depuis un paquet qui lui est propre, sans
				build de core. Passez les packs à une analyse dans <code>engineOptions.packs</code> ;
				l’analyse s’exécute sur un moteur préparé avec eux, selon les étapes qu’utilise le build
				pour les règles propres à core, si bien que la norme, les profils, les agrégations et les
				règles optionnelles d’un pack se comportent comme ceux d’une norme intégrée. Le moteur est
				conservé pour la prochaine analyse avec les mêmes objets pack : un crawl qui passe les mêmes
				packs à chaque page ne les prépare qu’une fois.
			</p>
			<CodeBlock
					lang="js"
					lines={[
						"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
						"const acmePolicy = require('./acme-policy-pack');",
						"",
						"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' });",
						"result.engine.packs; // ['@acme/a11y-policy@1.0.0']",
						"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
					]}
				/>
			<p>
				Un pack incompatible avec core (sa plage <code>core</code> exclut cette version, un
				identifiant de règle sans l’espace de noms, une clé de dictionnaire que core possède déjà)
				est ignoré avec un <code>console.warn</code>, listé dans le <code>skippedPacks</code> du
				résultat sous la forme <code>{"{ name, reason }"}</code>, et l’analyse s’exécute sans lui ;
				avec <code>strictOptions</code>, elle lève une erreur, avec{" "}
				<code>code: 'INVALID_ENGINE_OPTIONS'</code>. Des packs en conflit entre eux lèvent
				une erreur. Dans une page, un pack est d’abord enregistré avec{" "}
				<code>packScript(packs)</code> et nommé dans <code>engineOptions.packs</code> sous la forme{" "}
				<code>name@version</code>. Ce que contient un pack, comment l’utiliser depuis chaque
				binding, test-matchers et la CLI, et comment en écrire un sont décrits dans{" "}
				<a href="/configuration/packs/">Packs</a>.
			</p>

			<h2><code>contextSelector</code> (2ᵉ argument du runner, pas un champ d’<code>engineOptions</code>)</h2>
			<p>
				Un sélecteur CSS (ou un tableau de sélecteurs) qui limite l’analyse à un ou plusieurs
				sous-arbres, résolu via <code>document.querySelectorAll</code> (toutes les
				correspondances, pas seulement la première). Passez <code>null</code> pour analyser le
				document entier.
			</p>
			<ul>
				<li>
					<strong>Un sélecteur qui ne correspond à rien n’analyse rien.</strong> Toutes les règles
					renvoient <code>notApplicable</code>, y compris celles qui portent sur la page entière,
					et le <code>contextMatch</code> du résultat l’indique :{" "}
					<code>{"{ elementCount: 0, unmatchedSelectors: ['#mian'] }"}</code> (voir{" "}
					<a href="/results-reports/output-schema/#top-level-result">le schéma de sortie</a>).
					L’exécution émet aussi un <code>console.warn</code>. Un périmètre absent de la page
					n’est pas élargi à la page entière : un résultat sur un contenu que vous n’avez jamais
					demandé, avec un <code>pass</code> portant sur toute la page, se lirait comme un
					résultat sur la partie que vous avez demandée. Dans un tableau, un sélecteur qui ne
					correspond à rien est listé dans <code>unmatchedSelectors</code> tandis que les autres
					sont analysés normalement ; un contenu qui n’est présent que de temps en temps, comme
					une bannière de cookies, peut donc figurer dans la liste. Avant la 1.10.0, un périmètre
					sans correspondance se rabattait sur le document entier, sans rien en dire dans le
					résultat.
				</li>
				<li>
					<strong>Un sélecteur que le navigateur ne sait pas analyser lève une exception</strong>,
					seul ou dans un tableau, avant l’exécution de toute règle :{" "}
					<code>contextSelector: "#main[" is not a valid CSS selector.</code> L’erreur porte{" "}
					<code>code: 'INVALID_CONTEXT_SELECTOR'</code> et <code>selector</code>, le sélecteur
					fautif. Contrairement à un sélecteur qui ne correspond à rien, c’est toujours une
					erreur dans l’appel. <code>runa11yCoreAcrossFrames</code> rejette avec la même erreur.
					Une erreur qui traverse <code>page.evaluate</code> (Playwright, Puppeteer) ne garde que
					son message ; c’est pourquoi le message nomme l’option et le sélecteur. Avant la
					1.10.0, un sélecteur invalide était ignoré, si bien qu’employé seul il analysait le
					document entier.
				</li>
				<li>
					<strong>Toute valeur autre qu’un sélecteur, un tableau de sélecteurs ou <code>null</code>{" "}
					lève la même erreur</strong>, en nommant ce qui a été passé : un élément, une NodeList, un
					objet <code>{"{ include, exclude }"}</code>, un nombre, ou un élément de tableau qui n’est
					pas une chaîne (<code>contextSelector[1] must be a CSS selector, not the number 5.</code>).
					Passez plutôt un sélecteur qui correspond à l’élément, et placez ce qu’un{" "}
					<code>exclude</code> écarterait dans <code>engineOptions.excludeSelectors</code>.
				</li>
				<li>
					<strong>Une chaîne unique</strong> peut elle-même être une liste de sélecteurs séparés
					par des virgules (sémantique d’union CSS ordinaire) : <code>'#a, #b'</code> analyse à
					la fois <code>#a</code> et <code>#b</code>.
				</li>
				<li>
					<strong>Un tableau de chaînes</strong> analyse l’union des correspondances de chaque
					sélecteur : <code>['#a', '.card']</code> se comporte comme <code>'#a, .card'</code> ; la
					forme tableau existe pour les appelants qui construisent la liste par programme.
				</li>
				<li>
					<strong>Shadow DOM.</strong> Avec <code>includeShadowDom</code> (par défaut), un
					périmètre inclut les shadow roots qu’il contient, et un périmètre qui est lui-même un
					shadow host inclut sa propre shadow root. Le sélecteur est évalué sur le document : il
					ne peut donc pas sélectionner un élément <em>à l’intérieur</em> d’une shadow root ;
					ciblez plutôt son hôte.
				</li>
				<li>
					Les zones qui se chevauchent ou s’imbriquent sont automatiquement dédupliquées : un
					élément atteignable depuis plusieurs racines correspondantes n’est jamais signalé
					qu’une fois, et non une fois par zone.
				</li>
				<li>
					<strong>Ce que signifie un résultat limité à un périmètre.</strong> La plupart des
					règles jugent chaque élément isolément, et jugent les éléments du périmètre exactement
					comme dans une analyse de la page entière. Deux sortes de règles dépendent de la page
					qui les entoure. Les règles portant sur la page entière (
					<code>page-title-present</code>, <code>landmark-one-main</code> et les autres listées
					sous <code>fragment</code> ci-dessus) renvoient <code>notApplicable</code>. Les règles
					qui comparent des éléments à l’échelle de la page (<code>landmark-unique</code>,{" "}
					<code>landmark-no-duplicate-banner</code>, <code>-contentinfo</code> et{" "}
					<code>-main</code>, <code>landmark-banner-is-top-level</code>,{" "}
					<code>-complementary-</code>, <code>-contentinfo-</code> et{" "}
					<code>-main-is-top-level</code>, <code>accesskeys</code>, <code>heading-order</code>,{" "}
					<code>identical-links-same-purpose</code>, <code>identical-iframes-same-purpose</code>)
					signalent toujours ce qu’elles trouvent dans le périmètre, puisque deux landmarks qui y
					partagent un nom le partagent sur n’importe quelle page, mais renvoient{" "}
					<code>notApplicable</code> au lieu de <code>pass</code> : l’analyse n’a vu qu’une
					partie de la page et ne peut donc pas affirmer que la page est conforme.{" "}
					<code>duplicate-id</code> et <code>duplicate-id-aria</code> comparent chaque élément du
					périmètre avec le document entier, puisque son doublon peut se trouver hors du
					périmètre, et signalent un élément du périmètre dont l’id apparaît ailleurs. Leur{" "}
					<code>pass</code> signifie qu’aucun élément du périmètre ne partage son id avec un autre
					élément de la page ; une paire de doublons entièrement hors du périmètre n’est pas
					signalée, comme pour toute règle, et ce <code>pass</code> ne dit donc pas que la page
					entière est exempte de doublons. <code>target-size-minimum</code> juge les cibles du
					périmètre par rapport à leurs voisines n’importe où dans le document, puisque
					l’exception d’espacement dépend de ce que la page place à côté d’une cible.{" "}
					<code>text-spacing-content-loss</code> juge le texte du périmètre et vérifie s’il en
					vient à chevaucher du texte ailleurs sur la page.
				</li>
			</ul>
		</>
	);
}
