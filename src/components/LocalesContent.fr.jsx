import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import localeData from "../data/locales.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const localeCoverageRows = localeData.locales.map((l) => ({
	id: l.id,
	locale: <code>{l.id}</code>,
	name: new Intl.DisplayNames(["fr"], { type: "language" }).of(l.id) ?? l.name,
	file: <code>{l.file}</code>,
	keys: String(l.keys),
	untranslated: l.canonical ? "— (le jeu canonique, utilisé en repli)" : String(l.stillEnglish),
}));

// Sample output for getLocaleCoverage(), built from the same generated data
// as the table above so the numbers can't drift apart.
const coverageSampleLines = [
	"const { getLocaleCoverage } = require('@surea11y/core');",
	"",
	"getLocaleCoverage();",
	"// {",
	"//   sourceLocale: 'en',",
	`//   totalKeys: ${localeData.totalKeys},`,
	"//   locales: [",
	...localeData.locales
		.filter((l) => !l.canonical)
		.slice(0, 2)
		.map(
			(l) =>
				`//     { locale: '${l.id}', total: ${l.keys}, translated: ${l.keys - l.stillEnglish}, missing: ${l.missing}, orphaned: [], percent: ${Math.round(((l.keys - l.stillEnglish) / l.keys) * 1000) / 10} },`,
		),
	"//     ...",
	"//   ]",
	"// }",
];

const reviewDictionaryRows = [
	{
		id: "node",
		who: <><code>runDomRulesInPage</code>, <code>addHowToCheck</code>, <code>howToCheckFor</code>, <code>renderHtmlReport</code></>,
		how: <>Depuis le paquet installé, cherchés d’après la langue en minuscules (<code>fr-ca</code>, puis <code>fr</code>), l’anglais en dernier.</>,
	},
	{
		id: "browser",
		who: "Du code qui s’exécute dans un navigateur (un spec Cypress)",
		how: <><code>{"applyHowToCheck(result, { en, fr })"}</code> de <code>@surea11y/core/how-to-check</code>, avec les dictionnaires qu’il importe sous <code>@surea11y/core/review/&lt;locale&gt;</code>.</>,
	},
	{
		id: "bundle",
		who: <><code>a11ycore.openReport(result)</code> dans le bundle navigateur</>,
		how: <>Récupérés à côté du bundle, ou donnés sous la forme <code>{"{ reviewDictionaries }"}</code>.</>,
	},
];

const localeReasonRows = [
	{ id: "ok", reason: <code>ok</code>, meaning: "Vous avez obtenu exactement ce que vous avez demandé, et ce dictionnaire contient toutes les clés." },
	{
		id: "primary-subtag",
		reason: <code>primary-subtag</code>,
		meaning: (
			<>
				Votre code de locale comportait une sous-étiquette sans dictionnaire propre, donc sa langue de base a
				été utilisée : vous avez demandé <code>de-DE</code> et obtenu <code>de</code>. C’est normal
				et attendu ; il n’y a rien à corriger. Une simple différence de casse ne relève pas de ce
				cas : <code>DE</code> renvoie <code>ok</code>.
			</>
		),
	},
	{
		id: "dictionary-not-loaded",
		reason: <code>dictionary-not-loaded</code>,
		meaning: "Le projet fournit cette langue, mais cette copie du moteur ne l’embarque pas et aucun dictionnaire n’a été fourni. En pratique : le bundle navigateur autonome sans son fichier de langue séparé.",
	},
	{
		id: "unknown-locale",
		reason: <code>unknown-locale</code>,
		meaning: (
			<>
				Le projet ne propose aucune traduction dans cette langue, donc l’anglais a été utilisé. <code>ko</code> et{" "}
				<code>pt-BR</code> tombent tous deux dans ce cas aujourd’hui.
			</>
		),
	},
	{
		id: "partial-dictionary",
		reason: <code>partial-dictionary</code>,
		meaning: "Le dictionnaire a été utilisé mais il lui manque certaines clés, donc ces chaînes-là sont retombées sur l’anglais.",
	},
];

const dictionaryLocationRows = [
	{ id: "require", how: <code>require('@surea11y/core')</code>, what: "Toutes les langues, intégrées. Rien à configurer." },
	{ id: "binding", how: "Un binding (Playwright, Cypress, …)", what: "Toutes les langues, intégrées. Rien à configurer." },
	{
		id: "browser",
		how: <code>surea11y.browser.js</code>,
		what: (
			<>
				L’anglais. Chargez <code>surea11y.i18n.&lt;locale&gt;.js</code> après lui pour toute autre langue.
			</>
		),
	},
];

