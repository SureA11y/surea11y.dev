import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-14">« Mes résultats ont changé après la mise à jour vers core 1.14 »</h2>
				<p>
					La 1.14 renvoie plus de <code>cantTell</code> et affirme moins, délibérément. Les
					changements les plus susceptibles de se voir dans un pipeline :
				</p>
				<ul>
					<li>
						<strong>Aucune règle composite WCAG ne renvoie <code>pass</code>.</strong> Un critère
						n’est satisfait que si ses règles vérifient tout ce qu’il demande, et aucun n’est encore
						listé comme vérifié entièrement : un critère dont toutes les règles renvoient{" "}
						<code>pass</code> est donc <code>cantTell</code> (
						<code>composite.rollup.cantTell.partialCheck</code>). Un critère dont les règles n’ont
						rien trouvé n’est <code>notApplicable</code> que pour 2.4.3, 2.4.4, 2.4.7, 2.4.9, 2.5.3
						et 4.1.1, et <code>cantTell</code> sinon (
						<code>composite.rollup.cantTell.partialCoverage</code>). Une règle en échec fait
						toujours échouer son critère. Un tableau de bord ou un contrôle qui compte les critères
						satisfaits n’en verra aucun ; voir <a href="#why-criterion-canttell">l’entrée
						ci-dessous</a> et{" "}
						<a href="/conformance/wcag-mapping/#when-a-criterion-passes">Correspondance de conformité WCAG</a>.
					</li>
					<li>
						<strong>Deux règles demandent davantage.</strong>{" "}
						<a href="/rules/page-title-patterns/"><code>page-title-patterns</code></a> pose la
						question pour chaque titre de page, pas seulement les titres génériques ou issus d’un
						modèle, car savoir si un titre décrit sa page revient à une personne (G88).{" "}
						<a href="/rules/duplicate-id/"><code>duplicate-id</code></a> pose la question du 4.1.1
						aussi avec les WCAG 2.0 et 2.1, que les errata de 2023 considèrent comme satisfait, sauf
						si un profil déclare <code>keepsParsing: true</code>, comme <code>en301549-v3.2.1</code>.
					</li>
					<li>
						<strong>Onze nouvelles règles</strong>, dont les premières pour le 3.3.1 (
						<a href="/rules/invalid-field-error-message/"><code>invalid-field-error-message</code></a>),
						le 4.1.3 (<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>)
						et le 1.4.5 (<a href="/rules/image-of-text/"><code>image-of-text</code></a>). La plupart
						posent une question ;{" "}
						<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>,{" "}
						<a href="/rules/focus-not-removed-by-script/"><code>focus-not-removed-by-script</code></a>{" "}
						et <a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a> peuvent échouer, tout
						comme <a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a>, qui
						vérifie désormais les contraintes entre attributs (<code>aria-valuemin</code> au-dessus
						de <code>aria-valuemax</code>, par exemple). Voir{" "}
						<a href="/rules/">le catalogue des règles</a>.
					</li>
					<li>
						<strong>Certains échecs deviennent des questions, et de nouveaux échecs
						apparaissent.</strong> <code>td-has-header</code> pose une seule question sur un grand
						tableau sans cellule d’en-tête au lieu de faire échouer chaque cellule, et{" "}
						<code>form-control-single-label</code> pose la question pour un champ à deux libellés.
						Le contraste est mesuré sur une plus grande part de ce que la page dessine (le texte sur
						le canevas de la page dans chaque schéma de couleurs, <code>::first-line</code>,{" "}
						<code>font-size-adjust</code>, un placeholder dont la page a choisi les couleurs) : de
						nouveaux échecs de contraste peuvent donc apparaître.
					</li>
					<li>
						<strong>Certains constats ont un nouveau code de raison.</strong> Dix-sept règles qui
						n’en donnaient pas en donnent un, et quelques codes sont scindés selon la cause. Une
						baseline écrite par la 1.13 y correspond toujours jusqu’à la 1.15 ; réécrivez-la avec{" "}
						<code>migrateBaselineEntries</code> (voir{" "}
						<a href="#baseline-after-upgrade">l’entrée ci-dessous</a>). Une alerte Code Scanning
						pour un tel constat se ferme et revient comme nouvelle.
					</li>
					<li>
						<strong>Chaque <code>cantTell</code> dit comment y répondre.</strong> Le constat d’une
						règle de core porte les étapes de <code>howToCheck</code>, et certains portent un{" "}
						<code>lean</code>, le sens vers lequel pointent les indices de la page. Le résultat reste{" "}
						<code>cantTell</code>, et rien ne bloque sur un <code>lean</code> sans que vous le
						demandiez (<code>leanFailAs</code>). Le{" "}
						<a href="/results-reports/html-report/">rapport HTML</a> regroupe ces constats en échecs
						probables, réussites probables et constats à examiner par une personne. Voir le{" "}
						<a href="/results-reports/output-schema/#leans">schéma de sortie</a>.
					</li>
					<li>
						<strong>La 1.14.1 échoue moins sur l’espacement du texte.</strong>{" "}
						<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>{" "}
						ne fait plus échouer un texte que la page ne perd pas. Une page dont le défilement est
						bloqué par <code>{"body { position: fixed }"}</code>, comme beaucoup derrière une
						bannière de consentement, et une boîte fixe plus haute que le viewport donnent lieu à
						une question <code>VIEWPORT_SCROLL_LOCKED</code> ; un texte coupé par une boîte que
						le script de la page ajuste à sa taille, comme le libellé flottant d’un champ Angular
						Material, à une question <code>TEXT_CLIPPED_SCRIPT_SIZED</code>. Une entrée de
						baseline ou une alerte Code Scanning pour l’un d’eux se ferme comme pour un bug
						corrigé. Les étapes de 36 questions demandent aussi si un autre moyen sur la page fait
						la même chose avant de mener à un échec.
					</li>
					<li>
						<strong>La 1.14.2 lit la page telle que le navigateur la dessine.</strong> Le contenu
						que le navigateur saute hors de l’écran avec <code>content-visibility: auto</code> est
						mesuré tel qu’il est mis en page, si bien que les faux chevauchements, les questions sur
						l’arrière-plan et les constats de focus inatteignable et de taille de cible qu’il donnait
						sur des pages de cartes disparaissent, et 
						<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a> 
						fait désormais échouer un texte qu’un tel élément coupe (<code>details.clippedBy</code>). 
						<a href="/rules/label-in-name/"><code>label-in-name</code></a> 
						ne fait plus échouer un libellé découpé seulement entre des boîtes qui se touchent, et
						les règles qui lisent les feuilles de style ignorent le CSS réservé à l’impression ou
						non pris en charge et les règles qui n’atteignent pas l’élément. Une entrée de baseline
						ou une alerte Code Scanning pour un constat qui n’est plus signalé se ferme comme pour un
						bug corrigé.
					</li>
				</ul>
				<p>
					La liste complète se trouve dans le{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>{" "}
					de core.
				</p>
			</article>

			<article>
				<h2 id="runonly-threw">
					« <code>runOnly</code> a levé une erreur : <span lang="en">no rule or tag named …</span>,
					ou <span lang="en">either rule ids or tags</span> »
				</h2>
				<p>
					Depuis la version 1.10.0, un <code>runOnly</code> passé sous forme de simple tableau ou
					de chaîne est lu comme des identifiants de règles ou comme des tags (voir{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>).
					Il lève une erreur dans deux cas :
				</p>
				<ul>
					<li>
						<strong>Une valeur qui ne désigne aucune règle ni aucun tag</strong>, en général une
						faute de frappe : <code>runOnly: ['img-alt-presnt']</code>. Vérifiez l’identifiant
						avec <code>getChecksCatalog()</code>. La casse n’y est pour rien : les identifiants de
						règles et les tags sont reconnus quelle que soit leur casse, donc{" "}
						<code>IMG-ALT-PRESENT</code> sélectionne <code>img-alt-present</code>.
					</li>
					<li>
						<strong>Des identifiants de règles et des tags dans un même tableau</strong> :{" "}
						<code>runOnly: ['img-alt-present', 'wcag2a']</code>. Utilisez la forme objet pour les
						combiner :
					</li>
				</ul>
				<CodeBlock
					lang="js"
					lines={[
						"runOnly: {",
						"  includeRuleIds: ['img-alt-present'],",
						"  tags: ['wcag2a'],",
						"  includeMode: 'or',",
						"}",
					]}
				/>
				<p>Avant la version 1.10.0, un simple tableau était ignoré et toutes les règles s’exécutaient.</p>
				<p>
					La forme objet, <code>{"{ includeRuleIds }"}</code>, <code>{"{ tags }"}</code> ou{" "}
					<code>{"{ type: 'tag', values }"}</code>, ainsi que{" "}
					<code>engineOptions.rules.include</code> / <code>.tags.include</code>, lèvent aussi une
					erreur, avec <code>code: 'INVALID_RUN_ONLY'</code>, quand aucune valeur de la liste ne
					désigne une règle ou un tag (<code>runOnly.tags: no tag named "wcag2.2aa".</code>).
					Auparavant, elles n’exécutaient aucune règle, ce qui se lit comme une analyse sans
					constat. Une seule valeur inconnue à côté de valeurs connues, ou dans une liste
					d’exclusion, ne produit qu’un <code>console.warn</code>.
				</p>
			</article>

			<article>
				<h2 id="tags-and-rules-run-nothing">
					« J’ai sélectionné des tags et des identifiants de règles, et l’analyse n’a exécuté aucune
					règle mais paraît sans erreur »
				</h2>
				<p>
					Avec le <code>includeMode: 'and'</code> par défaut, une sélection qui contient à la fois
					des tags et des identifiants de règles n’exécute que les règles qui correspondent aux
					deux. <code>.withTags('wcag2a').withRules('region')</code> n’exécute rien, puisque{" "}
					<code>region</code> est une bonne pratique sans tag <code>wcag2a</code>, et une analyse
					sans aucune règle n’a aucun échec. Le moteur affiche un avertissement dans la console de
					la page, qu’une exécution de tests ne montre pas, et ne lève{" "}
					<code>INVALID_RUN_ONLY</code> qu’avec <code>strictOptions</code>. Pour exécuter l’un ou
					l’autre, demandez-le : <code>.includeMode('or')</code> dans les bindings,{" "}
					<code>includeMode: 'or'</code> dans <code>runOnly</code> (ci-dessus), ou{" "}
					<code>--include-mode or</code> dans la <a href="/getting-started/cli/">CLI</a>. À partir
					de sa version 1.3.0, la CLI se termine avec le code <code>2</code> et cette suggestion
					quand les deux n’ont aucune règle en commun.
				</p>
				<p>
					Pour repérer avant l’exécution une sélection qui ne retient rien, vérifiez{" "}
					<code>plannedChecks()</code> sur le builder : les règles que l’analyse exécutera,
					calculées sans page (un chainable dans Cypress) :
				</p>
				<CodeBlock
					lang="js"
					lines={[
						"const builder = new A11yCoreBuilder({ page })",
						"  .withTags('wcag2a')",
						"  .withRules('region')",
						"  .includeMode('or'); // the wcag2a rules, plus region",
						"",
						"if (builder.plannedChecks().length === 0) {",
						"  throw new Error('This selection runs no rule.');",
						"}",
					]}
				/>
				<p>
					Voir <a href="/configuration/engine-options/#via-runonly-4th-argument">Options du moteur</a>{" "}
					pour la façon dont les parties d’une sélection se combinent.
				</p>
			</article>

			<article>
				<h2 id="untested-wcag-tag">
					« <code>runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a")</code> »
				</h2>
				<p>
					Les neuf tags de version et de niveau WCAG, de <code>wcag2a</code> à{" "}
					<code>wcag22aaa</code>, sont toujours reconnus, mais trois ne portent aucune règle :{" "}
					<code>wcag21aaa</code>, <code>wcag22a</code> et <code>wcag22aaa</code>, dont les
					critères n’ont aucune vérification automatisée. En nommer un à côté d’autres tags
					journalise cette ligne avec <code>console.info</code> : le reste de la liste s’exécute,
					et ces critères demandent une vérification manuelle. Passez{" "}
					<code>engineOptions.logUntestedWcag: false</code> pour l’omettre, ou sélectionnez plutôt
					par cible, ce qui ne nomme aucun tag :{" "}
					<code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code> (voir{" "}
					<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">
						Sélectionner par cible WCAG
					</a>
					). Une liste composée uniquement de tels tags n’exécuterait rien : elle lève donc{" "}
					<code>INVALID_RUN_ONLY</code> avec la même explication.
				</p>
			</article>

			<article>
				<h2 id="invalid-wcag-target">
					« <code>runOnly.wcag.version must be …</code> » ou{" "}
					« <code>runOnly.bestPractices must be true or false …</code> »
				</h2>
				<p>
					<code>runOnly.wcag</code> accepte <code>{"{ version, level }"}</code>, avec pour{" "}
					<code>version</code> l’une des valeurs <code>'2.0'</code>, <code>'2.1'</code>,{" "}
					<code>'2.2'</code> (une chaîne : <code>2.2</code> sous forme de nombre est refusé) et
					pour <code>level</code> l’une des valeurs <code>'A'</code>, <code>'AA'</code>,{" "}
					<code>'AAA'</code> ; <code>runOnly.bestPractices</code> accepte <code>true</code> ou{" "}
					<code>false</code>. Toute autre valeur lève <code>INVALID_RUN_ONLY</code> en nommant le
					champ et la valeur, plutôt que d’exécuter une sélection que vous n’aviez pas voulue.
				</p>
			</article>

			<article>
				<h2 id="invalid-engine-options">
					« <code>engineOptions: unknown option "lcoale" (did you mean "locale"?)</code> », ou une
					analyse a levé <code>INVALID_ENGINE_OPTIONS</code>
				</h2>
				<p>
					Une clé d’option à une ou deux lettres près d’une clé connue, quelle que soit la casse,
					déclenche un avertissement et est ignorée : l’analyse s’exécute comme si elle n’était
					pas là, corrigez donc l’orthographe. Les autres clés inconnues restent silencieuses,
					puisqu’une règle personnalisée peut lire ses propres réglages dans{" "}
					<code>ctx.engineOptions</code>. Avec <code>engineOptions.strictOptions: true</code>,
					l’analyse lève plutôt une erreur, avec <code>code: 'INVALID_ENGINE_OPTIONS'</code>, pour
					toute clé que le moteur ne lit pas (clés imbriquées comprises) et pour une valeur de
					mauvais type ou hors de son ensemble, en nommant chacune avec la clé connue la plus
					proche ; la propriété <code>problems</code> de l’erreur les liste. Voir{" "}
					<a href="/configuration/engine-options/#catching-mistakes-in-the-options-strictoptions">
						Repérer les erreurs dans les options
					</a>
					.
				</p>
			</article>

			<article>
				<h2 id="custom-rule-rollup">
					« Ma règle personnalisée échoue, mais pas l’agrégat WCAG »
				</h2>
				<p>
					Une règle personnalisée compte dans l’agrégat WCAG (<code>rulesResults</code>) de chaque
					critère auquel elle est associée : donnez-lui <code>meta.wcagSc: ['1.1.1']</code>, ou
					une entrée WCAG dans <code>meta.normativeMappings</code>. Sans l’un ni l’autre, elle
					n’entre dans aucun agrégat. Une règle personnalisée qui ne s’est pas exécutée (listée
					dans <code>skippedCustomRules</code>) ne compte pas non plus. Une surcharge d’une règle
					intégrée ne compte que là où sa propre correspondance l’indique : si elle n’en déclare
					aucune, elle quitte les agrégats dans lesquels comptait la règle intégrée, et un
					avertissement (
					<code>customRules: "…" overrides a built-in rule but maps to none of the criteria of …</code>
					) les nomme ; donnez-lui les critères de la règle intégrée pour qu’elle y reste.
				</p>
			</article>

			<article>
				<h2 id="contextselector-matched-nothing">
					« Mon analyse ciblée renvoie <code>notApplicable</code> partout », ou « <code>contextSelector</code>{" "}
					a levé une erreur :{" "}
					<span lang="en">… is not a valid CSS selector</span> »
				</h2>
				<p>
					Depuis la version 1.10.0, un <code>contextSelector</code> qui ne correspond à aucun
					élément n’analyse rien, et un sélecteur que le navigateur ne sait pas interpréter lève
					une erreur (voir <a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>).
				</p>
				<ul>
					<li>
						<strong>Tout est <code>notApplicable</code></strong> : regardez{" "}
						<code>result.contextMatch</code>. <code>elementCount: 0</code> signifie que le
						sélecteur n’a rien trouvé, donc que rien n’a été analysé : ce n’est pas un résultat
						sans erreur. <code>unmatchedSelectors</code> nomme le sélecteur. Vérifiez qu’il
						ne contient pas de faute de frappe, ou que l’élément est déjà sur la page au moment de
						l’analyse (un contenu rendu par un script après le chargement, par exemple).
					</li>
					<li>
						<strong>
							L’analyse a levé une erreur avec <code>code: 'INVALID_CONTEXT_SELECTOR'</code>
						</strong> : le sélecteur cité dans le message, et dans la propriété <code>selector</code> de
						l’erreur, n’est pas du CSS valide, par exemple <code>'#main['</code> ou un combinateur{" "}
						<code>&gt;&gt;&gt;</code>. Ou bien la portée n’est pas du tout un sélecteur, par exemple
						un élément ou un objet <code>{"{ include, exclude }"}</code>, et le message indique ce
						qui a été passé : passez un sélecteur qui correspond à l’élément, et les exclusions dans{" "}
						<code>engineOptions.excludeSelectors</code>.
					</li>
				</ul>
				<p>
					Dans chacun de ces cas, toute la page était analysée auparavant : jusqu’à la version
					1.10.0 pour un sélecteur qui ne correspondait à rien ou ne pouvait pas être interprété, et
					dans la version 1.10.0 encore pour une portée qui n’est pas un sélecteur.
				</p>
			</article>

			<article>
				<h2 id="page-builtins-broken">« Une analyse a levé <code>PAGE_BUILTINS_BROKEN</code> »</h2>
				<p>
					Les scripts de la page ont modifié un objet natif JavaScript sur lequel le moteur
					s’appuie (<code>Array.prototype.filter</code>, <code>Map</code>,{" "}
					<code>JSON.stringify</code> et d’autres), si bien qu’une analyse de cette page pourrait
					donner un résultat qui paraît correct et qui est faux. Le message de l’erreur et sa liste{" "}
					<code>broken</code> nomment chacun d’eux. Analysez la page avant que ses scripts ne les
					modifient (injectez le bundle plus tôt, ou analysez un build sans le script en cause).
					Voir <a href="/help/known-limitations/">Limites connues</a>.
				</p>
			</article>

			<article>
				<h2 id="scan-never-returns">« Mon analyse ne se termine jamais »</h2>
				<p>
					Quelque chose dans la page bloque l’analyse : un getter ou un script qui ne rend jamais
					la main, ou une boucle dans un pack ou une règle personnalisée. Rien à l’intérieur de la
					page ne peut arrêter une analyse une fois lancée : placez donc la limite de temps là où
					vous la lancez, et abandonnez l’onglet quand elle est dépassée.{" "}
					<a href="/getting-started/standalone/#a-time-limit-on-a-scan">Autonome</a> montre
					comment faire avec Playwright et Puppeteer ; dans jsdom, exécutez l’analyse dans un
					worker thread ou un processus enfant.
				</p>
			</article>

			<article>
				<h2 id="scan-time">« Une analyse prend plus de temps après une mise à jour »</h2>
				<p>
					L’essentiel du temps d’une analyse est consacré au calcul des styles et de la mise en page
					dans le navigateur : il dépend donc de la page, de la machine et du navigateur autant que du
					moteur. Une version peut tout de même le modifier : une règle qui vérifie désormais une plus
					grande partie de la page coûte davantage, et le <a href={`${core}/CHANGELOG.md`}><code>CHANGELOG.md</code></a> de core
					indique quand une version change le coût d’une règle. <a href={`${core}/docs/PERFORMANCE.md`}><code>PERFORMANCE.md</code></a>,
					sur GitHub, consigne la durée d’une analyse version après version, en proportion d’une
					version antérieure sur les mêmes pages, ainsi que la façon dont elle est mesurée. Une règle
					plus lente qui trouve davantage paie peut-être ce qu’elle trouve désormais ; une règle plus
					lente avec les mêmes résultats est une régression qui mérite d’être <a href="https://github.com/SureA11y/core/issues">signalée</a>.
				</p>
			</article>

			<article>
				<h2 id="pack-did-not-run">« Un pack ne s’est pas exécuté », ou <code>skippedPacks</code> n’est pas vide</h2>
				<p>
					Un pack dont la plage <code>core</code> exclut la version de core installée, qui n’est
					pas valide, ou qui n’est pas compatible avec core (un identifiant de règle hors de son
					espace de noms, une clé de dictionnaire que core possède déjà) est ignoré : l’analyse
					s’exécute sans lui, affiche un avertissement et le liste dans{" "}
					<code>result.skippedPacks</code> avec la raison ; avec <code>strictOptions</code>, elle
					lève une erreur. Dans une page, un pack nommé dans <code>engineOptions.packs</code>{" "}
					qu’aucun appel à <code>packScript</code> n’a enregistré, ou qui a été enregistré avec une
					autre version de core, est listé de la même façon. Les bindings le signalent comme une
					lacune <code>'pack-skipped'</code>, test-matchers fait échouer l’assertion, et la CLI
					se termine avec le code <code>2</code>. Installez le pack à côté de <code>@surea11y/core</code> et du
					paquet qui l’exécute, pour que les trois partagent une seule copie de core. Voir{" "}
					<a href="/configuration/packs/#when-a-pack-doesnt-run">Packs</a>.
				</p>
			</article>

			<article>
				<h2>« Ma règle personnalisée renvoie toujours <code>cantTell</code> sans raison claire »</h2>
				<p>
					Regardez d’abord le champ <code>error</code> du résultat : s’il indique{" "}
					<code>"&lt;something&gt; is not defined"</code>, votre <code>runInPage</code> fait
					référence à une variable extérieure au corps de la fonction (une <code>const</code> au
					niveau du module, un helper importé, tout ce qui n’est pas atteint via{" "}
					<code>ctx.*</code>). C’est un piège réel et courant : <code>runInPage</code> est
					sérialisé en texte source puis réévalué plus tard dans le contexte de la page, donc{" "}
					<strong>le build ne le détecte jamais, seule l’exécution de la règle le révèle</strong>,
					et l’échec ressemble à un résultat normal (quoique peu informatif), pas à un plantage.
					Voir <a href={`${core}/docs/RULE_AUTHORING.md`}><code>RULE_AUTHORING.md</code></a>{" "}
					§1.1 pour l’explication complète et la correction (déplacer la valeur dans{" "}
					<code>runInPage</code>, ou la faire passer par <code>ctx.rule</code>/<code>ctx.helpers</code>).
				</p>
			</article>

			<article>
				<h2>
					« Une règle dépendant de la géométrie (par exemple <code>target-size-minimum</code>)
					indique toujours <code>notApplicable</code> »
				</h2>
				<p>
					jsdom seul (sans vrai navigateur) n’implémente pas la mise en page CSS :{" "}
					<code>getBoundingClientRect()</code> renvoie toujours une géométrie nulle.{" "}
					<strong>Les règles qui ont besoin d’une vraie mise en page indiquent{" "}
					<code>notApplicable</code> sous jsdom plutôt que de deviner.</strong> Passez plutôt par
					un vrai navigateur (Puppeteer/Playwright, voir{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, <span lang="en">Pattern 2</span>)
					pour obtenir de vrais résultats de ces règles. Voir{" "}
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>.
				</p>
			</article>

			<article>
				<h2 id="web-component-canttell">
					« Un composant web revient en <code>cantTell</code> (<code>name_internals</code>) »
				</h2>
				<p>
					Un élément personnalisé qui se nomme, définit ses états ou se donne un rôle par un{" "}
					<code>ElementInternals</code> conservé dans un champ privé (<code>#internals</code>) est
					exposé par le navigateur, mais aucun script de la page ne peut le relire. Depuis la 1.12,
					le moteur lit les internals conservés dans une propriété (<code>_internals</code>,{" "}
					<code>internals</code>, …), et pose la question pour tout autre élément personnalisé
					défini sans nom lisible ni état requis (<code>name_internals</code>,{" "}
					<code>state_internals</code>) au lieu de le faire échouer.
				</p>
				<p>
					Pour que l’analyse puisse juger ces éléments, installez le hook des internals avant
					l’exécution des scripts de la page : <code>installInternalsHook()</code> dans chaque
					binding (sur la page ou le contexte dans{" "}
					<a href="/getting-started/playwright/">Playwright</a>, la page dans{" "}
					<a href="/getting-started/puppeteer/">Puppeteer</a>, le driver dans{" "}
					<a href="/getting-started/selenium/">Selenium</a>, le navigateur dans{" "}
					<a href="/getting-started/webdriverio/">WebdriverIO</a>, le fichier de support ou{" "}
					<code>onBeforeLoad</code> dans <a href="/getting-started/cypress/">Cypress</a>) et dans
					le fichier de configuration de{" "}
					<a href="/getting-started/test-matchers/">test-matchers</a>, ou{" "}
					<code>internalsHookScript()</code> de core pour une page à vous. La propriété{" "}
					<code>engine.environment.internalsHook</code> du résultat indique s’il s’est exécuté (
					<code>'early'</code> ou <code>'late'</code>). Le hook permet à n’importe quel script de
					la page de lire les internals de chaque composant : il est donc destiné aux exécutions de
					test et d’audit. Voir <a href="/help/known-limitations/">Limites connues</a>.
				</p>
			</article>

			<article>
				<h2>
					« Je ne vois que des occurrences <code>fail</code>/<code>cantTell</code> : où est la
					liste des éléments qui ont réussi ? »
				</h2>
				<p>
					<strong>Par conception, ce moteur n’énumère jamais les éléments qu’une règle a{" "}
					<em>validés</em>, seulement ceux qu’elle a signalés.</strong> Un{" "}
					<code>outcome: 'pass'</code> global pour une règle signifie « des cibles applicables
					existaient et aucune n’a été signalée », et <code>occurrences</code> vaut{" "}
					<code>[]</code>. Les règles de contraste font exception : leur <code>pass</code> porte
					une occurrence au <code>selector</code> vide qui décrit l’analyse (la quantité de texte
					éligible et calculable), et non un élément. Si vous devez savoir quels éléments précis ont été
					vérifiés et jugés corrects, cette information n’est pas exposée actuellement : voir{" "}
					<a href="/results-reports/output-schema/"><code>OUTPUT_SCHEMA.md</code></a>.
				</p>
			</article>

			<article>
				<h2>
					« Une règle qui devait se déclencher a renvoyé <code>notApplicable</code> / n’a rien
					trouvé sur une page dont je sais qu’elle a le problème »
				</h2>
				<p>Deux causes courantes, de la plus probable à la moins probable :</p>
				<ol>
					<li>
						<strong>L’élément est exclu de l’arbre d’accessibilité</strong> :{" "}
						<code>aria-hidden="true"</code>, <code>display: none</code>,{" "}
						<code>visibility: hidden</code>, <code>hidden</code>, ou un ancêtre{" "}
						<code>inert</code>. La plupart des règles ignorent le contenu déjà invisible pour les
						technologies d’assistance, car vérifier un élément masqué n’aurait pas de sens et
						pourrait produire un <code>fail</code> trompeur sur un contenu qu’aucun utilisateur ne
						rencontre. Certaines règles se soustraient explicitement à ce filtrage quand il
						n’aurait pas de sens (par exemple <code>no-autoplay-audio</code> : un audio masqué
						produit quand même du son) ; consultez le commentaire d’en-tête du fichier de la règle
						concernée (<code>@applicability</code>) dans <code>src/checks/</code>.
					</li>
					<li>
						<strong><code>excludeSelectors</code></strong> : si vous l’avez configuré
						(directement ou hérité d’une configuration partagée), vérifiez que l’élément en
						question n’y correspond pas. Rappelez-vous que cette option peut aussi être limitée à
						une seule règle via <code>engineOptions.rules[ruleId].excludeSelectors</code> (voir{" "}
						<a href="/configuration/engine-options/#rule-scoped-excludeselectors"><code>ENGINE_OPTIONS.md</code></a>){"\u00a0"}: si une règle censée se déclencher renvoie toujours{" "}
						<code>notApplicable</code>/<code>pass</code> pour un seul élément, vérifiez si cette
						règle a sa propre liste d’exclusion configurée, et pas seulement la liste globale.
					</li>
				</ol>
			</article>

			<article>
				<h2 id="why-criterion-canttell">
					« Toutes les vérifications renvoient <code>pass</code> : pourquoi chaque critère WCAG
					est-il <code>cantTell</code> ? »
				</h2>
				<p>
					Depuis la 1.14, une règle composite WCAG dans <code>rulesResults</code> ne renvoie{" "}
					<code>pass</code> que pour un critère dont les règles vérifient tout ce qu’il demande, et
					aucun critère n’est encore listé ainsi (<code>COMPLETE_CHECK</code> dans{" "}
					<code>src/coverage/complete-applicability.js</code>). Quand toutes les règles d’un critère
					renvoient <code>pass</code>, sa règle composite est <code>cantTell</code>, avec le{" "}
					<code>reasonCode</code> <code>composite.rollup.cantTell.partialCheck</code> : les parties
					que vérifient les règles sont respectées, et une personne vérifie le reste.{" "}
					<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a> constate
					que <code>{'<html lang="fr">'}</code> désigne une langue, pas que la page est en français.
					De même, un critère dont les règles n’ont rien trouvé n’est <code>notApplicable</code> que
					si elles trouvent tous les cas auxquels il s’applique, et sinon <code>cantTell</code>, avec{" "}
					<code>composite.rollup.cantTell.partialCoverage</code>. Une règle en échec fait toujours
					échouer son critère. Présentez-les comme « vérifications réussies, revue nécessaire » et
					« rien trouvé à vérifier », jamais comme réussis ; voir{" "}
					<a href="/conformance/wcag-mapping/#when-a-criterion-passes">Correspondance de conformité WCAG</a>.
				</p>
			</article>

			<article>
				<h2>« Une analyse sans échec signifie-t-elle que la page est conforme WCAG ? »</h2>
				<p>
					Non : voir <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>
						Le <code>pass</code> d’une règle signifie que les vérifications exécutées sont revenues sans erreur
						sur la partie de la page qu’elles ont analysée.
					</strong>{" "}
					Une analyse limitée à une partie de la page, à certaines règles, ou exécutée sous jsdom
					vérifie moins qu’elle ne le pourrait. Une part non négligeable de WCAG exige un jugement humain
					(texte alternatif pertinent, messages d’erreur compréhensibles) ou des tests dynamiques
					que l’architecture de ce moteur ne permet pas du tout (pièges au clavier, redistribution
					du contenu en cas de zoom) : voir{" "}
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a> pour la liste
					explicite, volontairement non exhaustive.
				</p>
			</article>

			<article>
				<h2>« Dois-je traiter <code>cantTell</code> comme un échec ? »</h2>
				<p>
					<strong>Traitez-le comme « une personne doit regarder » : par conception, ce n’est ni une
					réussite ni un échec.</strong> Un choix courant consiste à consigner les résultats{" "}
					<code>cantTell</code> sans faire échouer la CI, car faire échouer un build sur quelque
					chose que le moteur n’a explicitement pas pu déterminer habitue les gens à ignorer le
					contrôle. Une équipe qui veut que chacun soit examiné avant une fusion peut au contraire
					bloquer sur eux ; dans les deux cas, gardez-les à part des échecs. Entre les deux, un build
					peut ne bloquer que sur les constats qui penchent vers l’échec, là où les indices de la page
					pointent vers un échec : <code>leanFailAs</code> dans les rapports{" "}
					<a href="/results-reports/junit-report/#options">JUnit</a> et{" "}
					<a href="/results-reports/sarif-report/#options">SARIF</a>, ou{" "}
					<code>leaningFailures(result)</code> (voir le{" "}
					<a href="/results-reports/output-schema/#leans">schéma de sortie</a>). Chaque constat{" "}
					<code>cantTell</code> d’une règle de core dit comment y répondre dans{" "}
					<code>howToCheck</code>. Voir <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> si vous
					voulez modifier ce comportement (par exemple via un contrat de politique personnalisé),
					et{" "}
					<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
						<code>INTEGRATION.md</code>
					</a>{" "}
					pour un exemple concret de contrôle en CI.
				</p>
			</article>

			<article>
				<h2>« Que se passe-t-il si une langue n’est que partiellement traduite ? »</h2>
				<p>
					<strong>Les clés manquantes se replient sur l’anglais chaîne par chaîne (jamais de
					résultat vide ou cassé) : une langue partiellement traduite reste donc utilisable au
					lieu d’échouer.</strong> Voir <a href="/configuration/locales/"><code>I18N.md</code></a> pour
					le mécanisme et la couverture actuelle. La parité des clés est imposée par le build de
					core lui-même, pas espérée : toute clé anglaise nouvelle ou renommée est reportée dans
					chaque autre fichier de langue, avec le texte anglais jusqu’à ce que quelqu’un la
					traduise, si bien qu’une langue peut être en retard sur la formulation, jamais sur les
					clés.
				</p>
			</article>

			<article>
				<h2>
					« <code>runDomRulesInPage</code> ou <code>runa11yCoreInPage</code> : lequel me
					faut-il ? »
				</h2>
				<p>
					<code>runDomRulesInPage</code> si vous l’appelez directement dans le même processus
					Node (jsdom).{" "}
					<code>runa11yCoreInPage</code> si vous transmettez <em>la fonction elle-même</em> à un
					autre realm JS, presque toujours <code>page.evaluate</code> dans Puppeteer/Playwright,
					qui sérialise la fonction en texte source et la réexécute dans l’onglet du navigateur
					(qui n’a pas accès à la portée de vos modules Node). Voir{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> pour les deux
					patterns détaillés.
				</p>
			</article>

			<article>
				<h2 id="baseline-after-upgrade">
					« Après une mise à jour, ma baseline signale des constats connus comme nouveaux et leurs
					entrées comme obsolètes »
				</h2>
				<p>
					L’identité d’un constat comprend son code de raison, et la 1.14 a donné des codes à
					dix-sept règles qui n’en avaient pas et a scindé quelques codes selon la cause. Une
					baseline écrite par la 1.13 continue de correspondre à ces constats avec la 1.14.x, grâce
					à <code>src/baseline-moves.json</code> ; un constat dont le résultat a changé avec la mise
					à jour est nouveau ou disparaît malgré tout, et le journal des modifications explique
					pourquoi. Réécrivez les codes du fichier avec <code>migrateBaselineEntries</code> de{" "}
					<code>@surea11y/core/baseline</code>, ou régénérez-le et examinez le diff, avant la 1.15.
					Voir <a href="/conformance/baseline/#upgrading">Baseline / allowlist</a>.
				</p>
			</article>

			<article>
				<h2 id="stylesheets-not-readable">
					« <code>css-orientation-lock</code> pose une question avec{" "}
					<code>STYLESHEETS_NOT_READABLE</code> »
				</h2>
				<p>
					Le script d’une page ne peut pas lire une feuille de style servie par une autre origine
					(un CDN, un service de polices) : les règles qui lisent le CSS ne peuvent donc pas savoir
					ce qu’elle contient. Donnez son texte à l’analyse dans{" "}
					<code>engineOptions.styleSheetTexts</code> : <code>preloadStyleSheets()</code>, ou{" "}
					<code>runa11yCoreInPageAsync</code> dans le bundle navigateur, récupère celles que le
					serveur partage, et un outil qui pilote le navigateur peut récupérer les autres depuis
					l’extérieur de la page. Voir « Style sheets from another origin » dans{" "}
					<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
						<code>INTEGRATION.md</code>
					</a>
					, le guide d’intégration sur GitHub.
				</p>
			</article>
		</>
	);
}
