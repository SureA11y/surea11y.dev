import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
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
						avec <code>getChecksCatalog()</code>.
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
						sélecteur n’a rien trouvé, et <code>unmatchedSelectors</code> le nomme. Vérifiez qu’il
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
					se termine avec le code <code>2</code>. Installez le pack à côté du paquet qui l’exécute,
					pour que npm résolve un seul <code>@surea11y/core</code> pour les deux. Voir{" "}
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
				<h2>
					« Je ne vois que des occurrences <code>fail</code>/<code>cantTell</code> : où est la
					liste des éléments qui ont réussi ? »
				</h2>
				<p>
					<strong>Par conception, ce moteur n’énumère jamais les éléments qu’une règle a{" "}
					<em>validés</em>, seulement ceux qu’elle a signalés.</strong> Un{" "}
					<code>outcome: 'pass'</code> global pour une règle signifie « des cibles applicables
					existaient et aucune n’a été signalée », mais <code>occurrences</code> vaut{" "}
					<code>[]</code> dans les deux cas. Si vous devez savoir quels éléments précis ont été
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
				<h2>« Une analyse sans erreur (<code>pass</code> partout) signifie-t-elle que la page est conforme WCAG ? »</h2>
				<p>
					Non : voir <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>Un <code>pass</code> signifie que chaque vérification <em>automatisable</em> est
					revenue sans erreur.</strong> Une part non négligeable de WCAG exige un jugement humain
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
					réussite ni un échec.</strong> La plupart des équipes consignent les résultats{" "}
					<code>cantTell</code> sans faire échouer la CI, car faire échouer un build sur quelque
					chose que le moteur n’a explicitement pas pu déterminer habitue les gens à ignorer le
					contrôle. Voir <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> si vous
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
					le mécanisme et la couverture actuelle. La parité des clés est imposée, pas espérée :{" "}
					<code>npm run i18n:sync</code> reporte toute clé nouvelle ou renommée de{" "}
					<code>en.json</code> dans chaque autre fichier de langue, et le build échoue si l’un
					d’eux est désynchronisé. Une clé ajoutée ainsi contient le texte anglais jusqu’à ce que
					quelqu’un la traduise : une langue peut donc être en retard sur la formulation, jamais
					sur les clés.
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
		</>
	);
}