export function LocalesContent() {
	return (
		<>
			<p>
				Le titre et la description de chaque règle, ainsi que le résumé et l’indication de chaque
				occurrence, sont localisés par une recherche dans un dictionnaire à clés, et non codés en
				dur pour chaque langue.
			</p>

			<h2>Langues actuellement couvertes</h2>
			<DataTable
				label="Couverture des langues"
				rowKey="id"
				columns={[
					{ key: "locale", label: "Langue", width: "18%" },
					{ key: "file", label: "Fichier", width: "24%" },
					{ key: "keys", label: "Clés", width: "12%" },
					{ key: "untranslated", label: "Non traduites", wrap: true },
				]}
				rows={localeCoverageRows.map((r) => ({
					...r,
					locale: (
						<>
							{r.locale} ({r.name})
						</>
					),
				}))}
			/>
			<p>
				« Non traduites » compte les valeurs identiques au texte anglais, caractère pour
				caractère, à l’exception des mots qui sont à juste titre les mêmes dans une langue : en
				français <em>Orientation</em>, <em>Interruptions</em> et <em>Occurrences</em>, en allemand{" "}
				<em lang="de">Frame</em>, <em lang="de">Frames</em> et <em lang="de">Element</em>, en espagnol <em lang="es">Selector</em>. Ces mots sont listés
				comme tels, chacun avec le texte anglais auquel il a été comparé, et comptent comme
				traduits. Si l’anglais change, l’entrée ne s’applique plus et la chaîne compte comme non
				traduite jusqu’à ce que quelqu’un la vérifie de nouveau. Le décompte ne voit pas un mot
				anglais resté dans une phrase par ailleurs traduite ; cela se repère en lisant le texte, et
				il n’en reste aucun dans les langues ci-dessus. Il ne mesure pas non plus si une traduction
				est exacte ou emploie les termes d’accessibilité habituels d’une langue ; cela demande une
				personne qui lit cette langue.
			</p>

			<h3 id="reading-coverage-from-the-package">Lire la couverture depuis le paquet</h3>
			<p>
				Les mêmes chiffres sont disponibles à l’exécution, à partir des dictionnaires que livre le
				paquet installé : un outil ou un site de documentation peut donc les afficher sans copie
				locale du dépôt.
			</p>
			<CodeBlock lang="js" lines={coverageSampleLines} />
			<p>
				Pour chaque langue, <code>total</code> est le nombre de clés anglaises auquel elle est
				comparée, <code>translated</code> le nombre de ses valeurs qui diffèrent de l’anglais ou
				sont listées comme identiques à juste titre, <code>missing</code> le nombre de clés qui lui
				manquent (elles s’affichent en anglais) et <code>orphaned</code> les clés qu’elle a et que
				l’anglais n’a pas. <code>total - translated</code> correspond à la colonne « Non
				traduites » ci-dessus, clés manquantes comprises. Les clés qu’un profil exclut
				volontairement d’une langue ne sont pas comptées. Le rapport de couverture du dépôt et
				cette fonction partagent une seule implémentation et concordent donc toujours ; le
				rapport compte séparément les dictionnaires de core et ceux de chaque profil, cette
				fonction le dictionnaire fusionné qu’utilise une analyse. C’est un export pris en charge (
				<a href={`${core}/docs/API_STABILITY.md#extension-points`}>
					<code>API_STABILITY.md</code>, points d’extension
				</a>
				).
			</p>
			<p>
				Les fichiers de langue sont du JSON simple : une table plate associant chaque clé à sa
				chaîne traduite, dans le même ordre de clés que <code>en.json</code>. Ils ne contiennent
				rien d’autre, donc contribuer une langue revient à modifier du texte sans jamais toucher
				au code.
			</p>
			<p>
				Chaque fichier de langue contient toutes les clés de <code>en.json</code>. C’est le rôle de{" "}
				<code>npm run i18n:sync</code> de le garantir : lancez-le après toute modification de{" "}
				<code>en.json</code> et il réécrit chaque fichier de langue non anglais pour l’aligner, en
				ajoutant les nouvelles clés, en supprimant celles que <code>en.json</code> n’a plus, et
				sans toucher aux traductions existantes. Une clé qu’il ajoute reçoit le texte anglais comme
				valeur initiale, ce qui compte comme non traduit jusqu’à ce que quelqu’un le remplace.
			</p>

			<h2>Choisir une langue</h2>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { locale: 'fr' }, null);"]} />
			<p>La valeur par défaut est <code>'en'</code> si l’option est omise. Toute chaîne est acceptée ; <strong>une locale non reconnue n’est jamais une erreur</strong>.</p>

			<h2>Comment la langue est déterminée</h2>
			<p>
				Deux choses se produisent, dans cet ordre. Les confondre est la source de confusion
				habituelle, c’est pourquoi elles sont décrites séparément.
			</p>
			<h3>Étape 1 : choisir un dictionnaire (une fois par analyse)</h3>
			<ol>
				<li>
					Utiliser le dictionnaire qui correspond à votre code de locale. <code>de</code> trouve{" "}
					<code>de.json</code>. La casse n’a pas d’importance : <code>pt-br</code>,{" "}
					<code>pt-BR</code> et <code>PT-BR</code> trouvent tous <code>pt-BR.json</code>.
				</li>
				<li>
					Sinon, supprimer tout ce qui suit le premier <code>-</code> et réessayer.{" "}
					<code>de-DE</code> trouve <code>de.json</code> ; <code>de-AT</code> aussi.
				</li>
				<li>Sinon, utiliser l’anglais.</li>
			</ol>
			<p>
				Vous n’avez donc besoin d’un <code>de-DE.json</code> que si l’allemand d’Autriche et celui
				d’Allemagne doivent réellement différer. Fournissez <code>de.json</code> et toutes les
				variantes de l’allemand sont couvertes.
			</p>
			<h3>Étape 2 : résoudre chaque chaîne (chaîne par chaîne)</h3>
			<p>Dans le dictionnaire choisi, chaque chaîne est recherchée individuellement :</p>
			<ol>
				<li>Prendre la valeur de la clé dans le dictionnaire choisi.</li>
				<li>Si cette clé manque, prendre la valeur anglaise.</li>
				<li>
					Si l’anglais ne l’a pas non plus (ce qui ne devrait pas arriver pour une clé intégrée,
					mais peut arriver pour une clé écrite à la main), utiliser le texte littéral que porte la
					règle elle-même.
				</li>
			</ol>
			<p>
				<strong>Le résultat n’est jamais une chaîne vide, un <code>undefined</code> ni une erreur levée.</strong>{" "}
				Une traduction inachevée s’affiche dans votre langue là où elle existe, et en anglais
				partout ailleurs.
			</p>

			<h2>Savoir quelle langue vous avez réellement obtenue</h2>
			<p>
				Ce repli en douceur a un inconvénient :{" "}
				<strong>demandez une langue que le build n’embarque pas et vous recevez un anglais
				impeccable, sans rien dans les chaînes pour vous le signaler</strong>. Chaque résultat
				indique donc la résolution une fois, en tête :
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"engine": {',
					'  "tag": "a11ycore",',
					'  "schemaVersion": "1.0.0",',
					'  "locale": { "requested": "ko", "resolved": "en", "reason": "unknown-locale" }',
					"}",
				]}
			/>
			<p>
				<code>requested</code> est ce que vous avez demandé (après suppression des espaces ;{" "}
				<code>en</code> si vous n’avez rien passé ou une valeur qui n’est pas une chaîne),{" "}
				<code>resolved</code> est le dictionnaire utilisé, et <code>reason</code> prend l’une des
				valeurs suivantes :
			</p>
			<DataTable
				label="Valeurs de locale.reason"
				rowKey="id"
				columns={[
					{ key: "reason", label: "reason", width: "26%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={localeReasonRows}
			/>
			<p>
				Considérez cette liste comme ouverte : une version ultérieure peut ajouter une valeur,
				donc testez celles qui vous intéressent et laissez les autres tomber dans un cas par défaut.
			</p>
			<p>
				Si vous avez besoin d’une langue précise, <code>requested !== resolved</code> est la
				condition à vérifier en CI. Notez qu’elle est aussi vraie dans le cas inoffensif{" "}
				<code>primary-subtag</code> ; basez donc plutôt la condition sur{" "}
				<code>reason === 'unknown-locale' || reason === 'dictionary-not-loaded'</code> si une
				correspondance sur la langue de base vous suffit. Voir{" "}
				<a href="/results-reports/output-schema/">le schéma de sortie</a> pour la place de ce champ
				dans le résultat, et{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> pour ce qui
				est garanti à son sujet.
			</p>

			<h2>Où se trouvent les dictionnaires</h2>
			<p>Les langues disponibles dépendent de la manière dont vous chargez le moteur.</p>
			<DataTable
				label="Provenance des dictionnaires"
				rowKey="id"
				columns={[
					{ key: "how", label: "Mode de chargement", width: "36%" },
					{ key: "what", label: "Ce que vous obtenez", wrap: true },
				]}
				rows={dictionaryLocationRows}
			/>
			<p>
				Le bundle est découpé parce qu’il transite par le réseau vers chaque page qui l’utilise, et
				aucune page n’a besoin de toutes les langues. Garder l’anglais intégré et le reste optionnel
				tient les autres langues hors du téléchargement, et l’empêche de grossir à mesure que des
				langues sont ajoutées. Chaque fichier séparé, <code>surea11y.i18n.&lt;locale&gt;.js</code>,
				a à peu près la taille du texte anglais qu’il remplace (200 à 250 Ko aujourd’hui), et une
				page ne charge que ceux qu’elle utilise. Rien d’autre ne change : le paquet Node et les bindings ne sont pas
				concernés.
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y.browser.js"></script>',
					'<script src="surea11y.i18n.ja.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'ja' }, null);",
					"</script>",
				]}
			/>
			<p>
				Demandez une langue dont vous n’avez pas chargé le fichier et vous obtenez l’anglais, avec{" "}
				<code>engine.locale.reason</code> défini à <code>dictionary-not-loaded</code>, ce qui
				diffère de <code>unknown-locale</code>, qui signifie que le projet ne propose aucune traduction
				dans cette langue.
			</p>
			<p>
				Dans Node, ce même fichier séparé est un module : <code>require('@surea11y/core/i18n/de')</code>{" "}
				renvoie <code>{"{ locale, messages }"}</code> (<code>locale</code> vaut <code>'de'</code>,{" "}
				<code>messages</code> est la table plate qui associe chaque clé à son texte), sans avoir
				besoin du bundle.
			</p>
			<p>
				Les messages d’un <a href="/configuration/packs/">pack</a> se trouvent dans ses propres
				dictionnaires, que le pack liste par langue ; dans une langue pour laquelle le pack n’a pas
				de dictionnaire, ses messages s’affichent en anglais.
			</p>

			<h3 id="review-dictionaries">Les dictionnaires de revue</h3>
			<p>
				Les étapes qui indiquent à une personne comment trancher un constat indécis (
				<code>howToCheck</code>, voir <a href="/results-reports/output-schema/#how-to-check">le
				schéma de sortie</a>) se trouvent dans des dictionnaires à part, dans les cinq mêmes
				langues. Ils sont tenus à l’écart des dictionnaires du moteur pour que les étapes n’entrent
				jamais dans le bundle ni dans une page : elles sont ajoutées après l’analyse, dans Node, ou
				par du code qui les importe. Core 1.14.0 et ultérieur.
			</p>
			<DataTable
				label="Qui lit les dictionnaires de revue"
				rowKey="id"
				columns={[
					{ key: "who", label: "Qui les lit", width: "40%", wrap: true },
					{ key: "how", label: "Comment", wrap: true },
				]}
				rows={reviewDictionaryRows}
			/>
			<p>
				Une étape qui manque dans une langue s’affiche en anglais, comme un message. Les{" "}
				<a href="/configuration/packs/#review-steps">étapes propres à une règle de pack</a> sont
				en anglais dans toutes les langues. <code>getLocaleCoverage()</code> ne compte pas ces
				dictionnaires. Les étapes ne portent pas de clés : pour les afficher dans une autre langue,
				ajoutez-les de nouveau :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { addHowToCheck } = require('@surea11y/core');",
					"",
					"const inFrench = addHowToCheck(result, { locale: 'fr' });",
				]}
			/>

			<h3>Fournir votre propre dictionnaire</h3>
			<p>
				<code>engineOptions.messages</code> accepte <code>{"{ [locale]: { key: value } }"}</code>{" "}
				et prend le pas sur tout ce qui est intégré ou chargé depuis un fichier séparé. Utile pour
				remplacer quelques chaînes, ou pour une langue que vous maintenez en privé :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  locale: 'de',",
					"  messages: { de: { img_altPresent_title: 'Eigener Text' } }",
					"}, null);",
				]}
			/>
			<p>Les clés que vous ne fournissez pas retombent normalement sur les valeurs par défaut, donc un remplacement partiel convient.</p>

			<h2 id="language-specific-matching">Correspondance propre à chaque langue</h2>
			<p>
				Cinq règles jugent le texte d’après des expressions connues : elles embarquent donc des
				listes de mots en plus des messages : <code>link-name-quality</code> (« <span lang="en">click here</span> »,
				« <span lang="ja">こちら</span> »), <code>heading-quality</code> (« <span lang="en">Untitled</span> »,
				« <span lang="ja">見出し</span> »), <code>form-control-label-quality</code>{" "}
				(« <span lang="en">Label</span> », « <span lang="ja">入力欄</span> »),{" "}
				<code>page-title-patterns</code> (« <span lang="en">Home</span> »,
				« <span lang="ja">トップページ</span> ») et <code>media-alternative-transcript-evidence</code>{" "}
				(« <span lang="en">transcript</span> », « <span lang="ja">文字起こし</span> »). Chaque liste
				couvre <code>en</code>, <code>de</code>, <code>es</code>, <code>fr</code> et <code>ja</code>.
				La règle <code>skip-link</code> reconnaît la formulation des liens d’évitement dans ces
				mêmes cinq langues.
			</p>
			<p>
				L’anglais est toujours vérifié. La liste de la langue de l’élément, tirée de l’attribut{" "}
				<code>lang</code> le plus proche (celui de l’élément <code>&lt;html&gt;</code> pour un titre
				de page), s’y ajoute. <code>link-name-quality</code> vérifie les listes de toutes les
				langues là où aucun <code>lang</code> n’est déclaré dans l’arbre au-dessus du lien, puisque
				le lien peut être dans n’importe laquelle. Vérifier toutes les listes partout signalerait des mots génériques
				dans une langue et de vrais noms dans une autre, comme « Suite » ou « Plus » sur une page en
				anglais. Les mots de transcription font exception : ils sont distinctifs dans toutes les
				langues et une page peut lier une transcription dans une autre langue, ils sont donc
				toujours tous vérifiés. Le texte est d’abord normalisé en NFKC, si bien que les formes
				pleine chasse comme « <span lang="ja">見出し２</span> » correspondent.
			</p>
			<p>
				<code>page-title-patterns</code> compte aussi chaque caractère chinois, japonais ou coréen
				pour deux lorsqu’il décide si un titre est trop court, puisque
				« <span lang="ja">お問い合わせ</span> » est un titre complet en six caractères.
			</p>

			<h2>Où les clés sont utilisées</h2>
			<p>Plusieurs espaces de noms de clés, tous résolus de la même façon :</p>
			<ul>
				<li>
					<strong>Au niveau de la règle</strong> : <code>meta.i18n.titleKey</code> / <code>meta.i18n.descriptionKey</code>{" "}
					résolvent le <code>title</code>/<code>description</code> d’une règle dans chaque entrée
					de <code>checksResults[]</code>.
				</li>
				<li>
					<strong>Rapport HTML</strong> : les clés <code>report_*</code> étiquettent la page que
					produit <code>@surea11y/core/report</code> : titres, colonnes des tableaux, noms des
					résultats et des gravités, phrase de synthèse, pagination. Le rapport les lit dans la
					langue retenue pour l’analyse : un dictionnaire traduit donc aussi le rapport.
				</li>
				<li>
					<strong>Au niveau des composites</strong> : le <code>title</code>/<code>description</code>{" "}
					de chaque agrégation de <code>rulesResults[]</code>, avec le nom publié du critère de
					succès dans chaque langue.
				</li>
				<li>
					<strong>Au niveau de l’occurrence</strong> : <code>i18n.summaryKey</code> / <code>i18n.hintKey</code>,
					avec <code>i18n.params</code> pour l’interpolation de <code>{"{{placeholder}}"}</code>,
					résolvent le <code>summary</code>/<code>hint</code> d’une occurrence.{" "}
					<code>i18n.whyKey</code> / <code>i18n.cautionKey</code> résolvent de la même façon le{" "}
					<code>why</code> et le <code>caution</code> d’une tendance. Voir{" "}
					<a href="/results-reports/output-schema/">le schéma de sortie</a>.
				</li>
				<li>
					<strong>Revue</strong> : <code>{"<prefix>_review_<CODE>_step<n>"}</code>,{" "}
					<code>_pass</code> et <code>_fail</code>, dans{" "}
					<a href="#review-dictionaries">les dictionnaires de revue</a> : le{" "}
					<code>howToCheck</code> d’une occurrence indécise.
				</li>
			</ul>
			<p>
				Les clés de la règle, de la règle composite et de l’occurrence figurent dans le résultat à côté du texte déjà résolu, ce qui vous permet de
				réafficher un résultat enregistré dans une autre langue sans relancer l’analyse.
			</p>
		</>
	);
}
