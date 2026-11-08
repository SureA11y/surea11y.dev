import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-16">« Mes résultats ont changé après la mise à jour vers core 1.16 »</h2>
				<p>
					La 1.16 rapproche jsdom du navigateur et formule ses messages pour n’importe quelle norme.
					Les changements les plus susceptibles de se voir dans un pipeline :
				</p>
				<ul>
					<li>
						<strong>Sous jsdom, seul un dialogue ouvert avec <code>showModal()</code> est
						modal</strong>, comme dans un navigateur. La page derrière un{" "}
						<code>&lt;dialog open aria-modal="true"&gt;</code> est désormais jugée : un test jsdom
						qui simule ainsi un dialogue modal voit des constats derrière lui ;{" "}
						<code>engineOptions.assumeModal: true</code> conserve l’ancien comportement (voir{" "}
						<a href="/help/known-limitations/">Limites connues</a>). Rien derrière un dialogue
						modal ne reçoit le focus et, de plusieurs dialogues ouverts avec{" "}
						<code>showModal()</code>, seul celui du dessus est jugé.
					</li>
					<li>
						<strong>jsdom masque ce que masque un navigateur.</strong> Les règles CSS à l’intérieur
						de <code>@layer</code>, <code>@supports</code> et <code>@container</code> masquent des
						éléments, si bien que <code>hidden</code> et <code>sr-only</code> de Tailwind v4
						fonctionnent ; <code>clip: rect(0 0 0 0)</code> compte comme un découpage ; un élément{" "}
						<code>&lt;area&gt;</code> d’une image réactive est sur la page. Les constats portant sur
						un contenu masqué depuis le début disparaissent.
					</li>
					<li>
						<strong>Les messages et les étapes décrivent la vérification</strong> au lieu de nommer
						le critère WCAG, dans toutes les langues, pour qu’un rapport selon une autre norme se
						lise correctement. Les correspondances et <code>failWhen</code> ne changent pas ; un
						test qui compare le texte des messages doit être mis à jour.
					</li>
					<li>
						<strong>Les pages profondes sont jugées.</strong> Un élément situé à 200 niveaux ou plus
						de profondeur est jugé avec tout ce qui se trouve au-dessus de lui, jusqu’à 10 000
						niveaux, là où un échec aussi profond devenait une question signalée dans{" "}
						<code>error</code> ; des échecs peuvent donc y apparaître. Au-delà de 10 000, c’est une
						question, signalée dans{" "}
						<a href="/results-reports/output-schema/">
							<code>ancestorWalkLimit</code>
						</a>
						.
					</li>
					<li>
						<strong>Les pages qui remplacent <code>Array.from</code></strong> (Prototype.js,
						MooTools) sont analysées, là où l’analyse s’arrêtait sur{" "}
						<code>PAGE_BUILTINS_BROKEN</code> (voir <a href="#page-builtins-broken">l’entrée
						ci-dessous</a>).
					</li>
					<li>
						<strong>Certains sélecteurs sont différents.</strong> Les caractères de contrôle sont
						échappés, une valeur de plus de 256 caractères cède la place au chemin de l’élément, et{" "}
						<a href="/rules/page-title-present/"><code>page-title-present</code></a> et{" "}
						<a href="/rules/page-title-patterns/"><code>page-title-patterns</code></a> désignent
						l’élément title lui-même, ou <code>&lt;head&gt;</code> s’il n’y en a pas. L’identité
						d’un constat n’inclut pas son sélecteur : les baselines correspondent donc toujours.
						Les règles de contraste sont <code>notApplicable</code> sans occurrence quand aucun
						contraste n’a pu être calculé.
					</li>
					<li>
						<strong>Les erreurs sont signalées au lieu d’être lues comme rien.</strong> Un{" "}
						<code>contextSelector</code> vide analyse toujours toute la page, mais avertit ; ce
						qui n’est pas une baseline lève <code>INVALID_BASELINE</code> au lieu de rendre chaque
						échec nouveau ; et sous <code>strictOptions</code>, un nom de profil inconnu lève une
						erreur. Le profil <code>section508</code> est obsolète : utilisez{" "}
						<code>wcag20-aa</code>, qui exécute les mêmes règles.
					</li>
					<li>
						<strong>Des analyses plus rapides</strong>, avec les mêmes constats : quelques pour cent
						dans Chromium sur des pages ordinaires, 10 à 25 % sous jsdom, et beaucoup plus là où
						c’était le pire (des milliers de liens ou de champs identiques, de longs tableaux, de
						nombreuses règles de style).
					</li>
				</ul>
				<p>
					Nouveau, et sans rien changer tant que vous ne l’utilisez pas : les profils WCAG 2.0 et
					2.1 (<a href="/configuration/engine-options/#conformance-profiles">Options du moteur</a>)
					et, expérimentaux jusqu’à la 1.18.0, les normes sous forme de données, les tests sous les
					exigences, les normes fondées sur d’autres et les lois au titre desquelles une norme est
					évaluée (<a href="/configuration/packs/#experimental">Packs</a>). La liste complète se
					trouve dans le{" "}
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
				<p>
					Quand <code>broken</code> ne contient que <code>Array.from</code>, la page l’a remplacé
					(Prototype et MooTools le font) et une règle de pack ou personnalisée de l’analyse
					l’utilise : les règles propres à core ne l’utilisent plus depuis la 1.16. Écrivez cette
					règle avec la syntaxe de décomposition (<code>[...x]</code>,{" "}
					<code>[...x].map(f)</code>), ou laissez-la hors de la sélection.
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
				<p>
					Une analyse de plusieurs profils à la fois (<code>profile: ['wcag22-aa', 'wai-aria-1.2']</code>)
					analyse la page une fois par profil : elle dure donc à peu près autant que ce nombre
					d’analyses.
				</p>
			</article>

			<article>
				<h2 id="profile-not-run">
					« Un profil ne s’est pas exécuté », ou <code>engine.profilesNotRun</code> n’est pas vide
				</h2>
				<p>
					Dans une analyse de plusieurs profils, un profil qui n’a pas pu s’exécuter est listé dans{" "}
					<code>engine.profilesNotRun</code> avec sa raison, et les autres s’exécutent quand même :{" "}
					<code>unknown-profile</code> (profil inexistant : le profil d’un pack a besoin de son pack
					dans <code>packs</code>), <code>pack-skipped</code> (son pack ne s’est pas exécuté, voir{" "}
					<a href="#pack-did-not-run">l’entrée ci-dessous</a>) ou{" "}
					<code>overridden-by-selection</code> (une inclusion <code>runOnly</code>, ou des
					identifiants de règle ou des tags dans <code>engineOptions</code>, a choisi les règles à
					sa place, pour chaque profil). Une telle analyse a jugé moins que ce qui lui était
					demandé : SARIF et JUnit signalent donc une erreur, sauf avec{" "}
					<code>allowProfilesNotRun: true</code>, la CLI se termine avec le code <code>2</code>,
					sauf avec <code>--allow-profiles-not-run</code>, les bindings signalent une lacune{" "}
					<code>'profile-not-run'</code>, et test-matchers fait échouer l’assertion. Voir{" "}
					<a href="/configuration/engine-options/#several-profiles">Options du moteur</a>.
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
				<h2 id="framed-page-rules">
					« Les règles de titre, de langue et de landmarks sont <code>notApplicable</code> dans une
					frame »
				</h2>
				<p>
					Depuis la 1.15, un document affiché dans une frame n’est pas une page à part entière :{" "}
					<code>page-title-present</code>, <code>page-title-patterns</code>,{" "}
					<code>html-lang-attr-present</code>, <code>meta-viewport-zoom-enabled</code>,{" "}
					<code>meta-viewport-large</code>, <code>region</code>,{" "}
					<code>bypass-blocks-present</code>, <code>landmark-one-main</code> et{" "}
					<code>page-has-heading-one</code> y sont <code>notApplicable</code>. C’est la page autour
					de la frame qui a le titre, la langue et les landmarks qu’utilisent les personnes, et un
					navigateur ignore le <code>&lt;meta&gt;</code> viewport d’un document affiché dans une
					frame. Un exécuteur de tests qui affiche la page testée dans une frame à lui définit{" "}
					<code>engineOptions.topLevelDocument: true</code> ;{" "}
					<a href="/getting-started/cypress/">@surea11y/cypress</a> 1.6.0 le fait pour vous. Voir{" "}
					<a href="/configuration/engine-options/">Options du moteur</a>.
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
					explicite, volontairement non exhaustive. Ce qui reste revient à une personne, et les{" "}
					<a href="/conformance/procedures/">procédures de test</a> de core indiquent comment le
					vérifier, critère par critère.
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
					à <code>src/baseline-moves.json</code>, mais pas avec la 1.15, qui a retiré ces
					déplacements : là, une entrée sous un ancien code est périmée et son constat est nouveau.
					Réécrivez les codes du fichier avec la 1.14.x grâce à <code>migrateBaselineEntries</code>{" "}
					de <code>@surea11y/core/baseline</code>, puis faites la mise à jour, ou régénérez-le avec
					la 1.15 et examinez le diff. La 1.15 et la 1.16 n’ont déplacé aucun code : une baseline
					écrite par la 1.14 continue donc de correspondre ; un constat dont le résultat a changé avec la
					mise à jour est nouveau ou disparaît malgré tout, et le journal des modifications explique
					pourquoi. Voir <a href="/conformance/baseline/#upgrading">Baseline / allowlist</a>.
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

			<article>
				<h2 id="results-changed-1-15">« Mes résultats ont changé après la mise à jour vers core 1.15 »</h2>
				<p>
					La 1.15 ne fait échouer un critère WCAG que là où les WCAG le font échouer, et lit les
					frames comme le navigateur les affiche. Les changements les plus susceptibles de se voir
					dans un pipeline :
				</p>
				<ul>
					<li>
						<strong>Moins d’échecs de structure ARIA et HTML.</strong> Huit règles ARIA et les
						règles de structure HTML ne font plus échouer un critère là où seul WAI-ARIA ou le
						modèle de contenu HTML est enfreint : ces constats sont <code>cantTell</code>, avec
						l’incertitude <code>spec-only</code> et des étapes pour vérifier. Sont concernées :{" "}
						<a href="/rules/aria-role-name-present/"><code>aria-role-name-present</code></a> (grid,
						tree, radiogroup, meter, progressbar),{" "}
						<a href="/rules/dialog-name-present/"><code>dialog-name-present</code></a>,{" "}
						<a href="/rules/tooltip-name-present/"><code>tooltip-name-present</code></a>,{" "}
						<a href="/rules/aria-allowed-attr/"><code>aria-allowed-attr</code></a>,{" "}
						<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a> (sauf
						pour l’état, la valeur ou le focus d’un contrôle),{" "}
						<a href="/rules/aria-prohibited-attr/"><code>aria-prohibited-attr</code></a>,{" "}
						<a href="/rules/aria-roles-valid/"><code>aria-roles-valid</code></a> (sauf sur un
						élément focalisable), <a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a>{" "}
						(un ancêtre ; elle n’est plus associée qu’au critère 1.3.1),{" "}
						<a href="/rules/list-children-valid/"><code>list-children-valid</code></a> et{" "}
						<a href="/rules/listitem-parent-valid/"><code>listitem-parent-valid</code></a> (sauf là
						où la page dessine l’élément de liste défectueux),{" "}
						<a href="/rules/definition-list-children-valid/"><code>definition-list-children-valid</code></a>,{" "}
						<a href="/rules/dlitem-parent-valid/"><code>dlitem-parent-valid</code></a> et{" "}
						<a href="/rules/nested-interactive-controls-absent/"><code>nested-interactive-controls-absent</code></a>{" "}
						(sauf à l’intérieur d’un contrôle aux enfants de présentation). Chaque constat garde son
						code de raison, si bien que les baselines correspondent toujours, mais un contrôle ou une
						agrégation que seuls ces constats faisaient échouer réussit désormais ou est{" "}
						<code>cantTell</code>. Pour juger les mêmes constats selon WAI-ARIA, où ils échouent,
						ajoutez le <a href="/configuration/packs/#wai-aria-pack">pack WAI-ARIA</a>.
					</li>
					<li>
						<strong>Un document affiché dans une frame n’est pas une page à part entière.</strong>{" "}
						Dans une frame, <code>page-title-present</code>, <code>html-lang-attr-present</code>,
						les règles de viewport, de contournement des blocs et de landmarks sont{" "}
						<code>notApplicable</code> (voir <a href="#framed-page-rules">l’entrée ci-dessus</a>).
						Une frame sous <code>aria-hidden</code> ou <code>inert</code> est lue comme telle, et une
						frame derrière une boîte de dialogue modale ouverte est laissée de côté.
					</li>
					<li>
						<strong>Les rôles suivent WAI-ARIA de plus près.</strong> <code>role="text"</code> ne
						nomme aucun rôle valide ; une image avec un rôle de présentation et un attribut ARIA
						global garde son rôle, et échoue à{" "}
						<a href="/rules/img-alt-present/"><code>img-alt-present</code></a> sans{" "}
						<code>alt</code> ; les quatre attributs globaux que WAI-ARIA 1.2 rend obsolètes ne
						rendent plus son rôle à un élément de présentation.
					</li>
					<li>
						<strong>Un niveau de titre sauté relève des bonnes pratiques</strong>, et non d’un échec
						au critère 1.3.1, dans les <a href="/conformance/procedures/">procédures de test</a>{" "}
						révisées, qui donnent aussi les étapes « Comment vérifier » de six nouvelles questions.
					</li>
					<li>
						<strong>Une baseline de la 1.13 doit d’abord être mise à jour.</strong> La 1.15 n’a
						déplacé aucun code de raison, et a retiré les déplacements de la 1.13 à la 1.14 (voir{" "}
						<a href="#baseline-after-upgrade">l’entrée ci-dessus</a>).
					</li>
				</ul>
				<p>
					Nouveau, et sans rien changer tant que vous ne l’utilisez pas : les analyses de plusieurs
					profils à la fois (
					<a href="/configuration/engine-options/#several-profiles">Options du moteur</a>), les
					profils <code>wcag22-a</code> et <code>wcag22-aaa</code>, les procédures de test pour
					évaluer à la main, et la section « Ce qui reste à vérifier par une personne » du rapport
					HTML. La liste complète se trouve dans le{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>{" "}
					de core.
				</p>
			</article>
		</>
	);
}
