import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const remedyRows = [
	{
		id: "interaction",
		situation: "Un contenu n’apparaît qu’après un clic, un survol ou un chargement de données",
		remedy: "Amenez vous-même la page dans cet état, puis analysez-la. Analysez chaque état qui compte.",
	},
	{
		id: "layout",
		situation:
			"Une vérification a besoin de la mise en page : taille des cibles, espacement du texte, contraste par rapport à ce qui est peint sous le texte",
		remedy: (
			<>
				Analysez dans un vrai navigateur. jsdom n’a pas de mise en page (la propriété{" "}
				<code>engine.environment.layout</code> du résultat vaut <code>false</code>) : ces règles
				y mesurent donc moins, ou renvoient <code>notApplicable</code>, comme l’indiquent les
				sections ci-dessous.
			</>
		),
	},
	{
		id: "keyboard",
		situation: "Une exigence porte sur l’utilisation au clavier, comme un piège au clavier",
		remedy: "Testez-la au clavier. Aucune analyse ne la couvre.",
	},
	{
		id: "canttell",
		situation: (
			<>
				Un résultat est <code>cantTell</code>
			</>
		),
		remedy: (
			<>
				Lisez les propriétés <code>uncertainty.code</code> et <code>uncertainty.needed</code> de
				l’occurrence, et tranchez à la main.
			</>
		),
	},
	{
		id: "responsive",
		situation: "La page est responsive",
		remedy: "Analysez à chaque largeur qui vous importe.",
	},
	{
		id: "differ",
		situation: "Deux exécutions sur la même page diffèrent",
		remedy: (
			<>
				Comparez <code>engine.version</code> et <code>engine.environment</code> (viewport,
				polices et images encore en cours de chargement), et rechargez la page entre les analyses.
			</>
		),
	},
	{
		id: "no-failures",
		situation: "Une analyse ne rapporte aucun échec",
		remedy: (
			<>
				Ce n’est pas une déclaration de conformité. Voir{" "}
				<a href="/conformance/wcag-mapping/">Correspondance de conformité WCAG</a>.
			</>
		),
	},
];

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				Ce que le moteur n’évalue pas, ce qui dépend de l’endroit où une analyse s’exécute (jsdom,
				un navigateur, ou les scripts de la page elle-même), et ce qui demande une revue par une
				personne. Certains points sont des choix de conception, chacun avec sa justification ;
				chacun indique ce qu’une analyse ne peut pas établir et, quand il existe, ce qu’il faut
				faire. Lisez ceci avant de vous fier à un résultat sans constat.
			</p>

			<h2>Que faire</h2>
			<DataTable
				label="Que faire pour chaque limite"
				rowKey="id"
				columns={[
					{ key: "situation", label: "Si…", width: "40%" },
					{ key: "remedy", label: "Alors…" },
				]}
				rows={remedyRows}
			/>
			<p>Les sections ci-dessous en donnent les raisons.</p>

			<h2 id="outside-what-one-scan-can-see">Hors de ce qu’une analyse peut voir</h2>
			<p>
				Une analyse lit la page à un moment donné, dans un seul état, à un seul viewport : le DOM,
				ses styles calculés et, dans un vrai navigateur, sa mise en page. Elle n’utilise pas la
				page comme le fait une personne. Elle ne la parcourt pas au clavier, n’ouvre pas ses
				menus, n’attend pas ses données et ne la redimensionne pas. (Dans un navigateur, quelques
				règles donnent le focus à un élément ou ajoutent une feuille de style le temps de leur
				vérification, puis rétablissent la page ; voir la section suivante.) Les points ci-dessous
				demandent ce type d’interaction dans la durée : une règle de plus ne peut donc pas les
				couvrir. Ils demandent un test d’interaction ou une personne :
			</p>
			<ul>
				<li>
					<strong>Détection des pièges au clavier</strong> (WCAG 2.1.2) : il faut déplacer le
					focus dans la page et observer où il arrive, ce qu’aucune lecture ponctuelle du DOM ne
					permet. Une technique viable a été étudiée (voir la section sur les pièges au clavier
					de{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#keyboard-trap-detection-scoping-notes`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					), mais elle n’est pas implémentée : une analyse n’explore pas les interactions des
					utilisateurs ni les états auxquels elles mènent, et aucune des vérifications qui
					modifient brièvement la page ne lui fait parcourir le focus comme le ferait la détection
					des pièges. En attendant, rien dans le balisage statique ne peut la remplacer.
				</li>
				<li>
					<strong>Redistribution / rognage au zoom</strong> (WCAG 1.4.10) : il faut une mesure
					réelle de la mise en page (<code>clientWidth</code>/<code>scrollWidth</code>) dans un
					viewport simulé équivalent à 320 px. Contrairement à certaines heuristiques fondées sur
					les déclarations CSS ailleurs dans ce moteur, il n’existe aucun indicateur dans le
					balisage statique pour « le contenu est-il rogné à un zoom de 400 % ».
				</li>
				<li>
					<strong>État dynamique / après interaction</strong> : tout ce qui n’existe qu’après un
					clic, un survol ou un chargement de données asynchrone (le contenu d’une modale, les
					options d’une liste déroulante, les messages d’erreur de validation d’un formulaire) est
					invisible pour une analyse du DOM <em>actuel</em> de la page. Si votre framework le rend
					d’emblée (même hors écran ou <code>hidden</code>), il peut être analysé ; s’il n’existe
					qu’après une interaction, il ne le peut pas, à moins que vous ne déclenchiez vous-même
					cette interaction avant l’analyse (par exemple, cliquer sur le bouton, <em>puis</em>{" "}
					analyser). Analyser l’état ouvert vérifie ce qu’il contient, pas si une personne qui
					utilise le clavier ou un lecteur d’écran peut l’ouvrir, l’utiliser et le refermer.
				</li>
			</ul>

			<h2>Dépendantes de l’environnement : selon la façon dont vous l’exécutez</h2>
			<ul>
				<li>
					<strong>jsdom (Node, sans vrai navigateur) n’a pas de moteur de mise en page CSS.</strong>{" "}
					Les règles qui ont besoin d’une géométrie réelle, notamment{" "}
					<code>target-size-minimum</code> (WCAG 2.5.8, qui nécessite un vrai{" "}
					<code>getBoundingClientRect()</code>), renvoient <code>notApplicable</code> sous jsdom
					seul plutôt que de deviner. Exécutez l’analyse dans un vrai navigateur
					(Puppeteer/Playwright, voir le <span lang="en">Pattern 2</span> de{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>) pour obtenir
					de vrais résultats de ces règles.
				</li>
				<li>
					<strong>
						Savoir si un texte passe à la ligne nécessite la mise en page ; les résultats
						d’espacement du texte sur un texte qui ne passe pas à la ligne sont donc signalés pour
						revue.
					</strong>{" "}
					Le WCAG 1.4.12 et les règles ACT associées ne s’appliquent qu’à un texte contenant une
					possibilité de retour à la ligne, ce qu’une analyse statique ne peut pas établir.{" "}
					<code>avoid-inline-spacing</code> considère par défaut que le texte passe à la ligne :
					une valeur forcée ordinaire inférieure au seuil échoue donc toujours ; lorsqu’aucun
					retour à la ligne n’est possible pour une raison qui <em>est</em> visible sans mise en
					page (texte non autorisé à passer à la ligne, ou élément à largeur fixe dans un ancêtre
					à défilement horizontal), elle renvoie <code>cantTell</code> à la place. Un texte qui ne
					passe jamais à la ligne pour une autre raison est toujours signalé comme un échec.
				</li>
				<li>
					<strong>Le moteur s’exécute sur les objets natifs JavaScript de la page elle-même.</strong>{" "}
					Une page dont les scripts cassent l’un de ceux sur lesquels il s’appuie (
					<code>Array.prototype.filter</code>, <code>Map</code>, <code>JSON.stringify</code>,{" "}
					<code>String.prototype.toLowerCase</code> et d’autres) arrête l’analyse avec une erreur
					de code <code>PAGE_BUILTINS_BROKEN</code> qui nomme chacun d’eux, plutôt que de donner un
					résultat qui paraît correct et qui est faux ; un objet cassé avant l’injection du bundle
					(<code>Object.keys</code>) empêche le chargement du bundle. Une page qui ajoute{" "}
					<code>then</code> à <code>Object.prototype</code> est analysée comme n’importe quelle
					autre. Les méthodes du DOM qu’une page remplace (<code>getComputedStyle</code>,{" "}
					<code>querySelectorAll</code>, <code>getBoundingClientRect</code>) ne sont pas
					vérifiées : les règles lisent ce qu’elles renvoient.
				</li>
				<li>
					<strong>Un nom n’est pas calculé à partir d’un contenu imbriqué sur plus de 256 niveaux.</strong>{" "}
					Le parcours s’arrête là (Chrome ne donne aucun nom à partir d’un contenu situé 100 niveaux
					plus bas) : pour un élément dont le seul nom se trouve plus profond,{" "}
					<a href="/rules/button-name-present/"><code>button-name-present</code></a>,{" "}
					<a href="/rules/link-name-present/"><code>link-name-present</code></a>, les règles de
					nom des éléments de menu, options, éléments summary, onglets, infobulles et éléments
					d’arbre, ainsi que <a href="/rules/empty-heading/"><code>empty-heading</code></a>, posent
					la question (<code>name_contentTooDeep</code>) ; les autres règles qui calculent un nom à
					partir du contenu lisent un tel contenu comme vide.
				</li>
				<li>
					<strong>Le contenu d’une shadow root fermée ne peut pas être lu.</strong> Aucun script
					n’accède à l’intérieur d’un <code>{"attachShadow({ mode: 'closed' })"}</code> ou d’un{" "}
					<code>shadowrootmode="closed"</code> déclaratif : le moteur ne peut donc pas voir ce
					qu’un navigateur en tire comme nom. <code>button-name-present</code> et{" "}
					<code>link-name-present</code>, ainsi que les règles de nom des éléments de menu,
					options, onglets, éléments d’arbre, éléments summary et infobulles, posent la question
					pour un élément dont le nom pourrait provenir d’un élément personnalisé qui s’affiche
					sans montrer de contenu lisible, au lieu de le faire échouer. Une racine fermée sur un
					élément intégré (un <code>&lt;span&gt;</code>) ressemble à une racine vide, comme une
					icône dessinée en CSS : un bouton qui en contient une échoue donc toujours. Vérifiez à la
					main ce qu’expose un tel composant, par exemple avec un lecteur d’écran.
				</li>
				<li>
					<strong>
						Un nom ou un état qu’un élément personnalisé définit par <code>ElementInternals</code>{" "}
						ne peut pas être lu.
					</strong>{" "}
					<code>{"this.attachInternals().ariaLabel = 'Save'"}</code> nomme l’élément dans tous les
					navigateurs, mais aucun script ne peut le relire. Quand un composant conserve ses
					internals dans une propriété (<code>_internals</code>, <code>internals</code>,{" "}
					<code>internals_</code>, <code>__internals</code>), le moteur les lit par elle, et fait
					réussir ou échouer l’élément selon ce qu’ils indiquent. Pour tout autre élément
					personnalisé défini sans nom (ou sans état requis), les règles de nom et{" "}
					<a href="/rules/aria-required-attr/"><code>aria-required-attr</code></a> posent la
					question (<code>name_internals</code>, <code>state_internals</code>) au lieu de le faire
					échouer. Vérifiez ces éléments dans l’arbre d’accessibilité du navigateur, ou installez
					le hook optionnel des internals avant l’exécution des scripts de la page :{" "}
					<code>installInternalsHook()</code> dans chaque binding (voir{" "}
					<a href="/getting-started/">Premiers pas</a>) et dans test-matchers, ou{" "}
					<code>internalsHookScript()</code> de core pour une page à vous (voir{" "}
					<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, qui montre où l’installer). Le hook enregistre les internals de chaque élément pour
					l’analyse : il signale donc aussi un élément qui n’en a jamais attaché. Un rôle défini
					uniquement par les internals (<code>internals.role</code>) est lu là où se trouvent les
					internals, par une propriété ou par le hook, comme rôle par défaut de l’élément ;
					conservé dans un champ privé sans le hook, il n’est pas vu, et l’élément ne fait pas
					l’objet d’une question, puisque presque tous les composants pourraient en avoir un. Les
					éléments intégrés, et les éléments personnalisés non définis, sont jugés comme avant.
				</li>
				<li>
					<strong>
						Une analyse faite pendant qu’une boîte de dialogue modale est ouverte voit la boîte
						de dialogue, pas la page.
					</strong>{" "}
					Un <code>&lt;dialog&gt;</code> ouvert avec <code>showModal()</code> (ou un{" "}
					<code>&lt;dialog aria-modal="true"&gt;</code> ouvert) rend le reste du document inerte,
					et les navigateurs n’exposent que la boîte de dialogue aux technologies d’assistance. Le
					moteur fait de même : le contenu derrière la boîte de dialogue est exclu de toutes les
					règles, comme les autres contenus masqués, et les règles qui portent sur la structure de
					la page elle-même (<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>,{" "}
					<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>,{" "}
					<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>,{" "}
					<a href="/rules/region/"><code>region</code></a>) renvoient <code>notApplicable</code>,
					puisque l’analyse ne peut pas voir cette structure. Analysez de nouveau la page, boîte de
					dialogue fermée, pour juger ce qui se trouve derrière. Deux limites : un{" "}
					<code>&lt;dialog&gt;</code> modal placé dans un shadow root n’est pas détecté, et une
					modale personnalisée construite à partir d’un élément <code>role="dialog"</code>, avec{" "}
					<code>inert</code> ou <code>aria-hidden</code> sur le reste de la page, n’est prise en
					compte qu’à travers ces attributs, qui masquent la page mais n’indiquent pas aux règles de
					structure qu’une boîte de dialogue est ouverte. Les autres moteurs diffèrent sur ce point :
					certains font de même, d’autres évaluent la page derrière la boîte de dialogue comme si
					rien n’était ouvert.
				</li>
				<li>
					<strong>
						<code>&lt;dialog&gt;</code> et les autres éléments masqués par la feuille de style par
						défaut du navigateur
					</strong>{" "}
					(sans attribut <code>open</code>, <code>display: none</code> selon la spécification),
					ainsi que tout autre sous-arbre masqué via <code>display:none</code>,{" "}
					<code>visibility:hidden</code>, <code>[hidden]</code> ou un{" "}
					<code>&lt;details&gt;</code> fermé, et un sous-arbre <code>[inert]</code> (que les
					règles portant sur l’apparence du contenu, comme le contraste et l’espacement du texte,
					jugent quand même, puisqu’il est dessiné), sont{" "}
					<strong>exclus de l’évaluation des règles par défaut</strong>, comme le font les autres
					moteurs établis qui tiennent compte de la visibilité. C’est un choix par défaut délibéré (
					<code>engineOptions.includeHiddenElements: false</code>), pas un oubli : un contenu
					masqué n’est pas accessible aux technologies d’assistance ni au clavier tant qu’il n’est
					pas affiché, si bien que signaler par défaut un défaut de balisage qu’il contient serait
					souvent du bruit. Définissez <code>engineOptions.includeHiddenElements: true</code> pour
					évaluer malgré tout les sous-arbres masqués ou repliés, par exemple pour repérer un
					défaut de balisage (comme une référence d’ID ARIA cassée) avant même l’ouverture d’une
					boîte de dialogue. Voir <a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>{" "}
					pour l’option et la liste exacte des mécanismes de masquage qu’elle couvre.
				</li>
				<li>
					<strong>jsdom n’a pas de popovers.</strong> Il intègre la règle HTML qui masque un{" "}
					<code>[popover]</code> fermé, mais pas <code>showPopover()</code>, et lit{" "}
					<code>:popover-open</code> de façon incohérente. Là où le DOM n’a pas de{" "}
					<code>showPopover</code>, le moteur traite tout <code>[popover]</code> autre qu’un{" "}
					<code>&lt;dialog&gt;</code> ouvert comme fermé et masqué : son contenu n’est donc pas
					vérifié ; un popover que le CSS de la page garde visible n’est pas vérifié non plus sous
					jsdom. Dans un navigateur, le moteur lit ce qui est affiché. Pour vérifier le contenu
					d’un popover, analysez la page dans un navigateur avec le popover ouvert.
				</li>
				<li>
					<strong>jsdom conserve une taille de police telle qu’elle est écrite.</strong> Un
					navigateur renvoie une taille de police calculée en px ; jsdom conserve un mot-clé ou un{" "}
					<code>calc()</code> tel qu’il est écrit. Le moteur lit les mots-clés aux tailles d’un
					navigateur pour une taille par défaut de 16px (<code>xx-large</code> vaut 32px) ainsi que
					les <code>calc()</code> de longueurs et de nombres, si bien que le texte de grande taille
					est distingué comme dans un navigateur. <code>larger</code> et <code>smaller</code>, qui
					dépendent de la taille du parent, ne sont pas résolus sous jsdom : un tel texte est soumis
					au rapport du texte normal, et son message indique une taille de 0px. Un navigateur
					résout les deux.
				</li>
				<li>
					<strong>
						Le <code>text-shadow</code> calculé par jsdom n’est pas fiable à la deuxième lecture
						d’un même élément.
					</strong>{" "}
					Confirmé avec jsdom 29.1.1 : lire une deuxième fois la valeur calculée de{" "}
					<code>text-shadow</code> sur le même élément (par n’importe quel accesseur, depuis
					n’importe quelle <code>CSSStyleDeclaration</code> nouvellement obtenue pour cet élément,
					cache ou non) renvoie silencieusement une valeur différente et fausse, « pas d’ombre »,
					au lieu de la vraie valeur déclarée. La première lecture est toujours correcte. Ce
					moteur contourne le problème en interne en lisant le <code>text-shadow</code> de chaque
					élément une seule fois par exécution et en mettant le résultat en cache (voir{" "}
					<code>__textShadowInfoEl</code> dans <code>src/core/contrast-helpers.js</code>), de sorte
					qu’une analyse n’est pas affectée. Le problème n’apparaît que si vous lisez vous-même{" "}
					<code>getComputedStyle(el).textShadow</code> plus d’une fois sur le même élément analysé
					par jsdom ; un vrai navigateur n’a pas ce bug.
				</li>
				<li>
					<strong>
						Une deuxième analyse du même DOM jsdom peut perdre un style qui surcharge une
						propriété raccourcie.
					</strong>{" "}
					jsdom conserve le style calculé d’un élément une fois lu, jusqu’à la prochaine
					modification du DOM, et la copie qu’il renvoie depuis ce cache perd une propriété
					détaillée qui surcharge une propriété raccourcie venant d’une règle moins spécifique :
					avec <code>{"*{background:#888}"}</code> et{" "}
					<code>style="background-image:url(hero.png)"</code>, la première lecture donne l’image
					et toutes les suivantes <code>none</code>. Une analyse garde le style lu en premier et
					n’est donc pas affectée, mais une deuxième analyse du même DOM inchangé peut manquer
					l’image et valider un texte sur lequel la première posait la question (
					<code>contrast-computable</code>). Analysez un nouveau parsing, ou modifiez le DOM entre
					les analyses, ce qui vide le cache de jsdom ; <code>@surea11y/core/testing</code> le fait
					pour sa propre deuxième analyse. Un vrai navigateur n’a pas ce bug.
				</li>
				<li>
					<strong>
						Sous jsdom, le temps d’analyse croît avec le carré de la profondeur du DOM, et non avec
						le nombre d’éléments.
					</strong>{" "}
					jsdom résout le CSS hérité en parcourant la chaîne des ancêtres d’un élément à chaque
					appel de <code>getComputedStyle</code>, donc un appel par élément coûte
					O(éléments x profondeur). Mesuré sur jsdom 29.1.1 sans aucun code du moteur : 4000
					éléments dans une seule chaîne prennent 8,3 s rien qu’en <code>getComputedStyle</code>,
					contre 0,25 s pour les mêmes 4000 éléments placés côte à côte. Les parcours d’ancêtres du
					moteur lui-même sont plafonnés et restent linéaires : ce coût vient donc de jsdom, pas
					des règles. Il concerne <code>runDomRulesInPage</code> et tout ce qui repose dessus, y
					compris <code>@surea11y/test-matchers</code> ; un vrai navigateur calcule le style hérité
					nativement et ne présente pas ce comportement. Les frameworks de composants imbriquent
					couramment sur 100 à 300 niveaux, ce qui reste largement rapide ; cela devient sensible
					au-delà d’environ 1000.
				</li>
				<li>
					<strong>Sous jsdom, le temps d’analyse croît aussi avec la taille de la feuille de style.</strong>{" "}
					jsdom calcule un style en confrontant chaque règle CSS à l’élément. Le moteur ne modifie
					pas le DOM pendant une analyse, donc chaque élément n’est calculé qu’une fois, mais cette
					fois coûte O(règles) : sur une page d’actualités enregistrée (7 916 éléments, 2 683
					règles CSS, jsdom 29.1.1), le premier calcul de 5 735 éléments prend environ 224 s d’une
					analyse de 243 s. Ce coût vient de jsdom ; un vrai navigateur calcule la même page en une
					fraction de seconde. jsdom laisse aussi les propriétés personnalisées non substituées, si
					bien qu’une couleur définie avec <code>var()</code> y est illisible : le texte ou
					l’arrière-plan fait l’objet d’une question (<code>contrast-computable</code>) au lieu
					d’être mesuré. Utilisez un vrai navigateur pour les grandes pages de production.
				</li>
				<li>
					<strong>
						Dans un vrai navigateur, certaines règles modifient la page le temps de leur
						vérification, et les scripts de la page peuvent réagir.
					</strong>{" "}
					Pour mesurer ce que dessine le navigateur, <code>css-hidden-focus</code> donne le focus
					aux éléments comme le ferait le clavier, et désactive les transitions sur l’élément qu’il
					mesure ; <code>aria-hidden-focus</code> donne le focus à un élément situé dans un
					sous-arbre <code>aria-hidden</code> pour voir si la page déplace aussitôt le focus
					ailleurs (une sentinelle de piège à focus) ; <code>text-spacing-content-loss</code> ajoute une feuille de style avec
					l’espacement de WCAG 1.4.12. Tout cela est rétabli avant que la règle ne se termine : le
					focus, la position de défilement, les attributs style et la feuille de style ajoutée. Ce
					qui ne peut pas être rétabli, c’est ce que font les scripts de la page en réaction, puisque
					donner le focus à un élément déclenche ses gestionnaires <code>focus</code> et{" "}
					<code>focusin</code> : un carrousel peut passer à la diapositive focalisée, en déplaçant{" "}
					<code>aria-hidden</code> avec elle, ou activer un bouton. Les résultats de cette analyse
					sont ceux de la page telle qu’elle a été trouvée : <code>aria-hidden-focus</code> lit
					quels sous-arbres sont masqués, ainsi que le balisage qu’il rapporte, avant de donner le
					focus à quoi que ce soit. Mais la page reste dans l’état où ses scripts l’ont mise, si bien
					qu’une deuxième analyse de la même page peut trouver autre chose : si vous analysez une
					page que vous continuez d’utiliser, ou analysez deux fois la même page, rechargez-la
					entre-temps.
				</li>
				<li>
					<strong>Balisage statique et état du DOM en direct / après hydratation.</strong> La
					logique des règles elle-même ne dépend pas de la provenance du DOM : elle évalue le DOM
					qu’on lui fournit, qu’il s’agisse de HTML statique analysé par jsdom (<span lang="en">Pattern 1</span>) ou d’un
					onglet de navigateur réel déjà chargé et hydraté (<span lang="en">Pattern 2</span>, voir{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
					). En revanche, la CLI (<code>npx @surea11y/cli scan &lt;url&gt;</code>) ne récupère que
					du HTML statique, sans exécuter de JS ; voir{" "}
					<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md">la documentation de la CLI</a>.
					Pour un widget hydraté par un framework JS dont le balisage rendu côté serveur livre
					volontairement un état avant que le JS client ne le synchronise (par exemple{" "}
					<code>&lt;input type="checkbox" aria-checked="true"&gt;</code> livré avant que le JS
					client ne définisse la propriété native <code>checked</code> en conséquence lors de
					l’hydratation, un motif extrêmement courant et tout à fait légitime), une analyse CLI
					ne voit que le balisage d’avant l’hydratation. Une analyse exécutée dans un véritable
					onglet de navigateur chargé voit au contraire l’état après hydratation ; les deux
					peuvent donc diverger précisément sur cette catégorie d’éléments, pour des raisons sans
					aucun rapport avec l’exactitude des règles. C’est pourquoi{" "}
					<code>aria-checked-state-mismatch</code> est plafonnée à <code>manual</code>/<code>cantTell</code>{" "}
					plutôt qu’à un <code>fail</code> strict. Si vous avez besoin de la précision du DOM en
					direct pour les vérifications sensibles à l’hydratation, exécutez la bibliothèque
					directement sur une page déjà chargée via le <span lang="en">Pattern 2</span>, et non via la CLI qui récupère
					du HTML statique.
				</li>
				<li>
					<strong>Une mise en page est mesurée à un seul viewport, avec les polices dont la page
					dispose à ce moment-là.</strong> Les règles qui mesurent ce que dessine le navigateur,{" "}
					<a href="/rules/text-spacing-content-loss/">
						<code>text-spacing-content-loss</code>
					</a>
					,{" "}
					<a href="/rules/target-size-minimum/">
						<code>target-size-minimum</code>
					</a>{" "}
					et{" "}
					<a href="/rules/skip-link/">
						<code>skip-link</code>
					</a>
					, valent pour le viewport auquel la page a été analysée : une page responsive peut couper
					du texte, ou rétrécir une cible, à une largeur et pas à une autre, et un texte mesuré
					avant le chargement de sa police web n’a pas la même largeur. Le résultat enregistre les
					deux dans{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>
					, et les constats de ces règles reprennent leur viewport et indiquent ce qui a été mesuré
					(de combien le texte a dépassé le bord, la taille d’une cible et sa proximité avec sa
					voisine) : un constat qui diffère d’une exécution à l’autre peut ainsi être rattaché aux
					conditions. Analysez à chaque largeur qui vous importe, et attendez que la page soit
					stable avant d’analyser : <code>waitForPageReady()</code> attend l’événement load, les
					polices web et les images (voir{" "}
					<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
						<code>INTEGRATION.md</code>
					</a>
					, qui montre comment l’appeler avant une analyse), et le résultat enregistre dans{" "}
					<code>engine.environment</code> si des polices ou des images étaient encore en cours de
					chargement.
				</li>
				<li>
					<strong>
						Dans un navigateur, le contraste est mesuré par rapport à ce qui est peint sous le
						texte, tel que la page se présente à ce moment-là.
					</strong>{" "}
					Un texte sur une image, un dégradé, ou un rendu qui n’en couvre qu’une partie fait
					l’objet d’une question (
					<a href="/rules/contrast-computable/"><code>contrast-computable</code></a>,{" "}
					<code>reasonCode</code> <code>BACKGROUND_OVERLAP</code>) au lieu d’être mesuré. Un texte
					qu’une boîte en <code>overflow: hidden</code> garde entièrement hors de vue, comme une
					diapositive de carrousel hors de son rail, est écarté tant qu’il n’est pas visible :
					analysez la page dans cet état pour le vérifier. Les boîtes fixes et sticky au-dessus du
					texte sont ignorées. Sous jsdom, le texte est mesuré par rapport à ses seuls ancêtres.
					Analysée en couleurs forcées (contraste élevé de Windows, ou{" "}
					<code>forced-colors: active</code> émulé), la page est maintenue dans ses propres
					couleurs pendant la mesure : les résultats sont donc ceux obtenus sans couleurs forcées ;
					là où ce n’est pas possible (une Content Security Policy qui bloque le{" "}
					<code>&lt;style&gt;</code> du moteur dans un navigateur qui ne sait pas adopter une
					feuille de style), les couleurs mesurées sont en partie celles du navigateur, et chaque
					occurrence de contraste le signale (<code>details.forcedColors</code>). Le
					fonctionnement de la mesure, étape par étape, est décrit dans{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#contrast`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					, sur GitHub.
				</li>
				<li>
					<strong>
						Le texte généré n’est mesuré que dans un navigateur, et seulement là où il peut être
						lu.
					</strong>{" "}
					Le texte qu’écrit le <code>content</code> d’un <code>::before</code> ou d’un{" "}
					<code>::after</code>, et le <code>::marker</code> d’un élément de liste, sont mesurés
					dans la couleur et la police du pseudo-élément ; un contenu illisible (un compteur dans
					un <code>@counter-style</code> propre à la page), et un <code>::before</code> ou un{" "}
					<code>::after</code> positionné hors du flux sans arrière-plan propre, font l’objet d’une
					question (<code>contrast-computable</code>) à la place. Les marqueurs ne sont recherchés
					que sur <code>&lt;li&gt;</code>. Sous jsdom, qui ne calcule aucun style de
					pseudo-élément, le texte généré est écarté.
				</li>
				<li>
					<strong>
						Le texte et le placeholder d’un champ de formulaire sont mesurés tels que le champ les
						dessine, avec des lacunes.
					</strong>{" "}
					Le texte que le navigateur dessine dans un champ de date ou d’heure vide, ainsi que le
					bouton et le nom de fichier d’un champ de fichier, ne sont pas mesurés. Un{" "}
					<code>&lt;select&gt;</code> déroulant est mesuré tel que le contrôle fermé le dessine,
					son option affichée dans les couleurs du select ; une autre de ses options avec ses
					propres couleurs n’apparaît que dans la liste que la plateforme dessine à l’ouverture, et
					donne <code>cantTell</code> (<code>SELECT_OPTION_COLOR</code>). Un placeholder sous son
					rapport donne <code>cantTell</code> (<code>PLACEHOLDER_BELOW_THRESHOLD</code>) plutôt
					qu’un échec : WCAG soumet le texte de placeholder au rapport, mais considère que les
					couleurs que la page laisse entièrement au navigateur le respectent (technique G148), et
					distinguer les deux sur de vraies pages n’est pas encore établi. Sous jsdom, les
					placeholders ne sont pas mesurés du tout. Détails :{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#form-fields`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					.
				</li>
				<li>
					<strong>
						<a href="/rules/target-size-minimum/"><code>target-size-minimum</code></a> calcule la
						zone atteignable à partir de la mise en page plutôt que par un test d’atteinte.
					</strong>{" "}
					Les cibles sous la ligne de flottaison ou dans une boîte défilante sont mesurées en
					entier, comme si elles étaient défilées jusqu’à être visibles ; les boîtes fixes et
					sticky au-dessus d’une cible sont ignorées ; les transformations 3D, la plupart des
					formes de <code>clip-path</code> et le rognage arrondi d’un ancêtre sont mesurés par leur
					boîte englobante ; et les liens séparés uniquement par des séparateurs (« Edit |
					Delete ») qui se gênent mutuellement font l’objet d’une question plutôt que d’être
					exemptés. Sous jsdom, la règle renvoie <code>notApplicable</code>. Détails :{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#target-size`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					.
				</li>
				<li>
					<strong>Le contraste est calculé en sRGB.</strong> Les couleurs exprimées en{" "}
					<code>oklch()</code>, <code>oklab()</code>, <code>lab()</code>, <code>lch()</code> ou{" "}
					<code>color()</code> (y compris la forme calculée de <code>color-mix()</code> et des
					couleurs relatives) sont converties en sRGB, comme un écran standard les affiche ; une
					couleur hors de sRGB, comme un rouge <code>display-p3</code> saturé, est ramenée à sa
					limite, ce que Chromium dessine sur un écran sRGB. Un écran à large gamut peut afficher
					cette couleur plus saturée que ne le suppose le rapport. Une couleur d’arrière-plan que le
					moteur ne sait pas convertir, un <code>color()</code> dans un espace qu’il ne connaît pas,
					n’est pas traitée comme transparente : <code>contrast-computable</code> pose la question
					pour ce texte avec le <code>reasonCode</code> <code>BACKGROUND_UNPARSABLE</code>, et les
					autres règles de contraste l’écartent.
				</li>
			</ul>

			<h2>Non tentées : des jugements qu’on ne peut pas automatiser sans risque</h2>
			<p>
				Il n’existe pour ces cas aucune heuristique aussi sûre au niveau d’exigence de ce moteur
				(<code>fail</code> doit rester réservé aux violations déterministes, point final). Les
				implémenter malgré tout reviendrait soit à ne détecter presque rien (trop restrictif pour
				être utile), soit à risquer de vrais faux positifs (trop large pour être fiable) :
			</p>
			<ul>
				<li>
					<strong>« Ce texte de titre ou d’étiquette a-t-il du sens ? »</strong> Les titres et les
					étiquettes réels sont extrêmement variés et légitimement courts (« FAQ », « Nom »,
					« Présentation » conviennent tous), donc rien dans le balisage ne permet de décider si
					un titre décrit la section qu’il introduit ou si une étiquette décrit le champ à côté
					d’elle. Ce qui <em>est</em> décidable, c’est que certaines chaînes ne peuvent rien
					décrire : <code>heading-quality</code> et <code>form-control-label-quality</code>{" "}
					signalent les textes d’exemple oubliés, les emplacements de gabarit numérotés, les noms
					de fichiers et les URL à partir de listes de correspondances exactes, le même compromis
					précision plutôt que rappel que fait <code>link-name-quality</code>. Ce sont toutes deux
					des règles <code>manual</code> plafonnées à <code>cantTell</code> : elles proposent un
					candidat à la revue, elles n’affirment jamais que le texte est incorrect.
				</li>
				<li>
					<strong>« Ce message d’erreur décrit-il le problème ? »</strong> Ce qui déclenche une
					erreur de validation et son contenu dépendent presque toujours du JS ou d’une
					bibliothèque de validation, invisibles pour une analyse statique dès le départ ; ce
					n’est pas seulement un problème de conception d’heuristique.
				</li>
				<li>
					<strong>Sous-vérifications fines sur les médias temporels</strong> (WCAG 1.2.x compte
					13 règles ACT sans règle correspondante ici ; voir la section des lacunes de{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#gaps-no-corresponding-rule`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					) : le
					contenu audio/vidéo lui-même est fondamentalement invérifiable à partir du balisage
					statique ; les deux cas les plus larges et les plus sûrs sont couverts (
					<code>media-alternative-transcript-evidence</code>, <code>video-caption</code>), les
					plus spécifiques ne le sont pas, par choix.
				</li>
				<li>
					<strong>Analyse du contenu des textes sous forme d’image</strong> (WCAG 1.4.5/1.4.9) : il faudrait
					une compréhension d’image équivalente à de l’OCR ; hors du périmètre d’un moteur fondé
					sur le balisage statique.
				</li>
				<li>
					<strong>Activation par le mouvement</strong> (WCAG 2.5.4) : cas de niche, peu
					fréquent en pratique ; non prioritaire, mais pas structurellement impossible.
				</li>
				<li>
					<strong>Les deux cas limites ACT de <code>img-alt-decorative</code></strong> : un{" "}
					<code>&lt;img&gt;</code> dont la requête réseau n’est pas dans l’état « <span lang="en">completely
					available</span> » (encore en chargement, ou cassée), et un <code>&lt;canvas&gt;</code>{" "}
					entièrement transparent (rien n’y est réellement dessiné) sont tous deux exclus de
					l’applicabilité d’ACT. Aucun des deux n’est décidable par une analyse statique du DOM
					(pas de décodage d’image, pas de lecture des pixels du canvas) ; ils restent donc dans
					le périmètre plutôt que d’être exclus : un faux positif rare, qu’un humain écarte d’un
					coup d’œil, est plus sûr que de sous-signaler en silence un vrai élément exclu ou non
					décoratif.
				</li>
			</ul>

			<h2>Ce que cela signifie en pratique</h2>
			<p>
				L’essentiel de ce qui précède n’est pas propre à surea11y. Tout outil qui juge un seul état
				du DOM partage les limites décrites dans{" "}
				<a href="#outside-what-one-scan-can-see">Hors de ce qu’une analyse peut voir</a>, et la
				plupart des outils automatisés laissent aussi les jugements à une personne, même si les
				outils diffèrent par leur façon de s’exécuter, ce qu’ils vérifient et la façon dont ils
				rapportent ce qu’ils ne peuvent pas trancher. Si nous le
				disons explicitement ici, c’est pour une raison : <strong>un <code>pass</code> de ce
				moteur (ou de tout outil automatisé) ne remplace jamais la revue manuelle que les WCAG
				exigent elles-mêmes pour les critères ci-dessus.</strong> Voir{" "}
				<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a> pour savoir
				exactement ce qu’un <code>pass</code> ou un <code>pass</code> composite affirme, et ce
				qu’il n’affirme pas.
			</p>
		</>
	);
}
