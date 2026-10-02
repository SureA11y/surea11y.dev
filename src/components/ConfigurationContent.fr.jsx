import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Chaque runner accepte le même objet <code>engineOptions</code> tout simple : pas de fichier
				de configuration à maintenir, pas d’ensemble de flags propre à la CLI à garder synchronisé.
				La CLI et chaque binding construisent cet objet pour vous à partir de leurs propres flags ou
				méthodes de builder, donc ce que vous apprenez ici s’applique partout où vous lancez une
				analyse. Trois points méritent d’être bien réglés dès le départ :
			</p>

			<h2>Options du moteur</h2>
			<p>
				Limitez une analyse exactement aux règles voulues, par identifiant, par tag ou par version
				de conformité WCAG (2.0, 2.1 ou 2.2), ou en nommant un profil de conformité comme WCAG 2.2 AA,
				EN 301 549 ou Section 508, pour qu’une exécution rapporte ce dont vous êtes
				réellement responsable, ni plus ni moins. Faites taire des widgets connus pour être bruyants,
				globalement ou pour une seule règle, sans perdre la couverture ailleurs, ajustez le degré d’exigence
				des vérifications de contraste selon qu’elles servent un auditeur humain ou un contrôle de CI
				sans surveillance, et ajoutez une règle propre à votre organisation à côté des règles
				intégrées quand le catalogue ne couvre pas un point qui vous importe. Voir{" "}
				<a href="/configuration/engine-options/">Options du moteur</a> pour la référence complète.
			</p>

			<h2>Intégration CI</h2>
			<p>
				Mettez en place un contrôle d’accessibilité fonctionnel dans votre pipeline sans l’écrire
				de zéro : des modèles <span lang="en">GitHub Actions</span> et <span lang="en">Bitbucket Pipelines</span> prêts à copier font échouer un
				build selon le code de sortie de la CLI, enregistrent une baseline des violations déjà
				présentes sur un site existant pour n’échouer que sur les nouvelles, et envoient les
				résultats SARIF directement dans <span lang="en">GitHub Code Scanning</span>, là où votre équipe regarde déjà. Des recettes pour GitLab CI et Azure DevOps placent
				les résultats dans leurs propres vues de tests, au format JUnit. Voir{" "}
				<a href="/configuration/ci-integration/">Intégration CI</a> pour les modèles complets.
			</p>

			<h2>Langues</h2>
			<p>
				Livrez des résultats exploitables par votre équipe dans la langue qu’elle lit le plus vite :
				chaque titre de règle, ainsi que le résumé et l’indication de chaque occurrence, est résolu
				à partir d’un dictionnaire à clés, avec un repli chaîne par chaîne vers l’anglais plutôt
				qu’un texte vide ou une erreur. Cinq langues sont disponibles aujourd’hui (anglais,
				français, allemand, espagnol, japonais), et un résultat indique toujours exactement quelle langue il a
				utilisée, pour que rien ne se dégrade en silence à votre insu. Voir{" "}
				<a href="/configuration/locales/">Langues</a> pour la couverture et la façon de
				fournir votre propre dictionnaire.
			</p>
		</>
	);
}
