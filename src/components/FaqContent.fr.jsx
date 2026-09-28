import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2>« J’ai transmis <code>runOnly: ['some-rule-id']</code> mais toutes les règles ont quand même été exécutées »</h2>
				<p>
					<strong><code>runOnly</code> doit être un objet, pas un simple tableau.</strong>{" "}
					<code>runOnly: ['img-alt-present']</code> est ignoré sans avertissement (le moteur
					revient à « tout exécuter »), parce que cette forme ne contient aucun des champs que le
					moteur vérifie réellement (<code>includeRuleIds</code>, <code>tags</code>, etc.). On a
					facilement le réflexe d’écrire un simple tableau, c’est donc la première chose à
					vérifier.
				</p>
				<p>Correction :</p>
				<CodeBlock lang="js" lines={["runOnly: { includeRuleIds: ['img-alt-present'] }"]} />
				<p>
					Voir <a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a> pour la structure complète.
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
					Node (jsdom, content script d’une extension de navigateur).{" "}
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
