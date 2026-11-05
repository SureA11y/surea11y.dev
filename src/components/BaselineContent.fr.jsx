import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const codes = (list) =>
	list.map((c, i) => (
		<React.Fragment key={c}>
			{i > 0 && ", "}
			<code>{c}</code>
		</React.Fragment>
	));

const baselineMoves = [
	{ id: "text-missing", rules: ["img-alt-present", "embed-text-alternative-present", "object-text-alternative-present", "svg-image-text-alternative-present", "svg-text-alternative-present", "video-poster-text-alternative-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING"] },
	{ id: "area-alt", rules: ["area-alt-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING", "TEXT_ALTERNATIVE_EMPTY"] },
	{ id: "canvas", rules: ["canvas-text-alternative-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING", "ROLE_IMG_NAME_MISSING"] },
	{ id: "text-review", rules: ["area-alt-quality", "canvas-text-alternative-quality", "embed-text-alternative-quality", "input-image-alt-quality", "object-text-alternative-quality"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_REVIEW"] },
	{ id: "img-quality", rules: ["img-alt-quality", "svg-text-alternative-quality"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_REVIEW", "IMAGE_ONLY_CONTROL_CONTENT"] },
	{ id: "img-decorative", rules: ["img-alt-decorative"], from: ["EXCLUDED_ELEMENT_REVIEW"], to: ["IMAGE_ONLY_CONTROL_CONTENT"] },
	{ id: "input-image", rules: ["input-image-alt-decorative"], from: ["DEFAULT"], to: ["NAME_FROM_ELSEWHERE_REVIEW"] },
	{ id: "manual-review", rules: ["manual-review"], from: ["DEFAULT"], to: ["KEYBOARD_REVIEW"] },
	{ id: "list-children", rules: ["list-children-valid"], from: ["LIST_INVALID_CHILD"], to: ["LIST_ITEM_ROLE_OVERRIDDEN"] },
	{ id: "listitem-parent", rules: ["listitem-parent-valid"], from: ["LISTITEM_INVALID_PARENT"], to: ["LIST_ROLE_OVERRIDDEN"] },
	{ id: "prohibited-children", rules: ["aria-prohibited-children"], from: ["ARIA_PROHIBITED_CHILD_ROLELESS"], to: ["ARIA_PROHIBITED_CHILD"] },
	{ id: "duplicate-id", rules: ["duplicate-id"], from: ["DUPLICATE_ID"], to: ["DUPLICATE_ID_IN_SHADOW_TREE"] },
	{ id: "valid-lang", rules: ["valid-lang"], from: ["ELEMENT_LANG_INVALID"], to: ["DEFAULT_LANG_INVALID"] },
	{ id: "p-as-heading", rules: ["p-as-heading"], from: ["BOLD_LARGE_PARAGRAPH", "BOLD_LARGE_DIV"], to: ["HEADING_LIKE_NUMBER", "HEADING_LIKE_LINK"] },
].map((row) => ({ ...row, rules: codes(row.rules), from: codes(row.from), to: codes(row.to) }));

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
				règle n’en définit pas, ou définit autre chose qu’une chaîne non vide), et <code>html</code> est l’extrait de HTML externe de
				l’occurrence. Cette identité repose sur le contenu et non sur la position : elle résiste au
				déplacement de l’élément signalé dans la page (un réordonnancement, un élément frère sans
				rapport ajouté ou supprimé) tant que le balisage propre de l’élément signalé ne change pas.
				Pour un constat qui porte sur la page elle-même, signalé sur <code>&lt;html&gt;</code> ou{" "}
				<code>&lt;body&gt;</code> (<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a>,{" "}
				<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>, <a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>), l’extrait se limite à
				la balise ouvrante : modifier le contenu de la page n’en fait donc pas un nouveau constat.
				L’extrait est comparé avec les attributs de chaque balise triés par nom et ses noms de
				classes triés, si bien qu’un build qui écrit <code>class="b a" src</code> là où le
				précédent écrivait <code>src class="a b"</code> correspond ; les fichiers de baseline
				écrits avant ce changement correspondent toujours, puisque la comparaison est faite au
				moment de la correspondance.{" "}
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
				Un constat situé dans un frame d’un résultat multi-frames (<code>runa11yCoreAcrossFrames</code>)
				se distingue aussi par son frame : son entrée enregistre le <strong>chemin</strong> du frame,
				les sélecteurs des éléments frame qui y mènent (<code>"frame": ["#checkout"]</code>), et ne
				correspond qu’à un constat situé dans le frame à ce chemin. Le même composant défectueux
				dans la page et dans un frame donne deux constats. Les entrées sans <code>frame</code>{" "}
				appartiennent à la page elle-même, si bien qu’une baseline écrite à partir d’une analyse
				d’un seul document continue de correspondre à la page.
			</p>
			<p>
				Un résultat compact (<code>engineOptions.output.detail: 'findings'</code>, voir{" "}
				<a href="/results-reports/output-schema/#top-level-result">Schéma de sortie</a>) est lu
				comme le résultat complet qu’il représente ; il est donc signalé de la même façon.
			</p>
			<p>
				Les entrées de baseline qui ne correspondent à rien dans une nouvelle analyse sont
				signalées comme <strong>obsolètes</strong> : la violation a peut-être été corrigée, ou
				le balisage de l’élément a changé, ou l’analyse ne l’a pas atteint (un autre viewport, un
				autre périmètre ou un autre ensemble de règles). C’est purement informatif et cela ne
				bloque jamais le build ; examinez-les, puis régénérez périodiquement la baseline avec{" "}
				<code>--write-baseline</code> pour les nettoyer.
			</p>

			<h2 id="findings-that-lean-fail">Constats qui penchent vers l’échec</h2>
			<p>
				Une baseline enregistre des échecs. Un constat non tranché n’en est pas un, mais depuis la
				1.14 certains penchent vers l’échec : les indices de la page pointent vers un échec sans le
				prouver (leur <code>lean</code>, voir le{" "}
				<a href="/results-reports/output-schema/#leans">schéma de sortie</a>). Un build qui bloque
				sur eux (<code>leanFailAs</code> dans les rapports{" "}
				<a href="/results-reports/junit-report/#options">JUnit</a> et{" "}
				<a href="/results-reports/sarif-report/#options">SARIF</a>) doit pouvoir accepter ceux
				qu’une page a déjà, comme il accepte ses échecs. Demandez-les en construisant la baseline :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { buildBaselineEntries } = require('@surea11y/core/baseline');",
					"",
					"const entries = buildBaselineEntries(result, { leanFail: true });",
				]}
			/>
			<p>
				Chaque constat qui penche vers l’échec et bloque avec <code>leanFailAs</code> (
				<code>leaningFailures(result)</code> de <code>@surea11y/core</code>) reçoit une entrée
				marquée <code>"lean": "fail"</code>, après les échecs :
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'{ "ruleId": "heading-order", "reasonCode": "HEADING_ORDER_SKIPPED_LEVEL", "selector": "html > body > main > h3", "html": "<h3>Details</h3>", "lean": "fail" }',
				]}
			/>
			<p>
				Une telle entrée ne correspond qu’à un constat qui penche vers l’échec, de même identité,
				et une entrée ordinaire qu’à un échec. Avec <code>leanFailAs</code>, JUnit ne bloque pas
				sur un constat auquel elle correspond (son message <code>&lt;skipped&gt;</code> le compte
				parmi les échecs probables connus) et SARIF le laisse en <code>warning</code>. Sans{" "}
				<code>leanFailAs</code>, ces entrées ne changent rien, et <code>matchBaseline</code> les
				laisse hors de ses comptes, obsolètes comprises, sauf avec{" "}
				<code>{"{ leanFail: true }"}</code> : il les compare alors dans <code>leanFail</code> (
				<code>{"{ total, knownCount, newCount, newOccurrences, staleCount }"}</code>).{" "}
				<code>--write-baseline</code> n’écrit que les échecs.
			</p>
			<p>
				Les <code>lean</code> arrivent dans des versions mineures : une mise à jour peut donc
				apporter des échecs probables que la baseline ne contient pas. Reconstruisez-la avec{" "}
				<code>leanFail: true</code> après une mise à jour, et examinez le diff. La façon dont ils
				sont choisis et mesurés est décrite dans{" "}
				<a href={`${core}/docs/LEANS.md`}>
					<code>LEANS.md</code>
				</a>
				, sur GitHub.
			</p>

			<h2 id="upgrading">Mettre à jour</h2>
			<p>
				L’identité d’un constat comprend son code de raison, et une version mineure peut lui en
				donner un nouveau : une règle qui n’en donnait pas (<code>DEFAULT</code>) en donne un, ou
				un code est scindé en deux selon la cause (voir{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>l’identité d’un constat</a>{" "}
				dans <code>API_STABILITY.md</code>, sur GitHub). Le constat est le même, et une baseline
				écrite avant la mise à jour y correspond toujours : chaque déplacement figure dans{" "}
				<code>src/baseline-moves.json</code> (règle, ancien code, nouveaux codes), et une entrée
				sous l’ancien code correspond au constat sous un nouveau quand le reste de son identité,
				la règle, le balisage et le frame, est le même. <code>matchBaseline</code> et l’option{" "}
				<code>baselineEntries</code> des rapports SARIF et JUnit le lisent tous. Une entrée est
				d’abord cherchée sous le code propre du constat : elle ne va donc jamais à un constat
				déplacé quand un autre constat a exactement cette identité.
			</p>
			<p>
				Le tableau couvre une version mineure : un déplacement y figure depuis la version qui l’a
				apporté jusqu’à la version mineure suivante, qui le retire. La 1.15 n’a déplacé aucun
				constat, son tableau est donc vide.
			</p>
			<p>La 1.14 a déplacé ceux-ci, depuis la 1.13, et la 1.15 les a retirés :</p>
			<DataTable
				label="Codes de raison déplacés en 1.14"
				rowKey="id"
				columns={[
					{ key: "rules", label: "Règle", wrap: true, width: "45%" },
					{ key: "from", label: "Ancien code", wrap: true },
					{ key: "to", label: "Nouveau code", wrap: true },
				]}
				rows={baselineMoves}
			/>
			<p>
				Une baseline écrite par la 1.13 continue donc de correspondre à ceux-ci avec la 1.14.x,
				mais pas avec la 1.15 : là, une entrée sous un ancien code est périmée et son constat est
				nouveau. Mettez une telle baseline à jour avec la 1.14.x, comme ci-dessous, avant de passer
				à la 1.15 ; <code>migrateBaselineEntries</code> ne connaît plus ces déplacements en 1.15.
				Une baseline écrite par la 1.14 continue de correspondre avec la 1.15.
			</p>
			<p>
				Régénérer la baseline avec <code>--write-baseline</code> (ou{" "}
				<code>buildBaselineEntries</code>) après une mise à jour écrit chaque constat sous son code
				actuel, et rend le tableau inutile. Cela accepte aussi tout constat que la mise à jour
				signale pour la première fois : examinez donc son diff. Pour mettre les codes à jour sans
				rien accepter de nouveau, réécrivez le fichier avec <code>migrateBaselineEntries</code> de{" "}
				<code>@surea11y/core/baseline</code> :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { migrateBaselineEntries } = require('@surea11y/core/baseline');",
					"",
					"const file = JSON.parse(fs.readFileSync('baseline.json', 'utf8'));",
					"// With the scan's result, an entry for a split code takes the code its finding has now.",
					"file.entries = migrateBaselineEntries(file, result);",
					"fs.writeFileSync('baseline.json', JSON.stringify(file, null, 2) + '\\n');",
				]}
			/>
			<p>
				Elle renvoie une copie des entrées où chaque entrée déplacée porte son nouveau code, et
				toutes les autres telles quelles. Sans résultat, elle ne réécrit que les déplacements
				qu’elle peut établir sans le constat : un code que la règle ne donne plus et qui est passé
				à un seul nouveau (le <code>DEFAULT</code> de <code>img-alt-present</code>), pas une
				scission.
			</p>
			<p>
				Un constat dont le résultat a changé avec la mise à jour est une autre affaire : une règle
				qui fait désormais échouer ce qu’elle demandait, ou demande ce qu’elle faisait échouer,
				donne un constat que la baseline ne contenait pas, ou n’en donne plus un qu’elle
				contenait, et le <a href={`${core}/CHANGELOG.md`}>journal des modifications</a> explique
				pourquoi.
			</p>

			<h2 id="several-profiles">Une analyse de plusieurs profils</h2>
			<p>
				Un résultat de <a href="/configuration/engine-options/#several-profiles">plusieurs profils</a>{" "}
				(<code>engineOptions.profile</code> sous forme de liste, core 1.15.0 et ultérieur)
				liste chaque constat une seule fois, avec dans <code>verdicts</code> ce que chaque profil en
				conclut. Une entrée de baseline est le constat, par règle, code de raison et balisage : une
				seule entrée le couvre donc sous chaque profil, et une baseline écrite à partir d’une analyse
				d’un seul profil correspond toujours aux mêmes constats dans une analyse de plusieurs.
			</p>

			<h2 id="scanning-at-several-viewport-widths">Analyser à plusieurs largeurs de viewport</h2>
			<p>
				Une entrée de baseline n’enregistre pas le viewport, et la correspondance ne s’en sert pas :
				le même élément avec le même défaut correspond quelle que soit la largeur. Cela convient à
				une page dont les constats ne dépendent pas de sa mise en page. Une règle qui dépend de la
				mise en page, comme{" "}
				<a href="/rules/text-spacing-content-loss/">
					<code>text-spacing-content-loss</code>
				</a>{" "}
				ou{" "}
				<a href="/rules/target-size-minimum/">
					<code>target-size-minimum</code>
				</a>
				, peut échouer à une largeur et pas à une autre ; pour une page analysée à plusieurs
				largeurs, gardez donc <strong>une baseline par largeur</strong> :{" "}
				<code>a11y-baseline-390.json</code>, <code>a11y-baseline-1280.json</code>.
			</p>
			<p>
				Une baseline unique écrite à partir de toutes les largeurs bloque toujours correctement,
				puisqu’un constat n’est nouveau que si aucune entrée ne lui correspond. Mais chaque
				exécution signale alors les constats des autres largeurs comme obsolètes, si bien que le
				nombre d’entrées obsolètes ne vous dit plus ce qui a été corrigé.
			</p>

			<h2 id="file-format">Format du fichier</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "TEXT_ALTERNATIVE_MISSING", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> rejette tout fichier qui n’est pas de la forme{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> avec une erreur claire (code de sortie 2),
				plutôt que d’essayer de deviner un format plus ancien ou différent.{" "}
				<code>matchBaseline</code>, ainsi que l’option <code>baselineEntries</code> des
				reporters SARIF et JUnit, acceptent le fichier tel qu’il est enregistré (son{" "}
				<code>JSON.parse</code>) ou sa liste <code>entries</code>.
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
