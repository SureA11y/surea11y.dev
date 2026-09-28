import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const optionRows = [
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
				rapport à laquelle l’exécution teste la conformité. Par défaut, celle qu’impliquent vos
				tags d’origine de version, et <code>'2.2'</code> s’ils n’impliquent rien.{" "}
				<strong>
					Elle ne change actuellement qu’une chose, le critère 4.1.1 Analyse syntaxique, retiré
					en 2.2
				</strong> : avec une cible 2.2, une règle portant le tag <code>wcag22-removed</code> s’exécute
				toujours et signale toujours ses occurrences, mais ne peut pas renvoyer{" "}
				<code>fail</code> (voir{" "}
				<a href="#filtering-by-wcag-version">« Filtrer par version de WCAG »</a> plus haut).
				Toute autre valeur est ignorée et la valeur par défaut s’applique.
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
				fichiers. Voir <a href="/configuration/locales/">Langues</a>.
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
				un <code>&lt;details&gt;</code> fermé et les éléments hôtes masqués servant uniquement au
				rendu (leurs descendants sont exclus aussi). Passez-la à <code>true</code> pour inclure
				ces sous-arbres masqués/repliés dans l’évaluation (comportement historique/balisage
				statique).
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
				l’autre</strong> : aucune API DOM ne les expose.
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
				Les éléments qui correspondent à l’un de ces sélecteurs (ainsi que leurs descendants) sont
				entièrement ignorés, pour <strong>toutes</strong> les règles. Utile pour les bannières de
				cookies, les contenus tiers intégrés ou les widgets connus pour être bruyants que vous ne
				maîtrisez pas. Pour exclure un élément d’une seule règle, utilisez plutôt{" "}
				<code>rules[ruleId].excludeSelectors</code> ci-dessous.
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				Transmis tel quel au champ <code>timestamp</code> de premier niveau du résultat ; le
				moteur n’en génère pas lui-même (déterministe par conception).
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
				Ne compte qu’en mode <code>auditorAssist</code>.
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
				<strong>Aucune autre règle ne la lit.</strong> <code>'styleOnly'</code> (par défaut) :
				l’éligibilité repose uniquement sur le CSS (<code>display</code>,{" "}
				<code>visibility</code>, <code>opacity</code>, masquage par un ancêtre, etc.).{" "}
				<code>'styleAndGeometry'</code> : ajoute par-dessus de vraies vérifications de mise en
				page (<code>getClientRects()</code>/<code>getBoundingClientRect()</code>) ; le texte sans
				client rects, ou de largeur/hauteur nulle, est lui aussi exclu. Optez pour{" "}
				<code>'styleAndGeometry'</code> lorsque vous exécutez dans un vrai
				navigateur/Playwright-Puppeteer (<code>runa11yCoreInPage</code>) et que vous voulez que
				les constats de contraste reflètent la mise en page réellement rendue plutôt que le seul
				style calculé ; sous jsdom seul (<code>runDomRulesInPage</code>), il n’y a pas de vrai
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
				suivent presque toutes les 132 règles du moteur : définir{" "}
				<code>includeSelector: false</code> / <code>includeHtml: false</code> retire les
				sélecteurs et les extraits HTML de la grande majorité d’entre elles. Quelques-unes
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
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				Transmis à cette règle sous la forme <code>ctx.config</code> et, pour{" "}
				<code>excludeSelectors</code> en particulier, lu par le moteur lui-même avant même que la
				règle s’exécute. Voir{" "}
				<a href="#rule-scoped-excludeselectors">« excludeSelectors par règle »</a> ci-dessous.
				Toute autre clé est simplement transmise : <strong>aucune règle livrée ne lit
				actuellement <code>ctx.config</code></strong> pour autre chose que{" "}
				<code>excludeSelectors</code>.
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				Un objet de preuves facultatif, sérialisable en JSON, que votre application hôte peut
				fournir (le moteur en plafonne la profondeur et la taille avant que les règles ne le
				voient, via <code>ctx.inputs.probes</code>), destiné à de futures règles susceptibles
				d’accepter des signaux externes (par exemple de vraies mesures de mise en page qu’une
				analyse statique du DOM ne peut pas calculer elle-même).{" "}
				<strong>Aucune règle actuelle ne l’utilise.</strong>
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
				résultats entre exécutions.
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
				intégralité.
			</p>

			<h2>Choisir les règles à exécuter</h2>
			<p>
				Il existe <strong>deux façons indépendantes</strong> de sélectionner des règles : le
				4ᵉ argument (<code>runOnly</code>), ou{" "}
				<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>/
				<code>.includeMode</code>. Si <code>runOnly</code> contient un filtre quel qu’il soit, il
				l’emporte d’office ; sinon, le moteur se rabat sur <code>engineOptions</code>.{" "}
				<strong>Ne les combinez pas en comptant sur l’application des deux : choisissez-en
				une.</strong>
			</p>

			<h3>Avec <code>runOnly</code> (4ᵉ argument)</h3>
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
				<strong><code>runOnly</code> doit avoir exactement cette forme d’objet, et non celle d’un
				simple tableau.</strong>{" "}
				<code>runOnly: ['img-alt-present']</code> (un tableau brut) est{" "}
				<strong>ignoré sans avertissement</strong> ; le moteur exécute alors toutes les règles.
				C’est de loin l’erreur d’intégration la plus fréquente (voir{" "}
				<a href="/help/faq/">la FAQ</a>).
			</p>
			<DataTable
				rowKey="field"
				columns={[
					{ key: "field", label: "Champ", width: "22%" },
					{ key: "type", label: "Type", width: "16%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={[
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
				Les IDs de règle sont nus (sans préfixe de moteur), par exemple{" "}
				<code>'img-alt-present'</code>. Pour la rétrocompatibilité, la correspondance accepte
				aussi une ancienne forme du même id préfixée par <code>a11ycore-</code>{" "}
				(<code>'a11ycore-img-alt-present'</code>).
			</p>
			<p>
				Une <strong>ancienne forme de filtre par tag</strong> est également acceptée comme valeur
				complète de <code>runOnly</code> :{" "}
				<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code>, équivalente à{" "}
				<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>.
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
				Comme les versions sont cumulatives (2.1 = 2.0 + nouveautés ; 2.2 = 2.0 + 2.1 +
				nouveautés), vous choisissez une cible de conformité par version WCAG en combinant des
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
				vides.
			</p>

			<h2><code>engineOptions</code> : les autres options</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
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
					"  visibilityMode: 'styleOnly',     // 'styleOnly' (default) | 'styleAndGeometry' — scoped to the contrast rules only",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true",
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
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={optionRows}
			/>

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
				<code>occurrences</code> vide, puisque cette forme exacte est réservée ailleurs dans le
				schéma pour signifier « cette règle a levé une exception » (voir{" "}
				<a href="/results-reports/output-schema/">le schéma de sortie</a>).
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
					"  excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"  tags: { include: 'wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22a,wcag22aa' }",
					"}, null);",
				]}
			/>
			<p>
				<strong>Auditeur humain qui fait une passe approfondie sur le contraste dans un vrai
				navigateur</strong> : sacrifiez une partie de la protection contre les faux positifs pour
				obtenir davantage de constats, et vérifiez la mise en page réelle (pas seulement le style
				calculé) puisque c’est une vraie page qui est pilotée. Exemple avec{" "}
				<code>page.evaluate</code> de Puppeteer (qui accepte plusieurs arguments) ; si vous êtes
				sur Playwright, regroupez d’abord les quatre arguments positionnels dans un seul objet
				(voir <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>) :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' },",
					"  visibilityMode: 'styleAndGeometry'",
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
				<strong>Sortie reproductible pour les tests de snapshot</strong> : fixez un{" "}
				<code>timestamp</code> pour que deux exécutions sur le même HTML produisent un JSON
				identique à l’octet près, et demandez la ventilation des temps de débogage :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z',",
					"  perfStats: true,",
					"  profileRules: true",
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
					"      const els = ctx.helpers.queryAll('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: el.outerHTML,",
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
				statique et rien ne persiste d’un appel à l’autre. C’est voulu, pas une limitation à
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
					runner in-page.
				</li>
				<li>
					<code>meta</code> bénéficie des mêmes valeurs par défaut et de la même validation
					qu’une règle intégrée au build : omettez tout ce dont vous n’avez pas besoin ;{" "}
					<code>severity</code> vaut par défaut <code>moderate</code>, <code>confidence</code>{" "}
					<code>medium</code>, <code>type</code> <code>automatic</code>, etc.
				</li>
				<li>
					Une règle personnalisée dont l’<code>id</code> entre en collision avec celui d’une règle
					intégrée <strong>la remplace pour cette analyse</strong>, au lieu que les deux
					s’exécutent. Comme une règle personnalisée homonyme a autant de chances d’être une
					collision accidentelle qu’un remplacement délibéré, chaque collision est signalée de
					deux façons : un <code>console.warn</code> qui nomme le ou les ids, et un tableau{" "}
					<code>overriddenBuiltinIds</code> au premier niveau du résultat (vide en l’absence de
					collision). Voir <a href="/results-reports/output-schema/">le schéma de sortie</a>.
				</li>
				<li>
					Un descripteur invalide (<code>id</code> absent ou qui n’est pas une chaîne, ou{" "}
					<code>runInPage</code> qui n’est ni une fonction ni une chaîne source reconstructible)
					est ignoré sans avertissement ; le reste de l’analyse, y compris toutes les règles
					intégrées, s’exécute normalement. Ce n’est pas une lacune de validation à corriger :
					une règle personnalisée est du code arbitraire fourni par l’appelant, donc « écarter
					cette seule entrée, ne pas interrompre l’analyse » est le comportement par défaut le
					plus sûr, à l’image d’une règle <em>intégrée</em> qui lève une exception et qui est
					cantonnée à un <code>cantTell</code> pour cette règle au lieu de faire planter
					l’exécution.
				</li>
				<li>
					Les résultats apparaissent dans <code>checksResults</code> exactement comme ceux de
					n’importe quelle autre règle, y compris le remplissage automatique de{" "}
					<code>selector</code>/<code>html</code>/<code>structuralPath</code> pour les occurrences{" "}
					<code>fail</code>/<code>cantTell</code> qui ne joignent que{" "}
					<code>{"{ __node }"}</code> (voir{" "}
					<a href="/results-reports/output-schema/">le schéma de sortie</a>).
				</li>
			</ul>

			<h2><code>contextSelector</code> (2ᵉ argument du runner, pas un champ d’<code>engineOptions</code>)</h2>
			<p>
				Un sélecteur CSS (ou un tableau de sélecteurs) qui limite l’analyse à un ou plusieurs
				sous-arbres, résolu via <code>document.querySelectorAll</code> (toutes les
				correspondances, pas seulement la première), avec repli sur{" "}
				<code>document.documentElement</code>/<code>document.body</code> si rien ne correspond.
				Passez <code>null</code> pour analyser le document entier.
			</p>
			<ul>
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
					Les zones qui se chevauchent ou s’imbriquent sont automatiquement dédupliquées : un
					élément atteignable depuis plusieurs racines correspondantes n’est jamais signalé
					qu’une fois, et non une fois par zone.
				</li>
			</ul>
		</>
	);
}
