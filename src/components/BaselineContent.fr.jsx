import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function BaselineContent() {
	return (
		<>
			<p>
				Un contrôle de CI strict (« faire échouer le build au moindre résultat <code>fail</code> »)
				bloque l’adoption pour une équipe qui analyse pour la première fois un site existant et
				imparfait : elle ne peut plus rien livrer tant que chaque violation préexistante n’est pas
				corrigée. Une baseline permet à l’équipe de dire « ces N violations sont déjà connues, ne
				bloquez pas le build pour elles, mais faites-le échouer dès qu’une violation réellement
				nouvelle apparaît ».
			</p>
			<CodeBlock
				lines={[
					"# Once: record every current fail occurrence, does not fail the build.",
					{ text: "surea11y scan ./dist/index.html --write-baseline baseline.json", command: true },
					"",
					"# Commit baseline.json to git.",
					"",
					"# From then on, in CI: only a NEW (not-yet-baselined) fail occurrence gates the build.",
					{ text: "surea11y scan ./dist/index.html --baseline baseline.json", command: true },
				]}
			/>
			<p>
				Le fichier de baseline est fait pour être versionné dans git, afin qu’accepter davantage de
				dette d’accessibilité devienne une décision explicite et relisible : une nouvelle violation
				apparaît comme une nouvelle ligne dans le diff du fichier au sein d’une PR, et non comme un
				changement silencieux dans un compteur.
			</p>

			<h2>Quand c’est utile</h2>
			<ul>
				<li>
					<strong>Adopter l’analyse sur un site existant.</strong> Le cas qui motive tout ce qui
					précède : une première analyse d’un site mature peut faire remonter des centaines de
					violations préexistantes. Les enregistrer une fois dans une baseline débloque le contrôle
					immédiatement, au lieu d’exiger de « tout corriger d’abord ».
				</li>
				<li>
					<strong>Corriger progressivement avec un burn-down visible.</strong> Corrigez les
					violations par lots, puis régénérez périodiquement la baseline avec{" "}
					<code>--write-baseline</code>. Le diff git de chaque régénération <em>rétrécit</em> à
					mesure que des entrées disparaissent : le fichier lui-même devient un suivi de
					progression, et une PR qui corrige un lot de problèmes montre exactement ce qui a été
					nettoyé.
				</li>
				<li>
					<strong>Contenu tiers ou fournisseur que vous ne maîtrisez pas.</strong> Une page intègre
					un widget (bulle de chat, bloc publicitaire, iframe de paiement) avec des violations
					connues que vous ne pouvez pas corriger. Placer seulement ces occurrences précises dans la
					baseline est plus précis que d’exclure tout le sous-arbre via{" "}
					<code>excludeSelectors</code> (voir{" "}
					<a href="/configuration/engine-options/#rule-scoped-excludeselectors">le guide des options du moteur</a>) :
					les nouveaux problèmes introduits n’importe où à proximité, y compris dans votre propre
					code, bloquent toujours normalement.
				</li>
				<li>
					<strong>Filet de sécurité contre les régressions pendant une grosse refonte.</strong> En
					pleine migration, certaines règles peuvent légitimement échouer temporairement, d’une
					manière déjà suivie et en cours de correction sur de nombreuses PR. Placer cet ensemble
					connu dans la baseline permet quand même de détecter les nouvelles régressions{" "}
					<em>sans rapport</em> venant d’autres PR pendant la même période, au lieu de désactiver
					complètement le contrôle ou d’y bloquer chaque PR.
				</li>
				<li>
					<strong>Déploiement progressif d’une règle nouvelle ou plus stricte.</strong> Vous activez
					une règle (ou tout un niveau WCAG) que le code ne respecte pas encore : placez les écarts
					existants dans la baseline, activez le contrôle immédiatement, et empêchez toute{" "}
					<em>nouvelle</em> violation de cette règle pendant que l’arriéré est traité à part,
					plutôt que d’attendre que le code soit déjà conforme pour activer la règle.
				</li>
			</ul>

			<h2>Fonctionnement de la correspondance</h2>
			<p>
				Rien dans la structure d’une occurrence ne constitue une identité parfaite et indépendante
				de la position dans la page (voir{" "}
				<a href="/results-reports/output-schema/">le schéma de sortie</a>) : <code>selector</code>{" "}
				et <code>structuralPath</code> dérivent tous deux de la position de l’élément dans le DOM,
				donc l’un comme l’autre peut changer quand un balisage <em>sans rapport</em> est modifié
				ailleurs dans la page, alors que l’élément signalé lui-même n’a pas bougé.
			</p>
			<p>L’identité d’une entrée de baseline est donc :</p>
			<CodeBlock lines={["ruleId + reasonCode + html"]} />
			<p>
				où <code>reasonCode</code> est le code propre à la règle, issu de{" "}
				<code>occurrence.data.details.reasonCode</code> (<code>"DEFAULT"</code> par défaut si la
				règle n’en définit pas), et <code>html</code> est l’extrait de HTML externe de
				l’occurrence. Cette identité repose sur le contenu et non sur la position : elle résiste au
				déplacement de l’élément signalé dans la page (un réordonnancement, un élément frère sans
				rapport ajouté ou supprimé) tant que le balisage propre de l’élément signalé ne change pas.{" "}
				<code>selector</code> est toujours enregistré dans le fichier de baseline, mais uniquement
				pour donner du contexte à la lecture d’un diff : il ne sert jamais à la correspondance.
			</p>
			<p>
				<strong>Limite connue</strong> : un élément dont le balisage <em>propre</em> contient du
				contenu dynamique (un horodatage, un compteur en direct, un id généré aléatoirement) ne
				correspondra jamais à lui-même d’une analyse à l’autre, puisque son extrait{" "}
				<code>html</code> diffère à chaque fois. Si vos pages sont dans ce cas, le mécanisme de
				baseline n’aidera pas pour ces règles ou éléments précis : voir « Alternative » ci-dessous.
			</p>
			<p>
				<strong>La correspondance compte les occurrences, pas seulement leur présence.</strong> Si
				une page contient 3 éléments qui produisent des{" "}
				<code>ruleId</code>+<code>reasonCode</code>+<code>html</code> identiques à l’octet près
				(par exemple le même composant défectueux répété 3 fois) et que la baseline n’en a
				enregistré qu’un, une nouvelle analyse en signale 1 connu et 2 nouveaux, et non les 3 comme
				connus.
			</p>
			<p>
				Les entrées de baseline qui ne correspondent à rien dans une nouvelle analyse sont
				signalées comme <strong>obsolètes</strong> (la violation a vraisemblablement été
				corrigée) : c’est purement informatif et cela ne bloque jamais le build. Régénérez
				périodiquement la baseline avec <code>--write-baseline</code> pour les nettoyer.
			</p>

			<h2>Format du fichier</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "DEFAULT", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> rejette tout fichier qui n’est pas de la forme{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> avec une erreur claire (code de sortie 2),
				plutôt que d’essayer de deviner un format plus ancien ou différent.
			</p>

			<h2>Combinaison avec <code>--json</code></h2>
			<p>
				Quand <code>--baseline</code> ou <code>--write-baseline</code> est utilisé avec{" "}
				<code>--json</code>, l’objet affiché comporte une clé <code>baseline</code> en plus du
				résultat normal du moteur (cela ne concerne que la sortie de la CLI et ne fait pas partie du
				contrat de résultat du moteur décrit dans le schéma de sortie) :
			</p>
			<ul>
				<li>
					<code>--write-baseline</code> :{" "}
					<code>{'{ mode: "write", path, entries: <number written> }'}</code>
				</li>
				<li>
					<code>--baseline</code> :{" "}
					<code>
						{'{ mode: "check", totalFail, knownCount, newCount, staleCount, newOccurrences: [...] }'}
					</code>
				</li>
			</ul>

			<h2>Alternative : comparer vous-même deux analyses</h2>
			<p>
				Si vos pages ne correspondent pas à ce modèle (beaucoup de contenu dynamique à l’intérieur
				même des éléments signalés), la solution de repli toujours disponible consiste à comparer
				vous-même deux sorties <code>--json</code> complètes : voir{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>
				. Vous gardez ainsi un contrôle total sur la logique d’identité et de correspondance, au
				prix de l’écrire vous-même.
			</p>
		</>
	);
}
