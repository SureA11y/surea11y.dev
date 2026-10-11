import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				Ce que le moteur n’évalue pas, ce qui dépend de l’environnement où il s’exécute, et ce
				qui demande une revue par une personne. Lisez ceci avant de vous fier à un résultat sans
				constat.
			</p>

			<h2>Aspects que l’analyse n’évalue pas</h2>
			<p>
				surea11y vérifie la page dans son état actuel. Certaines règles modifient brièvement le
				focus ou les styles pour mesurer une condition précise, et dans un vrai navigateur les
				règles peuvent mesurer la mise en page (jsdom n’en a pas), mais l’analyse n’explore pas
				systématiquement les interactions des utilisateurs, les états asynchrones ni les
				différentes tailles de viewport. Les points suivants demandent donc des tests à part, avec
				de l’automatisation de navigateur et une revue humaine selon le cas :
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
					utilisateurs ni les états auxquels elles mènent. Quelques vérifications modifient
					brièvement la page pour la mesurer (<code>aria-hidden-focus</code> tente de donner le
					focus à des éléments, <code>text-spacing-content-loss</code> applique un espacement de
					test), mais aucune ne fait parcourir la page au focus comme le ferait la détection des
					pièges. En attendant, rien dans le balisage statique ne peut la remplacer.
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
					analyser).
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
					plus bas) : pour un bouton ou un lien dont le seul nom se trouve plus profond,{" "}
					<a href="/rules/button-name-present/"><code>button-name-present</code></a> et{" "}
					<a href="/rules/link-name-present/"><code>link-name-present</code></a> posent la
					question (<code>name_contentTooDeep</code>) ; les autres règles qui calculent un nom à
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
					icône dessinée en CSS : un bouton qui en contient une échoue donc toujours.
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
					<code>&lt;details&gt;</code> fermé, sont{" "}
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
					<strong>Dans un navigateur, les règles de contraste mesurent le texte par rapport à ce qui
					est peint en dessous, dans l’ordre de peinture CSS.</strong>{" "}
					Un texte positionné au-dessus d’un élément frère, d’une image <code>&lt;img&gt;</code>{" "}
					d’en-tête, d’une superposition <code>::before</code>, ou ramené sur un autre bloc par une
					marge négative repose sur un rendu qui n’appartient à aucun de ses ancêtres, et un texte
					qui déborde de la boîte d’un ancêtre, ou qui a un <code>z-index</code> négatif, ne se
					trouve pas sur l’arrière-plan de cet ancêtre. Dans un navigateur, le moteur mesure les
					boîtes de ligne du texte, trouve les éléments qui peignent à cet endroit (une couleur ou
					une image d’arrière-plan, un contenu remplacé comme <code>img</code>, <code>video</code>,{" "}
					<code>canvas</code>, <code>iframe</code>, des formes SVG), et les ordonne avec le texte et
					les arrière-plans de ses ancêtres selon l’ordre de peinture CSS : contextes
					d’empilement, <code>z-index</code>, boîtes positionnées et flottants, puis ordre du
					document. Quand tout ce qui se trouve entre le texte et la première couche opaque est une
					couleur unie qui couvre tout le texte, le rapport est mesuré par rapport à celle-ci ;
					quand une image, un dégradé, un rendu qui ne couvre qu’une partie du texte ou un rendu
					peint par-dessus le texte entre en jeu,{" "}
					<a href="/rules/contrast-computable/"><code>contrast-computable</code></a> pose la
					question pour ce texte avec le <code>reasonCode</code> <code>BACKGROUND_OVERLAP</code>,
					et les règles qui calculent un rapport de contraste l’écartent. Un texte qu’une boîte
					qui rogne son débordement garde hors de vue, comme les options plus bas dans une liste
					défilante, est mesuré tel qu’il apparaît une fois défilé dans cette boîte. Un texte qu’une
					boîte en <code>overflow: hidden</code> garde entièrement hors de vue, comme une
					diapositive de carrousel hors de son rail, n’est pas mesuré du tout : d’après ses seuls
					styles, une telle boîte ne se distingue pas d’une boîte qui masque ce texte
					définitivement, si bien que le texte est écarté plutôt que deviné. Analysez la page dans
					cet état (la diapositive affichée) pour le vérifier. Limites : une boîte fixe ou sticky
					au-dessus du texte est écartée, puisqu’elle ne le couvre qu’à la position de défilement
					où l’analyse a été faite ; un dégradé sous le texte n’est pas échantillonné, si bien
					qu’un texte pâle sur un dégradé pâle fait l’objet d’une question plutôt que d’un échec ;
					et un effet de groupe (<code>opacity</code>, un filtre, un mode de fusion) sur un ancêtre
					laisse le chevauchement à une vérification plus grossière. Sous jsdom, il n’y a pas de
					mise en page : le texte est mesuré par rapport à ses seuls ancêtres.
				</li>
				<li>
					<strong>Le texte d’un champ de formulaire est mesuré tel que le champ le dessine.</strong>{" "}
					La valeur d’un <code>&lt;input&gt;</code> qui affiche du texte (text, search, email, url,
					tel, password, number, les types de date et d’heure) et la valeur actuelle d’un{" "}
					<code>&lt;textarea&gt;</code> sont mesurées dans la couleur du champ par rapport à son
					arrière-plan ; tant que la valeur est vide, le placeholder est mesuré dans la couleur et
					la police de <code>::placeholder</code>, atténuées par son <code>opacity</code>. Non
					mesurés : le texte que le navigateur dessine quand un champ de date ou d’heure est vide
					(<code>mm/dd/yyyy</code>), le bouton et le nom de fichier d’un champ de fichier, et
					l’option affichée d’un <code>&lt;select&gt;</code>. Sous jsdom, il n’y a pas de style{" "}
					<code>::placeholder</code> : les placeholders n’y sont donc pas mesurés, les valeurs si.
					Un placeholder sous son rapport donne <code>cantTell</code> plutôt qu’un échec (
					<code>PLACEHOLDER_BELOW_THRESHOLD</code>) : WCAG soumet le texte de placeholder au
					rapport, mais considère que les couleurs que la page laisse entièrement au navigateur le
					respectent (technique G148), et distinguer les couleurs du navigateur de celles de la page
					sur de vraies pages n’est pas encore établi : pour l’instant, une personne tranche.
				</li>
				<li>
					<strong>
						<code>target-size-minimum</code> mesure la zone qu’un pointeur peut atteindre, calculée
						à partir de la mise en page.
					</strong>{" "}
					Une cible est sa border box, avec ses coins arrondis et ses transformations 2D, rognée par{" "}
					<code>clip</code> et <code>clip-path: inset()</code> sur sa chaîne de blocs conteneurs et
					pas plus grande qu’une boîte de cette chaîne qui rogne son <code>overflow</code>, avec le
					contenu qui en dépasse, moins les boîtes peintes par-dessus qui reçoivent les événements
					de pointeur ; elle est assez grande quand un carré de 24 sur 24 aligné sur la page tient à
					l’intérieur (Understanding 2.5.8). Comme la zone vient de la mise en page et non d’un
					test d’atteinte, les cibles sous la ligne de flottaison sont mesurées comme celles qui
					sont visibles, de même que les cibles situées dans une boîte qui rogne son débordement,
					telles qu’une fois défilées dans celle-ci. Les coins arrondis sont mesurés tels qu’ils
					sont dessinés. Les boîtes fixes et sticky au-dessus d’une cible sont écartées ; une cible
					placée avant le début de la page, là où le défilement ne peut pas aller (un lien
					d’évitement à <code>left: -9999px</code>), n’est pas une cible. Restent mesurées par leur
					boîte englobante : les transformations 3D, les autres formes de <code>clip-path</code>, et
					le rognage arrondi d’un ancêtre. Son exception « en ligne » couvre un lien dans une
					phrase, ce qu’elle lit comme du texte contenant une lettre ou un chiffre hors de toute
					cible dans le segment du bloc du lien compris entre deux retours à la ligne ; les liens
					séparés uniquement par des séparateurs (« Edit | Delete ») qui se gênent mutuellement
					font l’objet d’une question plutôt que d’être exemptés. Sous jsdom, qui n’a pas de mise
					en page, la règle renvoie <code>notApplicable</code>.
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
					environ 8 cas distincts au niveau des règles ACT au-delà de ce qui est implémenté) : le
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
				Rien de ce qui précède n’est propre à surea11y : tous les outils d’accessibilité par
				analyse statique (y compris les autres moteurs établis) partagent les limites
				structurelles, et la plupart partagent aussi celles qui relèvent du jugement. Si nous le
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
