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
				Suivez les étapes de <code>howToCheck</code> de l’occurrence, et tranchez à la main.{" "}
				<code>uncertainty</code> dit ce qui manquait, et <code>lean</code> vers où pointent les
				indices de la page (voir le{" "}
				<a href="/results-reports/output-schema/#how-to-check">schéma de sortie</a>).
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
					autre. Une page qui remplace <code>Array.from</code>, comme le font Prototype et MooTools,
					est analysée elle aussi (depuis core 1.16.0) : le code propre à core ne l’utilise pas. Une
					règle de pack ou personnalisée qui l’utilise arrête l’analyse à cet endroit, avec{" "}
					<code>PAGE_BUILTINS_BROKEN</code> qui nomme <code>Array.from</code>, sauf si la sélection
					écarte la règle. Les méthodes du DOM qu’une page remplace (<code>getComputedStyle</code>,{" "}
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
					<strong>Les gestionnaires d’événements ajoutés par script ne peuvent pas être listés.</strong>{" "}
					Un gestionnaire ajouté avec <code>addEventListener</code>, ou défini comme propriété (
					<code>el.onclick = fn</code>), ne laisse rien dans le balisage et aucun script ne peut le
					relire : les règles de clavier (
					<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>,{" "}
					<a href="/rules/mouse-only-event-handlers/"><code>mouse-only-event-handlers</code></a>) ne
					jugent donc que les attributs de gestionnaire en ligne : un <code>role="button"</code>{" "}
					focalisable dont le gestionnaire de clic est ajouté par script n’est pas signalé (un
					élément qui ne peut pas recevoir le focus fait tout de même l’objet d’une question de{" "}
					<a href="/rules/widget-keyboard-focusable/"><code>widget-keyboard-focusable</code></a>),
					un gestionnaire de clavier ajouté par script ne peut pas justifier un{" "}
					<code>onclick</code> en ligne, et <code>password-paste-enabled</code> ne peut pas savoir
					si un gestionnaire de collage ajouté par script remet le texte qu’un <code>onpaste</code>{" "}
					en ligne annule. Installez le hook facultatif des gestionnaires (
					<code>listenerHookScript()</code>) avant l’exécution des scripts de la page : les règles
					jugent alors aussi les gestionnaires qu’il enregistre et, là où il n’a vu aucun
					gestionnaire de clavier, font échouer un contrôle qu’Entrée et Espace ne peuvent pas
					actionner. Un gestionnaire de clic qu’un framework ajoute à son élément racine sert des
					éléments que rien ne désigne : même avec le hook, ceux-là sont jugés sur leur balisage.
					Où l’installer :{" "}
					<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, sur GitHub.
				</li>
				<li>
					<strong>La façon dont une région live a été remplie ne se voit pas après coup.</strong>{" "}
					Un message d’état est annoncé quand une région live change alors que les technologies
					d’assistance peuvent l’atteindre (4.1.3), mais une analyse voit la page à un instant
					donné. Sans aide,{" "}
					<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>{" "}
					ne juge que ce qui est là : une région live masquée aux technologies d’assistance par{" "}
					<code>aria-hidden</code> ou <code>inert</code>, ou derrière un{" "}
					<code>&lt;dialog&gt;</code> modal ouvert, ou laissée en <code>aria-busy</code>. Avec le
					hook facultatif des régions live (<code>liveRegionHookScript()</code>), elle pose aussi
					la question pour une région que la page a ajoutée avec son texte déjà dedans, ou affichée
					et remplie d’un coup, et <code>getAnnouncements()</code> liste ce que la page a rendu
					disponible à l’annonce. Aucun des deux ne dit ce qu’un lecteur d’écran a prononcé : cela
					dépend du lecteur d’écran. Le hook ne voit pas à l’intérieur des shadow roots. Détails :{" "}
					<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, sur GitHub.
				</li>
				<li>
					<strong>
						Une analyse faite pendant qu’une boîte de dialogue modale est ouverte voit la boîte
						de dialogue, pas la page.
					</strong>{" "}
					Un <code>&lt;dialog&gt;</code> ouvert avec <code>showModal()</code> rend inerte le reste
					du document, et les navigateurs ne présentent que la boîte de dialogue aux technologies
					d’assistance. Une boîte de dialogue ouverte avec l’attribut <code>open</code> ou{" "}
					<code>show()</code> n’est pas modale, même avec <code>aria-modal="true"</code> : la page
					derrière reste atteignable, et le moteur la juge. jsdom n’a pas de top layer et ne peut pas
					ouvrir de boîte de dialogue modale : sous jsdom, rien ne se trouve donc derrière l’une
					d’elles, et le même balisage reçoit les mêmes verdicts que dans un navigateur (depuis
					core 1.16.0) ; un test jsdom qui remplace <code>showModal()</code> en définissant{" "}
					<code>open</code> et <code>aria-modal="true"</code> sur la boîte de dialogue définit{" "}
					<a href="/configuration/engine-options/"><code>engineOptions.assumeModal: true</code></a>{" "}
					pour qu’une telle boîte de dialogue soit considérée comme modale. De plusieurs boîtes de
					dialogue modales, seule celle du dessus est jugée. Le moteur suit la boîte de dialogue
					modale : le contenu derrière elle est écarté de toutes les règles, comme tout autre
					contenu masqué, et ne reçoit pas le focus, et les règles portant sur la structure de la page elle-même (
					<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>,{" "}
					<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>,{" "}
					<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>,{" "}
					<a href="/rules/region/"><code>region</code></a>) renvoient <code>notApplicable</code>,
					puisque l’analyse ne peut pas voir cette structure. Analysez à nouveau la page avec la
					boîte de dialogue fermée pour juger ce qu’il y a derrière. Une modale personnalisée, un
					élément affiché avec <code>role="dialog"</code> ou <code>role="alertdialog"</code> et{" "}
					<code>aria-modal="true"</code>, rend aussi ces règles de structure{" "}
					<code>notApplicable</code> ; <code>aria-modal</code> ne rend rien inerte, donc toutes les
					autres règles jugent toujours la page derrière. Une boîte de dialogue modale dans un
					shadow root ouvert compte comme une boîte de dialogue du document ; une boîte de dialogue
					dans un shadow root fermé ne peut pas être trouvée. Une modale personnalisée sans{" "}
					<code>aria-modal="true"</code> n’est traitée qu’à travers le <code>inert</code> ou le{" "}
					<code>aria-hidden</code> que la page met sur le reste, qui masquent la page sans indiquer
					aux règles de structure qu’une boîte de dialogue est ouverte.
				</li>
				<li id="framed-documents">
					<strong>Un document affiché dans une frame n’est pas jugé comme une page à part entière.</strong>{" "}
					Dans une frame, les règles qui portent sur la page (<code>page-title-present</code>,{" "}
					<code>page-title-patterns</code>, <code>html-lang-attr-present</code>,{" "}
					<code>meta-viewport-zoom-enabled</code>, <code>meta-viewport-large</code>,{" "}
					<code>page-has-heading-one</code>, <code>landmark-one-main</code>,{" "}
					<code>bypass-blocks-present</code> et <code>region</code>) sont{" "}
					<code>notApplicable</code> : c’est la page autour de la frame qui a le titre, la langue et
					les landmarks qu’utilisent les personnes, et un navigateur ignore le{" "}
					<code>&lt;meta&gt;</code> viewport d’un document affiché dans une frame. Un exécuteur de
					tests qui affiche la page testée dans une frame à lui définit{" "}
					<code>engineOptions.topLevelDocument: true</code>, pour que cette page soit jugée comme la
					page (c’est le cas de <a href="/getting-started/cypress/">@surea11y/cypress</a>).{" "}
					<code>runa11yCoreAcrossFrames</code> lit une frame sous <code>aria-hidden="true"</code>{" "}
					comme du contenu aria-hidden et une frame sous <code>[inert]</code> comme du contenu
					inerte, dont seul l’aspect visuel est jugé, et laisse de côté une frame derrière une boîte
					de dialogue modale ouverte ; un binding qui analyse les frames une par une définit
					lui-même <code>embeddedAriaHidden</code> et <code>embeddedInert</code> (voir{" "}
					<a href="/configuration/engine-options/">Options du moteur</a>). Core 1.15.0 et ultérieur.
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
					<strong>exclus de l’évaluation des règles par défaut</strong>. C’est un choix par défaut
					délibéré (
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
					<strong>
						Un <code>aria-details</code> qui désigne un contenu masqué n’est pas signalé.
					</strong>{" "}
					<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a> vérifie
					que l’id désigne un élément, pas que l’élément est affiché. Chromium écarte la relation de
					son arbre d’accessibilité tant que l’élément est masqué et la rétablit dès qu’il est
					affiché : des détails qui s’ouvrent à la demande sont donc annoncés une fois ouverts, et
					les WCAG n’en demandent pas plus. Pour vérifier la relation telle que la reçoivent les
					technologies d’assistance, analysez la page avec les détails affichés.
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
					<strong>Sous jsdom, le texte d’un <code>content</code> CSS ne nomme rien.</strong> jsdom
					ne calcule aucun style pour <code>::before</code> et <code>::after</code> : un bouton ou
					un lien dont le seul texte est généré (<code>content: "Save"</code>,{" "}
					<code>content: attr(data-label)</code>) a un nom dans un navigateur et n’en a pas sous
					jsdom, où <code>button-name-present</code>, <code>link-name-present</code> et les autres
					règles de nom le font échouer. Analysez ces pages dans un navigateur.
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
					<strong>jsdom ignore les feuilles de style propres à un shadow root.</strong> Constaté avec
					jsdom 29.1.1 : ni un <code>&lt;style&gt;</code> dans un shadow root ni ses{" "}
					<code>adoptedStyleSheets</code> n’atteignent le style calculé de ses éléments, si bien que
					sous jsdom les couleurs, les tailles, et un <code>display: none</code> ou un{" "}
					<code>visibility: hidden</code> qui y sont définis ne sont pas vus. Les règles jugent
					alors le contenu d’un composant comme s’il n’avait pas de style : le contraste est mesuré
					sur les couleurs par défaut, et un contenu que son CSS masque est jugé comme affiché. Seule
					exception : la couleur d’un lien, que les helpers de contraste calculent eux-mêmes à
					partir des feuilles du shadow root. Analysez dans un navigateur les pages construites avec
					des composants web stylés.
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
					contre 0,25 s pour les mêmes 4000 éléments placés côte à côte. Le moteur lit les ancêtres de
					chaque élément jusqu’à la racine, une fois par analyse, même si les règles de contraste
					mesurent chaque texte par rapport à chaque arrière-plan situé au-dessus de lui ; l’essentiel
					du temps revient toujours à jsdom. jsdom résout aussi une valeur héritée en remontant
					récursivement les éléments au-dessus, ce qui épuise la pile vers un millier de niveaux de
					profondeur : le moteur lit une propriété d’un élément situé à plus de 100 niveaux de
					profondeur en résolvant d’abord les éléments au-dessus de lui, si bien que chaque analyse
					lit la même valeur. Il concerne <code>runDomRulesInPage</code> et tout ce qui repose dessus, y
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
						Sous jsdom, le CSS en couches et conditionnel est appliqué à ce qui masque un élément,
						avec les médias de jsdom.
					</strong>{" "}
					Le <code>getComputedStyle</code> de jsdom ne lit aucune règle à l’intérieur de{" "}
					<code>@layer</code>, <code>@supports</code> ou <code>@container</code> : sur une page
					Tailwind v4, <code>hidden</code> et <code>sr-only</code> n’y masquaient donc rien. Depuis
					core 1.16.0, le moteur applique lui-même ces règles aux propriétés qu’il lit pour savoir
					si un élément est affiché, mais traite <code>@media</code> comme jsdom : seuls{" "}
					<code>all</code> et <code>screen</code> s’appliquent, si bien qu’une règle sous{" "}
					<code>(width &gt;= 48rem)</code> ne compte pas plus dans une couche qu’en dehors, et que{" "}
					<code>hidden md:block</code> de Tailwind reste masqué sous jsdom là où un navigateur de
					bureau l’affiche. <code>@supports</code> est vrai pour tout test de propriété et pour un{" "}
					<code>selector()</code> qui s’analyse, <code>@container</code> ne s’applique pas, et une
					valeur <code>revert</code>, <code>revert-layer</code> ou <code>var()</code> laisse celle
					de jsdom. Les autres propriétés, dont les couleurs, restent celles de jsdom. Analysez
					dans un navigateur une page qui change ce qu’elle affiche selon le viewport.
				</li>
				<li>
					<strong>
						Sous jsdom, la couleur d’un lien est calculée à partir des règles de la page.
					</strong>{" "}
					jsdom classe son propre <code>{":link { color: #0000EE }"}</code> avec les règles de la
					page selon la seule spécificité, si bien que le <code>{"a { color: #fff }"}</code> d’une
					page perd face à lui, alors qu’un navigateur applique la règle de la page. Sous jsdom, le
					moteur calcule la couleur d’un lien, et du texte qu’il contient, à partir des règles de la
					page comme le fait la cascade d’un navigateur ; un lien qu’aucune règle de la page ne
					colore garde la couleur de lien du navigateur, et un lien est considéré comme non visité.
					Là où ce n’est pas possible (une feuille de style illisible, un <code>var()</code>, une
					règle sous <code>@supports</code>, <code>@layer</code>, <code>@container</code> ou
					imbriquée dans une autre), le texte fait l’objet d’une question (
					<code>contrast-computable</code>, <code>FOREGROUND_UNPARSABLE</code>) au lieu d’être
					mesuré dans le bleu de jsdom. Dans un navigateur, la couleur calculée est lue telle
					quelle.
				</li>
				<li>
					<strong>Sous jsdom, le texte est jugé sur son <code>font-size</code> calculé.</strong>{" "}
					Dans un navigateur, les règles de contraste et <code>p-as-heading</code> jugent le texte à
					la taille où il est dessiné, <code>zoom</code> CSS, transformation SVG et{" "}
					<code>font-size-adjust</code> compris, ce dernier d’après les métriques de la police (
					<code>font-size: 24px; font-size-adjust: 0.3</code> dessine Arial à environ 14px, ce qui
					n’est pas du texte de grande taille). jsdom ne met rien en page et ne lit aucune police :
					le <code>font-size</code> y est pris tel quel. Analysez dans un navigateur une page qui
					met ainsi son texte à l’échelle.
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
					l’espacement de WCAG 1.4.12 ;{" "}
					<code>focus-not-obscured-minimum</code> et <code>-enhanced</code> font défiler la page pour
					amener un élément sous une boîte fixe ou sticky et y effectuer un test d’atteinte, ce qui
					déclenche les gestionnaires <code>scroll</code> de la page après leurs mesures (un en-tête
					qui se masque au défilement peut réagir) ; les règles de contraste ajoutent un frame vide hors de
					l’écran pour lire les couleurs propres du navigateur pour un placeholder ou un{" "}
					<code>&lt;select&gt;</code> déroulant. L’analyse amène aussi chaque animation en cours à
					un point fixe pendant l’exécution des règles (une animation finie à sa fin, une animation
					infinie à son début), si bien qu’un fondu d’apparition est mesuré une fois stabilisé. Tout
					cela est rétabli avant que la règle ou l’analyse ne se termine : le focus, la position de
					défilement, les attributs style, les animations, la feuille de style ajoutée et le frame. Ce
					qui ne peut pas être rétabli, c’est ce que font les scripts de la page en réaction, puisque
					donner le focus à un élément déclenche ses gestionnaires <code>focus</code> et{" "}
					<code>focusin</code> : un carrousel peut passer à la diapositive focalisée, en déplaçant{" "}
					<code>aria-hidden</code> avec elle, ou activer un bouton. Les résultats de cette analyse
					sont ceux de la page telle qu’elle a été trouvée : <code>aria-hidden-focus</code> lit
					quels sous-arbres sont masqués, ainsi que le balisage qu’il rapporte, avant de donner le
					focus à quoi que ce soit. Mais la page reste dans l’état où ses scripts l’ont mise, si bien
					qu’une deuxième analyse de la même page peut trouver autre chose : si vous analysez une
					page que vous continuez d’utiliser, ou analysez deux fois la même page, rechargez-la
					entre-temps. Comme l’espacement est retiré ensuite, une capture d’écran prise après
					l’analyse montre comme tenant dans son espace un texte que{" "}
					<code>text-spacing-content-loss</code> a trouvé coupé ; un tel constat nomme l’état dans
					lequel il a été établi (<code>data.details.evidenceState: 'text-spacing'</code>), et{" "}
					<code>evidenceState()</code> de <code>@surea11y/core</code> remet la page dans cet état
					pour la capture, comme le font les <code>.screenshots()</code> des bindings.
				</li>
				<li>
					<strong>Une feuille de style d’une autre origine ne peut pas être lue depuis la page.</strong>{" "}
					Le script d’une page ne peut pas lister les règles d’une feuille servie par une autre
					origine (un CDN, un service de polices) : <code>css-orientation-lock</code> pose donc la
					question (<code>STYLESHEETS_NOT_READABLE</code>), et <code>css-hidden-focus</code> et{" "}
					<code>css-focus-indicator-suppressed</code> ne peuvent pas y voir une règle de focus.
					Passez son texte dans <code>engineOptions.styleSheetTexts</code> :{" "}
					<code>preloadStyleSheets()</code> récupère celles que le serveur partage (CORS), et un
					outil qui pilote le navigateur peut récupérer les autres depuis l’extérieur de la page
					(voir{" "}
					<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
						<code>INTEGRATION.md</code>
					</a>
					, sur GitHub).
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
					couleurs pendant la mesure : les résultats sont donc ceux obtenus sans couleurs forcées,
					sauf si le CSS de la page réagit aux couleurs forcées (une media query{" "}
					<code>forced-colors</code>, ou une couleur système comme <code>GrayText</code>), ce que
					l’analyse signale dans <code>engine.environment.forcedColorsCss</code> ; là où ce n’est
					pas possible (une Content Security Policy qui bloque le{" "}
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
						Le texte d’une page sans arrière-plan est mesuré sur le canevas du schéma de couleurs
						de la page, là où ce canevas est connu.
					</strong>{" "}
					Le navigateur peint son canevas derrière une page qui ne peint aucun arrière-plan opaque,
					dans la couleur <code>Canvas</code> du schéma de couleurs dans lequel la page est
					dessinée, que décide le <code>color-scheme</code> de la page : blanc pour une page qui
					n’en déclare aucun, quelle que soit la préférence de l’utilisateur, et le canevas sombre
					pour une page dessinée en sombre. Les règles de contraste y mesurent le texte dans les
					deux modes. Non mesurés, et objets d’une question de <code>contrast-computable</code> (
					<code>BACKGROUND_NOT_OPAQUE_AT_ROOT</code>) : le texte dans un frame, dont le canevas peut
					laisser voir la page qui l’entoure, et le texte en couleurs forcées, où le canevas est la
					palette de l’utilisateur.
				</li>
				<li>
					<strong>
						Sous jsdom, le texte est mesuré dans les couleurs du schéma où la page est dessinée là
						où elles peuvent être calculées, et fait l’objet d’une question sinon.
					</strong>{" "}
					jsdom calcule les couleurs du schéma clair et n’applique aucune règle{" "}
					<code>prefers-color-scheme</code>. Sur une page dessinée en sombre (
					<code>color-scheme: dark</code> sur la racine ou dans{" "}
					<code>&lt;meta name="color-scheme"&gt;</code>), le texte que colore le schéma prend les
					couleurs du schéma sombre (celles de Chromium), et une couleur de texte donnée en{" "}
					<code>light-dark()</code>, <code>CanvasText</code>, <code>LinkText</code> ou{" "}
					<code>Canvas</code> est calculée pour le sombre. Le texte
					dont les couleurs dans ce schéma ne peuvent pas être calculées fait l’objet d’une
					question (<code>contrast-computable</code>, <code>COLOR_SCHEME_NOT_RENDERED</code> ;{" "}
					<code>link-in-text-block</code>, <code>COLOR_NOT_COMPUTABLE</code>) au lieu d’être mesuré
					dans les couleurs claires. Dans un navigateur, les couleurs sont celles qu’il dessine.
				</li>
				<li>
					<strong>
						Sur une page qui prend en charge le clair et le sombre, le schéma que l’analyse ne voit
						pas n’est mesuré que là où les couleurs du texte ne peuvent pas changer avec lui.
					</strong>{" "}
					Une analyse voit le schéma que préfère le navigateur (jsdom : clair). Le texte sur le
					canevas est aussi mesuré dans l’autre schéma, sauf là où une règle{" "}
					<code>prefers-color-scheme</code>, une valeur <code>light-dark()</code> ou une couleur
					système que définit la page atteint la couleur du texte ou un arrière-plan derrière lui,
					ou là où une feuille de style est illisible ; ni le texte dessiné par un contour, une
					ombre, <code>::first-line</code> ou un pseudo-élément, ni le texte mesuré sur une autre
					peinture. <code>data.details.colorSchemesChecked</code>{" "}
					liste les schémas mesurés ; analysez à nouveau avec le navigateur dans l’autre schéma
					pour le vérifier.
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
					rapport échoue (<code>PLACEHOLDER_BELOW_THRESHOLD</code>) quand la page a choisi ses
					couleurs, respecte le rapport quand elles sont toutes celles du navigateur (technique
					G148), et donne <code>cantTell</code> quand on ne peut pas le savoir. Sous jsdom, les
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
					<strong>
						Le fait qu’un contenu couvre un élément qui a le focus est déterminé pour le défilement
						propre de la page et ses boîtes fixes et sticky.
					</strong>{" "}
					<a href="/rules/focus-not-obscured-minimum/"><code>focus-not-obscured-minimum</code></a>{" "}
					(2.4.11) et{" "}
					<a href="/rules/focus-not-obscured-enhanced/"><code>focus-not-obscured-enhanced</code></a>{" "}
					(2.4.12) nécessitent un navigateur : sous jsdom, elles renvoient <code>notApplicable</code>{" "}
					(<code>data.reason: 'noLayout'</code>). Dans un navigateur, elles déterminent quels
					éléments de l’ordre de tabulation une boîte en <code>position: fixed</code> ou{" "}
					<code>sticky</code> qui dessine quelque chose peut masquer, compte tenu de la fenêtre
					qu’utilise l’analyse et du <code>scroll-padding</code> de la page, et le confirment par un
					test d’atteinte sur quelques-uns d’entre eux. Sont laissés de côté : un élément situé dans
					une boîte qui a son propre défilement, ou dans une boîte fixe ou sticky ; le défilement
					horizontal ; tout autre contenu posé sur un élément (une boîte en position absolue, une
					fenêtre contextuelle non modale qui n’est pas fixe) ; une boîte en{" "}
					<code>pointer-events: none</code>, que le test d’atteinte du navigateur traverse ; et ce
					qui apparaît plus tard (une bulle de discussion après un délai) ou à une autre taille de
					fenêtre. Qui a ouvert une boîte ne se voit pas non plus : les critères admettent un
					contenu que la personne a ouvert et peut fermer sans déplacer le focus, si bien qu’une
					boîte qu’un contrôle marque comme développée (<code>aria-expanded="true"</code> avec{" "}
					<code>aria-controls</code>) fait l’objet d’une question sans tendance, et toute autre avec
					un avertissement qui le précise.
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
					<strong>Analyse du contenu des textes sous forme d’image</strong> (WCAG 1.4.5/1.4.9) :
					savoir si une image contient du texte tient à ses pixels, ce qui demanderait une
					compréhension d’image équivalente à de l’OCR.{" "}
					<a href="/rules/image-of-text/"><code>image-of-text</code></a> ne pose la question que là
					où le balisage montre un indice : un <code>&lt;input type="image"&gt;</code>, et un{" "}
					<code>&lt;img&gt;</code> affichant une data URL SVG dont le balisage contient{" "}
					<code>&lt;text&gt;</code>. La photo d’une phrase, une bannière au texte incrusté ou une
					image d’arrière-plan CSS contenant du texte ne donnent aucun indice, et ne font l’objet
					d’aucune question. Le 1.4.9, qui n’admet aucune exception, n’a pas de règle.
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
				exactement ce que le <code>pass</code> d’une règle affirme, et ce qu’il n’affirme pas, et
				pourquoi un critère WCAG dont toutes les règles renvoient <code>pass</code> reste{" "}
				<code>cantTell</code>.
			</p>
		</>
	);
}
