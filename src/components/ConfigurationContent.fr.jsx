import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Chaque runner accepte le même objet <code>engineOptions</code> tout simple : pas de fichier
				de configuration à maintenir, pas d’ensemble de flags propre à la CLI à garder synchronisé.
				La CLI et chaque binding construisent cet objet pour vous à partir de leurs propres flags ou
				méthodes de builder, donc ce que vous apprenez ici s’applique partout où vous lancez une
				analyse. Quatre points méritent d’être bien réglés dès le départ :
			</p>

			<h2>Options du moteur</h2>
			<p>
				Limitez une analyse exactement aux règles voulues, en nommant une version et un niveau WCAG
				(WCAG 2.2 AA en une seule option, avec les bonnes pratiques en plus si vous le souhaitez),
				par identifiant, par tag, ou en nommant un profil de conformité comme WCAG 2.2 AA ou
				Section 508, pour qu’une exécution rapporte ce dont vous êtes réellement responsable, ni
				plus ni moins. Les profils EN 301 549 de core fonctionnent encore mais sont obsolètes :
				cette norme est désormais fournie sous forme{" "}
				<a href="/configuration/packs/#en-301-549-pack">de pack</a>. N’exécutez que quelques vérifications tout en
				obtenant les critères WCAG auxquels elles appartiennent, au niveau qui vous est demandé, et
				listez ce qu’une analyse rapportera avant de la lancer. Faites taire des widgets connus pour être bruyants,
				globalement ou pour une seule règle, sans perdre la couverture ailleurs, ajustez le degré d’exigence
				des vérifications de contraste selon qu’elles servent un auditeur humain ou un contrôle de CI
				sans surveillance, et ajoutez une règle propre à votre organisation à côté des règles
				intégrées quand le catalogue ne couvre pas un point qui vous importe, et donnez aux règles
				le CSS d’une feuille de style d’une autre origine que la page ne peut pas lire. Voir{" "}
				<a href="/configuration/engine-options/">Options du moteur</a> pour la référence complète.
			</p>

			<h2>Packs</h2>
			<p>
				Testez au-delà des WCAG sans forker le moteur. Un pack apporte une norme nationale, la
				politique d’accessibilité de votre organisation ou quelques règles maison depuis un paquet
				qui lui est propre, et le moteur l’exécute comme ses propres règles : ses profils
				choisissent ce qui s’exécute, chacun des points de sa liste de contrôle revient sous la forme d’un
				résultat, et chaque rapport les affiche à côté des critères WCAG. Le même pack fonctionne
				depuis Node, chaque binding, test-matchers et la CLI, et{" "}
				<code>npx surea11y-pack new</code> en génère un qui réussit ses propres tests tel quel. Une
				norme peut classer les constats d’une règle sous les exigences auxquelles ils
				appartiennent, et une règle de pack peut dire à une personne comment trancher ce qu’elle
				laisse ouvert. Voir{" "}
				<a href="/configuration/packs/">Packs</a> pour en utiliser un ou en écrire un.
			</p>

			<h2>Intégration CI</h2>
			<p>
				Mettez en place un contrôle d’accessibilité fonctionnel dans votre pipeline sans l’écrire
				de zéro : des modèles <span lang="en">GitHub Actions</span> et <span lang="en">Bitbucket Pipelines</span> prêts à copier font échouer un
				build selon le code de sortie de la CLI, enregistrent une baseline des violations déjà
				présentes sur un site existant pour n’échouer que sur les nouvelles, et envoient les
				résultats SARIF directement dans <span lang="en">GitHub Code Scanning</span>, là où votre équipe regarde déjà. Des recettes pour GitLab CI et Azure DevOps placent
				les résultats dans leurs propres vues de tests, au format JUnit, écrit par la CLI dans la
				même étape, et un rapport JUnit peut transformer en échecs les constats non tranchés qui
				penchent vers l’échec, pour qu’un échec probable ne passe pas pour un test ignoré. Voir{" "}
				<a href="/configuration/ci-integration/">Intégration CI</a> pour les modèles complets.
			</p>

			<h2>Langues</h2>
			<p>
				Livrez des résultats exploitables par votre équipe dans la langue qu’elle lit le plus vite :
				chaque titre de règle, ainsi que le résumé et l’indication de chaque occurrence, est résolu
				à partir d’un dictionnaire à clés, avec un repli chaîne par chaîne vers l’anglais plutôt
				qu’un texte vide ou une erreur. Cinq langues sont disponibles aujourd’hui (anglais,
				français, allemand, espagnol, japonais), et un résultat indique toujours exactement quelle langue il a
				utilisée, pour que rien ne se dégrade en silence à votre insu. Les étapes pour trancher un
				constat ouvert (« Comment vérifier ») existent dans les mêmes cinq langues. Voir{" "}
				<a href="/configuration/locales/">Langues</a> pour la couverture et la façon de
				fournir votre propre dictionnaire.
			</p>
		</>
	);
}
